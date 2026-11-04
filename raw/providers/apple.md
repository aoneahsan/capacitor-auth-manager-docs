---
id: apple
title: Apple authentication
sidebar_label: Apple
description: Configure and use the Apple provider in capacitor-auth-manager. Sign in with Apple JS handles the web flow; re-validate the ID token server-side before trusting claims.
---

# Apple authentication

:::caution Not yet available (3.x)
The Apple provider is **not enabled yet**. Only **Google** is live right now — calling `auth.signIn()` with this provider throws `AuthErrorCode.PROVIDER_NOT_ENABLED`. The page below documents its intended shape for when it is re-enabled. See the [provider overview](/providers/overview) and the [Google provider](/providers/google).
:::

The Apple provider signs users in with Sign in with Apple JS (`window.AppleID`). It validates the returned ID token's nonce and expiry before building the user object.

## When you need a backend

No backend is required to complete the browser sign-in. However, Apple sign-in returns an ID token that you should re-validate server-side before trusting its claims — the library does not verify the token signature in the browser.

## Configuration

```typescript
import { auth, AppleAuthScope } from 'capacitor-auth-manager';

auth.configure({
  providers: {
    apple: {
      clientId: 'YOUR_SERVICE_ID',
      redirectUri: 'https://your-app.com/auth/callback',
      scopes: [AppleAuthScope.EMAIL, AppleAuthScope.NAME],
    },
  },
});
```

## Options

From the `AppleAuthOptions` interface in `src/definitions.ts`:

| Option | Type | Required | Purpose |
| --- | --- | --- | --- |
| `clientId` | `string` | Yes | Apple Service ID (the web client identifier). |
| `redirectUri` | `string` | Yes | Redirect URI registered with Apple. |
| `scopes` | `AppleAuthScope[]` | No | `AppleAuthScope.EMAIL` and/or `AppleAuthScope.NAME`. |
| `usePopup` | `boolean` | No | Use a popup instead of a redirect. Defaults to `true`. |
| `state` | `string` | No | CSRF state value. |
| `nonce` | `string` | No | Nonce for ID-token replay protection. |
| `responseMode` | `'query' \| 'fragment' \| 'form_post'` | No | Response delivery mode. Defaults to `'form_post'`. |
| `responseType` | `'code' \| 'id_token' \| 'code id_token'` | No | Response type. Defaults to `'code id_token'`. |

## Sign in

```typescript
await auth.signIn('apple');
```

## Notes & caveats

- The Sign in with Apple JS library must be loaded on the page (`window.AppleID`).
- `usePopup` defaults to `true`; with a popup blocked, the flow cannot complete.
- The ID token's nonce and `exp` are validated client-side, but its signature is not. Re-validate the ID token on your server before trusting identity claims.

## Related

- [Configuration](/getting-started/configuration)
- [auth singleton API](/api/auth-singleton)
- [Providers overview](/providers/overview)
