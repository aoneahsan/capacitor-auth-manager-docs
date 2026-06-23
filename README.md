# Capacitor Auth Manager — Documentation

Public documentation site for the [`capacitor-auth-manager`](https://www.npmjs.com/package/capacitor-auth-manager) npm package — a framework-agnostic authentication library with 15 providers for React, Vue, Angular, vanilla JS, and optional Capacitor apps.

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

Every API fact in these docs comes from the package's real `src/`. No invented method names or parameters. Honest framing: the docs state what each provider does NOT do (e.g. ID tokens are not verified client-side; GitHub needs a backend proxy; the native plugin is a secondary surface).

## License

MIT © [Ahsan Mahmood](https://aoneahsan.com)
