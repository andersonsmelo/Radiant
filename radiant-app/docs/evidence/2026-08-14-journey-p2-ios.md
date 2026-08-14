# Jornada P2 — iOS Release — 2026-08-14

**Estado:** `passed` no escopo P2. Este registro fecha somente os caminhos de
runtime que estavam ausentes no handoff da jornada; não promove um gate de loja
nem substitui E2E completo.

## Ambiente e artefato

- **Código:** commit `0ceff49` (`main` e `origin/main` no momento da medição).
- **Destino:** simulador `Radiant iPhone 17 Pro — iOS 26.5`
  (`3DA4F77E-086B-4C6F-A0B5-FECEA0F4A164`).
- **Build:** `Release`, scheme `Radiant`, bundle `com.ascendcreative.radiant`,
  versão nativa `1.3.1 (3)`.
- **Configuração JS:** equivalente a `e2e-test`: Learning Road ligada; dev
  tools, telemetry debug, beta gate, push e sync remoto desligados.
- **Artefato:** `main.jsbundle` embutido, SHA-256
  `12216976c787b9317d2bc182e6120a538bec89589fc64ab7de21258baf17de0b`.

O app instalado anteriormente foi removido só depois do backup do seu
`AsyncStorage`; ao fim, o armazenamento original foi restaurado e o arquivo
externo temporário do fixture não permaneceu no container.

## Execução

O build foi produzido sem Metro, por:

```sh
EXPO_NO_DOTENV=1 EXPO_PUBLIC_APP_ENV=development \
EXPO_PUBLIC_ENABLE_DEV_TOOLS=false EXPO_PUBLIC_ENABLE_TELEMETRY_DEBUG_SCREEN=false \
EXPO_PUBLIC_ENABLE_BETA_GATE=false EXPO_PUBLIC_ENABLE_LEARNING_ROAD=true \
EXPO_PUBLIC_ENABLE_PUSH=false EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false \
xcodebuild -workspace ios/Radiant.xcworkspace -scheme Radiant \
  -configuration Release -sdk iphonesimulator \
  -destination "platform=iOS Simulator,id=3DA4F77E-086B-4C6F-A0B5-FECEA0F4A164" \
  -derivedDataPath ios/build/p2-journey-release CODE_SIGNING_ALLOWED=NO build
```

Depois da instalação limpa, fixtures temporários foram escritos apenas no
`AsyncStorage` do simulador, com o app encerrado. A árvore foi inspecionada com
`maestro hierarchy` e a tela foi capturada por `simctl io screenshot`. Os PNGs
permanecem fora do Git por política de evidência; hashes sanitizados:

| Caso | Screenshot SHA-256 | Resultado observado |
| --- | --- | --- |
| Revisão + próxima etapa | `42939506f237f5058a51bfccc94554f2798a39156571ae28c6b75069271342aa` | `Checkpoint · Disponível`; CTA `Abrir checkpoint` |
| Somente revisão aberta | `59cece9a87997f2e5508ef887f288abc88614881a7ab2696722da50626109321` | `Revisão`; CTA `Fazer revisão` |
| Fundamentos concluídos | `6abadb7e6860866e1b78619e9c72bff87a7f70497eade3fd88068e707561d9ef` | `Radiação, Modalidades e Equipamento`; `Lição · Disponível`; CTA `Continuar jornada` |

## Conclusão

- **P2-a:** `passed`. A Home não promove revisão vencida quando há etapa de
  aprendizado elegível; no caso em que a revisão é a única etapa, o CTA a nomeia
  sem fingir que abrirá uma lição.
- **P2-b:** `passed`. A conclusão de todos os nós de Fundamentos fez
  `JourneyProgressService` derivar a trilha seguinte no próximo bootstrap.
- **Restauração:** `passed`. O manifesto restaurado teve SHA-256
  `656abaf03e0b3d6dd564927434663ac1bb72fde29b7e86737e0049a4b828357e`,
  idêntico ao backup anterior ao fixture.

**Próxima ação:** decisão de produto para a conclusão de todas as trilhas (P3)
e recebimento dos arquivos `.riv` do dono para P4.
