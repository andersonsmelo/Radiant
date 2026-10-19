#!/usr/bin/env python3
"""FILA 65 — compara os glifos de fonte de ícone nas três leituras da mesma tela.

Uso: python3 -I analisar.py <pasta> <rotulo>, com <rotulo>.maestro.json,
<rotulo>.full.xml e <rotulo>.comp.xml gerados por medir.sh. Conta os nós com
caractere de uso privado (U+E000–U+F8FF), que é como a fonte MaterialIcons
codifica cada glifo, e confere os controles que precisam continuar na árvore.
"""
import json, re, sys, xml.etree.ElementTree as ET
PUA = re.compile(r'[-]')
def xml_nodes(p):
    out=[]
    for n in ET.parse(p).iter('node'):
        out.append({'text':n.get('text',''),'desc':n.get('content-desc',''),'cls':n.get('class',''),'bounds':n.get('bounds',''),'clickable':n.get('clickable')})
    return out
def maestro_nodes(p):
    out=[]
    def walk(n):
        a=n.get('attributes',{})
        out.append({'text':a.get('text',''),'desc':a.get('accessibilityText',''),'cls':a.get('class',''),'bounds':a.get('bounds',''),'clickable':a.get('clickable')})
        for c in n.get('children',[]): walk(c)
    walk(json.load(open(p)))
    return out
controls = ['Fechar revisão','Começar revisão','Confirmar resposta','REVISÃO','5 de 5 vidas']
d, r = sys.argv[1], sys.argv[2]
for mode,f,fn in [('maestro',f'{d}/{r}.maestro.json',maestro_nodes),('uiautomator completo',f'{d}/{r}.full.xml',xml_nodes),('uiautomator comprimido',f'{d}/{r}.comp.xml',xml_nodes)]:
    ns=fn(f)
    glyph=[n for n in ns if PUA.search(n['text']+n['desc'])]
    texted=[n for n in ns if n['text'] or n['desc']]
    print(f'## {r} — {mode}: {len(ns)} nós, {len(texted)} com texto/rótulo, {len(glyph)} com glifo de uso privado')
    for g in glyph: print('   glifo:', ascii(g['text'] or g['desc']), g['cls'], g['bounds'])
    for c in controls:
        hit=[n for n in ns if n['text']==c or n['desc']==c]
        if hit: print(f'   controle {c!r}:', [(h['cls'].split(".")[-1], 'text' if h['text']==c else 'desc', h['clickable']) for h in hit])
    five=[n for n in ns if n['text']=='5']
    print("   texto '5' cru:", len(five))
