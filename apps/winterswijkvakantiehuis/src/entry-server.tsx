import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App, { allRoutePaths, routeMetaFor } from './App';
import { EMAIL_LOGO_PATH, SITE_URL } from './site';

export { allRoutePaths, routeMetaFor, SITE_URL, EMAIL_LOGO_PATH };

export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <App initialPath={path} />
    </StrictMode>,
  );
}
