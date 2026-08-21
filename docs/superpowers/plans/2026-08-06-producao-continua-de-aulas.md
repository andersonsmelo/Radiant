# Produção contínua de aulas — plano de implementação

> **Para trabalhadores agênticos:** SUB-SKILL OBRIGATÓRIA — use
> `superpowers:subagent-driven-development` (recomendado) ou
> `superpowers:executing-plans` para implementar tarefa a tarefa. Os passos usam
> caixas (`- [ ]`) para rastreio.

**Goal:** entregar uma aula gerada localmente cuja cada afirmação está ancorada
em excerto de fonte autorizada, promovida ao catálogo pela cadeia inteira, com
as guardas provadas por mutação.

**Architecture:** o pipeline existente ganha contrato entre etapas. Um manifesto
versionado guarda id, hash e direitos de cada excerto; um ancorador exige que
toda afirmação de uma aula aponte para um excerto acima do limiar; um mapa liga
os dois grafos (taxonomia e catálogo) e um validador reprova divergência. O
motor de geração passa de API paga para modelo local.

**Tech Stack:** Python 3 (`unittest`, scripts em `scripts/content/`), Node 20
(`node --test`, `.mjs`), Loop CLI para runs e evidência, Ollama para o modelo
local.

**Spec:** [`2026-08-06-producao-continua-de-aulas-design.md`](../specs/2026-08-06-producao-continua-de-aulas-design.md)

## Estado da execução em 2026-08-06 — leia antes de retomar

O ledger operacional vive em `.superpowers/sdd/<plano>/progress.md`, que é
**ignorado pelo git**. Esta seção existe porque ela é a única parte versionada
do estado — quem clonar o repositório não vê o ledger. O estado canônico do
projeto inteiro está em
[`archive/EXECUTION_STATUS_2026-08-06.md`](../../archive/EXECUTION_STATUS_2026-08-06.md).

| Tarefa | Commit | Estado |
| --- | --- | --- |
| 0 — policy | `afcb002` | concluída |
| 1 — manifesto | `299430f` | concluída |
| 2 — embeddings por excerto | `49a5597` | concluída, após 1 fix round |
| 2.5 — embrulho da transação | `581702c` | concluída |
| 3 — ancorador | `872d5e5` | concluída |
| 4 — mapa entre grafos | `abef952`, corrigida em `23d23fa` | concluída após fix round 1, revisão limpa |
| 5 — validador content-anchoring | `d73962f`, corrigida em `c61bad7` | concluída após fix round 1, revisão limpa |
| 6 — motor local e calibração | `0a36fa1`, revisada em `3dd3ba0` | **Steps 1 a 4 entregues; Steps 5 e 6 bloqueados** |
| 7 — classificação consulta o mapa | `a9ad1ce` | concluída |
| 8 — fila de amostragem humana | `740067f` | concluída |
| revisão final de branch | `a39c37c` | 2 Críticos e 5 Importantes, todos corrigidos |

Fora do plano, no mesmo intervalo: `521421f` editou os textos de decisão do
mapa por aprovação do dono; `592d0ca` e `0e2e9f1` corrigiram o handoff e a ordem
do ritual de memória no `AGENTS.md`.

### O que a Task 4 e a Task 5 aprenderam

Os dois achados da Task 4 foram corrigidos: `mapErrors` agora acusa catálogo
inexistente mesmo quando `taxonomyId` é `null`, com teste cobrindo o caso, e o
Step 5 do plano foi emendado para não reintroduzir o defeito. O exame do mapa
passou a ser sistemático — 16 nós × 6 estrelas, 96 pares, com um campo
`rationale` por entrada registrando a estrela considerada e o veredito. A
Task 5 registrou o validador `content-anchoring` no Loop (o `loop validate`
passou a reportar 10 validadores) e teve um fix round próprio: o ramo
"excerto fora do manifesto" era guarda sem teste, e a lacuna foi provada antes
de fechada — com o ramo neutralizado, a suíte antiga de quatro testes seguia
verde.

### A regra de mutação, dita com precisão

O plano mandava ver vermelho no Step 2 e verde no Step 4 e chamava isso de
prova de mutação. Não é: o vermelho do Step 2 vem de `Cannot find module`,
que prova que o módulo está ausente, não que cada guarda reprova o que
promete. A prova real exige neutralizar um ramo por vez sobre o código **já
verde** e mostrar que exatamente aquele teste fica vermelho. Foi assim que as
quatro guardas da Task 5 foram provadas, e é assim que as próximas devem ser.

### Tabela de mutação — versionada porque prosa decai em silêncio

A revisão final de branch encontrou o motivo de esta tabela existir. A
"Definição de pronto" afirmava quatro guardas provadas por mutação, e **uma
delas não estava provada**: o teste `MUTACAO: afirmacao sem excerto reprova`
casava a **contagem** de erros (`assert.equal(erros.length, 1)`) em vez da
mensagem. Com `if (!claim.excerptId)` neutralizado, a afirmação escorregava
para `porId.get(null)` → `undefined` → o ramo `!linha`, que empurra
`"excerto fora do manifesto: null"`. Ainda havia exatamente um erro, então a
asserção de contagem continuava satisfeita — **pelo ramo errado**. Reproduzido
antes de fechado: com a asserção antiga e a guarda neutralizada, a suíte dava
**5 pass / 0 fail**.

A lição que generaliza: **asserção que conta não identifica**. Um teste de
guarda tem de casar a mensagem daquela guarda, senão qualquer outro ramo que
também produza um erro o satisfaz.

Varredura completa, um ramo por vez, sobre o código já verde, restaurando
byte-idêntico (sha256 conferido) depois de cada mutação:

| # | Ramo neutralizado | Arquivo | Teste que fica vermelho | Vermelhos |
| --- | --- | --- | --- | --- |
| 1 | `if (!claim.excerptId)` → `if (false)` | `validate-content-anchoring.mjs` | `MUTACAO: afirmacao sem excerto reprova` | 1/5 |
| 2 | `if (!linha)` → `if (false)` | `validate-content-anchoring.mjs` | `MUTACAO: excerto fora do manifesto reprova` | 1/5 |
| 3 | `linha.rightsClass !== 'authorized'` → `false` | `validate-content-anchoring.mjs` | `MUTACAO: excerto nao autorizado reprova` | 1/5 |
| 4 | `linha.hash !== claim.hash` → `false` | `validate-content-anchoring.mjs` | `MUTACAO: hash divergente reprova` | 1/5 |
| 5 | `!taxonomyIds.has(...)` → `false` | `validate-taxonomy-map.mjs` | `acusa taxonomia inexistente` | 1/5 |
| 6 | `!catalogIds.has(...)` → `false` | `validate-taxonomy-map.mjs` | `acusa catalogo inexistente mesmo com taxonomyId null` | 1/5 |
| 7 | `startsWith('ai-lesson:') && !mapeados.has(...)` → `false` | `validate-taxonomy-map.mjs` | `acusa no de catalogo sem entrada no mapa` | 1/5 |
| 8 | `estado == "mapped"` → `estado != "pending"` | `destination-state.py` | `test_particao_manda_taxonomia_desconhecida_para_pendentes` | 1/5 |
| 9 | `max(0, min(...))` → `min(...)` | `calibration-report.py` | `test_distribuicao_acomoda_similaridade_negativa` | 1/7 |
| 10 | `corte = round(rate * BUCKETS)` → `corte = BUCKETS` | `sampling-queue.py` | `test_taxa_do_teto_escrito_nao_seleciona_ninguem` **e** `test_taxa_parcial_exclui_pelo_menos_uma_aula` | 2/6 |

As quatro guardas da "Definição de pronto" são as linhas **1, 4, 3 e 7**, nesta
ordem: afirmação sem excerto, hash divergente, excerto não autorizado, nó fora
do mapa.

**A linha 10 é a única que não isola**, e a honestidade sobre isso importa mais
do que a tabela ficar uniforme: `rate=0.0` não é um ramo próprio, é um valor de
borda do mesmo `_bucket(lid) < corte` que o teste de taxa parcial já exercita.
Neste conjunto de fixtures o menor bucket é 17, então nenhuma mutação distingue
`rate=0.0` de `rate=0.017`. O teste existe porque `0.0` é exatamente o que
`effective_rate(ceiling_written=True)` devolve — caminho vivo, não hipotético — e
prega a composição inteira; não porque haja um ramo separado a provar.

Quem reexecutar o plano deve **refazer esta varredura**, não confiar na tabela:
ela registra um resultado, e resultado registrado envelhece. O que não envelhece
é o procedimento.

### As seis suítes Python não eram rodadas por nada

Achado da mesma revisão, e o de maior alcance depois da tabela. O
`.loop/project.yaml` não tinha validador para nenhum `.test.py`, e
`.github/workflows/` só carrega os fluxos de api e app. **A metade de ancoragem
e manifesto do pipeline — seis suítes — estava inteiramente fora do gate**: dava
para quebrar `build-manifest`, `anchor-lesson` ou `sampling-queue` e fechar um run
com `loop validate` verde.

