---
id: angular
title: Angular service
sidebar_label: Angular
description: Use capacitor-auth-manager in Angular with AuthService, AuthModule.forRoot, and the AuthGuard / NoAuthGuard route guards — RxJS observables over the auth singleton.
---

# Angular service

The Angular adapter wraps the shared `auth` singleton in an injectable `AuthService` that exposes auth state as RxJS observables, plus an `AuthModule` for configuration and route guards. Import everything from the `/angular` entry point.

```typescript
import { AuthService, AuthModule, AuthGuard } from 'capacitor-auth-manager/angular';
```

`AuthService` is `providedIn: 'root'`, so it is available without `AuthModule`. Use `AuthModule.forRoot(...)` when you want to pass provider configuration at bootstrap.

:::info Google-first (3.x)
Google is the only enabled provider; `signIn` with another id throws `AuthErrorCode.PROVIDER_NOT_ENABLED`. The adapter re-exports the `AuthProvider` enum (recommended); the string `'google'` also works.
:::

## Module setup

```typescript
import { AuthModule } from 'capacitor-auth-manager/angular';

@NgModule({
  imports: [
    AuthModule.forRoot({
      providers: {
        google: { clientId: 'YOUR_GOOGLE_CLIENT_ID' },
      },
    }),
  ],
})
export class AppModule {}
```

`AuthModule.forRoot(config?)` forwards the config (an `AuthModuleConfig`) to `auth.configure()` via the `AUTH_CONFIG` injection token.

## Component example

```typescript
import { Component } from '@angular/core';
import { AuthService } from 'capacitor-auth-manager/angular';

@Component({
  selector: 'app-login',
  template: `
    <div *ngIf="authService.isLoading$ | async">Loading...</div>
    <div *ngIf="authService.user$ | async as user">
      <p>Welcome, {{ user.displayName }}!</p>
      <button (click)="signOut()">Sign Out</button>
    </div>
    <button
      *ngIf="!(authService.isAuthenticated$ | async)"
      (click)="signIn('google')"
    >
      Sign In with Google
    </button>
  `,
})
export class LoginComponent {
  constructor(public authService: AuthService) {}

  signIn(provider: string) {
    this.authService.signIn(provider).subscribe();
  }

  signOut() {
    this.authService.signOut().subscribe();
  }
}
```

The `signIn`/`signOut` methods return cold observables — nothing runs until you `subscribe()`.

## `AuthService` observables

| Observable | Emits |
| --- | --- |
| `state$` | The full `AuthState` |
| `user$` | `AuthUser \| null` |
| `isAuthenticated$` | `boolean` |
| `isLoading$` | `boolean` |
| `provider$` | `string \| null` |

## `AuthService` methods

Async operations return observables; synchronous getters return values directly.

| Method | Returns |
| --- | --- |
| `configure(config: AuthManagerConfig)` | `void` |
| `initialize(config?)` | `Observable<void>` |
| `signIn(providerOrOptions)` | `Observable<AuthResult>` |
| `signOut(options?)` | `Observable<void>` |
| `refreshToken(provider?)` | `Observable<AuthResult>` |
| `linkAccount(options)` | `Observable<AuthResult>` |
| `unlinkAccount(options)` | `Observable<void>` |
| `revokeAccess(token?, provider?)` | `Observable<void>` |
| `getIdToken(options?)` | `Observable<string>` |
| `updateProfile(options)` | `Observable<AuthUser>` |
| `deleteAccount(options?)` | `Observable<void>` |
| `getCurrentUser()` | `AuthUser \| null` |
| `getAuthState()` | `AuthState` |
| `isAuthenticated()` | `boolean` |
| `getCurrentProvider()` | `string \| null` |
| `getAvailableProviders()` | `Observable<string[]>` |
| `getSupportedProviders()` | `Observable<string[]>` |
| `isProviderSupported(provider)` | `Observable<boolean>` |

## Other exports

- `AuthProviderService` — per-provider service with `isSupported$` / `isConfigured$` observables and scoped `signIn(options?)` / `signOut(options?)`. Created via the factory below.
- `AuthProviderFactory` — `providedIn: 'root'` factory; `create(provider)` returns an `AuthProviderService` for that provider id.
- `AuthModule`, `AuthModuleConfig`, `AUTH_CONFIG` — module, its config interface, and the DI token carrying the `forRoot` config.
- `AuthGuard` — route guard implementing `CanActivate`, `CanActivateChild`, and `CanLoad`; redirects unauthenticated users to `/login` with a `returnUrl` query param.
- `NoAuthGuard` — inverse guard; redirects already-authenticated users to `/`.

```typescript
import { AuthGuard } from 'capacitor-auth-manager/angular';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
];
```

## Account management

`AuthService` surfaces the same account-management operations as the singleton — `linkAccount`, `unlinkAccount`, `revokeAccess`, `getIdToken`, `updateProfile`, and `deleteAccount` — each as an observable that delegates to the active provider and errors with `AuthErrorCode.OPERATION_NOT_ALLOWED` when unsupported.

## Related

- [Quick start](/getting-started/quick-start)
- [The auth singleton](/api/auth-singleton)
- [Providers overview](/providers/overview)
