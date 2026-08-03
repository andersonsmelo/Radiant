# ADR — Apresentação de primeiro uso com o mascote Pixel (2026-08-02)

**Status:** aceita
**Decisor:** Anderson (proprietário do projeto)
**Fecha:** a confirmação que a **B6** do
[roadmap de lançamento](../plans/2026-07-27-radiant-launch-roadmap.md) pediu
explicitamente ao dono em 2026-07-27 e que nunca havia sido registrada
**Não altera:** a Decisão 1 da [`ADR-2026-07-31`](ADR-2026-07-31-conta-e-premium.md)
— a v1.3 continua sem conta, e esta apresentação não pede cadastro nem login

## Contexto

A B6 investigou "onboarding em instalação limpa" e concluiu corretamente que não
havia defeito de runtime: o que existia era **código morto**. O wizard
`src/app/onboarding/*` era protótipo inacabado, em inglês, com especialidades
falsas, que não persistia as escolhas e ao qual **nenhuma tela navegava**. Ele foi
removido, e essa remoção continua certa.

A B6 então recomendou "manter o onboarding frictionless da Learning Road na v1.3
(sem wizard)" e **pediu confirmação do dono**. Essa confirmação nunca virou
documento. O pedido ficou pendente até 2026-08-02.

## A distinção que a B6 não separou

A recomendação da B6 tratou "wizard" e "apresentação" como a mesma coisa. São
categorias diferentes, e a diferença é o que esta decisão usa:

| | Wizard de setup (removido, e a remoção segue valendo) | Apresentação de primeiro uso (esta decisão) |
| --- | --- | --- |
| O que faz | **coleta** preferências do usuário | **explica** o que o produto é |
| Persistência | precisa persistir escolhas, e não persistia | nada além de "já vi isto" |
| Se for pulado | o usuário perde configuração | o usuário perde só a explicação |
| Custo de manutenção | catálogo, especialidades, validação | três telas de texto |

O defeito que a B6 encontrou era específico do primeiro tipo. Nada na
investigação dela mediu se o segundo tipo era necessário — a pergunta não foi
feita, porque o artefato encontrado era um wizard.

## Decisão

A primeira abertura do app mostra uma apresentação de três telas, narrada pelo
mascote **Pixel**, antes da Learning Road. Ela é **pulável** em qualquer tela.

O critério de sucesso escolhido pelo dono é **compreensão**: a pessoa sai sabendo
o que o Radiant é e o que ganha usando. Não é comportamental — a apresentação não
existe para empurrar ninguém à primeira lição.

Parâmetros fixados junto com a decisão:

- **Pulável**, com controle discreto no visual e alvo de toque de 44pt. Atrito no
  primeiro uso é onde o funil de app educacional se perde, ponto que a
  [`ADR-2026-07-31`](ADR-2026-07-31-conta-e-premium.md) já registrava.
- **Instalações existentes veem uma vez.** O gatilho é a **ausência** da chave
  `@radiant/first_run_v1`; instalações antigas não a têm, então veem, sem nenhum
  código de migração. Isso foi escolhido para que os testadores do closed test
  pudessem opinar sobre o próprio onboarding em validação.
- **Sem animação.** A troca de tela é troca de estado. O projeto verifica Reduce
  Motion por estabilidade de quadros, e uma tela que sempre anima quebraria essa
  verificação.
- **O disclaimer educacional entra aqui** — "não substitui avaliação, diagnóstico
  ou conduta médica profissional". O roadmap exigia o disclaimer no onboarding e
  nos metadados das lojas; ele não existia em nenhuma tela do app até agora.
- A cópia repete o posicionamento já travado em
  [`textos-loja-pt-BR.md`](../store/textos-loja-pt-BR.md). Quando ficha e app
  descrevem o mesmo binário com o mesmo vocabulário, a revisão de loja não
  encontra divergência para apontar.

## Gatilho de reabertura declarado

> A frase **"Funciona offline, sem conta"** da terceira tela vale **enquanto o
> app não criar contas**. Quando o elo de conta da v1.4 entrar, esta cópia se
> torna falsa e precisa ser reescrita no mesmo run que ligar a conta.

