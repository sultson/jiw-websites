# -*- coding: utf-8 -*-
"""
Poetst het nageschreven woordmerk uit de tekening van Pascal.

Waarom niet opnieuw laten tekenen: een model bewerkt niet, het tekent de plaat
opnieuw, en dan verandert zijn gezicht mee (gemeten 02-11-2026: twee rondes gaven
allebei een andere man). Dit raakt alleen de pixels van het merk zelf; de rest van
het bestand blijft wat het was.

Per vak wordt alles gemaskerd wat van de vlakke ondergrond afwijkt (letters plus
kwastje), opgerekt en ingevuld met de omliggende emmer- of polokleur
(cv2.inpaint, TELEA). De vakken staan krap om de echte verfspatten en -druipers
buiten te houden.

    python poets-woordmerk.py     schrijft fotos/pascal-tekening-schoon.jpg

Daarna fotos.py draaien; die leest de schone plaat. Het origineel blijft liggen,
dus terugdraaien is de bestandsnaam in fotos.py weghalen.
"""
import os
import sys

import cv2
import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
BRON = os.path.join(HIER, 'fotos', 'pascal-tekening.jpg')
UIT = os.path.join(HIER, 'fotos', 'pascal-tekening-schoon.jpg')

# (links, boven, rechts, onder) rond elk logo. Krap gehouden: de blauwe druipers
# naast de grote emmer en op de kleine emmer horen bij de tekening en blijven.
VAKKEN = {
    'polo':         (745, 392, 915, 492),
    'emmer-groot':  (56, 903, 318, 1012),
    'kwast-groot':  (276, 874, 334, 912),   # de steel van het kwastje stak boven het vak uit
    'emmer-klein':  (270, 714, 388, 772),
    'emmer-midden': (724, 962, 892, 1038),
    'emmer-rechts': (1248, 1020, 1418, 1074),
}

# Hoeveel blauw er na het poetsen in een vak mag blijven staan, met de reden erbij.
# Zonder reden is de grens 0,4 procent, en dat is in de praktijk nul. Een
# uitzondering zakt zelf zodra hij niets meer raakt, anders dekt hij over een maand
# een letterstaart toe.
BLAUW_MAG = {
    'emmer-rechts': (0.012, 'verfdruiper in de rechterbovenhoek, die hoort bij de tekening'),
}


def merkmasker(vak):
    """Alles wat van de ondergrond afwijkt, niet alleen het verzadigde blauw.

    Op de kleur keuren liet de schuine letters als grijze schim staan: hun randen
    zijn halfdoorzichtig navy en haalden de blauwdrempel niet. De ondergrond zelf
    (emmerwand, polo) is vlak, dus een forse mediaan is een goede schatting
    daarvan, en alles wat daar duidelijk van afwijkt is letter of kwastje.
    """
    grond = cv2.medianBlur(vak, 51)
    grijs = cv2.cvtColor(vak, cv2.COLOR_BGR2GRAY).astype(np.int16)
    grondgrijs = cv2.cvtColor(grond, cv2.COLOR_BGR2GRAY).astype(np.int16)
    donkerder = grondgrijs - grijs            # letters zijn donkerder dan de wand
    b, g, r = cv2.split(vak.astype(np.int16))
    masker = ((donkerder > 26) | (b - r > 30)).astype(np.uint8) * 255
    # Losse gaten binnen een letter dichttrekken, anders blijft er een kern staan.
    return cv2.morphologyEx(masker, cv2.MORPH_CLOSE,
                            cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))


def main():
    plaat = cv2.imread(BRON)
    if plaat is None:
        sys.exit('poets.py: %s niet gelezen' % BRON)
    h, w = plaat.shape[:2]

    heel = np.zeros((h, w), np.uint8)
    for naam, (x1, y1, x2, y2) in VAKKEN.items():
        if not (0 <= x1 < x2 <= w and 0 <= y1 < y2 <= h):
            sys.exit('poets.py: vak %s valt buiten de plaat %dx%d' % (naam, w, h))
        m = merkmasker(plaat[y1:y2, x1:x2])
        dekking = float((m > 0).mean())
        if not 0.04 < dekking < 0.75:
            sys.exit('poets.py: vak %s dekt %.2f van zijn vlak - vak of sleutel klopt niet'
                     % (naam, dekking))
        heel[y1:y2, x1:x2] = m
        print('%-13s %5.1f%% gemaskerd' % (naam, dekking * 100))

    heel = cv2.dilate(heel, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)), iterations=1)
    schoon = cv2.inpaint(plaat, heel, 9, cv2.INPAINT_TELEA)

    # Buiten de vakken mag geen pixel veranderd zijn.
    buiten = np.ones((h, w), bool)
    for x1, y1, x2, y2 in VAKKEN.values():
        buiten[max(0, y1 - 6):y2 + 6, max(0, x1 - 6):x2 + 6] = False
    if (plaat[buiten] != schoon[buiten]).any():
        sys.exit('poets.py: er is buiten de vakken iets veranderd')

    # En er mag in geen enkel vak nog merkblauw staan. Dit is de eigenlijke eis:
    # een vak dat net te krap staat laat een letterstaart of een kwaststeel liggen,
    # en dat is precies wat er op de pagina niet mag staan.
    for naam, (x1, y1, x2, y2) in VAKKEN.items():
        b, g, r = cv2.split(schoon[y1:y2, x1:x2].astype(np.int16))
        rest = float((((b - r) > 30) & (r < 170)).mean())
        grens, reden = BLAUW_MAG.get(naam, (0.004, None))
        if rest > grens:
            sys.exit('poets-woordmerk.py: in %s staat nog %.1f%% merkblauw - vak te krap'
                     % (naam, rest * 100))
        if reden and rest <= 0.004:
            sys.exit('poets-woordmerk.py: de uitzondering voor %s (%s) raakt niets meer - weghalen'
                     % (naam, reden))

    cv2.imwrite(UIT, schoon, [cv2.IMWRITE_JPEG_QUALITY, 95])
    print('geschreven:', UIT)


if __name__ == '__main__':
    main()
