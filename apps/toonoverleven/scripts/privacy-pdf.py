"""Export the published CMS privacy statement as a downloadable PDF."""
import json, urllib.request, urllib.parse
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
root=Path(__file__).resolve().parents[1]
query='{"privacy": *[_type=="sitePage" && path=="/privacy" && !(_id in path("drafts.**"))][0], "settings": *[_id=="siteTeksten"][0]}'
url='https://z4gex0g7.api.sanity.io/v2025-02-19/data/query/production?query='+urllib.parse.quote(query)
data=json.load(urllib.request.urlopen(url))['result']
page=next(x for x in json.loads((root/'src/next/pages.json').read_text()) if x['path']=='/privacy')
texts={x['_key']:x['text'] for x in data['privacy']['texts']}
settings=data['settings']['praktisch']
def content(n):
 if isinstance(n,str): return n
 if 'text' in n: return texts.get(n['key'], n['text'])
 if n.get('tag')=='site-slot':
  if n['attrs']['name']=='fact':
   group,key=n['attrs']['field'].split('.');return settings[group][key].replace('\n',', ')
  return ''
 return ''.join(content(c) for c in n.get('children',[]))
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='TitleToon',fontName='Times-Roman',fontSize=25,leading=29,textColor=HexColor('#78183c'),spaceAfter=16))
styles.add(ParagraphStyle(name='HeadingToon',fontName='Helvetica-Bold',fontSize=11,leading=14,textColor=HexColor('#283d38'),spaceBefore=12,spaceAfter=5,keepWithNext=True))
styles.add(ParagraphStyle(name='BodyToon',fontName='Helvetica',fontSize=10,leading=14,textColor=HexColor('#283d38'),spaceAfter=6))
flow=[Paragraph('TOON OVER LEVEN',styles['HeadingToon'])]
section=next(x for x in page['tree'] if x.get('tag')=='section')
for n in section['children']:
 if not isinstance(n,dict) or n.get('tag') not in ['h1','h2','p']:continue
 text=' '.join(content(n).split())
 if text:flow.append(Paragraph(escape(text),styles[{'h1':'TitleToon','h2':'HeadingToon','p':'BodyToon'}[n['tag']]]))
def footer(canvas,doc):
 canvas.setFont('Helvetica',8);canvas.setFillColor(HexColor('#596b65'))
 canvas.drawString(48,28,'Toon over Leven | Privacy en cookies | 28 september 2026')
 canvas.drawRightString(547,28,str(doc.page))
output=root/'public/documents/privacyverklaring-toon-over-leven.pdf'
SimpleDocTemplate(str(output),rightMargin=48,leftMargin=48,topMargin=36,bottomMargin=46,title='Privacy en cookies – Toon over Leven',author='Toon over Leven').build(flow,onFirstPage=footer,onLaterPages=footer)
print(output)
