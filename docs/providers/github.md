---
id: github
title: GitHub authentication
sidebar_label: GitHub
description: Configure and use the GitHub provider in capacitor-auth-manager. GitHub requires a backend token-exchange proxy because it blocks browser-side code-to-token exchange.
---

# GitHub authentication

The GitHub provider signs users in with GitHub's OAuth authorization-code flow. The browser obtains an authorization `code`, but the code-to-token exchange must happen on a server.

## When you need a backend

A backend is required. GitHub does not permit browser-side code-to-token exchange — it needs the client secret and blocks CORS on its token endpoint. You must set `tokenExchangeProxy` (alias `tokenEndpoint`) to a server endpoint. Without it, sign-in throws a `MISSING_CONFIG` error explaining that a proxy is required.

The proxy receives `{ code, redirectUri, state }` as a JSON `POST` body and must return GitHub's token JSON (for example `{ access_token, token_type, scope }`). Keep the client secret on the server.

## Configuration

```typescript
import { auth } from 'capacitor-auth-manager';

auth.configure({
  providers: {
    github: {
      clientId: 'YOUR_GITHUB_CLIENT_ID',
      redirectUri: 'https://your-app.com/auth/github/callback',
      tokenExchangeProxy: 'https://your-api.com/auth/github/token',
      scopes: ['read:user', 'user:email'],
    },
  },
});
```

## Options

From the `GitHubAuthOptions` interface in `src/definitions.ts`:

| Option | Type | Required | Purpose |
| --- | --- | --- | --- |
| `clientId` | `string` | Yes | GitHub OAuth app client ID. |
| `redirectUri` | `string` | Yes | Redirect URI registered with the OAuth app. |
| `tokenExchangeProxy` | `string` | Yes in practice | Backend endpoint that exchanges the `code` for a token. Without it, sign-in fails. |
| `tokenEndpoint` | `string` | No | Alias for `tokenExchangeProxy`. |
| `clientSecret` | `string` | No | Keep on the server (the proxy uses it) — never embed in the browser. |
| `scopes` | `string[]` | No | OAuth scopes to request. |
| `allowSignup` | `boolean` | No | Allow users without an account to sign up during authorization. |
| `login` | `string` | No | Suggest a specific account to sign in with. |
| `state` | `string` | No | CSRF state value (also forwarded to the proxy). |

## Sign in

```typescript
await auth.signIn('github');
```

## Notes & caveats

- `tokenExchangeProxy` (or `tokenEndpoint`) is mandatory; the in-browser flow cannot complete without it.
- The provider generates and tracks a CSRF `state` value and forwards it to the proxy for re-verification.
- The library does not verify tokens in the browser — validate the GitHub access token server-side.

## Related

- [Configuration](/getting-started/configuration)
- [auth singleton API](/api/auth-singleton)
- [Providers overview](/providers/overview)
