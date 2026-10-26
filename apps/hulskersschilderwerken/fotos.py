#!/usr/bin/env python
"""Zet de aangeleverde foto's om naar webp voor de site.

De originelen staan BUITEN de projectmap (.aangeleverd-hulskers/fotos), want
`[assets] directory` uploadt alles wat in de projectmap ligt. Zie de regel
"Aangeleverd bronmateriaal hoort buiten de projectmap" in playground/CLAUDE.md.

De uitsnede per foto staat hieronder in UITSNEDES en niet in je hoofd: zo hoef je
hem niet opnieuw te kiezen en ziet de volgende die dit draait wat er gekozen is.

  verhouding = breedte/hoogte van het eindbeeld
  focus      = waar het midden van de uitsnede ligt, 0 = boven/links, 1 = onder/rechts

Let op: WhatsApp heeft deze foto's al teruggeschaald naar ~1178 px breed. Er wordt
hier dus NIET opgeschaald; een foto die smaller uitkomt dan de gevraagde maat
blijft op zijn eigen maat. Scherpere originelen zijn de enige echte oplossing.
"""
import json
import os
import sys
from PIL import Image, ImageOps

BRON = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.aangeleverd-hulskers', 'fotos')
DOEL = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'public', 'f')

# naam -> (verhouding, focus_x, focus_y, [breedtes])
# Staat de naam ook in WANDVLEK, dan bemonstert dit script daar de wandkleur en zet
# hem in het manifest. De stip op de kleurkaart is dan de kleur van die wand en geen
# gokje uit de css, en hij verandert mee als de uitsnede verandert.
BREED = [1600, 1000, 640]
KAART = [900, 600]
WANDVLEK = {
    'overloop-taupe': (0.63, 0.17),
    'hal-grijs-trap': (0.32, 0.52),
    'woonkeuken-staand': (0.42, 0.22),
}
# Een vijfde waarde is het bronbestand, als dat anders heet dan de sleutel. Zo kan
# dezelfde foto twee uitsnedes krijgen (de woonkeuken staat liggend in de hero en
# staand op de kleurkaart).
UITSNEDES = {
    # Hero: brede plaat van de woonkeuken. Focus iets boven het midden, anders
    # valt de groene wand half buiten beeld.
    'woonkeuken-groen':      (16 / 9, 0.50, 0.42, BREED),
    # Hier stond 'werkwijze-kop', een eigen onderuitsnede van de rolsteigerfoto voor
    # de kop van /werkwijze/. Die kop gebruikt sinds 20-10-2026 gewoon
    # 'woonkeuken-groen' hierboven, dus er is geen tweede uitsnede meer nodig.
    # Pascal zelf. Hij staat rechts in beeld, dus focus naar rechts.
    'pascal-portret':        (4 / 3, 0.60, 0.45, [1200, 800]),
    # Kleurkaarten, staand 3:4. De slaapkamerfoto zat hier eerst bij, maar die is te
    # donker belicht om een kleur te laten zien: elk monster kwam onder #52 uit.
    'overloop-taupe':        (3 / 4, 0.55, 0.45, KAART),
    'hal-grijs-trap':        (3 / 4, 0.40, 0.50, KAART),
    'woonkeuken-staand':     (3 / 4, 0.42, 0.50, KAART, 'woonkeuken-groen'),
    # Projecttegels, liggend 4:3.
    'nieuwbouw-houten-trap': (4 / 3, 0.55, 0.45, KAART),
    'nieuwbouw-rolsteiger':  (4 / 3, 0.50, 0.45, KAART),
    'fotobehang-bos':        (4 / 3, 0.58, 0.50, KAART),
    'stalen-deuren-wit':     (4 / 3, 0.55, 0.45, KAART),
    'buiten-gevel-riet':     (4 / 3, 0.50, 0.55, KAART),
    'buiten-voordeur':       (4 / 3, 0.48, 0.50, KAART),
}


