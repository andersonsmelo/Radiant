#!/usr/bin/env python3
"""Prepara a fixture do G4 no Android: vence os cartões de revisão da L1 num emulador.

Uso: python3 -I preparar-revisao-devida-android.py <serial-do-emulador>

Equivale a `../2026-10-18-main-pronta-para-build/preparar-revisao-devida.py`, que
faz o mesmo no simulador iOS. No Android, o AsyncStorage mora no SQLite
`databases/RKStorage` (tabela `catalystLocalStorage`), legível só pelo próprio
app; por isso o acesso é por `run-as`, que exige a build Debug.

Pré-condições:
- o serial é de um emulador (`emulator-NNNN`); o script recusa aparelho físico;
- a L1 foi concluída antes nesse emulador, por um roteiro real.

O que faz:
1. para o app (`am force-stop`), para que nada escreva no banco durante a troca;
2. copia o banco e o WAL dele para uma pasta temporária e abre a cópia, o que
   aplica o WAL;
3. muda só o `dueAt` dos cartões da `lesson-1` em `@radiant:item_review_v1`,
   escalonado no passado (3 h, 2 h e 1 h atrás, na ordem do `itemId`), como no
   iOS. Não toca tentativas, marcos, telemetria nem o relógio;
4. consolida a cópia num arquivo único, devolve-o ao app e apaga o WAL e o SHM
   antigos do aparelho, que senão seriam reaplicados por cima;
5. relê o banco do aparelho e confere os vencimentos gravados.
Imprime o antes e o depois de cada cartão alterado.
"""
from __future__ import annotations

import datetime
import json
import os
import sqlite3
import subprocess
import sys
import tempfile

KEY = '@radiant:item_review_v1'
PACKAGE = 'com.ascendcreative.radiant'
DB = 'databases/RKStorage'
ADB = os.path.expanduser('~/Library/Android/sdk/platform-tools/adb')


def adb(serial: str, *args: str, stdin: bytes | None = None) -> bytes:
    return subprocess.run([ADB, '-s', serial, *args], input=stdin, check=True,
                          stdout=subprocess.PIPE).stdout


def pull(serial: str, folder: str) -> str:
    """Copia banco, WAL e SHM do app; devolve o caminho local do banco."""
    listing = adb(serial, 'shell', 'run-as', PACKAGE, 'ls', 'databases').decode().split()
    for name in ('RKStorage', 'RKStorage-wal', 'RKStorage-shm'):
        if name in listing:
            data = adb(serial, 'exec-out', 'run-as', PACKAGE, 'cat', f'databases/{name}')
            with open(os.path.join(folder, name), 'wb') as handle:
                handle.write(data)
    path = os.path.join(folder, 'RKStorage')
    if not os.path.exists(path):
        sys.exit('sem RKStorage: o app já abriu neste emulador?')
    return path


def read_store(path: str) -> dict:
    with sqlite3.connect(path) as conn:
        row = conn.execute('SELECT value FROM catalystLocalStorage WHERE key = ?', (KEY,)).fetchone()
    if row is None:
        sys.exit(f'{KEY} ausente: a L1 foi concluída neste emulador?')
    return json.loads(row[0])


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit('uso: preparar-revisao-devida-android.py <serial-do-emulador>')
    serial = sys.argv[1]
    if not serial.startswith('emulator-'):
        sys.exit(f'{serial} não é emulador: este script só roda em emulador descartável')
    adb(serial, 'shell', 'am', 'force-stop', PACKAGE)

    with tempfile.TemporaryDirectory() as folder:
        path = pull(serial, folder)
        store = read_store(path)
        cards = [(key, card) for key, card in store['cards'].items() if card['item']['lessonId'] == 'lesson-1']
        if not cards:
            sys.exit('nenhum cartão da lesson-1')
        cards.sort(key=lambda entry: entry[1]['item']['itemId'])
        now = datetime.datetime.now(datetime.timezone.utc)
        expected = {}
        for offset, (_, card) in zip(range(len(cards), 0, -1), cards):
            before = card['dueAt']
            card['dueAt'] = (now - datetime.timedelta(hours=offset)).isoformat(timespec='milliseconds').replace('+00:00', 'Z')
            expected[card['item']['itemId']] = card['dueAt']
            print(json.dumps({'itemId': card['item']['itemId'], 'antes': before, 'depois': card['dueAt']}, ensure_ascii=False))

        serialized = json.dumps(store, ensure_ascii=False, separators=(',', ':'))
        conn = sqlite3.connect(path)
        conn.execute('UPDATE catalystLocalStorage SET value = ? WHERE key = ?', (serialized, KEY))
        conn.commit()
        conn.execute('PRAGMA wal_checkpoint(TRUNCATE)')
        conn.execute('PRAGMA journal_mode=DELETE')
        conn.close()
        with open(path, 'rb') as handle:
            # `exec-in` com `run-as` não grava nada e sai com zero (medido em
            # 2026-10-19); o `shell` com a linha inteira num argumento grava.
            adb(serial, 'shell', f"run-as {PACKAGE} sh -c 'cat > {DB}'", stdin=handle.read())
        adb(serial, 'shell', 'run-as', PACKAGE, 'rm', '-f', f'{DB}-wal', f'{DB}-shm', f'{DB}-journal')

    with tempfile.TemporaryDirectory() as folder:
        reread = read_store(pull(serial, folder))
    saved = {card['item']['itemId']: card['dueAt'] for card in reread['cards'].values()
             if card['item']['lessonId'] == 'lesson-1'}
    if saved != expected:
        sys.exit(f'releitura diverge: {saved} != {expected}')
    print(json.dumps({'cartoes_no_store': len(reread['cards']), 'tentativas': len(reread['attempts']),
                      'alterados': len(expected), 'releitura': 'confere'}))


if __name__ == '__main__':
    main()
