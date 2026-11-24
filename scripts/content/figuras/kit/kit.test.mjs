// node --test kit/kit.test.mjs  (Node 20, Chrome instalado). Cada peca passa nas reguas da arte importada do app.
import { test } from "node:test";
import assert from "node:assert/strict";
import { k, G, achatar, svgBruto, at } from "./base.mjs";
import { HEX_REGISTRADOS } from "./paleta.mjs";
import { pessoa, alturaPelve, caixa, alvoDeToque } from "./pessoa.mjs";
import { aparelhoMovel, tuboCompleto, feixe, cabecote, colimador } from "./tubo.mjs";
import { detector, brilho } from "./detector.mjs";
import { mesa } from "./mesa.mjs";
import { leito } from "./leito.mjs";
import { buckyMural } from "./bucky-mural.mjs";
import { biombo } from "./biombo.mjs";

// as mesmas reguas de radiant-app/src/ui/diagrams/diagramRegistry.test.ts (arte importada)
const PROIBIDO_TAG = /<(text|image|script|foreignObject|style|filter|mask|clipPath|use|pattern)\b|href/i;
const PROIBIDO_ATTR = /\s(class|style|filter|mask|clip-path|vector-effect)=|var\(|@keyframes|='/;
export const reguas = (svg) => [PROIBIDO_TAG.test(svg) && "tag proibida", PROIBIDO_ATTR.test(svg) && "atributo proibido", svg.length > 240 * 1024 && "acima de 240 KiB", !/<path\b/.test(svg) && "sem caminho"].filter(Boolean);
// toda cor de fill/stroke/stop-color e hex registrado, none ou url(#id)
export const coresForaDaPaleta = (svg) => [...svg.matchAll(/\b(?:fill|stroke|stop-color)="([^"]+)"/g)].map((m) => m[1]).filter((c) => c !== "none" && !/^url\(#\w+\)$/.test(c) && !HEX_REGISTRADOS.has(c.toUpperCase()));

const P = k.fitProjection(k.boxCorners({ x: -120, y: -150, w: 360, d: 300 }, 0, 220), 640, 480, { pad: 8, azimuth: 58 });
const face = G.unit3([0.55, 0.83, 0]);
const D = [-Math.cos(65 * Math.PI / 180), 0, Math.sin(65 * Math.PI / 180)], N = [Math.sin(65 * Math.PI / 180), 0, Math.cos(65 * Math.PI / 180)];
const HINGE = [-30, 0, 64], C = at(HINGE, [D, 33], [N, 10.5]), F0 = at(C, [N, 95]), B = G.mul3(N, -1);
const pecas = {
  "pessoa em pé": () => pessoa(P, [0, 0, alturaPelve()], { pose: "em-pe", facing: face }),
  "pessoa em pé de avental": () => pessoa(P, [0, 0, alturaPelve()], { pose: "em-pe", facing: face, avental: true, roupa: "scrub" }),
  "pessoa sentada": () => pessoa(P, [0, 0, 55], { pose: "sentada", facing: face }),
  "pessoa recostada": () => pessoa(P, [0, 0, 70], { pose: "recostada", facing: [1, 0, 0] }),
  "pessoa deitada": () => pessoa(P, [0, 0, 70], { pose: "deitada", facing: [1, 0, 0] }),
  "criança em pé": () => pessoa(P, [0, 0, alturaPelve("crianca")], { pose: "em-pe", idade: "crianca", facing: face }),
  "criança deitada de avental": () => pessoa(P, [0, 0, 70], { pose: "deitada", idade: "crianca", facing: [1, 0, 0], avental: true }),
  "aparelho móvel": () => aparelhoMovel(P, { ux: 0 }),
  "tubo (braço, cabeçote, colimador)": () => tuboCompleto(P, { ux: F0[0], za: F0[2] + 14, f0: F0, b: B }) + cabecote(P, { f0: F0 }) + colimador(P, { f0: F0, b: B }),
  "feixe": () => feixe(P, { f0: F0, b: B, c: C, u: D }),
  "detector": () => detector(P, { F: G.frameOf([0, 0, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0]) }) + brilho(P, { o: [0, 0, 0], ea: [1, 0, 0], eb: [0, 0, 1] }),
  "mesa": () => mesa(P, {}),
  "leito": () => leito(P, { encosto: { hinge: HINGE, D, N } }),
  "bucky mural": () => buckyMural(P, {}),
  "biombo": () => biombo(P, {}),
};
for (const [nome, fn] of Object.entries(pecas)) {
  test(`peça passa nas réguas e na paleta: ${nome}`, () => {
    const svg = achatar(svgBruto(fn(), 640, 480));
    assert.deepEqual(reguas(svg), []);
    assert.deepEqual(coresForaDaPaleta(svg), []);
  });
}
test("a guarda de paleta e as réguas pegam o defeito que nomeiam (vistas falhando)", () => {
  assert.deepEqual(coresForaDaPaleta('<path fill="#123456" stroke="#E6E8EE"/>'), ["#123456"]);
  assert.deepEqual(coresForaDaPaleta('<path fill="#e6e8ee" stroke="none"/><stop stop-color="#FFC21A"/>'), []);
  assert.ok(reguas('<svg><style>.a{}</style><path d="M0 0"/></svg>').includes("tag proibida"));
  assert.ok(reguas('<svg><path class="a" d="M0 0"/></svg>').includes("atributo proibido"));
  assert.ok(reguas('<svg><path d="M0 0" style="fill:red"/></svg>').includes("atributo proibido"));
});
test("pessoa em pé: área de toque de pelo menos 44 pt no quadro de 320, e ela contém a pessoa", () => {
  const o = [0, 0, alturaPelve()], opt = { pose: "em-pe", facing: face };
  const a = alvoDeToque(P, o, opt, { W: 640 }), pt = 640 / 320;
  assert.ok(a.w >= 44 * pt - 1e-6 && a.h >= 44 * pt - 1e-6, `${a.w} x ${a.h} px de 640`);
  const b = a.caixa;
  assert.ok(a.x <= b.x + 1e-6 && a.y <= b.y + 1e-6 && a.x + a.w >= b.x + b.w - 1e-6 && a.y + a.h >= b.y + b.h - 1e-6, "a área cobre a pessoa");
  assert.ok(b.h >= 44 * pt, "a pessoa, na escala da cena, tem altura de pelo menos 44 pt");
});
test("proporções: criança menor que o adulto, sem sair da faixa de 50% a 75%", () => {
  const h = (idade) => caixa(P, [0, 0, alturaPelve(idade)], { pose: "em-pe", idade, facing: face }).h;
  const r = h("crianca") / h("adulto");
  assert.ok(r > 0.5 && r < 0.75, String(r));
});
// A cabeça da criança deitada: o comprimento (s) é escalado por K e o raio não escalava, e a cabeça saía achatada (2,3 vezes mais LARGA que longa na vista de cima: o x do mundo, o eixo do corpo, vai para o y da tela).
// Mede o cabelo (a única peça c-hairKid) numa vista quase de cima, com o corpo ao longo de x.
const caixaDoCabelo = (idade) => {
  const Pc = k.fitProjection(k.boxCorners({ x: -60, y: -40, w: 120, d: 80 }, 0, 120), 640, 480, { pad: 8, azimuth: 0, elevation: 80 });
  const svg = pessoa(Pc, [0, 0, 70], { pose: "deitada", idade, facing: [1, 0, 0] });
  const g = svg.match(new RegExp(`<g class="${idade === "crianca" ? "c-hairKid" : "c-hair"}">([\\s\\S]*?)</g>`))[1];
  const n = [...g.matchAll(/ d="([^"]+)"/g)].flatMap((m) => m[1].match(/-?\d+\.?\d*/g).map(Number));
  const xs = n.filter((_, i) => i % 2 === 0), ys = n.filter((_, i) => i % 2 === 1);
  return { w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
};
test("criança deitada: a cabeça é oval como a do adulto (proporção largura/comprimento parecida), e menor que a dele", () => {
  const c = caixaDoCabelo("crianca"), a = caixaDoCabelo("adulto");
  const rc = c.w / c.h, ra = a.w / a.h;
  assert.ok(Math.abs(rc / ra - 1) < 0.25, `proporção da criança ${rc.toFixed(2)} contra ${ra.toFixed(2)} do adulto`);
  assert.ok(c.w < a.w && c.h < a.h && c.h > 0.6 * a.h, `criança ${c.w.toFixed(1)} x ${c.h.toFixed(1)} contra adulto ${a.w.toFixed(1)} x ${a.h.toFixed(1)}`);
});
// De costas para a câmera, a ordem de pintura do quadril invertia (o bias de 14 cm para a frente do corpo o punha ao fundo) e a tampa da coxa direita
// aparecia sobre o quadril. Com costas: true, o quadril (o maior grupo c-pants) é pintado depois das duas pernas.
test("pessoa em pé de costas para a câmera: com costas, o quadril é pintado depois das duas pernas (sem a tampa da coxa sobre ele)", () => {
  const Pc = k.fitProjection(k.boxCorners({ x: -120, y: -150, w: 360, d: 300 }, 0, 220), 640, 480, { pad: 8, azimuth: 68 });
  const grupos = (costas) => [...pessoa(Pc, [0, 0, alturaPelve()], { pose: "em-pe", facing: [0, -1, 0], roupa: "camisola", curva: 14, costas }).matchAll(/<g class="c-pants">([\s\S]*?)<\/g>/g)].map((m) => m[1].length);
  const g = grupos(true), quadril = Math.max(...g);
  assert.equal(g.length, 3, "duas pernas e o quadril");
  assert.equal(g.lastIndexOf(quadril), g.length - 1, `o quadril (${quadril}) deve ser o último grupo de calça pintado: ${g.join(", ")}`);
});
test("avental só aparece quando pedido, e leva a cor de avental registrada", () => {
  const com = pecas["pessoa em pé de avental"](), sem = pecas["pessoa em pé"]();
  assert.ok(com.includes('class="c-apron"') && com.includes('class="c-apron2"'));
  assert.ok(!sem.includes("c-apron"));
});
