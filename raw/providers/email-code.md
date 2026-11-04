---
id: email-code
title: Email code (OTP) authentication
sidebar_label: Email Code
description: "Configure the passwordless email code (OTP) provider in capacitor-auth-manager: a backend you supply sends the code and verifies it in two steps."
---

# Email code (OTP) authentication

:::caution Not yet available (3.x)
The email-code (OTP) provider is **not enabled yet**. Only **Google** is live right now — calling `auth.signIn()` with this provider throws `AuthErrorCode.PROVIDER_NOT_ENABLED`. The page below documents its intended shape for when it is re-enabled. See the [provider overview](/providers/overview) and the [Google provider](/providers/google).
:::

The email code provider is a passwordless, two-step flow: the first call asks your backend to email a one-time code, and the second call submits that code for verification. The library tracks the pending verification (metadata only, persisted across reloads) and orchestrates state; your backend generates, emails, and validates the code.

## Backend requirement

This provider needs a backend. The web implementation (`src/providers/web/email-code-provider.ts`) `POST`s `{ email, clientId, codeLength }` to your send-code endpoint and expects a `sessionId` back, then `POST`s `{ email, code, sessionId, clientId }` to your verify endpoint and expects a user (`uid`, optional tokens). A `401` on verify becomes `INVALID_CODE`. The verification code itself is never stored client-side — only non-secret metadata (session id, expiry, attempt count) is persisted.

The web provider reads its endpoint URLs from runtime options — `sendCodeUrl` and `verifyCodeUrl` (required), plus optional `clientId`, `codeLength`, `resendDelay`, `codeExpiration`. This runtime config differs from the typed `EmailCodeOptions` interface documented below — supply `sendCodeUrl` and `verifyCodeUrl` so the provider can reach your backend.

## Configuration

```typescript
import { auth } from 'capacitor-auth-manager';

auth.configure({
  providers: {
    email_code: {
      codeLength: 6,
      codeExpiration: 600000, // 10 minutes
    },
  },
});
```

The config key `email_code` matches the `AuthProvider.EMAIL_CODE` enum value; the hyphenated `email-code` resolves to the same provider. Use whichever form consistently in both `configure()` and `signIn()`.

## Options

From the `EmailCodeOptions` interface in `src/definitions.ts`:

| Option | Type | Required | Purpose |
| --- | --- | --- | --- |
| `codeLength` | `number` | No | Number of digits in the emailed code. |
| `codeExpiration` | `number` | No | Code lifetime in milliseconds. |
| `maxAttempts` | `number` | No | Allowed verification attempts before the code is invalidated. |
| `customEmailTemplate` | `string` | No | Template identifier for the verification email. |
| `rateLimit` | `{ maxAttempts: number; windowMs: number }` | No | Send-rate limit window. |

## Sign in

The flow is two calls with `EmailCodeCredentials` (`{ email, code? }`):

```typescript
// Step 1 — request the code (no `code`)
await auth.signIn({ provider: 'email_code', credentials: { email: 'user@example.com' } });

// Step 2 — verify the code
await auth.signIn({
  provider: 'email_code',
  credentials: { email: 'user@example.com', code: '123456' },
});
```

## Errors

All failures are thrown as `AuthError` with an `AuthErrorCode`:

- `EMAIL_REQUIRED` / `INVALID_EMAIL` — missing or malformed email.
- `INVALID_CODE` / `CODE_EXPIRED` — verification failed or the code lapsed.
- `NO_PENDING_VERIFICATION` — verifying without a sent code.
- `TOO_MANY_ATTEMPTS` / `RESEND_DELAY` — attempt or resend throttling.

## Related

- [Configuration](/getting-started/configuration)
- [auth singleton API](/api/auth-singleton)
- [Providers overview](/providers/overview)
