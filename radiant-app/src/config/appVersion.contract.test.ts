/**
 * Guarda da versão do app, que vive em quatro lugares.
 *
 * O bump da 1.3.1 (`68bd097`, 2026-08-03) mudou `app.json` e `package.json` e
 * esqueceu o `package-lock.json`, que ficou dizendo 1.3.0 por sete semanas, até
 * um `npm install` sem relação nenhuma com versão acertá-lo em 2026-09-23
 * (`8f9224e`). Nada falhou nesse meio-tempo: o lockfile não entra na build, e
 * a divergência só enganava quem lia o repositório. Esta guarda torna o próximo
 * esquecimento vermelho.
 *
 * A versão da loja é a do `app.json` (`expo.version`), e a `runtimeVersion`
 * segue ela (`policy: appVersion`). O número de build não é conferido: o EAS o
 * guarda no servidor (`appVersionSource: remote`), e o do `app.json` é ignorado.
 *
 * Lê o JSON, nunca o texto (AGENTS.md, "Quatro lições sobre GUARDAS", regra 3),
 * e exige, além da igualdade, que a versão seja válida (regra 1).
 */
import fs from 'fs';
import path from 'path';

const RAIZ = path.resolve(__dirname, '../..');

type AppJson = { expo: { version: string } };
type PackageJson = { version: string };
type PackageLock = { version: string; packages: Record<string, { version?: string }> };

function lerJson<T>(arquivo: string): T {
    return JSON.parse(fs.readFileSync(path.join(RAIZ, arquivo), 'utf8')) as T;
}

function versoes(): Record<string, string | undefined> {
    const appJson = lerJson<AppJson>('app.json');
    const packageJson = lerJson<PackageJson>('package.json');
    const lock = lerJson<PackageLock>('package-lock.json');

    return {
        'app.json expo.version': appJson.expo.version,
        'package.json version': packageJson.version,
        'package-lock.json version': lock.version,
        'package-lock.json packages[""].version': lock.packages[''].version,
    };
}

describe('versão do app', () => {
    it('é a mesma no app.json, no package.json e nas duas raízes do package-lock.json', () => {
        const todas = versoes();
        const daLoja = todas['app.json expo.version'];

        expect(todas).toEqual(Object.fromEntries(Object.keys(todas).map((onde) => [onde, daLoja])));
    });

    it('é uma versão de loja válida, no formato MAIOR.MENOR.CORREÇÃO', () => {
        expect(versoes()['app.json expo.version']).toMatch(/^\d+\.\d+\.\d+$/);
    });
});
