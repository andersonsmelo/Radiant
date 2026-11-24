# Mede a composição final (femur.png e pelve.png de partes.mjs, 1 px = 1 un da fonte, origem 3100,2300) e escreve medidas.json + shenton-overlay.svg
import numpy as np, json, sys
from PIL import Image
from scipy import ndimage as ndi
TX,TY=int(sys.argv[1]),int(sys.argv[2]); X0,Y0=3100,2300
ld=lambda n:np.array(Image.open(n).convert('RGB')).astype(int)
f,p=ld('femur.png'),ld('pelve.png')
mag=lambda a:(abs(a[...,0]-255)<12)&(a[...,1]<12)&(abs(a[...,2]-255)<12)
F,P=~mag(f),~mag(p)
near=lambda a,c,t=14:(abs(a-np.array(c)).max(-1)<=t)
H=near(f,(0xA5,0xC7,0xE0))|near(f,(0x5D,0x9F,0xC9))
lab,n=ndi.label(H); sz=ndi.sum(H,lab,range(1,n+1)); H=np.isin(lab,[i+1 for i,s in enumerate(sz) if s>3000])
hd=ndi.binary_fill_holes(ndi.binary_closing(H,iterations=6))
by,bx=np.nonzero(hd&~ndi.binary_erosion(hd)); bx=bx.astype(float); by=by.astype(float)
def fit(x,y):
    A=np.c_[2*x,2*y,np.ones(len(x))]; s=np.linalg.lstsq(A,x**2+y**2,rcond=None)[0]; return s[0],s[1],np.sqrt(s[2]+s[0]**2+s[1]**2)
cx,cy,r=3421-X0,2609-Y0,185.0  # estimativa inicial a olho; refinada só no arco livre da cabeça (ângulos -100 a +45 graus, tela com y para baixo)
for _ in range(8):
    ang=np.degrees(np.arctan2(by-cy,bx-cx)); k=(ang>-100)&(ang<45)&(abs(np.hypot(bx-cx,by-cy)-r)<25)
    cx,cy,r=fit(bx[k],by[k])
cx+=X0; cy+=Y0; bx+=X0; by+=Y0
inl=(abs(np.hypot(bx[k]-cx,by[k]-cy)-r)<4).mean()
lab2,n2=ndi.label(~P); fo=None
for i in range(1,n2+1):
    m=lab2==i; yy,xx=np.nonzero(m)
    if m.sum()>500 and yy.min()>0 and xx.min()>0 and yy.max()<P.shape[0]-1 and xx.max()<P.shape[1]-1 and xx.min()+X0>3500: fo=m
yy,xx=np.nonzero(fo); fx=xx.min()+X0; fy=yy[xx==xx.min()].mean()+Y0
dist=ndi.distance_transform_edt(~fo); gy,gx=np.mgrid[0:fo.shape[0],0:fo.shape[1]]
ring=np.abs(np.hypot(gx-(cx-X0),gy-(cy-Y0))-r)<1.0
folga_circ=dist[ring].min()
roofy=lambda x:np.nonzero(fo[:,x-X0])[0].min()+Y0
A=(3662,int(roofy(3662))); B=(3862,int(roofy(3862)))
ny=int(round(cy+1.5*r)); neck=lambda y:F[y-Y0].nonzero()[0].max()+X0
N=(int(neck(ny)),ny)
def circ(p,q,s):
    M=np.array([[2*(q[0]-p[0]),2*(q[1]-p[1])],[2*(s[0]-p[0]),2*(s[1]-p[1])]]); b=np.array([q[0]**2-p[0]**2+q[1]**2-p[1]**2,s[0]**2-p[0]**2+s[1]**2-p[1]**2])
    c=np.linalg.solve(M,b); return c,float(np.hypot(*(np.array(p)-c)))
c,R=circ(A,B,N)
dv=lambda pts:max(abs(np.hypot(x-c[0],y-c[1])-R) for x,y in pts)
roofpts=[(x,roofy(x)) for x in range(A[0],B[0]+1,4)]
# contorno inferomedial do colo: de N até a junção com a cabeça (y = N.y - 0 .. 2790+..)
yj=int(cy+r*0.97)  # base da cabeça
neckpts=[(neck(y),y) for y in range(yj+25,ny+30,3)]
out=dict(translate=[TX,TY],cabeca=dict(centro=[round(cx,1),round(cy,1)],raio=round(r,1),ajuste_inliers_4un=round(float(inl),2)),
 forame=dict(borda_lateral_x=int(fx),y_da_borda=round(float(fy),1)),
 borda_medial_da_cabeca_x=round(cx+r,1),distancia_borda_medial_cabeca_a_borda_lateral_forame_em_x=round(fx-(cx+r),1),
 folga_minima_circulo_da_cabeca_ao_forame=round(float(folga_circ),1),
 shenton=dict(pubis_A=A,pubis_B=B,colo_N=N,circulo=dict(centro=[round(float(c[0]),1),round(float(c[1]),1)],raio=round(R,1)),
   desvio_max_teto_AB=round(float(dv(roofpts)),1),desvio_max_borda_do_colo=round(float(dv(neckpts)),1),desvio_N=0))
print(json.dumps(out,indent=1)); json.dump(out,open('medidas.json','w'),indent=1)
# overlay: arco de N até x=B.x e pontos
import math
a0=math.atan2(N[1]-c[1],N[0]-c[0]); a1=math.atan2(B[1]-c[1],B[0]-c[0])
arc=f'M{N[0]},{N[1]} A{R:.1f},{R:.1f} 0 0 1 {B[0]},{B[1]}'
open('overlay.txt','w').write(f'<path d="{arc}" fill="none" stroke="#FF3B6B" stroke-width="7" stroke-dasharray="26 14"/>'
 +''.join(f'<circle cx="{x}" cy="{y}" r="14" fill="#FF3B6B" stroke="#fff" stroke-width="4"/>' for x,y in (A,B,N))
 +f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="10 10"/><circle cx="{cx:.1f}" cy="{cy:.1f}" r="8" fill="#fff"/>'
 +f'<line x1="{fx}" y1="{fy:.0f}" x2="{cx+r:.1f}" y2="{fy:.0f}" stroke="#fff" stroke-width="5"/>')
