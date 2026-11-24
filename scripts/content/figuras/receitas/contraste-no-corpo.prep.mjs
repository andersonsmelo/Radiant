// Monta a fonte contraste-no-corpo.svg: trato digestivo (fonte versionada do lote 1C) em âmbar e sistema urinário (Servier, slide 3 "Group 3") em azul, lado a lado.
import {readFileSync,writeFileSync} from 'node:fs';import {execFileSync} from 'node:child_process';
const DEC=Number(process.argv[2]??1), H=222, BOTTOM=232, GAP=26;
const dig=readFileSync('../../../../../scripts/content/figuras/fontes/trato-digestivo.svg','utf8');
const uri=readFileSync('fem.svg','utf8');
const inner=s=>s.replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
const vb=s=>s.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
// recolor: matiz fixo, luminosidade da arte (comprimida), saturação que cai para o branco
const rgb2hsl=([r,g,b])=>{r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);return (mx+mn)/2};
const hsl=(h,s,l)=>{const a=s*Math.min(l,1-l);const f=n=>{const k=(n+h/30)%12;return l-a*Math.max(-1,Math.min(k-3,9-k,1))};return '#'+[f(0),f(8),f(4)].map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('')};
const recolor=(s,hue)=>s.replace(/(fill|stroke)="#([0-9A-Fa-f]{6})"/g,(m,a,h)=>{const c=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16));const L=rgb2hsl(c);
  if(L<0.07)return `${a}="#0D0E12"`;const L2=0.14+0.66*L;const S=0.95*Math.min(1,(1-L2)/0.3);return `${a}="${hsl(hue,S,L2)}"`});
// arredonda as coordenadas absolutas a DEC casas e reescreve as curvas (C) e retas (L) em relativo: mesma geometria arredondada, menos caracteres
const fmt=a=>a.map((n,i)=>(i&&n>=0?',':'')+n).join('');
const rel=d=>{const t=[...d.matchAll(/([MLCZ])|(-?\d+(?:\.\d+)?)/g)].map(m=>m[1]??Number(Number(m[2]).toFixed(DEC)));let out='',i=0,cx=0,cy=0,sx=0,sy=0,cmd;
 const num=()=>t[i++];
 while(i<t.length){if(typeof t[i]==='string')cmd=t[i++];
  if(cmd==='Z'){out+='Z';cx=sx;cy=sy;continue}
  if(cmd==='M'){const x=num(),y=num();out+='M'+fmt([x,y]);cx=sx=x;cy=sy=y;cmd='L';continue}
  if(cmd==='L'){const x=num(),y=num();out+='l'+fmt([+(x-cx).toFixed(DEC),+(y-cy).toFixed(DEC)]);cx=x;cy=y;continue}
  if(cmd==='C'){const p=[num(),num(),num(),num(),num(),num()];out+='c'+fmt([p[0]-cx,p[1]-cy,p[2]-cx,p[3]-cy,p[4]-cx,p[5]-cy].map(v=>+v.toFixed(DEC)));cx=p[4];cy=p[5];continue}
  throw new Error('cmd '+cmd)}
 return out};
const round=s=>s.replace(/ d="([^"]*)"/g,(m,d)=>' d="'+rel(d)+'"');
const D=round(recolor(inner(dig),43)), U=round(recolor(inner(uri),213));
const page=(body,v)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${v[2]}" height="${v[3]}" viewBox="${v.join(' ')}" style="position:absolute;left:0;top:0">${body}</svg>`;
const bbox=(body,v)=>{writeFileSync('bb.html',`<body style="margin:0">${page(body,v)}<script>const s=document.querySelector('svg');const R=s.getBoundingClientRect();let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const e of s.querySelectorAll('path')){const b=e.getBoundingClientRect();if(b.width===0&&b.height===0)continue;x0=Math.min(x0,b.left);y0=Math.min(y0,b.top);x1=Math.max(x1,b.right);y1=Math.max(y1,b.bottom)}
const p=document.createElement('pre');p.id='o';p.textContent=JSON.stringify([x0-R.left+${v[0]},y0-R.top+${v[1]},x1-x0,y1-y0]);document.body.appendChild(p)</script>`);
 const o=execFileSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--disable-gpu','--user-data-dir=/tmp/pw'+Date.now(),'--dump-dom','file://'+process.cwd()+'/bb.html'],{encoding:'utf8',maxBuffer:1<<28,stdio:['ignore','pipe','ignore']});return JSON.parse(o.match(/<pre id="o">([^<]*)</)[1])};
const bd=bbox(D,vb(dig)), bu=bbox(U,vb(uri));console.error('bbox dig',bd,'urin',bu);
const sd=H/bd[3], su=H/bu[3], wd=bd[2]*sd, wu=bu[2]*su, left=(320-(wd+GAP+wu))/2;
const r=n=>Math.round(n*1000)/1000;
const td=`translate(${r(left-bd[0]*sd)} ${r(BOTTOM-H-bd[1]*sd)}) scale(${r(sd)})`, tu=`translate(${r(left+wd+GAP-bu[0]*su)} ${r(BOTTOM-H-bu[1]*su)}) scale(${r(su)})`;
console.error({sd,su,wd,wu,left,td,tu});
// camadas coladas: digestivo à esquerda (lado esquerdo da página), urinário à direita
const out=`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240"><g id="digestivo" transform="${td}">${D}</g><g id="urinario" transform="${tu}">${U}</g></svg>`;
writeFileSync('fonte.svg',out);console.error('bytes',out.length);
writeFileSync('meta.json',JSON.stringify({bd,bu,sd,su,wd,wu,left,td,tu}));
