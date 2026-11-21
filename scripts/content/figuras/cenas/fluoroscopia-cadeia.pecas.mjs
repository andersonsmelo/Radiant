// fluoroscopia-cadeia: 
// cone entre eles, monitor, operador de avental e pedal no chão aos pés dele.
import { sala, cameraDe, POS, mesaFluoro, arco, tubo, receptor, cone, pedal, monitor, pessoa, pacienteOpt, operadorOpt, helpers } from "./comum/fluoro.mjs";

/** As peças da cena em ordem de pintura: [{ id, svg }]. */
export function pecas() {
  const MARGEM = 8;
  const [OX, OY, OZ] = POS.operador;
  const P = cameraDe([
    [-128, 110, -38, 38, 0, 80], [-64, 4, -34, 34, 120, 178], [-52, -8, -82, -42, 0, 178],
    [OX - 18, OX + 18, -20, 20, 0, 176], [POS.pedal.x - 30, POS.pedal.x + 62, -24, 24, 0, 16], [POS.monitor.x - 44, POS.monitor.x + 44, POS.monitor.y - 6, POS.monitor.y + 6, 0, 172],
  ], MARGEM);
  const H = helpers(P);
  const sP = {}, sO = {};
  const corpoPac = pessoa(P, POS.paciente, pacienteOpt(sP));
  const corpoOp = pessoa(P, POS.operador, operadorOpt);
  const sombra = (o, r = 16) => H.shadow({ x: o[0] - r, y: o[1] - r, w: 2 * r, d: 2 * r, r: r - 1 });
  return [
    { id: "sala", svg: sala(P, { x0: -420, x1: 420, yF: 120, h: 400 }) },
    { id: "monitor-suporte", svg: monitor(P) },
    { id: "monitor", svg: monitor(P, { parte: "tela" }) },
    { id: "operador", svg: sombra(POS.operador) + corpoOp },
    { id: "arco", svg: arco(P) },
    { id: "mesa", svg: mesaFluoro(P) },
    { id: "tubo", svg: tubo(P) },
    { id: "paciente", svg: corpoPac },
    { id: "cone", svg: cone(P) },
    { id: "receptor", svg: receptor(P) },
    { id: "pedal", svg: pedal(P) },
  ];
}
