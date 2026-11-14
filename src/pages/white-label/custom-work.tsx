import { useState, type FormEvent, type ReactNode } from 'react';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';

import { Field, JsonLd, StatusNote, WlHero, failureMessage } from '@site/src/components/WhiteLabel/parts';
import { LicensingError, sendInquiry } from '@site/src/services/licensing/client';
import styles from '@site/src/components/WhiteLabel/styles.module.css';

const SITE = 'https://capacitor-auth-manager-docs.aoneahsan.com';
const t = (id: string, message: string) => translate({ id: `whiteLabel.custom.${id}`, message });

type SendView = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'failed'; message: string };

const ASKS = [
  ['provider', 'A provider before it’s enabled upstream', 'Fourteen providers are in the source but not yet registered. We can verify and enable one in your build first.'],
  ['handoff', 'A different credential handoff', 'Changes to how the credential reaches your backend, for a session model the stock package doesn’t cover.'],
  ['adapter', 'Your own adapter', 'A wrapper for a framework or state library your apps use, beside the React, Vue and Angular adapters.'],
] as const;

export default function WhiteLabelCustomWork(): ReactNode {
  const [send, setSend] = useState<SendView>({ kind: 'idle' });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = String(form.get('message') ?? '').trim();
    if (message.length < 10) {
      setSend({ kind: 'failed', message: t('form.short', 'Tell us a little more: a sentence or two is enough.') });
      return;
    }
    setSend({ kind: 'sending' });
    try {
      await sendInquiry({
        kind: 'custom_work',
        name: String(form.get('name') ?? '').trim(),
        email: String(form.get('email') ?? '').trim(),
        company: String(form.get('company') ?? '').trim() || undefined,
        message,
      });
      setSend({ kind: 'sent' });
    } catch (error) {
      const e = error instanceof LicensingError ? error : new LicensingError('unknown', '', 0);
      setSend({ kind: 'failed', message: failureMessage(e.code, e.status) });
    }
  }

  return (
    <Layout
      title={t('meta.title', 'Custom work on Capacitor Auth Manager')}
      description={t(
        'meta.description',
        'Changes to capacitor-auth-manager that only your apps need, from enabling a provider early to a different credential handoff, quoted separately from the white-label license.',
      )}
    >
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Custom work on Capacitor Auth Manager',
          url: `${SITE}/white-label/custom-work`,
        }}
      />
      <WlHero eyebrow="White-label · custom work" title={t('title', 'Changes only your apps need')}>
        <p className={styles.lead}>
          {t('lead', 'Custom work sits outside the license and is quoted on its own. Describe what your apps need and we’ll reply with a scope and a price.')}
        </p>
      </WlHero>
      <main className={styles.block}>
        <div className={`container ${styles.split}`}>
          <div>
            <h2>{t('asks.title', 'What teams ask for')}</h2>
            <div className={styles.stack}>
              {ASKS.map(([id, title, body]) => (
                <div key={id} className={styles.card}>
                  <h3>{t(`asks.${id}.title`, title)}</h3>
                  <p>{t(`asks.${id}.body`, body)}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2>{t('form.title', 'Tell us about it')}</h2>
            {send.kind === 'sent' ? (
              <StatusNote tone="ok">{t('form.sent', 'Sent. We’ll reply to your email with questions or a quote.')}</StatusNote>
            ) : (
              <form className={styles.form} onSubmit={onSubmit}>
                <div className={styles.row2}>
                  <Field label={t('form.name', 'Name')} name="name" required autoComplete="name" />
                  <Field label={t('form.email', 'Work email')} name="email" type="email" required autoComplete="email" />
                </div>
                <Field label={t('form.company', 'Company')} name="company" autoComplete="organization" />
                <Field label={t('form.message', 'What do you need?')} name="message" required multiline />
                {send.kind === 'failed' && <StatusNote tone="bad">{send.message}</StatusNote>}
                <div className={styles.actions}>
                  <button className={`button button--primary ${styles.tap}`} type="submit" disabled={send.kind === 'sending'}>
                    {send.kind === 'sending' ? (
                      <Translate id="whiteLabel.custom.form.sending">Sending…</Translate>
                    ) : (
                      <Translate id="whiteLabel.custom.form.send">Send</Translate>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
