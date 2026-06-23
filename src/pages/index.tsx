import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';

type Feature = {
  title: string;
  body: string;
};

const FEATURES: Feature[] = [
  {
    title: 'One API, 15 providers',
    body: 'Google, Apple, Microsoft, Facebook, GitHub, Slack, LinkedIn, Firebase, plus email/username/phone-password, email-code and SMS OTP, magic link, and biometric — all behind a single auth.signIn() call.',
  },
  {
    title: 'Framework-agnostic',
    body: 'A core singleton (works like Zustand — no context providers) with first-class adapters for React hooks, Vue composables, an Angular service/module/guard, and plain vanilla JS.',
  },
  {
    title: 'Optional Capacitor',
    body: 'Use it in any web app without Capacitor. Add the optional native iOS/Android plugin only when you ship a mobile build. The web path is the primary, fully-implemented surface.',
  },
  {
    title: 'Tree-shakeable, dynamic loading',
    body: 'sideEffects:false and per-provider dynamic imports mean a bundle only includes the providers you actually call. Separate entry points keep React out of a Vue build, and vice versa.',
  },
  {
    title: 'Security built in',
    body: 'S256 PKCE on manual OAuth code flows, OIDC nonce and ID-token exp validation, pluggable secure storage (inject CapacitorPreferencesStorage on native), and AES-GCM web fallback for biometric material.',
  },
  {
    title: 'TypeScript-first',
    body: 'Every provider option, credential shape, result, and error code is typed. Switch on AuthErrorCode reliably; import AuthUser, AuthResult, StorageInterface, and more for full IntelliSense.',
  },
];

function HomepageHeader(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
        <p className={styles.heroTagline}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/getting-started/quick-start">
            Quick Start — 5 min
          </Link>
          <Link className="button button--secondary button--lg" to="/getting-started/installation">
            Installation
          </Link>
          <Link
            className="button button--outline button--lg"
            href="https://www.npmjs.com/package/capacitor-auth-manager"
          >
            View on npm
          </Link>
        </div>
      </div>
    </header>
  );
}

function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.featuresWrap}>
      <div className="container">
        <div className="row">
          {FEATURES.map((f) => (
            <div key={f.title} className="col col--4" style={{ marginBottom: '1.5rem' }}>
              <div className={styles.featureCard}>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureBody}>{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AuthorStrip(): ReactNode {
  return (
    <section className={styles.authorStrip}>
      <div className="container">
        <p>
          Built and maintained by{' '}
          <Link href="https://aoneahsan.com">Ahsan Mahmood</Link> —{' '}
          <Link href="https://linkedin.com/in/aoneahsan">LinkedIn</Link> ·{' '}
          <Link href="https://github.com/aoneahsan">GitHub</Link> ·{' '}
          <Link href="https://www.npmjs.com/~aoneahsan">npm</Link>
        </p>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} — Universal auth for web & Capacitor`}
      description="Documentation for capacitor-auth-manager: 15 authentication providers behind one framework-agnostic API for React, Vue, Angular, vanilla JS, and optional Capacitor apps."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <AuthorStrip />
      </main>
    </Layout>
  );
}
