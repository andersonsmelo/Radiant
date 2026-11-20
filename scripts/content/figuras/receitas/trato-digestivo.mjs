// HISTÓRICO, não é executado por teste nem pelo gate: registra como a fonte versionada em fontes/trato-digestivo.svg foi feita
// a partir do original (Servier Medical Art, kit SMART-Digestive-system.pptx, slide 3, grupo "Group 5", CC BY 4.0). A regeneração do spec sai da fonte, por build-spec.mjs.
// Os caminhos relativos valem para a pasta de trabalho de origem (.superpowers/sdd/2026-11-19-figuras-fase-1/1C/trato-digestivo/), que não é versionada.
// Passo 1: trato-digestivo.mine2svg.py extrai o grupo do pptx para sv_src.svg; passo 2: este prep3.mjs (lê sv_src.svg na pasta atual, grava fonte3.svg, que vira a fonte versionada).
// Versão de 2026-11-20 (integração): os caminhos 90-94 e 133 (traços de vasos e uma peça rosada que ficam dentro do quadro, pintados antes dos órgãos) voltam à fonte como apoio; antes saíam com a cabeça. Saem 215 dos 965, todos fora do quadro (cabeça, boca, faringe, ponta do reto).
// Recolore o Servier "Complete digestive apparatus" por estrutura, pela ordem de pintura do SVG (caminhos 0-964).
import {readFileSync,writeFileSync} from 'node:fs';import {execFileSync} from 'node:child_process';
let svg=readFileSync('sv_src.svg','utf8').replace(/<svg [^>]*>/,m=>m.replace('<svg ','<svg width="244" height="899" '));
const js=`
const BASE={liver:'#FFC21A',eso:'#E6E8EE',gi:'#3A86F0',tube:'#7DB8FF',si:'#D5E3F7',pan:'#5EEAF7',li:'#9AA3B5',sup:'#5B6475'};
const toHSL=([r,g,b])=>{r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);return (mx+mn)/2};
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const toHex=a=>'#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
const parse=s=>{const m=/rgba?\\((\\d+), (\\d+), (\\d+)/.exec(s);return m?[+m[1],+m[2],+m[3]]:null};
const svg=document.querySelector('svg');const R=svg.getBoundingClientRect();
const els=[...svg.querySelectorAll('path')];const stat={},dropped={};
// luminância de referência por estrutura = a do fundo (preenchimento mais claro típico); realces ficam mais claros do mesmo matiz
const GI=new Set([570,571,572,573,574,575,576,577,580,587,588,589,590,591,592,593,626,675,676]);const REF={liver:.45,eso:.8,gi:.7,tube:.8,si:.74,pan:.9,li:.93,sup:.5};
els.forEach((e,i)=>{const b=e.getBoundingClientRect();const cx=b.x-R.x+b.width/2,cy=b.y-R.y+b.height/2;
 let g;
 if(i<=14)g='sup';else if(i<=89)g='sup';
 else if(i<=314)g=(i===104||i===146||(cx>100&&cx<156&&cy>205&&cy<448))?'eso':([90,91,92,93,94,133].includes(i)?'sup':null);
 else if(i<=344)g='liver';else if(i<=359)g='sup';else if(i<=569)g='pan';
 else if(i<=689)g=(i===578||i===579||i===580)?'tube':(GI.has(i)&&i!==580?'gi':'si');else g='li';
 if(i>=90&&i<=314&&g==='eso'&&i!==104&&i!==146&&b.bottom-R.y<345)g=null;
 if(!g||b.y-R.y>855){e.remove();dropped[g||'cabeca']=(dropped[g||'cabeca']||0)+1;return}
 stat[g]=(stat[g]||0)+1;
 const cs=getComputedStyle(e);const fc=parse(cs.fill),sc=parse(cs.stroke);
 const tone=c=>{const l=toHSL(c);if(l<.14)return '#0D0E12';const f=Math.max(.5,Math.min(1.25,l/REF[g]));const bb=hex(BASE[g]);return toHex(f<=1?bb.map(v=>v*f):bb.map(v=>v+(255-v)*Math.min(1,(f-1)*3)))};
 const op=cs.opacity,fo=cs.fillOpacity,sw=cs.strokeWidth;
 e.removeAttribute('style');e.setAttribute('fill',fc?tone(fc):'none');e.setAttribute('fill-rule','evenodd');
 if(fc&&fo!=='1')e.setAttribute('fill-opacity',fo);
 if(sc){e.setAttribute('stroke',tone(sc));e.setAttribute('stroke-width',sw.replace('px',''));e.setAttribute('stroke-linejoin','round')}
 if(op!=='1')e.setAttribute('opacity',op);
});
const p=document.createElement('pre');p.id='out';p.textContent=svg.outerHTML+'\\n<!--'+JSON.stringify({total:els.length,stat,dropped})+'-->';document.body.appendChild(p)`;
writeFileSync('prep3.html',`<!doctype html><body style="margin:0">${svg}<script>${js}</script>`);
let o=execFileSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--disable-gpu','--user-data-dir=/tmp/pw'+Date.now(),'--dump-dom','file://'+process.cwd()+'/prep3.html'],{encoding:'utf8',maxBuffer:1<<29,stdio:['ignore','pipe','ignore']});
o=o.match(/<pre id="out">([\s\S]*?)<\/pre>/)[1].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&amp;/g,'&');
console.log(o.match(/<!--(.*)-->/)[1]);
o=o.replace(/<!--[\s\S]*?-->/,'');
writeFileSync('fonte3.svg',o);console.log(o.length);
