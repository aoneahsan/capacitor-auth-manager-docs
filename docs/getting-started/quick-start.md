---
id: quick-start
title: Quick Start
sidebar_label: Quick Start
description: Configure Google and sign a user in with capacitor-auth-manager in about five minutes — the same call on web, iOS, and Android — then hand the credential to Firebase.
---

# Quick Start

This walks from a fresh install to a signed-in Google user, then hands the credential to Firebase. The **same `signIn(AuthProvider.GOOGLE)` call works on web, iOS, and Android** — native dispatch picks the right Google SDK for you.

:::info Google-first (3.x)
Google is the only enabled provider right now. Any other provider id throws `AuthErrorCode.PROVIDER_NOT_ENABLED` until it is re-enabled. See the [provider overview](/providers/overview).
:::

## 1. Configure Google

Configuration is a one-time call. Use the exported **`AuthProvider` enum** (recommended — typo-safe; the plain string `'google'` also works).

```typescript
import { auth, AuthProvider } from 'capacitor-auth-manager';

auth.configure({
  providers: {
    [AuthProvider.GOOGLE]: {
      clientId: 'YOUR_WEB_OAUTH_CLIENT_ID',        // web + Android serverClientId fallback
      serverClientId: 'YOUR_WEB_OAUTH_CLIENT_ID',  // REQUIRED on Android to receive an idToken
      iosClientId: 'YOUR_IOS_OAUTH_CLIENT_ID',     // iOS (or set GIDClientID in Info.plist)
    },
  },
  persistence: 'local',
});
```

`serverClientId` is the **Web** OAuth client id; Android's Credential Manager needs it to return an id token. See the [Google provider page](/providers/google) for the full native setup (SHA-1/256 on Android, the reversed-client-id URL scheme on iOS).

## 2. Sign in

The same call runs on every platform and resolves to an `AuthResult`. Native and One-Tap flows return an ID token; the web popup flow returns an access token.

```typescript
const result = await auth.signIn(AuthProvider.GOOGLE);
const idToken = result.credential.idToken;     // present on native and web One-Tap; absent on web popup
console.log('Welcome', result.user.displayName);
```

## 3. Hand the credential to Firebase (identical on every platform)

The package is Firebase-agnostic — it does not bundle Firebase. You take the Google id token and call `signInWithCredential` yourself. This is the same code on web and native.

```typescript
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

const result = await auth.signIn(AuthProvider.GOOGLE);
await signInWithCredential(
  getAuth(),
  GoogleAuthProvider.credential(result.credential.idToken ?? null, result.credential.accessToken ?? null),
);
```

## 4. React to auth state

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

## 5. Sign out

```typescript
await auth.signOut();
```

## The same flow in React

No context provider is needed — import the hook and use it. The hook subscribes to the singleton for you.

```tsx
import { useAuth, AuthProvider } from 'capacitor-auth-manager/react';

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
  return <button onClick={() => signIn(AuthProvider.GOOGLE)}>Sign in with Google</button>;
}
```

Call `auth.configure()` as early as possible in app startup (for example in your entry module) so the first render already has provider config.

## Where to go next

- [Google provider](/providers/google) — configuration options, native (Android/iOS) setup, and the per-platform token table.
- [Configuration](/getting-started/configuration) — every option `auth.configure()` accepts.
- [Migrating from `@codetrix-studio/capacitor-google-auth`](/providers/google#migrating-from-codetrix-studiocapacitor-google-auth).
- Framework guides: [React](/frameworks/react) · [Vue](/frameworks/vue) · [Angular](/frameworks/angular) · [Vanilla JS](/frameworks/vanilla-js).
- [API reference](/api/auth-singleton).
