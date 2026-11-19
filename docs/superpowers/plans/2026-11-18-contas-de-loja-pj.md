# Contas de loja da empresa — plano

> **Para quem executa:** este plano **não é executável por subagente**. As
> tarefas 1 a 5 são ações do dono em consoles e órgãos externos, com documentos
> e dados fiscais e bancários que o agente não preenche. O agente lê de volta o
> que foi salvo e executa a tarefa 6 num run do Loop. Marque os passos com
> `- [x]` e a data quando concluir.

**Objetivo:** o Radiant passa a ser vendido e faturado pela empresa do dono
(LTDA ou SLU, site `https://saudediagnostica.com`) na App Store e no Google Play.

**Abordagem:** converter as duas contas atuais no lugar, sem transferir o app.
Primeiro o Google, que é autoatendimento; depois a Apple, por pedido ao suporte.

**Desenho:** [2026-11-18-contas-de-loja-pj-design.md](../specs/2026-11-18-contas-de-loja-pj-design.md).
**Decisão:** [ADR de 2026-11-18](../../adr/ADR-2026-11-18-contas-de-loja-da-empresa.md).

## Restrições globais

- Não trocar `com.ascendcreative.radiant` nem os produtos
  `com.andersonmelo.radiant.ilimitado.mensal` e `.anual`.
- No Google, a troca para Organização **não volta atrás**.
- No Google, esperar **72 h** depois da troca antes de qualquer envio novo.
- Na Apple, pedir a conversão só numa janela **sem envio previsto**.
- CNPJ, D-U-N-S, banco, documentos e formulários fiscais são digitados pelo
  dono. O agente não recebe esses valores, nem por mensagem.
- Toda mudança de estado vai para `docs/STATUS.md` com a data da medição.

## Foco de revisão

Os cinco modos de falha mais prováveis que nenhuma ação acima pega sozinha:

1. **Nome da empresa diferente entre CNPJ, D-U-N-S e cadastro da loja.** A Apple
   recusa ou atrasa. Conferido na tarefa 1, passo 3.
2. **Contrato de apps pagos da Apple sem novo aceite, ou banco sem cadastro,
   depois da conversão.** A receita das assinaturas fica retida. Conferido na
   tarefa 5, passo 2.
3. **A exigência dos 12 testadores continua depois da conversão no Play.**
   Nenhuma fonte oficial garante que a conta convertida fica isenta. Conferido
   na tarefa 3, passo 6.
4. **O assinante atual perde o acesso ou o backup no iCloud some.** Não deveria,
   porque o Team ID se mantém, mas é o pior resultado possível. Conferido na
   tarefa 5, passo 4.
5. **A política publicada continua com o controlador antigo.** Conferido na
   tarefa 6, passo 5.

---

### Tarefa 1: D-U-N-S da empresa

**Quem:** dono.
**Artefatos:** número D-U-N-S da empresa (fora do repositório).
**Interfaces:**
- Produz: o número D-U-N-S e a razão social **exatamente** como a Dun &
  Bradstreet a registrou, usados nas tarefas 3 e 4.

- [ ] **Passo 1:** consultar na ferramenta de busca da Apple
  (`developer.apple.com/enroll/duns-lookup`) se a empresa já tem número.
- [ ] **Passo 2:** se não tiver, pedir pela mesma ferramenta. É gratuito e pode
  levar de dias a semanas. Anotar a data do pedido no `STATUS.md`.
- [ ] **Passo 3:** conferir que a razão social e o endereço do D-U-N-S são
  idênticos aos do cartão do CNPJ, inclusive "LTDA" e acentos. Divergência se
  corrige com a Dun & Bradstreet **antes** das tarefas 3 e 4.

**Pronto quando:** a busca da Apple devolve a empresa com o número.

### Tarefa 2: pré-requisitos da empresa

**Quem:** dono.
**Artefatos:** caixa de e-mail no domínio `saudediagnostica.com`, conta bancária
no CNPJ, orientação do contador (fora do repositório).
**Interfaces:**
- Produz: o e-mail de contato da empresa, que a tarefa 6 escreve nos textos
  públicos.

- [ ] **Passo 1:** criar ou escolher uma caixa no domínio da empresa (por
  exemplo, `contato@` ou `privacidade@`). A Apple exige que o e-mail do pedido
  seja do domínio do site.
- [ ] **Passo 2:** ter a conta bancária da empresa pronta para receber em moeda
  estrangeira.
- [ ] **Passo 3:** combinar com o contador como lançar a receita das lojas, que
  chega do exterior, e quais formulários fiscais preencher na Apple (os de
  empresa estrangeira, no lugar dos de pessoa física).

**Pronto quando:** os três itens existem. Diga ao agente qual e-mail usar.

### Tarefa 3: converter a conta do Google Play

**Quem:** dono no console; agente confere lendo a página.
**Artefatos:** conta do Play do tipo Organização e perfil de pagamentos novo da
empresa.
**Interfaces:**
- Consome: D-U-N-S e razão social (tarefa 1).
- Produz: data da troca e o estado da exigência de teste fechado, que vão para
  o `STATUS.md`.

- [ ] **Passo 1:** confirmar na página inicial do Play Console que não há aviso
  de verificação pendente. Com aviso, a troca não aparece.
- [ ] **Passo 2:** em **Conta de desenvolvedor → Sobre você**, informar e
  verificar o site `https://saudediagnostica.com`.
- [ ] **Passo 3:** clicar em **Alterar tipo de conta** e criar um perfil de
  pagamentos **novo**, de organização, com o D-U-N-S. O perfil pessoal não
  serve.
