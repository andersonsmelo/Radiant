# Radiant — Status

**Único documento de estado vivo do projeto.** Diz o que é verdade **agora** e
nada mais. O que está executável fica na [`FILA.md`](FILA.md); o plano, no
[roadmap](plans/2026-07-27-radiant-launch-roadmap.md); as decisões, em
[`adr/`](adr/).

**Regra que mantém este arquivo curto:** quando uma afirmação deixa de ser
atual, ela sai daqui **no mesmo run** e vai, sem edição, para o fim de
[`archive/STATUS_historico.md`](archive/STATUS_historico.md). Nada de narrar o
passado aqui. Por isso, **todo run do Loop que edita este arquivo declara
também o histórico** no `abrir.mjs`: depois de aberto, o escopo não se amplia. Em 2026-09-23 este arquivo tinha 1.319 linhas e se contradizia:
dizia que a 1.3.1 estava no ar e, logo abaixo, que tinha sido rejeitada.

Toda afirmação traz **a data da medição** e, quando existe, **o comando que a
remede**. Contagem envelhece e comando não: remeça antes de decidir.

---

## Produção — o que o usuário tem hoje

| Frente | Estado | Medido em |
| --- | --- | --- |
| **App Store** | `1.3.1 (11)` publicado desde 2026-09-14. Binário = tag `v1.3.1` (`063770d`). | 2026-09-23 |
| **Atualização OTA** | Nenhuma no canal `production`: o que roda é exatamente o binário. | 2026-09-23 |
| **Google Play** | `1.3.0 (4)` em teste fechado (`alpha`), lista "Radiant Alpha". **Não está em produção.** | 2026-08-24 ⚠️ vencida |
| **API pública** | Inativa: HTTP 502 em `/health`, `/ready` e `/v1/content/catalog`. O app não depende dela: o sync remoto está desligado em todos os perfis do EAS. | 2026-09-23 |

```bash
curl -s 'https://itunes.apple.com/lookup?id=6797078156&country=br' | python3 -c "import json,sys;print([(r['version'],r['currentVersionReleaseDate']) for r in json.load(sys.stdin)['results']])"
cd radiant-app && npx eas update:list --branch production --limit 3 --non-interactive
for p in health ready v1/content/catalog; do curl -s -o /dev/null -w "$p %{http_code}\n" https://api.radiant.ascendcreative.com.br/$p; done
```

O estado do Play só se mede abrindo o Play Console; não há comando.

## Entre produção e `main` — a 1.4

A `main` está **94 commits e 198 arquivos à frente** do que está na App Store
(medido em 2026-09-23, `v1.3.1..78f96d0`). Nada disso chegou ao usuário:
vidas, assinatura StoreKit (Radiant Ilimitado), backup no iCloud (CloudKit) e o
currículo V3 (L1 e L2, ainda não ligados ao app).

```bash
git fetch origin && git rev-list --count v1.3.1..origin/main
```

