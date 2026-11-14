import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';

import { JsonLd, RenameDiff, WlHero } from '@site/src/components/WhiteLabel/parts';
import { useCatalog } from '@site/src/components/WhiteLabel/useCatalog';
import { formatUsd } from '@site/src/services/licensing/client';
import styles from '@site/src/components/WhiteLabel/styles.module.css';

const SITE = 'https://capacitor-auth-manager-docs.aoneahsan.com';

const RUN = [
  ['run.publish', 'Publishing under your scope', 'Each release goes to npm as your package, with your name in the README, the package metadata and the changelog.'],
  ['run.releases', 'Every upstream release, carried over', 'When capacitor-auth-manager ships a patch, a feature or a major, we apply your rename to it and check the packed tarball, not only the source tree, before it goes out.'],
  ['run.docs', 'Docs on your domain', 'This documentation, rebranded to your package name and logo, hosted on a domain you choose.'],
  ['run.name', 'The name and the logo', 'The right to say your package is built on Capacitor Auth Manager and to show its logo. The MIT license doesn’t grant that.'],
  ['run.verify', 'A license anyone can check', 'Your docs domain serves a license file, and anyone can confirm it on the verify page.'],
  ['run.changes', 'One contact for changes', 'Work only your apps need, from an earlier provider to a different credential handoff, is quoted separately.'],
] as const;

const SUITS = [
  ['suits.company', 'A company with several Capacitor apps', 'One sign-in package across your apps, carrying your company’s name.'],
  ['suits.agency', 'An agency', 'A branded sign-in SDK you hand to each client’s app team.'],
  ['suits.platform', 'A platform with its own SDK', 'Google sign-in for your customers’ Capacitor apps, under your package name.'],
] as const;

const FAQ = [
  ['faq.source', 'Do we get the source code?', 'It’s already public under MIT on GitHub. The license covers our work on your build and the right to the name and logo.'],
  ['faq.providers', 'Which providers does our build include?', 'The same as the upstream release it’s built from. In 3.x that’s Google on web, iOS and Android.'],
  ['faq.exclusive', 'Is the license exclusive?', 'No. We may license the package to other teams.'],
  ['faq.after', 'What happens after the included months?', 'The versions already published under your name stay on npm and keep working. New releases need a renewal.'],
  ['faq.check', 'How does someone check our license?', 'By your license key or your docs domain, on the verify page.'],
] as const;

const t = (id: string, message: string) => translate({ id: `whiteLabel.overview.${id}`, message });