Entrou o validador **`content-python`**, que roda as seis num laço e propaga a
falha (`estado=1`) sem parar na primeira — conferido nos dois sentidos: verde sai
0, com a primeira suíte quebrada sai 1 **e as seis ainda reportam**. O
`loop validate` passou de 10 para **11 validadores**.

O `content-anchoring` foi corrigido junto, pela mesma razão: ele encadeava duas
invocações com `&&`, que esconde a segunda quando a primeira falha.

### O que está bloqueado, e em quem

A Task 6 parou nos Steps 5 e 6 porque **Ollama não está instalado nesta
máquina** — não há binário e nada responde em `127.0.0.1:11434`. Instalar o
runtime e baixar o modelo é decisão do dono do projeto, e o Step 6 ainda exige
janela exclusiva de host, que disputa a máquina com a B5 Android.
`scripts/content/ai-generate-formats.py` segue intocado de propósito; nenhum
stub foi deixado no lugar.

### A decisão de currículo que ficou registrada

Os 16 nós continuam com `taxonomyId: null`, mas dois casos deixaram de ser
equivalentes: `ai-lesson:interacao-das-radiacoes-e-protecao-radiologica` ×
`star-dose-radiacao` é candidato real, adiado com gatilho de reabertura
escrito — volta à mesa quando a estrela sair de `status: planned`;
`ai-lesson:qualidade-de-imagem` × `star-artefatos-basicos` foi examinado e
**rejeitado**, porque o único indício era a string do id. Registre também a
ressalva: o gatilho está em prosa dentro de um JSON e não dispara sozinho; a
versão forte seria o validador reprovar quando uma estrela com candidato
documentado deixa `planned`, e isso é trabalho novo, fora deste plano.

### Como retomar

**As nove tarefas fecharam, e a revisão final de branch já rodou.** Não há
tarefa deste plano a executar. O que resta não é implementação pendente — são
três coisas de naturezas diferentes, e confundi-las é o erro a evitar:

1. **Bloqueado no dono, não em código:** a Task 6, Steps 5 e 6. Ollama não está
   instalado nesta máquina (sem binário no `PATH`, nada em `127.0.0.1:11434`), e
   o Step 6 exige janela exclusiva de host. Sem isso não há limiar calibrado, e
   sem limiar a reprovação automática não liga.
   `scripts/content/ai-generate-formats.py` segue intocado de propósito.
2. **Trabalho do próximo plano:** a fiação da cadeia. Os três pontos estão
   nomeados em "O que este plano não faz" — o mapa sem leitor, a ponte de classe
   de direitos sem produtor, e o validador que valida testes em vez de dados.
   **Não os trate como defeito deste plano**: são o recorte que ele
   deliberadamente não fez.
3. **Decisão de escopo, do dono:** os 16 nós seguem com `taxonomyId: null`. Este
   plano **produz a lista**; ele não decide.

Quem for escrever o próximo plano começa lendo
[`archive/EXECUTION_STATUS_2026-08-06.md`](../../archive/EXECUTION_STATUS_2026-08-06.md), depois
a seção "O que este plano não faz" abaixo, e depois a tabela de mutação acima —
que é o contrato de qualidade a manter, não um registro histórico. O processo
continua sendo `superpowers:subagent-driven-development`, e o embrulho de
transação (`scripts/loop/abrir.mjs` / `fechar.mjs`) continua obrigatório.

### O que a execução ensinou, e que muda o despacho

As três primeiras tarefas falharam **na transação e nenhuma no código** — memória
por contradição do plano, `INVALID_ARGUMENT` (flag `--task` ausente) lido como
CLI quebrada, e transação aberta depois da edição. Por isso existe a Task 2.5.
**Use sempre o embrulho:**

```sh
node scripts/loop/abrir.mjs "<descrição>" <arquivo>...   # imprime o runId
node scripts/loop/fechar.mjs <runId>
```

`abrir` precede a criação de qualquer arquivo — é o `step begin` que grava o
checkpoint. Depois que o embrulho passou a ser usado, a Task 3 fechou sem
nenhum defeito de transação, com menos da metade das chamadas de ferramenta.

## Global Constraints

- **Toda alteração passa por run do Loop:** `loop run start` → `loop context
  build` → `loop step begin --files <cada arquivo>` → editar → `loop validate` →
  `loop step finish` → `[loop memory write]` → `loop run close`.
- **`loop memory write` exige o run em `state: succeeded`**, e só
  `loop step finish` produz esse estado (`src/engine.ts:356`); `validate` deixa
  o run em `validating`. Gravar memória logo após validar falha sempre.
  *(Corrigido em 2026-08-06: a ordem anterior omitia onde a memória entra, e a
  omissão foi preenchida pela leitura errada da proibição abaixo — custou um
  run travado.)*
- **`loop memory write` entra apenas quando a tarefa produz aprendizado
  durável** — a skill `loop-development` diz, com todas as letras, *"If no
  durable learning exists, close the successful run without inventing one"*.
  Tarefa mecânica (alargar uma policy, renomear um símbolo) fecha sem memória;
  descoberta que a próxima sessão pagaria para não redescobrir merece memória.
  Sem memória, `succeeded → closed` é transição válida.
  *(Corrigido em 2026-08-06: a redação anterior exigia memória em toda
  alteração, contradizendo a skill. A revisão da Task 0 pegou a contradição.)*
- **Nunca encadeie os comandos de fechamento com `&&`.** A CLI reporta erro no
  corpo do JSON com status de saída zero; extraia o `code` e falhe
  explicitamente. Esta regra é sobre o **operador**, não sobre a ordem:
  `memory_written → closed` é transição legal (`src/state-machine.ts:21`).
- **`fechar.mjs` não serve para tarefa com memória.** Ele encadeia
  `validate` → `step finish` → `run close` e fecha incondicionalmente; depois de
  `closed` não há transição para `memory_written`. Com aprendizado a gravar,
  rode os passos até `step finish`, depois `memory write`, depois `run close`.
- **`MEMORY_EVIDENCE_INVALID` tem quatro causas** checadas em ordem
  (`src/memory.ts`): estado do run (26), resumo vazio ou acima de **1000
  caracteres** (33), evidência ausente ou reprovada (44), lista de evidência
  vazia (52). A primeira mascara as demais — leia o `{ state }` da resposta
  antes de suspeitar do tamanho.
- **Nunca rode geração, E2E e validação ao mesmo tempo.** Host de 16 GB; medida
  de 2026-08-06 mostrou 2,3× de desaceleração no emulador sob carga concorrente.
- **Teste Python:** arquivo irmão `<script>.test.py`, `unittest`, carregado por
  `importlib` porque os scripts têm hífen no nome. Roda com
  `python3 scripts/content/<nome>.test.py`.
- **Teste Node:** `node --test scripts/content/<nome>.test.mjs`.
- **Id de excerto:** `excerpt:<sourceSlug>:p<página>:c<chunk>` — formato já
  emitido por `build_excerpts` em `extract-source.py:64`.
- **Id de taxonomia:** `star-<slug>` — **forma nua, sem prefixo**, exatamente
  como o campo `id` de `Conteúdo/taxonomia/estrelas.json`: `star-coluna`,
  `star-pelve`, `star-artefatos-basicos`, `star-dose-radiacao`,
  `star-sindrome-alveolar`, `star-pneumotorax`. É o valor que `taxonomyId`
  carrega em `content-manifest/taxonomy-catalog-map.json`.
  *(Pinado em 2026-08-06 pela revisão final de branch. Havia duas convenções em
  desacordo: o arquivo real usava `star-<slug>` e as fixtures dos testes usavam
  `estrela:<slug>`. Nada forçava a decisão porque os 16 `taxonomyId` são `null`
  e os conjuntos de ids são injetados nos testes — o desacordo só apareceria
  para quem preenchesse o primeiro id de verdade, na forma do arquivo real,
  colhendo `mapa aponta para taxonomia inexistente: star-dose-radiacao`. As
  fixtures foram alinhadas à fonte real; a fonte não mudou.)*
- **Classes de direitos:** `authorized`, `reference-only`, `blocked` —
  definidas em `scripts/content/catalog-library-sources.mjs:11`, indexadas pelo
  SHA-256 do arquivo-fonte.
- **Só `authorized` ancora.** `reference-only` e `blocked` nunca sustentam
  afirmação.
- **`Conteúdo/` está fora do git.** Nada dentro dele é versionado; o manifesto
  existe justamente para dar rastro versionado ao que vive lá.
- **Nenhuma chave de API entra em contexto, evidência ou memória.**

---

### Task 0: Alargar a policy de escrita para `content-manifest/`

Transação própria e anterior, sem nenhuma outra mudança junto. O padrão já foi
usado duas vezes neste repositório (`eslint.config.js`, `radiant-app/assets`).

**Files:**
- Modify: `.loop/project.yaml` (bloco `writePolicy.allowedRoots`)

**Interfaces:**
- Consumes: nada.
- Produces: a raiz `content-manifest/` passa a ser declarável em
  `loop step begin`.

