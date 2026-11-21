// produto-dose-area (m21): tubo de teto com colimador, câmara de produto dose-área presa à saída e dois campos (estreito e largo) até o paciente deitado.
// Regenera fontes/produto-dose-area.svg: node scripts/content/figuras/cenas/produto-dose-area.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { k, helpers } from "../kit/base.mjs";
import { pessoa } from "../kit/pessoa.mjs";
import { mesa } from "../kit/mesa.mjs";
import { projecao, sala, YW } from "./comum/sala.mjs";
import { emitir } from "./comum/emitir.mjs";
import { tuboDeTeto, camaraDAP, segFeixe, marcaCampo, ZEXIT } from "./produto-dose-area.pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/produto-dose-area.svg", import.meta.url));
/** As peças em ordem de pintura (a medida por cor da evidência renderiza cada uma sozinha). */
export function pecas() {
  const TX = -6, ZC = 160, TC = 2.4, ZP = 100; // eixo do feixe (x), altura da base da câmara, espessura, superfície do paciente (cm)
  const HN = 3.6, HW = 7.2; // meia-abertura do campo na saída do colimador: estreito e largo
  const O = [34, 0, 89];
  const P = projecao([...k.boxCorners({ x: -76, y: -40, w: 118, d: 80 }, 72, 212)]);
  const campos = (zA, zB, extra = {}) => ["largo", "estreito"].map((tipo) => segFeixe(P, { x: TX, zA, zB, hExit: tipo === "largo" ? HW : HN, tipo, grad: tipo === "largo" && extra.grad })).join("");
  const cam = camaraDAP(P, { x: TX, z: ZC, T: TC });
  const pc = {
    sala: sala(P, { x0: -300, x1: 300, yF: YW + 230, h: 400 }),
    mesa: mesa(P, { x: -90, y: -35, w: 180, d: 70, z: 78 }),
    paciente: pessoa(P, O, { pose: "deitada", facing: [1, 0, 0], roupa: "camisola" }),
    marcasPaciente: ["largo", "estreito"].map((t) => marcaCampo(P, { x: TX, z: ZP, hExit: t === "largo" ? HW : HN, tipo: t })).join(""),
    feixeBaixo: campos(ZC, ZP, { grad: true }),
    tubo: tuboDeTeto(P, { x: TX }),
    hastes: cam.hastes,
    camara: cam.placa,
    marcasCamara: ["largo", "estreito"].map((t) => marcaCampo(P, { x: TX, z: ZC + TC + 0.5, hExit: t === "largo" ? HW : HN, tipo: t })).join(""),
    feixeCima: campos(ZEXIT, ZC + TC + 0.5),
  };
  const ORDEM = ["sala", "mesa", "paciente", "marcasPaciente", "feixeBaixo", "tubo", "hastes", "camara", "marcasCamara", "feixeCima"];
  return ORDEM.map((id) => ({ id, svg: pc[id] }));
}
export function gerar() {
  const label = "Tubo de raios X de teto, com o colimador e, logo abaixo da saída, uma câmara de medição: uma placa fina e larga. Dois campos saem do mesmo foco, um estreito e outro largo, atravessam a câmara e chegam ao paciente deitado na mesa; o campo largo cobre mais da placa.";
  return emitir({ label, pecas: pecas() });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
