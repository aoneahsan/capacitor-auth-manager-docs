---
id: ios
title: iOS platform
sidebar_label: iOS
description: Using capacitor-auth-manager on iOS via Capacitor — native Google sign-in through the GoogleSignIn SDK, returning an id token (plus access token) you hand to Firebase.
---

# iOS platform

On iOS, capacitor-auth-manager runs **native Google sign-in** through the **GoogleSignIn** SDK. The same `auth.signIn(AuthProvider.GOOGLE)` call you use on web and Android runs here too. Native iOS support requires Capacitor (`@capacitor/core` `^7` or `^8`) and `npx cap sync`.

:::info Google-first (2.4.x)
Google is the only enabled provider. The iOS source also ships scaffolding for other providers, but they are not registered — `auth.signIn()` with a non-Google id throws `AuthErrorCode.PROVIDER_NOT_ENABLED`.
:::

## Setup

1. Create an **iOS** OAuth client in Google Cloud.
2. Add `GIDClientID` (your iOS client id) to `Info.plist`, or pass it as `iosClientId`.
3. Add the **reversed client id** as a URL scheme in `Info.plist` → `CFBundleURLTypes` (e.g. `com.googleusercontent.apps.XXXX`).
4. For a `serverAuthCode`, also set `serverClientId` (your Web client id).

```typescript
import { auth, AuthProvider } from 'capacitor-auth-manager';

auth.configure({
  providers: {
    [AuthProvider.GOOGLE]: {
      iosClientId: 'YOUR_IOS_OAUTH_CLIENT_ID',   // or set GIDClientID in Info.plist
      serverClientId: 'YOUR_WEB_OAUTH_CLIENT_ID', // for a serverAuthCode
    },
  },
});

const result = await auth.signIn(AuthProvider.GOOGLE);
// iOS returns idToken + accessToken (+ serverAuthCode when serverClientId is set).
const idToken = result.credential.idToken;
```

Hand `idToken` to Firebase with `signInWithCredential(getAuth(), GoogleAuthProvider.credential(idToken))` — identical to web and Android. A `serverAuthCode` must be exchanged on **your** server, never in the app.

## Native source

The Google native path lives in `GoogleAuthProvider.swift` on shared scaffolding — `BaseAuthProvider.swift`, `Models.swift`, `AuthStorage.swift`, `AuthLogger.swift`, and the entry points `CapacitorAuthManager.swift` and `Plugin.swift`. The iOS (Swift) and Android (Java) sources are written to the official SDK contracts but are not compiled in CI — validate a new version on a real device before rolling it out widely.

## Secure storage

The default web storage backend is `localStorage`, which inside a webview is still exposed to script on the page. On native, inject `CapacitorPreferencesStorage` so tokens live in iOS `UserDefaults` instead of the webview's `localStorage`. Preferences is not hardware-encrypted — for secrecy at rest, supply a Keychain-backed `StorageInterface`. See [Storage](/api/storage).

```typescript
import { auth, AuthProvider, CapacitorPreferencesStorage } from 'capacitor-auth-manager';

auth.configure({
  storage: new CapacitorPreferencesStorage(),
  providers: { [AuthProvider.GOOGLE]: { iosClientId: 'YOUR_IOS_OAUTH_CLIENT_ID' } },
});
```

## Related

- [Installation](/getting-started/installation)
- [Providers overview](/providers/overview)