- [ ] **Step 1: Confirmar que a raiz ainda não é permitida**

Run: `grep -n "content-manifest" .loop/project.yaml`
Expected: sem saída.

- [ ] **Step 2: Abrir run e declarar o arquivo da policy**

```bash
loop run start --task "Alargar writePolicy para content-manifest"
loop context build --run <runId>
loop step begin --run <runId> --files .loop/project.yaml
```

Se o `step begin` recusar `.loop/project.yaml` por estar fora de
`allowedRoots`, **pare e escale ao dono**: a policy precisa ser editada fora de
run, e isso é decisão dele, não contorno seu.

- [ ] **Step 3: Acrescentar a raiz**

Em `.loop/project.yaml`, dentro de `writePolicy.allowedRoots`, na ordem
alfabética existente:

```yaml
    - content-manifest
```

- [ ] **Step 4: Validar e fechar**

```bash
loop validate --run <runId>
loop step finish --run <runId>
```
Expected: 11/11 validadores `passed`.

- [ ] **Step 5: Commit**

```bash
git add .loop/project.yaml
git commit -m "chore(loop): content-manifest entra na policy de escrita"
```

---

### Task 1: Manifesto de excertos

**Files:**
- Create: `scripts/content/build-manifest.py`
- Create: `scripts/content/build-manifest.test.py`
- Create (saída em tempo de execução): `content-manifest/excerpts.jsonl`

**Interfaces:**
- Consumes: excertos no formato de `build_excerpts` (`id`, `sourceSlug`,
  `pageStart`, `pageEnd`, `text`, `charCount`).
- Produces:
  - `excerpt_hash(text: str) -> str` — SHA-256 hexadecimal do texto.
  - `manifest_line(excerpt: dict, rights_class: str) -> dict` — devolve
    `{"id", "sourceSlug", "pageStart", "pageEnd", "hash", "rightsClass"}`.
    **Nunca inclui o texto do excerto** — o manifesto é rastro, não cópia.
  - `write_manifest(lines: list[dict], path: Path) -> None` — escreve JSONL
    ordenado por `id`.

- [ ] **Step 1: Escrever o teste que falha**

```python
# scripts/content/build-manifest.test.py
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("build-manifest.py")
SPEC = importlib.util.spec_from_file_location("build_manifest", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)

EXCERPT = {
    "id": "excerpt:fundamentos:p12:c1",
    "sourceSlug": "fundamentos",
    "pageStart": 12,
    "pageEnd": 12,
    "text": "Os raios X foram descobertos em 1895.",
    "charCount": 37,
}


class BuildManifestTest(unittest.TestCase):
    def test_hash_muda_quando_o_texto_muda(self):
        primeiro = MODULE.excerpt_hash(EXCERPT["text"])
        segundo = MODULE.excerpt_hash(EXCERPT["text"] + " ")
        self.assertNotEqual(primeiro, segundo)

    def test_linha_nao_carrega_o_texto(self):
        linha = MODULE.manifest_line(EXCERPT, "authorized")
        self.assertNotIn("text", linha)
        self.assertEqual(linha["hash"], MODULE.excerpt_hash(EXCERPT["text"]))
        self.assertEqual(linha["rightsClass"], "authorized")

    def test_manifesto_sai_ordenado_por_id(self):
        outro = dict(EXCERPT, id="excerpt:fundamentos:p01:c1")
        with tempfile.TemporaryDirectory() as tmp:
            destino = Path(tmp) / "excerpts.jsonl"
            MODULE.write_manifest(
                [MODULE.manifest_line(EXCERPT, "authorized"),
                 MODULE.manifest_line(outro, "authorized")],
                destino,
            )
            ids = [json.loads(l)["id"] for l in destino.read_text().splitlines()]
        self.assertEqual(ids, sorted(ids))


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Rodar para ver falhar**

Run: `python3 scripts/content/build-manifest.test.py`
Expected: FAIL — `FileNotFoundError` ou `AttributeError: module has no attribute 'excerpt_hash'`.

- [ ] **Step 3: Implementar o mínimo**

```python
# scripts/content/build-manifest.py
from __future__ import annotations

import hashlib
import json
from pathlib import Path

MANIFEST_FIELDS = ("id", "sourceSlug", "pageStart", "pageEnd")


def excerpt_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def manifest_line(excerpt: dict, rights_class: str) -> dict:
    line = {field: excerpt[field] for field in MANIFEST_FIELDS}
    line["hash"] = excerpt_hash(excerpt["text"])
    line["rightsClass"] = rights_class
    return line


