# Auditoria do repositório — 2026-11-10

Medido em 2026-11-10, na branch `claude/conteudo-reinicio-tecnologo` (PR
[#69](https://github.com/andersonsmelo/Radiant/pull/69), em rascunho). Nada disto
está na `main`, na loja ou num servidor.

**Como foi feita:** três agentes de IA leram, sem alterar nada, a API, a parte do
app que guarda dados, cobra e controla vidas, e o pipeline de conteúdo com o CI. O
agente principal conferiu no código os achados 1 a 7 e o 19 antes de relatar.
**Nenhuma pessoa revisou.** Carga considerada: um aluno por celular e, quando a API
voltar, de centenas a alguns milhares de usuários.

## Corrigidos

| Achado | O que mudou | Commit |
| --- | --- | --- |
| 1. Tempo da próxima vida parado | O React Compiler guardava o `Date.now()` da primeira renderização do `HUD` e da folha de vidas. Agora `src/ui/useNow.ts` relê a hora a cada 30 s enquanto uma vida está a caminho. | `9e31dd5` |
| 2. Token de redefinição de senha na resposta | Em produção ele nunca volta, mesmo com `EXPOSE_PASSWORD_RESET_TOKEN=true`. | `5586312` |
| 3. Token vencido dava 500 | Agora dá 401, e o app renova o login. | `5586312` |
| 4. Limite tratava todos os usuários como um | `trustProxy: 1` atrás do nginx, contador por rota e limpeza dos vencidos. | `5586312` |
| 5. Sincronização apagava progresso mais novo | Só entram resposta e revisão mais novas; o reenvio não conta tentativa. | `5586312` |
| 6. `"correct": "false"` como texto trocava o gabarito | O verificador recusa `correct` que não seja `true` ou `false`. | `6149856` |
| 7. Imagem do cadastro sem uso entrava sem checar licença | O gerador aplica `isValidLicensedImage` a todo o cadastro. | `054a708` |
| 8. Backup apagava as vidas ilimitadas | A mescla do `lastRefillAt` passa pela fila do `HeartsRepository`. A regra do `lastRefillAt` mais recente fica, por decisão do dono ([ADR](../adr/ADR-2026-09-15-cloudkit-private-backup.md)). | `e96359e`, `d47ec93` |
| 9. Fila de sincronização perdia itens | Itens que entram durante o envio ficam. | `a8edfa0` |
| 10. Sem login, a fila marcava como enviado | Os repositórios falham, e o item fica para nova tentativa. | `a8edfa0` |
| 11. Duas renovações de login deslogavam | No app, uma renovação por vez. No servidor, o token é conferido e revogado num `update ... returning` só. | `a8edfa0`, `664d585` |
| 12. Violações do banco viravam 500 | Unicidade (o mesmo e-mail cadastrado por dois pedidos ao mesmo tempo) dá 409; chave estrangeira (aula que o servidor não conhece) dá 422. | `c6a5c23` |
| 13. Sincronização aceitava números absurdos | Acertos até o total, fator de 1 a 10, intervalo até 36.500 dias. O app manda no máximo 2,5 e 365. | `c6a5c23` |
| 14. Paywall antigo sem chamador | Saíram `PaywallService`, `PaywallPlan`, `PaywallOfferCard`, `UpgradeInterestService`, os eventos `paywall_*`, a bandeira `ENABLE_PAYWALL`, as duas chaves do inventário e as métricas de monetização do war room e da tela de depuração. | `41c58d0` |
| 16. Aula malformada derrubava o gerador sem dizer o arquivo | Reprova como `rtg-lint:<arquivo>` com "forma inesperada". | `26e9f60` |
| 17. CI do app não rodava com mudança só no conteúdo | O filtro inclui `scripts/content/**` e `content-manifest/rtg-2026/**`. | `26e9f60` |
| 18. `safety` ⇔ `criticalSafety` não era checado | O verificador exige os dois juntos; as 92 interações de segurança já cumpriam. | `26e9f60` |
| 19. Sobras do modelo do Expo | Cinco componentes sem import e o `expo-blur` saíram. | `992b1b8` |
| 20. Código morto | A checagem `!user.id` que nunca roda, a opção `keyFromRequest` sem chamador e as exceções do contrato de estilo para arquivos apagados saíram. | `992b1b8` |

Cada correção teve um teste que falhou antes e passou depois, menos o SQL dos achados
5 e 11, que só existe contra um banco, o filtro do CI (17), que só se vê numa PR, e as
remoções (19 e 20), conferidas pela suíte inteira verde depois de apagar.

## O SQL contra um Postgres de verdade

Rodado em 2026-11-10 com `postgres:16-alpine` num contêiner temporário, o esquema de
`radiant-api/sql/` e uma aula de teste. Um script fora do repositório sobe o servidor
real da API e faz pedidos reais. Os mesmos cenários rodaram contra a API anterior às
correções (commit `d47ec93`):

| Cenário | API corrigida | API antiga |
| --- | --- | --- |
| 10 renovações ao mesmo tempo com o mesmo token | 1 aceita, em 3 rodadas | 2 aceitas, em 3 rodadas |
| Envio atrasado de uma nota mais antiga | ignorado | sobrescreve |
| Reenvio da mesma resposta | não conta tentativa | não chegou a rodar |
| Revisão antiga de outro aparelho | ignorada | não chegou a rodar |

O script não entrou no repositório porque depende do Docker. **Não verificado:** o
limite atrás do nginx real, testado só simulando o cabeçalho `X-Forwarded-For`.

## O que a auditoria errou

Conferido em 2026-11-10, ao corrigir, buscando cada nome na árvore inteira:

- **15.** `curriculum-v3` não está fora de rota. O `LessonCatalogService` chama
  `CurriculumMigrationService.bootstrap()`, a rota `licao-hibrida` usa `hybrid-l1`, que
  importa `l1-body-reference` e `l2-slicing-space`, e o console de desenvolvimento lê as
  métricas da lição híbrida. Só o `ProgressScreen` era órfão, e saiu em `6b13074`.
- **14.** `paywall/` não era uma pasta solta. `PaywallService`, `PaywallPlan` e
  `PaywallOfferCard` não têm chamador, mas o `UpgradeInterestService` é lido pela tela
  de telemetria e pelo `AppStoreOpsService`, e os eventos `paywall_*`, a bandeira
  `ENABLE_PAYWALL`, os scripts de war room e o inventário do armazenamento dependiam do
  módulo. Saiu tudo junto em `41c58d0`.

## Abertos

Detalhe na [FILA](../FILA.md), item "o que sobrou da auditoria de 2026-11-10".

- **14, resto.** `radiant-app/.env.example` ainda lista `EXPO_PUBLIC_ENABLE_PAYWALL`,
  fora do `writePolicy`.
- **19, resto.** `radiant-app/hooks/` e `constants/theme.ts` só serviam aos componentes
  apagados, mas estão fora do `writePolicy`.
- **20, resto.** A tabela `user_profiles`, que nada lê: mudança de banco, decisão do
  dono.

**Fora do escopo que o Loop deixa alterar:** `radiant-api/.env.example` ainda diz
`EXPOSE_PASSWORD_RESET_TOKEN=true`. Não tem mais efeito em produção, mas engana quem lê.

**Precisa do dono:** nada envia e-mail. Com o token escondido em produção, a
redefinição de senha não se completa quando a API voltar.

## Não lido

O pipeline em Python, os outros validadores de `scripts/content`, o sistema de
checkpoints que está desligado em produção, a sincronização com o iCloud
(`CloudKitPrivateAdapter`, `startupRestore`), a tela de assinatura, os scripts de
deploy, se o Sentry grava senhas no corpo dos pedidos e o `.env` de produção.
