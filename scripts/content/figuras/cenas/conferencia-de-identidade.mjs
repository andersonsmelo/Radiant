// conferencia-de-identidade: paciente deitado na maca com pulseira, profissional de pé com a folha do pedido e tela no pedestal.
// Regenera fontes/conferencia-de-identidade.svg: node scripts/content/figuras/cenas/conferencia-de-identidade.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { k, helpers } from "../kit/base.mjs";
import { pessoa, alturaPelve } from "../kit/pessoa.mjs";
import { leito } from "../kit/leito.mjs";
import { projecao, sala } from "./comum/sala.mjs";
import { emitir } from "./comum/emitir.mjs";
import { pulseira, folha, monitorPedestal } from "./conferencia-de-identidade.pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/conferencia-de-identidade.svg", import.meta.url));
export function gerar() {
  const YWS = -104, M = 6;
  const PAC = [-92, 0, 75], PROF = [48, 28, alturaPelve()], MON = [124, -72];
  const box = (x0, x1, y0, y1, z0, z1) => k.boxCorners({ x: x0, y: y0, w: x1 - x0, d: y1 - y0 }, z0, z1);
  const P = projecao([...box(-216 - M, 10 + M, -48 - M, 48 + M, 0, 100), ...box(24 - M, 72 + M, 8 - M, 48 + M, 0, 188 + M), ...box(MON[0] - 44 - M, MON[0] + 44 + M, MON[1] - 20, MON[1] + 20 + M, 0, 166 + M)]);
  const H = helpers(P);
  const sombra = (o, r = 16) => H.shadow({ x: o[0] - r, y: o[1] - r, w: 2 * r, d: 2 * r, r: r - 1 });
  const saidaPac = {}, saidaProf = {};
  const optPac = { pose: "deitada", facing: [1, 0, 0], roupa: "camisola", saida: saidaPac };
  const optProf = { pose: "em-pe", facing: [-1, 0, 0], roupa: "scrub", avental: false, bracos: { 1: { abd: 8, bend: 82 } }, saida: saidaProf };
  const corpoPac = pessoa(P, PAC, optPac);
  const corpoProf = pessoa(P, PROF, optProf);
  const wPac = saidaPac.pulso[-1], wProf = saidaProf.pulso[1];
  const pecas = [
    { id: "sala", svg: sala(P, { x0: -420, x1: 420, yF: 160, h: 400, yw: YWS }) },
    { id: "pedestal", svg: monitorPedestal(P, { x: MON[0], y: MON[1] }) },
    { id: "tela", svg: monitorPedestal(P, { x: MON[0], y: MON[1], parte: "painel" }) },
    { id: "maca", svg: leito(P, { x0: -214, w: 222, colchao: [-206, 206], grades: false }) },
    { id: "paciente", svg: sombra([-92, 0], 20) + corpoPac },
    { id: "pulseira", svg: pulseira(P, { w: wPac }) },
    { id: "profissional", svg: sombra(PROF) + corpoProf },
    { id: "folha", svg: folha(P, { w: wProf }) },
  ];
  const label = "Conferência de identidade: um paciente deitado numa maca com pulseira no punho, um profissional de pé com a folha do pedido na mão e, ao lado, uma tela de computador num pedestal.";
  return emitir({ label, pecas });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
