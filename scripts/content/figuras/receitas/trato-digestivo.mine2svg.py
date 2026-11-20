# Renderiza grupos do slide "Vertebra" (SMART-Bones.pptx, Servier Medical Art, CC BY 4.0) como SVG, sem alterar as formas.
import sys, xml.etree.ElementTree as ET, collections
ns={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
A='{%s}'%ns['a']
root=ET.parse('px/ppt/slides/slide3.xml').getroot()
tree=root.find('p:cSld/p:spTree',ns)
unsup=collections.Counter()
def color(el):
    if el is None: return None
    c=el.find('a:srgbClr',ns)
    if c is None: unsup['clr:'+(el[0].tag if len(el) else 'empty')]+=1; return '#888888'
    v='#'+c.attrib['val']
    for m in c:
        unsup['clrmod:'+m.tag.split('}')[1]]+=1
    return v
def fill(sp):
    pr=sp.find('p:spPr',ns)
    if pr.find('a:noFill',ns) is not None: return 'none'
    s=pr.find('a:solidFill',ns)
    if s is not None: return color(s)
    g=pr.find('a:gradFill',ns)
    if g is not None:
        unsup['grad']+=1
        return color(g.find('a:gsLst/a:gs',ns))
    unsup['nofill-spec']+=1; return 'none'
def line(sp):
    ln=sp.find('p:spPr/a:ln',ns)
    if ln is None or ln.find('a:noFill',ns) is not None: return None
    s=ln.find('a:solidFill',ns)
    if s is None: return None
    return color(s), int(ln.attrib.get('w','9525'))
def path_d(sp):
    cg=sp.find('p:spPr/a:custGeom',ns)
    if cg is None: unsup['nocust:'+sp.find('p:spPr/a:prstGeom',ns).attrib['prst'] if sp.find('p:spPr/a:prstGeom',ns) is not None else 'nogeom']+=1; return None
    out=[]
    for p in cg.findall('a:pathLst/a:path',ns):
        w=float(p.attrib.get('w',1)); h=float(p.attrib.get('h',1))
        # normaliza para as dimensoes do shape
        x=sp.find('p:spPr/a:xfrm',ns); cx=float(x.find('a:ext',ns).attrib['cx']); cy=float(x.find('a:ext',ns).attrib['cy'])
        sx=cx/w if w else 1; sy=cy/h if h else 1
        def pt(e): return f"{float(e.attrib['x'])*sx:.1f},{float(e.attrib['y'])*sy:.1f}"
        for c in p:
            t=c.tag.split('}')[1]
            if t=='moveTo': out.append('M'+pt(c[0]))
            elif t=='lnTo': out.append('L'+pt(c[0]))
            elif t=='cubicBezTo': out.append('C'+' '.join(pt(q) for q in c))
            elif t=='close': out.append('Z')
            else: unsup['path:'+t]+=1
    return ''.join(out)
def xf(el):
    x=el.find('p:spPr/a:xfrm',ns) if el.tag.endswith('}sp') else el.find('p:grpSpPr/a:xfrm',ns)
    return x
def render(el,sc=1.0):
    x=xf(el)
    off=x.find('a:off',ns).attrib; ext=x.find('a:ext',ns).attrib
    ox,oy=float(off['x']),float(off['y']); cx,cy=float(ext['cx']),float(ext['cy'])
    if el.tag.endswith('}sp'):
        d=path_d(el)
        if d is None: return ''
        tr=f'translate({ox:.1f} {oy:.1f})'
        if x.attrib.get('flipH')=='1' or x.attrib.get('flipV')=='1' or x.attrib.get('rot'): 
            sx=-1 if x.attrib.get('flipH')=='1' else 1; sy=-1 if x.attrib.get('flipV')=='1' else 1
            r=int(x.attrib.get('rot','0'))/60000
            tr+=f' translate({cx/2:.1f} {cy/2:.1f}) rotate({r}) scale({sx} {sy}) translate({-cx/2:.1f} {-cy/2:.1f})'
        ln=line(el)
        st=f' stroke="{ln[0]}" stroke-width="{ln[1]/sc:.2f}"' if ln else ''
        return f'<path transform="{tr}" d="{d}" fill="{fill(el)}" fill-rule="evenodd"{st}/>'
    co=x.find('a:chOff',ns).attrib; ce=x.find('a:chExt',ns).attrib
    sx=cx/float(ce['cx']) if float(ce['cx']) else 1; sy=cy/float(ce['cy']) if float(ce['cy']) else 1
    inner=''.join(render(c,sc*sx) for c in el if c.tag.endswith('}sp') or c.tag.endswith('}grpSp'))
    return f'<g transform="translate({ox:.1f} {oy:.1f}) scale({sx:.5f} {sy:.5f}) translate({-float(co["x"]):.1f} {-float(co["y"]):.1f})">{inner}</g>'
def find(name):
    for g in root.iter('{%s}grpSp'%ns['p']):
        if g.find('p:nvGrpSpPr/p:cNvPr',ns).attrib['name']==name: return g
name=sys.argv[1]; g=find(name)
x=g.find('p:grpSpPr/a:xfrm',ns); o=x.find('a:chOff',ns).attrib; e=x.find('a:chExt',ns).attrib
body=''.join(render(c,float(x.find('a:ext',ns).attrib['cx'])/float(e['cx'])) for c in g if c.tag.endswith('}sp') or c.tag.endswith('}grpSp'))
svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{o["x"]} {o["y"]} {e["cx"]} {e["cy"]}">{body}</svg>'
open(sys.argv[2],'w').write(svg); print(name,len(svg),dict(unsup))
