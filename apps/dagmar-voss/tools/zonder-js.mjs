/* De tegenproef op tools/prerender.mjs: een echte browser met javascript UIT,
   naast dezelfde pagina met javascript AAN.

   prerender.mjs leest het bestand en kan dus niet zien of de CSS iets
   wegstopt tot javascript een klasse zet - dat is precies de val die de root
   CLAUDE.md beschrijft ("Never gate content visibility on JS"), en op een
   middenklasse Android is dat geen theorie maar een gat in de pagina. Dit
   script kijkt met de ogen van de browser: wat is er te lezen, en hoe hoog is
   de pagina, met en zonder.

   Niet in `pnpm build`: dit heeft chromium nodig en een bouwstap hoort niet op
   een browser te wachten. Draai hem als je aan de opmaak of aan het script in
   build.mjs hebt gezeten.

   Run: pnpm --filter @jiw/dagmar-voss zonder-js */

import { chromium } from "playwright";
import { serveDist, PAGINAS } from "./serve.mjs";

const lees = async (browser, url, metJs) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    javaScriptEnabled: metJs,
    /* Een crawler komt zo binnen. Zonder javascript en met deze naam is dit
       zo dicht bij een echte Googlebot-ophaal als het hier kan. */
    userAgent: metJs
      ? undefined
      : "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: metJs ? "networkidle" : "load" });
  const uit = await page.evaluate(() => {
    /* innerText geeft alleen wat zichtbaar is: iets met display:none,
       visibility:hidden of hoogte 0 valt er zelf uit. Dat is het hele punt. */
    const tekst = document.body.innerText.replace(/\s+/g, " ").trim();
    return {
      woorden: tekst.split(" ").filter(Boolean).length,
      tekens: tekst.length,
      hoogte: document.documentElement.scrollHeight,
      h1: (document.querySelector("h1")?.innerText || "").trim(),
      links: document.querySelectorAll("a[href]").length,
      /* Hoeveel tekst staat er in iets dat nu doorzichtig of onzichtbaar is?
         Zonder javascript moet dat nul zijn op alles wat inhoud is. */
      weggestopt: [...document.querySelectorAll("main *")]
        .filter((el) => {
          const cs = getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05) {
            const eigen = [...el.childNodes]
              .filter((n) => n.nodeType === 3)
              .map((n) => n.textContent.trim())
              .join("");
            return eigen.length > 20;
          }
          return false;
        })
        .map((el) => (el.className || el.tagName) + ": " + el.textContent.trim().slice(0, 50)),
    };
  });
  await ctx.close();
  return uit;
};

const { url, stop } = await serveDist();
const browser = await chromium.launch();
let fouten = 0;

console.log("pagina".padEnd(16) + "zonder js".padEnd(12) + "met js".padEnd(10) + "hoogte z/m");
for (const slug of PAGINAS) {
  const zonder = await lees(browser, url + slug, false);
  const met = await lees(browser, url + slug, true);

  /* De grens is bewust ruim: met javascript aan komt er wat bij dat er zonder
     terecht niet is (de open/sluit-tekst van het menu bijvoorbeeld). Verdwijnt
     er een alinea, dan is dat tientallen procenten en niet een paar. */
  const deel = zonder.woorden / Math.max(met.woorden, 1);
  const hoogteDeel = zonder.hoogte / Math.max(met.hoogte, 1);
  const ok = deel >= 0.95 && hoogteDeel >= 0.9 && !zonder.weggestopt.length && zonder.h1 === met.h1;
  if (!ok) fouten++;

  console.log(
    slug.padEnd(16) +
      String(zonder.woorden).padEnd(12) +
      String(met.woorden).padEnd(10) +
      zonder.hoogte +
      "/" +
      met.hoogte +
      "  " +
      (ok ? "ok" : "LET OP") +
      (zonder.h1 === met.h1 ? "" : "  h1 wijkt af: " + JSON.stringify([zonder.h1, met.h1]))
  );
  for (const w of zonder.weggestopt) console.log("    weggestopt zonder js: " + w);
}

await browser.close();
await stop();

if (fouten) {
  console.error("\n" + fouten + " pagina(s) leveren zonder javascript minder dan met.");
  process.exit(1);
}
console.log("\nAlle " + PAGINAS.length + " paginas lezen zonder javascript even volledig als met.");
