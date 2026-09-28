/**
 * Guarda do arquivo de StoreKit Testing (`modules/radiant-storekit/testing/`).
 *
 * O arquivo é local, escrito à mão pelo agente e não sincronizado com o App
 * Store Connect (decidido pelo dono em 2026-09-27). Sem sincronia, nada
 * impede que um ID ou um período divirja do app — e um ID divergente não
 * falha alto: a loja de teste simplesmente não devolve o produto, e o teste
 * no simulador mede uma tela sem planos. Esta guarda amarra o arquivo à fonte
 * única dos produtos no app, `subscriptionProducts.ts`.
 *
 * Lê o JSON, nunca o texto (AGENTS.md, "Quatro lições sobre GUARDAS", regra 3).
 * Preço e nome não são conferidos: o StoreKit Testing não cobra, e o que ele
 * mede é o fluxo.
 */
import fs from 'fs';
import path from 'path';

import { SUBSCRIPTION_PRODUCTS } from './subscriptionProducts';

const ARQUIVO = path.resolve(__dirname, '../../../modules/radiant-storekit/testing/RadiantIlimitado.storekit');

type Assinatura = { productID: string; recurringSubscriptionPeriod: string };
type Configuracao = { subscriptionGroups: { name: string; subscriptions: Assinatura[] }[] };

const PERIODO_DO_APP: Record<string, string> = { P1M: 'monthly', P1Y: 'annual' };

function assinaturas(): Assinatura[] {
    const config = JSON.parse(fs.readFileSync(ARQUIVO, 'utf8')) as Configuracao;
    return config.subscriptionGroups.flatMap((grupo) => grupo.subscriptions);
}

describe('StoreKit Testing — RadiantIlimitado.storekit', () => {
    it('tem um grupo só, como a ADR de produtos fixou', () => {
        const config = JSON.parse(fs.readFileSync(ARQUIVO, 'utf8')) as Configuracao;

        expect(config.subscriptionGroups.map((grupo) => grupo.name)).toEqual(['Radiant Ilimitado']);
    });

    it('declara exatamente os produtos do app, cada um com o período do app', () => {
        const doArquivo = Object.fromEntries(
            assinaturas().map((a) => [a.productID, PERIODO_DO_APP[a.recurringSubscriptionPeriod] ?? a.recurringSubscriptionPeriod]),
        );

        expect(doArquivo).toEqual(SUBSCRIPTION_PRODUCTS);
    });
});
