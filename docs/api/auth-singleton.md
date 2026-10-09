---
id: auth-singleton
title: The auth singleton
sidebar_label: auth singleton
description: Complete API reference for the auth singleton in capacitor-auth-manager — every method for configuration, sign-in, state, tokens, and account management.
---

# The `auth` singleton

`auth` is the single, framework-agnostic entry point for every authentication operation in capacitor-auth-manager. You import one shared instance and call methods on it directly — there is no class to construct and no context provider to mount.

```typescript
import { auth } from 'capacitor-auth-manager';
```

On the web, the singleton auto-initializes the first time it is constructed (when `window` exists). You still call `configure()` to register providers. The React, Vue, and Angular adapters all wrap this same singleton, so every method below is reachable from any framework.

`AuthState` is `{ user, isLoading, isAuthenticated, provider }` — it does not carry raw tokens. Read tokens with `getIdToken()`.

:::info Google-first (3.x)
The method surface below is the full API, but only **Google** is enabled right now. Calls that target a non-Google provider — `signIn`, `linkAccount`, etc. — throw `AuthErrorCode.PROVIDER_NOT_ENABLED`. The non-Google examples on this page illustrate the call shape for when those providers are re-enabled. Use the `AuthProvider` enum (e.g. `AuthProvider.GOOGLE`); the string `'google'` also works.
:::

## Prepare the Google SDK

Call `await auth.prepare(AuthProvider.GOOGLE)` during browser bootstrap, after configuration and before enabling sign-in buttons. It initializes the provider without prompting. Keep sign-in in a direct user click handler.

## Configuration

### `configure(config)`

Merges provider definitions and global options into the singleton. Synchronous. This is the usual setup call. If `config.providers` is non-empty it also re-attempts session restore, so a persisted session is rehydrated even when the singleton auto-initialized before `configure()` ran.

```typescript
configure(config: AuthManagerConfig): void
```

```typescript
auth.configure({
  providers: { google: { clientId: 'YOUR_CLIENT_ID' } },
  persistence: 'local',
  autoRefreshToken: true,
});
```

### `initialize(config?)`

Asynchronous initialization: merges optional config, configures the logger and storage, and restores any persisted auth state. Calling it without a config when already initialized is a no-op; concurrent first-time calls are coalesced so state restore runs once.

```typescript
initialize(config?: AuthManagerConfig): Promise<void>
```

## Sign-in and sign-out

### `signIn(providerOrOptions)`

Signs the user in with a configured provider. Accepts either a provider id string or a `SignInOptions` object (whose `credentials` and `options` are forwarded to the provider). Resolves to an `AuthResult` and updates `AuthState`.

```typescript
signIn(providerOrOptions: string | SignInOptions): Promise<AuthResult>
```

Throws an `AuthError` with code `auth/missing-configuration` when the named provider was never passed to `configure()`. Any provider-thrown error is normalized through `AuthError.fromError`.

```typescript
import { auth, AuthProvider } from 'capacitor-auth-manager';

const result = await auth.signIn(AuthProvider.GOOGLE);

// Object form (roadmap shape — non-Google providers throw PROVIDER_NOT_ENABLED in 3.x):
await auth.signIn({
  provider: 'email-password',
  credentials: { email: 'user@example.com', password: 'secret' },
});
```

### `signOut(options?)`

Signs out of the active provider, or of `options.provider` when supplied. Clears stored session state and refresh timers. With no specific provider, all refresh timers are cleared. A no-op (logs a warning) when there is no active session.

```typescript
signOut(options?: SignOutOptions): Promise<void>
```

## State

All four readers below are synchronous and reflect the in-memory state.

```typescript
getCurrentUser(): AuthUser | null      // the signed-in user, or null
getAuthState(): AuthState              // a shallow copy of { user, isLoading, isAuthenticated, provider }
isAuthenticated(): boolean             // convenience for state.isAuthenticated
getCurrentProvider(): string | null    // id of the active provider, or null
```

### `onAuthStateChange(listener)`

Subscribes to auth-state changes. The listener is invoked immediately with the current state, then on every change. Returns an unsubscribe function.

```typescript
onAuthStateChange(listener: AuthStateListener): () => void
```

```typescript
const unsubscribe = auth.onAuthStateChange((state) => {
  console.log(state.isAuthenticated, state.user?.email);
});
// later: unsubscribe();
```

## Tokens

### `refreshToken(provider?)`

Refreshes the session for the active provider (or the named one). Resolves to a fresh `AuthResult` and updates the stored user.

```typescript
refreshToken(provider?: string): Promise<AuthResult>
```

Throws `auth/no-auth-session` when there is no session, and `auth/operation-not-supported` when the resolved provider does not implement refresh. (Note: `auth/operation-not-supported` is a string code, not a member of the `AuthErrorCode` enum.)

### `getIdToken(options?)`

Returns the current ID token for the active provider (or `options.provider`), delegating to the provider's `getIdToken`. The library does not verify ID-token signatures in the browser — verify the token on your server.

```typescript
getIdToken(options?: GetIdTokenOptions): Promise<string>
```

Throws `AuthErrorCode.NO_AUTH_SESSION` with no session, and `AuthErrorCode.OPERATION_NOT_ALLOWED` when the provider does not expose ID tokens.

```typescript
const idToken = await auth.getIdToken({ forceRefresh: true });
```

## Account management

Each method delegates to the active provider. A provider that does not implement the operation throws an `AuthError` with code `AuthErrorCode.OPERATION_NOT_ALLOWED`; calling one with no active session throws `AuthErrorCode.NO_AUTH_SESSION`.

```typescript
linkAccount(options: LinkAccountOptions): Promise<AuthResult>
unlinkAccount(options: UnlinkAccountOptions): Promise<void>
revokeAccess(token?: string, provider?: string): Promise<void>
updateProfile(options: UpdateProfileOptions): Promise<AuthUser>
deleteAccount(options?: DeleteAccountOptions): Promise<void>
```

```typescript
await auth.linkAccount({ provider: 'facebook' }); // roadmap shape — non-Google ids throw PROVIDER_NOT_ENABLED in 3.x
await auth.updateProfile({ displayName: 'New Name' });
await auth.revokeAccess();
await auth.deleteAccount(); // also clears local session + timers
```

## Provider introspection

```typescript
isProviderConfigured(name: string): boolean        // was this provider passed to configure()?
getConfiguredProviders(): string[]                 // names supplied to configure()/initialize()
getAvailableProviders(): Promise<string[]>         // providers usable in the current environment
getSupportedProviders(): Promise<string[]>         // enabled registered providers (Google only)
isProviderSupported(provider: string): Promise<boolean>
```

```typescript
if (auth.isProviderConfigured('google')) {
  await auth.signIn('google');
}
```

## Lifecycle

### `dispose()`

Tears the singleton down: clears all refresh timers, clears registered providers, and removes all state listeners. Synchronous.

```typescript
dispose(): void
```

## Related

- [Quick start](/getting-started/quick-start)
- [Providers overview](/providers/overview)
