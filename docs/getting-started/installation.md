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
# or
yarn add capacitor-auth-manager
```

## Optional peer dependencies

Add only the peers your app actually uses. None of them are required to run the core web library.

| Peer | When you need it | Supported range |
| --- | --- | --- |
| `@capacitor/core` | Only for the native iOS/Android plugin or `CapacitorPreferencesStorage` | `^7` or `^8` |
| `@capacitor/preferences` | Only if you inject `CapacitorPreferencesStorage` for native token storage | `^6`, `^7`, or `^8` |
| `react` | Only for the React adapter (`capacitor-auth-manager/react`) | `16.8`–`19` |
| `vue` | Only for the Vue adapter (`capacitor-auth-manager/vue`) | `^3` |
| `@angular/core` | Only for the Angular adapter (`capacitor-auth-manager/angular`) | up to `^21` |
| `capacitor-biometric-authentication` | Optional — native biometric verification | declared as an optional dependency |

Because the package marks all of these optional, npm/yarn will not force-install them. You will only see a peer warning for a framework you are not using if your tooling is strict — it is safe to ignore for unused adapters.

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

Capacitor is optional. If you ship a mobile build, install `@capacitor/core` and sync the native projects with your usual Capacitor workflow. See [Android](/platforms/android) and [iOS](/platforms/ios) for the platform notes (URL schemes, biometric hardware, deployment target). The native plugin is a secondary surface — the web path is primary.

## Related

- [Quick Start](/getting-started/quick-start)
- [Configuration](/getting-started/configuration)
- [Platform notes](/platforms/web)
