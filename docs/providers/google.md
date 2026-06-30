---
id: google
title: Google authentication
sidebar_label: Google
description: Configure and use the Google provider in capacitor-auth-manager — the same signIn call on web, iOS, and Android, returning a Google id token you hand to Firebase. Native setup and the codetrix migration.
---

# Google authentication

Google is the **enabled provider** in capacitor-auth-manager (2.4.x). The same call —
`auth.signIn(AuthProvider.GOOGLE)` — dispatches natively to the right Google SDK on each platform and returns a Google credential whose `idToken` is populated everywhere:

| Platform | Mechanism | Returns |
|---|---|---|
| **Web** | Google Identity Services (id-token flow) | `idToken` only |
| **iOS** | GoogleSignIn | `idToken` + `accessToken` (+ `serverAuthCode` when `serverClientId` is set) |
| **Android** | Credential Manager | `idToken` reliably (`accessToken` / `serverAuthCode` come from the separate Google Authorization API, not the sign-in call) |

For the Firebase `signInWithCredential` handoff, the **`idToken` is all you need** on every platform.

## When you need a backend

Sign-in completes with **no backend** required. The web flow uses the GIS **id-token** flow specifically so no client secret and no server are needed. You only involve a server if you opt into a `serverAuthCode` (iOS) and exchange it for refresh tokens — and that exchange must happen on **your** server, never in the browser.

## Configuration

Use the exported `AuthProvider` enum (recommended — typo-safe; the string `'google'` also works).

```typescript
import { auth, AuthProvider } from 'capacitor-auth-manager';

auth.configure({
  providers: {
    [AuthProvider.GOOGLE]: {
      clientId: 'YOUR_WEB_OAUTH_CLIENT_ID',        // web + Android serverClientId fallback
      serverClientId: 'YOUR_WEB_OAUTH_CLIENT_ID',  // REQUIRED on Android to receive an idToken
      iosClientId: 'YOUR_IOS_OAUTH_CLIENT_ID',     // iOS (or set GIDClientID in Info.plist)
    },
  },
  persistence: 'local',
});
```

You can also set the Google options in `capacitor.config` under the plugin block instead of `auth.configure`.

## Options (`GoogleAuthOptions`)

| Option | Where | Purpose |
|---|---|---|
| `clientId` | web (required), Android fallback | Web OAuth client id; the id token's `aud`. |
| `serverClientId` | Android (required for idToken), iOS | Web OAuth client id for Credential Manager / `serverAuthCode`. |
| `iosClientId` | iOS | iOS OAuth client id (or set `GIDClientID` in `Info.plist`). |
| `scopes` | all | Extra OAuth scopes (default `openid email profile`). |
| `hostedDomain` | all | Restrict to a Google Workspace domain. |
| `loginHint` | all | Prefill an account. |
| `filterByAuthorizedAccounts` | Android | Credential Manager returning-user UX. |
| `autoSelectEnabled` | Android | One-tap auto-select for returning users. |
| `nonce` | web | Bind the request to an id-token `nonce` claim (validated). |

## Sign in

```typescript
const result = await auth.signIn(AuthProvider.GOOGLE);
const idToken = result.credential.idToken;   // present on web, iOS, and Android
```

## Hand the credential to Firebase (identical on every platform)

The package is Firebase-agnostic — it pulls in no `firebase` dependency. You feed the Google id token to Firebase yourself:

```typescript
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

const result = await auth.signIn(AuthProvider.GOOGLE);
await signInWithCredential(
  getAuth(),
  GoogleAuthProvider.credential(result.credential.idToken),
);
```

## What you get back

`signIn` resolves to an `AuthResult`:

```ts
{
  user: { uid, email, emailVerified, displayName, photoURL, providerData: [...], metadata: {...} },
  credential: {
    providerId: 'google.com',
    signInMethod: 'google.com',
    idToken?: string,        // present on web, iOS, Android
    accessToken?: string,    // iOS; web returns none; Android not from the sign-in call
    serverAuthCode?: string, // iOS when serverClientId + offline access; exchange on YOUR server only
  },
}
```

Per-platform token availability (honest):

- **Web** (GIS id-token flow): returns **`idToken`** only — no `accessToken`. If you need to call Google APIs from the browser, use the GIS token client separately.
- **iOS** (GoogleSignIn): `idToken` + `accessToken` (+ `serverAuthCode` when `serverClientId` is set).
- **Android** (Credential Manager): returns **`idToken`** reliably. `accessToken` / `serverAuthCode` require the separate Google Authorization API and are not returned by the sign-in call (planned).

## Native setup

### Android

1. In Google Cloud / Firebase, create an **Android** OAuth client and add your app's **SHA-1/SHA-256** signing fingerprints; create (or reuse) a **Web** OAuth client.
2. Pass that **Web** client id as `serverClientId` (Credential Manager needs it to return an idToken).
3. Add your app's `google-services.json` to the Android project as usual.
4. The device must have a Google account signed in (Credential Manager shows that account chooser).

No extra `AndroidManifest` permissions are required by this plugin.

### iOS

1. Create an **iOS** OAuth client in Google Cloud.
2. Add `GIDClientID` (your iOS client id) to `Info.plist`, or pass it as `iosClientId`.
3. Add the **reversed client id** as a URL scheme in `Info.plist` → `CFBundleURLTypes` (e.g. `com.googleusercontent.apps.XXXX`).
4. For a `serverAuthCode`, also set `serverClientId` (your Web client id).

## Migrating from `@codetrix-studio/capacitor-google-auth` {#migrating-from-codetrix-studiocapacitor-google-auth}

```ts
// before
await GoogleAuth.initialize({ clientId });
const u = await GoogleAuth.signIn();
await signInWithCredential(getAuth(), GoogleAuthProvider.credential(u.authentication.idToken));

// after
import { auth, AuthProvider } from 'capacitor-auth-manager';
auth.configure({ providers: { [AuthProvider.GOOGLE]: { clientId, serverClientId, iosClientId } } });
const res = await auth.signIn(AuthProvider.GOOGLE);
await signInWithCredential(getAuth(), GoogleAuthProvider.credential(res.credential.idToken));
```

The id token moves from `result.authentication.idToken` to `result.credential.idToken`. Everything else (the native account chooser, the Firebase handoff) behaves the same.

## Security & storage

- **No secrets are persisted by default.** Short-lived id tokens are re-derived from the Google SDK's silent restore rather than written to `localStorage` / `@capacitor/preferences`. Inject a `StorageInterface` (ideally Keychain/Keystore-backed) if you need token persistence at rest.
- The web flow uses the GIS **id-token** flow specifically so **no client secret and no backend** are required. A `serverAuthCode` (iOS) must be exchanged on **your** server, never in the browser.
- The package does not verify id-token signatures in the browser — validate the id token server-side (or via Firebase) before trusting its claims.

## Notes & caveats

- Web Google sign-in uses One-Tap / FedCM `prompt()`; if One-Tap is suppressed (cooldown), render Google's official button via the provider's `renderButton(element)` escape hatch, or use your own Firebase popup on web.
- The iOS (Swift) and Android (Java) sources are written to the official SDK contracts but are not compiled in CI. Validate a new version in one app (web + one Android device + one iOS device) before rolling it out widely.

## Related

- [Quick Start](/getting-started/quick-start)
- [Configuration](/getting-started/configuration)
- [auth singleton API](/api/auth-singleton)
- [Providers overview](/providers/overview)
