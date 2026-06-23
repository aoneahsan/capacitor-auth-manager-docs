---
id: android
title: Android platform
sidebar_label: Android
description: Using capacitor-auth-manager on Android via Capacitor — native Google, Facebook, and Microsoft providers, biometric hardware, and OAuth redirect setup notes.
---

# Android platform

On Android, capacitor-auth-manager runs through an optional Capacitor plugin. The native layer is a **secondary surface**: the web/provider orchestration is the primary, fully-implemented path, and the README is explicit that you should validate any native flow against the platform code before relying on it. Native Android support requires Capacitor (`@capacitor/core` `^7` or `^8`).

## Native providers shipped

The Android plugin source ships native provider implementations for three providers:

| Provider | Android native file |
|----------|---------------------|
| Google | `GoogleAuthProvider.java` |
| Facebook | `FacebookAuthProvider.java` |
| Microsoft | `MicrosoftAuthProvider.java` |

These sit on top of shared scaffolding — `BaseAuthProvider.java`, `ProviderFactory.java`, `AuthStorage.java`, `AuthLogger.java`, and the plugin entry points `CapacitorAuthManager.java` and `CapacitorAuthManagerPlugin.java`. Providers without a native Android implementation fall back to the web flow inside the webview. The full per-provider native status lives in the package's `CAPABILITY_MATRIX.md`.

## Web vs native on Android

Because the web surface is complete, an Android Capacitor app can use the same `auth` API as the web build; providers run their browser flow inside the webview unless a native implementation exists for them. Reach for the native provider when you need the platform SDK's account picker or stronger integration — and verify it against the Java source first.

## Biometric

Biometric authentication on Android requires fingerprint hardware on the device. The biometric provider is device-local; the user must first sign in with another provider so there is a stored credential to unlock. On the web, the biometric fallback encrypts material with AES-GCM; on device it runs through the native plugin.

## OAuth redirect configuration

Configure `AndroidManifest.xml` for OAuth redirects so the authorization-code flow can return to your app. Providers that complete via a redirect (for example a custom-scheme or app-link callback) need the matching intent filter declared. Match the redirect URI you set in each provider's config to the scheme/host registered in the manifest.

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
