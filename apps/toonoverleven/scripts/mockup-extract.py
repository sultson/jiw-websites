#!/usr/bin/env python3
"""Leest de bestuursmock-up van de klant uit tot een gestructureerde boom.

De mock-up is 72 statische pagina's die allemaal uit hetzelfde kleine
blokkenrepertoire zijn opgebouwd. Hier wordt dat repertoire teruggelezen, zodat
de React-site dezelfde structuur en dezelfde teksten kan renderen in plaats van
72 pagina's na te typen.
"""
import json, re, sys, os, glob
from html.parser import HTMLParser
from html import unescape

HUIDIG = ['/']

SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser('~/Downloads/Toon-over-Leven-mockup-v2')

def url_of(href):
    """Een relatief mock-uppad wordt het adres dat de echte site gebruikt."""
    if not href or href.startswith(('http', 'mailto:', 'tel:', '#')):
        return href
    basis = HUIDIG[0]
    doel = href
    hier = [d for d in basis.split('/') if d]
    while doel.startswith('../'):
        doel = doel[3:]
        if hier: hier.pop()
    while doel.startswith('./'):
        doel = doel[2:]
    if doel.startswith('/'):
        pad = doel
    else:
        pad = '/' + '/'.join(hier + [doel]) if hier else '/' + doel
    pad = re.sub(r'index\.html$', '', pad)
    pad = re.sub(r'/+', '/', pad)
    if len(pad) > 1 and pad.endswith('/'):
        pad = pad[:-1]
    return pad or '/'

ICONS = {}
def icon_name(inner):
    key = re.sub(r'\s+', ' ', inner).strip()
    if key not in ICONS:
        ICONS[key] = f'i{len(ICONS)+1}'
    return ICONS[key]

class Node:
    __slots__ = ('tag','attrs','kids','text')
    def __init__(self, tag, attrs=None):
        self.tag = tag; self.attrs = attrs or {}; self.kids = []; self.text = ''
    def cls(self):
        return (self.attrs.get('class') or '').split()
    def has(self, c):
        return c in self.cls()
    def find_all(self, tag=None, cls=None):
        out = []
        for k in self.kids:
            if isinstance(k, Node):
                if (tag is None or k.tag == tag) and (cls is None or k.has(cls)):
                    out.append(k)
                out.extend(k.find_all(tag, cls))
        return out
    def find(self, tag=None, cls=None):
        r = self.find_all(tag, cls)
        return r[0] if r else None
    def kid_nodes(self, tag=None, cls=None):
        return [k for k in self.kids if isinstance(k, Node)
                and (tag is None or k.tag == tag) and (cls is None or k.has(cls))]

VOID = {'br','img','input','meta','link','hr','circle','path','rect','source','use'}

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node('#root'); self.stack = [self.root]
    def handle_starttag(self, tag, attrs):
        n = Node(tag, dict(attrs))
        self.stack[-1].kids.append(n)
        if tag not in VOID:
            self.stack.append(n)
    def handle_startendtag(self, tag, attrs):
        self.stack[-1].kids.append(Node(tag, dict(attrs)))
    def handle_endtag(self, tag):
        if tag in VOID: return
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                return
    def handle_data(self, data):
        self.stack[-1].kids.append(data)

def parse(html):
    p = P(); p.feed(html); return p.root

def clean(s):
    return re.sub(r'\s+', ' ', s).strip()

def plain(node):
    if isinstance(node, str): return node
    if node.tag == 'svg': return ''
    # Alleen-voor-schermlezers en pijltjes horen niet in de tekst: de site zet
    # die zelf, en anders staat "(opent op een andere website)" zichtbaar in de
    # zin op vierentwintig plekken.
    if node.tag == 'span' and (
        node.attrs.get('aria-hidden') == 'true' or 'sr-only' in (node.attrs.get('class') or '')
    ):
        return ''
    return ''.join(plain(k) for k in node.kids)

def rich(node):
    """Een alinea als lijst van stukjes: tekst, vet, of een link."""
    out = []
    def push(kind, text, **extra):
        text = re.sub(r'\s+', ' ', text)
        if not text: return
        if kind == 't' and out and isinstance(out[-1], str):
            out[-1] += text
        elif kind == 't':
            out.append(text)
        else:
            out.append({'tekst': text.strip(), **extra})
    def walk(n):
        for k in n.kids:
            if isinstance(k, str):
                push('t', k)
            elif k.tag == 'a':
                href = k.attrs.get('href', '')
                push('a', plain(k), href=url_of(href), extern=href.startswith('http'))
            elif k.tag in ('strong', 'b'):
                push('s', plain(k))
            elif k.tag in ('em', 'i'):
                push('e', plain(k))
            elif k.tag == 'span' and (
                k.attrs.get('aria-hidden') == 'true' or 'sr-only' in (k.attrs.get('class') or '')
            ):
                continue
            elif k.tag == 'svg':
                continue
            else:
                walk(k)
    walk(node)
    if out and isinstance(out[-1], str):
        out[-1] = out[-1].rstrip()
    if out and isinstance(out[0], str):
        out[0] = out[0].lstrip()
    return [o for o in out if o != '']

