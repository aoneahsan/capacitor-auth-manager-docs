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
    title: 'The same Google call everywhere',
    body: 'auth.signIn(AuthProvider.GOOGLE) routes to GoogleSignIn on iOS, Credential Manager on Android, and Google Identity Services on the web — one call, the same result.idToken on every platform.',
  },
  {
    title: 'Firebase-agnostic',
    body: 'No firebase dependency is pulled in. You get a Google id token and feed it to Firebase yourself: signInWithCredential(getAuth(), GoogleAuthProvider.credential(result.credential.idToken)). Identical on web and native.',
  },
  {
    title: 'A capacitor-google-auth alternative',
    body: 'A drop-in alternative to @codetrix-studio/capacitor-google-auth that you own — using the modern Android Credential Manager and GoogleSignIn SDKs, with the id token moving from result.authentication.idToken to result.credential.idToken.',
  },
  {
    title: 'Framework-agnostic',
    body: 'A core singleton (works like Zustand — no context providers) with first-class adapters for React hooks, Vue composables, an Angular service/module/guard, and plain vanilla JS.',
  },
  {
    title: 'Google-first, growing',
    body: 'Google is enabled and verified on web + iOS + Android in 2.5.x. The other 14 providers are being re-enabled one at a time; until then they throw AuthErrorCode.PROVIDER_NOT_ENABLED.',
  },
  {
    title: 'TypeScript-first & secure by default',
    body: 'Every option, credential, result, and error code is typed. No secrets are persisted by default; the web flow returns an id token only (no client secret, no backend required).',
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
      title={`${siteConfig.title} — Firebase-agnostic Google sign-in for web & Capacitor`}
      description="Documentation for capacitor-auth-manager: Firebase-agnostic Google authentication for the web and Capacitor (iOS/Android) — a drop-in alternative to @codetrix-studio/capacitor-google-auth, with one auth.signIn(AuthProvider.GOOGLE) call on every platform. Works with React, Vue, Angular, and vanilla JS."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <AuthorStrip />
      </main>
    </Layout>
  );
}
