---
id: intro
title: Capacitor Auth Manager
sidebar_label: Introduction
slug: /intro
description: capacitor-auth-manager is a framework-agnostic authentication library with 15 providers for React, Vue, Angular, vanilla JS, and optional Capacitor apps.
---

# Capacitor Auth Manager

`capacitor-auth-manager` is a TypeScript-first authentication library that puts 15 sign-in providers behind one framework-agnostic API. You configure providers once, then call `auth.signIn('google')` (or any other provider id) from React, Vue, Angular, or plain JavaScript — no context wrapper, no per-framework rewrite. Capacitor is optional: the library runs in any web app, and you add the native iOS/Android plugin only when you ship a mobile build.

It is published on npm as [`capacitor-auth-manager`](https://www.npmjs.com/package/capacitor-auth-manager) and is MIT-licensed.

## What it gives you

- A single `auth` singleton that works like a store (no providers/context, similar to Zustand).
- 15 providers: Google, Apple, Microsoft, Facebook, GitHub, Slack, LinkedIn, Firebase, email/username/phone + password, email-code and SMS one-time codes, magic link, and biometric.
- First-class adapters: React hooks, Vue 3 composables, an Angular service/module/route-guard, and a vanilla-JS surface.
- Dynamic provider loading and `sideEffects: false`, so a bundle only carries the providers you call.
- Security defaults: S256 PKCE on manual OAuth code flows, OIDC nonce and ID-token `exp` validation, pluggable secure storage, and an AES-GCM web fallback for biometric material.

## What it does NOT do

Honesty matters more than a long feature list when you are wiring auth.

- It does **not** verify ID-token signatures in the browser. Re-validate any ID token on your server before trusting its claims.
- It is **not** a backend. The password, email-code, SMS, and magic-link providers orchestrate calls to a backend you supply — they do not store users or send emails/SMS themselves.
- GitHub sign-in **cannot** complete purely in the browser; it needs a small server-side token-exchange proxy (GitHub blocks browser-side `code` → token exchange).
- The native Capacitor plugin is a **secondary surface**. The web/provider layer is the primary, fully-implemented path. Native ships fewer providers (see the [provider overview](/providers/overview)); validate any native flow against the platform code before relying on it.

## Where to go next

- [Installation](/getting-started/installation) — install the package and the optional peers.
- [Quick Start](/getting-started/quick-start) — sign a user in within five minutes.
- [Configuration](/getting-started/configuration) — the full `auth.configure()` shape.
- [Provider overview](/providers/overview) — the capability matrix and which providers need a backend.
- [API reference](/api/auth-singleton) — every `auth.*` method.

---

Built and maintained by [Ahsan Mahmood](https://aoneahsan.com) ([GitHub](https://github.com/aoneahsan) · [npm](https://www.npmjs.com/~aoneahsan)).
