import { useState, type FormEvent, type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';

import { Consent, Field, JsonLd, StatusNote, WlHero, failureMessage } from '@site/src/components/WhiteLabel/parts';
import { useCatalog } from '@site/src/components/WhiteLabel/useCatalog';
import { LicensingError, formatUsd, sendInquiry, startRenewal } from '@site/src/services/licensing/client';
import styles from '@site/src/components/WhiteLabel/styles.module.css';

const SITE = 'https://capacitor-auth-manager-docs.aoneahsan.com';
const t = (id: string, message: string) => translate({ id: `whiteLabel.updates.${id}`, message });

type SendView = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'failed'; message: string };

const KINDS = [
  ['patch', 'A patch,', 'like 3.1.1: fixes, same API.'],
  ['feature', 'A feature release,', 'like 3.2.0, which added Google’s rendered button flow.'],
  ['major', 'A major,', 'like 3.0.0, published with its migration notes on your docs site.'],
  ['provider', 'A provider enabled upstream,', 'once it’s verified there, reaches your build in the next release.'],
] as const;

export default function WhiteLabelUpdates(): ReactNode {
  const { catalog } = useCatalog();
  const [send, setSend] = useState<SendView>({ kind: 'idle' });
  const canPay = Boolean(catalog?.checkout_available);
  const renewals = catalog?.updates.renewals ?? [];

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const key = String(form.get('key') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const months = Number(form.get('months'));
    setSend({ kind: 'sending' });
    try {
      if (canPay) {
        const { checkout_url } = await startRenewal(key, months, email);
        window.location.assign(checkout_url);
        return;
      }
      await sendInquiry({
        kind: 'quote',
        name: String(form.get('name') ?? '').trim(),
        email,
        message: `Renewal request for license ${key}${months ? `, ${months} months` : ''}.`,
      });
      setSend({ kind: 'sent' });
    } catch (error) {
      const e = error instanceof LicensingError ? error : new LicensingError('unknown', '', 0);
      setSend({ kind: 'failed', message: failureMessage(e.code, e.status) });
    }
  }

  return (
    <Layout
      title={t('meta.title', 'White-label updates and renewals for Capacitor Auth Manager')}
      description={t(
        'meta.description',
        'What an update to a white-label capacitor-auth-manager build is, how long updates are included, the renewal plans, and how to renew with your license key.',
      )}
    >
      {catalog && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Capacitor Auth Manager white-label update renewals',
            url: `${SITE}/white-label/updates`,
            offers: renewals.map((r) => ({
              '@type': 'Offer',
              name: `${r.months} months of updates`,
              price: r.price_usd,
              priceCurrency: 'USD',
            })),
          }}
        />
      )}
      <WlHero eyebrow="White-label · updates" title={t('title', 'Updates and renewals')}>
        <p className={styles.lead}>
          {catalog ? (
            <Translate id="whiteLabel.updates.lead" values={{ months: catalog.updates.included_months }}>
              {'An update is a release of capacitor-auth-manager, rebuilt with your rename and published under your scope. Your license includes {months} months of them.'}
            </Translate>
          ) : (
            t('leadNoCatalog', 'An update is a release of capacitor-auth-manager, rebuilt with your rename and published under your scope.')
          )}
        </p>
      </WlHero>

      <main className={styles.block}>
        <div className={`container ${styles.split}`}>
          <div>
            <h2>{t('kinds.title', 'What counts as an update')}</h2>
            <ul>
              {KINDS.map(([id, lead, rest]) => (
                <li key={id}>
                  <strong>{t(`kinds.${id}.lead`, lead)}</strong> {t(`kinds.${id}.rest`, rest)}
                </li>
              ))}
            </ul>
            <p>
              {t(
                'lapse',
                'The included months run from the purchase date. Without a renewal, the versions already published under your name stay on npm and keep working. New releases stop until you renew.',
              )}
            </p>
            <h2>{t('renewals.title', 'Renewals')}</h2>
            {renewals.length ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t('renewals.length', 'Length')}</th>
                    <th>{t('renewals.price', 'Price')}</th>
                  </tr>
                </thead>
                <tbody>
                  {renewals.map((r) => (
                    <tr key={r.months}>
                      <td>
                        <Translate id="whiteLabel.updates.renewals.months" values={{ months: r.months }}>
                          {'{months} months'}
                        </Translate>
                      </td>
                      <td>{formatUsd(r.price_usd)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>{t('renewals.unavailable', 'Renewal prices aren’t loading right now. Send the form and we’ll reply with them.')}</p>
            )}
            <p>{t('renewals.from', 'A renewal starts from the later of today and your current end date, so renewing early loses nothing.')}</p>
          </div>

          <div>
            <h2>{t('form.title', 'Renew by license key')}</h2>
            {!canPay && <p>{t('form.intro', 'Enter your key and the email it was issued to. We reply with the renewal and its payment link.')}</p>}
            {send.kind === 'sent' ? (
              <StatusNote tone="ok">{t('form.sent', 'Renewal request sent. We’ll reply to the license email.')}</StatusNote>
            ) : (
              <form className={styles.form} onSubmit={onSubmit}>
                {!canPay && <Field label={t('form.name', 'Name')} name="name" required autoComplete="name" />}
                <Field label={t('form.key', 'License key')} name="key" required placeholder="CAPAUTH-WL-…" autoComplete="off" />
                <Field label={t('form.email', 'License email')} name="email" type="email" required autoComplete="email" />
                {renewals.length > 0 && (
                  <label className={styles.field}>
                    <span>{t('form.length', 'Length')}</span>
                    <select className={styles.input} name="months" defaultValue={renewals[renewals.length - 1].months}>
                      {renewals.map((r) => (
                        <option key={r.months} value={r.months}>
                          {translate(
                            { id: 'whiteLabel.updates.form.option', message: '{months} months, {price}' },
                            { months: r.months, price: formatUsd(r.price_usd) },
                          )}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {send.kind === 'failed' && <StatusNote tone="bad">{send.message}</StatusNote>}
                <div className={styles.actions}>
                  <Link className={`button button--outline button--primary ${styles.tap}`} to="/white-label">
                    <Translate id="whiteLabel.form.back">Back</Translate>
                  </Link>
                  <button className={`button button--primary ${styles.tap}`} type="submit" disabled={send.kind === 'sending'}>
                    {send.kind === 'sending'
                      ? t('form.sending', 'Sending…')
                      : canPay
                        ? t('form.pay', 'Continue to payment')
                        : t('form.send', 'Request renewal')}
                  </button>
                </div>
                <Consent />
              </form>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
