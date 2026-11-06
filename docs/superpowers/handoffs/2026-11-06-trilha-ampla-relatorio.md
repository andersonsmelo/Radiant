# Relatório — trilha ampla rtg-2026 e engajamento

**Período:** de 2026-11-05, 19:16, a 2026-11-06, 10:00 (America/Bahia). **Executor:**
Claude (Fable 5.1), com cerca de quarenta subagentes. **Decisor:** Anderson Melo, pela
[ADR da delegação](../../adr/ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla.md).
O estado vivo é o [`docs/STATUS.md`](../../STATUS.md).

## Pedido

Destravar o app e entregar, até o dia seguinte, uma trilha ampla de aulas pela ementa
do tecnólogo em radiologia, com cara de produto profissional (referência: Duolingo),
com personagens, diálogo, sons e interações, a partir de fontes gratuitas, com tudo
documentado.

## O que foi encontrado

A loja e a `main` tinham a 1.4.0 com 18 aulas antigas. A PR #66 tinha o redesenho
Medalhão. A branch de conteúdo tinha retirado as aulas antigas e ficado com cinco
aulas-piloto, nenhuma ativa, à espera de revisor independente, aceites por hash e
decisões do dono. Já existiam o mapa curricular de 84 + 48 aulas, o Pixel vetorial,
seis sons e as animações, que a aula ao vivo não usava.

## O que foi entregue

Na branch `claude/conteudo-reinicio-tecnologo`, PR em rascunho
[#69](https://github.com/andersonsmelo/Radiant/pull/69). Nada está na `main` nem na loja.

| Commit | Conteúdo |
| --- | --- |
| `eaa4345` | ADR da delegação, plano em cinco frentes e guia de autoria |
| `1e8725f` | Contrato amplo, verificador, gerador, experiência da aula e M01 a M07 |
| `a85c13f` | M08 a M14, metas, recuperação na revisão e documentos de passagem |
| `2bf480f` | Conserto do teste que reprovava o CI; registro da PR |
| `500889e` | Autorização do dono para imagens de acervos abertos e o procedimento |

- **Conteúdo:** 14 unidades (M01 a M14), 84 aulas, 420 interações, 168 itens de
  conferência e 168 de recuperação. Cada unidade foi escrita por um agente, com os
  fatos conferidos em fontes gratuitas na web, e revista por outro agente. As
  revisões corrigiram 165 achados (de 8 a 16 por unidade); os pareceres estão em
  [`evidence/2026-11-06-rtg-2026-revisao/`](../../evidence/2026-11-06-rtg-2026-revisao/README.md).
- **Motor:** aula como dado, verificador de forma, gerador de lotes com conferência no
  CI e a extensão `wide` do contrato editorial.
- **Aula:** cena de diálogo com elenco (Pixel, Profa. Lia, Caio, Duda, paciente),
  pontos-chave, pista, cinco interações de quatro tipos, retorno animado, combo, aviso
  de vida, confete e três sons sintetizados.
- **Metas:** níveis por XP, três missões por dia, proteção de sequência, celebração
  de unidade e recuperação na revisão depois de conferência reprovada.
- **Defeitos consertados:** a sequência de dias usava a data em UTC e nunca passava de
  1 no fuso do Brasil; na associação, a resposta certa era sempre o primeiro botão; o
  teste do inventário estourava o buffer com 14 unidades; o teste do leitor de
  conceitos reprovava no CI desde a retirada de 2026-11-02.
- **Documentação:** ADR com dois registros de decisão, plano, guia de autoria com o
  brief do revisor, prompt de continuidade, STATUS, FILA (item 68), arquitetura, fluxo
  do aluno, roadmap, lições no `AGENTS.md` e cinco evidências.
- **Cérebro:** quatro registros validados pelo canal de memória dos runs (delegação,
  motor, núcleo e autorização das imagens).

## Como foi verificado

- `EXPO_NO_DOTENV=1 npm run quality`, Node 20: 233 suítes e 3053 testes, exit 0.
- `loop validate`: 15 de 15 em cada um dos runs de escrita, todos fechados.
- CI da PR #69: `content` e `quality` verdes no commit `2bf480f`.
- Simulador iOS `E262D4C1`, build Debug: trilha nova, cena de diálogo, conceito,
  pergunta e retorno de erro com perda de vida
  ([capturas](../../evidence/2026-11-06-trilha-ampla-simulador/README.md)).

## O que não foi feito ou não foi verificado

- Os seis aprofundamentos (48 aulas): nenhum foi começado.
- No simulador: fim da aula e resumo, confete, combo, sons, conferência, metas e
  missões. Nenhum som foi ouvido nem medido pelo log.
- Imagens: autorizadas pelo dono em 2026-11-06, nenhuma baixada.
- **Nenhuma pessoa da área revisou o conteúdo.** A revisão é por IA.
- Texto ampliado, VoiceOver, TalkBack, Android, aparelho físico, build de Release,
  tamanho do bundle e tempo de abertura da Estude com 14 trilhas.
- Build, envio à loja e merge: são do dono.

## Custos e tropeços

- A janela de uso de 5 horas estourou três vezes; o trabalho parou cerca de sete
  horas no total à espera da renovação. A partir da segunda vez, um temporizador
  local retomou o trabalho sozinho.
- Três regras do app que o verificador de autoria não conhecia obrigaram a corrigir
  unidades já aprovadas (posições de resposta, maiúsculas e palavras reservadas).
- Dois autores escreveram o mesmo fato invertido sobre pouco mAs; os dois revisores
  pegaram.

## Para continuar

Comece pelo [prompt de continuidade](2026-11-06-trilha-ampla-prompt-de-continuidade.md).
Ordem: os seis aprofundamentos, a prova completa no simulador, as imagens pelo
procedimento registrado e, só então, tirar a PR do rascunho.