def write_manifest(lines: list[dict], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    ordenadas = sorted(lines, key=lambda line: line["id"])
    corpo = "\n".join(json.dumps(line, ensure_ascii=False) for line in ordenadas)
    path.write_text(corpo + "\n", encoding="utf-8")
```

- [ ] **Step 4: Rodar para ver passar**

Run: `python3 scripts/content/build-manifest.test.py`
Expected: `OK` com 3 testes.

- [ ] **Step 5: Commit**

```bash
git add scripts/content/build-manifest.py scripts/content/build-manifest.test.py
git commit -m "feat(conteudo): manifesto de excertos com hash e classe de direitos"
```

---

### Task 2: Embeddings por excerto

A spec assumia embeddings reaproveitáveis, mas `generate-embeddings.py` grava
**por conceito** (`{"conceptId", "embedding"}` em
`embeddings/<conceptId>.json`). A ancoragem compara afirmação contra **excerto**,
então esta granularidade não existe ainda.

**Files:**
- Create: `scripts/content/embed-excerpts.py`
- Create: `scripts/content/embed-excerpts.test.py`

**Interfaces:**
- Consumes: `excerpt_hash` de Task 1; excertos com `id` e `text`.
- Produces:
  - `embedding_path(excerpt_id: str, root: Path) -> Path` — troca `:` por `_`,
    mesmo esquema de `safe_filename` em `generate-embeddings.py:23`.
  - `save_excerpt_embedding(excerpt_id, text_hash, embedding, root) -> None` —
    grava `{"excerptId", "hash", "embedding"}`.
  - `needs_embedding(excerpt_id, text_hash, root) -> bool` — `True` quando não
    existe arquivo **ou** quando o `hash` gravado difere do atual. É o que faz
    excerto alterado ser reprocessado em vez de ficar com vetor velho.

- [ ] **Step 1: Escrever o teste que falha**

```python
# scripts/content/embed-excerpts.test.py
import importlib.util
import tempfile
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("embed-excerpts.py")
SPEC = importlib.util.spec_from_file_location("embed_excerpts", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)

EXCERPT_ID = "excerpt:fundamentos:p12:c1"


class EmbedExcerptsTest(unittest.TestCase):
    def test_caminho_troca_dois_pontos(self):
        caminho = MODULE.embedding_path(EXCERPT_ID, Path("/tmp/x"))
        self.assertNotIn(":", caminho.name)

    def test_precisa_embutir_quando_nao_existe(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.assertTrue(MODULE.needs_embedding(EXCERPT_ID, "abc", Path(tmp)))

    def test_hash_diferente_exige_reprocesso(self):
        with tempfile.TemporaryDirectory() as tmp:
            raiz = Path(tmp)
            MODULE.save_excerpt_embedding(EXCERPT_ID, "abc", [0.1, 0.2], raiz)
            self.assertFalse(MODULE.needs_embedding(EXCERPT_ID, "abc", raiz))
            self.assertTrue(MODULE.needs_embedding(EXCERPT_ID, "def", raiz))


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Rodar para ver falhar**

Run: `python3 scripts/content/embed-excerpts.test.py`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar o mínimo**

```python
# scripts/content/embed-excerpts.py
from __future__ import annotations

import json
from pathlib import Path


def safe_filename(excerpt_id: str) -> str:
    return excerpt_id.replace(":", "_")


def embedding_path(excerpt_id: str, root: Path) -> Path:
    return root / f"{safe_filename(excerpt_id)}.json"


def save_excerpt_embedding(
    excerpt_id: str, text_hash: str, embedding: list[float], root: Path
) -> None:
    root.mkdir(parents=True, exist_ok=True)
    payload = {"excerptId": excerpt_id, "hash": text_hash, "embedding": embedding}
    embedding_path(excerpt_id, root).write_text(
        json.dumps(payload, ensure_ascii=False), encoding="utf-8"
    )


def needs_embedding(excerpt_id: str, text_hash: str, root: Path) -> bool:
    caminho = embedding_path(excerpt_id, root)
    if not caminho.exists():
        return True
    gravado = json.loads(caminho.read_text(encoding="utf-8"))
    return gravado.get("hash") != text_hash
```

- [ ] **Step 4: Rodar para ver passar**

Run: `python3 scripts/content/embed-excerpts.test.py`
Expected: `OK` com 3 testes.

- [ ] **Step 5: Commit**

```bash
git add scripts/content/embed-excerpts.py scripts/content/embed-excerpts.test.py
git commit -m "feat(conteudo): embeddings por excerto, invalidados por hash"
```

---

### Task 2.5: Embrulhar o ritual de transação

Inserida em 2026-08-06, depois de **três tarefas seguidas** falharem na
transação e nenhuma no código: a Task 0 pulou a memória por contradição do
próprio plano, a Task 1 leu `INVALID_ARGUMENT` (flag `--task` ausente) como CLI
quebrada e commitou fora de run, e a Task 2 abriu o run **depois** de editar,
declarando só um dos dois arquivos. Três agentes, três erros diferentes, zero
erros de lógica — o que descarta desatenção e aponta para a estrutura: o
entregável vem especificado com assinatura e código literal, o procedimento vem
como prosa numa seção global. Esta tarefa transforma o procedimento em comando.

**Files:**
- Create: `scripts/loop/envelope.mjs`
- Create: `scripts/loop/envelope.test.mjs`
- Create: `scripts/loop/abrir.mjs`
- Create: `scripts/loop/fechar.mjs`

**Interfaces:**
- Produces:
  - `parseEnvelope(stdout: string) -> { code: string, runId: string | null }` —
    lê o JSON que a CLI imprime.
  - `assertCode(envelope, expected: string) -> void` — **lança** quando o código
    difere. É o coração da tarefa: a CLI devolve erro no corpo com status de
    saída **zero**, então `&&` não protege e só uma checagem explícita protege.
  - `abrir.mjs` — `node scripts/loop/abrir.mjs "<descrição>" <arquivo>...`
    encadeia `run start --task` → `context build` → `step begin --files`,
    abortando no primeiro código inesperado, e imprime o `runId`.
  - `fechar.mjs` — `node scripts/loop/fechar.mjs <runId>` encadeia `validate` →
    `step finish` → `run close`, abortando do mesmo jeito.

Memória validada **não** entra no `fechar`: ela é opcional por decisão, e
embutir no fechamento reintroduziria o encadeamento que a regra proíbe.

- [ ] **Step 1: Escrever o teste que falha**

```javascript
// scripts/loop/envelope.test.mjs
import assert from 'node:assert/strict';
import test from 'node:test';
import { parseEnvelope, assertCode } from './envelope.mjs';

test('extrai code e runId do envelope', () => {
  const env = parseEnvelope('{"code":"RUN_CREATED","runId":"run-1","ok":true}');
  assert.equal(env.code, 'RUN_CREATED');
  assert.equal(env.runId, 'run-1');
});

test('runId ausente vira null em vez de undefined', () => {
  assert.equal(parseEnvelope('{"code":"STEP_STARTED"}').runId, null);
});

test('assertCode lanca quando o codigo diverge', () => {
  const env = parseEnvelope('{"code":"MEMORY_EVIDENCE_INVALID"}');
  assert.throws(() => assertCode(env, 'MEMORY_WRITTEN'), /MEMORY_EVIDENCE_INVALID/);
});

test('assertCode passa quando o codigo confere', () => {
  assert.doesNotThrow(() => assertCode(parseEnvelope('{"code":"RUN_CLOSED"}'), 'RUN_CLOSED'));
});

test('saida que nao e JSON vira erro legivel, nao stack trace', () => {
  assert.throws(() => parseEnvelope('command not found'), /envelope ilegivel/);
});
```

- [ ] **Step 2: Rodar para ver falhar**

Run: `node --test scripts/loop/envelope.test.mjs`
Expected: FAIL — `Cannot find module './envelope.mjs'`.

- [ ] **Step 3: Implementar o mínimo**

```javascript
// scripts/loop/envelope.mjs
export function parseEnvelope(stdout) {
  let dados;
  try {
    dados = JSON.parse(stdout);
  } catch {
    throw new Error(`envelope ilegivel da CLI do Loop: ${stdout.slice(0, 200)}`);
  }
  return { code: dados.code, runId: dados.runId ?? null };
}

export function assertCode(envelope, expected) {
  if (envelope.code !== expected) {
    throw new Error(
      `esperado ${expected}, veio ${envelope.code} — a CLI reporta erro no corpo com saida zero`
    );
  }
}
```

- [ ] **Step 4: Rodar para ver passar**

Run: `node --test scripts/loop/envelope.test.mjs`
Expected: 5 `pass`, 0 `fail`.

- [ ] **Step 5: Escrever os dois executáveis**

```javascript
// scripts/loop/abrir.mjs
import { execFileSync } from 'node:child_process';
import { parseEnvelope, assertCode } from './envelope.mjs';

const [descricao, ...arquivos] = process.argv.slice(2);
if (!descricao || arquivos.length === 0) {
  console.error('uso: node scripts/loop/abrir.mjs "<descricao>" <arquivo>...');
  process.exit(2);
}

const loop = (args) => parseEnvelope(execFileSync('loop', args, { encoding: 'utf8' }));

const criado = loop(['run', 'start', '--task', descricao]);
assertCode(criado, 'RUN_CREATED');
const runId = criado.runId;

assertCode(loop(['context', 'build', '--run', runId]), 'CONTEXT_READY');

const declaracao = ['step', 'begin', '--run', runId];
for (const arquivo of arquivos) declaracao.push('--files', arquivo);
assertCode(loop(declaracao), 'STEP_STARTED');

console.log(runId);
```

```javascript
// scripts/loop/fechar.mjs
import { execFileSync } from 'node:child_process';
import { parseEnvelope, assertCode } from './envelope.mjs';

const runId = process.argv[2];
if (!runId) {
  console.error('uso: node scripts/loop/fechar.mjs <runId>');
  process.exit(2);
}

const loop = (args) => parseEnvelope(execFileSync('loop', args, { encoding: 'utf8' }));

assertCode(loop(['validate', '--run', runId]), 'VALIDATION_PASSED');
assertCode(loop(['step', 'finish', '--run', runId]), 'STEP_SUCCEEDED');
assertCode(loop(['run', 'close', '--run', runId]), 'RUN_CLOSED');

console.log(`run ${runId} fechado com validacao aprovada`);
```

- [ ] **Step 6: Provar que o embrulho funciona na própria tarefa**

Feche **esta** tarefa com `node scripts/loop/fechar.mjs <runId>` em vez dos três
comandos soltos. Se o embrulho não conseguir fechar o próprio run que o criou,
ele não serve para as seis tarefas seguintes.

- [ ] **Step 7: Commit**

```bash
git add scripts/loop/
git commit -m "feat(loop): abrir e fechar transacao em um comando, com checagem de envelope"
```

---

### Task 3: Ancorador em modo registro

Modo registro é o da leva de calibração: devolve a similaridade de cada
afirmação **sem reprovar**. A reprovação entra na Task 5, quando o limiar existir.

**Files:**
- Create: `scripts/content/anchor-lesson.py`
- Create: `scripts/content/anchor-lesson.test.py`

**Interfaces:**
- Consumes: manifesto de Task 1, embeddings de Task 2.
- Produces:
  - `cosine(a: list[float], b: list[float]) -> float`
  - `best_anchor(claim_vector, excerpt_vectors: dict[str, list[float]]) -> tuple[str | None, float]`
    — devolve `(excerpt_id, similaridade)` ou `(None, 0.0)` se não houver
    candidato.
  - `anchor_report(claims: list[dict], excerpt_vectors, allowed: dict[str, str]) -> dict`
    — devolve
    `{"claims": [{"claim", "excerptId", "hash", "similarity"}], "unanchored": int}`.
    `allowed` mapeia **id de excerto `authorized` → hash do manifesto**;
    candidato fora dessa lista é ignorado, não penalizado depois. O `hash` sai
    no relatório porque é ele que a Task 5 compara para detectar fonte alterada
    — sem isso o validador não tem como saber que o excerto mudou.

- [ ] **Step 1: Escrever o teste que falha**

```python
# scripts/content/anchor-lesson.test.py
import importlib.util
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("anchor-lesson.py")
SPEC = importlib.util.spec_from_file_location("anchor_lesson", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)

AUTORIZADO = "excerpt:fundamentos:p12:c1"
BLOQUEADO = "excerpt:proibida:p1:c1"


class AnchorLessonTest(unittest.TestCase):
    def test_cosseno_de_vetores_iguais_e_um(self):
        self.assertAlmostEqual(MODULE.cosine([1.0, 0.0], [1.0, 0.0]), 1.0)

    def test_escolhe_o_excerto_mais_proximo(self):
        vetores = {AUTORIZADO: [1.0, 0.0], "excerpt:outro:p1:c1": [0.0, 1.0]}
        excerto, similaridade = MODULE.best_anchor([0.9, 0.1], vetores)
        self.assertEqual(excerto, AUTORIZADO)
        self.assertGreater(similaridade, 0.9)

    def test_excerto_nao_autorizado_nunca_ancora(self):
        vetores = {BLOQUEADO: [1.0, 0.0]}
        relatorio = MODULE.anchor_report(
            [{"claim": "afirmação", "vector": [1.0, 0.0]}], vetores, allowed={}
        )
        self.assertIsNone(relatorio["claims"][0]["excerptId"])
        self.assertEqual(relatorio["unanchored"], 1)

    def test_relatorio_carrega_o_hash_do_excerto_ancorado(self):
        vetores = {AUTORIZADO: [1.0, 0.0]}
        relatorio = MODULE.anchor_report(
            [{"claim": "afirmação", "vector": [1.0, 0.0]}],
            vetores,
            allowed={AUTORIZADO: "abc"},
        )
        self.assertEqual(relatorio["claims"][0]["hash"], "abc")


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Rodar para ver falhar**

Run: `python3 scripts/content/anchor-lesson.test.py`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar o mínimo**

```python
# scripts/content/anchor-lesson.py
from __future__ import annotations

import math


def cosine(a: list[float], b: list[float]) -> float:
    numerador = sum(x * y for x, y in zip(a, b))
    norma = math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b))
    return 0.0 if norma == 0 else numerador / norma


