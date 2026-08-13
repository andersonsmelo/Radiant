# Produção contínua de aulas com ancoragem em fonte autorizada — design

**Data:** 2026-08-06
**Estado:** desenho aprovado, aguardando plano de implementação
**Subprojeto:** B da decomposição registrada abaixo

## O problema, dito com precisão

A produção de conteúdo está parada e a causa registrada estava errada duas
vezes seguidas. A D4 dizia "triar 42 bundles"; a triagem de 07-31 corrigiu para
"30 excertos, e é posicionamento, não revisão clínica"; a medição de 08-03
corrigiu de novo, um nível acima: **~26 dos 30 não têm nó de destino**, e
estender o vocabulário do classificador faria o `needs-review` cair sem que nada
melhorasse.

Este desenho encontrou a razão pela qual o destino falta, e ela não é falta de
currículo.

### Descoberta 1 — existem dois grafos, e o app não usa o que o classificador mira

| Grafo | Onde | Estado | Quem usa |
| --- | --- | --- | --- |
| Catálogo wave-1 | `Conteúdo/governança/wave-1-priority-tracks.json` | nós `ai-lesson:` desde abril | **o app** — o E2E passa por eles |
| Taxonomia de competências | `Conteúdo/taxonomia/{galaxias,planetas,estrelas}.json` | planetas e estrelas em `status: planned` | **o classificador** |

Os temas que a medição declarou sem destino — processamento radiográfico,
acessórios, medicina nuclear, irradiação de alimentos — **já existem como nós
`ai-lesson:` no catálogo que embarca**. Os excertos não estão sem destino no
produto; estão sem destino na taxonomia. A D4 é desalinhamento entre duas
estruturas, não ausência de uma delas.

### Descoberta 2 — a raiz editorial inteira está fora do versionamento

`Conteúdo/` está em `.git/info/exclude`. Fontes, taxonomia, catálogo e bundles
gerados vivem apenas no disco. O gerador é versionado; o que ele consome e
produz não é. Para produção contínua isso é o fato mais pesado do diagnóstico:
sem manifesto versionado, uma citação feita hoje não é auditável amanhã.

## Decisões tomadas

| # | Decisão | Alternativas descartadas e por quê |
| --- | --- | --- |
| DEC-1 | A IA gera a aula a partir da taxonomia; as fontes viram referência ancorável, não matéria-prima copiada | escalar só o piloto (deixa os 26 parados); manter fonte como matéria-prima (não escala) |
| DEC-2 | Toda afirmação ancora em excerto autorizado, com amostragem humana sobre o que passa | revisão humana obrigatória (a vazão vira agenda do revisor); publicar e corrigir por feedback (põe conteúdo médico não verificado na frente de estudante) |
| DEC-3 | Os dois grafos permanecem, ligados por mapa versionado e validador | unificar agora (migração sobre app em TestFlight e closed test); aposentar a taxonomia (contraria a ADR de competências e adia o custo) |
| DEC-4 | Motor de geração **local** (Ollama/llama.cpp), custo marginal zero | via agente (antecipa a camada B antes de a A existir); camada gratuita de terceiro (termos mudam, e excerto protegido trafegaria para fora) |
| DEC-5 | O manifesto mora em `content-manifest/`, raiz própria | `scripts/content/data/` evita alargar a policy hoje, mas mistura dado com código e a dívida fica |

**DEC-2 é o que torna DEC-4 viável.** Com a ancoragem exigida, o trabalho do modelo
deixa de ser *saber radiologia* e passa a ser *reformular material já ancorado* —
tarefa em que modelo pequeno basta. Sem o portão, cortar custo seria trocar
qualidade por preço; com ele, é dimensionar o modelo para o trabalho real.

## Arquitetura

### Três planos

| Plano | Onde | Versionado | Promessa |
| --- | --- | --- | --- |
| Fonte | `Conteúdo/fontes/` | não | matéria-prima, pesada, com direitos por fonte |
| Manifesto | `content-manifest/` | **sim** | `id`, `hash` do texto, fonte, página, direitos |
| Produto | catálogo, bundles, app | sim | o que o aluno vê |

Versionar o manifesto e não os PDFs é o que torna a ancoragem verificável sem
levar centenas de megabytes para o repositório.

### O portão fica antes do catálogo

```
extrair → classificar → gerar (local) → ⟦ANCORAGEM⟧ → catálogo → app
                                             ↓ reprovado
                                       relatório + fila
```

A ancoragem é **condição de entrada**, não auditoria posterior. Reprovação é por
afirmação; promoção é por aula: basta uma frase órfã para a aula inteira não
promover. Aula meio ancorada é pior que aula nenhuma, porque parece verificada.

### Imposição

Um validador `content-anchoring` entra em `.loop/project.yaml` ao lado de
`content-foundation` e `content-wave1`. Nenhum run que quebre o contrato fecha —
a regra não depende da disciplina de quem opera.

## Componentes

### Reaproveitados sem alteração de responsabilidade

`extract-source.py`, `classify-source.py`, `generate-embeddings.py`,
`sync-catalog-to-app.mjs`, `sync-catalog-to-api.mjs` — todos já existem com
teste. `ai-generate-formats.py` muda apenas o motor: sai a dependência de API
paga, entra o cliente local, e o `GENERATOR_VERSION` passa a registrar **nome e
versão do modelo** junto do template, senão em três meses ninguém sabe o que
produziu o quê.

### Novos