- [ ] **Passo 4:** preencher tipo, porte e telefone da empresa, concluir as
  verificações pedidas e confirmar. A troca não volta atrás.
- [ ] **Passo 5:** esperar 72 h sem enviar nada.
- [ ] **Passo 6:** abrir o painel do app e ler se **Solicitar acesso à produção**
  ainda exige o teste fechado. Registrar o que a tela diz, sem supor.
- [ ] **Passo 7:** declarar o **status de comerciante** com os dados da empresa.
  O prazo é fevereiro de 2027; sem a declaração, os apps saem do ar.

**Pronto quando:** **Sobre você** mostra a conta como Organização e o painel foi
lido no passo 6.

### Tarefa 4: pedir a conversão na Apple

**Quem:** dono.
**Artefatos:** caso aberto no Apple Developer Support e, depois, o pedido de
conversão.
**Interfaces:**
- Consome: D-U-N-S e razão social (tarefa 1), e-mail no domínio (tarefa 2).
- Produz: as respostas por escrito do suporte e a data do pedido, que vão para
  o `STATUS.md`.

- [ ] **Passo 1:** em `developer.apple.com/contact`, perguntar por escrito, antes
  de pedir qualquer coisa:
  1. se o Team ID atual se mantém depois da conversão;
  2. se o envio de builds, TestFlight e revisão fica bloqueado durante a análise;
  3. qual é o prazo típico.
- [ ] **Passo 2:** com as respostas em mãos, confirmar que não há envio previsto
  para as semanas seguintes. Durante um bloqueio, só correção de JavaScript
  pode sair, pelo EAS Update no canal `production`, que nunca foi usado em
  produção e precisaria ser testado antes.
- [ ] **Passo 3:** pedir a conversão pelo mesmo canal e enviar os documentos que
  a Apple pedir. Anotar a data no `STATUS.md`.

**Pronto quando:** a Apple confirma a conversão por e-mail e a página
**Membership** mostra a empresa.

### Tarefa 5: depois da conversão da Apple

**Quem:** dono no App Store Connect; agente confere pela consulta pública.
**Artefatos:** contrato de apps pagos aceito pela empresa, banco e formulários
fiscais da empresa, status de comerciante para a União Europeia.
**Interfaces:**
- Consome: conta convertida (tarefa 4), banco e orientação fiscal (tarefa 2).
- Produz: o vendedor exibido na loja, que encerra o objetivo do lado Apple.

- [ ] **Passo 1:** conferir em **Membership** que o Team ID é o mesmo de antes.
- [ ] **Passo 2:** em **Negócios**, aceitar o contrato de apps pagos em nome da
  empresa e cadastrar banco e formulários fiscais. Conferir que o contrato
  aparece como **Ativo**.
- [ ] **Passo 3:** declarar o status de comerciante para a União Europeia com os
  dados da empresa.
- [ ] **Passo 4:** no iPhone com assinatura, abrir o app e conferir que o acesso
  ilimitado e o backup no iCloud continuam.
- [ ] **Passo 5 (agente):** conferir o vendedor na loja pública:

```bash
curl -s 'https://itunes.apple.com/lookup?id=6797078156&country=br' | python3 -c "import json,sys;r=json.load(sys.stdin)['results'][0];print(r['sellerName'], '|', r['artistName'])"
```

Esperado: o nome da empresa nos dois campos. A Apple pode levar dias para
atualizar a página.

**Pronto quando:** a consulta mostra a empresa e o contrato está Ativo.

### Tarefa 6: textos e registros do repositório

**Quem:** agente, num run do Loop, depois que o dono disser o e-mail (tarefa 2)
e a razão social (tarefa 1).
**Artefatos:** os arquivos que a enumeração do passo 1 encontrar,
`docs/STATUS.md`, `docs/archive/STATUS_historico.md`, `docs/FILA.md`.
**Interfaces:**
- Consome: razão social, CNPJ (só se o dono quiser publicá-lo) e e-mail da
  empresa.

- [ ] **Passo 1:** enumerar todo texto que nomeia a pessoa física como
  responsável, vendedora ou contato. Fazer duas buscas independentes: uma no
  repositório (`Anderson Melo`, `pessoa física`, o e-mail pessoal) e outra nas
  páginas publicadas (`curl` em `saudediagnostica.com/radiant/privacidade` e
  `/radiant/suporte`). Medido em 2026-11-18, a primeira acha
  `docs/legal/politica-de-privacidade.html`, `docs/legal/pagina-de-suporte.html`
  e `docs/legal/PROMPT_PUBLICACAO_PAGINAS.md`. Confira também os `.md` de
  `docs/legal/` e `docs/store/textos-loja-pt-BR.md`. Os dois resultados
  precisam bater; a diferença é um texto publicado que o repositório não tem.
- [ ] **Passo 2:** abrir o run declarando a lista inteira do passo 1, mais
  `docs/STATUS.md`, `docs/archive/STATUS_historico.md` e `docs/FILA.md`.
- [ ] **Passo 3:** trocar o controlador e o contato pela empresa e atualizar a
  data de "Última atualização" da política.
- [ ] **Passo 4:** atualizar o `STATUS.md` com o tipo das duas contas e as datas,
  e fechar o item 9 da `FILA.md`.
- [ ] **Passo 5:** depois que o dono publicar as páginas, conferir:

```bash
curl -s https://saudediagnostica.com/radiant/privacidade | grep -c -i "pessoa física"
```

Esperado: `0`, e o nome da empresa presente na página.

**Pronto quando:** `loop validate` passa, o run fecha e a página publicada cita
a empresa.
