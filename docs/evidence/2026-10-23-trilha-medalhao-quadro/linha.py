import re,sys
# Lotes de montagem do Fabric no thread principal do app, agrupados por quadro, a partir do toque.
f=sys.argv[1]; T1=float(sys.argv[2]) if len(sys.argv)>2 else 8
rx=re.compile(r'-(\d+)\s+\(\s*(\d+)\)\s+\[\d+\]\s+\S+\s+([\d.]+): tracing_mark_write: B\|(\d+)\|(.*)$')
ev=[]; tap=None; frames=[]
for line in open(f,errors='replace'):
    m=rx.search(line)
    if not m: continue
    tid,tgid,ts,p,name=m.groups()
    if tid!=tgid: continue  # só o thread principal
    ts=float(ts)
    if name.startswith('deliverInputEvent') and tap is None: tap=ts
    if name.startswith('Choreographer#doFrame ') and 'resynced' not in name: frames.append(ts)
    if 'mountInstructions::' in name:
        k=name.split('::')[-1].split()[0]; n=re.search(r'numInstructions=(\d+)',name)
        ev.append((ts,k+'='+(n.group(1) if n else '?')))
print('toque', tap)
import bisect
groups={}
for ts,k in ev:
    i=bisect.bisect_right(frames,ts)-1
    key=frames[i] if i>=0 else ts
    groups.setdefault(key,[]).append(k)
for key in sorted(groups):
    if not (tap-0.1<=key<=tap+T1): continue
    ins=groups[key]; kinds={x.split('=')[0] for x in ins}
    src='anim' if kinds=={'UPDATE_PROPS'} else 'REACT'
    print(f"{key-tap:+.3f} {src:5s} {' '.join(ins)}")
