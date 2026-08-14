/* Photos of Aemilius, the owners' mini resort in Barber on Curacao. Supplied by the
   client over WhatsApp on 05-08-2026, so the source is the CRM upload folder rather
   than a URL. Same treatment as the other photo sets: max 1600px on the long edge,
   mozjpeg q78, metadata stripped. */
import sharp from 'sharp';
import path from 'node:path';

const SRC = 'C:/Users/nieuw/dev/jiw-crm/uploads';
const OUT = path.resolve('public/img');

const files = [
  // the resort seen from the entrance: two of the three verblijven, palapa, gravel garden
  ['fpj8u0tmudjdofbef93d473e.jpg', 'curacao-terrein.jpg'],
  // the villa from the pool terrace, name plaque "Fenya"
  ['txdtvzt7ijnw6dfaq85c1ie5.jpg', 'curacao-villa.jpg'],
  // pool + covered terrace with the hummingbird mural
  ['pqo2k0vrznprmov61tv80hgc.jpg', 'curacao-zwembad-1.jpg'],
  // the beach-style pool with its gradual entry, turtle mural on the wall
  ['azb1ky45zvk1gdpecf446u0c.jpg', 'curacao-zwembad-2.jpg'],
  // pool at dusk with the loungers along the terrace
  ['ixe4t2wtqimxe8fbtib78l6a.jpg', 'curacao-zwembad-3.jpg'],
  // pool looking out over Barber, prieel/palapa on the right
  ['vr6fnewbe2l19esutubdrtxj.jpg', 'curacao-uitzicht.jpg'],
  // villa living + dining room under the open timber roof
  ['of00a7c8f3mgt7jhhh2hqxi3.jpg', 'curacao-woonkamer.jpg'],
  // m5cahuvqrfnsuuj2ya9ps9ky.jpg (white kitchen with island + bar stools) was in this
  // set but is not an Aemilius room — client flagged it 05-08-2026, so it is not imported.
  // kitchenette in the smaller verblijf
  ['prlkg7lswrxgw341zcu1y18e.jpg', 'curacao-keuken-studio.jpg'],
  // hall of the apartment: own bathroom, bedroom, step-free threshold ramp
  ['n9xc7e1pum2ohd8warbqgnlu.jpg', 'curacao-appartement.jpg'],
  // care bed with lifting pole and a wheelchair standing ready
  ['xa7ivda820hn7ky0vpjxaj9j.jpg', 'curacao-zorgbed.jpg'],
  // the same step-free ramp seen from inside
  ['m8sktlty6dt0y7lu8iwsgkvp.jpg', 'curacao-drempelvrij.jpg'],
];

for (const [src, dest] of files) {
  const info = await sharp(path.join(SRC, src))
    .rotate()
    .resize({width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true})
    .jpeg({quality: 78, mozjpeg: true})
    .toFile(path.join(OUT, dest));
  console.log(`${dest}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
}
