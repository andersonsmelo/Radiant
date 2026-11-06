#!/usr/bin/env node
/**
 * Sintetiza os três sons autorais da trilha ampla (I6 do plano de 2026-11-05):
 * `combo.m4a`, `nivel.m4a` e `unidade.m4a`, em `assets/sounds/`.
 *
 * Nada é baixado: cada som é uma soma de senoides com decaimento exponencial
 * (timbre de sino), escrita como expressão do `aevalsrc` do ffmpeg. Duas
 * passadas: a primeira mede o pico, a segunda aplica o ganho que o leva a
 * -3 dBFS, abaixo do corte.
 *
 * Uso: node scripts/synth-sounds.mjs            (gera os três arquivos)
 *      FFMPEG=/caminho/ffmpeg node scripts/synth-sounds.mjs
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FFMPEG = process.env.FFMPEG
  ?? (existsSync('/Users/anderson/.local/bin/ffmpeg') ? '/Users/anderson/.local/bin/ffmpeg' : 'ffmpeg');
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'sounds');
const SAMPLE_RATE = 44100;
const PEAK_DB = -3;

// Dó maior. Cada nota: [frequência em Hz, início em s, decaimento por segundo].
const C5 = 523.25, E5 = 659.25, G5 = 783.99, C6 = 1046.5, E6 = 1318.51, G6 = 1567.98, C7 = 2093;

/** Durações distintas entre si e das seis já existentes (40, 136, 188, 290, 373 e 993 ms). */
export const SOUNDS = {
  // 5 e 10 acertos seguidos: arpejo curto, para cima.
  combo: { seconds: 0.45, notes: [[C6, 0, 9], [E6, 0.07, 9], [G6, 0.14, 9], [C7, 0.21, 8]] },
  // Subir de nível: arpejo que pousa num acorde.
  nivel: { seconds: 0.7, notes: [[G5, 0, 7], [C6, 0.1, 7], [E6, 0.2, 7], [C6, 0.32, 5], [E6, 0.32, 5], [G6, 0.32, 5]] },
  // Unidade concluída: fanfarra de quatro notas, acorde sustentado e um brilho no fim.
  unidade: {
    seconds: 1.4,
    notes: [[C5, 0, 6], [E5, 0.12, 6], [G5, 0.24, 6], [C6, 0.36, 5], [C6, 0.6, 3], [E6, 0.6, 3], [G6, 0.6, 3], [C7, 0.9, 4]],
  },
};

/** Uma nota de sino: fundamental mais a oitava, baixa, com ataque de 6 ms para não estalar. */
function noteExpression([frequency, start, decay]) {
  const t = `(t-${start})`;
  const tone = `(sin(2*PI*${frequency}*${t})+0.25*sin(4*PI*${frequency}*${t}))`;
  return `gte(t,${start})*min(1,${t}/0.006)*exp(-${decay}*${t})*${tone}`;
}

function filterFor({ notes, seconds }, gainDb) {
  const fadeStart = (seconds - 0.05).toFixed(3);
  return `aevalsrc=exprs='${notes.map(noteExpression).join('+')}':s=${SAMPLE_RATE}:d=${seconds},`
    + `volume=${gainDb.toFixed(2)}dB,afade=t=out:st=${fadeStart}:d=0.05`;
}

function measurePeakDb(sound) {
  // Mede já dividido pelo número de notas, para a primeira passada não cortar.
  const preGain = -20 * Math.log10(sound.notes.length * 1.25);
  const run = spawnSync(FFMPEG, ['-hide_banner', '-f', 'lavfi', '-i', `${filterFor(sound, preGain)},volumedetect`, '-f', 'null', '-'], { encoding: 'utf8' });
  const match = /max_volume: (-?[\d.]+) dB/.exec(run.stderr ?? '');
  if (run.status !== 0 || !match) throw new Error(`ffmpeg não mediu o pico:\n${run.stderr}`);
  return { preGain, peak: Number(match[1]) };
}

for (const [name, sound] of Object.entries(SOUNDS)) {
  const { preGain, peak } = measurePeakDb(sound);
  const target = join(OUT_DIR, `${name}.m4a`);
  execFileSync(FFMPEG, [
    '-hide_banner', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', filterFor(sound, preGain + (PEAK_DB - peak)),
    '-ac', '1', '-ar', String(SAMPLE_RATE), '-c:a', 'aac', '-b:a', '96k',
    '-map_metadata', '-1', '-fflags', '+bitexact', '-movflags', '+faststart', target,
  ]);
  console.log(`${name}.m4a: ${sound.seconds * 1000} ms pedidos, pico em ${PEAK_DB} dBFS`);
}
