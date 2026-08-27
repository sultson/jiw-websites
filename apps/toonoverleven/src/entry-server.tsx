import { renderToReadableStream } from 'react-dom/server';
import App, { type Start } from './App';
import { zetStartPad } from './router';

/**
 * De site getekend op de server.
 *
 * De Worker haalt de inhoud toch al op om hem in de HTML mee te sturen, dus
 * kan hij de pagina er net zo goed meteen mee tekenen. Dan staat de tekst in de
 * broncode: een zoekmachine, een voorleesprogramma en een telefoon met een
 * trage verbinding zien de pagina zonder eerst JavaScript te draaien. De
 * browser hangt zich daarna aan dezelfde HTML vast en neemt het over.
 */
export async function tekenPagina(start: Start): Promise<string> {
  zetStartPad(start.pad);
  const stroom = await renderToReadableStream(<App start={start} />, {
    // Een fout in één blok mag niet de hele pagina leeg maken: de browser
    // tekent hem dan alsnog.
    onError() {},
  });
  await stroom.allReady;
  return await new Response(stroom).text();
}
