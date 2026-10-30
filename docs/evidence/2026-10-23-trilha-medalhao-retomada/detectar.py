import subprocess,sys,struct
import os
S=os.environ.get('MEDICAO_DIR','.')+'/'  # pasta das gravações e saídas
L=sys.argv[1]; T0=float(sys.argv[2]); T1=float(sys.argv[3])
f=S+L+'.webm'
pts=[float(x.split(',')[0]) for x in subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','frame=pts_time','-of','csv=p=0',f],capture_output=True,text=True).stdout.split()]
def series(crop):
    raw=subprocess.run(['ffmpeg','-v','error','-i',f,'-fps_mode','passthrough','-vf',f'crop={crop},scale=1:1:flags=area','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True).stdout
    return [tuple(raw[i:i+3]) for i in range(0,len(raw),3)]
cta=series('546:162:90:1374')   # botão sob L2 (âncora final)
head=series('120:135:105:1050') # cabeça ao lado de L2
n=min(len(pts),len(cta),len(head))
prev=None
for i in range(n):
    if not (T0<=pts[i]<=T1): continue
    c=cta[i]; h=head[i]
    ctaOn = c[2]>120 and c[2]-c[0]>60
    headOn = sum(h)/3>70 and h[2]-h[0]<40
    st=('CTA' if ctaOn else '---')+' '+('HEAD' if headOn else '----')
    if st!=prev: print(f'{pts[i]:.3f} {st} cta={c} head={h}')
    prev=st
