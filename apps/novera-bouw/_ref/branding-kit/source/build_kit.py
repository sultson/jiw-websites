from pathlib import Path
import sys, json, shutil, math
sys.path.insert(0,str(Path(__file__).parent/'deps'))
from fontTools.ttLib import TTFont as FTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPDF
from pypdf import PdfReader
import io
ROOT=Path(__file__).resolve().parent.parent if Path(__file__).parent.name=='source' else Path(__file__).resolve().parent.parent/'branding-kit'
for n in ['logos/svg','logos/png','print','guidelines','reference','web','source']:(ROOT/n).mkdir(parents=True,exist_ok=True)
C={'navy':'#182339','copper':'#C47A43','chalk':'#F7F3EC','warm-gray':'#B6B0A7','slate':'#56616D'}
# Static instances are reusable desktop fonts; originals and licenses remain bundled.
for family,src,axes in [('Jakarta','PlusJakartaSans',{}),('Inter','Inter',{'opsz':14})]:
 for weight,label in ([(500,'Medium'),(700,'Bold'),(800,'ExtraBold')] if family=='Jakarta' else [(400,'Regular'),(500,'Medium'),(600,'SemiBold')]):
  f=FTFont(ROOT/'fonts'/f'{src}-Variable.ttf'); f=instantiateVariableFont(f,dict(axes,wght=weight),inplace=True)
  dest=ROOT/'fonts'/f'{src}-{label}.ttf'
  for nid,value in [(1,src),(2,label),(4,src+' '+label),(6,src+'-'+label),(16,src),(17,label)]:
   f['name'].setName(value,nid,3,1,0x409)
  f.save(dest)
  pdfmetrics.registerFont(TTFont(f'{family}-{label}',str(dest)))

def letters(text,fontfile,height,width=None,tracking=0):
 f=FTFont(fontfile);gs=f.getGlyphSet(); cmap=f.getBestCmap(); x=0; allpaths=[]; mins=[];maxs=[]
 for ch in text:
  g=gs[cmap[ord(ch)]];pen=SVGPathPen(gs);g.draw(pen);bp=BoundsPen(gs);g.draw(bp)
  if bp.bounds: mins.append(bp.bounds[1]);maxs.append(bp.bounds[3])
  allpaths.append(f'<path transform="translate({x} 0)" d="{pen.getCommands()}"/>');x+=g.width+tracking
 low=min(mins); high=max(maxs); sy=height/(high-low);sx=width/(x-tracking) if width else sy
 return f'<g transform="translate(0 {high*sy}) scale({sx} {-sy})">'+''.join(allpaths)+'</g>'
word=letters('NOVERA',ROOT/'fonts/PlusJakartaSans-ExtraBold.ttf',128,800)
bouw=letters('BOUW',ROOT/'fonts/Inter-Regular.ttf',50,386,tracking=600)
house='M 84,2 Q 90,-2 96,2 L 177,63 Q 180,65 180,69 L 180,74 Q 180,78 176,78 L 168,78 Q 164,78 164,82 L 164,154 Q 164,160 158,160 L 119,160 Q 116,160 116,157 L 116,98 Q 116,95 113,95 L 67,95 Q 64,95 64,98 L 64,157 Q 64,160 61,160 L 22,160 Q 16,160 16,154 L 16,82 Q 16,78 12,78 L 4,78 Q 0,78 0,74 L 0,69 Q 0,65 3,63 Z'

def symbol(x,y,s,color):return f'<path fill="{color}" transform="translate({x} {y}) scale({s})" d="{house}"/>'
def svg_logo(layout='stacked',variant='primary',bg=None):
 mark,txt,sub=(C['copper'],C['navy'],C['slate']) if variant=='primary' else ((C['copper'],C['chalk'],C['chalk']) if variant=='reverse' else ((C['chalk'],)*3 if variant=='white' else (C['navy'],)*3))
 if layout=='stacked':
  w,h=1000,750
  body=symbol(310,50,380/180,mark)+f'<g fill="{txt}" transform="translate(100 445)">{word}</g><g fill="{sub}" transform="translate(307 616)">{bouw}</g><path d="M100 643H254 M746 643H900" stroke="{sub}" stroke-width="3"/>'
 elif layout=='horizontal':
  w,h=1400,380
  body=symbol(40,55,270/180,mark)+f'<g fill="{txt}" transform="translate(420 80)">{word}</g><g fill="{sub}" transform="translate(627 253)">{bouw}</g><path d="M420 280H574 M1066 280H1220" stroke="{sub}" stroke-width="3"/>'
 else:
  w,h=240,220;body=symbol(30,30,1,mark)
 return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img"><title>Novera Bouw — {layout} {variant}</title>'+ (f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else '')+body+'</svg>'
