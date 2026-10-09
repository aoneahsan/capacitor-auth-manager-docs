# Capacitor Auth Manager — Documentation

Public documentation site for the [`capacitor-auth-manager`](https://www.npmjs.com/package/capacitor-auth-manager) npm package — a Firebase-agnostic **Google authentication** library for Capacitor and the web (a drop-in alternative to `@codetrix-studio/capacitor-google-auth`). One `signIn` call on web, iOS, and Android, for React, Vue, Angular, and vanilla JS. Google is the enabled provider in 3.x; more providers are added one at a time.

Built with [Docusaurus 3](https://docusaurus.io/). Deployed to GitHub Pages.

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

GitHub Pages publishes through `.github/workflows/deploy-pages.yml` on every push to `main`.
`static/CNAME` pins the existing HTTPS custom domain. No Firebase Hosting project is used.

## AI documentation

`yarn build` generates `/raw/manifest.json`, raw Markdown for each published page, `/llms.txt`, and
`/llms-full.txt` from the same sources as the site. `/integration/ai` covers the package's exact Google/Firebase integration contract.

## Content accuracy

Every API fact in these docs comes from the package's real `src/` and `README.md`. No invented method names or parameters. Honest framing: the docs lead with Google (the only enabled provider in 3.x), mark every other provider "not yet available — coming one at a time" (they throw `PROVIDER_NOT_ENABLED`), and state limitations plainly (id-token signatures are not verified client-side; web One-Tap returns an ID token while popup returns an access token; native compilation runs in package CI; real OAuth flows still need device validation).

## License

MIT © [Ahsan Mahmood](https://aoneahsan.com)
