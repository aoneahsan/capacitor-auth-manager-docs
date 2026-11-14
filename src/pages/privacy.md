---
title: Privacy Policy
description: What the capacitor-auth-manager package does with sign-in data inside your app, what it never sends anywhere, what this documentation site records, and what its white-label pages send.
---

# Privacy Policy

**Last updated:** November 14, 2026 · **Applies to:** the `capacitor-auth-manager` npm package (3.x), this documentation site and its white-label license pages.

Capacitor Auth Manager is a library. It runs inside the app that installs it, and it has no server of its own. We, the Capacitor Auth Manager team, never receive the credentials, profiles or tokens it handles.

## The package and the app that uses it

The app that installs the package decides which provider to enable, which backend receives the credential and what it stores about its users. That app's own privacy policy covers those choices. This page covers only what the package itself does.

## What the package does with sign-in data

When a user signs in with Google, the package talks to Google directly from the user's device:

| Step | What happens |
|---|---|
| Web sign-in | Loads Google Identity Services from `accounts.google.com` and receives a Google ID token or access token. With an access token, it reads the user's profile from Google's `userinfo` endpoint. |
| Native sign-in (Android) | Uses Android Credential Manager and receives the Google credential on the device. |
| Handing it on | Returns the credential to your app's code. Exchanging it for a backend session is your app's job; the package sends it nowhere else. |

Google is the only enabled provider in 3.x. Google's own privacy policy covers what Google records during sign-in.

## What it keeps on the device

After sign-in, the package stores a session snapshot (the user's profile fields, the provider name and a credential with its tokens removed) under keys prefixed `cap_auth_`. By default that is the browser's `localStorage`; your app can choose session storage, memory only, or its own storage adapter. ID, access and refresh tokens are not written to the default storage. Signing out removes the snapshot.

## What it never does

- It has no telemetry, analytics or crash reporting.
- It sends nothing to us or to any server other than the provider your app configured.
- It does not show ads or share data with third parties.

## This documentation site

capacitor-auth-manager-docs.aoneahsan.com is a static site on GitHub Pages. It sets no cookies and loads no analytics. GitHub serves the pages and sees the usual request details, such as your IP address, under its own privacy statement. The white-label and verify pages are the one place the site sends requests elsewhere, described next.

## White-label and license pages

The pages under `/white-label` and the `/verify-license` page ask our licensing service for prices, quotes and license checks, straight from your browser, so your IP address and the request reach it. When you send a form there, it receives what you typed: your name, email, company, npm scope, docs domain and message. When online payment is open, continuing to pay takes you to the payment provider's own checkout page, under its own privacy policy.

For a license we keep your name, email, company, domain, order and license key, to deliver the build, answer verification checks and send renewal notices. A public verification shows only the client name, the licensed domains, the license type, its status and its dates, never your email or the price.

Payments for licenses, renewals and custom work are final. NO REFUNDS. The [Terms of Service](/terms) carry the full terms.

## Contact

Questions about this page: [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com). When the package or the site starts handling anything new, this page changes first and the date above moves.