export default function WhiteLabelOverview(): ReactNode {
  const { catalog } = useCatalog();
  const group = catalog?.groups[0];
  const lowest = catalog?.groups.length ? Math.min(...catalog.groups.map((g) => g.price_usd)) : null;
  const faq = FAQ.map(([id, q, a]) => ({ q: t(`${id}.q`, q), a: t(`${id}.a`, a) }));

  return (
    <Layout
      title={t('meta.title', 'White-label Capacitor Auth Manager under your npm name')}
      description={t(
        'meta.description',
        'We rename capacitor-auth-manager across npm, iOS and Android, publish each release under your npm scope, host its docs on your domain and keep it updated. The code stays MIT.',
      )}
    >
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Capacitor Auth Manager white-label license',
          description: 'A managed, rebranded build of the capacitor-auth-manager npm package, published and maintained under the buyer’s npm scope.',
          url: `${SITE}/white-label`,
          brand: { '@type': 'Brand', name: 'Capacitor Auth Manager' },
          ...(lowest !== null && {
            offers: { '@type': 'Offer', price: lowest, priceCurrency: 'USD', url: `${SITE}/white-label/pricing` },
          }),
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
        }}
      />
      <WlHero eyebrow="npm install @your-scope/auth" title={t('title', 'Capacitor Auth Manager, published under your name')}>
        <p className={styles.lead}>
          {t(
            'lead',
            'Your app teams install your package, read docs on your domain and file issues with you. We rename the package across npm, iOS and Android, publish each release under your scope and keep it in step with capacitor-auth-manager. The code stays MIT. What you pay for is that work, and the right to say your package is built on Capacitor Auth Manager, logo included.',
          )}
        </p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/white-label/pricing">
            <Translate id="whiteLabel.overview.cta.price">See the license price</Translate>
          </Link>
          <Link className="button button--outline button--primary button--lg" to="/white-label/custom-work">
            <Translate id="whiteLabel.overview.cta.custom">Ask about custom work</Translate>
          </Link>
        </div>
      </WlHero>

      <main>
        <section className={styles.block}>
          <div className={`container ${styles.split}`}>
            <div>
              <h2>{t('changes.title', 'What changes in your build')}</h2>
              <p>
                {t(
                  'changes.body',
                  'Four platforms carry the package’s name, so a rebrand touches four places, plus the import line in every app. We make these changes once, then carry them into every release.',
                )}
              </p>
              <p>
                <Translate
                  id="whiteLabel.overview.changes.same"
                  values={{ call: <code>auth.signIn(AuthProvider.GOOGLE)</code> }}
                >
                  {'The API doesn’t change. {call} returns the same credential, and your build has the same providers as the release it’s built from. In 3.x that’s Google on web, iOS and Android.'}
                </Translate>
              </p>
            </div>
            <RenameDiff />
          </div>
        </section>

        <section className={styles.blockAlt}>
          <div className="container">
            <h2>{t('run.title', 'What we run for you')}</h2>
            <div className={styles.cards}>
              {RUN.map(([id, title, body]) => (
                <div key={id} className={styles.card}>
                  <h3>{t(`${id}.title`, title)}</h3>
                  <p>{t(`${id}.body`, body)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.block}>
          <div className={`container ${styles.split}`}>
            <div className={styles.note}>
              <h2>{t('fork.title', 'The code is already yours to fork')}</h2>
              <p>
                {t(
                  'fork.body',
                  'Anyone can fork capacitor-auth-manager and publish it under another name today. The MIT license allows it. A license makes sense when you’d rather not own that fork: four platforms’ identifiers on every release, Google’s SDK changes, and docs that keep up.',
                )}
              </p>
              <p>
                {t(
                  'fork.noBuyout',
                  'The source is already open, so there’s no buyout, and a license isn’t exclusive. We may license the package to other teams too.',
                )}
              </p>
            </div>
            <div>
              <h2>{t('price.title', 'Price')}</h2>
              {group ? (
                <>
                  <p className={styles.price}>
                    {formatUsd(group.price_usd)}{' '}
                    <span className={styles.priceFor}>
                      <Translate id="whiteLabel.overview.price.for" values={{ label: group.label }}>
                        {'for the {label}'}
                      </Translate>
                    </span>
                  </p>
                  <p>
                    <Translate id="whiteLabel.overview.price.updates" values={{ months: catalog?.updates.included_months }}>
                      {'Includes {months} months of updates from the purchase date. After that, renewals keep new releases coming.'}
                    </Translate>{' '}
                    <Link to="/white-label/updates">{t('price.updatesLink', 'Updates and renewals')}</Link>
                  </p>
                </>
              ) : (
                <p>{t('price.unavailable', 'Ask for a quote and we’ll reply with the current price.')}</p>
              )}
              <Link className={`button button--primary ${styles.tap}`} to="/white-label/pricing">
                <Translate id="whiteLabel.overview.price.cta">Request a license</Translate>
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.blockAlt}>
          <div className="container">
            <h2>{t('suits.title', 'Who it suits')}</h2>
            <div className={styles.cards}>
              {SUITS.map(([id, title, body]) => (
                <div key={id} className={styles.card}>
                  <h3>{t(`${id}.title`, title)}</h3>
                  <p>{t(`${id}.body`, body)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.block}>
          <div className={`container ${styles.faq}`}>
            <h2>{t('faq.title', 'Questions')}</h2>
            {faq.map(({ q, a }) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
            <p>
              <Translate
                id="whiteLabel.overview.more"
                values={{
                  docs: <Link to="/licensing/overview">{t('more.docs', 'White-label docs')}</Link>,
                  terms: <Link to="/white-label/license-terms">{t('more.terms', 'license terms')}</Link>,
                  verify: <Link to="/verify-license">{t('more.verify', 'verify page')}</Link>,
                }}
              >
                {'Setup steps and delivery details are in the {docs}. The full agreement is in the {terms}, and any license can be checked on the {verify}.'}
              </Translate>
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
