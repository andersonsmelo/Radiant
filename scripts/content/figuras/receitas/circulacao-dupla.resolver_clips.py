# uv run --with skia-pathops --with fonttools python -I resolver_clips.py <fonte.svg>
# O app não aceita clipPath: cada grupo recortado vira o caminho da interseção (recorte ∩ forma), com a mesma cor/gradiente.
import re, sys, math
import pathops
from fontTools.svgLib.path import parse_path
from fontTools.pens.svgPathPen import SVGPathPen

f = sys.argv[1]
s = open(f, encoding='utf8').read()

def pth(d):
    p = pathops.Path(); parse_path(d, p.getPen()); return p
def poly(pts):
    p = pathops.Path(); pen = p.getPen(); pen.moveTo(pts[0])
    for q in pts[1:]: pen.lineTo(q)
    pen.closePath(); return p
def dstr(p):
    pen = SVGPathPen(None, ntos=lambda v: ('%.3f' % v).rstrip('0').rstrip('.')); p.draw(pen); return pen.getCommands()
def clipd(cid):
    m = re.search(r'<clipPath id="%s">\s*<path class="st0" d="([^"]+)"' % re.escape(cid), s); return m.group(1)
def mul(a, b):  # matrizes SVG [a b c d e f]
    return [a[0]*b[0]+a[2]*b[1], a[1]*b[0]+a[3]*b[1], a[0]*b[2]+a[2]*b[3], a[1]*b[2]+a[3]*b[3],
            a[0]*b[4]+a[2]*b[5]+a[4], a[1]*b[4]+a[3]*b[5]+a[5]]
def tr(tx, ty): return [1, 0, 0, 1, tx, ty]
ROT90 = [0, 1, -1, 0, 0, 0]
def ap(m, x, y): return (m[0]*x+m[2]*y+m[4], m[1]*x+m[3]*y+m[5])

clips = {'st15': 'clippath', 'st7': 'clippath-1', 'st10': 'clippath-2', 'st8': 'clippath-3', 'st9': 'clippath-4'}
out_new_defs = ''
G = re.compile(r'<g class="(st15|st7|st10|st8|st9)">\s*<(polygon|rect) class="(st\d+)"([^>]*?)/>\s*</g>')
def repl(m):
    global out_new_defs
    cg, tag, cls, attrs = m.groups()
    cp = pth(clipd(clips[cg]))
    if tag == 'polygon':
        pts = [float(v) for v in re.search(r'points="([^"]+)"', attrs).group(1).split()]
        shape = poly(list(zip(pts[0::2], pts[1::2])))
        return '<path class="%s" d="%s"/>' % (cls, dstr(pathops.op(cp, shape, pathops.PathOp.INTERSECTION)))
    g = lambda k: float(re.search(r'\b%s="([-\d.]+)"' % k, attrs).group(1))
    x, y, w, h = g('x'), g('y'), g('width'), g('height')
    t = re.search(r'transform="translate\(([-\d.]+) ([-\d.]+)\) rotate\(90\)"', attrs)
    M = mul(tr(float(t.group(1)), float(t.group(2))), ROT90) if t else [1, 0, 0, 1, 0, 0]
    shape = poly([ap(M, x, y), ap(M, x+w, y), ap(M, x+w, y+h), ap(M, x, y+h)])
    d = dstr(pathops.op(cp, shape, pathops.PathOp.INTERSECTION))
    if not t:
        return '<path class="%s" d="%s"/>' % (cls, d)
    # o gradiente referia o espaço do retângulo girado: leva a transformação do retângulo para o gradientTransform
    gid = 'grad_' + cls
    if cls == 'st6':
        gt = mul(M, tr(16.63, 27.49)); xy = 'x1="174.64" y1="18.99" x2="219.84" y2="18.99"'
    else:  # st16
        gt = mul(M, tr(-31.07, -20.21)); xy = 'x1="174.64" y1="66.7" x2="219.84" y2="66.7"'
    out_new_defs += '<linearGradient id="%s" %s gradientTransform="matrix(%s)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4A9EFF"/><stop offset="1" stop-color="#FFC21A"/></linearGradient>' % (gid, xy, ' '.join('%.5g' % v for v in gt))
    return '<path d="%s" fill="url(#%s)"/>' % (d, gid)

s, n = G.subn(repl, s)
assert n == 5, n
s = re.sub(r'<clipPath id="[^"]+">\s*<path class="st0"[^>]*/>\s*</clipPath>', '', s)
s = s.replace('</defs>', out_new_defs + '</defs>', 1)
s = re.sub(r'\.st\d+ \{\s*clip-path: url\(#[^)]*\);\s*\}', '', s)
assert 'clip' not in s.lower().replace('clipping', ''), re.findall(r'.{30}clip.{30}', s)[:3]
open(f, 'w', encoding='utf8').write(s)
print('ok', n, len(s))
