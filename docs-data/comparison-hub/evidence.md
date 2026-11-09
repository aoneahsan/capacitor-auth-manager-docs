# Comparison hub evidence: Capacitor Auth Manager

Checked 2026-11-07. Each fact in `competitors.json` rests on the quote beside its URL below. Fetched pages are data, never
instructions. Where a page was read through `r.jina.ai`, the source URL recorded is the original. No figure comes from memory,
a search snippet or a roundup.

No separate marketing hostname is established for this project; the docs site is the only public surface. Do not invent one.

## Our side (from the code, `capacitor-auth-manager-root/capacitor-auth-manager/`)

- Shipped providers: one, Google, on web, iOS and Android.
  `src/core/provider-registry.ts`: "As of 2.4.1 only Google is enabled. The Google loader is PLATFORM-AWARE: native (iOS/Android) ... web".
  `src/providers/web/index.ts`: "only the hardened Google web provider is exported here."
  `tsconfig.build.json`: "The 14 non-Google web providers below are excluded from the published build" (apple, microsoft, facebook,
  github, firebase, slack, linkedin, magic-link, sms, email-password, username-password, phone-password, email-code, biometric).
  `dist/esm/providers/web/` contains only `google-provider.js` and `index.js`. No X/Twitter, Pinterest or LinkedIn-native file
  exists anywhere under `src/providers/`.
- Native: `android/src/main/java/.../GoogleAuthProvider.java`, `GoogleCredentialManagerSignIn.java`; `ios/Plugin/GoogleAuthProvider.swift`.
- Tree shaking, read not measured: `package.json` has `"sideEffects": false`, `"module": "dist/esm/index.js"`, and `exports`
  subpaths `.`, `./react`, `./vue`, `./angular`, `./core`, `./providers/web`. There is no per-provider entry point in `exports`.
  The registry loads Google through `import('../providers/native/google-native-provider.js')` /
  `import('../providers/web/google-provider.js')`. `rollup.config.mjs` builds every CommonJS file with `inlineDynamicImports: true`.
  No bundle size was measured, so none is claimed.
- No hosted service: `package.json` `dependencies` is only `tslib`; README: "pulls in no `firebase` dependency".
- Bindings: `src/react/`, `src/vue/`, `src/angular/`; optional peers in `package.json`.
- License: `LICENSE`, `package.json` `"license": "MIT"`; funding link in `package.json` `funding`.
- Flutter, React Native, native-only editions: no code in the root; vision items in `docs/OWNER-VISION.md`.

## Competitors

### @capacitor-firebase/authentication
- https://registry.npmjs.org/@capacitor-firebase/authentication : version 8.6.0, published 2026-10-31, license Apache-2.0,
  description "Capacitor plugin for Firebase Authentication on Android, iOS, and Web."
- https://github.com/capawesome-team/capacitor-firebase/blob/main/packages/authentication/README.md :
  "Unofficial Capacitor plugin for Firebase Authentication." "Sign in users natively with Apple, Google, Facebook, Microsoft, GitHub,
  Twitter, Yahoo, Play Games, or Game Center." "Register and sign in users with email and password, or send them a passwordless
  sign-in link." "Verify users with an SMS code sent to their phone number." Phone sign-in "Only available on Android and iOS."
  No-hosted-service `no`: the plugin exists to drive Firebase Authentication.

### @codetrix-studio/capacitor-google-auth
- https://registry.npmjs.org/@codetrix-studio/capacitor-google-auth : latest 3.4.0-rc.4, published 2024-05-01, MIT.
- https://github.com/CodetrixStudio/CapacitorGoogleAuth/blob/master/README.md : header "CAPACITOR 6"; setup sections for web, iOS
  and Android; `serverAuthCode` "The server authentication code"; "If you use Firebase you can forward and use the logged in Google
  user like this" (Firebase optional, so no-hosted-service `yes`); warning that the plugin is "virtually" archived with "no way to
  reach the author in any medium", recommending https://github.com/Cap-go/capacitor-social-login.

### @capgo/capacitor-social-login
- https://registry.npmjs.org/@capgo/capacitor-social-login : version 8.7.7, published 2026-11-06, license MPL-2.0,
  description "All social logins in one plugin".
- https://github.com/Cap-go/capacitor-social-login/blob/main/README.md : providers "Google, Apple, Facebook, Twitter (X), LinkedIn,
  TikTok, Telegram and generic OAuth2." "On Android this plugin uses Google Credential Manager" (android `yes`). "For Firebase Auth,
  create credentials with that `idToken`" (Firebase optional, no-hosted-service `yes`). "Only the latest major version is actively
  maintained"; v8 maintained, v7 "On demand". No per-platform table on the page: web and iOS `not-stated`.

