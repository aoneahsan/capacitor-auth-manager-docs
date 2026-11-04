---
id: ios
title: iOS platform
sidebar_label: iOS
description: Using capacitor-auth-manager on iOS via Capacitor — native Google sign-in through the GoogleSignIn SDK, returning an id token (plus access token) you hand to Firebase.
---

# iOS platform

On iOS, capacitor-auth-manager runs **native Google sign-in** through the **GoogleSignIn** SDK. The same `auth.signIn(AuthProvider.GOOGLE)` call you use on web and Android runs here too. Native iOS support requires Capacitor (`@capacitor/core` `^7.4.2` or `^8`) and `yarn cap sync`.

:::info Google-first (3.x)
Google is the only enabled provider. Other providers are excluded from the published native sources — `auth.signIn()` with a non-Google id throws `AuthErrorCode.PROVIDER_NOT_ENABLED`.
:::

Requires iOS 15 or newer and GoogleSignIn 10.x. Use a CocoaPods-based Capacitor project; this package does not ship a Swift Package manifest.

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

Hand `idToken` to Firebase with `signInWithCredential(getAuth(), GoogleAuthProvider.credential(idToken))`. The web popup returns an access token instead; see the [Firebase integration guide](/integration/ai). A `serverAuthCode` must be exchanged on **your** server, never in the app.

## Native source

The Google native path lives in `GoogleAuthProvider.swift` on shared scaffolding — `BaseAuthProvider.swift`, `Models.swift`, `AuthStorage.swift`, `AuthLogger.swift`, and the entry points `CapacitorAuthManager.swift` and `Plugin.swift`. Package CI compiles native consumers. Validate real Google sign-in with your OAuth clients on a device before rollout.

## Secure storage

Storage adapters persist profile/session metadata, not bearer credentials. The GoogleSignIn SDK owns its Keychain session. Package copies of credentials are removed from UserDefaults on upgrade. `CapacitorPreferencesStorage` is optional metadata storage and is not encrypted. See [Storage](/api/storage).

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
