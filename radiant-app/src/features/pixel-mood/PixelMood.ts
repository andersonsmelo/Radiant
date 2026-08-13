import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PixelExpression } from '../../ui/characters/pixelExpressions';
import { DIAS_PARA_AUSENCIA, PIXEL_MOMENTS, type PixelMoment } from './pixelPhrases';

export interface PixelMoodResult {
  expression: PixelExpression;
  phrase: string;
  phraseIndex: number;
}

const MS_POR_DIA = 24 * 60 * 60 * 1000;
const chave = (moment: PixelMoment) => `pixel-mood:last:${moment}`;

/** Momentos já disparados nesta sessão. Módulo, não componente: a regra é
 *  "um por sessão", e uma tela remontada não pode zerar isso. */
const disparados = new Set<PixelMoment>();
const ultimosDaSessao = new Map<PixelMoment, number>();

function resolveOpening(lastActiveDate: string | null, now: Date): PixelMoment {
  // Nulo não é zero. Nulo é "não há informação" — primeiro acesso. A conta
  // ingênua trata como ausência infinita e recebe o usuário recém-instalado
  // com "olha só quem lembrou que radiologia existe".
  if (!lastActiveDate) return 'abriu-o-app';

  const anterior = new Date(`${lastActiveDate}T00:00:00`);
  if (Number.isNaN(anterior.getTime())) return 'abriu-o-app';

  // Negativo = relógio andou para trás, ou fuso. Vira 0.
  const dias = Math.max(0, Math.floor((now.getTime() - anterior.getTime()) / MS_POR_DIA));
  return dias >= DIAS_PARA_AUSENCIA ? 'voltou-depois-de-sumir' : 'abriu-o-app';
}

async function lerUltimoIndice(moment: PixelMoment): Promise<number | null> {
  try {
    const bruto = await AsyncStorage.getItem(chave(moment));
    if (bruto === null) return null;
    const n = Number.parseInt(bruto, 10);
    return Number.isNaN(n) ? null : n;
  } catch {
    // O mascote nunca pode ser o motivo de uma tela falhar. Sem o último
    // índice, perdemos só a regra de não-repetir.
    return null;
  }
}

function sortearDiferente(total: number, evitar: number | null): number {
  if (total <= 1) return 0;
  const candidatos = [];
  for (let i = 0; i < total; i += 1) if (i !== evitar) candidatos.push(i);
  return candidatos[Math.floor(Math.random() * candidatos.length)];
}

async function resolverFrase(moment: PixelMoment, umaVezPorSessao: boolean): Promise<PixelMoodResult | null> {
  const spec = PIXEL_MOMENTS[moment];
  if (!spec || spec.phrases.length === 0) return null;
  if (umaVezPorSessao && disparados.has(moment)) return null;

  const ultimo = ultimosDaSessao.get(moment) ?? await lerUltimoIndice(moment);
  const phraseIndex = sortearDiferente(spec.phrases.length, ultimo);

  if (umaVezPorSessao) disparados.add(moment);
  ultimosDaSessao.set(moment, phraseIndex);
  void AsyncStorage.setItem(chave(moment), String(phraseIndex)).catch(() => {});

  return { expression: spec.expression, phrase: spec.phrases[phraseIndex], phraseIndex };
}

async function resolve(moment: PixelMoment): Promise<PixelMoodResult | null> {
  return resolverFrase(moment, true);
}

/** Resolve falas ambientais que podem voltar depois de um intervalo longo.
 * Diferente do feedback de quiz, não há trava de uma vez por sessão; a camada
 * de apresentação controla frequência e duração. */
async function resolveSporadic(moment: PixelMoment): Promise<PixelMoodResult | null> {
  return resolverFrase(moment, false);
}

/** Zera os momentos da sessão. Usado no reinício de sessão e, obrigatoriamente,
 *  no `beforeEach` de todo teste que dispare momento — o Set é de módulo e
 *  sobrevive entre `it`s. */
function resetSession(): void {
  disparados.clear();
  ultimosDaSessao.clear();
}

export const PixelMood = { resolveOpening, resolve, resolveSporadic, resetSession };
