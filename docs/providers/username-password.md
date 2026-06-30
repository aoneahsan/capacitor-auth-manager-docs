---
id: username-password
title: Username and password authentication
sidebar_label: Username + Password
description: "Configure the username and password provider in capacitor-auth-manager: it sends credentials to a backend you supply that verifies and persists them."
---

# Username and password authentication

:::caution Not yet available (2.4.x)
The username-and-password provider is **not enabled yet**. Only **Google** is live right now — calling `auth.signIn()` with this provider throws `AuthErrorCode.PROVIDER_NOT_ENABLED`. The page below documents its intended shape for when it is re-enabled. See the [provider overview](/providers/overview) and the [Google provider](/providers/google).
:::

The username and password provider signs users in by sending a username/password pair to a backend you operate, which verifies the credentials and returns a user plus tokens. The library orchestrates the request and the resulting auth state; it does not store or validate credentials itself.

## Backend requirement

This provider needs a backend. The web implementation (`src/providers/web/username-password-provider.ts`) issues a `POST` to your `/auth/signin` endpoint with `{ username, password, clientId }` and expects a JSON body with at least `uid`, `accessToken`, and `refreshToken`. A `401` becomes `INVALID_CREDENTIALS`. The other operations call `/auth/signout`, `/auth/refresh`, `/auth/update-password`, and `/auth/check-username` (optional username-uniqueness check).

The web provider reads the base URL from an `apiUrl` field on the provider options. The runtime config it actually reads (`apiUrl`, `clientId`, `usernameRequirements`, `passwordRequirements`, `allowSignUp`) differs from the typed `UsernamePasswordOptions` interface documented below — supply `apiUrl` so the provider can reach your backend.

## Configuration

```typescript
import { auth } from 'capacitor-auth-manager';

auth.configure({
  providers: {
    'username-password': {
      usernameRequirements: {
        minLength: 3,
        maxLength: 20,
      },
    },
  },
});
```

## Options

From the `UsernamePasswordOptions` interface in `src/definitions.ts`:

| Option | Type | Required | Purpose |
| --- | --- | --- | --- |
| `strengthRequirements` | `PasswordStrengthRequirements` | No | Declarative password rules (min/max length, char-class requirements, custom regex). |
| `allowPasswordReset` | `boolean` | No | Whether the password-reset flow is offered. |
| `usernameRequirements` | `UsernameRequirements` | No | Username rules: `minLength`, `maxLength`, `allowedCharacters`, `preventProfanity`, and a `uniqueCheck` endpoint. |
| `caseSensitive` | `boolean` | No | Treat usernames as case-sensitive. |

## Sign in

Pass a `UsernamePasswordCredentials` object (`{ username, password }`) under `credentials`:

```typescript
await auth.signIn({
  provider: 'username-password',
  credentials: { username: 'johndoe', password: 'secure-password' },
});
```

Use the same `'username-password'` key in `configure()` and `signIn()` — the configuration lookup is an exact string match.

## Errors

All failures are thrown as `AuthError` with an `AuthErrorCode`:

- `CREDENTIALS_REQUIRED` — username or password missing.
- `INVALID_CREDENTIALS` — backend returned `401`.
- `USERNAME_ALREADY_EXISTS` — sign-up against a taken username (`409`).

## Related

- [Configuration](/getting-started/configuration)
- [auth singleton API](/api/auth-singleton)
- [Providers overview](/providers/overview)