def acties(node):
    out = []
    for a in node.kid_nodes('div', 'actions'):
        for link in a.kid_nodes('a'):
            out.append({
                'label': clean(plain(link)),
                'href': url_of(link.attrs.get('href', '')),
                'soort': 'rand' if 'button--secondary' in link.cls() else ('tekst' if 'text-link' in link.cls() else 'hoofd'),
            })
    return out

def icon_of(node):
    ic = node.find('div', 'card-icon')
    if not ic: return None
    svg = ic.find('svg')
    if not svg: return None
    inner = ''.join(serialize(k) for k in svg.kids)
    return icon_name(inner)

def serialize(n):
    if isinstance(n, str): return n
    a = ''.join(f' {k}="{v}"' for k, v in n.attrs.items())
    if n.tag in VOID: return f'<{n.tag}{a}/>'
    return f'<{n.tag}{a}>' + ''.join(serialize(k) for k in n.kids) + f'</{n.tag}>'

def kaart(node):
    return {
        'icoon': icon_of(node),
        'kop': clean(plain(node.find('h3'))) if node.find('h3') else '',
        'tekst': [rich(p) for p in node.find_all('p')],
        'acties': acties(node),
    }

def section_blocks(article):
    blokken = []
    for sec in article.kid_nodes('section'):
        c = sec.cls()
        sid = sec.attrs.get('id')
        if 'content-section' in c:
            b = {'soort': 'kaarten' if sec.find('div', 'card-grid') else 'tekst', 'id': sid}
            h2 = sec.find('h2')
            if h2: b['kop'] = clean(plain(h2))
            eb = sec.find('span', 'eyebrow')
            if eb: b['kicker'] = clean(plain(eb))
            b['tekst'] = [rich(p) for p in sec.kid_nodes('p')]
            ul = sec.find('ul')
            if ul: b['punten'] = [rich(li) for li in ul.kid_nodes('li')]
            grid = sec.find('div', 'card-grid')
            if grid: b['kaarten'] = [kaart(k) for k in grid.kid_nodes('article')]
            b['acties'] = acties(sec)
            blokken.append(b)
        elif 'knowledge-section' in c:
            b = {'soort': 'kennis', 'id': sid}
            eb = sec.find('span', 'eyebrow')
            if eb: b['kicker'] = clean(plain(eb))
            h2 = sec.find('h2')
            if h2: b['kop'] = clean(plain(h2))
            intro = sec.find('p', 'knowledge-section__intro')
            if intro: b['intro'] = rich(intro)
            grid = sec.find('div', 'insight-grid')
            b['inzichten'] = [kaart(k) for k in grid.kid_nodes('article')] if grid else []
            cb = sec.find('aside', 'care-boundary')
            if cb:
                b['grens'] = {
                    'kop': clean(plain(cb.find('strong'))) if cb.find('strong') else '',
                    'tekst': [rich(p) for p in cb.find_all('p')],
                }
            blokken.append(b)
        elif 'resource-section' in c:
            b = {'soort': 'bronnen', 'id': sid}
            head = sec.find('div', 'section-heading')
            if head:
                eb = head.find('span', 'eyebrow')
                if eb: b['kicker'] = clean(plain(eb))
                h2 = head.find('h2')
                if h2: b['kop'] = clean(plain(h2))
                ps = head.kid_nodes('p')
                if ps: b['intro'] = rich(ps[0])
            b['bronnen'] = []
            grid = sec.find('div', 'resource-grid')
            for card in (grid.kid_nodes('a') if grid else []):
                spans = card.kid_nodes('span')
                b['bronnen'].append({
                    'href': url_of(card.attrs.get('href', '')),
                    'bron': clean(plain(card.find('span', 'resource-card__source'))),
                    'kop': clean(plain(card.find('strong'))),
                    'tekst': clean(plain([s for s in spans if not s.cls()][0])) if [s for s in spans if not s.cls()] else '',
                    'label': clean(plain(card.find('span', 'resource-card__link'))),
                })
            blokken.append(b)
        elif 'explorer' in c:
            b = {'soort': 'verkenner', 'id': sid}
            head = sec.find('div', 'section-heading')
            if head:
                h2 = head.find('h2')
                if h2: b['kop'] = clean(plain(h2))
                ps = head.kid_nodes('p')
                if ps: b['intro'] = rich(ps[0])
            b['filters'] = [clean(plain(f)) for f in sec.find_all('button', 'filter-chip')]
            b['kaarten'] = []
            for card in sec.find_all('article', 'activity-card'):
                img = card.find('img')
                meta = []
                dl = card.find('dl')
                if dl:
                    for row in dl.kid_nodes('div'):
                        meta.append({'label': clean(plain(row.find('dt'))), 'waarde': clean(plain(row.find('dd')))})
                b['kaarten'].append({
                    'thema': card.attrs.get('data-theme', ''),
                    'beeld': (img.attrs.get('src', '') if img else ''),
                    'alt': (img.attrs.get('alt', '') if img else ''),
                    'tag': clean(plain(card.find('span', 'tag'))) if card.find('span', 'tag') else '',
                    'kop': clean(plain(card.find('h3'))) if card.find('h3') else '',
                    'tekst': [rich(p) for p in card.find_all('p')],
                    'meta': meta,
                    'acties': acties(card.find('div', 'activity-card__body') or card),
                })
            blokken.append(b)
    return blokken

