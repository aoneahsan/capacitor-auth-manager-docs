---
id: phone-password
title: Phone and password authentication
sidebar_label: Phone + Password
description: "Configure the phone number and password provider in capacitor-auth-manager: it verifies credentials against a backend you supply and orchestrates state."
---

# Phone and password authentication

:::caution Not yet available (2.5.x)
The phone-and-password provider is **not enabled yet**. Only **Google** is live right now — calling `auth.signIn()` with this provider throws `AuthErrorCode.PROVIDER_NOT_ENABLED`. The page below documents its intended shape for when it is re-enabled. See the [provider overview](/providers/overview) and the [Google provider](/providers/google).
:::

The phone and password provider signs users in with a phone number and password, verified by a backend you operate. It optionally supports an SMS phone-verification step before completing sign-in. The library orchestrates the requests; it is not the credential store.

## Backend requirement

This provider needs a backend. The web implementation (`src/providers/web/phone-password-provider.ts`) `POST`s `{ phoneNumber, password, clientId }` to your sign-in endpoint and expects a JSON body with `uid`, `accessToken`, and `refreshToken`. A `401` becomes `INVALID_CREDENTIALS`; a `403` becomes `PHONE_NOT_VERIFIED`.

The web provider reads its endpoint URLs from runtime options — `signInUrl` and `signUpUrl` (required), plus optional `verifyPhoneUrl`, `sendVerificationUrl`, `refreshTokenUrl`, and `resetPasswordUrl`. This runtime config (which also includes `countryCode`, `requirePhoneVerification`, `passwordStrength`) differs from the typed `PhonePasswordOptions` interface documented below — supply `signInUrl` and `signUpUrl` so the provider can reach your backend.

## Configuration

```typescript
import { auth } from 'capacitor-auth-manager';

auth.configure({
  providers: {
    phone_password: {
      requirePhoneVerification: true,
      phoneNumberFormat: 'E164',
    },
  },
});
```

The config key `phone_password` matches the `AuthProvider.PHONE_PASSWORD` enum value; the hyphenated `phone-password` resolves to the same provider. Use whichever form consistently in both `configure()` and `signIn()`.

## Options

From the `PhonePasswordOptions` interface in `src/definitions.ts`:

| Option | Type | Required | Purpose |
| --- | --- | --- | --- |
| `strengthRequirements` | `PasswordStrengthRequirements` | No | Declarative password rules. |
| `allowPasswordReset` | `boolean` | No | Whether the password-reset flow is offered. |
| `requirePhoneVerification` | `boolean` | No | Require an SMS code step before sign-in completes. |
| `phoneNumberFormat` | `'E164' \| 'NATIONAL' \| 'INTERNATIONAL'` | No | Expected phone-number format. |

## Sign in

Pass a `PhonePasswordCredentials` object (`{ phoneNumber, password }`) under `credentials`:

```typescript
await auth.signIn({
  provider: 'phone_password',
  credentials: { phoneNumber: '+1234567890', password: 'secure-password' },
});
```

When phone verification is required, include the SMS `code` in the credentials to complete the verification step.

## Errors

All failures are thrown as `AuthError` with an `AuthErrorCode`:

- `CREDENTIALS_REQUIRED` — phone number or password missing.
- `PHONE_NOT_VERIFIED` — backend returned `403`.
- `NO_PENDING_VERIFICATION` / `CODE_EXPIRED` / `INVALID_CODE` — verification-step failures.

## Related

- [Configuration](/getting-started/configuration)
- [auth singleton API](/api/auth-singleton)
- [Providers overview](/providers/overview)
