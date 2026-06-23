---
id: quick-start
title: Quick Start
sidebar_label: Quick Start
description: Configure a provider and sign a user in with capacitor-auth-manager in about five minutes, in vanilla JS or React.
---

# Quick Start

This walks from a fresh install to a signed-in user. The example uses Google because it completes in the browser with no backend, but every provider follows the same `configure` → `signIn` → `onAuthStateChange` shape.

## 1. Configure a provider

Configuration is a one-time call. The keys under `providers` are provider ids; the values match each provider's typed options interface.

```typescript
import { auth } from 'capacitor-auth-manager';

auth.configure({
  providers: {
    google: {
      clientId: 'YOUR_GOOGLE_CLIENT_ID',
      scopes: ['email', 'profile'],
    },
  },
});
```

## 2. Sign in

`signIn` accepts a provider id string, or an object when you need to pass credentials or per-call options. It resolves to an `AuthResult` containing the user and the credential.

```typescript
const result = await auth.signIn('google');
console.log('Welcome', result.user.displayName);
```

## 3. React to auth state

`onAuthStateChange` calls your listener immediately with the current state, then on every change. It returns an unsubscribe function. The state shape is `{ user, isLoading, isAuthenticated, provider }` — it carries no raw tokens.

```typescript
const unsubscribe = auth.onAuthStateChange((state) => {
  if (state.isAuthenticated) {
    console.log('Signed in as', state.user?.email, 'via', state.provider);
  } else {
    console.log('Signed out');
  }
});

// later
unsubscribe();
```

## 4. Sign out

```typescript
await auth.signOut();
```

## The same flow in React

No context provider is needed — import the hook and use it. The hook subscribes to the singleton for you.

```tsx
import { useAuth } from 'capacitor-auth-manager/react';

function LoginButton() {
  const { user, signIn, signOut, isLoading } = useAuth();

  if (isLoading) return <span>Loading…</span>;
  if (user) {
    return (
      <>
        <span>Welcome, {user.displayName}</span>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return <button onClick={() => signIn('google')}>Sign in with Google</button>;
}
```

If you call the hooks before `auth.configure()` has run, point `configure` at your providers as early as possible in app startup (for example in your entry module) so the first render already has provider config.

## Where to go next

- [Configuration](/getting-started/configuration) — every option `auth.configure()` accepts.
- [Provider overview](/providers/overview) — which providers need a backend and what each one supports.
- Framework guides: [React](/frameworks/react) · [Vue](/frameworks/vue) · [Angular](/frameworks/angular) · [Vanilla JS](/frameworks/vanilla-js).
- [API reference](/api/auth-singleton).
