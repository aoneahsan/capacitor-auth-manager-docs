import { useEffect, useState, type ReactNode } from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { useLocation } from '@docusaurus/router';
import { translate } from '@docusaurus/Translate';

import { StatusNote, WlHero } from '@site/src/components/WhiteLabel/parts';
import { fetchOrder, type OrderStatus } from '@site/src/services/licensing/client';
import styles from '@site/src/components/WhiteLabel/styles.module.css';

const t = (id: string, message: string) => translate({ id: `whiteLabel.thanks.${id}`, message });

/** Where checkout returns. One read of the order on load; the email carries the license, so nothing polls. */
export default function WhiteLabelThankYou(): ReactNode {
  const location = useLocation();
  const [order, setOrder] = useState<OrderStatus | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(location.search).get('order');
    if (!id) return;
    fetchOrder(id).then(setOrder).catch(() => setOrder(null));
  }, [location.search]);

  return (
    <Layout title={t('meta.title', 'Thank you')} description={t('meta.description', 'Your white-label order for Capacitor Auth Manager.')}>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <WlHero eyebrow="White-label" title={t('title', 'Thank you. Check your email.')}>
        <p className={styles.lead}>
          {t('lead', 'The license key and its certificate go to the email you paid with. Next, we ask for your npm scope and docs domain, then publish your first build.')}
        </p>
      </WlHero>
      <main className={styles.block}>
        <div className="container">
          {order?.status === 'paid' && (
            <StatusNote tone="ok">
              {order.public_key
                ? translate({ id: 'whiteLabel.thanks.paidKey', message: 'Payment received. Your license key is {key}.' }, { key: order.public_key })
                : t('paid', 'Payment received. Your license key is on its way by email.')}
            </StatusNote>
          )}
          {order?.status === 'pending' && (
            <StatusNote tone="neutral">{t('pending', 'The payment is still being confirmed. The email arrives as soon as it is.')}</StatusNote>
          )}
          {order?.status === 'failed' && (
            <StatusNote tone="bad">{t('failed', 'This payment didn’t go through. You can start again from the pricing page.')}</StatusNote>
          )}
          <p className="margin-top--md">
            <Link to="/licensing/setup">{t('setup', 'What happens during setup')}</Link>
          </p>
        </div>
      </main>
    </Layout>
  );
}
