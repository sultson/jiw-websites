// Zet het talen-hoofdstuk in README.md. Via een bestand en niet via `node -e`:
// backticks in een shell-string worden door bash als commando uitgevoerd, en dan
// verdwijnt elke `code`-span uit de tekst.
import fs from 'node:fs';

const NIEUW = `## Talen (NL, EN, TR, RU)

NL is de bron en staat op de root; Engels, Turks en Russisch staan onder \`/en/ /tr/ /ru/\`.
Bestaande links en de Google-index veranderen dus niet.

| bestand | rol |
| --- | --- |
| \`i18n.mjs\` | UI-teksten per taal (menu, knoppen, koppen, formulier, footer, 404) plus \`LOCALES\`, \`prefix()\`, \`fill()\` |
| \`i18n-tr.mjs\` / \`i18n-ru.mjs\` | de Turkse en Russische UI, apart omdat een blok Turks of cyrillisch midden in \`i18n.mjs\` onleesbaar wordt |
| \`i18n-content.mjs\` | vertaalde **inhoud** (projecten, FAQ, voor/na, werkgebied, reviews) plus de getters |
| \`i18n-content-tr.mjs\` / \`-ru.mjs\` | diezelfde inhoud in het Turks en Russisch |

\`build.mjs\` houdt de actieve taal in twee module-variabelen (\`LOC\`, \`L\`) plus \`PATH\`, het pad
zonder taalprefix voor de wisselaar. \`U(p)\` maakt van elke interne link de versie in de
actieve taal, \`outDir()\` wijst naar \`site/\` of \`site/<taal>/\`. De hele bouw draait vier keer;
media, CSS en JS zijn gedeeld en staan maar een keer op schijf.

**Terugval per veld, niet per project.** \`tProject/tFaq/tBa/tArea/tReview\` pakken de
Nederlandse bron zodra een vertaling ontbreekt. Een nieuw project zonder vertaling levert dus
een Engelse pagina met een Nederlandse alinea op, en niet een lege plek of een build die
omvalt. Dat is precies wat je wilt als er een klus bijkomt.

**Wat bewust niet vertaald is** (afspraak met Armando, 17-08-2026, optie B van de twee die
voorlagen): de bijschriften onder de losse foto's en de fasekoppen op de projectpagina's. Dat
is het leeuwendeel van de tekst en verandert het vaakst; niemand kiest een badkamerbouwer op
een fotobijschrift. Wel vertaald: titel, kicker, tags, blurb en intro per project, en alle
verkooppagina's volledig.

**De wisselaar** (\`langSwitch()\`) staat binnen \`#navLinks\` en daarmee in een keer op beide
plekken: rechts in de balk op desktop, bovenaan het uitklapmenu op mobiel (\`order: -1\`, volle
breedte, knoppen van 81x45). Een tweede exemplaar buiten het menu zou naast de burger en de
app-knop moeten passen, en die ruimte is er op een telefoon niet. Alleen de landcode is
zichtbaar; de hele taalnaam staat er onzichtbaar bij voor schermlezers. Elke knop wijst naar
**dezelfde** pagina in die taal, niet naar de homepage.

Verder in de build: \`lang\` per pagina, \`hreflang\` voor alle vier plus \`x-default\` op de
NL-versie, canonical met prefix, \`og:locale\`, en een sitemap met \`xhtml:link\` per taal (68
adressen). De WhatsApp-voorinvulling staat in de taal van de pagina; de labels van het bericht
dat het formulier opbouwt komen als JSON mee in \`#i18n\`, want app.js kan ze niet uit de HTML
lezen.

\`work/lang-check.mjs\` controleert dit in chromium **en** webkit, desktop en mobiel:
taalattribuut, hreflang, canonical, of de wisselaar met het menu dicht buiten beeld staat en
open wel in beeld, en of doorklikken van elke taal naar elke taal op dezelfde pagina uitkomt.
Tegen de live site: \`BASE=https://m-techno-service.jouwidealewebsite.nl node work/lang-check.mjs\`.
Let op: \`/cdn-cgi/rum\` (de meetpixel van Cloudflare) faalt in webkit op CORS en wordt
weggefilterd, dat is niet onze bug.

De patch die \`build.mjs\` van eentalig naar viertalig bracht staat in \`work/_i18n-patch.mjs\`,
met \`work/_build.bak.mjs\` als versie ervoor. Beide mogen weg zodra dit is bezonken.

`;

const s = fs.readFileSync('README.md', 'utf8');
const a = s.indexOf('## Talen (NL, EN, TR, RU)');
const b = s.indexOf('## Aandachtspunten voor livegang');
if (a < 0 || b < 0 || b < a) throw new Error('kop niet gevonden');
fs.writeFileSync('README.md', s.slice(0, a) + NIEUW + s.slice(b));
console.log('README talen-hoofdstuk hersteld');
