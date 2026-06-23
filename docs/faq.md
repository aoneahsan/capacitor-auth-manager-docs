---
id: faq
title: FAQ
sidebar_label: FAQ
description: Common questions about capacitor-auth-manager — Capacitor requirement, backends, security, framework support, and provider parity.
---

# Frequently asked questions

## Do I need Capacitor to use this?

No. `capacitor-auth-manager` runs in any web app — the web/provider layer is the primary, fully-implemented surface. Capacitor is optional; you add `@capacitor/core` and the native plugin only when you ship an iOS or Android build.

## Does it verify ID tokens for me?

No. The library validates an OIDC `nonce` and the ID token's `exp` claim, but it does **not** verify the token's signature in the browser. Re-validate any ID token against the provider's JWKS on your server before trusting its claims. This is a deliberate, honest limitation — client-side signature verification gives a false sense of security.

## Which providers need a backend?

GitHub needs a server-side `tokenExchangeProxy` (GitHub blocks browser-side `code` → token exchange). The password providers (email/username/phone), the one-time-code providers (email code, SMS), and magic link all call endpoints you host. Google, Apple, Microsoft, Facebook, Firebase, Slack, and LinkedIn complete in the browser (Slack/LinkedIn can use an optional server). See the [provider overview](/providers/overview) for the full table.

## Do I need a context provider or wrapper component?

No. The core `auth` singleton works like a store — import it and call it anywhere. The React and Vue adapters expose hooks/composables that subscribe to the singleton with no surrounding provider. Angular uses `AuthModule.forRoot({ providers })`.

## Is it tree-shakeable?

Yes. The package sets `sideEffects: false` and loads each provider dynamically, so a bundle only includes the providers you actually call. Framework adapters are separate entry points, so a React build does not pull in Vue and vice versa.

## How are tokens stored?

By default on web, in `localStorage`, which any XSS or third-party script on the origin can read. On native, inject `CapacitorPreferencesStorage` (needs the optional `@capacitor/preferences` peer) so tokens live in native key-value storage. For secrecy at rest, supply a Keychain/Keystore-backed `StorageInterface`. See [storage](/api/storage).

## Are all 15 providers available on iOS and Android?

Not natively. The web layer implements all 15. iOS ships 7 native providers (Apple, Facebook, GitHub, Google, LinkedIn, Microsoft, Slack) plus a web-OAuth fallback; Android ships 3 (Google, Facebook, Microsoft). The native plugin is a secondary surface — validate any native flow on a real device before relying on it.

## Which frameworks are supported?

React (`16.8`–`19`), Vue (`^3`), Angular (through `^21`), and vanilla JavaScript. Each has a dedicated entry point. See the [framework guides](/frameworks/react).

## How do I change log verbosity?

The shared logger defaults to `warn`. Set `logLevel` in `auth.configure()`, the build-time `VITE_LOG_LEVEL` / `LOG_LEVEL` env var, or call `defaultLogger.setLevel('debug')` at runtime.

## Where do I report a security issue?

Email aoneahsan@gmail.com — see the [security policy](/.well-known/security.txt). Auth is sensitive; reports are prioritized.

## Related

- [Provider overview](/providers/overview)
- [API reference](/api/auth-singleton)
- [Configuration](/getting-started/configuration)
