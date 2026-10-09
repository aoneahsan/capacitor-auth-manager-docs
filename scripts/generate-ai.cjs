'use strict';
const fs = require('node:fs');
const path = require('node:path');
const pkg = require('../package.json');
const base = 'https://capacitor-auth-manager-docs.aoneahsan.com';
const raw = path.join(__dirname, '../static/raw');
fs.rmSync(raw, { recursive: true, force: true });
fs.mkdirSync(raw, { recursive: true });
const pages = [];
const full = [];
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const filename = path.join(dir, item.name);
    if (item.isDirectory()) { if (item.name !== 'story') walk(filename); continue; }
    if (!item.name.endsWith('.md') || ['MANUAL-TASKS.md', 'PACKAGES.md'].includes(item.name)) continue;
    const content = fs.readFileSync(filename, 'utf8');
    if (!content.startsWith('---\n') || !/^description:/m.test(content)) throw new Error(`Missing front matter: ${filename}`);
    const id = path.relative(path.join(__dirname, '../docs'), filename).replace(/\\/g, '/').replace(/\.md$/, '');
    const slug = content.match(/^slug: (.+)$/m)?.[1] || `/${id}`;
    const title = content.match(/^title: (.+)$/m)?.[1] || id;
    const target = path.join(raw, `${id}.md`);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
    pages.push({ id, title, url: base + slug, rawUrl: `${base}/raw/${id}.md` });
    full.push(`\n\n<!-- ${base + slug} -->\n\n${content}`);
  }
}
walk(path.join(__dirname, '../docs'));
fs.writeFileSync(path.join(raw, 'manifest.json'), JSON.stringify({ package: 'capacitor-auth-manager', version: pkg.documentedPackageVersion, guide: `${base}/raw/integration/ai.md`, pages }, null, 2) + '\n');
fs.writeFileSync(path.join(__dirname, '../static/llms-full.txt'), `# capacitor-auth-manager ${pkg.documentedPackageVersion}\n` + full.join(''));
fs.writeFileSync(path.join(__dirname, '../static/llms.txt'), `# Capacitor Auth Manager\n\n> Google sign-in for Capacitor and the web. Documentation for ${pkg.documentedPackageVersion}; Google is the only enabled provider. Firebase is managed by the consuming app.\n\n## Integration contract\n\nWeb One-Tap returns an ID token; web popup returns an access token; auto may return either. Native sign-in returns an ID token. Firebase handoff: GoogleAuthProvider.credential(idToken ?? null, accessToken ?? null). Call auth.prepare(AuthProvider.GOOGLE) before enabling a click handler. Firebase onAuthStateChanged owns protected routes. The package does not verify JWT signatures.\n\n## Machine-readable documentation\n\n- [AI integration guide](${base}/raw/integration/ai.md): exact imports, setup, Firebase session lifecycle, errors, platform requirements, and acceptance checks.\n- [Raw Markdown manifest](${base}/raw/manifest.json): release version and raw URL for every published page.\n- [Full documentation](${base}/llms-full.txt): all published pages as plain text.\n\n## Pages\n\n` + pages.map((p) => `- [${p.title}](${p.url}): raw Markdown at ${p.rawUrl}`).join('\n') + '\n');
console.log(`Generated ${pages.length} versioned raw documentation pages.`);
