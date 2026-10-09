---
id: overview
title: Provider Overview
sidebar_label: Overview
description: Which capacitor-auth-manager providers are enabled today — Google is live on web, iOS, and Android; the other 14 are coming one at a time and throw PROVIDER_NOT_ENABLED.
---

# Provider overview

`capacitor-auth-manager` is being brought to production **one provider at a time**. As of **3.x, Google is the only enabled provider** — it works on web, iOS, and Android. The code for the other 14 providers lives in the repo but is **un-registered**: calling them throws `AuthErrorCode.PROVIDER_NOT_ENABLED`. Each is re-enabled and verified on device one at a time.

:::caution Only Google is available right now
Treat every non-Google provider page as a **roadmap reference**, not a working feature. Configuring a non-Google provider and calling `auth.signIn()` with its id throws `AuthErrorCode.PROVIDER_NOT_ENABLED`.
:::

## Provider status

| Provider | id | Status |
|---|---|---|
| **Google** | `google` / `AuthProvider.GOOGLE` | **Enabled** — web (GIS), iOS (GoogleSignIn), Android (Credential Manager) |
| Apple | `apple` | ⏳ Coming — `PROVIDER_NOT_ENABLED` |
| Microsoft | `microsoft` | ⏳ Coming — `PROVIDER_NOT_ENABLED` |
| Facebook | `facebook` | ⏳ Coming — `PROVIDER_NOT_ENABLED` |
| GitHub | `github` | ⏳ Coming — `PROVIDER_NOT_ENABLED` |
| Slack | `slack` | ⏳ Coming — `PROVIDER_NOT_ENABLED` |
| LinkedIn | `linkedin` | ⏳ Coming — `PROVIDER_NOT_ENABLED` |
| Firebase | `firebase` | ⏳ Coming — `PROVIDER_NOT_ENABLED` |
| Email + Password | `email-password` | ⏳ Coming — `PROVIDER_NOT_ENABLED` |
| Username + Password | `username_password` | ⏳ Coming — `PROVIDER_NOT_ENABLED` |
| Phone + Password | `phone_password` | ⏳ Coming — `PROVIDER_NOT_ENABLED` |
| Email Code (OTP) | `email_code` | ⏳ Coming — `PROVIDER_NOT_ENABLED` |
| SMS (OTP) | `sms` | ⏳ Coming — `PROVIDER_NOT_ENABLED` |
| Magic Link | `magic-link` | ⏳ Coming — `PROVIDER_NOT_ENABLED` |
| Biometric | `biometric` | ⏳ Coming — `PROVIDER_NOT_ENABLED` |

The id is the exact string you use as the key in `auth.configure({ providers: { ... } })` and pass to `auth.signIn()`. Some planned ids use underscores (`username_password`, `phone_password`, `email_code`) — match them exactly, since the config lookup is an exact match. The recommended form is the `AuthProvider` enum (e.g. `AuthProvider.GOOGLE`).

## Google: the same call on every platform

`auth.signIn(AuthProvider.GOOGLE)` dispatches natively per platform and returns a Google credential with `result.credential.idToken` populated on web, iOS, and Android — which you hand to Firebase via `signInWithCredential`. See the [Google provider page](/providers/google) for configuration, native setup, the per-platform token table, and the migration from `@codetrix-studio/capacitor-google-auth`.

## Roadmap (not yet available)

These pages document each provider's intended shape for when it is enabled. Until then they throw `PROVIDER_NOT_ENABLED`:

- OAuth / social: [Apple](/providers/apple) · [Microsoft](/providers/microsoft) · [Facebook](/providers/facebook) · [GitHub](/providers/github) · [Slack](/providers/slack) · [LinkedIn](/providers/linkedin) · [Firebase](/providers/firebase)
- Password: [Email](/providers/email-password) · [Username](/providers/username-password) · [Phone](/providers/phone-password)
- Passwordless: [Email code](/providers/email-code) · [SMS](/providers/sms) · [Magic link](/providers/magic-link)
- [Biometric](/providers/biometric)

## Related

- [Google provider](/providers/google)
- [Configuration](/getting-started/configuration)
- [API reference](/api/auth-singleton)
