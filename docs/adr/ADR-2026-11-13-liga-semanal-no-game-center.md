# ADR — Liga semanal no Game Center (frente F4 da 1.6)

**Data:** 13/11/2026, America/Bahia. **Estado:** aceita.
**Decisor:** Claude controlador (tech lead da 1.6), por delegação do dono
(Anderson Melo) em 13/11/2026, que pediu o ranking e delegou as decisões de
construção. A implementação é da sessão da frente F4.

## Contexto

O dono pediu, para a 1.6, um ranking semanal no estilo das ligas de apps de
idioma: o aluno ganha XP na semana, vê sua posição entre outros alunos reais e
tem um motivo honesto para voltar. O planejamento de conteúdo de 02/11
(`plans/2026-11-02-planejamento-conteudo-radiant.md`, seção 9) registrava que o
ranking público esperava validação; esse pedido é a validação.

Três fatos pesaram, todos medidos antes desta decisão:

- a API própria do projeto está fora do ar (HTTP 502 desde outubro de 2026) e
  não há deploy autorizado;
- o app não tem conta nem login em produção: o progresso mora no aparelho;
- competidor simulado ou falso está proibido. Sem dado real, a tela diz isso.

## Decisão

1. **O ranking é um placar recorrente do Game Center**, identificador
   `radiant.liga.semanal.xp`, do tipo "melhor pontuação", que começa toda
   segunda-feira às 00:00 UTC e dura 7 dias. O passo a passo do App Store
   Connect está no [runbook](../runbooks/2026-11-13-liga-game-center.md).
2. **O app envia o XP total da semana, não incrementos.** Como o placar guarda a
   melhor pontuação, reenviar o mesmo total não duplica nada, e a fila local de
   envio pode repetir à vontade. XP de uma semana já encerrada não é enviado,
   porque o GameKit o poria na ocorrência nova.
3. **Só XP ganho conta.** A soma vem de `GamificationService.onXpEarned`, que
   avisa aula concluída e XP manual (revisão e missão). Restaurar backup e zerar
   não avisam. A revisão já não paga XP por item repetido, assistido ou
   duplicado (`useReview.ts`), então ela não infla a liga.
4. **O app nunca decide o vencedor.** Posição, participantes e fim da semana vêm
   do Game Center. Do outro aluno aparece só o apelido do Game Center.
5. **Entrar no Game Center é opcional.** O app não mostra a tela de entrada por
   conta própria; o aluno a pede na tela da liga. Quem recusa, ou não tem Game
   Center, estuda igual.
6. **Kill switch `ENABLE_LEAGUE`, lido em build, padrão desligado.** O plugin
   `with-game-center` usa a mesma variável para pôr a permissão
   `com.apple.developer.game-center` no binário. Com a chave desligada, o app e
   o binário ficam como a `main`.
7. **Entrada pelo Perfil, aviso na Estude.** A barra tem duas abas por decisão
   de 21/08/2026 ("o que se faz e quem faz"); a liga entra como linha no Perfil,
   como as missões, e não como terceira aba. A Estude ganha um aviso curto: o
   resumo da semana encerrada, na primeira abertura depois da virada, ou
   "alguém passou você", no máximo uma vez por dia.
8. **O estado local (`@radiant:league_v1`) fica fora do backup de progresso.**
   O que importa já está no Game Center, e o serviço adota a pontuação de lá
   quando ela é maior que a local (reinstalação, outro aparelho). O backup do
   iOS leva a pasta inteira do AsyncStorage
   ([ADR de 2026-10-19](ADR-2026-10-19-recuperacao-local-backup-schema-e-reset.md));
   isso não atrapalha, porque a mesma regra corrige.

## Alternativas descartadas

- **API própria do Radiant.** Fora do ar desde outubro, sem deploy autorizado,
  e exigiria conta, login e um servidor para guardar identidade e pontuação de
  alunos, com obrigação de LGPD que hoje o app não tem.
- **Supabase (ou outro backend gerenciado).** Resolve o servidor, mas não a
  identidade: continuaria exigindo conta, política de dados nova e custo
  recorrente, e o ranking só teria sentido depois de existir uma base de contas.
- **Ranking local.** Sem outros alunos reais, só poderia comparar o aluno com
  ele mesmo ou com competidores inventados, e competidor falso está proibido.

## Limites desta versão

- **Só iOS.** O Android usa o `UnavailableLeagueAdapter` e mostra "Game Center
  indisponível". Uma liga no Android pediria o Play Games Services, fora desta
  frente.
- **Depende de o aluno ter Game Center** e aceitar entrar. Quem não tem não
  participa e não é cobrado por isso.
- **Sem ligas por divisão.** É um placar global (e o de amigos), sem promoção ou
  rebaixamento. Por isso a tela não mostra "zona de promoção": não seria verdade.
- **O dono precisa criar o placar** no App Store Connect antes de ligar a chave.
  Sem o placar, a tela mostra "A liga ainda não abriu".
- O aviso de ultrapassagem compara a posição atual com a última vista; quem
  entra na liga com mais XP também "passa" o aluno, e isso é verdade.
