---
id: web
title: Web platform
sidebar_label: Web
description: How capacitor-auth-manager runs Google sign-in on the web with Google Identity Services — no backend required, returning an id token you hand to Firebase.
---

# Web platform

The web is one of capacitor-auth-manager's three first-class Google surfaces (web, iOS, Android). The package is a plain TypeScript library: it runs in any browser without Capacitor, and the singleton auto-initializes when `window` exists. On the web, `auth.signIn(AuthProvider.GOOGLE)` uses **Google Identity Services** (the id-token flow), so **no client secret and no backend** are required.

```typescript
import { auth, AuthProvider } from 'capacitor-auth-manager';

auth.configure({ providers: { [AuthProvider.GOOGLE]: { clientId: 'YOUR_WEB_OAUTH_CLIENT_ID' } } });
const result = await auth.signIn(AuthProvider.GOOGLE);
const idToken = result.credential.idToken; // web returns an idToken (no accessToken)
```

:::info Google-first (2.4.x)
Google is the only enabled provider. Other provider ids throw `AuthErrorCode.PROVIDER_NOT_ENABLED`. See the [provider overview](/providers/overview).
:::

## Google on the web

| What | Detail |
|---|---|
| Mechanism | Google Identity Services (GIS) id-token flow |
| Backend required? | No — GIS manages the flow; no client secret needed |
| Returns | `idToken` only (no `accessToken`) |
| Firebase handoff | `signInWithCredential(getAuth(), GoogleAuthProvider.credential(result.credential.idToken))` |

If One-Tap is suppressed (cooldown), render Google's official button via the provider's `renderButton(element)` escape hatch, or fall back to your own Firebase popup on web. For Google API calls from the browser, use the GIS token client separately.

## Honest limitation: ID tokens are not verified client-side

The library validates an OIDC `nonce` and the ID token's `exp` claim, but it does **not** verify the token's signature in the browser. Treat any ID token as untrusted until your server (or Firebase) re-validates it.

## Storage default

On the web, the session is stored in `localStorage` by default (configurable to `sessionStorage` or in-memory via the `persistence` option). `localStorage` is readable by any script on the origin, so it is exposed to XSS. The biometric web fallback is an exception: it encrypts stored credential material with AES-GCM using a non-extractable IndexedDB key. See [Storage](/api/storage) for backends and the security trade-offs.

## Supported environments

The core library has no required peer dependencies. The framework adapters pull in their own peers: React `16.8`–`19`, Vue `^3`, and Angular up to `^21`. `@capacitor/core` (`^7` or `^8`) is optional and only needed for the native plugin or `CapacitorPreferencesStorage`.

## Related

- [Installation](/getting-started/installation)
- [Providers overview](/providers/overview)
