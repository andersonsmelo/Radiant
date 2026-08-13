import { readFileSync } from 'node:fs';
import path from 'node:path';

import { warmNativeStorage } from './storage';

describe('warmNativeStorage', () => {
    // Existe para tornar a MEDIÇÃO válida, não para otimizar o produto. Medido em
    // 2026-08-10: a primeira operação de storage do kernel resolve o AsyncStorage
    // por `await import()`, que o Metro serve como chunk buscado por HTTP num Dev
    // Client — 177 a 622 ms. Como `inspectLaunch` em `off` retorna antes de tocar o
    // store, só o lado `active` pagava, e o delta de `first_frame` media essa
    // assimetria em vez do kernel, que custa menos de 2 ms.

    it('never rejects when the module resolution fails', async () => {
        // Neste ambiente a resolução falha **sempre**, e não por falta de mock:
        // `import()` dinâmico não executa sob Jest sem `--experimental-vm-modules`,
        // então `nativeStorage()` rejeita com `TypeError` antes de alcançar módulo
        // nenhum. É exatamente o caso que precisa ser engolido — aquecimento é
        // diagnóstico, e diagnóstico não derruba a partida do app.
        await expect(warmNativeStorage()).resolves.toBeUndefined();
    });

    // Guarda ESTRUTURAL, e o nível é deliberado. A propriedade a garantir é que o
    // aquecimento resolva o módulo sem tocar chave alguma, porque é isso que o
    // mantém compatível com `off` silencioso e portanto permite chamá-lo nos dois
    // modos. Um teste de runtime não consegue observá-la aqui: como o `import()`
    // dinâmico é inexecutável sob Jest, um aquecimento que lesse uma chave falharia
    // de forma idêntica a um que não lê, e a asserção passaria vazia — foi o que
    // aconteceu na primeira versão deste arquivo, e só a prova de mutação pegou.
    it('performs no key operation while warming', () => {
        const fonte = readFileSync(path.join(__dirname, 'storage.ts'), 'utf8');
        const corpo = fonte.slice(
            fonte.indexOf('export async function warmNativeStorage'),
            fonte.indexOf('export const asyncStorageKeyValueStorage'),
        );

        expect(corpo).toContain('await nativeStorage()');
        expect(corpo).not.toMatch(/\b(getItem|setItem|removeItem)\b/);
    });
});
