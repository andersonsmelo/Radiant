# Configuração aberta pela engrenagem do Perfil — 2026-10-16

Escopo: o item 32 da FILA, com as decisões do dono registradas no
[ADR](../adr/ADR-2026-10-16-configuracao-no-perfil.md). Branch
`codex/radiant-study-improvements`. Sem publicação nem integração à `main`.

## Inventário antes da mudança

Lido em `ProfileScreen.tsx` e `ProgressScreen.tsx`, e conferido no simulador:

| Bloco | Destino |
| --- | --- |
| Identidade (nome, sequência, XP) | Perfil |
| Missões do dia, com o cartão de vidas | Perfil |
| Assinatura | Configuração |
| Backup no iCloud | Configuração |
| Sons e vibração | Configuração |
| Progresso (sequência, precisão, números, tópicos) | Perfil |
| Conta e sincronização (só com sync remoto) | Configuração |
| Ajuda e informações, "Rever apresentação" | Configuração |
| Console de desenvolvimento (só em desenvolvimento) | Configuração |

Consumidores conferidos antes de abrir o run: nenhum roteiro Maestro toca os
cartões movidos. `route-tree-purity` e `tab-bar-clearance` não se aplicam a uma
tela empilhada fora das abas. O QA visual estrito exige tokens em arquivo novo.

## Testes

Vermelhos na primeira execução, pelo motivo previsto: os módulos
`SettingsScreen` e `AccountSyncCard` ainda não existiam, a engrenagem não
existia, o Perfil ainda lia assinatura, backup e preferências, e o Progresso
ainda mostrava conta, ajuda e apresentação.

Os testes de conta (login, reset e ausência em produção) foram de
`ProgressScreen.flow.test.tsx` para `AccountSyncCard.test.tsx`. Os de
assinatura, backup e porta do console foram do teste do Perfil para
`SettingsScreen.flow.test.tsx`.

Injeções, cada uma derrubando só a sua guarda, com verde ao restaurar:

- Configuração sem o cartão de conta → "reúne assinatura, backup…";
- porta do console sem `SHOW_DEV_TOOLS` → "não existe no build do aluno";
- "Perfil" empilhando outra rota em vez de voltar → "chama-se Configuração e
  volta ao Perfil";
- ajuda sem o rodapé "Rever apresentação" → "Rever apresentação abre a
  apresentação";
- cartão de conta sem o gate de produção → "não renderiza nenhum controle de
  conta…";
- engrenagem desenhada sem quem abra a tela → "sem quem abra a tela, não
  desenha uma engrenagem inerte";
- sons e vibração de volta ao Perfil → "não mostra assinatura, backup, sons e
  vibração…". A primeira tentativa dessa injeção quebrou a suíte inteira por
  falta de import, e não pela guarda. Ela foi refeita com o import, e só a
  guarda caiu.

As suítes de `src/features/settings`, `progress` e `profile` passaram com
**169/169**. Typecheck sem erros. Lint sem erros, com avisos de ordem de import
no teste novo, no mesmo padrão do teste do Perfil. O QA visual estrito passou
com 0 regressões.

## No simulador

iPhone 17 `0A1B5AAA-…`, iOS 26.5, binário 1.4.0 (3), Metro no perfil V2:

- a engrenagem aparece no canto do cabeçalho do Perfil;
- tocada, abre "Configuração" com "‹ Perfil", assinatura, backup, sons e
  vibração, ajuda com "Rever apresentação" e a porta do console. Não há cartão
  de conta, porque o sync está desligado nesse perfil;
- "‹ Perfil" volta, e o fim da rolagem do Perfil é o cartão de tópicos do
  Progresso, sem nenhum cartão de configuração.

## Limites

- Não visto na tela: o cartão de conta com o sync remoto ligado (só os testes
  o cobrem), AX5 e o SE de viewport curta.
- Já existia e continua igual: as setas "↗" da ajuda aparecem como emoji
  dentro de uma caixa no simulador.
- O gate deste run é o `loop validate` registrado na proveniência do commit.
