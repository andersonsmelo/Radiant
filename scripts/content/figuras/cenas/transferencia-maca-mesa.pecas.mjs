// Peças de transferencia-maca-mesa (m17): maca PARALELA à mesa de exame, do lado do espectador e na mesma altura, com um vão lateral entre os dois
// lados longos, paciente deitada na maca, prancha de transferência encostada no pedestal da mesa e suporte de soro.
// Maca em comum/maca.mjs; sala, mesa e pessoa vêm do kit. Em ordem de pintura (a mesa, mais longe, primeiro).
import { k, G, helpers, roundRect } from "../kit/base.mjs";
import { pessoa } from "../kit/pessoa.mjs";
import { mesa } from "../kit/mesa.mjs";
import { projecao, sala } from "./comum/sala.mjs";
import { maca } from "./comum/maca.mjs";

export function pecas() {
  const ZT = 80, MX = 20, TH = 31 * Math.PI / 180;
  const GAP = 28, L0 = -70; // vão lateral entre os lados longos e começo da maca em x (cm)
  const C = 35 + GAP + 32; // centro da maca em y: o lado longo dela (64 cm de largura) fica a GAP cm do lado longo da mesa (y = 35)
  const box = (x0, x1, y0, y1, z0, z1) => k.boxCorners({ x: x0, y: y0, w: x1 - x0, d: y1 - y0 }, z0, z1);
  const SOROX = L0 + 12, SOROY = C + 48;
  const ext = [...box(L0 - 4, 180, -36, C + 36, 0, 100), ...box(SOROX - 20, SOROX + 20, SOROY - 18, SOROY + 18, 0, 190), ...box(120, 175, -20, 20, 0, 66)];
  const P = projecao(ext);
  const { slab, cyl, p2 } = helpers(P);
  const M = maca(P, { l0: L0, len: 200, c: C, zTop: ZT, Rw: 13, calcos: [true, false] });
  // vão lateral: faixa escura entre o lado longo da maca e o da mesa, ao longo do trecho em que os dois se encostam (a maca, mais perto, a esconde em parte)
  const gx0 = Math.max(L0, MX), gx1 = Math.min(L0 + 200, MX + 160);
  const gap = slab({ x: gx0, y: 35, w: gx1 - gx0, d: GAP, r: 1 }, 74, 3, { tone: "lo", className: "c-dark" }, 3, 0.2);
  // paciente deitada, cabeça na cabeceira (esquerda), pés para a direita
  const sai = {}, PO = [L0 + 85, C, ZT + 12];
  const pac = pessoa(P, PO, { pose: "deitada", facing: [1, 0, 0], roupa: "camisola", saida: sai });
  const wr = sai.pulso[-1];
  // prancha de transferência: encostada na face +x do pedestal da mesa (x = 130), inclinada para fora, fora da passagem
  const BL = 70, BW = 40, PX = 130;
  const FB = G.frameOf([PX + BL * Math.sin(TH) + 1.6, BW / 2, 0], [-Math.sin(TH), 0, Math.cos(TH)], [0, -1, 0], [Math.cos(TH), 0, Math.sin(TH)]);
  const prancha = helpers(P).S(G.prismOf(FB, roundRect(0, BW, 0, 1.8, 0.8), 0, BL, P), { tone: "hi", className: "c-lead" });
  // suporte de soro, do lado do espectador, e a linha esticada até o pulso
  const bagTop = [SOROX + 7.5, SOROY, 150], end = [wr[0], wr[1], wr[2] + 3];
  const soro = cyl(SOROX, SOROY, 15, 0, 3, { tone: "mid", className: "c-dark" }, 16) + cyl(SOROX, SOROY, 1.7, 3, 184, { tone: "hi", className: "c-lead" }, 10)
    + slab({ x: SOROX - 10, y: SOROY - 1.3, w: 20, d: 2.6, r: 1 }, 184, 2.4, { tone: "hi", className: "c-lead" }, 3, 0.3)
    + slab({ x: SOROX + 2, y: SOROY - 3.5, w: 11, d: 7, r: 3 }, 150, 30, { tone: "hi", className: "c-blue" }, 4, 1);
  const [la, lb] = [bagTop, end].map(p2);
  const linha = `<path d="${k.pathOf([la, lb])}" fill="none" stroke="#E6E8EE" stroke-width="1.9" stroke-linecap="round"/>`;
  return [
    { id: "sala", svg: sala(P, { x0: -330, x1: 400, yF: 190, h: 330 }) },
    { id: "mesa", svg: mesa(P, { x: MX, y: -35, w: 160, d: 70, z: 78 }) },
    { id: "prancha", svg: prancha },
    { id: "vao", svg: gap },
    { id: "maca-tras", svg: M.tras },
    { id: "maca", svg: M.corpo },
    { id: "paciente", svg: pac },
    { id: "roda-cabeceira", svg: M.cab },
    { id: "roda-pes", svg: M.pes },
    { id: "soro", svg: soro },
    { id: "linha", svg: linha },
  ];
}
