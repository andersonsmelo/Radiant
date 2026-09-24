# Relatório — E2E dos caminhos dourados da 1.4 (2026-09-24)

Frente do [prompt de continuidade](2026-09-24-radiant-prompt-e2e-caminhos-dourados.md):
os três caminhos da spec 1.4, §8, item 6. O Gate H4 **não coube** nesta
conversa e vai para a próxima, como o prompt previa.

## Resultado

| Caminho | Flow | iOS 26.5 (simulador) |
| --- | --- | --- |
| 1. Primeira execução até a L1 concluída | `radiant-1-4-primeira-execucao.yaml` | **passed**, 130,9 s |
| 2. Segundo dia com revisão devida | `radiant-1-4-segundo-dia.yaml` | **dia 1 passed; dia 2 pendente** — a partir de 2026-09-25 11:55 (−03) |
| 3. Vidas acabando no meio da lição até a folha | `radiant-1-4-vidas-esgotadas.yaml` | **passed**, 495,9 s |

A condição de pronto do prompt **não está inteira**: o caminho 2 ainda não tem
verde. Ele depende de relógio real, por decisão do dono nesta conversa: o app
não tem injeção de relógio nem de estado, e a revisão vence no mínimo 1 dia
depois da lição. Detalhe de cada execução, inclusive as seis que falharam, na
[evidência](../../../radiant-app/docs/evidence/2026-09-24-e2e-caminhos-dourados-1-4.md).

## O que mudou

- **Três flows e um subflow novos** em `radiant-app/.maestro/`. O
  `subflows/dismiss-dev-client.yaml` espera explicitamente o launcher ou a
  folha do dev client. O guarda antigo (`runFlow when visible`, avaliado uma
  vez só) disputa corrida com eles: foi medido perdendo das duas formas em
  duas instalações limpas seguidas do mesmo binário.
- **Contrato** (`scripts/maestro-contract.test.mjs`): teste novo que prende
  cada caminho à regra e à copy da fonte (conclusão da lição, revisão
  agendada e devida, `MAX_HEARTS` respostas erradas, título da folha, rótulo
  do HUD, a folha modal), e os três flows nas listas de rolagem. 22/22.
  Quinze mutações, cada uma vista falhando pelo defeito que nomeia:
  [vermelhos](2026-09-24-radiant-e2e-caminhos-dourados-vermelhos.md).
- **Documentos:** runbook (flows, ordem de execução, matriz de sign-off da
  1.4), índice de evidências, FILA (item 4 da Task 8), STATUS (item 2 do que
  falta; "Repositório", com o trecho velho no histórico) e a Task 8 do plano
  da 1.4.

Nenhum arquivo de `src/` mudou.

## Achados

**Três defeitos do app**, expostos pela execução e não corrigidos aqui,
porque `src/` está fora desta frente (FILA, item 4):

1. Uma lição concluída, reaberta e deixada no meio, volta como "Continuar de
   onde parou", e o cabeçalho desconta a etapa ("1 de 14" → "0 de 14"). A
   causa é `resolveNodeStatus`, que testa o nó retomável antes do concluído.
   **Precisa de decisão do dono** (o que o aluno vê), e só depois de um run.
2. "Próxima revisão em 2 dias" para uma revisão a 24 h: diferença de 1 ms
   entre dois relógios, arredondada para cima.
3. O resumo de vidas em recarga sai pela borda direita da trilha no
   iPhone 17.

**Dois achados de ferramental:**

- `scripts/start-ios-v2.sh` falha nesta máquina: o `--ios` do `expo start`
  faz a mesma consulta ao Simulador que trava o `expo run:ios`. Usei uma
  cópia sem o `--ios`, com a verificação de ambiente intacta. O script não
  foi alterado; está registrado no runbook.
- Os flows antigos (`first-run`, `learning-critical-path` e os outros com o
  guarda de uma avaliação só) continuam sujeitos à corrida do dev client em
  build Debug. Eles não foram migrados para o subflow novo: ficou fora do
  escopo.

## Medido × inferido

- **Medido:** as execuções e durações acima; o estado da trilha antes e
  depois da folha; os carimbos de 1 ms no armazenamento do app
  (`@radiant:sr_schedule_v1`, `@radiant:learning_attempts_v1`); o nó do HUD
  até x=443 em 402 pt; o binário instalado com o carimbo do build; o gate
  (abaixo).
- **Inferido do código, não medido:** "Fechar quiz" reproduz o defeito 1 como
  a folha; o botão "Revisar agora" nunca aparece na folha aberta pela lição
  (`dueReviewCount={0}`), e não se investigou se isso é intencional.

## Gate

`EXPO_NO_DOTENV=1 npm run quality` em `radiant-app`, Node `v20.20.2`, em
2026-09-24, com o Metro parado e nenhum flow rodando: **exit 0**. Suíte
inteira: **147 suítes / 1374 testes** Jest; contrato do Maestro **22/22**
(eram 21, mais o teste novo); lint com 0 erros e **26 avisos**; visual QA
estrito sem regressão. Mesma contagem Jest da medição de 2026-09-23, como
esperado: a mudança não toca o Jest. A árvore medida inclui só os arquivos
desta frente. O gate não empacota o app nem roda flows: o E2E acima é a
evidência que ele não dá.

## O que não foi verificado

- O dia 2 do caminho 2.
- Android, aparelho físico, build Release e configuração de produção. O
  E2E rodou em Debug, com dev client e Metro.
- Gate H4.

## Para a próxima sessão

1. **A partir de 2026-09-25 11:55 (−03):** subir o Metro (Node 20, `start-ios-v2.sh`
   sem `--ios`) e rodar `maestro test .maestro/radiant-1-4-segundo-dia.yaml`
   no simulador `E3C547AE-4D2B-4C2D-9E0A-43AC36BBD1AD`, **sem rodar antes
   nenhum flow com `clearState`**. O binário instalado é o das 11:01 de
   2026-09-24; não reinstale. Registrar o resultado na evidência, na matriz do
   runbook e na FILA.
2. Gate H4, no mesmo build.
3. Os três defeitos, um run cada, com vermelho antes; o primeiro espera a
   decisão do dono.
