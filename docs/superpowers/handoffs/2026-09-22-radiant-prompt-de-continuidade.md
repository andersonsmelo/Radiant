# Prompt de continuidade — Radiant, depois da sessão de 2026-09-22

Substitui o [prompt 2](2026-09-14-radiant-1-4-prompt-de-continuidade-2.md) —
link relativo porque esta linha fica FORA do bloco colável —, que
levou a 1.4 até a Task 8. Cole o bloco entre as linhas `---` como primeira
mensagem.

---

Você vai continuar o Radiant, um app iOS de treinamento em radiologia (Expo /
React Native). A sessão anterior deixou sete commits numa branch local e duas
frentes abertas. Você trabalha com o dono, que lê o resultado e toma as decisões
de loja e de aparelho.

## 1. A primeira coisa, antes de ler qualquer outra

A branch `docs/l2-parecer-v3` tem **sete commits que existem só na máquina
local**. Meça antes de fazer qualquer plano:

```bash
git fetch origin && git rev-list --count origin/main..HEAD && git status --porcelain
```

Se o número não for zero, o trabalho descrito abaixo ainda não é visível para
mais ninguém. Empurrar é decisão do dono — pergunte, não presuma.

## 2. Leia, nesta ordem

1. `AGENTS.md` — o contrato entre IAs. Duas seções valem mais que o resto:
   **"Quatro lições sobre GUARDAS"** (de 2026-09-22) e **"Três lições de
   MEDIÇÃO"** (de 2026-09-15). As duas foram escritas depois de custarem
   retrabalho; não as redescubra.
2. `docs/STATUS.md` — o único documento de estado vivo. Toda afirmação lá tem
   data de medição e, quando existe, o comando que a remede. **Remeça antes de
   citar.**
3. `docs/FILA.md` — o documento acionável. É dele que sai o próximo item.
4. `docs/README.md` — o mapa, se precisar achar algo que não está nos dois acima.

Para a frente em que for trabalhar, leia também:

- **1.4 / Task 8:** `docs/superpowers/specs/2026-09-14-radiant-1-4-fluxo-do-usuario-design.md`,
  `docs/adr/ADR-2026-09-15-radiant-ilimitado-storekit-products.md` e
  `docs/release/CHECKLIST_DECLARACOES_1.4.md`.
- **Currículo V3 / L2:** os três pareceres, **em ordem** —
  `docs/content/2026-09-22-l2-parecer-v3.md`, `-v4.md` e `-v5.md`. O padrão entre eles é mais
  importante que o conteúdo de qualquer um; a §4 abaixo explica por quê.

## 3. Estado medido em 2026-09-22

**Publicado:** `1.3.1 (11)` na App Store, liberado em 2026-09-14.

**Task 8 da 1.4 — duas de seis fatias fechadas**, e a FILA as ordena por
dependência, não pela ordem em que foram escritas:

| | Fatia | Estado |
| --- | --- | --- |
| 1 | Sentry com configuração mínima | ✅ `794124f` |
| 5 | Checklist de declarações à loja | ✅ `e03120c`, linhas de assinatura bloqueadas |
| 2 | Adaptador StoreKit real | ⚠️ **precisa de decisão do dono sobre `expo-iap`** |
| 3 | `QuizTopBar` com ∞ | depende de (2) |
| 4 | E2E dos três caminhos dourados | depende de (2) e de aparelho |
| 6 | Bump para `1.4.0` | por último; regra 8 da ADR |

A porta `StoreKitPort` e o `UnavailableStoreKitAdapter` já existem em
`features/subscription/`; falta o adaptador real atrás da mesma porta. `expo-iap`
é **dependência nativa**: instalar muda `package.json` e o conteúdo do próximo
build, e o adaptador não pode ser validado sem build em aparelho.

**Privacidade, medido e verificável:** o ambiente `production` do EAS tem **uma
variável só**, o DSN do Sentry. Sem `EXPO_PUBLIC_API_BASE_URL` e sem
`EXPO_PUBLIC_ENABLE_CRASH_REPORTING`, as três portas de saída estão fechadas por
construção, e "Dados não coletados" é verdadeiro. Remeça com
`cd radiant-app && npx eas env:list --environment production`.

**L2 do currículo V3 — cinco auditorias, cinco reprovações.** A v6 foi submetida
em `949a5f0` e o parecer está pendente. Os seis críticos do parecer v3 e os três
do v4 estão confirmados resolvidos no código.

## 4. A coisa mais importante deste documento

**Três passagens seguidas, na L2, a correção de um achado produziu o achado
seguinte — e a guarda escrita junto com a correção era cega justamente a ele.**

- O C4 (rotear todo aprendiz à recuperação) gerou **N1**: uma regra de borda que
  zerava a continuação, até então alcançável só por quem errava, virou o caminho
  de todos e passou a encerrar a lição.