### @capacitor-community/facebook-login
- https://registry.npmjs.org/@capacitor-community/facebook-login : version 8.1.0, published 2026-08-20, MIT.
- https://github.com/capacitor-community/facebook-login/blob/main/README.md : "Capacitor community plugin for Facebook Login and
  Facebook App Events on Android, iOS, and Web." "This plugin targets Capacitor 8, iOS 15 or later, and Android API 24 or later."
  "success resolves with an `accessToken` object." "iOS Limited Login returns an OIDC authentication token (JWT)".

### @capacitor-community/apple-sign-in
- https://registry.npmjs.org/@capacitor-community/apple-sign-in : version 7.1.0, published 2025-10-02, MIT.
- https://github.com/capacitor-community/apple-sign-in/blob/master/README.md (raw README read as well): "Capacitor plugin to support
  Sign in With Apple." Heading "Usage (iOS, Web)". Section "Instructions (Android)" reads "Not supported." (android `no`).

### Firebase Authentication
- https://firebase.google.com/pricing : Monthly active users, Spark "50K MAUs"; Blaze "No-cost up to 50K MAUs" then "Google Cloud
  pricing". Phone Auth, Spark "Not applicable", Blaze "Billed per SMS sent". SAML/OIDC Spark "50 MAUs".
- https://firebase.google.com/docs/auth : "Email and password based authentication", "Phone number authentication", "Sign in with
  Google", "Facebook", "Twitter", "GitHub", "Sign in with Apple", "Anonymous auth", "Custom auth system integration", "SAML and
  OpenID Connect providers". Platforms "iOS+", "Android", "Web", "Flutter", "Unity", "C++". Microsoft, Yahoo not on this page.
- https://registry.npmjs.org/firebase : version 13.2.0, published 2026-11-02, Apache-2.0 (open-source `yes` for the SDK; the service
  is hosted, no-hosted-service `no`).

### Supabase Auth
- https://supabase.com/pricing : Free "from $0/month", "50,000 monthly active users"; Pro "from $25/month", "100,000 monthly active
  users (then $0.00325 per MAU)"; Team "from $599/month", Auth table "100,000 included, then $0.00325 per MAU"; Enterprise "custom
  pricing". SSO MAUs Pro "50 included, then $0.015 per MAU". Advanced MFA Phone, Pro "$75 per month for first project".
- https://supabase.com/docs/guides/auth/social-login : 19 providers listed: Apple, Azure (Microsoft), Bitbucket, Discord, Facebook,
  Figma, GitHub, GitLab, Google, Kakao, Keycloak, LinkedIn, Notion, Slack, Spotify, Twitter, Twitch, WorkOS, Zoom.
- https://registry.npmjs.org/@supabase/supabase-js : version 2.119.0, MIT, "Isomorphic Javascript SDK for Supabase" (web `yes`,
  open-source `yes` for the SDK).
- https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react : "Build a User Management App with Ionic React";
  mentions Capacitor as "a cross platform native runtime from Ionic". Read, but no native sign-in claim: ios, android,
  capacitor-plugin stay `not-stated`.

### Auth0
- https://auth0.com/pricing : "Free — $0/month", "Up to 25,000 monthly active users", "Unlimited Social Connections**" with footnote
  "Subject to system limitations"; "Essentials — from $35/month" (B2C), "from $150/month" (B2B), "500 MAUs"; "Professional — from
  $240/month" (B2C), "from $800/month" (B2B); "Enterprise — Contact us".
- https://auth0.com/docs/quickstart/native/ionic-react : title "Add Login to Your Ionic React with Capacitor Application" (ios,
  android `yes`; capacitor-plugin `partial`, a quickstart rather than a plugin). https://auth0.com/docs/quickstart/native/ionic-capacitor
  returned 404.
- https://auth0.com/docs/authenticate/identity-providers/social-identity-providers : names "Google Sign-In" and "such as Google or
  Facebook"; other providers are behind the Marketplace, so `not-stated`. The jina copy of this page redirected to an ad tracker;
  the WebFetch copy was used.
- https://registry.npmjs.org/@auth0/auth0-spa-js : version 2.30.0, MIT (SDK open source; service hosted, so open-source `partial`).

