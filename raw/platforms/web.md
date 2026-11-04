---
id: web
title: Web platform
sidebar_label: Web
description: How capacitor-auth-manager runs Google sign-in on the web with Google Identity Services — no backend required, returning an ID or access token you hand to Firebase.
---

# Web platform

The web is one of capacitor-auth-manager's three first-class Google surfaces (web, iOS, Android). The package is a plain TypeScript library: it runs in any browser without Capacitor, and the singleton auto-initializes when `window` exists. On the web, `auth.signIn(AuthProvider.GOOGLE)` uses **Google Identity Services** (One-Tap ID tokens or OAuth2 popup access tokens), so **no client secret and no backend** are required.

```typescript
import { auth, AuthProvider } from 'capacitor-auth-manager';

auth.configure({ providers: { [AuthProvider.GOOGLE]: { clientId: 'YOUR_WEB_OAUTH_CLIENT_ID' } } });
const result = await auth.signIn(AuthProvider.GOOGLE);
const idToken = result.credential.idToken; // web returns an idToken (no accessToken)
```

:::info Google-first (3.x)
Google is the only enabled provider. Other provider ids throw `AuthErrorCode.PROVIDER_NOT_ENABLED`. See the [provider overview](/providers/overview).
:::

## Google on the web

| What | Detail |
|---|---|
| Mechanism | Google Identity Services (GIS): One-Tap / FedCM id-token flow, with an OAuth2 popup fallback |
| Backend required? | No — no client secret needed for either flow |
| Returns | One-Tap: `idToken`. Popup: `accessToken` (+ the Google profile). Never both from one call. |
| Firebase handoff | `signInWithCredential(getAuth(), GoogleAuthProvider.credential(idToken ?? null, accessToken))` |

### Which flow runs — `webFlow`

| `webFlow` | Behaviour |
|---|---|
| `'auto'` (default) | Try One-Tap / FedCM. If the browser does not display it (cooldown, FedCM opt-out, third-party-cookie settings) fall back to the OAuth2 popup. |
| `'one-tap'` | One-Tap only. A suppressed prompt rejects with `POPUP_BLOCKED`; a user dismissal rejects with `USER_CANCELLED`. |
| `'popup'` | The OAuth2 token popup only — deterministic, works from any click handler. Closing it rejects with `POPUP_CLOSED_BY_USER`. |

Set it once in the provider options or per call:

```typescript
auth.configure({ providers: { [AuthProvider.GOOGLE]: { clientId, webFlow: 'auto' } } });
await auth.signIn({ provider: AuthProvider.GOOGLE, options: { webFlow: 'popup' } });
```

For Google's branded button, call `renderButton(element)` on the web provider class — import it with `import { GoogleAuthProviderWeb } from 'capacitor-auth-manager/providers/web'` and construct it yourself, since it is not exposed on the `auth` singleton. It shares the One-Tap credential callback.

Add your dev and production origins (for example `http://localhost:5931`) to the Web OAuth client's **Authorized JavaScript origins** in Google Cloud — both flows check it.

## Honest limitation: ID tokens are not verified client-side

The library validates an OIDC `nonce` and the ID token's `exp` claim, but it does **not** verify the token's signature in the browser. Treat any ID token as untrusted until your server (or Firebase) re-validates it.

## Storage default

On the web, the session is stored in `localStorage` by default (configurable to `sessionStorage` or in-memory via the `persistence` option). `localStorage` is readable by any script on the origin, so it is exposed to XSS. Stored profiles are UI metadata, not a verified authorization session. Tokens stay in memory; Firebase owns the application session. Biometric authentication is disabled. See [Storage](/api/storage) for backends and the security trade-offs.

## Supported environments

The core library has no required peer dependencies. The framework adapters pull in their own peers: React `16.8`–`19`, Vue `^3`, and Angular up to `^21`. `@capacitor/core` (`^7` or `^8`) is optional and only needed for the native plugin or `CapacitorPreferencesStorage`.

## Related

- [Installation](/getting-started/installation)
- [Providers overview](/providers/overview)
