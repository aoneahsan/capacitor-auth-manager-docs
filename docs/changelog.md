---
id: changelog
title: Changelog
sidebar_label: Changelog
description: Release history for capacitor-auth-manager — 2.5.0 (Google hardened on every layer), the 2.4.x Google-first releases, 2.3.0 and 2.2.0, latest first.
---

# Changelog

Release notes for `capacitor-auth-manager`, latest first. This mirrors the package's [full CHANGELOG](https://github.com/aoneahsan/capacitor-auth-manager/blob/main/CHANGELOG.md), which follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

## 2.5.0 — 2026-09-08 — Google hardened on every layer

- **Bare Node ESM and server-side imports work.** Every relative import in the published build carries its `.js` extension, the `auth` singleton is created lazily, and browser storage is guarded — `import`/`require` under Node, SSR and test runners no longer throw. A tarball smoke test guards this on every publish.
- **Web: OAuth2 popup fallback.** New `webFlow` option (`'auto'` default · `'one-tap'` · `'popup'`). When One-Tap is not displayed, the popup returns an `accessToken` Firebase accepts. A dismissed One-Tap rejects with `USER_CANCELLED` instead of hanging.
- **Android: Sign in with Google button fallback.** New `androidFlow` option (`'auto'` default · `'bottom-sheet'` · `'button'`). The manifest now declares only `INTERNET` (the Play-restricted SMS permissions are gone), `getCurrentUser` resolves exactly once, `androidx.credentials` 1.5.0.
- **Native sign-out state is honest:** an empty native result is no longer treated as a signed-in user on cold start.
- `@capacitor/core` is a **required** peer; the unused `capacitor-biometric-authentication` optional dependency was removed; Node `>=24`.
- Per-call sign-in options (`nonce`, `loginHint`, the flow selectors) now reach the native side.
- **`auth.getIdToken()` works on iOS and Android.** It previously threw `OPERATION_NOT_ALLOWED` on native — the bridge never exposed the method, even though both native layers implement it — while the same call worked on web.
- **Native errors carry a real `AuthErrorCode`.** Android and iOS used to reject with only a message, so the code was guessed by substring-matching it and anything without "cancelled"/"network"/"timeout" surfaced as `auth/internal-error`. A cancelled sheet is now `auth/user-cancelled`, an interrupted request `auth/network-error`, a missing `serverClientId` `auth/missing-configuration`.
- **Android no longer falls back to plaintext storage.** When the keystore cannot produce a master key, the session is kept in memory for the life of the process instead of writing ID tokens to disk unencrypted.
- The Android plugin and the example app are compiled and run on an emulator before release (Gradle 8.14.3 / AGP 8.13 / JDK 21 / compileSdk 36). The iOS error-code change is not compile-verified and ships as such.

## 2.4.2 – 2.4.4 — 2026-06-30 … 2026-07-25

- 2.4.2: Android and iOS sources compile in a clean Capacitor 8 app (2.4.1 is deprecated — its native code never compiled).
- 2.4.3 / 2.4.4: documentation and metadata only; the README documented the Node ESM and SSR defects that 2.5.0 fixes.

## 2.4.1 — Google-first

The package is repositioned as a **Firebase-agnostic Google authentication** plugin — a drop-in alternative to `@codetrix-studio/capacitor-google-auth` — and brought to production **one provider at a time**.

- **Google is the only enabled provider.** `auth.signIn(AuthProvider.GOOGLE)` dispatches natively to GoogleSignIn (iOS), Credential Manager (Android), and Google Identity Services (web), returning `result.credential.idToken` on every platform for the Firebase `signInWithCredential` handoff.
- The other 14 providers (apple, microsoft, facebook, github, slack, linkedin, firebase, magic-link, sms, email/phone/username-password, email-code, biometric) are **un-registered** — calling them throws `AuthErrorCode.PROVIDER_NOT_ENABLED`. They are re-enabled and verified on device one at a time.
- Enum-first usage is recommended: `import { auth, AuthProvider } from 'capacitor-auth-manager'`. The string `'google'` still works.
- No secrets are persisted by default; the web flow returns an id token only (no client secret, no backend required).

## 2.4.0 — 2026-05-27

Type-safety and tooling cleanup, **no runtime behavior change**. Public types were tightened (hence a minor, not a patch).

- Eliminated all 37 remaining `no-explicit-any` occurrences; the linter now reports 0 errors and 0 warnings.
- `StorageInterface` is now generic: `get<T>(key)` / `set<T>(key, value)`. Existing custom implementations stay compatible; direct callers should pass a type argument or narrow.
- Angular adapter method parameters use real types (`AuthManagerConfig`, `SignInOptions`, `SignOutOptions`, `ProviderOptions`).
- Completed the ESLint 9 → 10 migration (`eslint.config.mjs`, flat-config `ignores`).

## 2.3.0 — 2026-05-26

Internal refactor only, **no breaking changes** and no public signature change.

- The 7 web providers that implemented `AuthProviderInterface` directly (`magic-link`, `sms`, `email-code`, `email-password`, `username-password`, `phone-password`, `biometric`) now extend the shared `BaseAuthProvider`. All 15 web providers share one construction, event, state, and capability path.
- Provider constructors accept either the injected config (factory/registry) or a bare config object (direct construction) via `resolveProviderConfig` — existing `new XProvider(config)` usage keeps working.

## 2.2.0 — 2026-05-26

A backward-compatible release that repaired broken runtime paths, hardened security, completed the stub providers, and updated dependencies.

- **Security**: S256 PKCE on manual OAuth code flows (Slack, LinkedIn); OIDC nonce + ID-token `exp` validation (signatures are not verified client-side — re-validate server-side); pluggable secure storage with the new `CapacitorPreferencesStorage`; AES-GCM web fallback for biometric material; `AuthError.details` sanitized.
- **Fixes**: repaired the primary `auth` API for OAuth and credential providers; correct credential threading; underscore provider-id resolution; session restore after `configure()`; GitHub sign-in via `tokenExchangeProxy`; real Slack/LinkedIn profile fetches; Firebase `defaultMethod`; in-memory persistence fixed; 32-bit refresh-timer overflow guarded.
- **Features**: account-management methods on the singleton and all adapters (`linkAccount`, `unlinkAccount`, `revokeAccess`, `getIdToken`, `updateProfile`, `deleteAccount`); `isProviderConfigured()` / `getConfiguredProviders()`; new exports `WebStorage`, `CapacitorPreferencesStorage`, `StorageInterface`, `defaultLogger`.
- **Dependencies**: all updated to current stable (TypeScript 6, ESLint 10, Capacitor 8); peer ranges widened (`@capacitor/core ^7 || ^8`, `@angular/core` through `^21`); iOS deployment target raised to 14.

For the complete, unabridged notes see the [CHANGELOG on GitHub](https://github.com/aoneahsan/capacitor-auth-manager/blob/main/CHANGELOG.md).
