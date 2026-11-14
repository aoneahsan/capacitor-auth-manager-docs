// One shared script, one mount point per page (<body data-page>). Reads the live licensing catalogue,
// so the dummy carries no price constants. Forms are simulated here: the dummy never sends a request.
(() => {
  const API = 'https://fileshub.zaions.com/api/licensing/v1';
  const SLUG = 'capacitor-auth-manager';
  const money = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = document.body.dataset.page;

  const saved = localStorage.getItem('cam-dummy-theme');
  if (saved) document.documentElement.dataset.theme = saved;

  const links = [
    ['white-label.html', 'White-label', 'overview'],
    ['white-label-pricing.html', 'Pricing', 'pricing'],
    ['white-label-updates.html', 'Updates', 'updates'],
    ['verify-license.html', 'Verify a license', 'verify'],
  ];
  $('#shell-nav').innerHTML = `<div class="wrap"><a class="brand" href="white-label.html">
    <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 4 L54 12 V30 C54 45 44 55 32 60 C20 55 10 45 10 30 V12 Z" fill="#6366f1"/><circle cx="32" cy="28" r="7" fill="#fff"/></svg>
    Capacitor Auth Manager</a><nav class="links" aria-label="White-label">${links
      .map(([h, l, k]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</nav>
    <button type="button" id="theme" aria-label="Switch light or dark">◐</button></div>`;
  $('#shell-footer').innerHTML = `<div class="wrap cols">
    <div><strong>Documentation</strong><ul><li><a href="#">Introduction</a></li><li><a href="#">Quick Start</a></li></ul></div>
    <div><strong>Project</strong><ul><li><a href="#">npm package</a></li><li><a href="white-label.html">White-label</a></li>
    <li><a href="terms.html">Terms of Service</a></li><li><a href="privacy.html">Privacy Policy</a></li></ul></div>
    <div><strong>Built by Ahsan Mahmood</strong><ul><li><a href="#">aoneahsan.com</a></li></ul></div></div>`;
  $('#theme').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('cam-dummy-theme', next);
  });

  const fill = (cat) => {
    $$('[data-price-group]').forEach((el) => {
      const g = cat.groups.find((x) => x.key === el.dataset.priceGroup);
      el.textContent = g ? money(g.price_usd) : '';
    });
    $$('[data-group-label]').forEach((el) => {
      const g = cat.groups.find((x) => x.key === el.dataset.groupLabel);
      if (g) el.textContent = g.label;
    });
    $$('[data-months]').forEach((el) => { el.textContent = String(cat.updates.included_months); });
    const rows = $('#renewal-rows');
    if (rows) rows.innerHTML = cat.updates.renewals.map((r) => `<tr><td>${r.months} months</td><td class="n">${money(r.price_usd)}</td></tr>`).join('');
    const sel = $('#renew-months');
    if (sel) sel.innerHTML = cat.updates.renewals.map((r) => `<option value="${r.months}">${r.months} months, ${money(r.price_usd)}</option>`).join('');
    $$('[data-checkout]').forEach((el) => { el.hidden = !cat.checkout_available; });
    $$('[data-request]').forEach((el) => { el.hidden = cat.checkout_available; });
  };

  const configurator = (cat) => {
    const box = $('#groups');
    if (!box) return;
    const fromUrl = (new URLSearchParams(location.search).get('groups') || '').split(',').filter(Boolean);
    let picked = fromUrl.filter((k) => cat.groups.some((g) => g.key === k));
    if (!picked.length) picked = cat.groups.map((g) => g.key);
    box.innerHTML = cat.groups.map((g) => `<div class="group-card" role="checkbox" tabindex="0" data-key="${g.key}">
      <span class="tick" aria-hidden="true"></span><span><strong>${g.label}</strong><br>
      <span style="color:var(--muted)">The package with its web code and its iOS and Android plugin code, published under your name.</span><br>
      <strong>${money(g.price_usd)}</strong></span></div>`).join('');
    const quote = async () => {
      $$('.group-card', box).forEach((c) => c.setAttribute('aria-checked', String(picked.includes(c.dataset.key))));
      const url = new URL(location.href);
      url.searchParams.set('groups', picked.join(','));
      history.replaceState(null, '', url);
      const out = $('#quote-out');
      if (!picked.length) { out.innerHTML = '<p>Pick the npm package to see a quote.</p>'; return; }
      out.textContent = 'Asking for a quote…';
      try {
        const r = await fetch(`${API}/products/${SLUG}/quote`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'white_label', groups: picked }) });
        const q = (await r.json()).data;
        out.innerHTML = `<dl><dt>Subtotal</dt><dd>${money(q.subtotal_usd)}</dd>${q.discount_pct ? `<dt>Bundle discount, ${q.discount_pct}%</dt><dd>−${money(q.discount_usd)}</dd>` : ''}
          <dt class="total">Total</dt><dd class="total">${money(q.total_usd)}</dd></dl><p style="margin:0;color:var(--muted)">Includes ${q.updates_months} months of updates.</p>`;
      } catch { out.innerHTML = '<p>We couldn’t reach the licensing service for a quote. Send the request below and we’ll reply with one.</p>'; }
    };
    box.addEventListener('click', (e) => {
      const c = e.target.closest('.group-card'); if (!c) return;
      const k = c.dataset.key;
      picked = picked.includes(k) ? picked.filter((x) => x !== k) : [...picked, k];
      quote();
    });
    box.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); e.target.click(); } });
    quote();
  };

  $$('form[data-simulate]').forEach((f) => f.addEventListener('submit', (e) => {
    e.preventDefault();
    const out = $('.status', f.parentElement);
    out.hidden = false;
    out.className = 'status ok';
    out.textContent = f.dataset.simulate;
    f.hidden = true;
  }));

  const verify = $('#verify');
  if (verify) {
    let mode = 'key';
    $$('.tabs button').forEach((b) => b.addEventListener('click', () => {
      mode = b.dataset.mode;
      $$('.tabs button').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
      $('#verify-input').placeholder = mode === 'key' ? 'CAPAUTH-WL-…' : 'auth-docs.example.com';
      $('#verify-label').firstChild.textContent = mode === 'key' ? 'License key' : 'Docs domain';
    }));
    verify.addEventListener('submit', async (e) => {
      e.preventDefault();
      const v = $('#verify-input').value.trim();
      const out = $('#verify-out');
      out.hidden = false; out.className = 'status'; out.textContent = 'Checking…';
      try {
        const r = await fetch(`${API}/licenses/verify?${mode}=${encodeURIComponent(v)}${mode === 'domain' ? `&product=${SLUG}` : ''}`);
        const d = (await r.json()).data || {};
        const good = d.verdict === 'valid' || d.verdict === 'authorized';
        out.className = `status ${good ? 'ok' : 'bad'}`;
        out.textContent = good ? `Valid. Licensed to ${d.license?.client ?? 'this client'}.` : `Result: ${d.verdict ?? 'unknown'}.`;
      } catch { out.className = 'status bad'; out.textContent = 'The licensing service didn’t answer. Try again in a minute.'; }
    });
  }

  fetch(`${API}/products/${SLUG}/catalog`).then((r) => r.json()).then(({ data }) => { fill(data); configurator(data); })
    .catch(() => { $$('[data-price-group]').forEach((el) => { el.textContent = 'on request'; }); $$('[data-checkout]').forEach((el) => { el.hidden = true; }); });
})();
