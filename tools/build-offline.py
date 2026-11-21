#!/usr/bin/env python3
"""hmsu Games をオフラインで遊べるようにするファイルを作り直す。
新しいゲームを games/index.html に足したら、毎回これを実行する:
    python3 tools/build-offline.py
作るもの: sw.js（リポジトリ直下）, games/manifest.webmanifest, games/icon-192.png, games/icon-512.png
"""
import os, re, json, hashlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

hub = open('games/index.html', encoding='utf-8').read()
entries = re.findall(r"\['\.\./([^']*)','([^']*)'", hub)

files = ['games/', 'games/index.html', 'games/manifest.webmanifest', 'games/icon-192.png', 'games/icon-512.png']
for path, img in entries:
    files.append('games/img/%s.jpg' % img)
    page = path if path.endswith('.html') else path + 'index.html'
    if path.endswith('/'):
        files.append(path)          # "beast-merge/" (directory URL)
    files.append(page)
    d = os.path.dirname(page)
    html = open(page, encoding='utf-8').read()
    for ref in re.findall(r"""(?:src|href)=['"]([^'"#]+)['"]""", html):
        if re.match(r'(https?:|data:|\.\./|/|#)', ref) or '+' in ref:
            continue
        files.append(os.path.normpath(os.path.join(d, ref.split('?')[0])) + ('?' + ref.split('?')[1] if '?' in ref else ''))

seen, uniq = set(), []
for f in files:
    f = f.replace(os.sep, '/')
    if f not in seen:
        seen.add(f); uniq.append(f)

GEN = {'games/manifest.webmanifest', 'games/icon-192.png', 'games/icon-512.png'}
missing = [f for f in uniq if not f.endswith('/') and f not in GEN and not os.path.exists(f.split('?')[0])]
if missing:
    raise SystemExit('missing files: %s' % missing)

h = hashlib.sha1()
for f in uniq:
    if not f.endswith('/') and f not in GEN:
        h.update(open(f.split('?')[0], 'rb').read())
version = h.hexdigest()[:10]

sw = """// 自動生成（tools/build-offline.py）。手で書きかえない。
const CACHE = 'hmsu-%s';
const FILES = %s;
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f => c.add(new Request(f, {cache: 'reload'})).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('hmsu-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === location.origin;
  const font = /fonts\\.(googleapis|gstatic)\\.com$/.test(url.hostname);
  if (!same && !font) return;               // ads / SDKs: network only
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(req, {ignoreSearch: false}) || (same && await c.match(req, {ignoreSearch: true}));
    const net = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    const r = await net;
    return r || new Response('offline', {status: 503, headers: {'Content-Type': 'text/plain'}});
  }));
});
""" % (version, json.dumps(['./' + f for f in uniq], ensure_ascii=False, indent=0))
open('sw.js', 'w', encoding='utf-8').write(sw)

manifest = {
    "name": "hmsu Games", "short_name": "hmsu Games",
    "description": "ブラウザですぐ遊べるゲーム集。オフラインでも遊べます。",
    "start_url": "./", "scope": "../", "display": "standalone",
    "background_color": "#120a1e", "theme_color": "#120a1e",
    "icons": [{"src": "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable"},
              {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"}]
}
open('games/manifest.webmanifest', 'w', encoding='utf-8').write(json.dumps(manifest, ensure_ascii=False, indent=1))

if not os.path.exists('games/icon-512.png'):
    from PIL import Image, ImageDraw, ImageFont
    S = 512
    im = Image.new('RGB', (S, S))
    d = ImageDraw.Draw(im)
    for y in range(S):
        k = y / S
        d.line([(0, y), (S, y)], fill=(int(58 + (18 - 58) * k), int(24 + (10 - 24) * k), int(56 + (30 - 56) * k)))
    f1 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 150)
    f2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 84)
    for txt, f, y, col in (('hmsu', f1, 150, (255, 207, 74)), ('GAMES', f2, 320, (255, 243, 230))):
        w = d.textlength(txt, font=f)
        d.text(((S - w) / 2 + 6, y + 8), txt, font=f, fill=(42, 7, 18))
        d.text(((S - w) / 2, y), txt, font=f, fill=col)
    im.save('games/icon-512.png')
    im.resize((192, 192), Image.LANCZOS).save('games/icon-192.png')

print('ok: %d files, cache hmsu-%s' % (len(uniq), version))
