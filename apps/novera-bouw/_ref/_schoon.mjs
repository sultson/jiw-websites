// eenmalig: de airco-beelden uit de lijst halen
import { readFile, writeFile } from 'node:fs/promises'
const p = new URL('./maak-beeld.mjs', import.meta.url)
let s = await readFile(p, 'utf8')
const voor = s.length
for (const n of ['w-airco', 'h-airco', 'd-airco-buiten', 'd-airco-slaap']) {
  const re = new RegExp(`  \\{\\n(?:    //[^\\n]*\\n)*    naam: '${n}',\\n[\\s\\S]*?\\n  \\},\\n`)
  if (!re.test(s)) throw new Error('niet gevonden: ' + n)
  s = s.replace(re, '')
}
await writeFile(p, s)
console.log(voor, '->', s.length)
