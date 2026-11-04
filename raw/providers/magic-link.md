---
id: magic-link
title: Email magic link authentication
sidebar_label: Magic Link
description: "Configure the passwordless email magic link provider in capacitor-auth-manager: a backend you supply sends the link and sign-in completes on its click."
---

# Email magic link authentication

:::caution Not yet available (3.x)
The magic-link provider is **not enabled yet**. Only **Google** is live right now — calling `auth.signIn()` with this provider throws `AuthErrorCode.PROVIDER_NOT_ENABLED`. The page below documents its intended shape for when it is re-enabled. See the [provider overview](/providers/overview) and the [Google provider](/providers/google).
:::

The magic link provider is a passwordless flow: a call asks your backend to email a sign-in link, and sign-in completes when the user clicks that link and your app loads the callback page. The library generates the link token, tracks the pending verification (persisted so it survives the redirect), and orchestrates state; your backend delivers the email.

## Backend requirement

This provider needs a backend. The web implementation (`src/providers/web/magic-link-provider.ts`) generates a random token and `POST`s `{ email, magicLink, clientId, template }` to your send-link endpoint, which must email the link to the user. On the callback page load it can optionally verify the token against your verify endpoint (`POST { token, email, clientId }`); without a verify endpoint it completes the sign-in locally from the persisted pending record.

The web provider reads its endpoint URLs from runtime options — `sendLinkUrl` (required), plus optional `verifyUrl`, `clientId`, `redirectUrl`, `emailTemplate`. This runtime config differs from the typed `EmailMagicLinkOptions` interface documented below — supply `sendLinkUrl` so the provider can reach your backend.

## Configuration

```typescript
import { auth } from 'capacitor-auth-manager';

auth.configure({
  providers: {
    'magic-link': {
      endpoint: 'https://your-api.com/magic-link',
      redirectUrl: 'https://your-app.com/auth/callback',
    },
  },
});
```

## Options

From the `EmailMagicLinkOptions` interface in `src/definitions.ts`:

| Option | Type | Required | Purpose |
| --- | --- | --- | --- |
| `endpoint` | `string` | No | Backend endpoint that sends the magic-link email. |
| `apiKey` | `string` | No | API key for the send endpoint. |
| `redirectUrl` | `string` | No | URL the magic link points back to (the callback page). |
| `customEmailTemplate` | `string` | No | Template identifier for the email. |
| `tokenExpiration` | `number` | No | Link-token lifetime in milliseconds. |
| `rateLimit` | `{ maxAttempts: number; windowMs: number }` | No | Send-rate limit window. |

## Sign in

Send the link with an `{ email }` credentials object. There is no second `signIn` call — verification completes when the link-click callback page loads and the token (carried in the link URL as `?token=...&provider=magic-link`) is matched against the persisted pending metadata:

```typescript
await auth.signIn({
  provider: 'magic-link',
  credentials: { email: 'user@example.com' },
});
```

## Errors

All failures are thrown as `AuthError` with an `AuthErrorCode`:

- `EMAIL_REQUIRED` — email missing.
- `SEND_LINK_FAILED` — the send-link request failed.
- `INVALID_TOKEN` / `TOKEN_EXPIRED` — callback verification failed or the link lapsed.

## Related

- [Configuration](/getting-started/configuration)
- [auth singleton API](/api/auth-singleton)
- [Providers overview](/providers/overview)
