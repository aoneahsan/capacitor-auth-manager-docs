---
id: storage
title: Storage backends
sidebar_label: Storage
description: Reference for StorageInterface, WebStorage, and CapacitorPreferencesStorage in capacitor-auth-manager, plus how to inject a custom secure storage adapter.
---

# Storage backends

capacitor-auth-manager persists the active session through a small, swappable storage abstraction. By choosing or injecting a backend you control where tokens live — which matters because the default web backend is `localStorage`, readable by any script on the origin.

```typescript
import {
  WebStorage,
  CapacitorPreferencesStorage,
  type StorageInterface,
} from 'capacitor-auth-manager';
```

## `StorageInterface`

The contract every backend implements. Values are JSON-serialized on write and parsed on read; the read methods are generic so call sites can narrow the result.

```typescript
interface StorageInterface {
  get<T = unknown>(key: string): Promise<T | null>;
  set<T = unknown>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}
```

`get` defaults `T` to `unknown` (not `any`), so untyped callers must narrow before use. The manager stores the session under a single key (`auth_state`) namespaced with a prefix.

## `WebStorage`

The default backend, constructed automatically by the singleton. It wraps the browser's `Storage` and supports three persistence modes.

```typescript
new WebStorage(
  persistence: AuthPersistence = AuthPersistence.LOCAL,
  prefix = 'cap_auth_',
  logger?: Logger
);
```

| Persistence | Backing store |
|-------------|---------------|
| `AuthPersistence.LOCAL` (default) | `window.localStorage` |
| `AuthPersistence.SESSION` | `window.sessionStorage` |
| `AuthPersistence.NONE` | in-memory (cleared on reload) |

The config's `persistence: 'memory'` maps to `AuthPersistence.NONE`. Reads tolerate non-JSON values (they fall back to the raw string), and storage failures are logged through the package logger rather than thrown for reads.

:::warning localStorage is readable by XSS
`localStorage` (and `sessionStorage`) are accessible to any JavaScript on the origin, including injected or third-party scripts. Tokens stored there are exposed to cross-site-scripting attacks. On native, inject a more secure backend (below). For secrecy at rest, back storage with a Keychain/Keystore adapter.
:::

## `CapacitorPreferencesStorage`

A backend for native apps, backed by `@capacitor/preferences` (iOS `UserDefaults` / Android `SharedPreferences`). It keeps tokens out of the webview's `localStorage`, which is the right default for Capacitor apps. The `@capacitor/preferences` package is an **optional peer** — install it only when you use this backend; it is lazily imported on first use.

```typescript
new CapacitorPreferencesStorage(prefix = 'cap_auth_');
```

:::note Not hardware-encrypted
Capacitor Preferences is plain key-value storage, not hardware-encrypted. For secrecy at rest (encryption tied to the secure enclave / keystore), supply a Keychain/Keystore-backed `StorageInterface` instead.
:::

## Injecting a backend

Pass any `StorageInterface` as `storage` to `configure()` (or `initialize()`). A custom backend takes precedence over the `persistence` option.

```typescript
import { auth, CapacitorPreferencesStorage } from 'capacitor-auth-manager';

auth.configure({
  storage: new CapacitorPreferencesStorage(),
  providers: { google: { clientId: 'YOUR_CLIENT_ID' } },
});
```

## Writing a custom secure adapter

Implement the four methods over any secure store (for example a Keychain/Keystore plugin). Keep `get` and `set` JSON-aware so the manager can round-trip the session object.

```typescript
import type { StorageInterface } from 'capacitor-auth-manager';
import { SecureStoragePlugin } from 'your-secure-storage-plugin';

export class SecureStorage implements StorageInterface {
  constructor(private prefix = 'cap_auth_') {}

  async get<T = unknown>(key: string): Promise<T | null> {
    try {
      const { value } = await SecureStoragePlugin.get({ key: this.prefix + key });
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  }

  async set<T = unknown>(key: string, value: T): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await SecureStoragePlugin.set({ key: this.prefix + key, value: stringValue });
  }

  async remove(key: string): Promise<void> {
    await SecureStoragePlugin.remove({ key: this.prefix + key });
  }

  async clear(): Promise<void> {
    // Remove only this package's keys (those starting with `this.prefix`).
  }
}
```

```typescript
auth.configure({ storage: new SecureStorage() });
```

## Related

- [Quick start](/getting-started/quick-start)
- [Providers overview](/providers/overview)
