# Woordmerk uit het oude Puur Genieten-logo (Armando 10-11-2026: "oude logo mag
# blijven", maar het rondje linksboven was op 52 px niet scherp).
# De letters zijn creme op een oranje verloop. Creme heeft een hoog blauwkanaal,
# het oranje en geel nergens boven ~70, dus het blauwkanaal is het masker.
# Bron: jiw-websites/apps/framemedia/inhoud/assets/download/puur-genieten-logo-2048.png
# Gebruik: python -I tools/maak-woordmerk.py
from PIL import Image
import numpy as np, os

BRON = os.path.expanduser('~/dev/jiw-websites/apps/framemedia/inhoud/assets/download/puur-genieten-logo-2048.png')
UIT = os.path.join(os.path.dirname(__file__), '..', 'inhoud', 'assets', 'woordmerk-puur-genieten.png')

im = np.asarray(Image.open(BRON).convert('RGBA')).astype(float)
b = im[..., 2]
a = np.clip((b - 70) / (225 - 70), 0, 1) * (im[..., 3] / 255)
ys, xs = np.where(a > 0.05)
y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
uit = np.zeros((y1 - y0, x1 - x0, 4), dtype=np.uint8)
uit[..., 0], uit[..., 1], uit[..., 2] = 255, 253, 240
uit[..., 3] = (a[y0:y1, x0:x1] * 255).round()
img = Image.fromarray(uit, 'RGBA')
H = 192   # 3x de 64 px in de kopbalk
img = img.resize((round(img.width * H / img.height), H), Image.LANCZOS)
img.save(UIT, optimize=True)
print('bbox', x0, y0, x1, y1, '->', img.size, UIT)
