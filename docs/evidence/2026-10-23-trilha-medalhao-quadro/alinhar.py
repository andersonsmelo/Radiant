import re,sys,subprocess,bisect
# Alinha a gravação a 60 fps com o atrace: a chegada da cabeça no vídeo fica
# ~0,75 s depois do primeiro lote de animação do momento (300 ms do trecho + 450 ms do percurso).
S=sys.argv[1]; N=sys.argv[2]
det=subprocess.run(['python3',sys.argv[3],N,'0','9'],capture_output=True,text=True,env={'MEDICAO_DIR':S,'PATH':'/usr/bin:/bin:/opt/homebrew/bin:/usr/local/bin'}).stdout.split('\n')
trans=[(float(l.split()[0]),l.split()[1],l.split()[2]) for l in det if l.strip()]
headv=[t for t,c,h in trans if h=='HEAD']
early=[t for t,c,h in trans if c=='CTA' and h=='HEAD' and headv and t<headv[0]+0.1]
rx=re.compile(r'-(\d+)\s+\(\s*(\d+)\)\s+\[\d+\]\s+\S+\s+([\d.]+): tracing_mark_write: B\|(\d+)\|(.*)$')
frames=[];ev=[];tap=None
for line in open(f'{S}/{N}.atrace.txt',errors='replace'):
    m=rx.search(line)
    if not m: continue
    tid,tgid,ts,p,name=m.groups()
    if tid!=tgid: continue
    ts=float(ts)
    if name.startswith('deliverInputEvent') and tap is None: tap=ts
    if name.startswith('Choreographer#doFrame ') and 'resynced' not in name: frames.append(ts)
    if 'mountInstructions::' in name:
        k=name.split('::')[-1].split()[0]; n=re.search(r'numInstructions=(\d+)',name)
        ev.append((ts,k,int(n.group(1)) if n else 0))
groups={}
for ts,k,n in ev:
    i=bisect.bisect_right(frames,ts)-1; key=frames[i] if i>=0 else ts
    groups.setdefault(key,[]).append((k,n))
keys=sorted(groups)
# começo do momento: primeiro lote só de UPDATE_PROPS com >=8 props depois de um lote do React com INSERT
start=None; react_before=None
for i,k in enumerate(keys):
    kinds={x[0] for x in groups[k]}
    if 'INSERT' in kinds and k>tap: react_before=k
    if react_before and kinds=={'UPDATE_PROPS'} and sum(n for _,n in groups[k])>=8 and k>react_before:
        start=k; break
print(f'{N}: cabeça no vídeo {headv[0] if headv else None}; quadro antecipado no vídeo: {early or "nenhum"}')
if start and headv:
    off=headv[0]-(start+0.75)  # vídeo = traço + off
    print(f'  último lote do React antes do momento: {react_before-tap:+.3f} s do toque; 1º lote de animação: {start-tap:+.3f} s; intervalo {1000*(start-react_before):.0f} ms')
    for k in keys:
        if react_before-0.4<=k<=start+0.05:
            kinds={x[0] for x in groups[k]}
            src='anim' if kinds=={'UPDATE_PROPS'} else 'REACT'
            print(f'   traço {k-tap:+.3f}  vídeo≈{k+off:.3f}  {src:5s} '+' '.join(f'{a}={b}' for a,b in groups[k][:12]))
    for t in early: print(f'  quadro antecipado em traço≈{t-off-tap:+.3f} s do toque')
