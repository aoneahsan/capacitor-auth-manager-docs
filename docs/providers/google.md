---
id: google
title: Google authentication
sidebar_label: Google
description: Configure and use the Google provider in capacitor-auth-manager. Google Identity Services manages PKCE in the browser, so no backend is required for sign-in.
---

# Google authentication

The Google provider signs users in with Google Identity Services (GIS) in the browser. It uses the GIS code client (`window.google.accounts.oauth2`), and Google manages the PKCE exchange on its own infrastructure.

## When you need a backend

Sign-in completes entirely in the browser — no backend is required for the basic flow. You only need server support if you opt into offline access / server auth codes (`offlineAccess`, `requestServerAuthCode`, `serverClientId`) and want to exchange the returned authorization code for refresh tokens server-side.

## Configuration

```typescript
import { auth } from 'capacitor-auth-manager';

auth.configure({
  providers: {
    google: {
      clientId: 'YOUR_GOOGLE_CLIENT_ID',
      scopes: ['email', 'profile'],
    },
  },
});
```

## Options

From the `GoogleAuthOptions` interface in `src/definitions.ts`:

| Option | Type | Required | Purpose |
| --- | --- | --- | --- |
| `clientId` | `string` | Yes | Google OAuth client ID. |
| `clientSecret` | `string` | No | Server-side flows only — never embed a real secret in a browser bundle. |
| `scopes` | `string[]` | No | OAuth scopes to request (e.g. `email`, `profile`). |
| `hostedDomain` | `string` | No | Restrict sign-in to a Google Workspace domain. |
| `serverClientId` | `string` | No | Web/server client ID used when exchanging a server auth code. |
| `offlineAccess` | `boolean` | No | Request offline access (server auth code for refresh tokens). |
| `forceCodeForRefreshToken` | `boolean` | No | Force re-consent so a refresh token is returned. |
| `accountName` | `string` | No | Preselect a specific account. |
| `includeGrantedScopes` | `boolean` | No | Incremental authorization. |
| `loginHint` | `string` | No | Prefill the account email. |
| `requestIdToken` | `boolean` | No | Request an ID token. |
| `requestServerAuthCode` | `boolean` | No | Request a server auth code for backend exchange. |

## Sign in

```typescript
await auth.signIn('google');

// Request additional scopes
await auth.signIn({
  provider: 'google',
  options: { scopes: ['https://www.googleapis.com/auth/calendar'] },
});
```

## Notes & caveats

- The Google Identity Services script must be loaded on the page. If `window.google.accounts.oauth2` is absent, the provider throws "Google Identity Services not loaded".
- The library does not verify ID-token signatures in the browser. If you trust ID-token claims for authorization, re-validate the token server-side.

## Related

- [Configuration](/getting-started/configuration)
- [auth singleton API](/api/auth-singleton)
- [Providers overview](/providers/overview)
