import { useEffect, useState } from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import { fetchCatalog, type Catalog } from '@site/src/services/licensing/client';

export type CatalogState = 'built' | 'live' | 'unavailable';

/**
 * The catalogue read at build time (so prerendered HTML carries the service's prices), re-read once
 * on load. When the live read fails, the catalogue is dropped: the page shows the request form and
 * never a build-time number presented as current.
 */
export function useCatalog(): { catalog: Catalog | null; state: CatalogState } {
  const built = (usePluginData('white-label-catalog') as { catalog: Catalog | null } | undefined)?.catalog ?? null;
  const [catalog, setCatalog] = useState<Catalog | null>(built);
  const [state, setState] = useState<CatalogState>(built ? 'built' : 'unavailable');

  useEffect(() => {
    let alive = true;
    fetchCatalog()
      .then((c) => {
        if (!alive) return;
        setCatalog(c);
        setState('live');
      })
      .catch(() => {
        if (!alive) return;
        setCatalog(null);
        setState('unavailable');
      });
    return () => {
      alive = false;
    };
  }, []);

  return { catalog, state };
}
