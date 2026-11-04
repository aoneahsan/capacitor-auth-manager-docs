---
id: react
title: React hooks
sidebar_label: React
description: Use capacitor-auth-manager in React with the useAuth, useAuthState, useAuthProvider, useUser, and useIsAuthenticated hooks — no context provider required.
---

# React hooks

The React adapter exposes hooks that subscribe to the shared `auth` singleton and re-render your components on auth state changes. Import them from the `/react` entry point.

```tsx
import { useAuth } from 'capacitor-auth-manager/react';
```

## No context provider needed

There is nothing to wrap your app in. The hooks read from the global `auth` singleton (the design works like Zustand), so you can call them in any component without an `<AuthProvider>` ancestor. Configure providers once at startup with `auth.configure(...)`.

For Firebase-backed apps, use Firebase’s `onAuthStateChanged` for application session state and hand off Google credentials explicitly. See the [React/Firebase integration guide](/integration/ai). These hooks reflect the package’s Google session.

## Usage example

```tsx
import { useAuth, AuthProvider } from 'capacitor-auth-manager/react';

function LoginButton() {
  const { user, signIn, signOut, isLoading, error } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (user) {
    return (
      <div>
        <p>Welcome, {user.displayName}!</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => signIn(AuthProvider.GOOGLE)}>Sign In with Google</button>
      {error && <p role="alert">{error.message}</p>}
    </div>
  );
}
```

:::info Google-first (3.x)
Google is the only enabled provider; `signIn` with another id throws `AuthErrorCode.PROVIDER_NOT_ENABLED`. The adapter re-exports `AuthProvider` (recommended); the string `'google'` also works.
:::

## Hooks

| Hook | Purpose | Returns |
| --- | --- | --- |
| `useAuth()` | Full auth state plus every action (sign in/out, token, account management) | `UseAuthReturn` |
| `useAuthState()` | Read-only auth state, no action methods | `UseAuthStateReturn` |
| `useAuthProvider(provider)` | Per-provider support/config flags plus scoped `signIn`/`signOut` | `UseAuthProviderReturn` |
| `useUser()` | Just the current user (derived from `useAuthState`) | `AuthUser \| null` |
| `useIsAuthenticated()` | Just the boolean auth status (derived from `useAuthState`) | `boolean` |

### `UseAuthReturn`

```typescript
interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  provider: string | null;
  signIn: (providerOrOptions: string | SignInOptions) => Promise<AuthResult>;
  signOut: (options?: SignOutOptions) => Promise<void>;
  refreshToken: (provider?: string) => Promise<AuthResult>;
  linkAccount: (options: LinkAccountOptions) => Promise<AuthResult>;
  unlinkAccount: (options: UnlinkAccountOptions) => Promise<void>;
  revokeAccess: (token?: string, provider?: string) => Promise<void>;
  getIdToken: (options?: GetIdTokenOptions) => Promise<string>;
  updateProfile: (options: UpdateProfileOptions) => Promise<AuthUser>;
  deleteAccount: (options?: DeleteAccountOptions) => Promise<void>;
  error: Error | null;
}
```

The action methods set the hook's `error` state on failure and re-throw, so you can either read `error` or use a local `try/catch`.

### `UseAuthStateReturn`

```typescript
interface UseAuthStateReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  provider: string | null;
}
```

### `UseAuthProviderReturn`

```typescript
interface UseAuthProviderReturn {
  isSupported: boolean;
  isConfigured: boolean;
  signIn: () => Promise<AuthResult>;
  signOut: (options?: SignOutOptions) => Promise<void>;
  error: Error | null;
}
```

`useAuthProvider('google')` is useful for gating a provider-specific button:

```tsx
function GoogleButton() {
  const { signIn, isSupported, isConfigured } = useAuthProvider('google');
  if (!isSupported || !isConfigured) return null;
  return <button onClick={() => signIn()}>Sign In with Google</button>;
}
```

## Account management

`useAuth()` surfaces the same account-management methods as the singleton: `linkAccount`, `unlinkAccount`, `revokeAccess`, `getIdToken`, `updateProfile`, and `deleteAccount`. Each delegates to the active provider and throws `AuthErrorCode.OPERATION_NOT_ALLOWED` when that provider does not implement the operation.

## Related

- [Quick start](/getting-started/quick-start)
- [The auth singleton](/api/auth-singleton)
- [Providers overview](/providers/overview)