for layout in ['stacked','horizontal','symbol']:
 for var in ['primary','navy','white','reverse']:
  (ROOT/'logos/svg'/f'novera-{layout}-{var}.svg').write_text(svg_logo(layout,var))
 for bg,var in [('chalk','primary'),('white','primary'),('navy','reverse')]:
  color='#FFFFFF' if bg=='white' else C[bg]
  (ROOT/'logos/svg'/f'novera-{layout}-on-{bg}.svg').write_text(svg_logo(layout,var,color))

# machine-readable and web-ready color definitions
palette=[]
for name,hx in C.items():
 r,g,b=[int(hx[i:i+2],16) for i in (1,3,5)];rr,gg,bb=[v/255 for v in (r,g,b)];k=1-max(rr,gg,bb)
 cmyk=[round(100*(1-v-k)/(1-k)) for v in (rr,gg,bb)]+[round(k*100)]
 palette.append(dict(name=name,hex=hx,rgb=[r,g,b],cmyk_approx=cmyk))
(ROOT/'guidelines/palette.json').write_text(json.dumps({'colors':palette,'cmyk_note':'Approximate mathematical conversion, not an ICC-managed print specification.'},indent=2))
(ROOT/'guidelines/novera-palette.gpl').write_text('GIMP Palette\nName: Novera Bouw\nColumns: 5\n#\n'+''.join(f"{p['rgb'][0]:3} {p['rgb'][1]:3} {p['rgb'][2]:3} {p['name']}\n" for p in palette))
(ROOT/'web/brand.css').write_text('''@font-face {font-family:"Plus Jakarta Sans";src:url("../fonts/PlusJakartaSans-Variable.ttf") format("truetype");font-weight:200 800;font-style:normal;font-display:swap;}
@font-face {font-family:Inter;src:url("../fonts/Inter-Variable.ttf") format("truetype");font-weight:100 900;font-style:normal;font-display:swap;}
:root {\n'''+''.join(f'  --novera-{n}: {v};\n' for n,v in C.items())+'''  --font-heading: "Plus Jakarta Sans",sans-serif;
  --font-body: Inter,sans-serif;
}
''')
if (ROOT.parent/'thuis-zeker-vakwerk-navy-copper.png').exists(): shutil.copy2(ROOT.parent/'thuis-zeker-vakwerk-navy-copper.png',ROOT/'reference/approved-branding-sheet.png')
W,H=A4

def text(c,x,y,s,size=10,font='Inter-Regular',color='navy'):
 c.setFillColor(HexColor(C.get(color,color)));c.setFont(font,size);c.drawString(x,y,s)
def line(c,x1,y1,x2,y2,color='warm-gray',width=.5):
 c.setStrokeColor(HexColor(C[color]));c.setLineWidth(width);c.line(x1,y1,x2,y2)
def rect(c,x,y,w,h,color):c.setFillColor(HexColor(C.get(color,color)));c.rect(x,y,w,h,fill=1,stroke=0)
def logo(c,x,y,w,layout='horizontal',variant='primary'):
 d=svg2rlg(io.BytesIO(svg_logo(layout,variant).encode()));scale=w/d.width;d.scale(scale,scale);renderPDF.draw(d,c,x,y)
def footer(c,page=None):
 line(c,42,51,W-42,51)
 text(c,42,35,'NOVERA BOUW',7,'Inter-SemiBold');text(c,145,35,'Goed gebouwd. Fijn wonen.',7,color='slate')
 if page:text(c,W-65,35,f'{page:02d}',7,color='slate')
def header(c,title,subtitle=''):
 logo(c,35,H-112,202);text(c,42,H-151,title,25,'Jakarta-Bold')
 if subtitle:text(c,42,H-174,subtitle,9,color='slate')
 line(c,42,H-190,W-42,H-190,'copper',1.5)
def label(c,x,y,s):text(c,x,y,s.upper(),7,'Inter-SemiBold','slate')
def field(c,name,x,y,w,h=21,multi=False):
 c.acroForm.textfield(name=name,tooltip=name.replace('_',' '),x=x,y=y,width=w,height=h,borderWidth=.5,borderColor=HexColor(C['warm-gray']),fillColor=white,textColor=HexColor(C['navy']),fontName='Helvetica',fontSize=10,forceBorder=True,fieldFlags='multiline' if multi else '')
