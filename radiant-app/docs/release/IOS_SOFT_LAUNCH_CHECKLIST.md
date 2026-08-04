# Checklist de soft launch — iOS

> **Reconciliado em 2026-08-04**, pela mesma razão do
> [roteiro de smoke](TESTFLIGHT_SMOKE.md): a lista de 2026-04-09 pedia itens
> impossíveis (smoke de auth e sync contra a API pública, layout de tablet,
> metadata `en-US`) e descrevia os perfis do `eas.json` de um jeito que a medição
> de 2026-08-03 desmentiu. Uma lista com item impossível não é conservadora — ela
> nunca fecha, e quem a percorre aprende a ignorá-la.

## Aceitação de interface

- tipografia escala sem cortar texto até 2× (aberto: o `eyebrow` do
  `JourneyHero` ainda quebra no meio da palavra nessa escala);
- controles têm rótulo acessível e alvo de toque ≥ 44pt;
- o conteúdo respeita as safe areas em retrato — a v1.3 é
  `"orientation": "portrait"`, então não há paisagem a verificar;
- estados de carregamento e erro são calmos, legíveis e permitem nova tentativa;
- o primeiro ganho aparece antes de qualquer pressão comercial;
- o prompt de avaliação respeita momento de sucesso real.

## Antes de submeter

- EAS autenticado;
- build `production` criada e o número lido **do binário**, não do `app.json`;
- smoke do TestFlight percorrido e assinado ([roteiro](TESTFLIGHT_SMOKE.md));
- suíte Maestro reexecutada **depois** do último commit de código — contrato
  estático não promove plataforma, e esta defasagem já reapareceu três vezes;
- metadata `pt-BR` conferida contra
  [`APP_STORE_METADATA.md`](APP_STORE_METADATA.md);
- respostas de privacidade preenchidas (E3), derivadas do
  [contrato de telemetria](../../../docs/legal/CONTRATO_TELEMETRIA.md);
- copy de permissão de notificação conferida;
- abertura offline verificada no aparelho;
- links legais abertos a partir do app (cenário 5 do smoke);
- bloco de impacto na App Store documentado;
- dono da leitura pós-release definido;
- regra de contenção / rollback documentada.

## Notas de preflight

- **`e2e-test` é o perfil que mais se parece com `production`**, não o
  `preview`. Medido em 2026-08-03: em `ENABLE_DEV_TOOLS`,
  `ENABLE_TELEMETRY_DEBUG_SCREEN` e `ENABLE_BETA_GATE`, quem coincide com
  `production` é o `e2e-test`. A frase "`preview` reflete produção" nasceu
  escopada a **uma** flag (`ENABLE_LEARNING_ROAD`, em 2026-07-27) e viajou sem o
  escopo.
- **Nenhum dos cinco perfis aplica o beta gate.** O valor que vale é
  `ENABLE_BETA_GATE && !SHOW_DEV_TOOLS`, e os dois perfis que ligam o gate ligam
  também as dev tools.
- **`development-simulator` não é mais o caminho de contorno** por falta de time
  Apple: o Apple Developer Program individual está ativo desde 2026-08-01, com
  certificado de distribuição e provisioning profile criados pelo EAS.
- as notas para o revisor e a matriz de listing precisam continuar descrevendo o
  runtime da build candidata — é a regra que este documento quebrou por quatro
  meses.

## Fora do escopo da v1.3

- **Tablet.** O `app.json` declara `ios.supportsTablet: false`; a decisão é de
  2026-07-29 e removeu também os screenshots dessa família.
- **`en-US`.** A ficha foi criada em pt-BR e a fonte de copy aprovada é
  [`textos-loja-pt-BR.md`](../../../docs/store/textos-loja-pt-BR.md). Um segundo
  idioma entra quando houver copy revisada para ele, não por inércia de template.
- **Conta e sync.** Ver a seção de ausências deliberadas do roteiro de smoke.

## Assinatura

- Responsável pelo release:
- Data:
- Versão / build:
- Notas:
