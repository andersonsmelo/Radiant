# Trilha dobrada, fase A: base internacional (plano de execução)

> **Para agentes:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development
> para executar tarefa por tarefa. Os passos usam caixas (`- [ ]`).
> As tarefas 3 a 6 são de autoria de conteúdo, não de código: o campo **Artefatos**
> lista os arquivos, e a verificação é um comando com saída esperada.

**Objetivo:** tirar toda lei, norma e órgão brasileiro das 157 aulas da trilha
`rtg-2026` e das fontes, mantendo o fato técnico apoiado em fonte internacional, e
impedir a volta com o verificador.

**Arquitetura:** a régua nova varre o documento inteiro da unidade no fim de
`lintUnit` (unidade, fontes e aulas, menos identificador e endereço), para que campo
novo no formato nasça coberto. Os termos vivem
num módulo próprio. Autores em modelo menor reescrevem as unidades com o verificador
na mão; um revisor independente confere cada lote; o controlador reproduz os gates.

**Ferramentas:** Node 20 (`node --test`, scripts de conteúdo, app), Node 24 só para
`loop`, JSON de aula-fonte, gerador `build-rtg-batches.mjs`.

**Desenho:** [`docs/superpowers/specs/2026-11-18-trilha-dobrada-design.md`](../specs/2026-11-18-trilha-dobrada-design.md).
As fases B a E ganham plano próprio, escrito no começo de cada uma, porque dependem
do que a anterior fixar (os formatos da B definem como a C escreve).

## Restrições globais

- Nenhuma aula ou interação muda de `id`, `role` ou `criticalSafety`.
- Fato técnico não sai junto com a lei: limite de dose, blindagem, sinalização e
  monitoração continuam ensinados, com fonte internacional. Se nenhuma fonte aberta
  sustenta o fato, ele sai, pela regra 1.2 do guia, e a saída é listada na evidência.
- Fonte nova: `use: "factual-reference"`, `url` https, leitura gratuita na web.
  Documento pago não serve.
- O aluno é estudante em simulação supervisionada (regra 1.3 do guia, inalterada).
- Consentimento, sigilo e privacidade ficam como cuidado com o paciente, sem lei e
  sem código de ética.
- Texto em português do Brasil, nas réguas atuais do verificador.
- Subagente não roda `loop`. O controlador é dono do run e de todo commit.
- Um run do Loop por tarefa, aberto por `node scripts/loop/abrir.mjs` com a lista
  exata de arquivos montada em array; nenhuma edição antes de `STEP_STARTED`.
- Validação só com carga de 1 minuto abaixo de 5 e sem `ffmpeg` rodando.
- No máximo três subagentes de autoria por vez; medir o uso antes de cada lote.

## Foco da revisão

1. **Lei física barrada por engano.** "Lei do inverso do quadrado", "lei de Ohm" e
   "resolução espacial" precisam passar. Teste na tarefa 1.
2. **Fato de segurança que some com a norma.** Uma aula que citava o limite anual pela
   CNEN continua dizendo o limite, agora pela ICRP. Conferência na tarefa 2 (mapa) e
   no revisor de cada lote.
3. **Item de segurança enfraquecido.** Todo item com `criticalSafety: true` antes
   continua com `true` depois. Comando de comparação na tarefa 7.
4. **Posição da resposta correta.** Reescrever alternativas pode levar uma posição
   acima de 40% na unidade. O verificador já barra; o autor roda a cada aula.
5. **Fonte nova que não abre ou não sustenta o fato.** O revisor abre cada URL nova
   e acha o trecho. Tarefa 2 e revisão de cada lote.

---

### Tarefa 1: régua de referência nacional no verificador, e o guia

**Arquivos:**
- Criar: `scripts/content/rtg-national-terms.mjs`
- Criar: `scripts/content/rtg-national-terms.test.mjs`
- Modificar: `scripts/content/rtg-lesson-lint.mjs` (ajudante `text()`, linhas 20 a 29; laço de `sources`, linhas 40 a 46; mensagem de `unit.id`, linha 34)
- Modificar: `scripts/content/rtg-lesson-lint.test.mjs`
- Modificar: `docs/content/2026-11-05-guia-de-autoria-rtg-2026.md` (abertura e regra 1.4)

**Interfaces:**
- Produz: `findNationalReferences(value: string): string[]`, que devolve os trechos
  casados, na ordem em que aparecem, ou `[]`.
- Produz: mensagem do verificador `"<onde>: referência nacional \"<trecho>\"; use base internacional (guia, regra 1.4)"`.

- [ ] **Passo 1: escrever os testes que falham** em `rtg-national-terms.test.mjs`.

  Barrados, um `test` por linha, cada um com a frase inteira e o trecho esperado:

  | Frase | Trecho |
  | --- | --- |
  | `A Lei 12.842/2013 reserva o laudo ao médico.` | `Lei 12.842` |
  | `Veja a Lei nº 7.394.` | `Lei nº 7.394` |
  | `A Lei Brasileira de Inclusão garante o apoio.` | `Lei Brasileira` |
  | `A RDC 611 pede o teste de constância.` | `RDC 611` |
  | `A IN 91 trata da intervencionista.` | `IN 91` |
  | `A Anvisa fiscaliza o serviço.` | `Anvisa` |
  | `A norma CNEN 3.01 fixa o limite.` | `CNEN` |
  | `A ANSN 6.10 trata da radioterapia.` | `ANSN` |
  | `O CONTER regula a profissão.` | `CONTER` |
  | `O CRTR da região fiscaliza.` | `CRTR` |
  | `Parecer do CFM sobre o contraste.` | `CFM` |
  | `A LGPD protege o dado.` | `LGPD` |
  | `Protocolo do Ministério da Saúde.` | `Ministério da Saúde` |
  | `O exame é coberto pelo SUS.` | `SUS` |
  | `A Portaria 453 foi revogada.` | `Portaria 453` |
  | `O Decreto 5.626 trata de Libras.` | `Decreto 5.626` |
  | `A NR-32 trata do serviço de saúde.` | `NR-32` |
  | `Siga a norma regulamentadora.` | `norma regulamentadora` |
  | `O código de ética pede sigilo.` | `código de ética` |
  | `No Brasil se usa D e E.` | `No Brasil` |
  | `A norma brasileira pede a placa.` | `brasileira` |
  | `O tecnólogo brasileiro assina a ficha.` | `brasileiro` |
  | `A Resolução nº 5 do conselho.` | `Resolução nº 5` |

  Liberados, cada um com `assert.deepEqual(findNationalReferences(frase), [])`:
  `A lei do inverso do quadrado da distância vale aqui.`; `Pela lei de Ohm, a corrente sobe.`;
  `A resolução espacial piora com o borramento.`;
  `O sussurro do paciente foi ouvido.` (contém "sus" dentro de palavra);
  `A fina camada absorve.` (contém "in" e "na");
  `O conteúdo da ficha foi conferido.` (contém "conte");
  `A ICRP recomenda 20 mSv por ano em média.`; `A IAEA publica o padrão básico de segurança.`

- [ ] **Passo 2: rodar e ver falhar.**
  `node --test scripts/content/rtg-national-terms.test.mjs`. Esperado: falha por
  módulo inexistente. Guarde a saída em `docs/evidence/2026-11-18-base-internacional/vermelho-tarefa-1.txt`.

- [ ] **Passo 3: implementar `findNationalReferences`** em `rtg-national-terms.mjs`.
  Uma lista de expressões regulares com fronteira de palavra Unicode
  (`(?<![\p{L}\p{N}])` e `(?![\p{L}\p{N}])`), siglas sensíveis a caixa, expressões
  sem distinção de caixa. "Lei", "Decreto", "Portaria", "Resolução", "IN" e "RDC" só
  casam seguidos de `nº` ou de número; "Lei" também seguido de "Brasileira" ou
  "federal".

- [ ] **Passo 4: rodar e ver passar.** Mesmo comando. Esperado: todos passam.

- [ ] **Passo 5: ligar no verificador, com teste antes.** Em `rtg-lesson-lint.test.mjs`,
  três testes com o ajudante `defect` e `expectOnly(errors, /referência nacional/)`:
  defeito em `lessons[0].concept.body` (acrescenta `" A RDC 611 pede isso."`); defeito
  em `lessons[0].checkpoint[0].options[0].feedback`; defeito em `sources[0].title`
  (`"RDC nº 611, de 9 de março de 2022"`). Rode e veja os três falharem com "o
  defeito passou sem erro"; anexe a saída ao arquivo de vermelho. Depois, em
  `text()`, chame `findNationalReferences(value)` e emita a mensagem da seção
  Interfaces para cada trecho; no laço de `sources`, `title`, `publisher` e
  `licenseNote` já passam por `text()`. Troque a mensagem de `unit.id` por
  `'use m seguido de dois dígitos, ou s- seguido de duas letras'`.

- [ ] **Passo 6: medir o tamanho do problema com a régua ligada.**
  `for f in content-manifest/rtg-2026/aulas/*.json; do node scripts/content/rtg-lesson-lint.mjs "$f"; done 2>&1 | grep -c "referência nacional"`.
  Esperado: um número perto de 129 mais as fontes normativas. Conferência cruzada: o
  levantamento de 2026-11-18 contou 129 menções em 35 aulas e 32 fontes normativas,
  por outra expressão. Se a régua achar menos em alguma unidade que o levantamento
  apontou (m14, s-ir, s-us, s-rt, m04, s-rm, m09, m01, s-md, s-od, s-tc, m02, m13),
  leia as ocorrências que faltam e decida: termo novo na régua, com teste, ou falso
  positivo do levantamento. Registre a tabela por unidade em
  `docs/evidence/2026-11-18-base-internacional/README.md`.
  A partir daqui `build-rtg-batches.mjs --check` reprova na branch até a tarefa 6
  terminar. É esperado, e é por isso que a PR fica em rascunho.

- [ ] **Passo 7: guia.** Na abertura, troque "estudantes do curso superior de
  Tecnologia em Radiologia no Brasil" por "estudantes de Tecnologia em Radiologia, no
  Brasil e fora dele". Substitua a regra 1.4 por este texto exato:

  > 4. **Base internacional.** Não cite lei, decreto, portaria, resolução, norma,
  > órgão ou conselho de nenhum país, nem "no Brasil". Proteção radiológica: ICRP
  > (publicação 103) e IAEA (GSR Part 3 e SSG-46). Cuidado e segurança do paciente:
  > OMS. Quando a regra muda de um país para outro, diga "o serviço e as regras
  > locais definem" e ensine o princípio. Consentimento, sigilo e privacidade são
  > cuidado com o paciente, não artigo de lei. O verificador barra os termos.

- [ ] **Passo 8: commit.** `feat(conteudo): verificador barra referência nacional na trilha`.

### Tarefa 2: mapa de troca de fontes

**Artefatos:**
- Criar: `docs/evidence/2026-11-18-base-internacional/mapa-de-fontes.md`

**Interfaces:**
- Produz: uma tabela com uma linha por fonte normativa de cada unidade, com as
  colunas `unidade`, `id da fonte atual`, `itens que a citam` (ids), `fato sustentado`
  (uma frase por fato), `fonte nova` (`id`, título, editor, URL), `trecho que
  sustenta` (seção ou página) e `destino` (`troca`, `fato sai`, `fonte sai sem troca`).
  As tarefas 3 a 6 só usam fontes desta tabela.

- [ ] **Passo 1: enumerar.** Objetivo: toda fonte de `sources[]` das 24 unidades que
  seja lei, norma ou documento de órgão brasileiro. Critério de completude: duas
  buscas por convenções diferentes, uma pelo verificador da tarefa 1 sobre `title`,
  `publisher` e `licenseNote`, outra pelo domínio da `url` (`.gov.br`, `planalto`,
  `cnen`, `anvisa`, `conter`, `cbr.org.br`, `in.gov.br`). A união das duas é a lista;
  explique cada fonte que só uma das buscas achou. Cruzamento: o levantamento contou 32.
- [ ] **Passo 2: para cada fonte, listar os itens que a citam e o fato que ela
  sustenta em cada um.** Fonte que nenhum item cita tem destino "fonte sai sem troca".
- [ ] **Passo 3: achar a fonte internacional de cada fato.** Abra a URL e ache o
  trecho. Ordem de preferência: IAEA (GSR Part 3, SSG-46, Diagnostic Radiology Physics
  Handbook, páginas do RPOP), ICRP (publicação 103 e as de acesso livre), OMS, e
  fontes que a unidade já usa. Sem fonte aberta, destino "fato sai".
- [ ] **Passo 4: verificação.** Toda linha tem destino; nenhuma URL nova é de domínio
  brasileiro de governo; um revisor independente abre dez URLs sorteadas e confirma o
  trecho. Saída esperada: dez de dez.
- [ ] **Passo 5: commit.** `docs(conteudo): mapa de troca de fontes da base internacional`.

### Tarefas 3 a 6: reescrita das unidades, em quatro lotes

Cada lote é uma tarefa, com um autor por unidade (modelo menor) e um revisor
independente (modelo maior) por lote.

| Tarefa | Unidades | Atenção |
| --- | --- | --- |
| 3 | m14, m13, m04 | M14.03 vira prioridade por condição do paciente; M14.05 vira princípios de segregação e descarte |
| 4 | s-ir, s-rt, s-rm | o fato técnico vem colado na norma em S-IR.02/03/04/06, S-RM.02 e S-RT.07 |
| 5 | s-us, m01, m09, m02 | S-US.06 é reescrita inteira: o papel do tecnólogo na equipe de ultrassom, alcance que varia por país e serviço |
| 6 | s-od, s-tc, s-md, s-mn, m11, m12 | m11, m12 e s-mn só trocam fontes |

**Artefatos de cada tarefa:**
- Modificar: `content-manifest/rtg-2026/aulas/<unidade>.json` das unidades do lote
- Modificar (gerado): `radiant-app/src/features/student-checkpoints/batches/rtg-2026-<unidade>.ts`
- Modificar (gerado, se mudar): `radiant-app/.maestro/rtg-2026/*.yaml`, só no lote da s-us e da s-od

**Interfaces:**
- Consome: `mapa-de-fontes.md` (tarefa 2) e o verificador (tarefa 1).
- Produz: unidade com zero erro no verificador e relatório do autor com as colunas
  `aula`, `o que saiu`, `o que entrou`, `fato que saiu sem troca`.

- [ ] **Passo 1 (autor, por unidade):** rodar
  `node scripts/content/rtg-lesson-lint.mjs content-manifest/rtg-2026/aulas/<u>.json`
  e guardar a lista de erros "referência nacional". É o vermelho da unidade.
- [ ] **Passo 2 (autor):** reescrever cada trecho apontado e trocar as fontes conforme
  o mapa. Não muda `id`, `role`, `criticalSafety`, tipo da interação nem a ordem dos
  itens. Não acrescenta fato que o mapa não sustente. Atualiza `sourceIds` de cada
  item e tira de `sources` a fonte que nenhum item cita mais.
- [ ] **Passo 3 (autor):** rodar o verificador até sair `ok`. Rodar a cada aula, por
  causa da posição da resposta correta.
- [ ] **Passo 4 (controlador):** `node scripts/content/build-rtg-batches.mjs`, depois
  `git diff --stat` restrito aos arquivos do lote. Esperado: só os JSON do lote e os
  `.ts` gerados deles.
- [ ] **Passo 5 (controlador):** conferir a identidade dos itens com um script que
  compara, entre `origin/main` e a árvore, o conjunto de triplas
  `(id, role, criticalSafety)` de todas as interações e os `id` das aulas da unidade.
  Esperado: conjuntos iguais. O script fica em
  `docs/evidence/2026-11-18-base-internacional/compara-identidade.py`.
- [ ] **Passo 6 (revisor independente):** lê o `git diff` de cada JSON do lote, sem o
  relatório do autor, e responde por aula: algum fato técnico sumiu? Algum item de
  segurança ficou mais fraco? A fonte nova sustenta o que o item afirma (abrir a
  URL)? Sobrou referência a país que a régua não pega ("aqui", "nosso país", "a
  legislação")? Achado vira correção antes do commit.
- [ ] **Passo 7 (controlador):** ler por inteiro as aulas reescritas de ponta a ponta
  (M14.03, M14.05 e S-US.06) e uma amostra de duas aulas por unidade.
- [ ] **Passo 8:** commit `content(rtg-2026): base internacional em <unidades>`.

### Tarefa 7: fechamento da fase

**Arquivos:**
- Modificar: `docs/STATUS.md`, `docs/archive/STATUS_historico.md`
- Criar: `docs/adr/ADR-2026-11-18-trilha-internacional-e-dobrada.md`
- Modificar: `docs/evidence/2026-11-18-base-internacional/README.md`
- Modificar: `docs/plans/2026-07-27-radiant-launch-roadmap.md`

- [ ] **Passo 1: resíduo zero, por duas convenções.**
  (a) o verificador em todas as unidades: zero "referência nacional";
  (b) uma busca independente da régua, em Python sobre os JSON, pelos radicais
  `brasil`, `lei n`, `rdc`, `anvisa`, `cnen`, `ansn`, `conselho`, `ministério`,
  `legisla`, `norma` e pelos domínios da tarefa 2 nas `url`. Leia cada ocorrência de
  `norma` e `legisla` e classifique: técnica ("a norma do fabricante") ou nacional.
  Esperado: zero nacional. Registre as duas contagens.
- [ ] **Passo 2: texto do app fora das aulas.** Busque os mesmos radicais em
  `radiant-app/src` (fora de `batches/rtg-2026-*.ts`), em `radiant-app/app.json` e em
  `docs/store/`. Texto de tela ligado à aula é corrigido aqui. Texto de loja não é
  desta fase: liste as ocorrências no README da evidência, para o dono.
- [ ] **Passo 3: identidade na trilha inteira.** `compara-identidade.py` nas 24
  unidades. Esperado: iguais, e a contagem de `criticalSafety: true` igual à de
  `origin/main`.
- [ ] **Passo 4: gates, no Node 20, conferido com `node --version`.**
  `node scripts/content/build-rtg-batches.mjs --check` (esperado: sem saída de erro);
  as suítes de `scripts/content` como no `.github/workflows/content-scripts.yml`;
  `cd radiant-app && EXPO_NO_DOTENV=1 npm run quality`. Cite a suíte inteira no
  relatório, com contagem.
- [ ] **Passo 5: sinalizar.** ADR com data, decisor (o dono, em 2026-11-18) e as
  decisões: base internacional, irmã obrigatória, animação em código, dobrar aulas e
  unidades. `STATUS.md` ganha a seção da 1.7 com a data da medição; o que sair dela
  vai para o histórico. Roadmap marca a fase A.
- [ ] **Passo 6:** commit, push, PR fora do rascunho quando o CI estiver verde. O
  merge é do dono.

## Depois desta fase

O plano da fase B (formatos) é escrito quando a PR desta entrar na `main`.
