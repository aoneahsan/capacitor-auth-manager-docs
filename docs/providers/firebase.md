---
id: firebase
title: Firebase authentication
sidebar_label: Firebase
description: Configure and use the Firebase provider in capacitor-auth-manager. It wraps the Firebase JS SDK and dispatches to a configurable default sign-in sub-method.
---

# Firebase authentication

:::caution Not yet available (3.x)
The Firebase provider is **not enabled yet**. Only **Google** is live right now — calling `auth.signIn()` with this provider throws `AuthErrorCode.PROVIDER_NOT_ENABLED`. The page below documents its intended shape for when it is re-enabled. (This package is Firebase-agnostic — to use Firebase today, sign in with the Google provider and hand the id token to `signInWithCredential` yourself; see the [Google provider](/providers/google).) See the [provider overview](/providers/overview).
:::

The Firebase provider signs users in with the Firebase JS SDK. It initializes a Firebase app from your config and dispatches sign-in to a sub-method (Google, Facebook, GitHub, Microsoft, Apple, email/password, or anonymous), defaulting to the `defaultMethod` you configure.

## When you need a backend

No backend is required for the browser sign-in — Firebase Authentication handles the flow. Use the Firebase Admin SDK on a server only if you need to verify Firebase ID tokens or manage users server-side.

## Configuration

```typescript
import { auth } from 'capacitor-auth-manager';

auth.configure({
  providers: {
    firebase: {
      apiKey: 'YOUR_FIREBASE_API_KEY',
      authDomain: 'your-app.firebaseapp.com',
      projectId: 'your-app',
      appId: 'YOUR_FIREBASE_APP_ID',
      defaultMethod: 'google',
    },
  },
});
```

## Options

From the `FirebaseAuthOptions` interface in `src/definitions.ts`:

| Option | Type | Required | Purpose |
| --- | --- | --- | --- |
| `apiKey` | `string` | Yes | Firebase web API key. |
| `authDomain` | `string` | Yes | Firebase auth domain. |
| `projectId` | `string` | Yes | Firebase project ID. |
| `appId` | `string` | Yes | Firebase app ID. |
| `storageBucket` | `string` | No | Firebase storage bucket. |
| `messagingSenderId` | `string` | No | Cloud Messaging sender ID. |
| `measurementId` | `string` | No | Analytics measurement ID. |
| `tenantId` | `string` | No | Identity Platform tenant ID. |
| `persistence` | `'local' \| 'session' \| 'none'` | No | Firebase Auth state persistence. |
| `enableMultiTabSupport` | `boolean` | No | Enable multi-tab persistence support. |
| `defaultMethod` | `'google' \| 'facebook' \| 'github' \| 'microsoft' \| 'apple' \| 'email' \| 'anonymous'` | No | Fallback sub-method when `signIn` is called without an explicit method and no email/password credentials. Defaults to `'google'`. |

## Sign in

```typescript
// Uses defaultMethod (e.g. 'google')
await auth.signIn('firebase');

// Email/password sub-method via credentials
await auth.signIn({
  provider: 'firebase',
  credentials: { email: 'user@example.com', password: 'secure-password' },
});
```

## Notes & caveats

- When email and password credentials are supplied, the provider uses the `email` sub-method; otherwise it uses `defaultMethod` (default `'google'`).
- OAuth sub-methods use Firebase's `signInWithPopup`, so a blocked popup prevents completion.
- The library does not verify Firebase ID-token signatures itself; use the Firebase Admin SDK server-side to verify tokens you trust for authorization.

## Related

- [Configuration](/getting-started/configuration)
- [auth singleton API](/api/auth-singleton)
- [Providers overview](/providers/overview)
