# ADR — A 1.4 compila no Xcode 26.0 fixado; `UIScene` entra pela atualização do SDK (2026-09-24)

**Status:** aceita  
**Decisor:** Anderson Melo (dono do projeto), em 2026-09-24, nesta conversa  
**Escopo:** Radiant 1.4 · build iOS no EAS · política do Loop  
**Insumos:** [pesquisa de 2026-09-24](../release/2026-09-24-ios27-decisao-xcode-uiscene.md),
com as medições M1 a M12 citadas abaixo

## Contexto

Compilado com o Xcode 27, o app fecha na abertura no iOS 27. O SDK do iOS 27
exige o ciclo de vida por cenas (`UIScene`), e o `AppDelegate` do Expo 54 / RN
0.81 não o adota. Isso foi medido no simulador em 2026-09-23.

Medido em 2026-09-24:

- o `eas.json` não fixava imagem, e o padrão do SDK 54 no EAS é
  `macos-sequoia-15.6-xcode-26.0` (M1, M2);
- a build de produção da 1.3.1 saiu dessa imagem, com o `iPhoneOS26.0.sdk`
  (M3). O binário que fecha só sai desta máquina, que tem apenas o Xcode 27
  (M10);
- o EAS não tem imagem com Xcode 27 (M5);
- a partir de abril de 2027, a Apple exige o SDK do iOS 27 em todo envio (M6);
- o SDK 54 não tem `UIScene` oficial, nem no patch `54.0.37`. A Expo o traz no
  SDK 58 e como opção `ios.enableSceneSupport` no `57.0.23` (M7, M8).

## Decisão

1. **Os perfis de iOS do `radiant-app/eas.json` fixam
   `"image": "macos-sequoia-15.6-xcode-26.0"`.** A imagem vai nos perfis-base
   `development`, `preview` e `production`, e os outros quatro a herdam por
   `extends`. Conferido com `npx eas config --profile <perfil> --platform ios`
   nos 7 perfis, em 2026-09-24. É a mesma imagem que produziu a 1.3.1. Fixar
   impede que uma troca do padrão pela Expo mude o Xcode no meio das builds da
   1.4 (`development`, sandbox, produção).
2. **O `UIScene` entra pela atualização do SDK, não por plugin próprio sobre o
   SDK 54.** A frente vem depois da 1.4 e fecha antes de abril de 2027. O
   destino preferido é o SDK 58, onde o `UIScene` é o padrão.
3. **`.claude/settings.local.json` entra em `context.excludes` do
   `.loop/project.yaml`.** O app do Claude reescreve esse arquivo no meio do
   run. Em 2026-09-24 ele derrubou um run com os 14 validadores verdes, porque
   o guarda de escopo fotografa o disco e não o git.

## Alternativas rejeitadas

- **Deixar o padrão sem fixar:** o resultado de hoje seria o mesmo, mas a
  página da Expo não promete que o padrão do SDK 54 não muda.
- **Plugin de `UIScene` próprio no SDK 54:** é código nativo nosso, perde a
  validade quando o SDK for atualizado e exige E2E de deep link, notificação,
  splash e retorno do segundo plano no iOS 26 e no 27. Atrasaria a 1.4.
- **Atualizar o SDK antes da 1.4:** são três saltos de SDK (RN 0.81 → 0.86 ou
  0.88), e a janela de lançamento passaria a depender de uma migração.

## Consequências

- A primeira build da 1.4 roda com o Xcode 26.0 e o SDK do iOS 26.0, como a
  1.3.1. Falta conferir num aparelho com iOS 27 (inferido pela regra da Apple,
  não medido).
- Compilar localmente nesta máquina continua exigindo simulador iOS 26.5 (STATUS,
  "Risco de build").
- **Reabrir esta ADR quando:**
  - a Expo retirar a imagem `macos-sequoia-15.6-xcode-26.0`;
  - a App Store Connect deixar de aceitar envio feito com o Xcode 26.0;
  - chegar a hora da frente de atualização do SDK, com prazo até abril de
    2027. A linha `image` sai do `eas.json` nessa frente.
