import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Contrato dos entitlements do CloudKit privado (ADR 2026-09-15).
 *
 * Por que a afirmação é sobre `app.json` e não sobre `ios/`: `radiant-app/ios`
 * e `radiant-app/android` estão no `.gitignore` (linhas 42–43) e nenhum arquivo
 * deles é rastreado — são saída de prebuild, descartável e regenerada. Um teste
 * que lesse `ios/Radiant/Radiant.entitlements` certificaria um artefato que o
 * próximo `expo prebuild` reescreve, e passaria a verde mesmo depois de a
 * fonte ter perdido a configuração. A fonte de verdade versionada é o app
 * config, então é ele que o contrato guarda.
 *
 * A prova de que o config RESOLVIDO carrega estes valores é outra medição, que
 * não cabe numa suíte de unidade: `npx expo config --type introspect`. Ela vai
 * no relatório, com data. Este teste guarda a regressão silenciosa da origem.
 */
const appConfig = JSON.parse(
    readFileSync(join(__dirname, '..', '..', 'app.json'), 'utf8'),
) as { expo: { ios?: { bundleIdentifier?: string; entitlements?: Record<string, unknown> } } };

const ios = appConfig.expo.ios ?? {};
const entitlements = (ios.entitlements ?? {}) as Record<string, unknown>;

const CONTAINER = 'iCloud.com.ascendcreative.radiant';
const BUNDLE_ID = 'com.ascendcreative.radiant';

describe('entitlements do CloudKit privado', () => {
    it('declara exatamente o container canônico do ADR', () => {
        expect(entitlements['com.apple.developer.icloud-container-identifiers']).toEqual([CONTAINER]);
    });

    it('declara CloudKit como serviço de iCloud', () => {
        expect(entitlements['com.apple.developer.icloud-services']).toEqual(['CloudKit']);
    });

    it('mantém o bundle identifier que o container acompanha', () => {
        // O container so vale para este App ID; trocar o bundle sem trocar o
        // container produz um build que assina e falha em tempo de execucao.
        expect(ios.bundleIdentifier).toBe(BUNDLE_ID);
    });

    it('não introduz iCloud Documents nem ubiquity container', () => {
        // O desenho aprovado e CloudKit somente. Documents/ubiquity expoem
        // arquivos do usuario e mudam a revisao da App Store; entram so por
        // decisao nova.
        expect(entitlements).not.toHaveProperty('com.apple.developer.ubiquity-container-identifiers');
        expect(entitlements).not.toHaveProperty('com.apple.developer.ubiquity-kvstore-identifier');
    });

    it('não fixa o ambiente do container, deixando o provisionamento decidir', () => {
        // Fixar `icloud-container-environment` amarra o binario a Development ou
        // Production e faz o build assinado apontar para o ambiente errado sem
        // erro visivel. O handoff proibe o hardcode arbitrario.
        expect(entitlements).not.toHaveProperty('com.apple.developer.icloud-container-environment');
    });
});
