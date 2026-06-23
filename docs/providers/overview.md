---
id: overview
title: Provider Overview
sidebar_label: Overview
description: All 15 capacitor-auth-manager providers, which need a backend, and the web vs native (iOS/Android) capability matrix.
---

# Provider overview

`capacitor-auth-manager` ships 15 providers, all with a web implementation — the primary, fully-implemented path. The column to plan around is **Backend required**: it tells you whether a provider completes in the browser or needs server-side support.

## Backend requirements

| Provider | id | Web | Backend required? |
| --- | --- | --- | --- |
| Google | `google` | Yes | No — Google Identity Services manages PKCE |
| Apple | `apple` | Yes | No for sign-in; re-validate the ID token server-side |
| Microsoft | `microsoft` | Yes | No — MSAL Browser must be loaded on the page |
| Facebook | `facebook` | Yes | No — Facebook JS SDK |
| GitHub | `github` | Yes | **Yes** — set `tokenExchangeProxy`; no in-browser exchange |
| Slack | `slack` | Yes | Optional — manual code flow (S256 PKCE) + real profile fetch |
| LinkedIn | `linkedin` | Yes | Optional — manual code flow (S256 PKCE) + real profile fetch |
| Firebase | `firebase` | Yes | No — Firebase JS SDK |
| Email + Password | `email-password` | Yes | Yes — credential verify/persist endpoint |
| Username + Password | `username_password` | Yes | Yes — credential verify (+ optional uniqueness) |
| Phone + Password | `phone_password` | Yes | Yes — credential verify endpoint |
| Email Code (OTP) | `email_code` | Yes | Yes — send/verify endpoint |
| SMS (OTP) | `sms` | Yes | Yes — Twilio / Firebase / custom backend |
| Magic Link | `magic-link` | Yes | Yes — send/verify endpoints |
| Biometric | `biometric` | Yes | No — device-local; AES-GCM web fallback |

The id is the exact string you use as the key in `auth.configure({ providers: { ... } })` and pass to `auth.signIn()`. Some ids use underscores (`username_password`, `phone_password`, `email_code`) — match them exactly, since the config lookup is an exact match.

## Web vs native capability

The web layer implements all 15 providers. The native Capacitor plugin is a **secondary surface** and ships native implementations for a subset; the rest fall back to the web flow inside the webview. Validate any native flow against the platform source before relying on it.

| Surface | Providers implemented natively |
| --- | --- |
| **Web** | All 15 |
| **iOS** (Swift) | 7 native: Apple, Facebook, GitHub, Google, LinkedIn, Microsoft, Slack (plus a generic web-OAuth fallback) |
| **Android** (Java) | 3 native: Google, Facebook, Microsoft |

This is an intentional, web-first design. If you need full native parity with the web providers, treat that as a project decision and verify each flow on a real device with real OAuth credentials.

## Choosing a provider category

- **OAuth / social** (Google, Apple, Microsoft, Facebook, GitHub, Slack, LinkedIn, Firebase) — delegate identity to a provider. Most complete in the browser; GitHub needs a token-exchange proxy.
- **Password** (email, username, phone) — you own the credential store behind an endpoint the provider calls.
- **Passwordless** (email code, SMS, magic link) — a backend sends and verifies one-time codes or links.
- **Biometric** — device-local Face ID / Touch ID / fingerprint with an encrypted web fallback.

## Related

- [Configuration](/getting-started/configuration)
- [API reference](/api/auth-singleton)
- OAuth providers: [Google](/providers/google) · [Apple](/providers/apple) · [Microsoft](/providers/microsoft) · [Facebook](/providers/facebook) · [GitHub](/providers/github) · [Slack](/providers/slack) · [LinkedIn](/providers/linkedin) · [Firebase](/providers/firebase)
- Password: [Email](/providers/email-password) · [Username](/providers/username-password) · [Phone](/providers/phone-password)
- Passwordless: [Email code](/providers/email-code) · [SMS](/providers/sms) · [Magic link](/providers/magic-link)
- [Biometric](/providers/biometric)
