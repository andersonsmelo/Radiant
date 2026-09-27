# Evidência — VoiceOver no iPhone, checkpoint e HUD (2026-09-27)

**Item:** 3 da ordem de prioridade da [FILA](../../../docs/FILA.md): o VoiceOver
que saiu da H4 pela
[ADR de 2026-09-24](../../../docs/adr/ADR-2026-09-24-h4-fechamento-e-vida-no-checkpoint.md).

**Quem executou:** o dono, no iPhone, das 18:20 às 18:43 (−03). O relato é
dele, sobre o que o VoiceOver falou. O agente conduziu o roteiro, subiu o
Metro e conferiu no código o que cada anúncio devia ser.

**Aparelho e build:** o mesmo iPhone 16 com iOS 27.2, a build `development`
`c4eeeb44` e o JS de `feat/d4-decisoes-de-revisao` (`fdcb828`), servido pelo
Metro.

**Encerramento:** **o dono deu o item por concluído às 18:43, assumindo a
responsabilidade**, antes do reforço, da tela de aprovação e do HUD da trilha
lido pelo VoiceOver. O que não foi percorrido está listado abaixo.

## Ouvido

| Ponto | Resultado | O que o VoiceOver falou |
|---|---|---|
| Botão da trilha | ✅ | "Abrir checkpoint, botão, Abrir próximo passo da trilha ativa" |
| HUD da trilha, vidas cheias | ✅ | "5 de 5 vidas", num anúncio só |
| Regra do checkpoint | ✅ | "Responda as 2 questões. Para avançar, acerte todas." |
| Botão "Iniciar checkpoint" | ✅ | lido |
| HUD dentro do checkpoint | ✅ | "5 de 5 vidas" e, depois do erro, "4 de 5 vidas", **sem número solto**. Cai a suspeita da H4 de leitura dupla |
| Ordem da questão | ✅ | o enunciado vem antes das alternativas |
| Alternativa | ✅ | o texto, "botão", e a dica "selecionar e continua" |
| Alternativa escolhida | ✅ | "selecionado" e o texto da opção |
| Envio com erro | ✅ | anunciado sozinho: "Resposta incorreta" e a explicação |
| Envio com acerto | ✅ | "Resposta correta", a explicação e "Continuar" |
| **Perda de vida** | ❌ | **não é anunciada.** Depois do erro, nada é dito sobre a vida. Pelo código, o anúncio é só `Resposta incorreta. <explicação>` (`LessonFlowScreen.tsx:240-242`) |

## Achados

1. **A perda de vida não é anunciada ao leitor de tela.**
   - Quem enxerga vê o coração mudar no HUD, e quem usa VoiceOver só descobre
     indo aos corações.
   - O conserto candidato é incluir a vida no anúncio que já existe, por
     exemplo "Resposta incorreta. Você perdeu uma vida; restam 4." Um run,
     com teste vermelho antes.
2. **Também não há animação visual da perda de vida,** observação do dono. É
   decisão de design, e é dele.
3. **A revisão que ainda não está devida aparece como "Bloqueado".**
   - O dono esperava ter acesso a ela.
   - Pelo código, é a regra: um nó de revisão só abre quando fica devido pela
     repetição espaçada, e antes disso resolve para `locked`
     (`JourneyRecommendationService.ts:72-77`).
   - O rótulo é que engana: sugere um pré-requisito faltando, quando é só
     "ainda não chegou a hora". Conserto candidato: um rótulo como "Disponível
     amanhã". Mudar o que o app diz é decisão do dono.

## Não percorrido

- o reforço depois do erro, só com os gestos;
- a ordem de leitura da tela de aprovação;
- o HUD da trilha **em recarga** lido pelo VoiceOver. Na tela, às 18:43, ele
  mostrava "4 · +1 em 23 min";
- o foco depois de enviar, além do anúncio;
- o TalkBack no Android.
