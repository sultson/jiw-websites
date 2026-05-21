import { useCallback, useEffect, useState } from 'react';

export type Route = 'home' | 'about' | 'services' | 'contact';

function parseHash(): Route {
  if (typeof window === 'undefined') return 'home';
  const raw = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (raw === 'about' || raw === 'over-mij' || raw === 'over') return 'about';
  if (raw === 'services' || raw === 'diensten') return 'services';
  if (raw === 'contact') return 'contact';
  return 'home';
}

export function useRoute() {
  const [route, setRouteState] = useState<Route>(parseHash);

  useEffect(() => {
    const onHash = () => setRouteState(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [route]);

  const go = useCallback((next: Route) => {
    const hash = next === 'home' ? '' : `#/${next}`;
    if (window.location.hash !== hash) {
      window.history.pushState(null, '', window.location.pathname + (hash || ''));
      setRouteState(next);
    }
  }, []);

  return { route, go };
}
