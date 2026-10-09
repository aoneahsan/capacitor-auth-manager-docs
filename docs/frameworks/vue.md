---
id: vue
title: Vue 3 composables
sidebar_label: Vue
description: Use capacitor-auth-manager in Vue 3 with the useAuth, useAuthState, useUser, useAuthProvider, and useAuthConfig composables — reactive refs, no plugin to install.
---

# Vue 3 composables

The Vue adapter exposes Composition API composables that wrap the shared `auth` singleton and expose its state as reactive refs. Import them from the `/vue` entry point.

```typescript
import { useAuth } from 'capacitor-auth-manager/vue';
```

## No plugin or provider needed

There is nothing to register with `app.use(...)`. The composables read from the global `auth` singleton, so any component can call them directly. Each composable subscribes on setup and unsubscribes automatically in `onUnmounted`.

## Usage example

```vue
<script setup lang="ts">
import { useAuth, AuthProvider } from 'capacitor-auth-manager/vue';

const { user, signIn, signOut, isLoading, error } = useAuth();

async function handleGoogleSignIn() {
  try {
    await signIn(AuthProvider.GOOGLE);
  } catch {
    // error is also exposed via the returned `error` ref
  }
}
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="user">
    <p>Welcome, {{ user.displayName }}!</p>
    <button @click="signOut()">Sign Out</button>
  </div>
  <div v-else>
    <button @click="handleGoogleSignIn">Sign In with Google</button>
    <p v-if="error" role="alert">{{ error.message }}</p>
  </div>
</template>
```

The state values (`user`, `isLoading`, `isAuthenticated`, `provider`, `error`) are reactive refs — in `<template>` they unwrap automatically; in `<script>` read them via `.value`.

:::info Google-first (3.x)
Google is the only enabled provider; `signIn` with another id throws `AuthErrorCode.PROVIDER_NOT_ENABLED`. The adapter re-exports `AuthProvider` (recommended); the string `'google'` also works.
:::

## Composables

| Composable | Purpose | Returns |
| --- | --- | --- |
| `useAuth()` | Full reactive state plus every action method | `UseAuthReturn` |
| `useAuthState()` | Read-only reactive state, no methods | `UseAuthStateReturn` |
| `useUser()` | Just the current user, as a computed ref | `ComputedRef<AuthUser \| null>` |
| `useAuthProvider(provider)` | Per-provider support/config refs plus scoped `signIn`/`signOut` | `UseAuthProviderReturn` |
| `useAuthConfig()` | Configure and initialize the manager | `{ configure, isInitialized, error }` |

### `useAuth()` returns

Readonly refs `user`, `isLoading`, `isAuthenticated`, `provider`, and `error` (`Readonly<Ref<...>>`), plus the action methods:

- `signIn(providerOrOptions: string | SignInOptions)` → `Promise<AuthResult>`
- `signOut(options?: SignOutOptions)` → `Promise<void>`
- `refreshToken(provider?: string)` → `Promise<AuthResult>`
- `linkAccount(options: LinkAccountOptions)` → `Promise<AuthResult>`
- `unlinkAccount(options: UnlinkAccountOptions)` → `Promise<void>`
- `revokeAccess(token?: string, provider?: string)` → `Promise<void>`
- `getIdToken(options?: GetIdTokenOptions)` → `Promise<string>`
- `updateProfile(options: UpdateProfileOptions)` → `Promise<AuthUser>`
- `deleteAccount(options?: DeleteAccountOptions)` → `Promise<void>`

### `useAuthProvider(provider)` returns

`isSupported` and `isConfigured` (readonly refs), a no-argument `signIn()` → `Promise<AuthResult>`, `signOut(options?)` → `Promise<void>`, and an `error` ref.

### `useAuthConfig()` returns

`configure(config: AuthManagerConfig)` (calls `auth.configure()` then `auth.initialize()`), an `isInitialized` readonly ref, and an `error` ref:

```vue
<script setup lang="ts">
import { useAuthConfig } from 'capacitor-auth-manager/vue';

const { configure } = useAuthConfig();
configure({ providers: { google: { clientId: 'YOUR_CLIENT_ID' } } });
</script>
```

## Account management

`useAuth()` surfaces the same account-management methods as the singleton: `linkAccount`, `unlinkAccount`, `revokeAccess`, `getIdToken`, `updateProfile`, and `deleteAccount`. Each delegates to the active provider and throws `AuthErrorCode.OPERATION_NOT_ALLOWED` when the provider does not implement it.

## Related

- [Quick start](/getting-started/quick-start)
- [The auth singleton](/api/auth-singleton)
- [Providers overview](/providers/overview)
