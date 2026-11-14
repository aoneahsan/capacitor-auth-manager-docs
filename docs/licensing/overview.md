---
title: White-label and licensing
sidebar_label: Overview
description: How a white-label license for Capacitor Auth Manager works, what a managed build under your npm scope includes, and where prices and terms live.
keywords: [capacitor-auth-manager white label, rebrand capacitor auth plugin, white label npm package, capacitor google sign-in sdk license]
last_update:
  date: 2026-11-14
  author: Capacitor Auth Manager team
---

# White-label and licensing

A white-label license gets you Capacitor Auth Manager published under your own npm name. We rename the package across npm, iOS and Android, publish each release to your scope, host these docs on your domain with your name and logo, and keep the build in step with `capacitor-auth-manager`.

The code is public under MIT, and that doesn't change. Anyone can fork it. The license buys the managed work and the right to say your package is built on Capacitor Auth Manager, logo included, which MIT doesn't grant. Because the source is already open there's no buyout, and a license isn't exclusive.

## What stays the same

Your build has the same API and the same providers as the release it's built from. `auth.signIn(AuthProvider.GOOGLE)` returns the same credential, and in 3.x Google is the only enabled provider, on web, iOS and Android. Exchanging that credential for a session is still your backend's job.

## In this section

- [What a managed build contains](./delivery.md)
- [Setup, from request to first publish](./setup.md)
- [Updates and renewals](./updates.md)
- [Verifying a license](./verify.md)
- [Questions](./faq.md)

The price is on the [pricing page](/white-label/pricing), quoted live by our licensing service. The agreement is in the [license terms](/white-label/license-terms).
