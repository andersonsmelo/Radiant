# E2E iOS — primeira vitória (2026-08-09)

## Resultado

| Plataforma | Estado | Escopo |
| --- | --- | --- |
| iOS | `passed` | `first-run.yaml`, 1/1 flow |
| Android | não executado | requer nova execução após a mudança de 2026-08-09 |

O fluxo atualizado atravessou a instalação limpa, as três telas da apresentação,
o aviso educacional e **Começar**. A apresentação deixou de estar visível e a
tela seguinte exibiu o contexto real da primeira lição:

> Você vai começar pelo papel dos raios-X e pelo raciocínio básico de contraste
> e radiopacidade.

Essa asserção prova o novo desfecho de primeira vitória no app executado; não é
apenas inspeção do YAML ou teste Jest.

## Ambiente e artefato

- commit: `1ecb1a3`;
- destino: simulador `Radiant iPhone 17 Pro`, iOS 26.5;
- configuração nativa: `Release`;
- bundle: `com.ascendcreative.radiant`;
- produto: `Radiant.app` gerado localmente pelo workspace
  `radiant-app/ios/Radiant.xcworkspace` e scheme `Radiant`;
- Maestro: CLI local, execução isolada do flow `first-run.yaml`.

Comando executado, com o identificador efêmero do simulador sanitizado:

```bash
/Users/anderson/.maestro/bin/maestro --no-ansi \
  --device "<SIMULATOR_UDID>" \
  test .maestro/first-run.yaml
```

Resultado do processo: exit code `0`.

## Passos observados

1. `launchApp` com `clearState: true`;
2. slide 1 visível e avanço;
3. slide 2 visível e avanço;
4. slide 3 visível e avanço;
5. aviso educacional visível;
6. toque em **Começar**;
7. apresentação ausente;
8. cópia de contexto da primeira lição visível.

## Diagnóstico do build

O controlador do build esgotou seu limite de 300 segundos, mas o processo filho
`xcodebuild` permaneceu ativo e continuou atualizando o DerivedData. Não foi
aberto um segundo build. Após o processo terminar, o produto foi localizado,
seu bundle foi conferido, e o app foi instalado e iniciado antes do Maestro.

Esse timeout de controle não foi tratado como falha do app nem como resultado do
build; a evidência que promove o flow a `passed` é a instalação, o launch e o
exit `0` do Maestro sobre o produto concluído.

## Limites

- a evidência cobre somente o flow de primeira vitória no iOS;
- não reexecuta os outros flows da matriz de 2026-08-03;
- não promove Android, aparelho físico, App Review ou liberação de loja;
- não contém conta, token, credencial, identificador de aparelho físico nem
  artefato bruto do Maestro.
