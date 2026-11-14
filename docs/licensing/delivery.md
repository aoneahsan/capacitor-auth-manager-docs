---
title: What a managed build contains
sidebar_label: What you get
description: The parts of a white-label Capacitor Auth Manager build, from the renamed npm package and its iOS and Android plugin code to the docs site and license file, and what stays outside it.
keywords: [white label capacitor plugin contents, rebranded npm package, capacitor plugin rename podspec namespace]
last_update:
  date: 2026-11-14
  author: Capacitor Auth Manager team
---

# What a managed build contains

## The package, renamed

The package keeps the same layout as `capacitor-auth-manager`: ESM and CommonJS builds with type declarations, and the `react`, `vue`, `angular`, `core` and `providers/web` entry points. Every place the name appears is changed to yours:

| Where | Upstream | Your build |
|---|---|---|
| npm name | `capacitor-auth-manager` | `@your-scope/your-name` |
| iOS podspec | `CapacitorAuthManager` | your pod name |
| Android namespace | `com.aoneahsan.capacitor_auth_manager` | your namespace |
| Capacitor plugin name | `registerPlugin('CapacitorAuthManager')` | your plugin name |
| Default storage key prefix | `cap_auth_` | your prefix |

The iOS and Android plugin code ships inside the npm package, as it does upstream, so your apps pick it up with `npx cap sync`.

## Around the package

- README, package metadata and changelog in your name.
- These docs, rebranded, on a domain you choose.
- A license file and its PDF certificate on that docs domain, so anyone can [verify the license](./verify.md).

## Not included

- Your apps, and their Play or App Store accounts.
- The backend that turns a credential into a session. That stays your code, as it is with the upstream package.
- Providers that aren't enabled upstream. One can be enabled early for you as [custom work](/white-label/custom-work).
