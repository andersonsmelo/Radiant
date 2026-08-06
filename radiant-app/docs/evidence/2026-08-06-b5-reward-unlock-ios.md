# B5 — `reward-unlock` executado no iOS — 2026-08-06

- **Data da execução:** 2026-08-06, 08:31–08:47 (`-03`)
- **Alvo:** simulador `Radiant iPhone 17 Pro — iOS 26.5`
  (`3DA4F77E-086B-4C6F-A0B5-FECEA0F4A164`)
- **Binário:** build local **Release** equivalente ao perfil `e2e-test`, com as
  sete variáveis `EXPO_PUBLIC_*` do perfil; bundle JS embutido, sem servidor de
  desenvolvimento
- **Resultado:** `passed` — **170 passos `COMPLETED`, 0 `FAILED`**, saída 0
- **Contrato do flow antes da execução:** 16 asserções, 0 falhas
  (`npm run test:maestro-contract`)
- **Android:** **não executado** — a outra metade da B5 continua aberta

O simulador é o caminho medido do runbook para iOS; não é substituto do device
para gates humanos, e esta execução não afirma nada sobre eles.

## O que o flow provou

A regra de destravamento, pelo caminho do produto. O flow **não** usa
`radiantapp://reward` — chegar por deep link provaria de novo o que
`reward-locked.yaml` já prova e deixaria a regra descoberta. A sequência
executada foi: apresentação dispensada → `Foco de hoje` → sete lições
encadeadas por seis checkpoints → o CTA `Receber conquista` aparecendo **na
home** → tela da conquista → coleta.

As asserções que carregam o significado:

| Momento | Asserção | Resultado |
| --- | --- | --- |
| Antes da coleta | `Pronta para ser coletada` | `COMPLETED` |
| Antes da coleta | `13 de 14 marcos da unidade concluídos` | `COMPLETED` |
| Confirmação | `Pronto para coletar essa conquista?` | `COMPLETED` |
| Depois da coleta | `Conquista registrada` / `Salva no seu progresso` | `COMPLETED` |
| Depois da coleta | `14 de 14 marcos da unidade concluídos` | `COMPLETED` |

O par `13 de 14` → `14 de 14` é o que separa "a tela abriu" de "a regra
contou": o marco que faltava era a própria coleta.

## Como a build foi provada nova, e por que isso está aqui

A primeira tentativa usou `npx expo run:ios` e **falhou** — CocoaPods ausente no
host. Dois fatos quase transformaram isso em evidência falsa:

1. o comando havia sido encadeado com diagnóstico por `;`, então o status final
   veio do último elo e a execução foi anunciada como bem-sucedida;
2. o simulador **já tinha o Radiant instalado**, de uma build de 2026-08-04.

Rodar o flow ali teria produzido um `passed` verdadeiro sobre o binário errado,
com data de hoje. O runbook já previa a falha e o caminho: CocoaPods ausente só
bloqueia `expo run:ios`; `xcodebuild` sobre um `Pods/` consistente não precisa
do `pod`. A build foi refeita por esse caminho e a identidade do artefato foi
**verificada antes de medir** — `BUILD SUCCEEDED`, `.app` gerado às 08:31, e o
bundle instalado no simulador com o mesmo carimbo, após `simctl uninstall`.

Regra que vale carregar: *"o comando terminou" e "o artefato é o desta
execução" são afirmações independentes*, e ambiente com estado persistente
transforma a primeira em medição errada silenciosa.

## O que continua aberto

1. **Android da B5** — `reward-unlock` no emulador, ~13 min em janela exclusiva
   de host. Enquanto não rodar, a B5 não fecha.
2. Esta execução não toca B4, B8, C4 ou C5.
