---
id: intro
title: Capacitor Auth Manager
sidebar_label: Introduction
slug: /intro
description: capacitor-auth-manager is a Firebase-agnostic Google authentication library for Capacitor and the web — a drop-in alternative to @codetrix-studio/capacitor-google-auth, with one signIn call on web, iOS, and Android.
---

# Capacitor Auth Manager

`capacitor-auth-manager` is a Firebase-agnostic **Google authentication** library for Capacitor and the web — a drop-in alternative to [`@codetrix-studio/capacitor-google-auth`](https://www.npmjs.com/package/@codetrix-studio/capacitor-google-auth). One call, `auth.signIn(AuthProvider.GOOGLE)`, returns a Google credential `{ idToken, accessToken?, serverAuthCode?, user }` on **web, iOS, and Android**; your app feeds the `idToken` into Firebase (or anything else). It works with React, Vue, Angular, and vanilla JS.

It is published on npm as [`capacitor-auth-manager`](https://www.npmjs.com/package/capacitor-auth-manager) and is MIT-licensed.

:::info Status (2.5.x): Google-first
Right now **Google is the enabled provider** (web + iOS + Android). The package is being brought to production **one provider at a time**. The other 14 providers' code lives in the repo but is **un-registered** — calling them throws `AuthErrorCode.PROVIDER_NOT_ENABLED` — and each is re-enabled and verified on device one at a time. Treat every non-Google provider page as a roadmap reference, not a working feature.
:::

## Why this exists

For native Google sign-in in a Capacitor app you normally reach for `@codetrix-studio/capacitor-google-auth`. This package does the same job (native Google ID token → your Firebase `signInWithCredential`) but is **yours to maintain**, uses the modern **Android Credential Manager** and **GoogleSignIn** SDKs, keeps the **same call on every platform**, and stays **Firebase-agnostic** (no `firebase` dependency is pulled in).

## What it gives you

- A single `auth` singleton that works like a store (no providers/context, similar to Zustand).
- The **same `signIn` call on web, iOS, and Android** — native dispatch picks GoogleSignIn (iOS), Credential Manager (Android), or Google Identity Services (web) for you.
- A Google credential with `result.credential.idToken` populated on every platform — all you need for the Firebase handoff.
- First-class adapters: React hooks, Vue 3 composables, an Angular service/module/route-guard, and a vanilla-JS surface — each re-exports the `AuthProvider` enum.
- No `firebase` dependency, and no secrets persisted by default.

## What it does NOT do

Honesty matters more than a long feature list when you are wiring auth.

- It does **not** verify ID-token signatures in the browser. Re-validate any ID token on your server (or via Firebase) before trusting its claims.
- It does **not** bundle Firebase. You call `signInWithCredential` yourself — the package only hands you the Google id token.
- On the web a single call returns **one** token: an `idToken` from One-Tap, or an `accessToken` from the OAuth2 popup fallback. Firebase accepts either; it never returns a refresh token in the browser.
- Only **Google** is enabled in 2.5.x. The other providers are not available yet and throw `AuthErrorCode.PROVIDER_NOT_ENABLED`.

## Where to go next

- [Installation](/getting-started/installation) — install the package, `@capacitor/core`, and the adapter peers you use.
- [Quick Start](/getting-started/quick-start) — sign a user in with Google in five minutes, then hand the credential to Firebase.
- [Google provider](/providers/google) — configuration, native setup, and the per-platform token table.
- [Migrating from `@codetrix-studio/capacitor-google-auth`](/providers/google#migrating-from-codetrix-studiocapacitor-google-auth).
- [Configuration](/getting-started/configuration) — the full `auth.configure()` shape.
- [API reference](/api/auth-singleton) — every `auth.*` method.

---

Built and maintained by [Ahsan Mahmood](https://aoneahsan.com) ([GitHub](https://github.com/aoneahsan) · [npm](https://www.npmjs.com/~aoneahsan)).
