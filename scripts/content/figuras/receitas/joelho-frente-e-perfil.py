# HISTÓRICO, não é executado por teste nem pelo gate: registra como a fonte versionada em fontes/joelho-frente-e-perfil.svg foi feita
# a partir do original (Wikimedia Commons, Knee_skeleton_lateral_anterior_views.svg, Patrick J. Lynch e C. Carl Jaffe, CC BY 2.5).
# A regeneração do spec sai da fonte, por build-spec.mjs. Dependências: shapely e svgpathtools. As divisas de cor entre ossos seguem só traços do próprio autor (o projeto não digita polígono de corte).
# Recolore o original (Lynch, CC BY) por osso e grava a fonte. Divide as silhuetas pelos traços do autor, sem mudar contornos.
import re, sys
from shapely.geometry import Polygon, MultiPolygon, box
from shapely.ops import unary_union
from shapely.affinity import translate
from svgpathtools import parse_path
t = open('original.svg').read()
paths = re.findall(r'<path\s+fill="(#[0-9A-F]+)"\s+d="([^"]*)"\s+id="(path\d+)"', t)
def poly(d):
    p = parse_path(d); pts = []
    for s in p:
        n = max(2, int(s.length() / 0.4))
        pts += [(s.point(i / n).real, s.point(i / n).imag) for i in range(n)]
    g = Polygon(pts)
    return g if g.is_valid else g.buffer(0)
def dstr(g):
    g = g.simplify(0.12)
    gs = [g] if isinstance(g, Polygon) else [x for x in getattr(g, 'geoms', []) if isinstance(x, Polygon)]
    out = []
    for q in gs:
        if q.area < 0.05: continue
        for ring in [q.exterior, *q.interiors]:
            c = list(ring.coords)[:-1]
            out.append('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in c) + 'Z')
    return ''.join(out)
Y0, Y1 = 110, 440
SHIFT = -85  # aproxima o perfil da vista de frente (o vazio entre elas)
crop = box(-20, Y0, 540, Y1)
fem_f, tib_f = poly(dict((i, d) for _, d, i in paths)['path5']), poly(dict((i, d) for _, d, i in paths)['path79'])
lat = poly(dict((i, d) for _, d, i in paths)['path77'])
# Divisas de cor: só os traços do próprio autor (nenhum polígono digitado). De frente, o traço path33 contorna a tíbia
# e separa dela a cabeça da fíbula (a silhueta path79 o cobre no original). De perfil, as bordas inferiores do fêmur
# (path83, path81) e o contorno da fíbula (path145, path147) cortam a silhueta path77 em fêmur, patela, tíbia e fíbula.
P = dict((i, d) for _, d, i in paths)
def pieces(g, ids):
    r = g.difference(unary_union([poly(P[i]) for i in ids]))
    return [x for x in (r.geoms if hasattr(r, 'geoms') else [r]) if x.area > 0.3]
fp = pieces(tib_f, ['path33'])
assert len(fp) == 2
fib_f, tib_f_osso = sorted(fp, key=lambda x: x.area)
lp = pieces(lat, ['path83', 'path81', 'path145', 'path147'])
assert len(lp) == 4
femur_l = next(x for x in lp if x.bounds[1] <= 0)
patella = next(x for x in lp if x.bounds[0] >= 479)
fibula_l = next(x for x in lp if x.bounds[2] <= 395 and x.bounds[1] >= 260)
tibia_l = next(x for x in lp if x not in (femur_l, patella, fibula_l))
C = dict(femur='#E6E8EE', tibia='#FFC21A', fibula='#5EEAF7', patella='#4A9EFF', line='#14171F')
fills = [(fem_f, 'femur'), (tib_f_osso, 'tibia'), (fib_f, 'fibula'),
         (translate(femur_l, SHIFT), 'femur'), (translate(tibia_l, SHIFT), 'tibia'), (translate(fibula_l, SHIFT), 'fibula'), (translate(patella, SHIFT), 'patella')]
body = ''
for g, k in fills:
    body += f'<path fill="{C[k]}" d="{dstr(g.intersection(crop))}"/>'
lines = unary_union([translate(poly(d), SHIFT) if int(i[4:]) >= 77 else poly(d) for f, d, i in paths if f == '#D1D3D4']).intersection(crop)
body += f'<path fill="{C["line"]}" fill-rule="evenodd" d="{dstr(lines)}"/>'
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 {Y0} 440 {Y1-Y0}">{body}</svg>\n'
open('../../../../../scripts/content/figuras/fontes/joelho-frente-e-perfil.svg', 'w').write(svg)
print(len(svg) / 1024, 'KiB')
