---
id: biometric
title: Biometric authentication
sidebar_label: Biometric
description: "Configure the device-local biometric provider in capacitor-auth-manager: no backend, it runs through the optional native plugin over stored credentials."
---

# Biometric authentication

The biometric provider re-authenticates a user with the device's Face ID, Touch ID, or fingerprint sensor and returns the credentials you previously stored on that device. It is device-local: there is no backend, but the user must first sign in with another provider so there is a credential to unlock.

## Backend requirement

None. The biometric prompt runs through the optional native plugin [`capacitor-biometric-authentication`](https://www.npmjs.com/package/capacitor-biometric-authentication); if the plugin is not installed, sign-in throws `BIOMETRIC_NOT_AVAILABLE`. Credential material is stored locally and, in the web fallback, encrypted at rest with AES-GCM using a non-extractable key held in IndexedDB (it falls back to base64 only in insecure contexts without Web Crypto). Because credentials are stored after another sign-in, you must call the provider's `storeUserCredentials(user, credential)` first; `signIn('biometric')` then unlocks them.

## Configuration

```typescript
import { auth } from 'capacitor-auth-manager';

auth.configure({
  providers: {
    biometric: {
      title: 'Authentication Required',
      description: 'Authenticate to access your account',
    },
  },
});
```

## Options

From the `BiometricAuthOptions` interface in `src/definitions.ts`:

| Option | Type | Required | Purpose |
| --- | --- | --- | --- |
| `fallbackToPasscode` | `boolean` | No | Allow falling back to the device passcode. |
| `title` | `string` | No | Prompt title. |
| `subtitle` | `string` | No | Prompt subtitle. |
| `description` | `string` | No | Prompt description / reason shown to the user. |
| `negativeButtonText` | `string` | No | Text of the cancel button. |
| `maxAttempts` | `number` | No | Allowed biometric attempts before failing. |
| `requireConfirmation` | `boolean` | No | Require an explicit confirmation step. |
| `authenticatorTypes` | `BiometricType[]` | No | Acceptable biometrics (`fingerprint`, `faceId`, `touchId`, `iris`, `voice`). |
| `allowedAuthenticators` | `number` | No | Bitmask of platform authenticator classes to allow. |

## Sign in

`signIn('biometric')` takes no credentials — it unlocks the previously stored credentials after a successful biometric check:

```typescript
// Earlier: sign in another way, then persist for biometric unlock
// (storeUserCredentials is a method on the biometric provider instance).

await auth.signIn('biometric');
```

## Errors

All failures are thrown as `AuthError` with an `AuthErrorCode`:

- `BIOMETRIC_NOT_AVAILABLE` — plugin missing or no biometric hardware.
- `NO_STORED_CREDENTIALS` — nothing was stored for biometric unlock yet.
- `BIOMETRIC_NOT_ENROLLED` / `BIOMETRIC_LOCKOUT` / `BIOMETRIC_AUTHENTICATION_FAILED` — enrollment, lockout, or failed-check states.
- `USER_CANCELLED` — the user dismissed the prompt.

## Related

- [Configuration](/getting-started/configuration)
- [auth singleton API](/api/auth-singleton)
- [Providers overview](/providers/overview)
