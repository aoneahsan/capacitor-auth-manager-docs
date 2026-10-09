---
id: faq
title: FAQ
sidebar_label: FAQ
description: Common questions about capacitor-auth-manager — Capacitor requirement, backends, security, framework support, and provider parity.
---

# Frequently asked questions

## Which providers are available right now?

Only **Google** (as of 3.x). It works on web, iOS, and Android. The package is being brought to production one provider at a time; the other 14 providers' code is in the repo but un-registered, so calling them throws `AuthErrorCode.PROVIDER_NOT_ENABLED`. See the [provider overview](/providers/overview).

## How is this different from `@codetrix-studio/capacitor-google-auth`?

It does the same job — native Google sign-in returning an id token you hand to Firebase — but it's Firebase-agnostic (no `firebase` dependency pulled in), uses the modern Android **Credential Manager** and **GoogleSignIn** SDKs, keeps the **same `signIn` call on web, iOS, and Android**, and is yours to maintain. The id token moves from `result.authentication.idToken` to `result.credential.idToken`. See the [migration guide](/providers/google#migrating-from-codetrix-studiocapacitor-google-auth).

## Do I need Capacitor to use this?

No. `capacitor-auth-manager` runs in any web app — Google sign-in there uses Google Identity Services. Capacitor is optional; you add `@capacitor/core` and run `npx cap sync` only when you ship an iOS or Android build.

## Does it verify ID tokens for me?

No. The library validates an OIDC `nonce` and the ID token's `exp` claim, but it does **not** verify the token's signature in the browser. Re-validate any ID token against the provider's JWKS on your server before trusting its claims. This is a deliberate, honest limitation — client-side signature verification gives a false sense of security.

## Does Google sign-in need a backend?

No. Both Google Identity Services web flows require no client secret: One-Tap returns an ID token and popup returns an access token. On iOS (GoogleSignIn) and Android (Credential Manager) the native SDK handles it. You only involve a server if you opt into a `serverAuthCode` (iOS) and exchange it for refresh tokens — and that exchange must happen on your server, never in the app/browser.

## Do I need a context provider or wrapper component?

No. The core `auth` singleton works like a store — import it and call it anywhere. The React and Vue adapters expose hooks/composables that subscribe to the singleton with no surrounding provider. Angular uses `AuthModule.forRoot({ providers })`.

## Is it tree-shakeable?

Yes. The package sets `sideEffects: false` and loads each provider dynamically, so a bundle only includes the providers you actually call. Framework adapters are separate entry points, so a React build does not pull in Vue and vice versa.

## How are tokens stored?

By default on web, in `localStorage`, which any XSS or third-party script on the origin can read. On native, inject `CapacitorPreferencesStorage` (needs the optional `@capacitor/preferences` peer) for native profile/session metadata. Token strings are not written through these storage adapters. Android credentials stay in memory; iOS relies on the Google SDK Keychain. For secrecy at rest, supply a Keychain/Keystore-backed `StorageInterface`. See [storage](/api/storage).

## Does Google sign-in work the same on web, iOS, and Android?

Yes — that's the point. The same `auth.signIn(AuthProvider.GOOGLE)` call dispatches to Google Identity Services (web), GoogleSignIn (iOS), or Credential Manager (Android), and returns an ID token on native/One-Tap or an access token on web popup. Firebase handoff must use both credential fields. Native consumer builds run in package CI — validate a new version on a real device before rolling it out widely.

## What happens when Google One-Tap does not show up?

With the default `webFlow: 'auto'` the package falls back to Google's OAuth2 popup, which works from any click
handler and returns an `accessToken` instead of an `idToken`. Firebase accepts both:
`GoogleAuthProvider.credential(idToken ?? null, accessToken)`. Use `webFlow: 'popup'` to skip One-Tap entirely.

## Can I import the package in Node, SSR or a test runner?

Yes, since 3.0.0. Importing is side-effect free (the `auth` singleton is created on first use) and every
published relative import carries its `.js` extension, so bare Node ESM and CJS both resolve. Signing in
still needs a browser or a device.

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