def labeled(c,name,labeltxt,x,y,w,h=21,multi=False):label(c,x,y+h+7,labeltxt);field(c,name,x,y,w,h,multi)

# A4 letterhead, non-bleed office print.
c=canvas.Canvas(str(ROOT/'print/01-briefpapier-A4.pdf'),pagesize=A4);c.setTitle('Novera Bouw | Briefpapier A4')
logo(c,35,H-125,235);line(c,42,H-145,W-42,H-145,'copper',1.5)
footer(c);c.showPage();c.save()
# Fillable quotation; blank values and no assumed legal terms or tax rates.
c=canvas.Canvas(str(ROOT/'print/02-offerte-A4-invulbaar.pdf'),pagesize=A4);c.setTitle('Novera Bouw | Offerte')
header(c,'Offerte','Vul de projectgegevens, werkzaamheden en afgesproken bedragen in.')
labeled(c,'offertenummer','Offertenummer',42,596,155);labeled(c,'datum','Datum',213,596,155);labeled(c,'geldig_tot','Geldig tot',384,596,169)
labeled(c,'opdrachtgever','Opdrachtgever',42,545,240);labeled(c,'contact','E-mail / telefoon',304,545,249)
labeled(c,'projectadres','Projectadres',42,494,511)
label(c,42,472,'Werkzaamheden');label(c,410,472,'Aantal');label(c,478,472,'Bedrag EUR')
for i in range(5):
 y=442-i*30;field(c,f'regel_{i+1}_omschrijving',42,y,350,25);field(c,f'regel_{i+1}_aantal',402,y,55,25);field(c,f'regel_{i+1}_bedrag',467,y,86,25)
labeled(c,'planning','Planning / inbegrepen werkzaamheden',42,218,310,70,True)
for name,lab,y in [('subtotaal','Subtotaal excl. btw',276),('btw','Btw (tarief / bedrag)',242),('totaal','Totaal incl. btw',208)]:
 text(c,370,y+7,lab,8,'Inter-Medium');field(c,name,478,y,75,24)
labeled(c,'afspraken','Afspraken / uitsluitingen / betalingsafspraak',42,115,511,60,True)
text(c,42,92,'Bedragen en btw handmatig controleren. Deze offerte bevat geen standaardvoorwaarden.',7,color='slate')
footer(c);c.showPage();c.save()
# Fillable site survey / project intake.
c=canvas.Canvas(str(ROOT/'print/03-projectopname-A4-invulbaar.pdf'),pagesize=A4);c.setTitle('Novera Bouw | Projectopname')
header(c,'Projectopname','Klantwensen, maatvoering en afspraken op één overzicht.')
labeled(c,'project','Project / referentie',42,596,330);labeled(c,'opnamedatum','Opnamedatum',392,596,161)
labeled(c,'klant','Naam opdrachtgever',42,545,240);labeled(c,'telefoon_email','Telefoon / e-mail',304,545,249)
labeled(c,'adres','Projectadres',42,494,511)
label(c,42,476,'Soort werk')
for i,(name,lab) in enumerate([('badkamer','Badkamer'),('toilet','Toilet'),('tegels','Tegels'),('vloeren','Vloeren'),('afwerking','Afwerking')]):
 x=42+i*103;c.acroForm.checkbox(name=name,tooltip=lab,x=x,y=451,size=12,borderWidth=.6,borderColor=HexColor(C['slate']),fillColor=white,textColor=HexColor(C['navy']),buttonStyle='check',checked=False);text(c,x+18,453,lab,8)
labeled(c,'wensen','Wensen / huidige situatie',42,347,511,77,True)
labeled(c,'maatvoering','Maatvoering / technische aandachtspunten',42,245,511,77,True)
labeled(c,'materialen','Materialen / afwerking',42,165,511,54,True)
labeled(c,'vervolg','Vervolgafspraak / actiehouder',42,91,511,47,True)
footer(c);c.showPage();c.save()