- A correção do N2 (fazer o candidato seguir a região) gerou **P1**: nove figuras
  saíram do `viewBox`, incluindo a resposta correta de duas recuperações.
- A guarda escrita para o N2 exigia que duas matrizes **diferissem** — e uma
  translação para fora do quadro satisfaz isso com folga.

**Antes de corrigir qualquer achado, responda por escrito:**

1. **Que regra ou invariante passa a ser encontrada por uma população que não a
   encontrava antes?** O diff não mostra isso por construção — o código que vai
   falhar não está nele, porque não foi editado.
2. **A guarda nova afirma validade, ou só diferença?** Se ela só proíbe
   igualdade, ela aceita todo o resto — inclusive o defeito que você está prestes
   a introduzir.
3. **Você viu a guarda falhar com o defeito específico que ela nomeia?** Derrubar
   com um defeito vizinho não diz nada. E escrever em prosa que "o teste falhou
   antes" é **inauditável** para quem revisa: registre a execução vermelha.

## 5. Regras que valem sempre

- **O Loop é o contrato.** Trabalho material vai por `loop run start` →
  `context build` → `step begin` → editar só o declarado → `validate` →
  `step finish` → `memory write` → `run close`, em invocações separadas, lendo o
  envelope de cada uma. O escopo declarado é **imutável**: resolva os caminhos
  contra o disco antes de declarar.
- **O gate é `EXPO_NO_DOTENV=1 npm run quality`, e nada menos.** `npx jest`
  direto mede outra coisa. Testes e builds no **Node 20**; o `loop` usa o 24, e
  exportar o PATH errado contamina os comandos seguintes sem aviso.
- **Invoque todo comando `loop` a partir da raiz do projeto.**
  `BRAIN_SESSION_NOT_FOUND` quase sempre é cwd errado, não sessão morta.
- **Não faz build, envio nem push sem autorização datada do dono.**
- **Rodar `loop validate` de novo só para reler a saída custa um ciclo de
  progresso.** A cópia durável está em `.loop/runs/<runId>/state.json`.
- **Se o processo morrer durante a validação**, o run fica em `validating` sem
  evidência e não há saída para frente: leia `state.json` e `events.jsonl` antes
  de reemitir comando, feche o run, e **reabra com a árvore limpa** — o
  checkpoint novo captura o estado atual como baseline, então o trabalho pronto
  vira estado pré-existente se você não salvá-lo e reverter antes.
- **Auditor independente por pacote de lição**, conforme o §5 de
  `docs/runbooks/curriculum-v3-arco-1.md`. No brief dele,
  diga que a descrição do autor é **hipótese a testar**, não contexto a confiar —
  foi o que fez a diferença entre os pareceres v1–v3 e os v4–v5.

## 6. O que é do dono, e não encurta com trabalho de IA

1. ⏰ **Verificação de desenvolvedor Android — prazo 30/09/2026.** Não conferido.
   Sem bloqueio técnico: abrir `play.google.com/console` direto, nunca pelos
   botões do e-mail.
2. 🔴 **F2 — opt-ins do closed test do Play.** Caminho crítico inteiro, com a
   **medição mais antiga da fila**: 2026-08-03. Não existe comando que a remeça.
3. ⚖️ **`expo-iap`** — instalar ou não; trava as fatias 2, 3 e 4.
4. ⚖️ **`EXPO_PUBLIC_ENABLE_CRASH_REPORTING`** — ligar exige revisar as Privacy
   Labels antes da submissão, nunca depois.
5. ⚖️ **Acordo de apps pagos** — aceitar os termos **não** ativa o acordo;
   confirme o estado *Ativo* antes de submeter.
6. ⚖️ **I2 da L2** — criar código de erro novo na spec para a confusão
   coronal×transversal; fora da autoridade da lição.
7. ⚖️ **Os quatro falsos kill switches** — `ENABLE_REVIEW`,
   `ENABLE_GAMIFICATION`, `ENABLE_ONBOARDING`, `ENABLE_HEURISTICS` estão fixos em
   `true`. Viram flags de verdade ou mudam de nome.
8. ⚠️ **A L1, já aprovada, carrega o defeito exato do C6 da L2** — rótulo preso à
   identidade da alternativa renderizado ao lado do número por posição. A
   correção não foi propagada.

## 7. O relatório

Termine com um relatório curto em `docs/superpowers/handoffs/`, e atualize
`STATUS.md` e `FILA.md` **na mesma passagem**. Atualizar o estado sem atualizar a
fila já aconteceu três vezes neste projeto e o efeito é sempre o mesmo: o
documento acionável manda refazer trabalho pronto.

No relatório, separe o que foi **medido** do que foi **inferido**, e diga
explicitamente o que **não** foi verificado — em especial o que exigiria aparelho
físico, que nenhum teste desta suíte fecha.
