# Package inventory

Last Updated: 2026-10-20

Package manager: Yarn 4.18.1. React and ReactDOM resolve to 19.3.1; Docusaurus remains current at 3.10.2.

| Dependency | Range | Purpose |
|---|---|---|
| `@docusaurus/core` | `^3.10.2` | Documentation framework |
| `@docusaurus/preset-classic` | `^3.10.2` | Documentation framework |
| `@docusaurus/theme-mermaid` | `^3.10.2` | Documentation framework |
| `@mdx-js/react` | `^3.1.1` | Markdown components |
| `clsx` | `^2.1.1` | CSS class names |
| `prism-react-renderer` | `^2.4.1` | Code highlighting |
| `react` | `^19.3.0` | UI runtime |
| `react-dom` | `^19.3.0` | UI rendering |
| `@docusaurus/module-type-aliases` | `^3.10.2` | Documentation framework |
| `@docusaurus/tsconfig` | `^3.10.2` | Documentation framework |
| `@docusaurus/types` | `^3.10.2` | Documentation framework |
| `@types/react` | `^19.3.0` | Type declarations |
| `typescript` | `~6.0.3` | Type checking; supported TS6 toolchain |

## Upstream constraints

TypeScript stays ~6.0.3 while the selected toolchain supports its JavaScript API. Recheck when the upstream
TS7 integration is supported. Temporary development resolutions update serialize-javascript, tinypool,
postcss-selector-parser, katex and uuid to patched versions; remove each when its parent resolves the patched
release naturally and typecheck/build pass.

The current braces 3.0.3 has a high-severity nested-pattern stack-exhaustion advisory
([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)) through chokidar 3.6.0. The registry has
no patched stable braces release. It is a Node build/watch dependency; the deployed site is static and accepts
no glob patterns. Keep builds on trusted repository inputs. Recheck when braces publishes a fix or Docusaurus
migrates chokidar, then update the lockfile and repeat the full audit/build. This advisory is recorded, not
suppressed. Yarn's registry audit currently reports zero advisories, while GitHub advisory
`GHSA-vfj7-8cjw-p6xm` still marks braces 3.0.3 affected; keep the stricter manual record until GitHub publishes
a patched version or withdraws the advisory. Yarn also reports 32 upstream internal Docusaurus and Algolia
peer edges: every workspace-owned peer is satisfied, the production build passes, and no package extension
or warning filter is installed.