def best_anchor(claim_vector, excerpt_vectors):
    melhor_id, melhor_sim = None, 0.0
    for excerpt_id, vetor in excerpt_vectors.items():
        similaridade = cosine(claim_vector, vetor)
        if similaridade > melhor_sim:
            melhor_id, melhor_sim = excerpt_id, similaridade
    return melhor_id, melhor_sim


def anchor_report(claims, excerpt_vectors, allowed):
    permitidos = {k: v for k, v in excerpt_vectors.items() if k in allowed}
    linhas, sem_ancora = [], 0
    for claim in claims:
        excerpt_id, similaridade = best_anchor(claim["vector"], permitidos)
        if excerpt_id is None:
            sem_ancora += 1
        linhas.append(
            {
                "claim": claim["claim"],
                "excerptId": excerpt_id,
                "hash": allowed.get(excerpt_id) if excerpt_id else None,
                "similarity": similaridade,
            }
        )
    return {"claims": linhas, "unanchored": sem_ancora}
```

- [ ] **Step 4: Rodar para ver passar**

Run: `python3 scripts/content/anchor-lesson.test.py`
Expected: `OK` com 4 testes.

- [ ] **Step 5: Commit**

```bash
git add scripts/content/anchor-lesson.py scripts/content/anchor-lesson.test.py
git commit -m "feat(conteudo): ancorador em modo registro, so excerto autorizado ancora"
```

---

### Task 4: Mapa taxonomia ↔ catálogo, com validador

**Files:**
- Create: `content-manifest/taxonomy-catalog-map.json`
- Create: `scripts/content/validate-taxonomy-map.mjs`
- Create: `scripts/content/validate-taxonomy-map.test.mjs`

**Interfaces:**
- Consumes: `Conteúdo/taxonomia/estrelas.json`,
  `Conteúdo/governança/wave-1-priority-tracks.json`.
- Produces:
  - `export function mapErrors({ map, taxonomyIds, catalogIds })` — devolve
    `string[]`; vazio significa mapa íntegro. Três classes de erro: entrada
    apontando para id de taxonomia inexistente, entrada apontando para id de
    catálogo inexistente, e nó de catálogo `ai-lesson:` sem entrada no mapa.

- [ ] **Step 1: Escrever o teste que falha**

```javascript
// scripts/content/validate-taxonomy-map.test.mjs
import assert from 'node:assert/strict';
import test from 'node:test';
import { mapErrors } from './validate-taxonomy-map.mjs';

// Ids na convenção real das duas fontes: `star-<slug>` nu para taxonomia (ver
// Global Constraints). O par é fixture, não decisão de currículo.
const base = {
  map: [{ taxonomyId: 'star-artefatos-basicos', catalogId: 'ai-lesson:producao-dos-raios-x' }],
  taxonomyIds: new Set(['star-artefatos-basicos']),
  catalogIds: new Set(['ai-lesson:producao-dos-raios-x']),
};

test('mapa integro nao acusa erro', () => {
  assert.deepEqual(mapErrors(base), []);
});

test('acusa taxonomia inexistente', () => {
  const erros = mapErrors({ ...base, taxonomyIds: new Set() });
  assert.equal(erros.length, 1);
  assert.match(erros[0], /taxonomia inexistente: star-artefatos-basicos/);
});

test('acusa no de catalogo sem entrada no mapa', () => {
  const erros = mapErrors({
    ...base,
    catalogIds: new Set(['ai-lesson:producao-dos-raios-x', 'ai-lesson:orfao']),
  });
  assert.equal(erros.length, 1);
  assert.match(erros[0], /catalogo sem entrada no mapa: ai-lesson:orfao/);
});
```

> **Toda asserção de guarda casa a mensagem, nunca só a contagem.** Contar erro
> não prova guarda: outro ramo que também empurre um erro satisfaz a contagem. É
> o defeito que a revisão final encontrou na Task 5 — ver a tabela de mutação.

- [ ] **Step 2: Rodar para ver falhar**

Run: `node --test scripts/content/validate-taxonomy-map.test.mjs`
Expected: FAIL — `Cannot find module`.

- [ ] **Step 3: Implementar o mínimo**

```javascript
// scripts/content/validate-taxonomy-map.mjs
export function mapErrors({ map, taxonomyIds, catalogIds }) {
  const erros = [];
  const mapeados = new Set();

  for (const entrada of map) {
    if (!taxonomyIds.has(entrada.taxonomyId)) {
      erros.push(`mapa aponta para taxonomia inexistente: ${entrada.taxonomyId}`);
    }
    if (!catalogIds.has(entrada.catalogId)) {
      erros.push(`mapa aponta para catalogo inexistente: ${entrada.catalogId}`);
    }
    mapeados.add(entrada.catalogId);
  }

  for (const catalogId of catalogIds) {
    if (catalogId.startsWith('ai-lesson:') && !mapeados.has(catalogId)) {
      erros.push(`no de catalogo sem entrada no mapa: ${catalogId}`);
    }
  }

  return erros;
}
```

- [ ] **Step 4: Rodar para ver passar**

Run: `node --test scripts/content/validate-taxonomy-map.test.mjs`
Expected: 3 `pass`, 0 `fail`.

- [ ] **Step 5: Criar o mapa com os nós que já existem**

Preencher `content-manifest/taxonomy-catalog-map.json` com uma entrada por nó
`ai-lesson:` do catálogo. Listar os ids reais com:

```bash
grep -o "ai-lesson:[a-z0-9-]*" "Conteúdo/governança/wave-1-priority-tracks.json" | sort -u
```

Nó de catálogo cuja contraparte de taxonomia ainda não existe entra com
`"taxonomyId": null` — é a lista que alimenta a decisão de escopo da D4.
Acrescente **primeiro** estes dois testes, veja falhar, e só então o ajuste:

```javascript
test('entrada sem taxonomia ainda nao decidida nao e erro', () => {
  const erros = mapErrors({
    map: [{ taxonomyId: null, catalogId: 'ai-lesson:producao-dos-raios-x' }],
    taxonomyIds: new Set(),
    catalogIds: new Set(['ai-lesson:producao-dos-raios-x']),
  });
  assert.deepEqual(erros, []);
});

test('acusa catalogo inexistente mesmo com taxonomyId null', () => {
  const erros = mapErrors({
    map: [{ taxonomyId: null, catalogId: 'ai-lesson:fantasma' }],
    taxonomyIds: new Set(),
    catalogIds: new Set(),
  });
  assert.equal(erros.length, 1);
  assert.match(erros[0], /ai-lesson:fantasma/);
});
```

O ajuste em `mapErrors`, dentro do laço sobre `map`, substituindo as duas
checagens originais: o `taxonomyId === null` pula **somente** a checagem de
taxonomia — a checagem de catálogo e o `mapeados.add` continuam valendo para
toda entrada, inclusive as com `taxonomyId: null`.

```javascript
    if (entrada.taxonomyId !== null && !taxonomyIds.has(entrada.taxonomyId)) {
      erros.push(`mapa aponta para taxonomia inexistente: ${entrada.taxonomyId}`);
    }
    if (!catalogIds.has(entrada.catalogId)) {
      erros.push(`mapa aponta para catalogo inexistente: ${entrada.catalogId}`);
    }
    mapeados.add(entrada.catalogId);
```

*(Corrigido em 2026-08-06: a redação anterior usava `if (entrada.taxonomyId
=== null) { mapeados.add(...); continue; }`, e o `continue` pulava também a
checagem de catálogo — `mapErrors` devolvia `[]` para uma entrada com
`taxonomyId: null` e `catalogId` inexistente, quando deveria acusar. A
revisão da Task 4 (fix round 1) encontrou o defeito reproduzido com
`mapErrors({map:[{taxonomyId:null,catalogId:'ai-lesson:fantasma'}],
taxonomyIds:new Set(),catalogIds:new Set()})`. A forma acima e o teste de
`null` + catálogo inválido substituem o bloco original para que quem
reexecutar este plano não reintroduza o defeito.)*

- [ ] **Step 6: Commit**

```bash
git add content-manifest/taxonomy-catalog-map.json scripts/content/validate-taxonomy-map.mjs scripts/content/validate-taxonomy-map.test.mjs
git commit -m "feat(conteudo): mapa entre taxonomia e catalogo, com validador"
```

---

### Task 5: Validador `content-anchoring` e prova por mutação

**Files:**
- Create: `scripts/content/validate-content-anchoring.mjs`
- Create: `scripts/content/validate-content-anchoring.test.mjs`
- Modify: `.loop/project.yaml` (lista `validators`)

**Interfaces:**
- Consumes: `mapErrors` de Task 4; manifesto de Task 1.
- Produces: processo com código de saída 1 e mensagem por erro; 0 quando limpo.

- [ ] **Step 1: Escrever o teste que falha, incluindo a mutação**

```javascript
// scripts/content/validate-content-anchoring.test.mjs
import assert from 'node:assert/strict';
import test from 'node:test';
import { anchoringErrors } from './validate-content-anchoring.mjs';