**O que falta para a 1.4 sair** — detalhe e dono de cada item na
[`FILA.md`](FILA.md#prioridade--a-14-desenhada-em-2026-09-14):

1. **Dono:** build interno `development` com o módulo StoreKit (primeira
   compilação real do Swift) e teste de compra no sandbox.
2. **Agente, com aparelho:** E2E dos três caminhos dourados.
3. **Agente, por último:** bump para `1.4.0` — os produtos de assinatura só
   sobem junto com a versão (regra 8 da
   [ADR](adr/ADR-2026-09-15-radiant-ilimitado-storekit-products.md)).

Já fechado para a 1.4 (2026-09-23): acordo de apps pagos **Ativo** no App Store
Connect, com banco e formulários fiscais ativos; Ask to Buy decidido e
implementado.

## Prazos de relógio

| Prazo | O quê | Dono | Estado |
| --- | --- | --- | --- |
| **30/09/2026** | Verificação de desenvolvedor Android: pacote + fingerprint da chave registrados no Play Console. Sem isso, os builds de distribuição interna podem deixar de instalar em aparelho certificado. | dono | **não conferido** — [FILA, item 8](FILA.md#8-verificação-de-desenvolvedor-android--prazo-de-relógio-30092026) |

## Bloqueios abertos, por frente

- **Android em produção** — exige 12 testadores **participando** por 14 dias
  (F2). A última contagem é de **2026-08-03** (14 vinculados, 2 participando) e
  não serve para decidir nada. Só o dono mede, no Play Console. Também abertos:
  questionário IARC (E4), aparelho Android físico (C4) e TalkBack (C5).
- **Currículo V3** — L1 aprovada no parecer v4. **L2 reprovada nas seis
  revisões** (a v6 em 2026-09-22), e a v7 **pausada** em 2026-09-23. O
  **piloto da lição híbrida na L1**
  ([spec](superpowers/specs/2026-09-23-licao-hibrida-piloto-design.md),
  [ADR](adr/ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md)) foi
  **implementado em 2026-09-23 no branch `feat/licao-hibrida-piloto`**, ainda
  fora da `main` e sem build de distribuição: 12 itens gerados por regra, som e
  vibração, custo de vida só no desafio, rota `/licao-hibrida` atrás de
  `SHOW_DEV_TOOLS`. O V3 segue desligado. Bloqueio: a aprovação dos modelos
  pelo dono ([FILA](FILA.md)); depois, o teste com 3 a 5 pessoas antes de
  escalar.
- **Conteúdo editorial (D4)** — 30 itens `needs-review`, decompostos em três
  fatias (medido em 2026-08-08).
- **Gate H4** (checkpoint, reforço, retomada e acessibilidade) — engenharia na
  `main` desde 2026-08-13; falta percorrer a experiência no simulador ou aparelho.

## Defeito conhecido

**`ENABLE_REMOTE_SYNC` não desliga o `AuthService`.** A flag controla só a
exibição e o envio da fila de sync; o auth decide por `isApiConfigured()`.
**É inerte em produção**, porque nenhum perfil do EAS define
`EXPO_PUBLIC_API_BASE_URL` (medido em 2026-09-23). Aberto por decisão do dono:
mexer nisso afeta login, sync e o contrato de telemetria. Detalhe em
[`2026-08-21-varredura-qa.md`](../radiant-app/docs/evidence/2026-08-21-varredura-qa.md).

## Kill switches reais

Dois, medidos em 2026-09-23: `ENABLE_LEARNING_ROAD` (trilha contra Home antiga)
e `ENABLE_REVIEW` (por `EXPO_PUBLIC_ENABLE_REVIEW`, padrão `true`). São lidos
em build, então só se acionam por build novo ou OTA. A guarda
`src/config/killSwitches.contract.test.ts` barra flag `ENABLE_*` fixa ou sem
leitor.

## Gate de qualidade

```bash
cd radiant-app && EXPO_NO_DOTENV=1 npm run quality
```

19 passos: lint, typecheck, 15 contratos, Jest em banda única e visual QA
strict. **Última medição: 2026-09-23**, em `b7aa165` (mesma árvore do app que a
`main` atual), Node `v20.20.2`: exit 0, **134 suítes / 1224 testes**, lint com
0 erros e 26 avisos, visual QA sem regressão. O CI roda o mesmo comando inteiro
(`.github/workflows/radiant-app-quality.yml`).

Testes e builds do app rodam no **Node 20**; só a CLI `loop` usa o 24. Confira
com `node --version` antes de citar qualquer número.

### O que o gate NÃO pega

- **Não empacota o app.** Um app que não abre passa nos 19 passos (aconteceu em
  2026-08-21). Subir no simulador faz parte de verificar uma entrega.
- **Os flows do Maestro não rodam no gate**; só o contrato deles, que confere
  estrutura e não texto de tela. Ao mudar texto, procure em `.maestro/` no
  mesmo passo.
- **`npm run quality` e `loop validate` são conjuntos diferentes.** Ao mexer em
  documentação governada, rode os dois.

## Repositório

Medido em 2026-09-23: `origin/main` em `78f96d0` (merge do PR #21). Nenhum PR
aberto antes desta consolidação.

Os branches locais já mergeados foram apagados em 2026-09-23. **As quatro
worktrees em `.claude/worktrees/` ficam**: cada uma guarda de 1 a 3 runs do
Loop em `.loop/runs/`, que o git ignora, e remover a worktree apagaria essa
evidência. A `zealous-shannon-01c8e3` tem alterações não commitadas em
`AGENTS.md`, `docs/FILA.md`, `docs/STATUS.md` e num script de conteúdo —
**não descarte sem o dono**. Apagar os branches remotos já mergeados também é
decisão do dono.

```bash
git fetch origin && gh pr list --state open
git worktree list
for w in .claude/worktrees/*/; do echo "$w $(git -C $w status --porcelain | wc -l)"; done
```

## Cérebro do projeto (Obsidian)

Medido em 2026-09-23: das 10 notas, as 8 de base não mudam desde 2026-07-24 e
têm fatos vencidos. A `05 Aprendizados validados` tem 319 entradas, porque
`loop memory write` só acrescenta nessa nota. **Para estado, vale este
arquivo, não o cérebro.** Reprojetar as notas exige um comando novo no Loop,
decidido pelo dono em 2026-09-23 e ainda não construído.
