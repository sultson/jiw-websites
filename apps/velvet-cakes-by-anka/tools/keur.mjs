/* Browsercontrole op de live site.
 *
 * tools/vooraf.mjs leest de html en zegt of de pagina heel is. Dat bewijst niet
 * dat de dingen die JavaScript doet ook werken, en dat is precies waar bij deze
 * site iets aan veranderd is: het formulier verstuurt sinds de verhuizing echt,
 * de taalkiezer is van drie knoppen naar drie links gegaan, en het menu leest
 * zijn actieve item nu uit het fragment van een absolute link in plaats van uit
 * href.slice(1).
 *
 * Vijf dingen, in een echte Chromium:
 *   1. de taalkiezer gaat naar dezelfde pagina in de andere taal
 *   2. het menu licht het juiste item op bij scrollen
 *   3. de grote fotoweergave opent en bladert door
 *   4. niets loopt buiten het scherm, op zes breedtes
 *   5. het formulier verstuurt en de bedankregel komt ervoor in de plaats
 *
 *   node tools/keur.mjs                 alles behalve het formulier
 *   node tools/keur.mjs --verstuur      ook een echte inzending
 *
 * Die laatste staat achter een vlag omdat hij een echte mail stuurt. Dat mag
 * zolang LEAD_RECIPIENT op hallo@jouwidealewebsite.nl staat; gaat hij ooit naar
 * info@velvetcakesbyanka.nl, dan mailt deze vlag de klant. Hij kijkt daarom
 * eerst zelf of het adres nog van ons is.
 */
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const ADRES = process.env.VC_ADRES || 'https://velvetcakesbyanka.nl';
const VERSTUUR = process.argv.includes('--verstuur');

const klachten = [];
const zeg = t => { klachten.push(t); console.log(`  FOUT  ${t}`); };
const goed = t => console.log(`  ok    ${t}`);

/* Voor de --verstuur-vlag: alleen als de aanvragen nog bij ons binnenkomen.
   Een testinzending tegen een echte klantmailbox is niet terug te draaien. */
if (VERSTUUR) {
  const config = readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8');
  const naar = config.match(/"LEAD_RECIPIENT":\s*"([^"]+)"/)?.[1];
  if (naar !== 'hallo@jouwidealewebsite.nl') {
    console.error(`\nLEAD_RECIPIENT staat op ${naar}, niet op hallo@jouwidealewebsite.nl.`);
    console.error('Een inzending mailt dan een echte mailbox. Zet hem eerst terug.');
    process.exit(1);
  }
}

const browser = await chromium.launch();