| Unidade | O que faz | Como se usa | Depende de |
| --- | --- | --- | --- |
| Manifesto de excertos | uma linha por excerto: id, hash, fonte, página, direitos | escrito pela extração, lido por todo o resto | — |
| `anchor-lesson.py` | por afirmação, devolve excerto de apoio e similaridade, ou reprova | saída ≠ 0 barra a promoção | manifesto, embeddings |
| Mapa taxonomia ↔ catálogo | liga nó de currículo a nó que embarca | lido pelo classificador e pelo validador | os dois grafos |
| Validador `content-anchoring` | roda ancorador e mapa sobre o corpus | reprova o run | os três acima |
| Fila de amostragem | lista o que passou e aguarda olho humano | única entrada de trabalho humano | ancorador |

## Fluxo de dados

1. Fonte entra no disco com decisão de direitos registrada — hoje 4 de 36
   autorizadas.
2. Extração escreve excertos **e** a linha do manifesto, com o `hash` do texto.
3. Classificação consulta o mapa; excerto sem destino real vai para lista
   explícita em vez de sumir dentro de um `needs-review` genérico.
4. Embeddings por excerto.
5. Geração local recebe conceito, template e os excertos ancoráveis do nó.
6. Ancoragem valida afirmação a afirmação.
7. Só aula 100% ancorada promove ao catálogo e aos bundles.
8. O que promoveu entra na fila de amostragem.

O que não atravessa: PDF nunca vai ao app; chave ou credencial nunca sai do
ambiente e nunca entra em contexto, evidência ou memória; nenhum dado pessoal
entra em manifesto.

## Modos de falha

1. **Afirmação não ancora** — aula não promove, relatório nomeia a frase. Falha
   **repetida no mesmo nó** é sinal de currículo: aquele nó não tem material
   autorizado que o sustente. Esse contador alimenta a decisão de escopo da
   taxonomia — o pipeline passa a produzir a informação que destrava a D4 em vez
   de esbarrar nela.
2. **Fonte perde direitos** — o manifesto transforma "quais aulas dependem desta
   fonte" em consulta. É o cenário que sozinho justifica o manifesto, porque a
   alternativa não é mais trabalho: é impossível com confiança.
3. **Excerto muda** — hash diferente quebra visivelmente no validador em vez de
   deixar a aula citando algo que não existe mais.
4. **Mapa diverge** — nó removido de um lado reprova o run. É o silêncio de
   quatro meses da Descoberta 1, agora com alarme.
5. **Amostragem encontra erro no que passou** — a resposta não é "revisar mais":
   o caso vira **fixture de regressão** do ancorador, com a aula real e o motivo
   de ter passado. Limiar ou template mudam, e o caso fica no teste.

Duas regras operacionais herdadas de medição desta data: **geração não roda
junto de E2E nem de validação** (mesma janela exclusiva de host — medimos 2,3× de
desaceleração no emulador sob carga concorrente), e **apertar o limiar dispara
varredura de reancoragem**: aula publicada sob régua antiga não vale por
antiguidade.

## Verificação

### Guardas nascem mordendo

Toda guarda nova entra com mutação que prova que ela reprova: afirmação sem
excerto, hash trocado, id inexistente, nó fora do mapa. A exigência vem de
defeito real deste repositório — em 2026-08-04 uma das seis mutações do contrato
do `reward-unlock` não chegou a aplicar por escape de shell, e o teste passou
parecendo confirmação. **Guarda não exercitada se parece com guarda aprovada.**

### A primeira leva é de calibração e não promove nada

Ela roda com o ancorador **registrando** similaridade em vez de reprovar. O
limiar sai da distribuição observada — do ponto onde afirmação legitimamente
ancorada se separa de afirmação órfã. Se as duas populações não se separarem,
isso é um achado sobre o método, e custa dez aulas descobrir em vez de
trezentas.

### Parâmetros e suas regras

| Parâmetro | Valor | Regra |
| --- | --- | --- |
| Limiar de similaridade | definido pela leva de calibração | sai da distribuição observada, não de estimativa |
| Taxa de amostragem | começa em **100%** | o teto de erro e o tamanho da janela `N` são fixados junto com o limiar, a partir da leva de calibração; até estarem escritos, a amostragem permanece em 100% |
| Cadência | medida na primeira leva | minutos por aula no modelo local, neste host |

Nenhum dos três é chutado aqui de propósito. Esta semana o projeto recontou dois
números herdados que estavam errados — o custo do E2E Android por quase uma
ordem de grandeza e a contagem do Gate 2 — e ambos tinham entrado como
estimativa que ninguém reconferiu.

## Pronto significa

Uma aula gerada localmente, com toda afirmação ancorada em excerto autorizado,
promovida ao catálogo pela cadeia inteira e com evidência de run — **e** as
quatro guardas provadas por mutação. Não "o pipeline está montado": uma aula
real do outro lado.

## Fora de escopo

- **Camada B — agente de produção via MCP.** É a etapa seguinte deste mesmo
  subprojeto, e depende de os contratos daqui estarem de pé. Automatizar um
  pipeline cujas guardas ainda não reprovam multiplica a vazão de um processo
  não verificado.
- **Subprojeto C — funil de ativação e assinatura.** Independente; mexe em
  privacy labels e Data Safety recém-declarados.
- **Subprojeto D — documentação viva.** Depende de B e C existirem para ter o
  que manter.
- **Mapa de JTBD.** Exigiria pesquisa com usuários (D6, aberta). Desenhar
  motivação sem dado produz premissa que depois é citada como fato.
- **Geração em runtime no app.** Descartada: mata proveniência e o local-first,
  impede revisão prévia e contradiz a declaração de conteúdo de terceiros.

## Dependências abertas

1. **Alargar `writePolicy.allowedRoots`** para `content-manifest/`. Transação
   própria e anterior, pelo padrão já usado em `eslint.config.js` e
   `radiant-app/assets`.
2. **Decisão de escopo da taxonomia** (D4/G1). Este desenho não a toma — ele
   passa a **medir** o que ela precisa: quantos nós ficam sem material
   autorizado, e quais.
