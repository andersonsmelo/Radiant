# Radiant — Execution Status (2026-07-26)

## Status canônico atual

O Radiant é um aplicativo educacional de radiologia **local-first**. O app deve abrir, oferecer catálogo local, registrar progresso e permitir revisão mesmo quando a API remota está ausente.

A API pública conhecida em `api.radiant.ascendcreative.com.br` está **inativa** e retorna HTTP 502. Esse estado foi verificado apenas por smoke público read-only; esta execução não altera VPS, DNS, proxy, banco, deploy ou serviço remoto.

Este documento substitui [`EXECUTION_STATUS_2026-07-23.md`](EXECUTION_STATUS_2026-07-23.md) como estado canônico. O snapshot anterior permanece histórico e não representa o estado presente — em particular, ele registra o Maestro como "PASS estático, execução em device ainda pendente", o que deixou de ser verdade.

## O que mudou desde 2026-07-23

O fluxo crítico passou a rodar **em device**, e rodar revelou defeitos reais de app que nenhuma verificação estática pegava.

| Verificação | 2026-07-23 | 2026-07-26 |
| --- | --- | --- |
| Maestro | PASS estático; device pendente | **iOS `passed`** — 3/3 flows numa única execução (8m44s) |
| acessibilidade | PASS parcial; checklist manual pendente | **Gate 2 executado** — 3 de 5 itens com evidência; 2 defeitos achados e corrigidos |
| Android | não executado | segue `environment-blocked` |

### Defeitos de usuário encontrados e corrigidos

Os três eram invisíveis em screenshot e nenhum seria pego por revisão visual:

1. **CTA primário do home cortado pela tab bar.** A barra é `position: absolute` (~86pt de cromo flutuante) e não desloca conteúdo rolável; o home reservava 24pt. Corrigido com a constante compartilhada `tabBarClearance`.
2. **Glifos de ícone anunciados como caractere ilegível.** Fontes de ícone usam codepoints de uso privado. Todo `MaterialIcons` passa por `DecorativeIcon`, fora da árvore de acessibilidade.
3. **Caminho de rota vazando no header.** Rota não declarada na Stack raiz caía no header nativo, exibindo `onboarding/index` e `(tabs)` na tela e no VoiceOver. A Stack raiz passa a esconder header por padrão.

Evidência e método: [`radiant-app/docs/evidence/2026-07-26-device-e2e-followup.md`](../radiant-app/docs/evidence/2026-07-26-device-e2e-followup.md) e [`radiant-app/docs/evidence/2026-07-26-accessibility-gate2.md`](../radiant-app/docs/evidence/2026-07-26-accessibility-gate2.md).

## Verificações nesta data

| Verificação | Estado | Resultado |
| --- | --- | --- |
| `npm run quality` | PASS | lint, typecheck, visual QA, contratos de Storybook e Maestro |
| testes completos do app | PASS | 27 suítes; 71 testes |
| lint | PASS com dívida rastreada | 54 warnings legados; 0 erros |
| visual QA estrito | PASS com dívida rastreada | 0 regressões; 122 achados no baseline e 2 exceções delimitadas |
| E2E iOS em device | PASS | onboarding, critical path e offline relaunch, mesmo build e runtime |
| E2E Android | não executado | `radiant-app/android/` não existe; exigiria `expo prebuild` |
| Gate 2 de acessibilidade | PARCIAL | itens 1, 3 e 4 com evidência; 2 e 5 abertos |

## Versionamento

A divergência entre manifesto e pacote registrada como pendência foi resolvida. A linha canônica é a da tag `v1.2.0` e do `package.json`; o `app.json` estava atrasado em `1.0.0`.

| Origem | Antes | Agora |
| --- | --- | --- |
| `radiant-app/package.json` | 1.2.0 | **1.2.1** |
| `radiant-app/app.json` (`expo.version`) | 1.0.0 | **1.2.1** |

O incremento é de patch porque esta data entregou correções de defeito, não recursos novos.

`expo.runtimeVersion` usa `policy: appVersion`, então mudar `expo.version` muda a versão de runtime do Expo Updates. Isso é seguro **agora**, e só agora: `android.versionCode` e `ios.buildNumber` seguem em `1` e não há build publicado para receber update incompatível. Depois da primeira distribuição, alinhar essas versões deixa de ser uma operação livre.

## Bloqueios do app

1. O lint registra 54 warnings legados. Não bloqueiam o gate, mas devem ser reduzidos por domínio, sem suprimir regras globalmente.
2. A dívida visual permanece em 122 ocorrências no baseline e 2 exceções delimitadas. A próxima migração deve substituir tokens e primitives em vez de renovar a política.
3. O Gate 2 segue **sem aprovação**: o item de anúncio único do VoiceOver exige humano com áudio, e o de navegação por teclado exige uma build web. Nenhum dos dois foi feito.
4. O Android não tem projeto nativo gerado; a matriz de smoke cobre só iOS.
5. O nó de reward não tem cobertura E2E: o track ativo vem do catálogo (7 lições), não do `defaultTrack` (2 lições), e a conquista só destrava após a última lição.
6. A API pública conhecida permanece inativa; nenhuma reativação remota foi tentada.

## Dívida documental conhecida

Os documentos de estado atual usam **caminho absoluto da máquina de origem** em 121 referências, apontando para o diretório `Developer/` do usuário. O contrato de documentação bane apenas o caminho de workspace *aposentado* — o que ficava sob `Documents/` —, então a convenção atual passa no gate. Mas os links quebram para qualquer outro leitor ou checkout. Converter para caminhos relativos é uma limpeza mecânica ainda não feita.

Vale notar que esse mesmo contrato detecta a string em qualquer contexto, inclusive quando um documento apenas *menciona* o caminho proibido para explicá-lo. Descreva-o, não o transcreva.

## Próxima sequência autorizada

1. Fechar o Gate 2: item 2 exige VoiceOver com áudio (humano); item 5 exige build web e pode ser automatizado.
2. Verificar e corrigir `ProgressScreen`, que usa `paddingBottom: 24` — o mesmo valor que cortava o CTA do home, com `tabBarClearance` já disponível.
3. Corrigir o `JourneyMap`, que renderiza em tema claro dentro da tela escura e quebra rótulos no meio da palavra.
4. Android: `expo prebuild`, build local e os três flows, contando com rodadas de ajuste de seletor próprias da plataforma.
5. Só então handoff Figma, pesquisa com usuários, experimento Rive e decisões de infraestrutura remota.

## Observações de produto pendentes de confirmação

- **Instalação limpa não passa pelo onboarding.** Com o app recém-instalado e aberto sem deep link, a primeira tela é a Home. O onboarding só foi alcançado por deep link, que é também o caminho usado pelo flow E2E. Falta confirmar se é intencional nesta configuração de build.
