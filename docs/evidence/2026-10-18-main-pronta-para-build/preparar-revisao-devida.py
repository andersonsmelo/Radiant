#!/usr/bin/env python3
"""Prepara a fixture do G4: vence os cartões de revisão da L1 num simulador descartável.

Uso: python3 -I preparar-revisao-devida.py <udid>

Pré-condições:
- o app está PARADO (`xcrun simctl terminate <udid> com.ascendcreative.radiant`);
- a L1 foi concluída antes nesse simulador, por um roteiro real.

O que muda: só o `dueAt` dos cartões da `lesson-1` em `@radiant:item_review_v1`,
escalonado no passado (3 h, 2 h e 1 h atrás, na ordem do `itemId`), para que a
sessão de revisão traga exatamente esses itens, nessa ordem. Não toca tentativas,
marcos, telemetria nem o relógio, como pede o cabeçalho de `review-due.yaml`.
Imprime o antes e o depois de cada cartão alterado.
"""
from __future__ import annotations

import datetime
import hashlib
import json
import os
import subprocess
import sys

KEY = '@radiant:item_review_v1'
BUNDLE = 'com.ascendcreative.radiant'


def storage_dir(udid: str) -> str:
    data = subprocess.check_output(
        ['xcrun', 'simctl', 'get_app_container', udid, BUNDLE, 'data'], text=True).strip()
    base = os.path.join(data, 'Library', 'Application Support', BUNDLE, 'RCTAsyncLocalStorage_V1')
    if not os.path.isdir(base):
        sys.exit(f'sem AsyncStorage em {base}')
    return base


def read_value(base: str, manifest: dict) -> tuple[str, str | None]:
    """Valor da chave e, se ele mora em arquivo próprio, o caminho desse arquivo."""
    if KEY not in manifest:
        sys.exit(f'{KEY} ausente: a L1 foi concluída neste simulador?')
    if manifest[KEY] is not None:
        return manifest[KEY], None
    path = os.path.join(base, hashlib.md5(KEY.encode()).hexdigest())
    with open(path, encoding='utf-8') as handle:
        return handle.read(), path


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit('uso: preparar-revisao-devida.py <udid>')
    base = storage_dir(sys.argv[1])
    manifest_path = os.path.join(base, 'manifest.json')
    with open(manifest_path, encoding='utf-8') as handle:
        manifest = json.load(handle)
    raw, value_path = read_value(base, manifest)
    store = json.loads(raw)

    cards = sorted((key, card) for key, card in store['cards'].items() if card['item']['lessonId'] == 'lesson-1')
    if not cards:
        sys.exit('nenhum cartão da lesson-1')
    cards.sort(key=lambda entry: entry[1]['item']['itemId'])
    now = datetime.datetime.now(datetime.timezone.utc)
    for offset, (key, card) in zip(range(len(cards), 0, -1), cards):
        before = card['dueAt']
        card['dueAt'] = (now - datetime.timedelta(hours=offset)).isoformat(timespec='milliseconds').replace('+00:00', 'Z')
        print(json.dumps({'itemId': card['item']['itemId'], 'antes': before, 'depois': card['dueAt']}, ensure_ascii=False))

    serialized = json.dumps(store, ensure_ascii=False, separators=(',', ':'))
    if value_path:
        with open(value_path, 'w', encoding='utf-8') as handle:
            handle.write(serialized)
    else:
        manifest[KEY] = serialized
        with open(manifest_path, 'w', encoding='utf-8') as handle:
            json.dump(manifest, handle, ensure_ascii=False)
    print(json.dumps({'cartoes_no_store': len(store['cards']), 'tentativas': len(store['attempts']), 'alterados': len(cards)}))


if __name__ == '__main__':
    main()
