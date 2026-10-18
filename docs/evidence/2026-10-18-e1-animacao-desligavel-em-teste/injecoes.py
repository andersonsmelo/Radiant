import subprocess, pathlib
INJ=[
 ('booleano', '.maestro/reward-unlock.yaml', "radiantReduceMotion: '1'", "radiantReduceMotion: true"),
 ('valor errado', '.maestro/reward-unlock.yaml', "radiantReduceMotion: '1'", "radiantReduceMotion: '0'"),
 ('sem argumento', '.maestro/reward-unlock.yaml', "    arguments:\n      radiantReduceMotion: '1'\n", ""),
 ('launchApp pelado', '.maestro/rating-prompt.yaml', "- killApp\n- launchApp:\n    arguments:\n      radiantReduceMotion: '1'\n", "- killApp\n- launchApp\n"),
 ('openLink com app parado', '.maestro/review-due.yaml', "- openLink:\n    link: radiantapp://review\n", "- killApp\n- openLink:\n    link: radiantapp://review\n"),
 ('sem a volta do centramento', '.maestro/reward-unlock.yaml', "- assertVisible:\n    id: journey-recommendation-action\n- scrollUntilVisible:\n    element:\n      id: journey-recommendation-action\n    direction: UP\n    centerElement: true\n    visibilityPercentage: 100\n", ""),
]
out=[]
for name,f,a,b in INJ:
    p=pathlib.Path(f); orig=p.read_text(encoding='utf8')
    n=orig.count(a); assert n>=1, (name,n)
    p.write_text(orig.replace(a,b,1),encoding='utf8')
    try:
        r=subprocess.run(['npm','run','test:maestro-contract'],capture_output=True,text=True)
    finally:
        p.write_text(orig,encoding='utf8')
    fails=[l.strip() for l in r.stdout.splitlines() if l.startswith('not ok') or 'launchApp' in l and ('must' in l or 'bare' in l) or 'openLink must' in l]
    out.append(f"## {name} ({f}, ocorrências da âncora: {n}, trocada a 1ª)\n"+"\n".join(fails[:6]))
print("\n\n".join(out))
