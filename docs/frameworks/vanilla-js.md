---
id: vanilla-js
title: Vanilla JavaScript
sidebar_label: Vanilla JS
description: Use the capacitor-auth-manager auth singleton in plain JavaScript or TypeScript with no framework — configure providers, sign in, and subscribe to auth state changes.
---

# Vanilla JavaScript

The `auth` singleton is the framework-agnostic entry point to capacitor-auth-manager. Import it from the package root and call its methods directly — there is no provider, context, or wrapper to set up. The React, Vue, and Angular adapters are thin layers over this same singleton.

```typescript
import { auth } from 'capacitor-auth-manager';
```

The singleton auto-initializes the first time it is used in a browser, so you can call `auth.configure(...)` and `auth.signIn(...)` without any explicit bootstrap.

## Usage example

```typescript
import { auth, AuthProvider } from 'capacitor-auth-manager';

// 1. Configure Google (the enabled provider in 2.5.x; other ids throw PROVIDER_NOT_ENABLED)
auth.configure({
  providers: {
    [AuthProvider.GOOGLE]: {
      clientId: 'YOUR_WEB_OAUTH_CLIENT_ID',
      serverClientId: 'YOUR_WEB_OAUTH_CLIENT_ID', // required on Android for an idToken
    },
  },
});

// 2. Subscribe to auth state changes. The listener is called immediately
//    with the current state, then again on every change. The returned
//    function unsubscribes.
const unsubscribe = auth.onAuthStateChange((state) => {
  const button = document.querySelector('#login-button');
  if (!button) return;
  button.textContent = state.isAuthenticated
    ? `Sign out (${state.user?.displayName ?? ''})`
    : 'Sign in with Google';
});

// 3. Wire a button to sign in / sign out
document.querySelector('#login-button')?.addEventListener('click', async () => {
  try {
    if (auth.isAuthenticated()) {
      await auth.signOut();
    } else {
      const result = await auth.signIn(AuthProvider.GOOGLE);
      console.log('Signed in:', result.user.email);
      // Hand result.credential.idToken to Firebase via signInWithCredential.
    }
  } catch (error) {
    console.error('Auth failed:', error);
  }
});

// Later, when tearing down:
unsubscribe();
```

## Auth state shape

`auth.getAuthState()` returns, and `onAuthStateChange` emits, an `AuthState` object:

```typescript
interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  provider: string | null;
}
```

`AuthState` carries no raw tokens. Read an ID token with `auth.getIdToken()` and refresh with `auth.refreshToken()`.

## Core singleton members

| Member | Purpose | Returns |
| --- | --- | --- |
| `configure(config)` | Set providers and global options | `void` |
| `initialize(config?)` | Restore persisted session; usually automatic | `Promise<void>` |
| `signIn(providerOrOptions)` | Sign in by provider id string or `SignInOptions` | `Promise<AuthResult>` |
| `signOut(options?)` | Sign out of the active or named provider | `Promise<void>` |
| `refreshToken(provider?)` | Refresh the active or named provider's token | `Promise<AuthResult>` |
| `getAuthState()` | Current `AuthState` snapshot | `AuthState` |
| `getCurrentUser()` | Current user, synchronously | `AuthUser \| null` |
| `isAuthenticated()` | Current auth status, synchronously | `boolean` |
| `getCurrentProvider()` | Active provider id, synchronously | `string \| null` |
| `onAuthStateChange(listener)` | Subscribe to state changes (fires immediately) | `() => void` (unsubscribe) |
| `getAvailableProviders()` | All registered provider ids | `Promise<string[]>` |
| `getSupportedProviders()` | Providers supported on this platform | `Promise<string[]>` |
| `isProviderSupported(provider)` | Whether a provider is supported here | `Promise<boolean>` |
| `isProviderConfigured(name)` | Whether a provider was passed to `configure()` | `boolean` |
| `getConfiguredProviders()` | Names of configured providers | `string[]` |

## Account management

The singleton also exposes account-management methods that delegate to the active provider. An unsupported provider throws `AuthErrorCode.OPERATION_NOT_ALLOWED`:

- `linkAccount(options)` → `Promise<AuthResult>`
- `unlinkAccount(options)` → `Promise<void>`
- `revokeAccess(token?, provider?)` → `Promise<void>`
- `getIdToken(options?)` → `Promise<string>`
- `updateProfile(options)` → `Promise<AuthUser>`
- `deleteAccount(options?)` → `Promise<void>`

## Related

- [Quick start](/getting-started/quick-start)
- [The auth singleton](/api/auth-singleton)
- [Providers overview](/providers/overview)
