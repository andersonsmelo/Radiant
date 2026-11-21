// dxa-posicionamento (m30): duas mesas de densitômetro lado a lado, vistas dos pés (azimute 20, elevação 40).
// Esquerda: coluna lombar (paciente de costas, quadril e joelhos dobrados, panturrilhas sobre o bloco). Direita: fêmur (pernas estendidas e abertas, posicionador entre os pés,
// o pé da esquerda do desenho girado para dentro e preso ao posicionador por faixa).
import { k, G } from "../kit/base.mjs";
import { pessoa } from "../kit/pessoa.mjs";
import { proj, caixa, bloco, mesaD, salaD, ZM } from "./comum/dxa.mjs";

/** As peças da cena em ordem de pintura: [{ id, svg }]. */
export function pecas() {
  const RAD = Math.PI / 180, { add3, sub3, mul3, dot3, unit3 } = G;
  const orth = (v, a) => unit3(sub3(v, mul3(a, dot3(a, v))));
  const ABD = 9, ROT = 20;                         // abertura de cada perna; giro interno do pé da esquerda do desenho
  const XA = -22, YA = 58, XB = -47, YB = -17;                                // pelves (x, y) da coluna (A) e do fêmur (B)
  const P = proj(caixa(-42, 92, -56, 86, 78, 118), 6, 50);
  const pt = (x, y, z) => k.iso([x, y, z], P);
  const Z = [0, 0, 1];
  // A: coxas a 50 graus da mesa, canelas quase horizontais, sobre o bloco
  const th = [Math.cos(50 * RAD), 0, Math.sin(50 * RAD)], sh = [Math.cos(-8 * RAD), 0, Math.sin(-8 * RAD)];
  const pernaA = { [-1]: { thigh: th, shin: sh }, [1]: { thigh: th, shin: sh } };
  const saiA = {}, saiB = {};
  const pessoaA = pessoa(P, [XA, YA, ZM + 12], { pose: "deitada", facing: [1, 0, 0], roupa: "camisola", perna: pernaA, saida: saiA });
  // B: pernas abertas (sd +1 = lado de y menor, sd -1 = lado de y maior = esquerda do desenho)
  const dir = (sd) => [Math.cos(ABD * RAD), -sd * Math.sin(ABD * RAD), Math.sin(3 * RAD)];
  const toe = (sd) => { const s = unit3(dir(sd)), up = orth(Z, s), toMid = orth([0, -sd * -1 * 0 + (sd === -1 ? -1 : 1), 0], s); // sd -1 (y maior): meio-plano a -y; sd +1: a +y
    const ang = sd === -1 ? ROT : -10; return unit3(add3(mul3(up, Math.cos(ang * RAD)), mul3(toMid, Math.sin(ang * RAD)))); };
  const perna = {}; for (const sd of [-1, 1]) perna[sd] = { thigh: dir(sd), shin: dir(sd), toe: toe(sd) };
  const pessoaB = (extras) => pessoa(P, [XB, YB, ZM + 12], { pose: "deitada", facing: [1, 0, 0], roupa: "camisola", perna, saida: saiB, extras });
  pessoaB([]); // só para colher os pontos das pernas
  const fe = saiB.pernas[-1], fd = saiB.pernas[1];
  const mesaA = mesaD(P, { x0: -98, x1: 112, y: YA, d: 56 }), mesaB = mesaD(P, { x0: -98, x1: 112, y: YB, d: 84 });
  const bloco0 = bloco(P, [XA + 26, XA + 80, YA - 18, YA + 18, ZM, 108], { tone: "hi", className: "c-blanket" }, 4, 1.4);
  const XP = fe.heel[0] + 30;                                                // posicionador entre os pés, adiante dos dedos: afastado dos pés na tela, para as áreas de toque não se sobreporem
  const posic = bloco(P, [XP - 2, XP + 14, YB - 9, YB + 9, ZM, ZM + 24], { tone: "hi", className: "c-lead" }, 3, 1.2);
  const fx = add3(fe.heel, mul3(fe.toe, 9));                                 // meio do pé da esquerda
  const strap = (a, b) => `<path d="${k.pathOf([a, b].map((p) => pt(...p)))}" fill="none" stroke="#FFC21A" stroke-width="5" stroke-linecap="round"/>`;
  const faixa = strap(add3(fx, mul3(fe.wAx, 5.2)), add3(fx, mul3(fe.wAx, -5.2))) + strap(add3(fx, mul3(fe.wAx, -5.2)), [XP + 4, YB + 9, ZM + 15]);
  return [
    { id: "sala", svg: salaD(P, { x0: -170, x1: 170, yF: 120, h: 330, yw: -110 }) },
    { id: "pedestaisA", svg: mesaA.ped }, { id: "mesaA", svg: mesaA.topo },
    { id: "pedestaisB", svg: mesaB.ped }, { id: "mesaB", svg: mesaB.topo },
    { id: "bloco", svg: bloco0 },
    { id: "pacienteA", svg: pessoaA },
    { id: "pacienteB", svg: pessoaB([]) },
    { id: "posicionador", svg: posic },
    { id: "faixa", svg: faixa },
  ];
}