try {
  // --- 1. de taalkiezer ----------------------------------------------------
  console.log('\n1. taalkiezer');
  {
    const pagina = await browser.newPage();
    await pagina.goto(`${ADRES}/taarten`, { waitUntil: 'domcontentloaded' });
    for (const [taal, verwacht] of [['EN', '/en/taarten'], ['RO', '/ro/taarten']]) {
      const href = await pagina.getAttribute(`.taalkiezer a:text-is("${taal}")`, 'href');
      if (href === verwacht) goed(`${taal} wijst naar ${verwacht}`);
      else zeg(`${taal} wijst naar ${href}, ${verwacht} verwacht`);
    }
    // en de pagina waar je staat is geen link
    const nu = await pagina.$('.taalkiezer span.is-nu[aria-current="true"]');
    if (nu && (await nu.textContent()).trim() === 'NL') goed('NL is geen link maar aria-current');
    else zeg('de taal waar je staat is geen aria-current span');

    // doorklikken en kijken of je er echt komt, in de juiste taal
    await pagina.click('.taalkiezer a:text-is("RO")');
    await pagina.waitForLoadState('domcontentloaded');
    const lang = await pagina.getAttribute('html', 'lang');
    const kop = (await pagina.textContent('h1')).trim();
    if (lang === 'ro' && kop === 'Torturi') goed(`doorgeklikt naar ro, kop "${kop}"`);
    else zeg(`na doorklikken lang=${lang}, kop "${kop}"`);
    await pagina.close();
  }

  // --- 2. het menu bij scrollen -------------------------------------------
  console.log('\n2. actief menu-item bij scrollen');
  {
    const pagina = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await pagina.goto(ADRES, { waitUntil: 'load' });
    await pagina.evaluate(() => document.querySelector('#over').scrollIntoView());
    await pagina.waitForTimeout(700);
    const aan = await pagina.$$eval('.menu a.is-nu', els => els.map(e => e.textContent.trim()));
    if (aan.includes('Over mij')) goed(`bij #over staat "${aan.join(', ')}" aan`);
    else zeg(`bij #over staat "${aan.join(', ') || 'niets'}" aan, "Over mij" verwacht`);
    await pagina.close();
  }

  // --- 3. de grote fotoweergave -------------------------------------------
  /* Twee keer, want dit werkt op de telefoon anders dan op de desktop en dat is
     bewust: de pijlen staan naast de foto en daar is op een telefoon geen plek
     voor, dus die zijn daar door de css verborgen en veeg je. Een controle die
     op 390 breed op .lb-next klikt faalt op de site zoals hij hoort te zijn -
     dat overkwam deze controle bij het schrijven. Op de telefoon dus met het
     toetsenbord doorbladeren (wat de scroller net zo goed verzet als een veeg),
     en de pijlen op de desktop. */
  console.log('\n3. grote fotoweergave');
  for (const [wat, poort, viaPijl] of [
    ['telefoon 390', { width: 390, height: 844 }, false],
    ['desktop 1440', { width: 1440, height: 900 }, true],
  ]) {
    const pagina = await browser.newPage({ viewport: poort });
    await pagina.goto(`${ADRES}/ro/taarten`, { waitUntil: 'load' });
    await pagina.click('.galerij .tegel');
    await pagina.waitForSelector('#lightbox:not([hidden])', { timeout: 5000 });
    const totaal = await pagina.textContent('#lb-totaal');
    const bij1 = (await pagina.textContent('#lb-caption')).trim();
    if (totaal === '67') goed(`${wat}: 67 fotos in de reeks`);
    else zeg(`${wat}: ${totaal} fotos in de reeks, 67 verwacht`);
    if (bij1.length) goed(`${wat}: bijschrift "${bij1.slice(0, 38)}"`);
    else zeg(`${wat}: geen bijschrift onder de eerste foto`);

    if (viaPijl) {
      if (!await pagina.isVisible('.lb-next')) zeg(`${wat}: de pijl hoort hier zichtbaar te zijn`);
      await pagina.click('.lb-next');
    } else {
      if (await pagina.isVisible('.lb-next')) zeg(`${wat}: de pijl hoort hier verborgen te zijn`);
      else goed(`${wat}: pijlen verborgen, zoals bedoeld`);
      await pagina.keyboard.press('ArrowRight');
    }
    await pagina.waitForTimeout(900);
    const nu = await pagina.textContent('#lb-nu');
    const bij2 = (await pagina.textContent('#lb-caption')).trim();
    if (nu === '2' && bij2 && bij2 !== bij1) goed(`${wat}: doorgebladerd naar ${nu}, bijschrift wisselt mee`);
    else zeg(`${wat}: na doorbladeren teller ${nu}, bijschrift "${bij2}"`);

    await pagina.keyboard.press('Escape');
    await pagina.waitForTimeout(400);
    if (await pagina.getAttribute('#lightbox', 'hidden') !== null) goed(`${wat}: Escape sluit`);
    else zeg(`${wat}: Escape sluit de weergave niet`);
    await pagina.close();
  }

  // --- 4. niets buiten het scherm -----------------------------------------
  console.log('\n4. geen zijwaartse scroll');
  {
    for (const breed of [320, 360, 390, 768, 1024, 1440]) {
      const pagina = await browser.newPage({ viewport: { width: breed, height: 900 } });
      let mis = [];
      for (const pad of ['/', '/ro/taarten', '/en/prijzen', '/voorwaarden']) {
        await pagina.goto(ADRES + pad, { waitUntil: 'load' });
        const over = await pagina.evaluate(() =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (over > 1) mis.push(`${pad} ${over}px`);
      }
      if (mis.length) zeg(`${breed}px: ${mis.join(', ')}`);
      else goed(`${breed}px: vier paginas passen`);
      await pagina.close();
    }
  }

  // --- 5. het formulier ----------------------------------------------------
  console.log('\n5. formulier');
  {
    const pagina = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await pagina.goto(`${ADRES}/ro/cozonac`, { waitUntil: 'load' });

    /* Het lokvink hoort te bestaan (anders ziet een bot het niet) en buiten
       beeld te staan.

       Niet met isVisible(): dat is waar zolang een element een vulling heeft,
       ook als het op x=-9999 staat, en meldde dus een probleem dat er niet was.
       Wat hier telt is of het ding in het venster valt, en of het de pagina
       niet breder maakt dan het scherm - want dat tweede is de manier waarop
       zo'n truc wel eens zichtbaar wordt. */
    const vink = await pagina.$('input[name="website"]');
    if (!vink) zeg('geen lokvink in het formulier');
    else {
      const m = await pagina.evaluate(() => {
        const r = document.querySelector('input[name="website"]').getBoundingClientRect();
        return {
          inBeeld: r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight,
          x: Math.round(r.x),
          over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });
      if (!m.inBeeld && m.over <= 1) goed(`lokvink staat op x=${m.x}, buiten beeld en zonder zijwaartse scroll`);
      else zeg(`lokvink: inBeeld=${m.inBeeld}, x=${m.x}, pagina ${m.over}px te breed`);
    }

    // de verborgen velden
    const taal = await pagina.getAttribute('input[name="__jiw_confirmation_locale"]', 'value');
    const herkomst = await pagina.getAttribute('input[name="herkomst"]', 'value');
    if (taal === 'ro' && herkomst === '/ro/cozonac') goed(`bevestiging in ${taal}, herkomst ${herkomst}`);
    else zeg(`locale=${taal}, herkomst=${herkomst}`);

    if (!VERSTUUR) {
      console.log('       (geen inzending; --verstuur om ook dat te doen)');
    } else {
      await pagina.fill('#naam', 'Browsercontrole');
      await pagina.fill('#mail', 'jouwidealewebsite@gmail.com');
      await pagina.fill('#datum', '2026-12-30');
      await pagina.fill('#smaak', 'Inzending uit tools/keur.mjs, via een echte browser.');
      await pagina.click('button[type="submit"]');
      await pagina.waitForSelector('.form-melding.is-goed', { timeout: 20000 });
      const dank = (await pagina.textContent('.form-melding')).trim();
      const velden = await pagina.$$('.veld');
      if (dank.length > 20 && velden.length === 0) goed(`verstuurd, bedankregel: "${dank.slice(0, 60)}"`);
      else zeg(`na versturen: melding "${dank}", ${velden.length} velden nog in beeld`);
      if (/[ăâîșț]/i.test(dank)) goed('de bedankregel staat in het Roemeens');
      else zeg('de bedankregel staat niet in het Roemeens');
    }
    await pagina.close();
  }
} finally {
  await browser.close();
}

console.log('');
if (klachten.length) {
  console.error(`keur: ${klachten.length} klacht(en) op ${ADRES}`);
  process.exit(1);
}
console.log(`keur: alles goed op ${ADRES}`);