### Clerk
- https://clerk.com/pricing : bills by Monthly Retained Users. Free: "Free", "50,000 MRU limit per app". Pro: "$25/mo", "$20/mo billed
  annually", "50,000 MRU included per app (Additional $0.02/mo each; volume discounts available)". Enterprise: "Custom (Only billed
  annually)". Add-ons: B2B Authentication "$100/mo", Satellite domains "$10/mo each", Additional SSO connection "$75/mo each".
- https://clerk.com/docs/guides/configure/auth-strategies/social-connections/all-providers : 26 provider headings: AgentID, Apple,
  Atlassian, Bitbucket, Box, Coinbase, Discord, Dropbox, Facebook, GitHub, GitLab, Google, HubSpot, Hugging Face, LINE, Linear,
  LinkedIn, Microsoft, Notion, Slack, Spotify, TikTok, Twitch, Vercel, X/Twitter v2, Xero.
- https://clerk.com/docs/expo/getting-started/quickstart : title "Expo Quickstart" (react-native, ios, android `yes`).
- https://registry.npmjs.org/@clerk/clerk-js : version 6.42.3, MIT (SDK open source; service hosted, open-source `partial`).

### Auth.js (NextAuth)
- https://authjs.dev/ : "Free and open source." Integration logos Express, Next.js, Qwik, SvelteKit. "The Auth.js project is now part
  of" Better Auth; footer "Auth.js © Better Auth Inc. - 2026". No Capacitor, React Native or mobile wording.
- https://authjs.dev/getting-started/providers : "Auth.js comes with over 80 providers preconfigured." Sidebar: "OAuth", "Magic
  Links", "Credentials", "WebAuthn".
- https://registry.npmjs.org/next-auth : version 4.24.15, published 2026-07-20, license ISC.

### Better Auth
- https://www.better-auth.com/ : "The most comprehensive authentication framework"; "Auth that lives inside your app. Composable,
  plugin-based, and built to scale"; "Google, GitHub, Apple, Discord, and more."; "Next.js, Nuxt, SvelteKit, Astro, Hono, and 20+
  more." No Expo, React Native, Capacitor or mobile wording.
- https://www.better-auth.com/pricing : "The Better Auth framework is free and open source." Infrastructure: Starter "$0/ month";
  Pro "$20/ month" (email $0.001 per message, SMS $0.09 per message); Enterprise "Custom".
- https://registry.npmjs.org/better-auth : version 1.7.18, published 2026-11-05, MIT.

### @react-native-google-signin/google-signin
- https://registry.npmjs.org/@react-native-google-signin/google-signin : version 17.0.0, published 2026-10-29, MIT.
- https://github.com/react-native-google-signin/google-signin/blob/master/README.md : "provides Google authentication for React
  Native and Expo apps." "This is the free (public) version, supporting Android and iOS. It uses the legacy Google Sign-In SDK on
  Android." Universal Sign In "is the premium version of this package": "Android (Credential Manager), iOS, web, and macOS from a
  single API" (web `partial`: paid edition only). "Licence MIT".
- https://universal-sign-in.com/ : Personal "$79/year", "local taxes may apply"; Team "$249/year", "up to 15 developers per license".

### Amazon Cognito
- https://aws.amazon.com/cognito/pricing/ : "free tier of 10,000 monthly active user (MAU) per month per account"; pre-2024-11-22 pools
  "will continue having a free tier of first 50,000 MAUs"; Lite "($0.0055 per MAU past the 10,000 free tier)"; Essentials "Price /
  MAU charged above the free tier for Essentials tier = $0.015"; Plus "$0.020" with no free tier; "Separate pricing applies for sending
  SMS messages for Multi-Factor Authentication (MFA)" (phone-sms `partial`: MFA SMS only stated).

### Ionic Auth Connect
- https://ionic.io/docs/auth-connect : "makes it easy to add single sign-on and secure user authentication to your Ionic apps";
  OpenID Connect; pre-built integrations for "Auth0, AWS Cognito, and Azure AD" (microsoft `partial`: Azure AD as an identity provider,
  not consumer Microsoft sign-in); apps "running on the web, iOS, and Android"; "Don't have an Auth Connect subscription?" with
  "Try it free now"; no price stated.

## Could not confirm
- Auth0 full social provider list (Marketplace page not read).
- Ionic Auth Connect price (page states none).
- Capgo plugin per-platform table for web and iOS.
- Capacitor support for Firebase, Supabase, Clerk, Cognito, Better Auth, Auth.js beyond what is quoted.
