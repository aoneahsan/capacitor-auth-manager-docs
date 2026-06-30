# Capacitor Auth Manager — Documentation

Public documentation site for the [`capacitor-auth-manager`](https://www.npmjs.com/package/capacitor-auth-manager) npm package — a Firebase-agnostic **Google authentication** library for Capacitor and the web (a drop-in alternative to `@codetrix-studio/capacitor-google-auth`). One `signIn` call on web, iOS, and Android, for React, Vue, Angular, and vanilla JS. Google is the enabled provider in 2.4.x; more providers are added one at a time.

Built with [Docusaurus 3](https://docusaurus.io/). Deployed to Firebase Hosting / GitHub Pages.

- Live site: https://capacitor-auth-manager-docs.aoneahsan.com
- Package: https://www.npmjs.com/package/capacitor-auth-manager
- Package source: https://github.com/aoneahsan/capacitor-auth-manager

## Local development

This repo is **yarn-only** (Yarn Berry, node-modules linker). Do not use npm or pnpm.

```bash
yarn install      # install dependencies
yarn start        # local dev server (http://localhost:5962)
yarn build        # production build → ./build
yarn typecheck    # tsc --noEmit
yarn serve        # preview the built site (http://localhost:5963)
```

## Deployment

Two hosting options are wired; pick one for the custom domain `capacitor-auth-manager-docs.aoneahsan.com`:

- **GitHub Pages** (free): enable Pages (Source: GitHub Actions). `.github/workflows/deploy.yml` builds and publishes; `static/CNAME` pins the domain.
- **Firebase Hosting**: `yarn firebase:deploy` (target `capacitor-auth-manager-docs`; see `firebase.json` + `.firebaserc`).

Only one host should own the DNS record at a time.

## Content accuracy

Every API fact in these docs comes from the package's real `src/` and `Readme.md`. No invented method names or parameters. Honest framing: the docs lead with Google (the only enabled provider in 2.4.x), mark every other provider "not yet available — coming one at a time" (they throw `PROVIDER_NOT_ENABLED`), and state limitations plainly (id-token signatures are not verified client-side; the web flow returns an id token only; the native Swift/Java sources are not compiled in CI).

## License

MIT © [Ahsan Mahmood](https://aoneahsan.com)
