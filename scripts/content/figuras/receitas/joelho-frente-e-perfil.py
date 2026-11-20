# HISTÓRICO, não é executado por teste nem pelo gate: registra como a fonte versionada em fontes/joelho-frente-e-perfil.svg foi feita
# a partir do original (Wikimedia Commons, Knee_skeleton_lateral_anterior_views.svg, Patrick J. Lynch e C. Carl Jaffe, CC BY 2.5).
# A regeneração do spec sai da fonte, por build-spec.mjs. Dependências: shapely e svgpathtools. Os cortes entre ossos (polígonos) são do projeto.
# Recolore o original (Lynch, CC BY) por osso e grava a fonte. Divide as silhuetas por cortes poligonais, sem mudar contornos.
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
H = 600
fib_f_cut = Polygon([(-10, 264), (21, 264), (52, 322), (52, H), (-10, H)])
fib_l_cut = Polygon([(300, 268), (334, 266), (346, 262), (360, 262.5), (367, 268), (371, 284), (377, 297), (389, 301), (392, 310), (389, 320), (385, 340), (381, 360), (377, 380), (374, 400), (378, 404), (378, H), (300, H)])
joint = [(300, 240), (345, 239.5), (375, 239), (395, 233), (420, 230), (440, 229), (455, 233), (470, 239), (480, 240), (540, 240)]
above = Polygon([(300, -50)] + joint + [(540, -50)])
pat_cut = box(479.5, -50, 540, 240)
patella = lat.intersection(pat_cut)
rest = lat.difference(pat_cut)
femur_l = rest.intersection(above)
below = rest.difference(above)
fibula_l = below.intersection(fib_l_cut)
tibia_l = below.difference(fib_l_cut)
C = dict(femur='#E6E8EE', tibia='#FFC21A', fibula='#5EEAF7', patella='#4A9EFF', line='#14171F')
fills = [(fem_f, 'femur'), (tib_f.difference(fib_f_cut), 'tibia'), (tib_f.intersection(fib_f_cut), 'fibula'),
         (translate(femur_l, SHIFT), 'femur'), (translate(tibia_l, SHIFT), 'tibia'), (translate(fibula_l, SHIFT), 'fibula'), (translate(patella, SHIFT), 'patella')]
body = ''
for g, k in fills:
    body += f'<path fill="{C[k]}" d="{dstr(g.intersection(crop))}"/>'
lines = unary_union([translate(poly(d), SHIFT) if int(i[4:]) >= 77 else poly(d) for f, d, i in paths if f == '#D1D3D4']).intersection(crop)
body += f'<path fill="{C["line"]}" fill-rule="evenodd" d="{dstr(lines)}"/>'
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 {Y0} 440 {Y1-Y0}">{body}</svg>\n'
open('../../../../../scripts/content/figuras/fontes/joelho-frente-e-perfil.svg', 'w').write(svg)
print(len(svg) / 1024, 'KiB')
