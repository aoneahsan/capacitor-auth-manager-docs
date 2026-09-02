---
id: installation
title: Installation
sidebar_label: Installation
description: Install capacitor-auth-manager with npm or yarn, plus its optional peer dependencies for Capacitor, React, Vue, and Angular.
---

# Installation

Install the package from npm. It has one runtime dependency (`tslib`); everything framework- or Capacitor-specific is an **optional** peer that you add only when you use it.

```bash
npm install capacitor-auth-manager
# then, for the native (iOS/Android) plugin:
npx cap sync
```

```bash
# or with yarn
yarn add capacitor-auth-manager
npx cap sync
```

:::info Google-first (2.5.x)
Google is the only enabled provider right now. The package installs the same way regardless, but `auth.signIn()` only completes for `AuthProvider.GOOGLE`; other ids throw `AuthErrorCode.PROVIDER_NOT_ENABLED`. See the [Google provider](/providers/google) and [provider overview](/providers/overview).
:::

## Peer dependencies

`@capacitor/core` is a **required** peer since 2.5.0 — the published bundle registers the Capacitor plugin even
in a web-only build. Everything else is optional; add only what your app uses.

| Peer | Required? | When you need it | Supported range |
| --- | --- | --- | --- |
| `@capacitor/core` | **yes** | always (the plugin bridge is registered at import) | `^7.4.2` or `^8` |
| `@capacitor/preferences` | optional | only if you inject `CapacitorPreferencesStorage` for native token storage | `^6`, `^7`, or `^8` |
| `react` | optional | the React adapter (`capacitor-auth-manager/react`) | `16.8`–`19` |
| `vue` | optional | the Vue adapter (`capacitor-auth-manager/vue`) | `^3` |
| `@angular/core` | optional | the Angular adapter (`capacitor-auth-manager/angular`) | `^12`–`^22` |

Nothing is installed for disabled providers: the former `capacitor-biometric-authentication` optional
dependency was removed in 2.5.0 and returns as an optional peer when the biometric provider is re-enabled.

**Node:** `>=24.0.0` for installing and building. The package itself runs in a browser or a webview; since
2.5.0 importing it under bare Node (ESM or CJS, SSR, test runners) is side-effect free and resolves cleanly.

## Entry points

The package ships six entry points so a React build never pulls in Vue, and vice versa:

```typescript
import { auth } from 'capacitor-auth-manager';            // core singleton + types
import { useAuth } from 'capacitor-auth-manager/react';    // React hooks
import { useAuth } from 'capacitor-auth-manager/vue';      // Vue composables
import { AuthService } from 'capacitor-auth-manager/angular'; // Angular service/module/guard
import { auth } from 'capacitor-auth-manager/core';        // core only
import { GoogleProvider } from 'capacitor-auth-manager/providers/web'; // direct provider access
```

The library is distributed as ESM with CommonJS builds for backward compatibility, full TypeScript types, and `sideEffects: false` for tree-shaking.

## Native (Capacitor) projects

Capacitor is optional. If you ship a mobile build, install `@capacitor/core`, run `npx cap sync`, and configure the native Google setup. See [Android](/platforms/android) (SHA-1/256 fingerprints, `serverClientId`, a Google account on the device) and [iOS](/platforms/ios) (`GIDClientID` + the reversed-client-id URL scheme) for the platform notes. The native Google path uses Android Credential Manager and the GoogleSignIn SDK.

## Related

- [Quick Start](/getting-started/quick-start)
- [Configuration](/getting-started/configuration)
- [Platform notes](/platforms/web)
