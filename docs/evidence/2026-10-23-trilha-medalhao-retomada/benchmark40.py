# Três rodadas: 26 deslizes para baixo + 26 para cima, (540,1700)<->(540,600), 350 ms,
# framestats despejado a cada 2 deslizes e deduplicado por IntendedVsync.
import subprocess,time,datetime,json,statistics
import os
S=os.environ.get('MEDICAO_DIR','.')+'/'  # pasta das gravações e saídas
adb=os.path.expanduser('~/Library/Android/sdk/platform-tools/adb'); PKG='com.ascendcreative.radiant'
def run(*a): return subprocess.check_output([adb,'-s','emulator-5554',*a]).decode('utf-8','replace')
def swipe(down): run('shell','input','swipe','540','1700' if down else '600','540','600' if down else '1700','350')
def parse(dump,frames):
    lines=dump.splitlines(); hdr=None
    for l in lines:
        if l.startswith('Flags,'): hdr=l.rstrip(',').split(','); continue
        if hdr and l and l[0].isdigit() and ',' in l:
            v=l.rstrip(',').split(',')
            if len(v)<len(hdr): continue
            r=dict(zip(hdr,v))
            if r['Flags']!='0': continue
            iv=int(r['IntendedVsync']); fc=int(r['FrameCompleted'])
            if fc>iv>0: frames[iv]=(fc-iv)/1e6
        elif hdr and l.startswith('---PROFILEDATA---') is False and not l.strip(): pass
def summary(dump):
    out={}
    for key in ('Total frames rendered','Janky frames','50th percentile','90th percentile','95th percentile','99th percentile'):
        for l in dump.splitlines():
            if l.strip().startswith(key): out[key]=l.split(':',1)[1].strip(); break
    return out
res=[]
for n in (1,2,3):
    # volta ao topo sem medir
    for _ in range(30): swipe(False)
    time.sleep(2)
    run('shell','dumpsys','gfxinfo',PKG,'reset')
    frames={}; raw=open(S+f'gfxinfo40-rodada{n}.txt','w')
    t0=time.time(); raw.write(f'RODADA {n}; {datetime.datetime.now().astimezone().isoformat()}\n')
    last=''
    for down in (True,False):
        for i in range(26):
            swipe(down); time.sleep(0.15)
            if i%2==1:
                d=run('shell','dumpsys','gfxinfo',PKG,'framestats'); parse(d,frames); raw.write(f'\nDUMP {"DOWN" if down else "UP"} {i+1}\n'+d); last=d
    time.sleep(1); d=run('shell','dumpsys','gfxinfo',PKG,'framestats'); parse(d,frames); raw.write('\nFINAL\n'+d); last=d; raw.close()
    dur=sorted(frames.values()); q=lambda p: dur[min(len(dur)-1,int(p*len(dur)))]
    r={'rodada':n,'segundos':round(time.time()-t0,1),'quadros_framestats':len(dur),'media_ms':round(statistics.mean(dur),2),
       'p50':round(q(.5),2),'p90':round(q(.9),2),'p95':round(q(.95),2),'p99':round(q(.99),2),'pior_ms':round(dur[-1],2),
       'acima_16_7ms':sum(1 for x in dur if x>16.67),'acima_33ms':sum(1 for x in dur if x>33.3),'resumo_gfxinfo':summary(last)}
    res.append(r); print(json.dumps(r,ensure_ascii=False),flush=True)
json.dump(res,open(S+'benchmark40.json','w'),ensure_ascii=False,indent=1)