def extract(path, rel):
    HUIDIG[0] = rel
    html = open(path, encoding='utf-8').read()
    root = parse(html)
    body = root.find('body')
    page = {
        'pad': rel,
        'titel': clean(plain(root.find('title'))).split(' · ')[0],
        'omschrijving': (root.find('meta') and '') or '',
        'soort': body.attrs.get('data-page-type', ''),
        'sectie': body.attrs.get('data-section', ''),
    }
    for m in re.finditer(r'<meta name="description" content="([^"]*)"', html):
        page['omschrijving'] = unescape(m.group(1))
    main = body.find('main')
    # kruimelpad
    crumbs = main.find('nav', 'breadcrumbs')
    if crumbs:
        page['kruimels'] = [
            {'label': clean(plain(k)), 'href': url_of(k.attrs.get('href'))} if k.tag == 'a' else {'label': clean(plain(k))}
            for k in crumbs.kid_nodes()
            if k.tag in ('a', 'span') and k.attrs.get('aria-hidden') != 'true'
        ]
    hero = main.find('section', 'hero')
    copy = hero.find('div', 'hero__copy')
    img = hero.find('img')
    ps = copy.kid_nodes('p')
    page['hero'] = {
        'kicker': clean(plain(copy.find('span', 'eyebrow'))) if copy.find('span', 'eyebrow') else '',
        'titel': clean(plain(copy.find('h1'))),
        'lead': rich(ps[0]) if ps else [],
        'onder': rich(ps[1]) if len(ps) > 1 else [],
        'acties': acties(copy),
        'beeld': (img.attrs.get('src', '').split('/')[-1] if img else ''),
        'alt': (img.attrs.get('alt', '') if img else ''),
        'route': 'hero--route' in hero.cls(),
    }
    # De regel met de datum van inhoudelijke controle, de bronnen en de
    # mededeling dat dit geen medisch advies is. Hij staat tussen de kop en de
    # inhoud, buiten het tweekolomsraster, en de opdrachtgever vraagt er in zijn
    # eigen eisen om: laat zien wanneer een antwoord voor het laatst is nagekeken.
    vertrouwen = main.find('aside', 'trust-line')
    if vertrouwen:
        page['vertrouwen'] = [rich(deel) for deel in vertrouwen.kid_nodes('span')]

    layout = main.find('div', 'page-layout')
    article = layout.find('article', 'page-content')
    # los staande blokken vóór de secties
    voor = []
    for node in article.kid_nodes():
        if node.has('authenticity-block'):
            voor.append({'soort': 'echtheid',
                         'kop': clean(plain(node.find('h2'))),
                         'tekst': [rich(p) for p in node.find_all('p')]})
        elif node.has('map-card'):
            content = node.find('div', 'map-card__content')
            voor.append({'soort': 'kaart-plek',
                         'kop': clean(plain(content.find('h2'))) if content.find('h2') else '',
                         'tekst': [rich(p) for p in content.find_all('p')],
                         'acties': acties(content)})
    page['blokken'] = voor + section_blocks(article)
    aside = layout.find('aside', 'page-aside')
    cc = aside.find('div', 'contact-card') if aside else None
    if cc:
        page['zijkaart'] = {
            'kicker': clean(plain(cc.find('span', 'eyebrow'))) if cc.find('span', 'eyebrow') else '',
            'kop': clean(plain(cc.find('h2'))) if cc.find('h2') else '',
            'tekst': [rich(p) for p in cc.find_all('p')],
            'acties': [{'label': clean(plain(a)), 'href': url_of(a.attrs.get('href', '')),
                        'soort': 'tekst' if 'text-link' in a.cls() else 'hoofd'}
                       for a in cc.find_all('a')],
        }
    # controlepunten
    dlg = body.find('dialog', 'review-dialog')
    if dlg:
        page['controle'] = []
        for sec in dlg.kid_nodes('section'):
            h3 = sec.find('h3')
            page['controle'].append({
                'kop': clean(plain(h3)).rsplit(' ', 1)[0] if h3 else '',
                'punten': [clean(plain(li)) for li in (sec.find('ol').kid_nodes('li') if sec.find('ol') else [])],
            })
    return page

pages = []
for f in sorted(set(glob.glob(os.path.join(SRC, '**', 'index.html'), recursive=True))):
    rel = os.path.relpath(f, SRC)
    if rel == 'START-HIER.html': continue
    url = '/' + rel[:-len('index.html')].rstrip('/')
    url = url if url != '/' else '/'
    pages.append(extract(f, url))

out = {'iconen': {v: k for k, v in ICONS.items()}, 'paginas': pages}
json.dump(out, open('raw/mockup.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'{len(pages)} paginas, {len(ICONS)} iconen -> raw/mockup.json')
