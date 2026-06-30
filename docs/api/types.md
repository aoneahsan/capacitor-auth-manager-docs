---
id: types
title: Types and interfaces
sidebar_label: Types
description: Reference for capacitor-auth-manager's exported TypeScript types — AuthUser, AuthResult, AuthState, AuthManagerConfig, SignInOptions, and the provider options.
---

# Types and interfaces

capacitor-auth-manager is TypeScript-first: every configuration object, result, and user shape is a named, exported type. This page documents the types you interact with most. They are all re-exported from the package root.

```typescript
import type {
  AuthUser,
  AuthResult,
  AuthCredential,
  AuthState,
  AuthManagerConfig,
  SignInOptions,
  SignOutOptions,
  ProviderOptions,
  AuthPersistence,
} from 'capacitor-auth-manager';
```

`AuthProvider`, `AuthErrorCode`, `AuthPersistence`, `BiometricType`, and `AppleAuthScope` are `enum`s (runtime values), so import them without `type` when you need their members.

## `AuthManagerConfig`

Passed to `configure()` and `initialize()`.

| Field | Type | Notes |
|-------|------|-------|
| `providers` | `Record<string, ProviderOptions>` | Map of provider id → its options. |
| `persistence` | `'local' \| 'session' \| 'memory'` | Where the web session is stored. Default `local`. |
| `autoRefreshToken` | `boolean` | Schedule token refresh before expiry. |
| `tokenRefreshBuffer` | `number` | Milliseconds before expiry to refresh. Default `300000` (5 min). |
| `enableLogging` | `boolean` | Toggle the internal logger. |
| `logLevel` | `'debug' \| 'info' \| 'warn' \| 'error'` | Logger verbosity. |
| `storage` | `StorageInterface` | Custom storage backend. See [Storage](/api/storage). |

## `AuthState`

The shape emitted by `onAuthStateChange` and returned by `getAuthState()`. It does not carry raw tokens.

| Field | Type |
|-------|------|
| `user` | `AuthUser \| null` |
| `isLoading` | `boolean` |
| `isAuthenticated` | `boolean` |
| `provider` | `string \| null` |

`AuthStateListener` is `(state: AuthState) => void`.

## `AuthUser`

The authenticated user. `uid` is the only required field.

| Field | Type | Notes |
|-------|------|-------|
| `uid` | `string` | Stable user id. |
| `email` | `string \| null` | Optional. |
| `emailVerified` | `boolean` | Optional. |
| `displayName` | `string \| null` | Optional. |
| `photoURL` | `string \| null` | Optional. |
| `phoneNumber` | `string \| null` | Optional. |
| `isAnonymous` | `boolean` | Optional. |
| `tenantId` | `string \| null` | Optional. |
| `providerData` | `UserInfo[]` | Per-provider identities. |
| `metadata` | `UserMetadata` | Creation / sign-in timestamps. |
| `refreshToken` | `string` | Optional. |
| `customClaims` | `Record<string, string \| number \| boolean \| null>` | Optional. |

`UserInfo` carries `{ providerId, uid, displayName?, email?, phoneNumber?, photoURL? }`. `UserMetadata` carries `{ creationTime?, lastSignInTime?, lastRefreshTime? }` (all ISO strings).

## `AuthResult`

Returned by `signIn`, `refreshToken`, and `linkAccount`.

| Field | Type | Notes |
|-------|------|-------|
| `user` | `AuthUser` | The resulting user. |
| `credential` | `AuthCredential` | Tokens for this sign-in. |
| `additionalUserInfo` | `AdditionalUserInfo` | Optional. `{ isNewUser, providerId, profile?, username? }`. |
| `operationType` | `'signIn' \| 'link' \| 'reauthenticate'` | Optional. |

## `AuthCredential`

| Field | Type |
|-------|------|
| `providerId` | `string` |
| `signInMethod` | `string` |
| `accessToken` | `string` (optional) |
| `idToken` | `string` (optional) |
| `refreshToken` | `string` (optional) |
| `expiresAt` | `number` (optional, epoch ms) |
| `tokenType` | `string` (optional) |
| `scope` | `string` (optional) |
| `rawNonce` | `string` (optional) |

## `SignInOptions`

The object form accepted by `auth.signIn`.

| Field | Type | Notes |
|-------|------|-------|
| `provider` | `AuthProvider` | The provider to use (enum or its string value). |
| `credentials` | `AuthCredentials` | Optional. Union of email/password, phone, username, code, OAuth, and custom credential shapes. |
| `options` | `SignInProviderOptions` | Optional. `scopes`, `customParameters`, `loginHint`, `prompt`, `state`, `nonce`, `pkceEnabled`, and more. |

`SignOutOptions` carries `{ provider?, revokeToken?, clearCache?, redirectUrl? }`.

## `ProviderOptions`

A union of every provider's option interface — `GoogleAuthOptions`, `AppleAuthOptions`, `MicrosoftAuthOptions`, `FacebookAuthOptions`, `GitHubAuthOptions`, `SlackAuthOptions`, `LinkedInAuthOptions`, `FirebaseAuthOptions`, `EmailMagicLinkOptions`, `SmsAuthOptions`, `EmailPasswordOptions`, `PhonePasswordOptions`, `UsernamePasswordOptions`, `EmailCodeOptions`, and `BiometricAuthOptions`. Each provider page documents its own fields.

## `AuthProvider`

String enum of provider ids: `GOOGLE`, `APPLE`, `MICROSOFT`, `FACEBOOK`, `GITHUB`, `SLACK`, `LINKEDIN`, `FIREBASE`, `EMAIL_MAGIC_LINK`, `MAGIC_LINK`, `SMS`, `EMAIL_PASSWORD`, `PHONE_PASSWORD`, `USERNAME_PASSWORD`, `EMAIL_CODE`, `BIOMETRIC`. You can pass the enum member or its string value (for example `AuthProvider.GOOGLE` or `'google'`).

In 2.4.x only `AuthProvider.GOOGLE` is **enabled**. The other members exist in the enum, but signing in with them throws `AuthErrorCode.PROVIDER_NOT_ENABLED` until each provider is re-enabled. See the [provider overview](/providers/overview).

## `AuthPersistence`

```typescript
enum AuthPersistence { LOCAL = 'local', SESSION = 'session', NONE = 'none' }
```

The config accepts the literals `'local' | 'session' | 'memory'`; `'memory'` maps internally to `AuthPersistence.NONE` (in-memory, non-persisted).

## Related

- [Quick start](/getting-started/quick-start)
- [Providers overview](/providers/overview)
