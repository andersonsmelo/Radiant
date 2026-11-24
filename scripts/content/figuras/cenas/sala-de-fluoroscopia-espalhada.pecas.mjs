// sala-de-fluoroscopia-espalhada: 
// sai do paciente em leque (grossa sob a mesa, do lado do tubo; fina acima), o saiote barra a de baixo, o operador usa avental, protetor de
// tireoide e óculos; o biombo e a segunda pessoa ficam mais longe.
import { k, sala, cameraDe, POS, mesaFluoro, arco, tubo, receptor, cone, saiote, biombo, oculos, pessoa, pacienteOpt, operadorOpt, segundaOpt, helpers } from "./comum/fluoro.mjs";

/** As peças da cena em ordem de pintura: [{ id, svg }]. */
export function pecas() {
  const MARGEM = 8;
  const [OX, OY, OZ] = POS.operador, [SX, SY] = POS.segunda;
  const P = cameraDe([
    [-128, 118, -38, 38, 0, 80], [-64, 4, -34, 34, 120, 178], [-52, -8, -82, -42, 0, 178],
    [OX - 20, OX + 20, OY - 20, OY + 20, 0, 182], [-4, 68, 0, 38, 0, 80], [POS.biombo.x - 14, POS.biombo.x + 22, -122, -38, 0, 176], [SX - 18, SX + 18, SY - 20, SY + 20, 0, 182],
  ], MARGEM);
  const H = helpers(P);
  const corpoPac = pessoa(P, POS.paciente, pacienteOpt({}));
  const corpoOp = pessoa(P, POS.operador, operadorOpt);
  const corpo2 = pessoa(P, POS.segunda, segundaOpt);
  const sombra = (o, r = 16) => H.shadow({ x: o[0] - r, y: o[1] - r, w: 2 * r, d: 2 * r, r: r - 1 });
  // radiação espalhada: raios de uma origem no paciente (onde o cone entra) até a face do saiote (grossos) e até a frente do operador (finos)
  const ORIG = [POS.tubo[0], 0, 90];
  const linha = (a, b, attrs) => `<path d="${k.pathOf([k.iso(a, P), k.iso(b, P)])}" fill="none" stroke="#FFC21A" stroke-linecap="round" ${attrs}/>`;
  const ys = POS.saiote.y + (POS.saiote.y > 0 ? 5.5 : -5.5), { x0: sx0, x1: sx1 } = POS.saiote;
  const zsG = [16, 24, 32, 40, 48, 56], xsG = [0, 1, 2, 3, 4, 5].map((i) => sx0 + 4 + (i * (sx1 - sx0 - 8)) / 5);
  const ORIG_B = [POS.tubo[0], 0, 70]; // sob o ponto onde o feixe entra no paciente
  const grossos = zsG.map((z, i) => linha(ORIG_B, [xsG[i], ys, z], 'stroke-width="3.6" stroke-opacity=".92"')).join("");
  const yo = OY - Math.sign(OY) * 10.5, zN = OZ + 53;
  const finos = [OZ + 70, zN, OZ + 38].map((z, i) => linha(ORIG, [OX + [-4, 0, 4][i], yo, z], 'stroke-width="2" stroke-opacity=".7" stroke-dasharray="8 7"')).join("");
  return [
    { id: "sala", svg: sala(P, { x0: -420, x1: 420, yF: 120, h: 400 }) + sombra(POS.segunda) + sombra(POS.operador) }, // as sombras no chão contam como fundo
    { id: "segunda-pessoa", svg: corpo2 },
    { id: "biombo", svg: biombo(P) },
    { id: "arco", svg: arco(P) },
    { id: "mesa", svg: mesaFluoro(P) },
    { id: "tubo", svg: tubo(P) },
    { id: "paciente", svg: corpoPac },
    { id: "raios-finos", svg: finos },
    { id: "cone", svg: cone(P) },
    { id: "receptor", svg: receptor(P) },
    { id: "saiote", svg: saiote(P) },
    { id: "raios-grossos", svg: grossos },
    { id: "operador", svg: corpoOp },
    { id: "oculos", svg: oculos(P, POS.operador) },
  ];
}
