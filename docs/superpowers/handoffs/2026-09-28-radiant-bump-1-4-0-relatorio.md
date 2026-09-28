# Relatório — bump para 1.4.0 (FILA, 20)

**Sessão:** 2026-09-28, de manhã (−03), na mesma conversa do 25
([relatório](2026-09-27-radiant-anuncio-perda-de-vida-relatorio.md)). O dono
deu o ok para o bump e pediu para seguir para a próxima tarefa na mesma
conversa.
**Branch:** `feat/d4-decisoes-de-revisao`, que é o da PR
[#38](https://github.com/andersonsmelo/Radiant/pull/38), ainda aberta.
**Run do Loop:** `run-1790592251308-cdfffe3d`.

## O que mudou

- A versão `1.4.0` foi para quatro lugares:
  - `radiant-app/app.json` (`expo.version`);
  - `radiant-app/package.json`;
  - as duas raízes do `radiant-app/package-lock.json`: `version` e
    `packages[""].version`.
- Guarda nova, `radiant-app/src/config/appVersion.contract.test.ts`:
  - exige a mesma versão nos quatro lugares;
  - exige que a versão tenha o formato `MAIOR.MENOR.CORREÇÃO`.

  Ela lê o JSON, e não o texto.

**O que não mudou, de propósito:**
- **O número de build.** O `eas.json` usa `appVersionSource: remote`, desde
  abril, e a build de produção incrementa sozinha. O `buildNumber` e o
  `versionCode` do `app.json`, em 3, são ignorados pelo EAS. A loja já está
  no build 11.
- **As pastas nativas.** `ios/` e `android/` são geradas e não estão
  versionadas, então o EAS tira a versão do `app.json`.

**Consequência:** a `runtimeVersion` segue a versão do app
(`policy: appVersion`) e passa a ser `1.4.0`. Uma atualização OTA publicada
para a 1.4 não chega a quem estiver na 1.3.1. Hoje não existe nenhuma no
canal de produção (STATUS, medido em 2026-09-23).

## Por que a guarda

O bump da 1.3.1 (`68bd097`, 2026-08-03) mudou `app.json` e `package.json` e
esqueceu o `package-lock.json`, que ficou dizendo 1.3.0 por sete semanas. Ele
só foi acertado em 2026-09-23 (`8f9224e`), de carona num `npm install` sem
relação com versão. Nada falhou nesse meio-tempo.

## Evidência

**Medido, no Node `v20.20.2`:**
- **Antes do bump,** a guarda passou com tudo em 1.3.1.
- **Vermelho natural:** refiz o bump exatamente como o da 1.3.1, só no
  `app.json` e no `package.json`. A guarda de igualdade reprovou, e o diff
  mostrou as duas raízes do lockfile em `1.3.1` contra `1.4.0`.
- **Verde** depois de atualizar o lockfile: 2 de 2.
- **A guarda de validade vista falhando pelo defeito dela:** com "1.4" nos
  quatro lugares, a de igualdade continuou verde e só a de validade reprovou
  (`Received string: "1.4"`). É o caso da regra 1 das guardas no AGENTS.md:
  igualdade sozinha autorizaria esse defeito. Os arquivos foram restaurados a
  partir de cópias.
- **Gate** `EXPO_NO_DOTENV=1 npm run quality`, em 2026-09-28 às 07:50: exit 0,
  **153 suítes / 1457 testes** (eram 152 / 1455; a guarda soma uma suíte e dois
  testes), lint com 0 erros e 26 avisos, visual QA com 0 regressões.

**Não verificado:**
- **Nenhuma build foi feita com a 1.4.0.** A build de produção e o envio são
  do dono (FILA, 30).
- **A captura de revisão dos produtos da assinatura.** Pela ADR, ela foi feita
  em 2026-09-15. A tela da assinatura mudou desde então ("Gerenciar" e ordem
  dos planos). Se ela precisa ser refeita é decisão do dono; o agente não a
  viu.

## Arquivos

- `radiant-app/app.json`, `radiant-app/package.json`,
  `radiant-app/package-lock.json`
- `radiant-app/src/config/appVersion.contract.test.ts` (novo)
- `docs/STATUS.md`, `docs/archive/STATUS_historico.md`
- `docs/FILA.md` (20 fora e 30 novo), `docs/archive/FILA_concluidos.md`
- `docs/plans/2026-07-27-radiant-launch-roadmap.md`
- este relatório e o
  [prompt (10)](2026-09-28-radiant-prompt-de-continuidade-10.md)

## O que fica

- **O que segura a 1.4 agora é só do dono:**
  - 28, o merge da #38;
  - 30, a build de produção e o envio, com os produtos junto da versão
    (regra 8 da
    [ADR](../../adr/ADR-2026-09-15-radiant-ilimitado-storekit-products.md)).
- **A próxima frente do agente é o 7a,** as variantes da amostra da L1.
