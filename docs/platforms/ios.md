---
id: ios
title: iOS platform
sidebar_label: iOS
description: Using capacitor-auth-manager on iOS via Capacitor (deployment target 14) — the native providers shipped, Face ID and Touch ID, and URL scheme configuration notes.
---

# iOS platform

On iOS, capacitor-auth-manager runs through an optional Capacitor plugin. As on Android, the native layer is a **secondary surface**: the web/provider orchestration is the primary, fully-implemented path, and you should validate any native flow against the platform code before relying on it. Native iOS support requires Capacitor (`@capacitor/core` `^7` or `^8`), with an iOS deployment target of 14.

## Native providers shipped

The iOS plugin source ships native provider implementations for these providers:

| Provider | iOS native file |
|----------|-----------------|
| Apple | `AppleAuthProvider.swift` |
| Google | `GoogleAuthProvider.swift` |
| Facebook | `FacebookAuthProvider.swift` |
| Microsoft | `MicrosoftAuthProvider.swift` |
| GitHub | `GitHubAuthProvider.swift` |
| Slack | `SlackAuthProvider.swift` |
| LinkedIn | `LinkedInAuthProvider.swift` |

A generic `OAuthWebProvider.swift` provides a web-based OAuth fallback for other flows. These sit on shared scaffolding — `BaseAuthProvider.swift`, `Models.swift`, `AuthStorage.swift`, `AuthLogger.swift`, and the entry points `CapacitorAuthManager.swift` and `Plugin.swift`. The full per-provider native status lives in the package's `CAPABILITY_MATRIX.md`.

## Web vs native on iOS

Because the web surface is complete, an iOS Capacitor app can use the same `auth` API as the web build; providers run their browser flow inside the webview unless a native implementation exists for them. Reach for a native provider when you want the platform's native sign-in sheet (for example Apple's `ASAuthorization` flow) — and verify it against the Swift source first.

## Face ID and Touch ID

Biometric authentication on iOS requires Face ID or Touch ID capability on the device. The biometric provider is device-local; the user must first sign in with another provider so there is a stored credential to unlock. On the web, the biometric fallback encrypts material with AES-GCM; on device it runs through the native plugin.

## URL scheme configuration

Some providers need URL scheme configuration to complete a redirect-based sign-in. Register the custom URL scheme (or associated domain) your provider redirect targets so the authorization-code flow can return to your app, and keep each provider's configured `redirectUri` consistent with what you register in the iOS project.

## Secure storage

The default web storage backend is `localStorage`, which inside a webview is still exposed to script on the page. On native, inject `CapacitorPreferencesStorage` so tokens live in iOS `UserDefaults` instead of the webview's `localStorage`. Preferences is not hardware-encrypted — for secrecy at rest, supply a Keychain-backed `StorageInterface`. See [Storage](/api/storage).

```typescript
import { auth, CapacitorPreferencesStorage } from 'capacitor-auth-manager';

auth.configure({
  storage: new CapacitorPreferencesStorage(),
  providers: { apple: { clientId: 'YOUR_SERVICE_ID', redirectUri: 'YOUR_REDIRECT_URI' } },
});
```

## Related

- [Installation](/getting-started/installation)
- [Providers overview](/providers/overview)