Este campo existe por causa da regra de método fixada pela
[`ADR-2026-08-01`](ADR-2026-08-01-modelo-de-entitlement-premium.md): premissa
citada em prosa não protege ninguém, porque é lida como justificativa enquanto a
conclusão ganha autoridade pela idade do documento. A condição vira campo próprio
e verificável.

## Uma premissa do projeto que estava errada, e a correção

O design foi escrito afirmando que o card Day-0 do `OnboardingService` daria as
boas-vindas uma segunda vez na home, e por isso a saída da apresentação chama
`OnboardingService.dismissIntro()`.

**Medido em 2026-08-02, e a afirmação não se sustenta:**

| Fato | Medição |
| --- | --- |
| `ENABLE_LEARNING_ROAD` default | `true` (`radiant-app/src/config.ts:36`) |
| nos perfis do `eas.json` | `"true"` nos **quatro** perfis |
| `HomeRoute` | renderiza `JourneyHomeScreen` sempre que a flag é true |
| consumidor único do `IntroCard` Day-0 | a `HomeScreen` clássica |

Ou seja: a `HomeScreen` clássica **não renderiza em nenhum build distribuído**, e
o card Day-0 **nunca aparece**. A duplicação que o design temia não existe hoje.

A chamada `dismissIntro()` **permanece**, mas por outra razão, e o motivo correto
é este: ela é seguro contra a flag ser desligada. Se `ENABLE_LEARNING_ROAD` voltar
a `false`, a `HomeScreen` clássica volta a renderizar e o card Day-0 voltaria a
aparecer para quem acabou de ver a apresentação. A chamada custa uma escrita e
elimina esse caso.

**Consequência a corrigir no trabalho já entregue:** a asserção
`assertNotVisible: 'Bem-vindo ao Radiant'` prevista para o flow E2E do primeiro
uso passaria **vacuamente** — o texto não está na tela porque a tela inteira não
existe, não porque a apresentação o dispensou. Ela deve sair ou vir acompanhada
de um caso que force `ENABLE_LEARNING_ROAD=false`. Uma asserção que passa pelo
motivo errado é pior que nenhuma: ela cria confiança sem cobertura.

O registro de aprendizado do cérebro que dizia que `ENABLE_LEARNING_ROAD` tinha
default `false` e não era definida nos perfis era verdadeiro em 2026-07-27 e
envelheceu sem sinalizar. Precisa de triagem.

## Consequências

- A abertura do app passa a ser: splash → bootstrap → beta gate → **apresentação**
  → Learning Road. O beta gate vem antes porque é controle de acesso.
- Os quatro flows Maestro existentes rodam `clearState: true` e passam a atravessar
  a apresentação. `boot-to-home.yaml` afirma no próprio nome que a instalação limpa
  vai **direto** para a home, e essa afirmação deixou de ser verdadeira sobre o
  binário.
- O `OnboardingService` (coach de 7 dias) **não** foi absorvido: continua sendo um
  domínio separado, com ciclo de vida diferente. A B6 recomendava removê-lo junto
  com a `HomeScreen` clássica; essa parte da recomendação segue em aberto e não é
  decidida aqui.
- A apresentação pode ser revista depois, por um controle na aba de Progresso. Rever
  **não** reescreve o estado de primeiro uso, para não corromper a telemetria que
  mede em qual tela as pessoas saem.

## Alternativa descartada

**Modal sobre a Learning Road, sem gate.** Menor superfície de código e o conteúdo
real fica visível atrás. Descartada porque compromete o critério escolhido: quem vê
um modal fecha o modal, e "entendeu a proposta" é a primeira coisa a se perder.

**Rota `src/app/welcome.tsx` com redirect.** Descartada porque abre janela de flash
da home antes do redirect e, principalmente, porque foi exatamente a forma do wizard
que a B6 removeu — uma rota à qual nenhuma tela navegava. Repetir a forma repete o
risco.

## Aprendizado de método

Uma investigação encontra o artefato que existe, e a recomendação que ela produz
herda o formato desse artefato. A B6 encontrou um wizard morto e recomendou "sem
wizard" — o que é correto sobre wizards e silencioso sobre a categoria vizinha que
ninguém tinha construído. Ao herdar uma recomendação, verificar se a categoria que
ela nega é a mesma que você pretende propor: "não construir X" raramente significa
"não construir nada nessa área", mas é assim que envelhece quando a distinção não
está escrita.
