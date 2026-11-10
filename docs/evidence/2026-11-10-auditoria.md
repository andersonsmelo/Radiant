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

Cada correção teve um teste que falhou antes e passou depois, menos o SQL dos achados
5 e 11, que só existe contra um banco.

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

## Abertos

Detalhe e correção sugerida na [FILA](../FILA.md), item "o que sobrou da auditoria de
2026-11-10".

- **12.** Violações do banco viram 500: cadastro duplicado e aula ainda não cadastrada
  no servidor.
- **13.** A sincronização aceita números absurdos (5 acertos em 3 questões).
- **14.** Código de assinatura antigo sem uso (`paywall/`, cerca de 308 linhas).
- **15.** Telas fora de qualquer rota (`curriculum-v3`, `ProgressScreen`, cerca de 2.700
  linhas).
- **16.** Aula malformada derruba o gerador sem dizer qual arquivo.
- **17.** O CI do app não roda quando só o pipeline de conteúdo muda.
- **18.** A regra `safety` ⇔ `criticalSafety` do guia de autoria não é checada.
- **19.** Sobras do modelo do Expo e o `expo-blur`, sem uso.
- **20.** Código morto na API e exceções velhas no contrato de estilo.

**Fora do escopo que o Loop deixa alterar:** `radiant-api/.env.example` ainda diz
`EXPOSE_PASSWORD_RESET_TOKEN=true`. Não tem mais efeito em produção, mas engana quem lê.

**Precisa do dono:** nada envia e-mail. Com o token escondido em produção, a
redefinição de senha não se completa quando a API voltar.

## Não lido

O pipeline em Python, os outros validadores de `scripts/content`, o sistema de
checkpoints que está desligado em produção, a sincronização com o iCloud
(`CloudKitPrivateAdapter`, `startupRestore`), a tela de assinatura, os scripts de
deploy, se o Sentry grava senhas no corpo dos pedidos e o `.env` de produção.
