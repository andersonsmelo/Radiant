# Relatório — o merge da #38 e o envio da 1.4.0 à revisão (FILA, 28 e 30), 2026-10-09

**Quem fez:** o agente, com o ok do dono na conversa para cada passo
irreversível: o merge, a build, a troca da captura e o clique em "Enviar para
revisão".

## O que aconteceu, em ordem

| Hora | Passo | Evidência |
|---|---|---|
| 16:18 | **Merge da [PR #38](https://github.com/andersonsmelo/Radiant/pull/38)** por merge commit, como as #35 a #37. Antes: `MERGEABLE`, `CLEAN`, 42 commits, CI verde na `1522bda` (`content` e `quality`) e nenhuma thread de revisão aberta. O branch remoto não foi apagado | `221e2ec` na `main` |
| 16:20 | **Build de produção `1.4.0 (12)`** no EAS, disparada da worktree de release (`Radiant-release`, na `main` em `221e2ec`, árvore limpa), com o eas-cli 24.8.0 instalado pelo `npm ci` do lock da `main`. Imagem `macos-sequoia-15.6-xcode-26.0`. Número de build pelo EAS (`autoIncrement`, `appVersionSource: remote`) | build `18d0c9aa-d42c-4eff-951a-1a4aee279c86` |
| até 16:27 | **Envio ao App Store Connect** pelo `--auto-submit`, com a chave da API guardada no EAS. A build apareceu no TestFlight como "Pronta para envio" | envio `71d5c681-a754-4e5d-951d-76cc40c8ca02` |
| ~17:00 | **Versão 1.4.0 criada** no App Store Connect, com a build (12), o "O que há de novo" e as notas para a revisão, os dois textos aprovados pelo dono. Liberação manual, como na 1.3.1 | App Store Connect |
| 17:09 | **Captura de revisão refeita**, por decisão do dono, e trocada nos dois produtos | [captura](../../../radiant-app/docs/evidence/2026-10-09-envio-1-4-0/captura-revisao-assinatura.png) |
| 17:17 | **Enviada à revisão**: a versão 1.4.0 (12), os produtos mensal e anual e o grupo "Radiant Ilimitado", no mesmo envio, pela regra 8 da [ADR de produtos](../../adr/ADR-2026-09-15-radiant-ilimitado-storekit-products.md). O console respondeu "4 itens enviados", e a versão passou a "Aguardando revisão" | App Store Connect |

Os horários com "~" ou "até" são aproximados, lidos de capturas de tela; os demais vêm do console ou do Git.

## A captura de revisão

- **Como foi feita:** build Debug local com `xcodebuild` (destino num simulador
  iOS 26.5 limpo, criado para isso e apagado no fim), lançada pelo Xcode com
  **Run Without Building**, para valer o `RadiantIlimitado.storekit` do
  esquema; JS pelo Metro. A tela da assinatura foi aberta pelo deep link
  `radiantapp://subscription`.
- **O que mostra:** "Vidas ilimitadas — e só isso.", os dois planos com R$ 19,90
  por mês e R$ 149,90 por ano, as condições de renovação e o caminho para
  cancelar pelos Ajustes. 1206 × 2622 px.
- **Medido no console:** a captura antiga, de 2026-09-15, era quase igual à
  nova, com os mesmos planos, na mesma ordem, e o mesmo texto. A premissa de que
  "a tela mudou" valia para quem já assina, que vê o "Gerenciar".

## Três tropeços do caminho, para a próxima vez

- **A worktree de release tinha o eas-cli 16.32** no `node_modules`, e o
  `eas.json` exige `>= 24.8.0`. Um `npm ci` resolveu.
- **O destino do Xcode era o `E3C547AE`,** o simulador do StoreKit Testing de
  2026-09-27, que tem uma assinatura comprada. Lançar ali mostraria a tela de
  assinante. O destino foi trocado para o simulador limpo por Product →
  Destination.
- **O dev client não achou o Metro sozinho** e parou na abertura. Funcionou o
  link `radiantapp://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081`.

## O que não foi verificado

- **As capturas da página da loja** vieram da 1.3.1 e não foram abertas. Pelo
  item 37 da FILA, a vitrine incluía uma tela de checkpoint de botão, que não
  existe na 1.4. O dono foi avisado antes do envio.
- **A build `1.4.0 (12)` não foi aberta num aparelho** antes do envio. O que foi
  medido nela é a compilação no EAS e o processamento da Apple.

## Próximo

- **40, do dono:** liberar a 1.4.0 depois da aprovação. Se a Apple reprovar, a
  resposta é do agente com o dono.
- Pela FILA, o primeiro item do agente segue sendo o **38**.
