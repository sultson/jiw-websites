import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App, { allRoutePaths, routeMetaFor } from './App';

export { allRoutePaths, routeMetaFor };

export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <App initialPath={path} />
    </StrictMode>,
  );
}