const manifesto = [
  { id: 'excerpt:fundamentos:p12:c1', hash: 'abc', rightsClass: 'authorized' },
];

test('aula com toda afirmacao ancorada passa', () => {
  const aula = { claims: [{ excerptId: 'excerpt:fundamentos:p12:c1', hash: 'abc' }] };
  assert.deepEqual(anchoringErrors({ aula, manifesto }), []);
});

// Cada teste casa a MENSAGEM, nunca a contagem — ver a nota abaixo.
test('MUTACAO: afirmacao sem excerto reprova', () => {
  const aula = { claims: [{ excerptId: null, hash: null }] };
  assert.match(anchoringErrors({ aula, manifesto })[0], /afirmacao sem excerto/);
});

test('MUTACAO: hash divergente reprova', () => {
  const aula = { claims: [{ excerptId: 'excerpt:fundamentos:p12:c1', hash: 'zzz' }] };
  assert.match(anchoringErrors({ aula, manifesto })[0], /hash divergente/);
});

test('MUTACAO: excerto nao autorizado reprova', () => {
  const restrito = [{ id: 'excerpt:x:p1:c1', hash: 'abc', rightsClass: 'reference-only' }];
  const aula = { claims: [{ excerptId: 'excerpt:x:p1:c1', hash: 'abc' }] };
  assert.match(anchoringErrors({ aula, manifesto: restrito })[0], /sem autorizacao de direitos/);
});

test('MUTACAO: excerto fora do manifesto reprova', () => {
  const aula = { claims: [{ excerptId: 'excerpt:fantasma:p1:c1', hash: 'abc' }] };
  assert.match(anchoringErrors({ aula, manifesto })[0], /excerto fora do manifesto/);
});
```

*(Corrigido de novo em 2026-08-06, pela revisão final de branch: o teste
`MUTACAO: afirmacao sem excerto reprova` casava `assert.equal(erros.length, 1)`. Com a
guarda `if (!claim.excerptId)` neutralizada, a afirmação escorregava para
`porId.get(null)` → `undefined` → o ramo `!linha`, que empurra `"excerto fora do
manifesto: null"` — ainda exatamente um erro, então a suíte seguia **5/5 verde com a
guarda morta**. Asserção que conta não identifica: qualquer outro ramo que também
produza um erro a satisfaz. As três asserções acima passaram a casar a mensagem, e a
varredura de mutação virou tabela versionada no topo deste plano.)*

*(Corrigido em 2026-08-06: a redação original desta lista tinha apenas três testes
`MUTACAO:`, cobrindo afirmação sem excerto, hash divergente e excerto sem autorização de
direitos. O Step 3 sempre teve um quarto ramo — `!linha`, "excerto fora do manifesto" —
mas nenhum teste o exercitava, muito menos por mutação. A revisão da Task 5 (fix round 1)
confirmou a lacuna: com o ramo `!linha` neutralizado, a suíte de três `MUTACAO:` originais
continuava a passar 4/4, ou seja, a guarda podia quebrar sem que nada acusasse — o mesmo
padrão do defeito de 2026-08-04 citado na spec do projeto. O teste
`MUTACAO: excerto fora do manifesto reprova` acima fecha essa lacuna; quem reexecutar este
plano deve escrevê-lo junto dos outros três desde o Step 1.)*

- [ ] **Step 2: Rodar para ver falhar**

Run: `node --test scripts/content/validate-content-anchoring.test.mjs`
Expected: FAIL — `Cannot find module`.

- [ ] **Step 3: Implementar o mínimo**

```javascript
// scripts/content/validate-content-anchoring.mjs
export function anchoringErrors({ aula, manifesto }) {
  const porId = new Map(manifesto.map((linha) => [linha.id, linha]));
  const erros = [];

  for (const claim of aula.claims) {
    if (!claim.excerptId) {
      erros.push('afirmacao sem excerto de apoio');
      continue;
    }
    const linha = porId.get(claim.excerptId);
    if (!linha) {
      erros.push(`excerto fora do manifesto: ${claim.excerptId}`);
      continue;
    }
    if (linha.rightsClass !== 'authorized') {
      erros.push(`excerto sem autorizacao de direitos: ${claim.excerptId}`);
      continue;
    }
    if (linha.hash !== claim.hash) {
      erros.push(`hash divergente para ${claim.excerptId}: fonte mudou desde a ancoragem`);
    }
  }

  return erros;
}
```

- [ ] **Step 4: Rodar para ver passar**

Run: `node --test scripts/content/validate-content-anchoring.test.mjs`
Expected: 5 `pass`, 0 `fail`. **As quatro mutações precisam ter falhado no Step 2
e passado agora** — se alguma passou já no Step 2, a guarda não morde e o teste
está errado.

*(Corrigido em 2026-08-06: a expectativa original dizia "4 pass" porque a lista de
testes do Step 1 só cobria três mutações. Com o quarto teste — `MUTACAO: excerto fora
do manifesto reprova` — a contagem correta é 5.)*

- [ ] **Step 5: Registrar o validador no Loop**

Em `.loop/project.yaml`, depois de `content-wave1`:

```yaml
  - id: content-anchoring
    command: PATH=/Users/anderson/.nvm/versions/node/v20.20.2/bin:/usr/bin:/bin node
      --test scripts/content/validate-content-anchoring.test.mjs scripts/content/validate-taxonomy-map.test.mjs
    timeoutMs: 120000
```

*(Corrigido em 2026-08-06 pela revisão final de branch: a redação anterior encadeava
duas invocações de `node --test` com `&&`, e o `&&` **esconde os diagnósticos da
segunda suíte quando a primeira fica vermelha** — quem lê o relatório do validador vê
metade do problema. `node --test` aceita vários arquivos numa invocação só, roda as
duas e reporta ambas. Valida exatamente o mesmo, sem a cegueira.)*

- [ ] **Step 6: Provar que o validador entrou**

Run: `loop validate --run <runId>` num run qualquer
Expected: **11** validadores, todos `passed` (10 depois desta Task; o 11º,
`content-python`, entrou na onda de fix da revisão final).

- [ ] **Step 7: Commit**

```bash
git add scripts/content/validate-content-anchoring.mjs scripts/content/validate-content-anchoring.test.mjs .loop/project.yaml
git commit -m "feat(conteudo): validador de ancoragem no Loop, com mutacoes provadas"
```

---

### Task 6: Motor local e leva de calibração

**Files:**
- Modify: `scripts/content/ai-generate-formats.py` (troca do cliente e do
  `GENERATOR_VERSION`)
- Create: `scripts/content/calibration-report.py`
- Create: `scripts/content/calibration-report.test.py`

**Interfaces:**
- Consumes: `anchor_report` de Task 3.
- Produces:
  - `distribution(similarities: list[float], buckets: int = 10) -> dict[str, int]`
  - `separation(anchored: list[float], orphan: list[float]) -> float` — diferença
    entre a mediana das duas populações. É o número que decide se o método
    funciona: **sem separação, não há limiar que sirva**.

- [ ] **Step 1: Escrever o teste que falha**

```python
# scripts/content/calibration-report.test.py
import importlib.util
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("calibration-report.py")
SPEC = importlib.util.spec_from_file_location("calibration_report", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


class CalibrationReportTest(unittest.TestCase):
    def test_distribuicao_conta_por_faixa(self):
        faixas = MODULE.distribution([0.05, 0.15, 0.95], buckets=10)
        self.assertEqual(faixas["0.0-0.1"], 1)
        self.assertEqual(faixas["0.9-1.0"], 1)

    def test_separacao_positiva_quando_populacoes_diferem(self):
        self.assertGreater(MODULE.separation([0.9, 0.92], [0.2, 0.25]), 0.5)

    def test_separacao_zero_quando_populacoes_se_confundem(self):
        self.assertAlmostEqual(MODULE.separation([0.5], [0.5]), 0.0)

    def test_distribuicao_acomoda_similaridade_negativa(self):
        faixas = MODULE.distribution([-0.5, 0.3], buckets=10)
        self.assertEqual(faixas["0.0-0.1"], 1)
        self.assertEqual(faixas["0.3-0.4"], 1)


if __name__ == "__main__":
    unittest.main()
```

