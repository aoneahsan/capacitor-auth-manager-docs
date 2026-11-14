import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { useHistory, useLocation } from '@docusaurus/router';
import Translate, { translate } from '@docusaurus/Translate';

import { Consent, Field, JsonLd, StatusNote, WlHero, failureMessage } from '@site/src/components/WhiteLabel/parts';
import { useCatalog } from '@site/src/components/WhiteLabel/useCatalog';
import {
  LicensingError,
  formatUsd,
  quoteLicence,
  sendInquiry,
  startCheckout,
  type Quote,
} from '@site/src/services/licensing/client';
import styles from '@site/src/components/WhiteLabel/styles.module.css';

const SITE = 'https://capacitor-auth-manager-docs.aoneahsan.com';
const t = (id: string, message: string) => translate({ id: `whiteLabel.pricing.${id}`, message });

type QuoteView = { kind: 'idle' } | { kind: 'loading' } | { kind: 'ready'; quote: Quote } | { kind: 'failed' };
type SendView = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'failed'; message: string };

const field = (form: FormData, name: string) => String(form.get(name) ?? '').trim();

export default function WhiteLabelPricing(): ReactNode {
  const { catalog } = useCatalog();
  const location = useLocation();
  const history = useHistory();
  const offered = useMemo(() => catalog?.groups.map((g) => g.key) ?? [], [catalog]);
  const requested = new URLSearchParams(location.search).get('groups');
  const [picked, setPicked] = useState<string[] | null>(null);
  const [quote, setQuote] = useState<QuoteView>({ kind: 'idle' });
  const [send, setSend] = useState<SendView>({ kind: 'idle' });

  const selection = picked ?? (requested ? requested.split(',').filter((k) => offered.includes(k)) : offered);
  const selectionKey = selection.join(',');

  useEffect(() => {
    if (!catalog) return;
    if (picked !== null) history.replace({ search: `?groups=${selectionKey}` });
    if (!selection.length) {
      setQuote({ kind: 'idle' });
      return;
    }
    let alive = true;
    setQuote({ kind: 'loading' });
    quoteLicence(selection)
      .then((q) => alive && setQuote({ kind: 'ready', quote: q }))
      .catch(() => alive && setQuote({ kind: 'failed' }));
    return () => {
      alive = false;
    };
    // selectionKey stands in for the selection array, which is rebuilt on every render.
  }, [catalog, selectionKey]);

  const toggle = (key: string) =>
    setPicked(selection.includes(key) ? selection.filter((k) => k !== key) : [...selection, key]);

  const canPay = Boolean(catalog?.checkout_available);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = field(form, 'name');
    const email = field(form, 'email');
    const company = field(form, 'company') || undefined;
    const scope = field(form, 'scope');
    const domain = field(form, 'domain');
    const notes = field(form, 'notes');
    setSend({ kind: 'sending' });
    try {
      if (canPay) {
        const { checkout_url } = await startCheckout(selection, { name, email, company, domain: domain || undefined }, notes);
        window.location.assign(checkout_url);
        return;
      }
      const labels = catalog?.groups.filter((g) => selection.includes(g.key)).map((g) => g.label) ?? [];
      const message = [
        `White-label license request: ${labels.join(', ') || 'npm package'}`,
        scope && `npm scope: ${scope}`,
        domain && `Docs domain: ${domain}`,
        notes && `\n${notes}`,
      ]
        .filter(Boolean)
        .join('\n');
      await sendInquiry({ kind: 'quote', name, email, company, groups: selection, message });
      setSend({ kind: 'sent' });
    } catch (error) {
      const e = error instanceof LicensingError ? error : new LicensingError('unknown', '', 0);
      setSend({ kind: 'failed', message: failureMessage(e.code, e.status) });
    }
  }

  return (
    <Layout
      title={t('meta.title', 'White-label license pricing for Capacitor Auth Manager')}
      description={t(
        'meta.description',
        'The price of a managed, rebranded capacitor-auth-manager build published under your npm scope, quoted live by our licensing service, with the request form.',
      )}
    >
      {catalog && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Capacitor Auth Manager white-label license',
            url: `${SITE}/white-label/pricing`,
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'USD',
              lowPrice: Math.min(...catalog.groups.map((g) => g.price_usd)),
              highPrice: Math.max(...catalog.groups.map((g) => g.price_usd)),
              offerCount: catalog.groups.length,
              offers: catalog.groups.map((g) => ({ '@type': 'Offer', name: g.label, price: g.price_usd, priceCurrency: 'USD' })),
            },
          }}
        />
      )}
      <WlHero eyebrow="White-label · pricing" title={t('title', 'License pricing')}>
        <p className={styles.lead}>
          {t(
            'lead',
            'One license covers the npm package, with its web code and its iOS and Android plugin code. Prices come straight from our licensing service, and the quote below is the amount you’d pay.',
          )}
        </p>
      </WlHero>

      <main className={styles.block}>
        <div className={`container ${styles.split}`}>
          <div>
            <h2>{t('groups.title', 'What you’re licensing')}</h2>
            {catalog?.sales_state === 'acquired' ? (
              <p>{t('acquired', 'This product has been acquired, and licenses are no longer sold.')}</p>
            ) : catalog ? (
              <div className={styles.stack} role="group" aria-label={t('groups.label', 'Platform groups')}>
                {catalog.groups.map((g) => (
                  <button
                    key={g.key}
                    type="button"
                    role="checkbox"
                    aria-checked={selection.includes(g.key)}
                    className={styles.groupCard}
                    onClick={() => toggle(g.key)}
                  >
                    <span className={styles.tick} aria-hidden="true" />
                    <span>
                      <strong>{g.label}</strong>
                      <br />
                      <span className={styles.muted}>
                        {t('group.package', 'The package with its web code and its iOS and Android plugin code, published under your name.')}
                      </span>
                      <br />
                      <strong>{formatUsd(g.price_usd)}</strong>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p>{t('noCatalog', 'Prices aren’t loading right now. Send the request and we’ll reply with a quote.')}</p>
            )}

            {catalog && catalog.sales_state !== 'acquired' && (
              <>
                <h2 className="margin-top--lg">{t('quote.title', 'Your quote')}</h2>
                <div className={styles.quote} aria-live="polite">
                  {quote.kind === 'ready' ? (
                    <>
                      <dl>
                        <dt>{t('quote.subtotal', 'Subtotal')}</dt>
                        <dd>{formatUsd(quote.quote.subtotal_usd)}</dd>
                        {quote.quote.discount_pct > 0 && (
                          <>
                            <dt>
                              <Translate id="whiteLabel.pricing.quote.discount" values={{ pct: quote.quote.discount_pct }}>
                                {'Bundle discount, {pct}%'}
                              </Translate>
                            </dt>
                            <dd>−{formatUsd(quote.quote.discount_usd)}</dd>
                          </>
                        )}
                        <dt className={styles.total}>{t('quote.total', 'Total')}</dt>
                        <dd className={styles.total}>{formatUsd(quote.quote.total_usd)}</dd>
                      </dl>
                      <p className={`${styles.muted} margin-bottom--none`}>
                        <Translate id="whiteLabel.pricing.quote.updates" values={{ months: quote.quote.updates_months }}>
                          {'Includes {months} months of updates.'}
                        </Translate>
                      </p>
                    </>
                  ) : quote.kind === 'failed' ? (
                    <p className="margin-bottom--none">
                      {t('quote.failed', 'We couldn’t get a quote just now. Send the request and we’ll reply with one.')}
                    </p>
                  ) : selection.length === 0 ? (
                    <p className="margin-bottom--none">{t('quote.pick', 'Pick the npm package to see a quote.')}</p>
                  ) : (
                    <p className="margin-bottom--none">{t('quote.loading', 'Asking for a quote…')}</p>
                  )}
                </div>
              </>
            )}
          </div>

          {catalog?.sales_state !== 'acquired' && (
            <div>
              <h2>{canPay ? t('form.titlePay', 'Your details') : t('form.title', 'Request a license')}</h2>
              {!canPay && (
                <p>{t('form.intro', 'Tell us the npm scope you’ll publish under. We reply by email with the agreement and the next steps.')}</p>
              )}
              {send.kind === 'sent' ? (
                <StatusNote tone="ok">
                  {t('form.sent', 'Request sent. We’ll reply to your email with the agreement and the next steps.')}
                </StatusNote>
              ) : (
                <form className={styles.form} onSubmit={onSubmit}>
                  <div className={styles.row2}>
                    <Field label={t('form.name', 'Name')} name="name" required autoComplete="name" />
                    <Field label={t('form.email', 'Work email')} name="email" type="email" required autoComplete="email" />
                  </div>
                  <div className={styles.row2}>
                    <Field label={t('form.company', 'Company')} name="company" autoComplete="organization" />
                    <Field label={t('form.scope', 'npm scope')} name="scope" placeholder="@acme" />
                  </div>
                  <Field label={t('form.domain', 'Docs domain')} name="domain" placeholder="auth-docs.acme.com" />
                  <Field label={t('form.notes', 'Anything we should know')} name="notes" multiline />
                  {send.kind === 'failed' && <StatusNote tone="bad">{send.message}</StatusNote>}
                  <div className={styles.actions}>
                    <Link className={`button button--outline button--primary ${styles.tap}`} to="/white-label">
                      <Translate id="whiteLabel.form.back">Back</Translate>
                    </Link>
                    <button
                      className={`button button--primary ${styles.tap}`}
                      type="submit"
                      disabled={send.kind === 'sending' || (Boolean(catalog) && selection.length === 0)}
                    >
                      {send.kind === 'sending'
                        ? t('form.sending', 'Sending…')
                        : canPay
                          ? t('form.pay', 'Continue to payment')
                          : t('form.send', 'Send request')}
                    </button>
                  </div>
                  <Consent />
                </form>
              )}
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
