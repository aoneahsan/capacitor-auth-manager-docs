---
title: Verifying a license
sidebar_label: Verify a license
description: How to check a Capacitor Auth Manager white-label license by its CAPAUTH-WL- key or by the license file its docs domain serves.
keywords: [verify capacitor auth manager license, white label license file, well-known license json]
last_update:
  date: 2026-11-14
  author: Capacitor Auth Manager team
---

# Verifying a license

Paste a license key or a docs domain into the [verify page](/verify-license). Verification is run by our licensing service.

## The license file

Every licensed build's docs domain serves two files:

- `/.well-known/capauth-white-label-license.json`
- `/.well-known/capauth-white-label-license.pdf`, the public certificate

The JSON names the license, so a check by domain can find it:

```json
{
  "$schema": "capacitor-auth-manager-white-label-license",
  "product": "Capacitor Auth Manager",
  "publicKey": "CAPAUTH-WL-…",
  "client": "Your company",
  "domain": "auth-docs.example.com",
  "verifyUrl": "https://capacitor-auth-manager-docs.aoneahsan.com/verify-license?key=CAPAUTH-WL-…",
  "issuedAt": "2026-11-14T00:00:00Z"
}
```

We add both files when we deploy your docs. You don't need to do anything.

## What a check returns

A check shows the client name, the licensed domains, the license status and its dates. It never shows an email address or a price.