# Three-page brand guide.
c=canvas.Canvas(str(ROOT/'guidelines/Novera-merkhandboek.pdf'),pagesize=A4);c.setTitle('Novera Bouw | Merkhandboek')
rect(c,0,0,W,H,'chalk');label(c,42,H-48,'MERKHANDBOEK / 01');logo(c,93,470,410,'stacked')
text(c,42,420,'Goed gebouwd.',33,'Jakarta-Bold');text(c,42,376,'Fijn wonen.',33,'Jakarta-Bold','copper')
text(c,42,333,'Thuis-symbool. Zeker Vakwerk-uitstraling.',12,'Inter-Medium')
for i,s in enumerate(['De goedgekeurde huisvorm is opnieuw als vector opgebouwd.', 'Gebruik de meegeleverde bestanden als vaste logo-master.', 'De woordvorm is gestandaardiseerd in Plus Jakarta Sans ExtraBold;', 'de gegenereerde conceptsheet blijft een visuele referentie.']):text(c,42,303-i*17,s,9,color='slate')
line(c,42,215,W-42,215)
text(c,42,188,'Logo toepassen',15,'Jakarta-Bold')
for i,s in enumerate(['Houd rondom vrije ruimte van minimaal de deurbreedte van het huis.', 'Minimum: gestapeld 30 mm / 150 px; horizontaal 45 mm / 220 px.', 'Los symbool: minimaal 8 mm / 32 px. Test borduurwerk bij de leverancier.', 'Niet vervormen, roteren, omlijnen of de onderlinge verhoudingen wijzigen.', 'Gebruik op donkere vlakken de reverse- of witte variant.']):text(c,42,161-i*18,s,9)
footer(c,1);c.showPage()
header(c,'Kleur & typografie','Vaste kleuren voor herkenbaarheid op scherm en papier.')
y=H-260
for p in palette:
 rect(c,42,y-8,60,42,p['hex']);text(c,120,y+21,p['name'].upper(),10,'Inter-SemiBold');text(c,120,y+4,p['hex']+'  |  RGB '+', '.join(map(str,p['rgb'])),9)
 text(c,120,y-12,'CMYK ca. '+ ' / '.join(map(str,p['cmyk_approx'])),8,color='slate');y-=64
text(c,42,232,'Plus Jakarta Sans',22,'Jakarta-Bold');text(c,42,208,'Koppen: Bold 700. Logo: ExtraBold 800 (omgezet naar paden).',9)
text(c,42,176,'Inter',20,'Inter-SemiBold');text(c,42,152,'Lopende tekst: Regular 400. Labels: Medium 500 / SemiBold 600.',9)
for i,s in enumerate(['Navy op chalk of wit voor tekst. Copper voor accenten en grote koppen.', 'Copper op chalk is niet geschikt voor kleine tekst met AA-contrast.', 'RGB/HEX is leidend. CMYK is een rekenkundige indicatie, geen drukprofiel.', 'Laat kleurkritisch drukwerk omzetten en proefdrukken door de drukker.']):text(c,42,122-i*14,s,8,color='slate')
footer(c,2);c.showPage()
header(c,'Bestanden & gebruik','Kies het juiste bestand voor elke toepassing.')
items=[('logos/svg','Schaalbare vectorlogo\'s; alle letters zijn contouren.','Transparante achtergrond tenzij de naam "on-" bevat.'),('logos/png','PNG op 3000 px breed (symbool 1200 px), echte alpha.','primary: lichte ondergrond; reverse/white: donkere ondergrond.'),('print','A4-briefpapier, invulbare offerte en projectopname.','Print op 100%, A4, zonder afloop. Invulvelden blijven interactief.'),('fonts','Plus Jakarta Sans en Inter, variabel en statische gewichten.','SIL Open Font License; licentieteksten zijn inbegrepen.'),('web / guidelines','CSS-variabelen, JSON-waarden en een GIMP-kleurpalet.','SVG is de voorkeurskeuze voor website, signing en drukwerk.'),('reference','De goedgekeurde branding-sheet als referentie.','Gebruik losse logo-masters voor productie, niet de conceptsheet.')]
y=610
for title,a,b in items:
 text(c,42,y,title,13,'Jakarta-Bold');text(c,42,y-22,a,9);text(c,42,y-38,b,9,color='slate');y-=72
text(c,42,157,'Formulieren personaliseren',12,'Jakarta-Bold')
for i,s in enumerate(['Er zijn bewust geen onbevestigde adres-, KvK-, bank- of contactgegevens', 'voorgedrukt. Voeg actuele bedrijfsgegevens toe vóór extern gebruik.', 'Offertevelden rekenen niet automatisch. Controleer bedragen en btw.']):text(c,42,136-i*15,s,9,color='slate')
text(c,42,77,'Fontbronnen: github.com/tokotype/PlusJakartaSans  |  github.com/rsms/inter',7,color='slate')
footer(c,3);c.showPage();c.save()