def snij(im, verhouding, fx, fy):
    b, h = im.size
    if b / h > verhouding:          # te breed: links/rechts eraf
        nb, nh = int(round(h * verhouding)), h
    else:                            # te hoog: boven/onder eraf
        nb, nh = b, int(round(b / verhouding))
    x = max(0, min(b - nb, int(round(fx * b - nb / 2))))
    y = max(0, min(h - nh, int(round(fy * h - nh / 2))))
    return im.crop((x, y, x + nb, y + nh))


def wandkleur(im, fx, fy):
    """Mediaan van een vlek, zodat een stopcontact of een lichtval hem niet wegtrekt."""
    x, y = int(fx * im.width), int(fy * im.height)
    straal = max(8, im.width // 18)
    vlek = im.crop((max(0, x - straal), max(0, y - straal),
                    min(im.width, x + straal), min(im.height, y + straal)))
    kanalen = []
    for k in range(3):
        waarden = sorted(p[k] for p in vlek.convert('RGB').getdata())
        kanalen.append(waarden[len(waarden) // 2])
    return '#%02X%02X%02X' % tuple(kanalen)


def main():
    if not os.path.isdir(BRON):
        sys.exit('fotos.py: bronmap %s bestaat niet' % BRON)
    os.makedirs(DOEL, exist_ok=True)
    gemist = []
    # build.mjs leest dit om srcset en width/height te zetten. Een manifest is nodig
    # omdat niet elke foto elke breedte haalt: WhatsApp heeft ze al teruggeschaald en
    # er wordt hier niet opgeschaald.
    manifest = {}
    for naam, waarden in UITSNEDES.items():
        verhouding, fx, fy, breedtes = waarden[:4]
        pad = os.path.join(BRON, (waarden[4] if len(waarden) > 4 else naam) + '.jpg')
        if not os.path.exists(pad):
            gemist.append(naam)
            continue
        im = ImageOps.exif_transpose(Image.open(pad)).convert('RGB')
        uit = snij(im, verhouding, fx, fy)
        for breedte in breedtes:
            if breedte > uit.width:
                # Niet opschalen. De kleinste gevraagde maat moet er wel komen,
                # anders mist de pagina een bestand; die krijgt de eigen maat.
                if breedte != min(breedtes):
                    continue
                schaal = uit.copy()
            else:
                schaal = uit.resize((breedte, int(round(breedte / verhouding))), Image.LANCZOS)
            doel = os.path.join(DOEL, '%s-%d.webp' % (naam, breedte))
            schaal.save(doel, 'WEBP', quality=82, method=6)
            manifest.setdefault(naam, []).append({
                'bestand': 'f/%s-%d.webp' % (naam, breedte),
                'w': schaal.width,
                'h': schaal.height,
            })
            print('%-26s %4dx%-4d  %6.0f kB' % (
                os.path.basename(doel), schaal.width, schaal.height,
                os.path.getsize(doel) / 1024))
    if gemist:
        sys.exit('fotos.py: deze foto\'s ontbreken in %s: %s' % (BRON, ', '.join(gemist)))
    for naam in manifest:
        manifest[naam].sort(key=lambda x: x['w'])
    stippen = {}
    for naam, (fx, fy) in WANDVLEK.items():
        if naam not in manifest:
            sys.exit('fotos.py: WANDVLEK noemt %s, maar die foto is niet gemaakt' % naam)
        grootste = manifest[naam][-1]['bestand']
        stippen[naam] = wandkleur(Image.open(os.path.join(DOEL, os.path.basename(grootste))), fx, fy)
        print('wandkleur %-18s %s' % (naam, stippen[naam]))
    manifest['_wandkleur'] = stippen
    with open(os.path.join(DOEL, 'manifest.json'), 'w', encoding='utf-8') as fh:
        json.dump(manifest, fh, indent=1, ensure_ascii=False)
    print('manifest.json: %d foto\'s' % len(manifest))


if __name__ == '__main__':
    main()
