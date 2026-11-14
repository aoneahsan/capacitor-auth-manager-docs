import type { ReactNode } from 'react';
import clsx from 'clsx';
import Head from '@docusaurus/Head';
import CodeBlock from '@theme/CodeBlock';
import Translate, { translate } from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './styles.module.css';

/** The hero every white-label page opens with: a monospace eyebrow, the page's h1 and its lead, plus the section's share card. */
export function WlHero({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  const card = useBaseUrl('/img/white-label-card.png', { absolute: true });
  return (
    <header className={styles.hero}>
      <Head>
        <meta property="og:image" content={card} />
        <meta name="twitter:image" content={card} />
      </Head>
      <div className="container">
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        {children}
      </div>
    </header>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email';
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  multiline?: boolean;
  defaultValue?: string;
}

/** One labelled form field; optional fields say so beside the label. */
export function Field({ label, name, type = 'text', required, placeholder, autoComplete, multiline, defaultValue }: FieldProps) {
  return (
    <label className={styles.field}>
      <span>
        {label}
        {!required && (
          <span className={styles.optional}>
            {' '}
            <Translate id="whiteLabel.form.optional">(optional)</Translate>
          </span>
        )}
      </span>
      {multiline ? (
        <textarea
          className={clsx(styles.input, styles.area)}
          name={name}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          maxLength={2000}
        />
      ) : (
        <input
          className={styles.input}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
        />
      )}
    </label>
  );
}

/** The single line every pay or request button carries beneath it. */
export function Consent() {
  return (
    <p className={styles.consent}>
      <Translate id="whiteLabel.form.consent">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </Translate>
    </p>
  );
}

/** A polite live region for a form's result. */
export function StatusNote({ tone, children }: { tone: 'ok' | 'bad' | 'neutral'; children: ReactNode }) {
  return (
    <div
      role="status"
      className={clsx(styles.status, tone === 'ok' && styles.statusOk, tone === 'bad' && styles.statusBad)}
    >
      {children}
    </div>
  );
}

/** Structured data matching what the page shows. */
export function JsonLd({ data }: { data: object }) {
  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Head>
  );
}

const RENAME = `  // package.json
- "name": "capacitor-auth-manager"
+ "name": "@acme/sign-in"
  // CapacitorAuthManager.podspec
- s.name = 'CapacitorAuthManager'
+ s.name = 'AcmeSignIn'
  // android/build.gradle
- namespace = "com.aoneahsan.capacitor_auth_manager"
+ namespace = "com.acme.sign_in"
  // src/capacitor-plugin.ts
- registerPlugin('CapacitorAuthManager', …)
+ registerPlugin('AcmeSignIn', …)
  // your app
- import { auth, AuthProvider } from 'capacitor-auth-manager';
+ import { auth, AuthProvider } from '@acme/sign-in';`;

/** What a managed build renames, shown the way this site shows every code change. */
export function RenameDiff() {
  return (
    <CodeBlock
      language="diff"
      title={translate({ id: 'whiteLabel.rename.title', message: 'A managed build, for a team called Acme' })}
    >
      {RENAME}
    </CodeBlock>
  );
}

/** Turns a licensing error (machine code and HTTP status) into a sentence the reader can act on. */
export function failureMessage(code: string, status = 0): string {
  if (code === 'network') {
    return translate({
      id: 'whiteLabel.error.network',
      message: "The licensing service didn't answer. Check your connection and send it again.",
    });
  }
  if (code === 'turnstile_required') {
    return translate({
      id: 'whiteLabel.error.challenge',
      message: 'This form needs a quick human check that did not load. Reload the page and send it again.',
    });
  }
  if (status === 429 || code === 'rate_limited') {
    return translate({
      id: 'whiteLabel.error.rateLimited',
      message: 'Too many tries from this connection. Wait a minute, then send it again.',
    });
  }
  return translate({
    id: 'whiteLabel.error.generic',
    message: "That didn't go through. Check the fields above, or write to aoneahsan@gmail.com.",
  });
}
