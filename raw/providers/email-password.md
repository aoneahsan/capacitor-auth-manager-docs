---
id: email-password
title: Email and password authentication
sidebar_label: Email + Password
description: "Configure the email and password provider in capacitor-auth-manager: it sends credentials to a backend you supply that verifies and persists them."
---

# Email and password authentication

:::caution Not yet available (3.x)
The email-and-password provider is **not enabled yet**. Only **Google** is live right now — calling `auth.signIn()` with this provider throws `AuthErrorCode.PROVIDER_NOT_ENABLED`. The page below documents its intended shape for when it is re-enabled. See the [provider overview](/providers/overview) and the [Google provider](/providers/google).
:::

The email and password provider signs users in by sending an email/password pair to a backend you operate, which verifies the credentials and returns a user plus tokens. The library orchestrates the request and the resulting auth state; it is not itself the credential store.

## Backend requirement

This provider is not self-contained. The web implementation (`src/providers/web/email-password-provider.ts`) issues a `POST` to your `/auth/signin` endpoint with `{ email, password, clientId }` and expects a JSON body containing at least `uid`, `email`, `accessToken`, and `refreshToken`. A `401` response surfaces as `INVALID_CREDENTIALS`. You must run that endpoint (and, for the other operations, `/auth/signout`, `/auth/refresh`, `/auth/update-password`, `/auth/reset-password`, `/auth/verify-email`).

The web provider reads the base URL from an `apiUrl` field on the provider options. Note that the runtime config the provider reads (`apiUrl`, `clientId`, `passwordRequirements`, `allowSignUp`) differs from the typed `EmailPasswordOptions` interface documented below — supply `apiUrl` so the provider can reach your backend.

## Configuration

```typescript
import { auth } from 'capacitor-auth-manager';

auth.configure({
  providers: {
    'email-password': {
      strengthRequirements: {
        minLength: 8,
        requireUppercase: true,
        requireNumbers: true,
      },
      requireEmailVerification: true,
    },
  },
});
```

## Options

From the `EmailPasswordOptions` interface in `src/definitions.ts`:

| Option | Type | Required | Purpose |
| --- | --- | --- | --- |
| `strengthRequirements` | `PasswordStrengthRequirements` | No | Declarative password rules (min/max length, char-class requirements, custom regex). |
| `allowPasswordReset` | `boolean` | No | Whether the password-reset flow is offered. |
| `requireEmailVerification` | `boolean` | No | Require a verified email before the account is usable. |
| `customValidation` | `{ endpoint?: string; headers?: Record<string, string> }` | No | Optional endpoint for additional server-side validation. |

## Sign in

Pass an `EmailPasswordCredentials` object (`{ email, password }`) under `credentials`:

```typescript
await auth.signIn({
  provider: 'email-password',
  credentials: { email: 'user@example.com', password: 'secure-password' },
});
```

Use the same `'email-password'` key in `configure()` and `signIn()` — the configuration lookup is an exact string match.

## Errors

All failures are thrown as `AuthError` with an `AuthErrorCode`:

- `CREDENTIALS_REQUIRED` — email or password missing.
- `INVALID_CREDENTIALS` — backend returned `401`.
- `SIGN_IN_FAILED` — any other backend/network failure.

## Related

- [Configuration](/getting-started/configuration)
- [auth singleton API](/api/auth-singleton)
- [Providers overview](/providers/overview)