*(Acrescentado em 2026-08-06 pela revisão final de branch: `distribution` grampeava
só o topo. `distribution([-0.5, 0.3])` levantava `KeyError: '-0.5--0.4'`, e o Step 6
— a leva de calibração, sob janela exclusiva de host — é exatamente onde a população
crua com órfãs entraria. Linha 9 da tabela de mutação.)*

- [ ] **Step 2: Rodar para ver falhar**

Run: `python3 scripts/content/calibration-report.test.py`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar o mínimo**

```python
# scripts/content/calibration-report.py
from __future__ import annotations

import statistics


def distribution(similarities: list[float], buckets: int = 10) -> dict[str, int]:
    faixas = {
        f"{i / buckets:.1f}-{(i + 1) / buckets:.1f}": 0 for i in range(buckets)
    }
    for valor in similarities:
        # Grampo nos DOIS extremos. Cosseno vive em [-1, 1], e a leva de
        # calibração consome a população crua, órfãs incluídas: sem o `max(0,
        # ...)`, `distribution([-0.5])` estoura `KeyError: '-0.5--0.4'` e
        # derruba a leva no meio de uma janela exclusiva de host.
        indice = max(0, min(int(valor * buckets), buckets - 1))
        faixas[f"{indice / buckets:.1f}-{(indice + 1) / buckets:.1f}"] += 1
    return faixas


def separation(anchored: list[float], orphan: list[float]) -> float:
    if not anchored or not orphan:
        return 0.0
    return statistics.median(anchored) - statistics.median(orphan)
```

- [ ] **Step 4: Rodar para ver passar**

Run: `python3 scripts/content/calibration-report.test.py`
Expected: `OK` com 4 testes.

- [ ] **Step 5: Trocar o motor por Ollama**

Em `scripts/content/ai-generate-formats.py`, remover os imports `anthropic` e
`openai` e chamar o endpoint local. `GENERATOR_VERSION` passa de `"ai-split-v1"`
para incluir modelo e tag — por exemplo `"ai-split-v2+llama3.1:8b"` — porque a
evidência precisa dizer o que produziu cada aula.

```python
import json
import urllib.request

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"


def generate(prompt: str, model: str) -> str:
    payload = json.dumps({"model": model, "prompt": prompt, "stream": False}).encode()
    requisicao = urllib.request.Request(
        OLLAMA_URL, data=payload, headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(requisicao, timeout=300) as resposta:
        return json.loads(resposta.read())["response"]
```

- [ ] **Step 6: Rodar a leva de calibração**

Com o emulador desligado e nenhuma validação em curso — **janela exclusiva de
host**. Gerar dez aulas, rodar o ancorador em modo registro, e produzir o
relatório de distribuição e separação.

Expected: um relatório com as duas populações. **Se `separation` sair perto de
zero, pare o plano e reporte**: significa que a ancoragem não distingue
afirmação sustentada de afirmação órfã, e nenhum limiar resolve isso — é achado
sobre o método, não tarefa a concluir.

- [ ] **Step 7: Commit**

```bash
git add scripts/content/ai-generate-formats.py scripts/content/calibration-report.py scripts/content/calibration-report.test.py
git commit -m "feat(conteudo): motor local e relatorio de calibracao do limiar"
```

---

### Task 7: A classificação passa a consultar o mapa

Hoje o excerto sem destino some dentro de um `needs-review` genérico e alguém
lê como dúvida clínica — foi o que aconteceu e custou duas correções de rumo na
D4. Esta tarefa separa as duas coisas.

**Files:**
- Create: `scripts/content/destination-state.py`
- Create: `scripts/content/destination-state.test.py`

**Interfaces:**
- Consumes: `content-manifest/taxonomy-catalog-map.json` de Task 4.
- Produces:
  - `destination_state(taxonomy_id: str | None, mapped_taxonomy_ids: set[str]) -> str`
    — devolve `"mapped"`, `"pending"` ou `"unknown"`.
  - `partition(classified: list[dict], mapped_taxonomy_ids: set[str]) -> dict`
    — devolve `{"withDestination": [...], "pendingTaxonomy": [...]}`. É a
    segunda lista que alimenta a decisão de escopo.

- [ ] **Step 1: Escrever o teste que falha**

```python
# scripts/content/destination-state.test.py
import importlib.util
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("destination-state.py")
SPEC = importlib.util.spec_from_file_location("destination_state", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)

# Forma nua `star-<slug>` — ver Global Constraints.
MAPEADOS = {"star-artefatos-basicos"}


class DestinationStateTest(unittest.TestCase):
    def test_no_mapeado(self):
        self.assertEqual(
            MODULE.destination_state("star-artefatos-basicos", MAPEADOS), "mapped"
        )

    def test_sem_taxonomia_decidida_e_pendente(self):
        self.assertEqual(MODULE.destination_state(None, MAPEADOS), "pending")

    def test_taxonomia_desconhecida(self):
        self.assertEqual(MODULE.destination_state("star-sumida", MAPEADOS), "unknown")

    def test_particao_separa_pendentes_de_classificados(self):
        classificados = [
            {"excerptId": "excerpt:a:p1:c1", "taxonomyId": "star-artefatos-basicos"},
            {"excerptId": "excerpt:b:p2:c1", "taxonomyId": None},
        ]
        resultado = MODULE.partition(classificados, MAPEADOS)
        self.assertEqual(len(resultado["withDestination"]), 1)
        self.assertEqual(resultado["pendingTaxonomy"][0]["excerptId"], "excerpt:b:p2:c1")

    def test_particao_manda_taxonomia_desconhecida_para_pendentes(self):
        classificados = [
            {"excerptId": "excerpt:c:p3:c1", "taxonomyId": "star-sumida"},
        ]
        resultado = MODULE.partition(classificados, MAPEADOS)
        self.assertEqual(resultado["withDestination"], [])
        self.assertEqual(resultado["pendingTaxonomy"][0]["excerptId"], "excerpt:c:p3:c1")


if __name__ == "__main__":
    unittest.main()
```

*(Acrescentado em 2026-08-06 pela revisão final de branch: nenhum teste roteava um
item `"unknown"` por `partition`. Com `estado == "mapped"` mutado para
`estado != "pending"`, a suíte seguia 4/4 verde — `partition` recolhe os dois estados
que `destination_state` acabou de separar, e nada acusava. O teste acima prega onde o
`unknown` cai **hoje**; a pergunta de desenho — três listas em vez de duas — está
registrada em "Questões de desenho para o próximo plano". Linha 8 da tabela de
mutação.)*

- [ ] **Step 2: Rodar para ver falhar**

Run: `python3 scripts/content/destination-state.test.py`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar o mínimo**

```python
# scripts/content/destination-state.py
from __future__ import annotations


def destination_state(taxonomy_id, mapped_taxonomy_ids: set[str]) -> str:
    if taxonomy_id is None:
        return "pending"
    return "mapped" if taxonomy_id in mapped_taxonomy_ids else "unknown"


def partition(classified: list[dict], mapped_taxonomy_ids: set[str]) -> dict:
    com_destino, pendentes = [], []
    for item in classified:
        estado = destination_state(item.get("taxonomyId"), mapped_taxonomy_ids)
        # ATENÇÃO: esta linha recolhe "pending" (decisão de escopo) e "unknown"
        # (erro de integridade de dado) na MESMA lista — os dois estados que
        # `destination_state` acabou de separar. É deliberado, não descuido: o
        # contrato de duas chaves vem deste Step. A divisão em três vias está
        # registrada em "Questões de desenho para o próximo plano".
        (com_destino if estado == "mapped" else pendentes).append(item)
    return {"withDestination": com_destino, "pendingTaxonomy": pendentes}
```

- [ ] **Step 4: Rodar para ver passar**

Run: `python3 scripts/content/destination-state.test.py`
Expected: `OK` com 5 testes.

- [ ] **Step 5: Commit**

```bash
git add scripts/content/destination-state.py scripts/content/destination-state.test.py
git commit -m "feat(conteudo): excerto sem destino vira lista propria, nao needs-review generico"
```

---

### Task 8: Fila de amostragem humana

**Files:**
- Create: `scripts/content/sampling-queue.py`
- Create: `scripts/content/sampling-queue.test.py`

**Interfaces:**
- Consumes: ids de aulas que passaram a ancoragem.
- Produces:
  - `selected_for_review(lesson_ids: list[str], rate: float) -> list[str]` —
    seleção **determinística** por hash do id, para a mesma entrada dar sempre a
    mesma amostra e a revisão ser reproduzível.
  - `effective_rate(ceiling_written: bool) -> float` — devolve `1.0` enquanto o
    teto de erro não estiver escrito. É a regra da spec virada em código: a
    amostragem não cai por esquecimento.

- [ ] **Step 1: Escrever o teste que falha**

```python
# scripts/content/sampling-queue.test.py
import importlib.util
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("sampling-queue.py")
SPEC = importlib.util.spec_from_file_location("sampling_queue", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)

AULAS = [f"lesson:{i}" for i in range(100)]


class SamplingQueueTest(unittest.TestCase):
    def test_sem_teto_escrito_a_taxa_e_total(self):
        self.assertEqual(MODULE.effective_rate(ceiling_written=False), 1.0)

    def test_com_teto_escrito_a_taxa_e_zero(self):
        self.assertEqual(MODULE.effective_rate(ceiling_written=True), 0.0)

    def test_selecao_e_deterministica(self):
        self.assertEqual(
            MODULE.selected_for_review(AULAS, 0.2),
            MODULE.selected_for_review(AULAS, 0.2),
        )

    def test_taxa_total_seleciona_tudo(self):
        self.assertEqual(len(MODULE.selected_for_review(AULAS, 1.0)), len(AULAS))

    def test_taxa_parcial_exclui_pelo_menos_uma_aula(self):
        selecionadas = MODULE.selected_for_review(AULAS, 0.2)
        self.assertGreater(len(selecionadas), 0)
        self.assertLess(len(selecionadas), len(AULAS))

    def test_taxa_do_teto_escrito_nao_seleciona_ninguem(self):
        taxa = MODULE.effective_rate(ceiling_written=True)
        self.assertEqual(taxa, 0.0)
        self.assertEqual(MODULE.selected_for_review(AULAS, taxa), [])


if __name__ == "__main__":
    unittest.main()
```

*(Acrescentado em 2026-08-06 pela revisão final de branch: `rate=0.0` não era
exercitado, e não é valor hipotético — é exatamente o que
`effective_rate(ceiling_written=True)` devolve. O teste prega a composição inteira,
para que a consequência de virar a flag cedo demais — **zero** revisão humana, o
inverso da falha que a função existe para impedir — fique escrita num teste. Ver a
linha 10 da tabela de mutação, e a ressalva de que ela é a única que não isola.)*

*(Corrigido em 2026-08-06: a redação original desta lista tinha apenas três testes,
cobrindo `effective_rate(ceiling_written=False)`, a determinicidade e a taxa total.
O Step 3 sempre teve dois ramos que nenhum desses três testes provava: (1)
`effective_rate(ceiling_written=True) == 0.0` — o ramo "senão" do ternário — e (2) o
lado "falso" de `_bucket(lid) < corte` numa taxa parcial, isto é, que a amostragem
realmente **exclui** alguém quando a taxa é menor que 1.0. A prova de mutação da
Task 8 confirmou as duas lacunas: com cada ramo neutralizado (forçando o ternário
para `0.0` sempre, e forçando a condição da compreensão para `True` sempre), a suíte
de três testes originais continuava passando 3/3 — a guarda podia quebrar sem que
nada acusasse. Os dois testes acima —
`test_com_teto_escrito_a_taxa_e_zero` e `test_taxa_parcial_exclui_pelo_menos_uma_aula`
— fecham essas lacunas; quem reexecutar este plano deve escrevê-los junto dos outros
três desde o Step 1.)*

- [ ] **Step 2: Rodar para ver falhar**

Run: `python3 scripts/content/sampling-queue.test.py`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar o mínimo**

```python
# scripts/content/sampling-queue.py
from __future__ import annotations

import hashlib

BUCKETS = 1000


def effective_rate(ceiling_written: bool) -> float:
    return 1.0 if not ceiling_written else 0.0


def _bucket(lesson_id: str) -> int:
    digest = hashlib.sha256(lesson_id.encode("utf-8")).hexdigest()
    return int(digest[:8], 16) % BUCKETS


def selected_for_review(lesson_ids: list[str], rate: float) -> list[str]:
    corte = round(rate * BUCKETS)
    return [lid for lid in lesson_ids if _bucket(lid) < corte]
```

> `effective_rate` devolve `0.0` quando o teto **já** está escrito porque, nesse
> ponto, quem manda é o valor acordado e não esta função — ela existe só para
> impedir que a amostragem caia antes da decisão. A tarefa que introduzir o teto
> substitui esta assinatura, e o teste acima é o que vai falhar avisando.

- [ ] **Step 4: Rodar para ver passar**

Run: `python3 scripts/content/sampling-queue.test.py`
Expected: `OK` com 6 testes.

*(Corrigido em 2026-08-06: a expectativa original dizia "3 testes" porque a lista do
Step 1 só cobria três ramos. Com os dois testes novos — `test_com_teto_escrito_a_taxa_e_zero`
e `test_taxa_parcial_exclui_pelo_menos_uma_aula` — a contagem subiu para 5, e depois para
6 com `test_taxa_do_teto_escrito_nao_seleciona_ninguem`, acrescentado pela revisão final de
branch e descrito na nota logo acima.)*

- [ ] **Step 5: Commit**

```bash
git add scripts/content/sampling-queue.py scripts/content/sampling-queue.test.py
git commit -m "feat(conteudo): fila de amostragem deterministica, 100% ate haver teto"
```

---

## Definição de pronto

Uma aula gerada localmente, com toda afirmação ancorada em excerto `authorized`,
promovida ao catálogo pela cadeia inteira, com evidência de run — **e** as
quatro guardas (afirmação sem excerto, hash divergente, excerto não autorizado,
nó fora do mapa) provadas por mutação que falhou antes de passar.

## O que este plano não faz

**Não fia a cadeia.** Este é o recorte mais importante desta seção, e a revisão
final de branch pediu que ele fosse dito com todas as letras, porque a "Definição
de pronto" acima, lida sozinha, sugere um pipeline funcionando. Não é o que
existe. **Todo módulo entregue é função pura importada apenas pelo próprio
teste.** Em concreto, três pontas soltas, nomeadas para que ninguém precise
redescobri-las:

1. **O mapa não tem leitor.** `content-manifest/taxonomy-catalog-map.json` não é
   lido por nenhum código do repositório — nem pelo validador que existe para
   protegê-lo. `mapErrors` recebe `map`, `taxonomyIds` e `catalogIds` de quem
   chama, e ninguém chama. Consequência exata: **o detector de deriva não detecta
   deriva.** Ele está correto e provado por mutação; simplesmente nunca recebe os
   dois grafos reais.
2. **A ponte de classe de direitos não tem produtor.** O dicionário `allowed` de
   `anchor_report` e a `rightsClass` de `manifest_line` são ambos fornecidos pelo
   chamador, e chamador não existe. A regra crítica de segurança do plano — **"só
   `authorized` ancora"** — está implementada e provada, mas **nada a alimenta**.
   Construir o `authorized_index` que liga o manifesto ao ancorador é trabalho do
   próximo plano; não improvise um aqui.
3. **O validador `content-anchoring` valida testes, não dados.** Ele roda
   `node --test`. Quando o `loop validate` reporta 11 validadores aprovados, isso
   significa **"os testes unitários passam"**, e não "o conteúdo está ancorado".
   Nenhuma aula real passou por nenhuma destas guardas ainda.

Ler isto como defeito seria o erro simétrico: é **andaime provado peça a peça**,
que é exatamente o que este plano se propôs a entregar. O que não se pode é ler a
"Definição de pronto" como se a cadeia estivesse ligada.

Além disso:

- Não decide o escopo da taxonomia. Ele **produz a lista** `pendingTaxonomy`
  que a decisão precisa.
- Não liga a reprovação automática. O limiar só existe depois da Task 6, e
  ligá-lo é a primeira tarefa do plano seguinte.
- Não toca no funil de assinatura nem na camada de agente/MCP. São os
  subprojetos C, D e a camada B, registrados como fora de escopo na spec.

## Questões de desenho para o próximo plano

Levantadas pela revisão final de branch. São **perguntas de desenho**, não
defeitos a corrigir em silêncio — mudar qualquer uma delas é decisão, e decisão
pertence a um plano, não a uma onda de fix.

- **`partition` deveria devolver três listas, não duas?** Hoje ela recolhe em
  `pendingTaxonomy` os dois estados que `destination_state` acabou de separar:
  `"pending"` (taxonomia ainda não decidida — decisão de escopo, o dono resolve)
  e `"unknown"` (taxonomia preenchida mas ausente do mapa — erro de integridade
  de dado, alguém resolve corrigindo o dado). São condições de naturezas
  diferentes e donos diferentes, e **a premissa declarada da Task 7 é justamente
  que juntar condições distintas numa lista só custou duas correções de rumo na
  D4** — o mesmo defeito, um nível acima. O contrato de duas chaves veio do Step
  3 deste plano e foi mantido de propósito na onda de fix; o que entrou foi o
  teste que prega onde o `unknown` cai hoje
  (`test_particao_manda_taxonomia_desconhecida_para_pendentes`, linha 8 da tabela
  de mutação) e um comentário no ponto do roteamento. O teste **vai falhar de
  propósito** no dia em que a divisão em três vias entrar — é o alarme, não um
  obstáculo.
- **O gatilho de reabertura do candidato adiado não dispara.** Está em prosa
  dentro de um JSON. A versão forte seria o validador reprovar quando uma estrela
  com candidato documentado deixa `status: planned`.
