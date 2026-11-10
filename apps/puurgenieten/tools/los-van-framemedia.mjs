// Eenmalig (10-11-2026): bouwt de gekopieerde framemedia-bouwer om tot de losse
// Puur Genieten-site. Bewaard zodat na te lezen is wat er tegenover
// jiw-websites/apps/framemedia/bouw.mjs veranderd is.
import { readFileSync, writeFileSync } from 'fs';
let s = readFileSync('bouw.mjs', 'utf8');
const rep = (a, b) => {
  if (!s.includes(a)) throw new Error('niet gevonden: ' + a.slice(0, 80));
  s = s.replace(a, () => b);
};
const blok = re => { const m = re.exec(s); if (!m) throw new Error('blok niet gevonden: ' + re); return m[0]; };

rep(blok(/const FORMULIEREN = \{[\s\S]*?\n\};/), `const FORMULIEREN = {
  puurgenieten: { pad: '/api/forms/puurgenieten', herkomst: 'Puur Genieten (puurgenieten.tv)' },
};`);

// Turnstile eruit: die widget hoort bij framemedia.tv. Het lokvink blijft.
rep(blok(/  const knoppen = html\.match[\s\S]*?formulierenGeraakt\+\+;\n  return html\n    \.replace\([^\n]*\n/),
  `  formulierenGeraakt++;\n  return html\n`);
rep(blok(/const TURNSTILE_SCRIPT = [^\n]*\n/), `const TURNSTILE_SCRIPT = '';\n`);

rep(blok(/const ADRES = PROD\n[^\n]*\n[^\n]*\n/), `// Puur Genieten is op 10-11-2026 losgekoppeld van framemedia.tv (Armando) en
// krijgt een eigen domein. Eerst als voorbeeld op concept.puurgenieten.tv.
const ADRES = PROD
  ? 'https://puurgenieten.tv'
  : 'https://concept.puurgenieten.tv';
`);

rep(blok(/const merk = taal => `[\s\S]*?`;\n\nconst merkGroot = [\s\S]*?`;\n/), `// Het merk is hier het rondje van Puur Genieten zelf. FRAME MEDIA staat als
// producent in de voet: het programma is van hen, maar dit is niet hun site.
const merk = taal => \`<a class="brand brand-pg" href="\${padNaar(taal, 'home')}">
      <img src="/assets/logo-puur-genieten.webp" alt="Puur Genieten" width="240" height="241">
    </a>\`;

const merkGroot = (taal, klasse = 'brand-groot') => \`<a class="\${klasse} brand-pg-groot" href="\${padNaar(taal, 'home')}">
      <img src="/assets/logo-puur-genieten.webp" alt="Puur Genieten" width="240" height="241">
    </a>\`;
`);

// Er zit een echte worker onder (worker.mjs, D1), dus geen leeg formulier.
rep("+ (PROD ? '' : 'window.FM_LEEG=1;') + `</script>`", "+ `</script>`");
// En dus ook nergens een conceptregel na het versturen.
rep("function echteDankregels(html) {\n  if (!PROD) return html;", "function echteDankregels(html) {");

// Het menu wijst naar de blokken op de pagina: er is maar een pagina per taal.
rep(blok(/function header\(taal, sleutel\) \{\n  const links = [\s\S]*?\.join\('\\n'\);/), `function header(taal, sleutel) {
  const links = taal.nav.map(([anker, tekst]) => \`      <a href="#\${anker}">\${tekst}</a>\`).join('\\n');`);
rep("<a class=\"btn btn-primair\" href=\"${padNaar(taal, 'contact')}\">${taal.navKnop}</a>\n    </nav>",
  "<a class=\"btn btn-primair\" href=\"#aanmelden\">${taal.navKnop}</a>\n    </nav>");
rep(blok(/  \$\{sleutel === 'contact'[\s\S]*?\}\n<\/nav>/), "  <a class=\"btn btn-primair\" href=\"#aanmelden\">${taal.navKnop}</a>\n</nav>");

rep(blok(/function voet\(taal, sleutel\) \{[\s\S]*?\n\}\n\n\/\/ Een pagina in inhoud/), `function voet(taal, sleutel) {
  const v = taal.voet;
  const fm = taal.code === 'nl' ? 'https://www.framemedia.tv/' : \`https://www.framemedia.tv/\${taal.code}/\`;
  const anker = taal.nav.map(([a, t]) => \`          <li><a href="#\${a}">\${t}</a></li>\`).join('\\n');
  return \`
</main>
\${mobieleCta(taal, sleutel)}
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        \${merkGroot(taal)}
        <p>\${v.zin}</p>
      </div>
      <div>
        <p class="foot-h">Puur Genieten</p>
        <ul class="foot-lijst">
\${anker}
        </ul>
      </div>
      <div>
        <p class="foot-h">\${v.producent}</p>
        <ul class="foot-lijst">
          <li><a href="\${fm}">FRAME MEDIA</a></li>
          <li>John Blankensteinstraat 23 A</li>
          <li>1095 MB Amsterdam</li>
        </ul>
      </div>
      <div>
        <p class="foot-h">\${v.contact}</p>
        <ul class="foot-lijst">
          <li><a href="mailto:\${MAIL}">\${MAIL}</a></li>
          <li><a href="tel:\${MOBIEL}">\${MOBIEL_TEKST}</a></li>
          <li><a href="\${wa_link(taal)}" target="_blank" rel="noopener">WhatsApp</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-onder">
      <span>&copy; 2026 Puur Genieten &middot; FRAME MEDIA</span>
      <span><a href="https://www.framemedia.tv/voorwaarden">\${v.voorwaarden}</a>\${taal.code === 'nl' ? '' : ' <span class="voet-taal">(NL)</span>'}</span>
    </div>
  </div>
</footer>
<script src="\${versie('site.js')}" defer></script>
</body>
</html>
\`;
}

// Een pagina in inhoud/`);

rep(blok(/const PAGINAS = \{[\s\S]*?\n\};/), `const PAGINAS = {
  nl: [['puurgenieten', 'puurgenieten.html']],
  en: [['puurgenieten', 'en/puur-genieten.html']],
  de: [['puurgenieten', 'de/puur-genieten.html']],
};`);

rep(blok(/const REDIRECTS = `[\s\S]*?`;\nwriteFileSync\('dist\/_redirects', REDIRECTS\);/),
  `// framemedia.tv/puurgenieten/ is het oude adres. Dat omleiden gebeurt op
// framemedia.tv zelf, zodra dit domein live staat - niet hier.`);
rep("if (existsSync('oud')) {", "if (false) {");
rep("const niet = /conceptversie|concept version|Konzeptversion|jouwconcept\\.app|noindex/i;",
  "const niet = /conceptversie|concept version|Konzeptversion|jouwconcept\\.app|concept\\.puurgenieten|noindex/i;");
rep(blok(/if \(PROD\) \{\n  console\.log\('\\nLET OP[\s\S]*?\n\}\n/), '');

rep(blok(/  nl: 'Hallo FRAME MEDIA[^\n]*\n  en: [^\n]*\n  de: [^\n]*\n/), `  nl: 'Hallo, ik wil meer informatie over Puur Genieten.',
  en: 'Hello, I would like more information about Puur Genieten.',
  de: 'Hallo, ich möchte mehr Informationen über Puur Genieten.',
`);

writeFileSync('bouw.mjs', s);
console.log('bouw.mjs omgebouwd');