# Editable printable HTML companions with local vector logo and fonts.
style='''@font-face{font-family:Inter;src:url('../fonts/Inter-Regular.ttf')}@font-face{font-family:Jakarta;src:url('../fonts/PlusJakartaSans-Bold.ttf')}*{box-sizing:border-box}body{margin:0;color:#182339;font:11pt Inter,sans-serif;background:#eee}.page{width:210mm;min-height:297mm;margin:20px auto;background:#fff;padding:15mm;position:relative}.logo{width:70mm}h1{font:26pt Jakarta;margin:8mm 0 4mm}p{color:#56616D}header{border-bottom:2px solid #C47A43;padding-bottom:7mm}.grid{display:grid;grid-template-columns:1fr 1fr;gap:4mm;margin-top:6mm}label{font-size:9pt;color:#56616D;display:block}input,textarea{display:block;width:100%;font:11pt Inter;border:1px solid #B6B0A7;margin-top:2mm;padding:2mm;background:white;color:#182339}textarea{height:20mm;resize:vertical}table{width:100%;border-collapse:collapse;margin:8mm 0}th{text-align:left;background:#F7F3EC;padding:2mm}td{padding:1mm}footer{margin-top:8mm;border-top:1px solid #B6B0A7;padding-top:3mm;font-size:8pt}.full{grid-column:1/-1}@page{size:A4;margin:0}@media print{body{background:white}.page{margin:0;box-shadow:none}input,textarea{border:1px solid #B6B0A7}button{display:none}}'''
for key,title in [('01-briefpapier','Briefpapier'),('02-offerte','Offerte'),('03-projectopname','Projectopname')]:
 body=''
 if 'briefpapier' in key:body='<div contenteditable="true" style="min-height:190mm;padding-top:12mm"></div>'
 else:
  labels=['Naam opdrachtgever','Telefoon / e-mail','Projectadres','Datum']+(['Offertenummer','Geldig tot'] if 'offerte' in key else ['Project / referentie','Soort werk'])
  body='<div class="grid">'+''.join(f'<label>{lab}<input aria-label="{lab}"></label>' for lab in labels)+'</div>'
  if 'offerte' in key:
   body+='<table><tr><th>Werkzaamheden</th><th>Aantal</th><th>Bedrag EUR</th></tr>'+''.join('<tr><td><input aria-label="Werkzaamheden"></td><td><input aria-label="Aantal"></td><td><input aria-label="Bedrag EUR"></td></tr>' for _ in range(5))+'</table><div class="grid">'+''.join(f'<label>{lab}<input aria-label="{lab}"></label>' for lab in ['Subtotaal excl. btw','Btw (tarief / bedrag)','Totaal incl. btw','Planning'])+'</div><label style="margin-top:5mm">Afspraken / uitsluitingen / betalingsafspraak<textarea></textarea></label>'
  else:body+=''.join(f'<label style="margin-top:5mm">{lab}<textarea aria-label="{lab}"></textarea></label>' for lab in ['Wensen / huidige situatie','Maatvoering / technische aandachtspunten','Materialen / afwerking','Vervolgafspraak / actiehouder'])
 html=f'<!doctype html><html lang="nl"><meta charset="utf-8"><title>Novera Bouw - {title}</title><style>{style}</style><main class="page"><header><img class="logo" src="../logos/svg/novera-horizontal-primary.svg" alt="Novera Bouw"></header>'+('' if 'briefpapier' in key else f'<h1>{title}</h1>')+body+'<footer>NOVERA BOUW &nbsp; | &nbsp; Goed gebouwd. Fijn wonen.<div contenteditable="true" style="margin-top:3mm">Vul hier actuele bedrijfs- en contactgegevens in.</div></footer></main></html>'
 if key=='02-offerte': html=html.replace('</style>','input{padding:1mm;margin-top:1mm}table{margin:5mm 0}footer{margin-top:5mm}</style>')
 (ROOT/'print'/f'{key}-bewerkbaar.html').write_text(html)

