# E2E Android — primeira vitória (2026-08-09)

## Resultado

| Plataforma | Estado | Escopo |
| --- | --- | --- |
| Android | `passed` | `first-run.yaml`, 1/1 flow |

O flow atualizado atravessou a instalação limpa, as três telas da apresentação,
o aviso educacional e **Começar**. A apresentação deixou de estar visível e a
tela seguinte exibiu o contexto real da primeira lição:

> Você vai começar pelo papel dos raios-X e pelo raciocínio básico de contraste
> e radiopacidade.

Resultado do processo Maestro: exit code `0`.

## Ambiente e artefato

- commit: `e7b30a2`;
- destino: emulador `Radiant_Pixel_9_API_36`, Android API 36;
- configuração JavaScript: `production`, Learning Road e push habilitados,
  dev tools, beta gate e sync remoto desabilitados;
- configuração nativa: `Release`, target SDK 36;
- pacote: `com.ascendcreative.radiant`;
- versão conferida no pacote instalado: `versionName=1.3.1`, `versionCode=3`;
- SHA-256 do APK: `0531707c948db22fffa02d45e62ae1d67c5dbf2d02c0a0f4a9cdbf9d5f38ab70`.

O APK foi gerado em clone temporário do commit para que prebuild e Gradle não
criassem milhares de subprodutos ignorados dentro do checkout supervisionado.
O prebuild passou, o `assembleRelease` terminou com `BUILD SUCCESSFUL` em 5m01s
e o daemon do Gradle foi encerrado antes da medição.

Comando da medição, com o serial efêmero sanitizado:

```bash
/Users/anderson/.maestro/bin/maestro --no-ansi \
  --device "<EMULATOR_SERIAL>" \
  test .maestro/first-run.yaml
```

## Passos observados

1. `launchApp` com `clearState: true`;
2. slide 1 visível e avanço;
3. slide 2 visível e avanço;
4. slide 3 e aviso educacional visíveis;
5. toque em **Começar**;
6. apresentação ausente;
7. cópia de contexto da primeira lição visível.

## Limites

- a evidência cobre somente o flow de primeira vitória no emulador Android;
- não reexecuta os outros flows da matriz de 2026-08-03;
- não promove aparelho Android físico, TalkBack, teste fechado ou janela de 14
  dias;
- não contém conta, token, credencial, serial do emulador nem artefato bruto do
  Maestro.
