#!/usr/bin/env python3
"""Compara a identidade dos itens da trilha entre um commit de base e a árvore de trabalho.

Uso: python3 compara-identidade.py [base=origin/main] [unidade ...]
Sai com 1 se alguma aula ou item mudou de id, tipo, papel ou marca de segurança.
A fase A reescreve texto e fontes; a identidade não pode mudar, senão o progresso do
aluno e a régua de segurança apontam para outra coisa.
"""
import glob, json, os, subprocess, sys

DIR = 'content-manifest/rtg-2026/aulas'
base = sys.argv[1] if len(sys.argv) > 1 else 'origin/main'
units = sys.argv[2:] or sorted(os.path.basename(f)[:-5] for f in glob.glob(f'{DIR}/*.json'))


def identity(doc):
    out = set()
    for lesson in doc['lessons']:
        out.add(('aula', lesson['id'], lesson.get('code')))
        for item in lesson['interactions']:
            out.add(('interacao', lesson['id'], item['id'], item['type'], item['role'], bool(item.get('criticalSafety'))))
        for i, item in enumerate(lesson['checkpoint']):
            out.add(('conferencia', lesson['id'], item.get('id', i), bool(item.get('criticalSafety'))))
        for kind in ('guided', 'transfer'):
            item = lesson['recovery'][kind]['item']
            out.add(('recuperacao', lesson['id'], kind, item.get('id', kind)))
    return out


failed = False
safety = [0, 0]
for unit in units:
    path = f'{DIR}/{unit}.json'
    before = identity(json.loads(subprocess.check_output(['git', 'show', f'{base}:{path}'])))
    after = identity(json.load(open(path)))
    safety[0] += sum(1 for x in before if x[0] == 'interacao' and x[-1])
    safety[1] += sum(1 for x in after if x[0] == 'interacao' and x[-1])
    if before != after:
        failed = True
        print(f'{unit}: DIFERENTE')
        for x in sorted(map(str, before - after)): print('  saiu  ', x)
        for x in sorted(map(str, after - before)): print('  entrou', x)
print(f'{len(units)} unidades comparadas com {base}; itens de segurança: {safety[0]} antes, {safety[1]} depois')
sys.exit(1 if failed else 0)
