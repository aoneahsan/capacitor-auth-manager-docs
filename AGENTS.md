# Capacitor Auth Manager public docs

**Last Updated:** 2026-10-20

**Updated:** 2026-10-13. This public `aoneahsan/capacitor-auth-manager-docs` repository on `main`
builds the Docusaurus site at <https://capacitor-auth-manager-docs.aoneahsan.com/>. Its sibling
`../capacitor-auth-manager/` is the public package source; the parent `../` is a separate private
`project-root` coordination repository. Search, commit and push from the owning repository.
`CLAUDE.md` mirrors this file. Last context pass 2026-10-13; next routine pass eligible
2026-11-12.

## Start here

Read `README.md`, then the smallest relevant page, config or CSS section. Package API facts come
from the sibling package's current `src/`, types and tests. Google is the only enabled provider
in version 3.x; describe disabled providers and OAuth limits honestly. `docs/` owns pages,
`src/` owns site components/styles, `static/` owns public assets, and `docusaurus.config.ts` plus
`sidebars.ts` own navigation. The generated AI manifest/raw pages derive from the same sources.
Never copy secrets, private environment values, test passwords or unpublished internal records
into this public repository.

## Local checks and publishing boundary

Use the manifest's Yarn 4.17.1 with Node 24+. Run `yarn install --immutable`, `yarn typecheck`,
then `yarn build`. The production build validates Docusaurus links and generates AI-readable
output. Preview that exact build at desktop and mobile widths, including a direct docs route,
navigation and browser console, before pushing `main`: `.github/workflows/deploy-pages.yml`
auto-publishes GitHub Pages. After the run succeeds, verify the live custom domain. Do not use
npm or pnpm locally, and do not treat a package compile or docs build as proof of a real Google
OAuth flow.

Keep the GitHub Pages CNAME, visible copy, metadata and generated AI content consistent. Follow
project writing/Markdown and story rules for new public prose; factual maintenance must not
invent methods, parameters, numbers or compatibility claims. The fleet run is recorded at
`/home/ahsan/Documents/01-code/docs/tracking/fleet-maintenance-tracker.json`.

## Stop-work Git gate

<!-- RULE:stop-work-git-gate v2026-10-20 -->

Before stopping, commit every legitimate change and work-progress checkpoint in this repository and each independent nested repository, fetch and merge the designated upstream, push the documented working branch, then verify an empty worktree and `0 0` ahead/behind. Never stash, discard, reset, rebase, or force-push. If synchronization is blocked, report the exact repository, branch, blocker, and next action instead of calling the work complete. The full workflow remains authoritative in `~/.claude/rules/git-workflow.md`.
