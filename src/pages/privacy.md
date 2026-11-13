---
title: Privacy Policy
description: What the capacitor-auth-manager package does with sign-in data inside your app, what it never sends anywhere, and what this documentation site records.
---

# Privacy Policy

**Last updated:** November 13, 2026 · **Applies to:** the `capacitor-auth-manager` npm package (3.x) and this documentation site.

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

capacitor-auth-manager-docs.aoneahsan.com is a static site on GitHub Pages. It sets no cookies and loads no analytics. GitHub serves the pages and sees the usual request details, such as your IP address, under its own privacy statement.

## Contact

Questions about this page: [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com). When the package or the site starts handling anything new, this page changes first and the date above moves.
