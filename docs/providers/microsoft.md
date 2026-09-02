---
id: microsoft
title: Microsoft authentication
sidebar_label: Microsoft
description: Configure and use the Microsoft provider in capacitor-auth-manager. It runs on MSAL Browser, which must be loaded on the page for sign-in to work.
---

# Microsoft authentication

:::caution Not yet available (2.5.x)
The Microsoft provider is **not enabled yet**. Only **Google** is live right now — calling `auth.signIn()` with this provider throws `AuthErrorCode.PROVIDER_NOT_ENABLED`. The page below documents its intended shape for when it is re-enabled. See the [provider overview](/providers/overview) and the [Google provider](/providers/google).
:::

The Microsoft provider signs users in with the Microsoft Authentication Library (MSAL) for browsers (`@azure/msal-browser`, read from `window.msal`). It drives MSAL's popup / redirect sign-in and silent token acquisition.

## When you need a backend

No backend is required for the browser sign-in itself. MSAL handles the OAuth/OIDC flow against Microsoft Entra ID. Use a backend only if you exchange tokens or call protected downstream APIs server-side.

## Configuration

```typescript
import { auth } from 'capacitor-auth-manager';

auth.configure({
  providers: {
    microsoft: {
      clientId: 'YOUR_APPLICATION_CLIENT_ID',
      redirectUri: 'https://your-app.com/auth/callback',
      tenantId: 'common',
      scopes: ['openid', 'profile', 'email'],
    },
  },
});
```

## Options

From the `MicrosoftAuthOptions` interface in `src/definitions.ts`:

| Option | Type | Required | Purpose |
| --- | --- | --- | --- |
| `clientId` | `string` | Yes | Entra ID application (client) ID. |
| `redirectUri` | `string` | Yes | Redirect URI registered with the app. |
| `clientSecret` | `string` | No | Server-side flows only — do not embed in the browser. |
| `tenantId` | `string` | No | Tenant ID (e.g. `common`, `organizations`, or a specific tenant). |
| `scopes` | `string[]` | No | Scopes to request. |
| `authority` | `string` | No | Full authority URL override. |
| `loginHint` | `string` | No | Prefill the account. |
| `domainHint` | `string` | No | Hint the home tenant/domain. |
| `prompt` | `'login' \| 'none' \| 'consent' \| 'select_account'` | No | Interaction prompt behavior. |
| `responseType` | `string` | No | OAuth response type. |
| `responseMode` | `string` | No | OAuth response mode. |
| `codeChallenge` | `string` | No | PKCE code challenge. |
| `codeChallengeMethod` | `string` | No | PKCE challenge method. |
| `state` | `string` | No | CSRF state value. |
| `nonce` | `string` | No | OIDC nonce. |

## Sign in

```typescript
await auth.signIn('microsoft');
```

## Notes & caveats

- MSAL Browser must be loaded on the page. If `window.msal` is absent, the provider throws: "Microsoft Authentication Library (MSAL) is not loaded. Please include the MSAL script in your HTML."
- A missing `clientId` raises a `MISSING_CONFIG` error during configuration.
- The library does not verify ID-token signatures in the browser — re-validate server-side if you rely on the claims.

## Related

- [Configuration](/getting-started/configuration)
- [auth singleton API](/api/auth-singleton)
- [Providers overview](/providers/overview)
