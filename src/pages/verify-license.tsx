import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import Layout from '@theme/Layout';
import { useLocation } from '@docusaurus/router';
import Translate, { translate } from '@docusaurus/Translate';

import { JsonLd, StatusNote, WlHero, failureMessage } from '@site/src/components/WhiteLabel/parts';
import { LicensingError, verifyByDomain, verifyByKey, type VerifyResult } from '@site/src/services/licensing/client';
import styles from '@site/src/components/WhiteLabel/styles.module.css';

const SITE = 'https://capacitor-auth-manager-docs.aoneahsan.com';
const t = (id: string, message: string) => translate({ id: `whiteLabel.verify.${id}`, message });

type Mode = 'key' | 'domain';
type View = { kind: 'idle' } | { kind: 'checking' } | { kind: 'done'; result: VerifyResult } | { kind: 'failed'; message: string };

const day = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' });
const date = (iso: string | null | undefined) => (iso ? day.format(new Date(iso)) : null);

function verdictText(r: VerifyResult): { tone: 'ok' | 'bad' | 'neutral'; text: string } {
  const client = r.license?.client ?? '';
  switch (r.verdict) {
    case 'valid':
    case 'authorized':
      return { tone: 'ok', text: translate({ id: 'whiteLabel.verify.valid', message: 'Valid. Licensed to {client}.' }, { client }) };
    case 'pending_setup':
      return { tone: 'neutral', text: translate({ id: 'whiteLabel.verify.pending', message: 'Being set up for {client}. The first build isn’t published yet.' }, { client }) };
    case 'revoked':
      return { tone: 'bad', text: t('revoked', 'Revoked. This license no longer covers the package.') };
    case 'domain_mismatch':
      return { tone: 'bad', text: t('mismatch', 'This domain serves a license file, but the license doesn’t cover this domain.') };
    case 'no_file':
      return { tone: 'bad', text: t('noFile', 'This domain doesn’t serve a Capacitor Auth Manager license file.') };
    case 'unreachable':
      return { tone: 'bad', text: t('unreachable', 'We couldn’t reach that domain over HTTPS.') };
    case 'invalid_format':
      return { tone: 'bad', text: t('format', 'That isn’t a license key. Keys start with CAPAUTH-WL-.') };
    case 'rate_limited':
      return { tone: 'bad', text: failureMessage('rate_limited', 429) };
    default:
      return { tone: 'bad', text: t('notFound', 'No license matches that.') };
  }
}

export default function VerifyLicense(): ReactNode {
  const location = useLocation();
  const [mode, setMode] = useState<Mode>('key');
  const [value, setValue] = useState('');
  const [view, setView] = useState<View>({ kind: 'idle' });

  async function check(m: Mode, v: string) {
    if (!v) return;
    setView({ kind: 'checking' });
    try {
      setView({ kind: 'done', result: m === 'key' ? await verifyByKey(v) : await verifyByDomain(v) });
    } catch (error) {
      const e = error instanceof LicensingError ? error : new LicensingError('unknown', '', 0);
      if (e.code === 'license_not_found') setView({ kind: 'done', result: { verdict: 'not_found' } });
      else setView({ kind: 'failed', message: failureMessage(e.code, e.status) });
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fromUrl = params.get('key') ?? params.get('domain');
    if (!fromUrl) return;
    const m: Mode = params.get('key') ? 'key' : 'domain';
    setMode(m);
    setValue(fromUrl);
    void check(m, fromUrl);
  }, [location.search]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void check(mode, value.trim());
  }

  const result = view.kind === 'done' ? verdictText(view.result) : null;
  const license = view.kind === 'done' ? view.result.license : null;

  return (
    <Layout
      title={t('meta.title', 'Verify a Capacitor Auth Manager white-label license')}
      description={t(
        'meta.description',
        'Check a Capacitor Auth Manager white-label license by its CAPAUTH-WL- key or by the docs domain that serves its license file.',
      )}
    >
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Verify a Capacitor Auth Manager license', url: `${SITE}/verify-license` }} />
      <WlHero eyebrow="Verify" title={t('title', 'Check a Capacitor Auth Manager license')}>
        <p className={styles.lead}>
          <Translate id="whiteLabel.verify.lead" values={{ prefix: <code>CAPAUTH-WL-</code> }}>
            {'Every licensed build has a key that starts with {prefix}, and its docs domain serves a license file. Check either one here. Verification is run by our licensing service.'}
          </Translate>
        </p>
      </WlHero>
      <main className={styles.block}>
        <div className={`container ${styles.split}`}>
          <div>
            <div className={styles.tabs} role="radiogroup" aria-label={t('mode', 'Check by')}>
              {(['key', 'domain'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={mode === m}
                  className={styles.tab}
                  onClick={() => setMode(m)}
                >
                  {m === 'key' ? t('byKey', 'By key') : t('byDomain', 'By domain')}
                </button>
              ))}
            </div>
            <form className={styles.form} onSubmit={onSubmit}>
              <label className={styles.field}>
                <span>{mode === 'key' ? t('keyLabel', 'License key') : t('domainLabel', 'Docs domain')}</span>
                <input
                  className={styles.input}
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={mode === 'key' ? 'CAPAUTH-WL-…' : 'auth-docs.example.com'}
                  autoComplete="off"
                  spellCheck={false}
                />
              </label>
              <div className={styles.actions}>
                <button className={`button button--primary ${styles.tap}`} type="submit" disabled={view.kind === 'checking'}>
                  {view.kind === 'checking' ? t('checking', 'Checking…') : t('check', 'Check')}
                </button>
              </div>
            </form>
            <div className="margin-top--md">
              {result && (
                <StatusNote tone={result.tone}>
                  <p className="margin-bottom--sm">
                    <strong>{result.text}</strong>
                  </p>
                  {license && (
                    <ul className="margin-bottom--none">
                      {license.domains.length > 0 && <li>{translate({ id: 'whiteLabel.verify.domains', message: 'Domains: {list}' }, { list: license.domains.join(', ') })}</li>}
                      {date(license.issued_at) && <li>{translate({ id: 'whiteLabel.verify.issued', message: 'Issued {date}' }, { date: date(license.issued_at) ?? '' })}</li>}
                      {date(license.updates_until) && <li>{translate({ id: 'whiteLabel.verify.until', message: 'Updates until {date}' }, { date: date(license.updates_until) ?? '' })}</li>}
                    </ul>
                  )}
                </StatusNote>
              )}
              {view.kind === 'failed' && <StatusNote tone="bad">{view.message}</StatusNote>}
            </div>
          </div>
          <div className={styles.note}>
            <h2>{t('meaning.title', 'What the result means')}</h2>
            <ul>
              <li><strong>{t('meaning.valid', 'Valid:')}</strong> {t('meaning.validBody', 'an active license, and the client it’s issued to.')}</li>
              <li><strong>{t('meaning.pending', 'Being set up:')}</strong> {t('meaning.pendingBody', 'paid for, with the first build not yet published.')}</li>
              <li><strong>{t('meaning.revoked', 'Revoked:')}</strong> {t('meaning.revokedBody', 'the license no longer covers this package.')}</li>
              <li><strong>{t('meaning.none', 'Not found:')}</strong> {t('meaning.noneBody', 'no license has this key, or the domain serves no license file.')}</li>
            </ul>
          </div>
        </div>
      </main>
    </Layout>
  );
}
