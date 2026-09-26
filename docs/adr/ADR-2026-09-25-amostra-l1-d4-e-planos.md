# ADR — Amostra da L1 corrigida antes de aprovar; D4 fechada como superada; planos com o mensal primeiro; preço acompanha a loja (2026-09-25)

**Status:** aceita  
**Decisor:** Anderson Melo (dono do projeto), em 2026-09-25, entre 21:40 e
22:00, na sessão local. As decisões foram tomadas uma a uma, depois de o agente
explicar as implicações de cada uma a partir do projeto. Em todas, o dono
escolheu a opção que o agente recomendou.  
**Registro:** a mesma sessão registrou as decisões por um run do Loop. As
razões são a leitura do agente apresentada ao dono, e não palavras dele.  
**Escopo:** currículo V3 (piloto da lição híbrida na L1) · gate editorial D4 ·
assinatura (Radiant Ilimitado)

## 1. Amostra do piloto da L1: corrigir duas variantes, e só então aprovar

**Contexto.** A lição híbrida da L1 gera 20 itens por regra. A aprovação da
amostra (`l1TemplateApproval.test.ts.snap`) grava a impressão digital em
`L1_TEMPLATE_APPROVAL`, e com isso a tela deixa de mostrar "Prévia". A sessão
local reconferiu os gabaritos em 2026-09-25 e levou ao dono quatro pontos.

**Decisão:**
- **(a) O item 18 duplica o item 1: corrigir a regra.** O `h10-lat-ventral-v`
  sai como posição anatômica vista de frente, com a mesma pergunta, as mesmas
  opções e o mesmo gabarito do `h01`. Só o formato difere. A variante do
  decúbito ventral tem de cair numa vista do ventral. O conserto vem com um
  teste que falha pela duplicata.
- **(b) Decúbito dorsal "vista por trás": trocar por vistas reais.** As
  variantes `h05-v`, `h09-v` e `h11-v` mostram o corpo visto de baixo da mesa,
  que ninguém usa na rotina. Elas passam a usar vistas que existem, na mesma
  correção do (a). Só renomear para "vista posterior" não resolveria, porque o
  desenho continuaria visto por baixo.
- **(c) As descrições do tórax adaptadas** ("Painel com contorno contínuo")
  ficam. Elas são necessárias porque a ordem das opções é sorteada.
- **(d) O leitor de tela entrega parte da resposta nas relações:** isso é
  aceito no piloto. Fica **registrado como pendência antes de a lição chegar
  ao aluno**, como o boneco provisório.
- **A aprovação vale para a amostra corrigida.** O agente corrige, mostra ao
  dono só os itens que mudaram, o dono confirma, e só então o agente grava a
  aprovação.

## 2. D4: fechada como superada

**Contexto.**
- A D4 era o "gate editorial" P0 que bloqueava a produção. Na prática, virou a
  classificação dos 105 trechos de uma apostila de curso técnico: 104
  `approved` e 1 `needs-review`, a capa.
- Essa classificação **não alimenta o app**, cujo catálogo sai de
  `ai-bundles.json` (96 de 96 `approved`), **nem o V3**.
- O conteúdo que ela deveria liberar já está na App Store desde a 1.3.1.
- O que preocupa no catálogo que está no ar foi achado pela auditoria de
  2026-08-27 e está registrado com critérios. Pela
  [ADR de 2026-08-27](ADR-2026-08-27-curriculo-v3-trilha-continua.md), o
  currículo antigo não é corrigido lição a lição: a direção é o V3, com
  migração segura antes de retirar o antigo.

**Decisão:**
- **A D4 fecha como superada pelo V3 e pela auditoria de 2026-08-27.** Ela
  deixa de ser gate e sai do caminho crítico.
- **Arquivadas junto, sem execução:**
  - a D4-a, a representação da exclusão da capa;
  - a D4-c, o destino dos 4 excertos de radioterapia;
  - a regeneração de conceitos e bundles da cadeia desatualizada.

  Se o processo de classificação voltar a ser usado, para uma segunda fonte,
  essas questões se decidem lá.
- **O risco do conteúdo que está no ar continua** no item da auditoria de
  2026-08-27 e na migração para o V3.
- **Registrado como risco aberto:** não se sabe quem marcou os
  `ai-bundles.json` como `approved`, nem com que critério. O gerador escreve
  `pending`.

## 3. Ordem dos planos: o mensal primeiro

**Contexto.** O app mostra os planos na ordem em que
`Product.products(for:)` os devolve (`RadiantStoreKitModule.swift:65`), e a
Apple não garante essa ordem. Medido em 2026-09-24 e em 2026-09-25: a ordem
mudou de um dia para o outro.

**Decisão:**
- **O mensal primeiro, o anual depois,** numa ordem fixa no adaptador e
  travada por teste.
- Os dois continuam com o mesmo peso visual e **sem selo de "economize"**. Um
  selo seria texto novo prometendo algo ao aluno, e fica como decisão à parte.

**Razão apresentada:** menor compromisso primeiro, coerente com o tom sem
pressão da spec da 1.4 ("vidas ilimitadas — e só isso, escrito assim").

## 4. Preço de outra loja: consertar junto com a folha do "Gerenciar"

**Contexto.** No aparelho, em 2026-09-24, os preços carregados antes do login
na conta de sandbox ficaram em US$ 2,99 / US$ 22,99, enquanto a folha da Apple
cobrou R$ 19,90. O módulo Swift não observa a troca de loja: não há nenhuma
referência a `Storefront`. Ninguém é cobrado errado, mas a tela mostra um
preço diferente do cobrado.

**Decisão:**
- **O módulo passa a observar `Storefront.updates`,** e os preços são
  recarregados quando a loja muda.
- Entra **junto com a folha do "Gerenciar"**, no mesmo módulo, na mesma build
  `development` e na mesma ida ao aparelho
  ([ADR das 21:20](ADR-2026-09-25-storekit-gerenciar-ask-to-buy-e-cancelamento.md)).
- **No aparelho, conferir também** se só reabrir a tela já corrige o preço.
  Isso não foi medido.

## Consequências

- **O piloto da L1** passa a esperar uma correção do agente e a confirmação do
  dono sobre os itens alterados. Depois disso vêm a gravação da aprovação, a
  build de teste e o teste com 3 a 5 pessoas.
- **A D4 sai da FILA e do caminho crítico.** A fila perde três decisões do dono
  e um item do agente.
- **A folha do "Gerenciar" (19a) cresce:** passa a levar também o
  `Storefront.updates`. A ordem dos planos é só JavaScript e não depende de
  build.

## Alternativas descartadas

- **Amostra:** aprovar como está. Ficaria a duplicata do item mais fácil e um
  cenário irreal, que sujaria o teste com pessoas.
- **D4:** redefini-la como revisão clínica das 16 lições que estão no ar, o
  que exigiria um revisor de radiologia e entraria em tensão com a decisão de
  não corrigir o currículo antigo lição a lição. Ou mantê-la como está, P0 e
  sem critério de fechamento possível.
- **Planos:** o anual primeiro, que é o padrão de mercado para puxar receita.
- **Preço:** deixar registrado e não consertar. Adiado, o conserto pediria
  outra build nativa.