# Friendly self-contained file index, local links.
index='''<!doctype html><html lang="nl"><meta charset="utf-8"><title>Novera Bouw - Branding kit</title><link rel="stylesheet" href="web/brand.css"><style>body{background:#F7F3EC;color:#182339;font-family:Inter,sans-serif;margin:0;padding:48px;max-width:1150px;margin:auto}h1,h2{font-family:"Plus Jakarta Sans",sans-serif}h1{font-size:48px;margin-bottom:12px}p{line-height:1.6}a{color:#182339}section{margin:40px 0}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.tile{padding:24px;background:white;border:1px solid #B6B0A7}.tile img{width:100%;height:190px;object-fit:contain}.dark{background:#182339;color:#F7F3EC}.dark a{color:#F7F3EC}li{margin:12px 0}.swatches{display:flex;gap:12px}.swatch{flex:1}.chip{height:70px;border:1px solid #B6B0A7}small{color:#56616D}code{font-size:13px}</style><header><p>NOVERA BOUW / BRANDING KIT</p><h1>Goed gebouwd.<br><span style="color:#C47A43">Fijn wonen.</span></h1><p>Thuis-huislogo met de kleuren en uitstraling van Zeker Vakwerk.<br>Vector-masters, transparante afbeeldingen, formulieren en merkrichtlijnen.</p></header><section class="grid">'''
for name,labelname,cl in [('stacked-primary','Primair logo',''),('horizontal-primary','Horizontaal logo',''),('stacked-reverse','Op donkere ondergrond','dark')]:
 index+=f'<div class="tile {cl}"><img src="logos/svg/novera-{name}.svg"><h2>{labelname}</h2><a href="logos/svg/novera-{name}.svg">SVG</a> · <a href="logos/png/novera-{name}.png">Transparante PNG</a></div>'
index+='</section><section><h2>Alle bestanden</h2><ul><li><a href="guidelines/Novera-merkhandboek.pdf">Merkhandboek (3 pagina’s)</a></li><li><a href="logos/svg/">Alle SVG-logo’s</a> · <a href="logos/png/">Alle PNG-logo’s</a></li>'
for fn in ['01-briefpapier-A4.pdf','02-offerte-A4-invulbaar.pdf','03-projectopname-A4-invulbaar.pdf']:index+=f'<li><a href="print/{fn}">{fn}</a></li>'
index+='</ul><p>De offerte en projectopname zijn invulbaar in een PDF-lezer. HTML-versies in de map print zijn bewerkbaar in de browser en printbaar op A4. Velden rekenen niet automatisch.</p></section><section><h2>Kleurpalet</h2><div class="swatches">'
for p in palette:index+=f'<div class="swatch"><div class="chip" style="background:{p["hex"]}"></div><p>{p["name"]}<br><code>{p["hex"]}</code></p></div>'
index+='</div></section><section><h2>Typografie</h2><p>Plus Jakarta Sans: koppen 700, logo 800. Inter: tekst 400, labels 500–600. Fonts en SIL-licenties staan in <a href="fonts/">fonts</a>. Het logo is omgezet naar paden en vereist geen geïnstalleerde fonts.</p><p><a href="https://github.com/tokotype/PlusJakartaSans">Plus Jakarta Sans bron</a> · <a href="https://github.com/rsms/inter">Inter bron</a></p></section><section><h2>Productienotities</h2><p>SVG zonder “on-” in de naam heeft geen achtergrond. PNG’s hebben echte transparantie; versies “on-chalk”, “on-white” en “on-navy” hebben een vaste achtergrond. De vector-master is een zorgvuldige reconstructie van het goedgekeurde concept, met gestandaardiseerde lettervormen.</p><p>A4-formulieren: op 100% afdrukken, geen afloop nodig. Voor kleurkritisch drukwerk: leverancier laat RGB omzetten naar het juiste drukprofiel. De CMYK-getallen in het merkhandboek zijn indicatief. Voeg actuele bedrijfsgegevens toe aan formulieren vóór verzending.</p></section></html>'
(ROOT/'START-HIER.html').write_text(index)
# Validate structure and fields before rendering.
report={}
for p in (ROOT/'print').glob('*.pdf'):
 r=PdfReader(p);f=r.get_fields() or {};widgets=[a.get_object() for pg in r.pages for a in pg.get('/Annots',[]) if a.get_object().get('/Subtype')=='/Widget'];assert len(widgets)==len(f)
 for w in widgets:assert w.get('/AP') and w['/AP'].get('/N')
 report[p.name]={'pages':len(r.pages),'fields':len(f),'widgets':len(widgets)}
report['guide_pages']=len(PdfReader(ROOT/'guidelines/Novera-merkhandboek.pdf').pages)
(Path(__file__).parent/'validation.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
if Path(__file__).resolve()!=ROOT/'source/build_kit.py': shutil.copy2(__file__,ROOT/'source/build_kit.py')
