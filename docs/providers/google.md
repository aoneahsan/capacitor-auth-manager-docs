---
id: google
title: Google authentication
sidebar_label: Google
description: Configure and use the Google provider in capacitor-auth-manager — the same signIn call on web, iOS, and Android, returning a Google ID or access token you hand to Firebase. Native setup and the codetrix migration.
---

# Google authentication

Google is the **enabled provider** in capacitor-auth-manager (3.x). The same call —
`auth.signIn(AuthProvider.GOOGLE)` — dispatches natively to the right Google SDK on each platform and returns a Google credential containing an ID token or an access token, depending on the flow:

| Platform | Mechanism | Returns |
|---|---|---|
| **Web** | Google Identity Services | One-Tap: `idToken`; popup: `accessToken` |
| **iOS** | GoogleSignIn | `idToken` + `accessToken` (+ `serverAuthCode` when `serverClientId` is set) |
| **Android** | Credential Manager | `idToken` reliably (`accessToken` / `serverAuthCode` come from the separate Google Authorization API, not the sign-in call) |

For Firebase, use `GoogleAuthProvider.credential(idToken ?? null, accessToken ?? null)` so both web flows work.

## When you need a backend

Sign-in completes with **no backend** required. Both web flows use Google Identity Services and need no client secret. You only involve a server if you opt into a `serverAuthCode` (iOS) and exchange it for refresh tokens — and that exchange must happen on **your** server, never in the browser.

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
      webFlow: 'popup',                          // direct click; Firebase accepts access tokens
    },
  },
  persistence: 'memory',
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
| `nonce` | web, iOS, Android | Bind the request to an id-token `nonce` claim (validated). |
| `webFlow` | web | `'auto'` (default: One-Tap, then the OAuth2 popup if One-Tap is not shown) · `'one-tap'` · `'popup'`. Also accepted per call in `signIn({ options })`. |
| `androidFlow` | Android | `'auto'` (default: Credential Manager bottom sheet, then the Sign in with Google button flow if no account is offered) · `'bottom-sheet'` · `'button'`. Also accepted per call. |

## Sign in

```typescript
const result = await auth.signIn(AuthProvider.GOOGLE);
const idToken = result.credential.idToken;         // One-Tap (web), iOS, Android
const accessToken = result.credential.accessToken; // web popup fallback, iOS
```

## Hand the credential to Firebase (identical on every platform)

The package is Firebase-agnostic — it pulls in no `firebase` dependency. You feed the Google id token to Firebase yourself:

```typescript
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

const result = await auth.signIn(AuthProvider.GOOGLE);
const { idToken, accessToken } = result.credential;
await signInWithCredential(
  getAuth(),
  GoogleAuthProvider.credential(idToken ?? null, accessToken),
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
    idToken?: string,        // web One-Tap, iOS, Android
    accessToken?: string,    // web popup and iOS; not returned by Android sign-in
    serverAuthCode?: string, // iOS when serverClientId + offline access; exchange on YOUR server only
  },
}
```

Per-platform token availability (honest):

- **Web** (GIS): One-Tap returns an **`idToken`**; the OAuth2 popup fallback returns an **`accessToken`** (and the Google profile). Firebase accepts either — `GoogleAuthProvider.credential(idToken ?? null, accessToken)`. See [Web platform](/platforms/web).
- **iOS** (GoogleSignIn): `idToken` + `accessToken` (+ `serverAuthCode` when `serverClientId` is set).
- **Android** (Credential Manager): returns **`idToken`** reliably — from the bottom sheet or, when no account is offered, from the Sign in with Google button flow (`androidFlow: 'auto'`). `accessToken` / `serverAuthCode` require the separate Google Authorization API and are not returned by the sign-in call (planned).

For the complete React/Firebase bootstrap, Firebase session ownership, and failure handling, use the [AI integration guide](/integration/ai).

## Native setup

### Android

1. In Google Cloud / Firebase, create an **Android** OAuth client and add your app's **SHA-1/SHA-256** signing fingerprints; create (or reuse) a **Web** OAuth client.
2. Pass that **Web** client id as `serverClientId` (Credential Manager needs it to return an idToken).
3. No `google-services.json` is needed by this plugin — it uses no Firebase native SDK. Credential Manager needs only the registered fingerprint and the Web client id.
4. A Google account on the device gives the fastest path (the bottom sheet); with none, the button flow lets the user add one.

The plugin declares only `INTERNET`; no SMS, contacts or biometric permissions are added to your manifest.

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
await signInWithCredential(getAuth(), GoogleAuthProvider.credential(res.credential.idToken ?? null, res.credential.accessToken ?? null));
```

The id token moves from `result.authentication.idToken` to `result.credential.idToken`. Use both credential fields in Firebase handoff because the web popup returns an access token.

## Security & storage

- **No secrets are persisted by default.** Short-lived id tokens are re-derived from the Google SDK's silent restore rather than written to `localStorage` / `@capacitor/preferences`. Storage adapters hold profile/session metadata, not bearer credentials. Android tokens are memory-only; the iOS Google SDK owns its Keychain session.
- Both GIS web flows require no client secret. A `serverAuthCode` (iOS) must be exchanged on **your** server, never in the browser.
- The package does not verify id-token signatures in the browser — validate the id token server-side (or via Firebase) before trusting its claims.

## Notes & caveats

- Web Google sign-in tries One-Tap / FedCM first and falls back to the OAuth2 popup by default (`webFlow: 'auto'`). A dismissed One-Tap rejects with `USER_CANCELLED`; a closed popup with `POPUP_CLOSED_BY_USER`. Google's branded button is available via `renderButton(element)` on the web provider class — it is not a method on the `auth` singleton, so reach it with `import { GoogleAuthProviderWeb } from 'capacitor-auth-manager/providers/web'` and construct the provider yourself.
- Native consumers compile in package CI. Validate a new version in one app (web + one Android device + one iOS device) before rolling it out widely.

## Related

- [Quick Start](/getting-started/quick-start)
- [Configuration](/getting-started/configuration)
- [auth singleton API](/api/auth-singleton)
- [Providers overview](/providers/overview)
