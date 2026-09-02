---
id: facebook
title: Facebook authentication
sidebar_label: Facebook
description: Configure and use the Facebook provider in capacitor-auth-manager. It uses the Facebook JS SDK and completes login in the browser with no backend required.
---

# Facebook authentication

:::caution Not yet available (2.5.x)
The Facebook provider is **not enabled yet**. Only **Google** is live right now — calling `auth.signIn()` with this provider throws `AuthErrorCode.PROVIDER_NOT_ENABLED`. The page below documents its intended shape for when it is re-enabled. See the [provider overview](/providers/overview) and the [Google provider](/providers/google).
:::

The Facebook provider signs users in with the Facebook JS SDK (`window.FB`). The provider loads the SDK from `connect.facebook.net` and initializes it with your app ID and Graph API version.

## When you need a backend

No backend is required for the basic login flow — the Facebook JS SDK returns an access token in the browser. A backend is only needed if you want to verify or extend the access token server-side (recommended before trusting it for authorization).

## Configuration

```typescript
import { auth } from 'capacitor-auth-manager';

auth.configure({
  providers: {
    facebook: {
      appId: 'YOUR_FACEBOOK_APP_ID',
      scopes: ['email', 'public_profile'],
      fields: ['id', 'name', 'email', 'picture'],
    },
  },
});
```

## Options

From the `FacebookAuthOptions` interface in `src/definitions.ts`:

| Option | Type | Required | Purpose |
| --- | --- | --- | --- |
| `appId` | `string` | Yes | Facebook application ID. |
| `appSecret` | `string` | No | Server-side use only — do not ship in the browser bundle. |
| `scopes` | `string[]` | No | Permissions to request (e.g. `email`, `public_profile`). |
| `fields` | `string[]` | No | Graph API profile fields to fetch. |
| `version` | `string` | No | Graph API version. Defaults to `v18.0`. |
| `loginBehavior` | `'native_with_fallback' \| 'native_only' \| 'web_only' \| 'web_view_only'` | No | Login behavior preference. |
| `defaultAudience` | `'friends' \| 'only_me' \| 'everyone'` | No | Default audience for posted content permissions. |
| `limitedLogin` | `boolean` | No | Use Facebook Limited Login (privacy-restricted, OIDC-style token). |
| `authType` | `string` | No | Auth type parameter (e.g. re-request declined permissions). |
| `messengerPageId` | `string` | No | Messenger page association. |
| `resetMessengerState` | `boolean` | No | Reset Messenger extension state. |

## Sign in

```typescript
await auth.signIn('facebook');
```

## Notes & caveats

- The provider loads and initializes the Facebook JS SDK itself; the login depends on Facebook's SDK being reachable.
- `limitedLogin` follows Facebook's Limited Login mode, which restricts the data returned.
- The library does not verify token signatures in the browser — re-validate the access/ID token server-side before trusting it.

## Related

- [Configuration](/getting-started/configuration)
- [auth singleton API](/api/auth-singleton)
- [Providers overview](/providers/overview)
