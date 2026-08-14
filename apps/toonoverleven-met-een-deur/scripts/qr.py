"""
Maakt de QR-code voor een eenmalige donatie.

De stichting gebruikt op hun eigen site en op hun flyer een QR-code die naar
hun Rabobank-betaalverzoek wijst. Die code is uit hun eigen beeld uitgelezen
(cv2.QRCodeDetector) en bleek exact dezelfde URL te bevatten als de knop
"Ik steun Toon over Leven en wil vriend worden!" op toonoverleven.nl. Hij wordt
hier opnieuw getekend als vector, zodat hij op elk formaat scherp is en in de
kleuren van het logo staat in plaats van als screenshot op de pagina.

Draaien met: python scripts/qr.py
"""
import segno

DOEL = 'https://betaalverzoek.rabobank.nl/betaalverzoek/?id=9trZQwQDTT6cTUhJJ1-uJA'

qr = segno.make(DOEL, error='h')
qr.save('public/img/qr-donatie.svg', scale=1, border=2, dark='#234739', light=None)
print('geschreven: public/img/qr-donatie.svg')
