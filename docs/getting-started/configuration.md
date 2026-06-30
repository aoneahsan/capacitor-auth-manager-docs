---
id: configuration
title: Configuration
sidebar_label: Configuration
description: The full auth.configure() shape for capacitor-auth-manager — providers, persistence, token refresh, logging, and pluggable secure storage.
---

# Configuration

`auth.configure()` (and `auth.initialize()`) accept one `AuthManagerConfig` object. Every field is optional; you typically set `providers` plus a couple of globals. Calling `configure` more than once merges into the existing config, so you can register providers incrementally.

:::info Google-first (2.4.x)
Only Google is enabled today, so the `providers` map below configures Google. Adding another provider id does not make it work yet — `auth.signIn()` with a non-Google id throws `AuthErrorCode.PROVIDER_NOT_ENABLED`. Use the [`AuthProvider` enum](/api/types#authprovider) (recommended); the string `'google'` also works.
:::

```typescript
import { auth, AuthProvider } from 'capacitor-auth-manager';

auth.configure({
  providers: {
    [AuthProvider.GOOGLE]: {
      clientId: 'YOUR_WEB_OAUTH_CLIENT_ID',        // web + Android serverClientId fallback
      serverClientId: 'YOUR_WEB_OAUTH_CLIENT_ID',  // REQUIRED on Android for an idToken
      iosClientId: 'YOUR_IOS_OAUTH_CLIENT_ID',     // iOS (or GIDClientID in Info.plist)
      scopes: ['email', 'profile'],
    },
  },
  persistence: 'local',
  autoRefreshToken: true,
  tokenRefreshBuffer: 300000,
  enableLogging: true,
  logLevel: 'warn',
});
```

## AuthManagerConfig

| Field | Type | Default | Purpose |
| --- | --- | --- | --- |
| `providers` | `Record<string, ProviderOptions>` | — | Map of provider id → that provider's typed options. The key is the id you later pass to `signIn`. |
| `persistence` | `'local' \| 'session' \| 'memory'` | `'local'` | Where the session is stored on web. `'memory'` keeps it in memory only (cleared on reload). |
| `autoRefreshToken` | `boolean` | `false` | When a credential carries a refresh token and expiry, schedule a refresh before it expires. |
| `tokenRefreshBuffer` | `number` (ms) | `300000` (5 min) | How long before expiry to refresh. The scheduler clamps long delays to the 32-bit `setTimeout` ceiling. |
| `enableLogging` | `boolean` | `false` | Turn the internal logger on. |
| `logLevel` | `'debug' \| 'info' \| 'warn' \| 'error'` | `'info'` | Verbosity once logging is enabled. The shared logger also reads `VITE_LOG_LEVEL` / `LOG_LEVEL` at build time. |
| `storage` | `StorageInterface` | `WebStorage` (localStorage) | A custom storage backend. See below. |

## Persistence

`'local'` uses `localStorage` (survives reload and tab close), `'session'` uses `sessionStorage` (cleared when the tab closes), and `'memory'` keeps state in memory only. Changing persistence at runtime recreates the storage backend; a no-op re-`configure` does not discard in-memory state.

## Secure storage

The default web storage is `localStorage`, which any XSS or third-party script on the origin can read. On native, inject a secure backend so tokens live in native key-value storage instead of the webview:

```typescript
import { auth, CapacitorPreferencesStorage } from 'capacitor-auth-manager';

auth.configure({
  storage: new CapacitorPreferencesStorage(), // requires the optional @capacitor/preferences peer
  providers: { google: { clientId: 'YOUR_CLIENT_ID' } },
});
```

Capacitor Preferences is not hardware-encrypted. For secrecy at rest, supply your own Keychain/Keystore-backed `StorageInterface`. See the [storage reference](/api/storage).

## Per-provider options

Each provider id under `providers` takes its own typed options interface. Today that means `GoogleAuthOptions` (`clientId`, `serverClientId`, `iosClientId`, `scopes`, `hostedDomain`, `loginHint`, `filterByAuthorizedAccounts`, `autoSelectEnabled`, `nonce`) — see the [Google provider page](/providers/google) for the full table. The other providers' option interfaces exist in the types but their providers are not enabled yet.

## Related

- [Provider overview](/providers/overview)
- [API reference — the auth singleton](/api/auth-singleton)
- [Types reference](/api/types)
- [Storage reference](/api/storage)
