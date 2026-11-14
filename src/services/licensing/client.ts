/**
 * The one module that talks to our licensing service. Every price, label and renewal plan on the
 * white-label pages comes from here; the site holds no price of its own.
 */

export const LICENSING_API = 'https://fileshub.zaions.com/api/licensing/v1';
export const PRODUCT_SLUG = 'capacitor-auth-manager';

export type SalesState = 'on_sale' | 'quote_only' | 'acquired';

export interface CatalogGroup {
  key: string;
  label: string;
  price_usd: number;
}

export interface RenewalPlan {
  months: number;
  price_usd: number;
}

export interface Catalog {
  product: { slug: string; name: string; key_prefix: string };
  sales_state: SalesState;
  checkout_available: boolean;
  currency: string;
  groups: CatalogGroup[];
  buyout: { available: boolean; price_usd: number; combined_category: boolean };
  updates: { included_months: number; renewals: RenewalPlan[] };
  sidecar_path: string;
  turnstile: { required: boolean; site_key: string | null; action: string | null };
  updated_at: string;
}

export interface Quote {
  subtotal_usd: number;
  discount_pct: number;
  discount_usd: number;
  total_usd: number;
  updates_months: number;
}

export type KeyVerdict = 'valid' | 'pending_setup' | 'revoked' | 'not_found' | 'invalid_format';
export type DomainVerdict =
  | 'authorized'
  | 'domain_mismatch'
  | 'revoked'
  | 'not_a_valid_license'
  | 'no_file'
  | 'unreachable'
  | 'rate_limited';

export interface VerifyResult {
  verdict: KeyVerdict | DomainVerdict;
  license?: {
    public_key: string;
    product: string;
    client: string;
    domains: string[];
    type: string;
    groups: string[];
    status: string;
    issued_at: string | null;
    updates_until: string | null;
    revoked_at: string | null;
  } | null;
}

export interface OrderStatus {
  status: 'pending' | 'paid' | 'failed';
  kind: string;
  public_key: string | null;
}

/** A failed call, carrying the service's machine code (or `network`) and its message. */
export class LicensingError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'LicensingError';
  }
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${LICENSING_API}${path}`, {
      ...init,
      headers: { Accept: 'application/json', ...(init?.body ? { 'Content-Type': 'application/json' } : {}) },
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new LicensingError('network', 'The licensing service did not answer.', 0);
  }
  const body = (await res.json().catch(() => null)) as { data?: T; error?: string; message?: string } | null;
  if (!res.ok || !body || body.data === undefined) {
    throw new LicensingError(body?.error ?? 'http_error', body?.message ?? `HTTP ${res.status}`, res.status);
  }
  return body.data;
}

const post = <T>(path: string, payload: unknown) => call<T>(path, { method: 'POST', body: JSON.stringify(payload) });
const product = `/products/${PRODUCT_SLUG}`;

/** Reads the product's catalogue: groups, prices, sales state and renewal plans. */
export const fetchCatalog = (): Promise<Catalog> => call<Catalog>(`${product}/catalog`);

/** Asks the service to price a white-label licence for the given groups. */
export const quoteLicence = (groups: string[]): Promise<Quote> =>
  post<Quote>(`${product}/quote`, { kind: 'white_label', groups });

export interface Buyer {
  name: string;
  email: string;
  company?: string;
  domain?: string;
}

/** Starts a checkout; the caller sends the browser to the returned URL. */
export const startCheckout = (groups: string[], buyer: Buyer, notes?: string) =>
  post<{ checkout_url: string; order_id: string }>(`${product}/checkout`, {
    kind: 'white_label',
    groups,
    buyer,
    notes: notes || undefined,
    success_path: '/white-label/thank-you',
    cancel_path: `/white-label/pricing?groups=${groups.join(',')}`,
  });

/** Starts a renewal checkout for an existing licence key. */
export const startRenewal = (publicKey: string, months: number, email: string) =>
  post<{ checkout_url: string; order_id: string }>(`${product}/renewals`, {
    public_key: publicKey,
    months,
    email,
    success_path: '/white-label/thank-you',
    cancel_path: '/white-label/updates',
  });

export interface Inquiry {
  kind: 'quote' | 'custom_work';
  name: string;
  email: string;
  company?: string;
  groups?: string[];
  message: string;
}

/** Sends a quote request or a custom-work inquiry; the service emails both sides. */
export const sendInquiry = (inquiry: Inquiry) => post<unknown>(`${product}/inquiries`, inquiry);

/** Checks a licence by its public key. */
export const verifyByKey = (key: string) =>
  call<VerifyResult>(`/licenses/verify?key=${encodeURIComponent(key)}`);

/** Checks the licence file a domain serves. */
export const verifyByDomain = (domain: string) =>
  call<VerifyResult>(`/licenses/verify?domain=${encodeURIComponent(domain)}&product=${PRODUCT_SLUG}`);

/** One read of an order on the thank-you page; never polled. */
export const fetchOrder = (orderId: string) => call<OrderStatus>(`/orders/${encodeURIComponent(orderId)}`);

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

/** Formats a whole-dollar amount from the service, in the site's US English locale. */
export const formatUsd = (amount: number): string => usd.format(amount);
