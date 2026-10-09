# AGENTS.md — capacitor-auth-manager-docs

Public Docusaurus documentation site for the `capacitor-auth-manager` npm package.

## Task Speed Over Docs (IRON-SOLID — BEHAVIORAL)

Finish the real task fast + correctly FIRST; docs/trackers/sync are a footnote (≤~20% of effort) — never let recording outpace the fix. HARD STOP when doc work outpaces the change → ship, then ONE line if anything. No new summary/status/completion files unless asked; edit/delete over add; delete stale docs. Full rule: `~/.claude/AGENTS.md`.

## Identity

| Key | Value |
|---|---|
| Repo | `capacitor-auth-manager-docs` (PUBLIC — free GitHub Pages / Firebase Hosting) |
| Type | Docusaurus 3 documentation site (classic preset + Mermaid) |
| Package manager | yarn (Berry, node-modules linker) — NEVER npm/pnpm |
| Node | >=24 |
| Author | Ahsan Mahmood ([aoneahsan@gmail.com](mailto:aoneahsan@gmail.com)) |
| Live URL | https://capacitor-auth-manager-docs.aoneahsan.com (GitHub Pages; HTTPS custom domain verified) |
| Source package | https://www.npmjs.com/package/capacitor-auth-manager (`capacitor-auth-manager` v3.0.0) |
| Sibling project | `/home/ahsan/Documents/01-code/projects/00-npm-packages-projects/capacitor-auth-manager/` (the library) |
| Content | 35 source-accurate `.md` pages: Getting Started, Framework Adapters, 15 Providers, API Reference, Platforms, FAQ, Changelog |
| Build gates | `yarn typecheck` (tsc --noEmit) + `yarn build` (docusaurus → `./build`), both exit 0 |

## Critical rules

| Rule | Detail |
|---|---|
| Yarn only | Never `npm install`/`pnpm add`. |
| No dev server in agent runs | The agent runs `yarn build` + `yarn typecheck` to verify; the user runs `yarn start`. |
| Single source of truth | Every API fact MUST come from the `capacitor-auth-manager` repo's `src/`. No invented method names or parameters. Read the source before documenting it. |
| Honest framing | State what the library does NOT do as clearly as what it does (ID tokens not verified client-side; GitHub needs a backend proxy; native plugin is a secondary surface). No fabricated stats. |
| One commit per task | ONE commit per docs-site change set, not per file. Branch `main`, remote `o`. |

## Verification commands

```bash
yarn typecheck   # tsc --noEmit (must exit 0)
yarn build       # docusaurus build (must exit 0, produces ./build)
```

## Dual-File Sync Rule

Every important rule lives in BOTH `CLAUDE.md` AND `AGENTS.md`. Update one → update the other.

## Package Manager Hierarchy: nvm → npm (global) → yarn (local)

`nvm` installs/updates Node + npm; `npm` for global installs (incl. yarn itself); `yarn` for ALL local project work. Never npm/pnpm for local installs. Only `yarn.lock` in the repo. Full rule: `~/.claude/AGENTS.md`.

## Gitignore Hygiene (IRON-SOLID)
`.gitignore` stays current with the project structure — ignore only recoverable artifacts (build/`dist`/`www`/`node_modules`/logs/caches/IDE), never lose source. Custom rules always present: `*.ignore.*`, `project-record-ignore/`. This is a **PUBLIC** repo -> secrets/`.env`/keystores are NEVER tracked.
Full rule + private/public protocol: `~/.claude/rules/project-config.md`.
Gitignore Last Verified: 2026-06-24

## Last Updated

2026-10-09


## Sub-agents & Skills — Main-Context-First (IRON-SOLID)
Default/built-in sub-agents (`general-purpose`, `Explore`, `Plan`, `claude`, `fork`, …) do NOT have
access to `/skills`, so delegating to them silently SKIPS the skills RULE #0 requires. Do all
skill-relevant work in the **MAIN context**; use a sub-agent ONLY when a **custom** agent exists in
`.claude/agents/` for that job; a default `Explore`/`Plan` agent is allowed ONLY for read-only,
no-skill search/exploration. When a relevant skill is missing, **install/enable it** rather than
proceeding skill-less. (Owner directive 2026-07-11; full text in `~/.claude/CLAUDE.md`.)

<!-- RULE:main-context-model-workflow v2026-07-16 -->
## Main-Context + Skills + Model Workflow (IRON-SOLID — CRITICAL)
1. **NO default/built-in sub-agents** (`general-purpose`, `Explore`, `Plan`, `claude`, `fork`, …) for ANY work in
   this project — they cannot invoke /skills, which RULE #0 makes mandatory. Do ALL work (planning, implementation,
   review, exploration) in the MAIN context. A sub-agent is allowed ONLY when a CUSTOM agent exists in
   `.claude/agents/` for that exact job.
2. **Skills always:** before any task, scan the available-skills list and invoke EVERY relevant skill; if a needed
   skill is missing, download/enable/install it (or use the nearest installed equivalent and say so) — never
   proceed skill-less.
3. **Model workflow:** PLAN and REVIEW on **Fable 5**; EXECUTE the approved plan on **Opus 4.8**. Plans in
   `~/.claude/plans/`; multi-phase features keep a resumable tracker (`docs/features/<slug>/00-tracker.json`),
   resumed rather than re-planned from zero.

Global records (rules, policy, audit reports) live in the `ahsan-notebook` repo at
`static/assets/claude-code/`; the `~/.claude/…` paths are symlinks into it. Full text: `~/.claude/CLAUDE.md`.
(Owner directives 2026-07-11 / 2026-07-14; fleet-rolled 2026-07-16.)
