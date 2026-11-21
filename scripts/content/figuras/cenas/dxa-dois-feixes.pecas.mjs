// dxa-dois-feixes (m30): densitômetro em vista isométrica, paciente deitada de costas, fonte sob o tampo, detector no braço acima e feixe estreito de duas energias.
import { k } from "../kit/base.mjs";
import { pessoa } from "../kit/pessoa.mjs";
import { proj, caixa, bloco, mesaD, salaD, ZM } from "./comum/dxa.mjs";

/** As peças da cena em ordem de pintura: [{ id, svg }]. */
export function pecas() {
  const XC = 22, ZS = 58, ZD = 164; // eixo do braço em C (x), topo da fonte, base do detector
  const BX = [XC - 2.5, XC + 2.5];
  const P = proj(caixa(-98, 112, -16, 27, 34, 186));
  const pt = (x, y, z) => k.iso([x, y, z], P);
  const azul = { tone: "hi", className: "c-blue" }, cinza = { tone: "mid", className: "c-mach" };
  const linha = (x, z0, z1, cor) => `<path d="${k.pathOf([[x, 0, z0], [x, 0, z1]].map((p) => pt(...p)))}" fill="none" stroke="${cor}" stroke-width="4" stroke-linecap="round"/>`;
  const paciente = pessoa(P, [0, 0, ZM + 12], { pose: "deitada", facing: [1, 0, 0], roupa: "camisola" });
  const mesa = mesaD(P, { x0: -98, x1: 112 });
  return [
    { id: "sala", svg: salaD(P, { x0: -170, x1: 170, yF: 60, h: 330, yw: -72 }) },
    { id: "coluna", svg: bloco(P, [XC - 14, XC + 12, -54, -40, 0, 188], cinza, 3, 1) + bloco(P, [XC - 12, XC + 10, -54, -12, 40, 52], cinza, 2, 0.8) },
    { id: "fonte", svg: bloco(P, [XC - 16, XC + 16, -13, 13, 36, ZS], azul, 4, 1) },
    { id: "feixeA", svg: linha(BX[0], ZS, ZM - 9, "#FFC21A") + linha(BX[1], ZS, ZM - 9, "#5EEAF7") },
    { id: "pedestais", svg: mesa.ped },
    { id: "mesa", svg: mesa.topo },
    { id: "paciente", svg: paciente },
    { id: "feixeB", svg: linha(BX[0], ZM, ZD, "#FFC21A") + linha(BX[1], ZM, ZD, "#5EEAF7") },
    { id: "braco", svg: bloco(P, [XC - 12, XC + 10, -54, 8, 170, 188], cinza, 3, 1) },
    { id: "detector", svg: bloco(P, [XC - 20, XC + 20, -15, 15, ZD, 178], azul, 5, 1.2) },
  ];
}
