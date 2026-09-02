---
id: android
title: Android platform
sidebar_label: Android
description: Using capacitor-auth-manager on Android via Capacitor — native Google sign-in through the Android Credential Manager, returning an id token you hand to Firebase.
---

# Android platform

On Android, capacitor-auth-manager runs **native Google sign-in** through the modern **Credential Manager** API. The same `auth.signIn(AuthProvider.GOOGLE)` call you use on web and iOS runs here too. Native Android support requires Capacitor (`@capacitor/core` `^7` or `^8`), and `npx cap sync`.

:::info Google-first (2.5.x)
Google is the only enabled provider. The Android source also ships scaffolding for other providers, but they are not registered — `auth.signIn()` with a non-Google id throws `AuthErrorCode.PROVIDER_NOT_ENABLED`.
:::

## Setup

1. In Google Cloud / Firebase, create an **Android** OAuth client and add your app's **SHA-1/SHA-256** signing fingerprints; create (or reuse) a **Web** OAuth client.
2. Pass that **Web** client id as `serverClientId` — Credential Manager needs it to return an id token.
3. No `google-services.json` is needed by this plugin — it uses no Firebase native SDK.
4. A Google account on the device gives the fastest path (the Credential Manager bottom sheet). With none — or when the sheet offers no authorized account — the default `androidFlow: 'auto'` falls back to the **Sign in with Google button flow**, which lets the user pick or add an account. Force one path with `androidFlow: 'bottom-sheet'` or `'button'`, in the provider options or per call.

The plugin declares only `INTERNET`. Nothing else is merged into your manifest.

```typescript
import { auth, AuthProvider } from 'capacitor-auth-manager';

auth.configure({
  providers: {
    [AuthProvider.GOOGLE]: {
      clientId: 'YOUR_WEB_OAUTH_CLIENT_ID',
      serverClientId: 'YOUR_WEB_OAUTH_CLIENT_ID', // REQUIRED for an idToken
    },
  },
});

const result = await auth.signIn(AuthProvider.GOOGLE);
// Android returns an idToken reliably; accessToken / serverAuthCode come from the
// separate Google Authorization API, not the sign-in call.
const idToken = result.credential.idToken;
```

Hand `idToken` to Firebase with `signInWithCredential(getAuth(), GoogleAuthProvider.credential(idToken))` — identical to web and iOS.

## Native source

The Google native path lives in `GoogleAuthProvider.java` on top of shared scaffolding — `BaseAuthProvider.java`, `ProviderFactory.java`, `AuthStorage.java`, `AuthLogger.java`, and the plugin entry points `CapacitorAuthManager.java` and `CapacitorAuthManagerPlugin.java`. The iOS (Swift) and Android (Java) sources are written to the official SDK contracts but are not compiled in CI — validate a new version on a real device before rolling it out widely.

## Secure storage

The default web storage backend is `localStorage`, which inside a webview is still exposed to script on the page. On native, inject `CapacitorPreferencesStorage` so tokens live in Android `SharedPreferences` instead of the webview's `localStorage`. Preferences is not hardware-encrypted — for secrecy at rest, supply a Keystore-backed `StorageInterface`. See [Storage](/api/storage).

```typescript
import { auth, CapacitorPreferencesStorage } from 'capacitor-auth-manager';

auth.configure({
  storage: new CapacitorPreferencesStorage(),
  providers: { google: { clientId: 'YOUR_CLIENT_ID' } },
});
```

## Related

- [Installation](/getting-started/installation)
- [Providers overview](/providers/overview)
