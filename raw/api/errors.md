---
id: errors
title: Errors and error codes
sidebar_label: Errors
description: Reference for AuthError, isAuthError, and the AuthErrorCode enum in capacitor-auth-manager, including the auth/<slug> code format and handling patterns.
---

# Errors and error codes

Every failure surfaced by capacitor-auth-manager is an `AuthError` — an `Error` subclass with a stable, machine-readable `code`. You branch on `error.code` rather than parsing messages, which keeps your handling resilient across versions and providers.

```typescript
import { AuthError, isAuthError, AuthErrorCode } from 'capacitor-auth-manager';
```

## `AuthError`

```typescript
class AuthError extends Error {
  code: string;
  message: string;
  provider?: AuthProvider;
  details?: Record<string, unknown>;
  constructor(
    code: string,
    message: string,
    provider?: AuthProvider,
    details?: Record<string, unknown>
  );
  toJSON(): { name; code; message; provider; details };
}
```

| Member | Notes |
|--------|-------|
| `name` | Always `'AuthError'`. |
| `code` | An `auth/<slug>` string, normally an `AuthErrorCode` value. |
| `provider` | The `AuthProvider` that raised it, when known. |
| `details` | A sanitized, shallow, JSON-safe bag (see below). |

### `AuthError.fromError(error, provider?)`

A static helper the singleton uses internally to normalize anything thrown by a provider into an `AuthError`. If the input is already an `AuthError` it is returned unchanged. Otherwise it defaults the code to `auth/internal-error`, then maps common message patterns: text containing `network` or `timeout` becomes `auth/network-error`, and `cancelled`/`canceled` becomes `auth/user-cancelled`. If the original object carries a `code` that is a valid `AuthErrorCode`, that code is preserved.

### Sanitized `details`

`AuthError.sanitizeDetails` (run in the constructor) redacts keys matching `token`, `secret`, `password`, `authorization`, `code_verifier`, `client_secret`, `credential`, `api[-_]?key`, or `cookie` to `'[redacted]'`, and keeps only JSON-safe primitives (string, number, boolean, null). This prevents tokens or PII from a raw error or a token-endpoint response body from being captured into `details` (and thus logged or serialized via `toJSON()`).

## `isAuthError(error)`

A type guard. Returns `true` for an `AuthError` instance, and also for a plain object whose `name` is `'AuthError'` and which has a defined `code` (useful across realm boundaries where `instanceof` can fail).

```typescript
function isAuthError(error: unknown): error is AuthError;
```

## The `AuthErrorCode` enum

`AuthErrorCode` is a string enum. Every value follows the `auth/<slug>` format — for example `AuthErrorCode.WRONG_PASSWORD === 'auth/wrong-password'`. Because the values are plain strings you can compare `error.code` against either the enum member or the literal. The enum has 100+ members; the table below groups the important ones by theme.

| Theme | Representative codes |
|-------|----------------------|
| Credentials & accounts | `auth/invalid-credentials`, `auth/user-not-found`, `auth/wrong-password`, `auth/email-already-in-use`, `auth/weak-password`, `auth/invalid-email`, `auth/requires-recent-login`, `auth/credential-already-in-use`, `auth/account-exists-with-different-credential`, `auth/credentials-required` |
| Verification & OTP codes | `auth/invalid-verification-code`, `auth/invalid-code`, `auth/code-expired`, `auth/expired-action-code`, `auth/no-pending-verification`, `auth/too-many-attempts`, `auth/send-code-failed`, `auth/send-link-failed`, `auth/verification-failed` |
| OAuth, popup & redirect | `auth/popup-blocked`, `auth/popup-closed-by-user`, `auth/redirect-cancelled-by-user`, `auth/missing-redirect-url`, `auth/invalid-state`, `auth/unauthorized-domain`, `auth/access-denied`, `auth/consent-required`, `auth/invalid-grant`, `auth/user-cancelled` |
| PKCE & nonce | `auth/missing-code-verifier`, `auth/invalid-code-verifier`, `auth/missing-nonce`, `auth/invalid-nonce`, `auth/missing-or-invalid-nonce` |
| Biometric | `auth/biometric-not-available`, `auth/biometric-not-enrolled`, `auth/biometric-authentication-failed`, `auth/biometric-lockout` |
| Provider & configuration | `auth/provider-not-enabled`, `auth/operation-not-allowed`, `auth/unsupported-provider`, `auth/missing-configuration`, `auth/missing-config`, `auth/provider-not-initialized`, `auth/provider-init-failed`, `auth/no-auth-session`, `auth/not-authenticated` |
| Tokens | `auth/invalid-user-token`, `auth/token-expired`, `auth/user-token-expired`, `auth/invalid-token`, `auth/token-refresh-failed`, `auth/no-refresh-token` |
| Network & server | `auth/network-error`, `auth/too-many-requests`, `auth/quota-exceeded`, `auth/server-error`, `auth/temporarily-unavailable`, `auth/internal-error`, `auth/captcha-check-failed` |
| Storage | `auth/keychain-error`, `auth/storage-error`, `auth/no-stored-credentials` |

Two notes on accuracy:

- In 3.x only **Google** is enabled. Calling `signIn` (or any operation) with a non-Google provider id throws `AuthErrorCode.PROVIDER_NOT_ENABLED` (`auth/provider-not-enabled`). The other providers are re-enabled one at a time — see the [provider overview](/providers/overview).
- Account-management methods (`linkAccount`, `unlinkAccount`, `revokeAccess`, `updateProfile`, `deleteAccount`) throw `AuthErrorCode.OPERATION_NOT_ALLOWED` when the active provider does not implement them, and `AuthErrorCode.NO_AUTH_SESSION` when there is no session. `getIdToken` is implemented by Google on web, iOS and Android.
- Since 3.0.0 the native layers send the code across the bridge, so an error raised by Android or iOS carries the same `AuthErrorCode` values as a web one. Before that the code was inferred from the message and most native failures arrived as `auth/internal-error`.
- `refreshToken()` throws the string code `auth/operation-not-supported` when a provider cannot refresh. That literal is not a member of the `AuthErrorCode` enum — match on the string if you handle it.

## Handling pattern

```typescript
import { auth, isAuthError, AuthErrorCode } from 'capacitor-auth-manager';

try {
  await auth.signIn('google');
} catch (error) {
  if (!isAuthError(error)) throw error;

  switch (error.code) {
    case AuthErrorCode.POPUP_CLOSED_BY_USER:
    case AuthErrorCode.USER_CANCELLED:
      // user backed out — usually no message needed
      break;
    case AuthErrorCode.NETWORK_ERROR:
      showRetry();
      break;
    case AuthErrorCode.MISSING_CONFIGURATION:
      console.error('Provider was not configured:', error.provider);
      break;
    default:
      showGenericError(error.message);
  }
}
```

## Related

- [Quick start](/getting-started/quick-start)
- [Providers overview](/providers/overview)
