# Evidência — F5, widgets do iOS (2026-11-15)

Decisão: [ADR 2026-11-15](../../adr/ADR-2026-11-15-widgets-ios.md). Plano:
[2026-11-15-f5-widgets](../../plans/2026-11-15-f5-widgets.md). Runbook do dono:
[widgets do iOS](../../runbooks/2026-11-15-widgets-ios.md).

| Arquivo | O que prova |
| --- | --- |
| [`vermelho-retrato.txt`](vermelho-retrato.txt) | Cada asserção do retrato vista falhando pelo defeito que nomeia: versão ingênua (sequência crua, uma entrada só, meta sem data); corte da linha do tempo no primeiro dia repetido; estudo "no futuro"; meia-noite errada no dia de mudança de horário (implementação defeituosa temporária, `TZ=America/New_York`). Registra também um vermelho que falhou pelo motivo errado e foi corrigido. |
| [`vermelho-plugin.txt`](vermelho-plugin.txt) | Plugin ingênuo (aplica sempre, pasta padrão, sem App Group, fora do `app.json`): as nove asserções falham. A asserção "chave desligada devolve a config intacta e não chama o apple-targets" é a contraprova exigida. |
| [`vermelho-ponte.txt`](vermelho-ponte.txt) | Ponte ingênua (ignora a chave, recarrega antes de gravar, deixa o erro subir, URL sem codificar, `ENABLE_WIDGETS` ausente); módulo nativo ausente; chamadas concorrentes sem fila. |
| [`prebuild-chave-desligada.txt`](prebuild-chave-desligada.txt) | Prebuild com a chave desligada igual ao da `main` (a única diferença é o identificador aleatório do Sentry, que muda entre dois prebuilds da própria `main`), inclusive com o `node_modules` da `main` instalado pelo próprio lockfile. Com a chave ligada: alvo, App Group e permissões do alvo. |
| [`pod-install.txt`](pod-install.txt) | O podspec do módulo local só entra com a chave ligada; o `ExtensionStorage` do pacote fica fora nos dois casos (iOS 16.4 > alvo 15.1). |
| [`xcodebuild.txt`](xcodebuild.txt) | Compilação Release para o simulador com a chave ligada, as duas tentativas que falharam e por quê, e o retrato gravado no App Group pelo app rodando. **O widget em si não foi visto** (motivo no arquivo). |
| [`revisao.md`](revisao.md) | Achados da revisão independente e o tratamento de cada um. |
| [`gate.txt`](gate.txt) | `EXPO_NO_DOTENV=1 npm run quality` no Node 20 e `loop validate`. |
