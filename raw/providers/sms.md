---
id: sms
title: SMS code (OTP) authentication
sidebar_label: SMS
description: "Configure the passwordless SMS (OTP) provider in capacitor-auth-manager: a backend you supply sends the code and verifies it in a two-step flow."
---

# SMS code (OTP) authentication

:::caution Not yet available (3.x)
The SMS (OTP) provider is **not enabled yet**. Only **Google** is live right now — calling `auth.signIn()` with this provider throws `AuthErrorCode.PROVIDER_NOT_ENABLED`. The page below documents its intended shape for when it is re-enabled. See the [provider overview](/providers/overview) and the [Google provider](/providers/google).
:::

The SMS provider is a passwordless, two-step flow: the first call asks your backend to text a one-time code to a phone number, and the second call submits that code for verification. The library tracks the pending verification (metadata only, persisted across reloads) and orchestrates state; your backend integrates with an SMS service (Twilio, AWS SNS, etc.) to send and validate the code.

## Backend requirement

This provider needs a backend. The web implementation (`src/providers/web/sms-provider.ts`) `POST`s `{ phoneNumber, clientId, codeLength }` to your send-code endpoint and expects a `sessionId` back, then `POST`s `{ phoneNumber, code, sessionId, clientId }` to your verify endpoint and expects a user (`uid`, optional tokens). A `401` on verify becomes `INVALID_CODE`. The code is never stored client-side — only non-secret metadata (session id, expiry, attempt count) is persisted.

The web provider reads its endpoint URLs from runtime options — `sendCodeUrl` and `verifyCodeUrl` (required), plus optional `clientId`, `countryCode`, `codeLength`, `resendDelay`. This runtime config differs from the typed `SmsAuthOptions` interface documented below — supply `sendCodeUrl` and `verifyCodeUrl` so the provider can reach your backend.

## Configuration

```typescript
import { auth } from 'capacitor-auth-manager';

auth.configure({
  providers: {
    sms: {
      provider: 'twilio',
      twilioConfig: {
        accountSid: 'YOUR_SID',
        authToken: 'YOUR_TOKEN',
        fromNumber: '+1234567890',
      },
      codeLength: 6,
    },
  },
});
```

## Options

From the `SmsAuthOptions` interface in `src/definitions.ts`:

| Option | Type | Required | Purpose |
| --- | --- | --- | --- |
| `provider` | `'twilio' \| 'firebase' \| 'custom'` | Yes | Which SMS backend strategy to use. |
| `twilioConfig` | `{ accountSid; authToken; fromNumber }` | No | Twilio credentials (keep secrets server-side). |
| `firebaseConfig` | `{ apiKey; projectId }` | No | Firebase phone-auth config. |
| `customConfig` | `{ endpoint; apiKey?; headers? }` | No | Custom send/verify endpoint config. |
| `codeLength` | `number` | No | Number of digits in the code. |
| `codeExpiration` | `number` | No | Code lifetime in milliseconds. |
| `maxAttempts` | `number` | No | Allowed verification attempts. |
| `testMode` | `boolean` | No | Use test phone numbers instead of real sends. |
| `testPhoneNumbers` | `Record<string, string>` | No | Phone-number-to-code map for test mode. |

## Sign in

The flow is two calls with `SmsCodeCredentials` (`{ phoneNumber, code? }`):

```typescript
// Step 1 — request the code (no `code`)
await auth.signIn({ provider: 'sms', credentials: { phoneNumber: '+1234567890' } });

// Step 2 — verify the code
await auth.signIn({
  provider: 'sms',
  credentials: { phoneNumber: '+1234567890', code: '123456' },
});
```

## Errors

All failures are thrown as `AuthError` with an `AuthErrorCode`:

- `PHONE_REQUIRED` — phone number missing.
- `INVALID_CODE` / `CODE_EXPIRED` — verification failed or the code lapsed.
- `NO_PENDING_VERIFICATION` — verifying without a sent code.
- `TOO_MANY_ATTEMPTS` / `RESEND_DELAY` — attempt or resend throttling.

## Related

- [Configuration](/getting-started/configuration)
- [auth singleton API](/api/auth-singleton)
- [Providers overview](/providers/overview)
