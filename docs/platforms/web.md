---
id: web
title: Web platform
sidebar_label: Web
description: How capacitor-auth-manager runs on the web — its primary surface — covering all 15 providers, which need a backend, PKCE on manual OAuth flows, and the storage default.
---

# Web platform

The web is capacitor-auth-manager's primary, fully-implemented surface. The package is a plain TypeScript library: it runs in any browser without Capacitor, and the singleton auto-initializes when `window` exists. All 15 providers ship a web implementation, and the web/provider orchestration layer is the strongest part of the package.

```typescript
import { auth } from 'capacitor-auth-manager';

auth.configure({ providers: { google: { clientId: 'YOUR_CLIENT_ID' } } });
await auth.signIn('google');
```

## The 15 web providers

| Provider | Backend required? |
|----------|-------------------|
| Google | No — Google Identity Services manages PKCE in the browser. |
| Apple | No for sign-in; re-validate the ID token server-side. |
| Microsoft | No — uses MSAL Browser (must be loaded on the page). |
| Facebook | No — uses the Facebook JS SDK. |
| GitHub | Yes — set `tokenExchangeProxy`; GitHub blocks in-browser code exchange. |
| Slack | Optional — manual code flow plus a real profile fetch. |
| LinkedIn | Optional — manual code flow plus a real profile fetch. |
| Firebase | No — uses the Firebase JS SDK. |
| Email + Password | Yes — credential verify/persist endpoint. |
| Phone + Password | Yes — credential verify endpoint. |
| Username + Password | Yes — credential verify (plus optional uniqueness). |
| Email Code (OTP) | Yes — send/verify endpoint. |
| SMS (OTP) | Yes — Twilio / Firebase / custom backend. |
| Magic Link | Yes — send/verify endpoints. |
| Biometric | No — device-local, with an AES-GCM web fallback. |

## Which providers need a backend

The "Backend required?" column is the thing to plan around. Social SDK providers (Google, Microsoft, Facebook, Firebase, and Apple sign-in) complete in the browser. GitHub always needs a server-side token-exchange proxy — without `tokenExchangeProxy` you get a clear `auth/missing-config` error. Credential and passwordless flows (email/phone/username + password, email/SMS codes, magic link) need your endpoint to verify and persist credentials. Slack and LinkedIn run a manual authorization-code flow that can complete client-side but typically pairs with your redirect handler.

## PKCE on manual OAuth flows

The manual authorization-code flows (Slack, LinkedIn) send a SHA-256 (`S256`) PKCE code challenge/verifier per RFC 7636, and OIDC `nonce` plus the ID-token `exp` claim are validated. Important honest limitation: the library does not verify ID-token signatures in the browser. Treat any ID token as untrusted until your server re-validates it — use `auth.getIdToken()` to fetch one for server-side verification.

## Storage default

On the web, the session is stored in `localStorage` by default (configurable to `sessionStorage` or in-memory via the `persistence` option). `localStorage` is readable by any script on the origin, so it is exposed to XSS. The biometric web fallback is an exception: it encrypts stored credential material with AES-GCM using a non-extractable IndexedDB key. See [Storage](/api/storage) for backends and the security trade-offs.

## Supported environments

The core library has no required peer dependencies. The framework adapters pull in their own peers: React `16.8`–`19`, Vue `^3`, and Angular up to `^21`. `@capacitor/core` (`^7` or `^8`) is optional and only needed for the native plugin or `CapacitorPreferencesStorage`.

## Related

- [Installation](/getting-started/installation)
- [Providers overview](/providers/overview)
