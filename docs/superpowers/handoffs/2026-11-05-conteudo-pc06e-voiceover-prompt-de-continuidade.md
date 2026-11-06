# Continuidade — PC06-E e VoiceOver físico

Fotografia de **05/11/2026, America/Bahia**, preparada a pedido de Anderson para
encerrar esta conversa. O único estado vivo continua em `docs/STATUS.md`.
Este prompt substitui como entrada o handoff de 03/11, preservado como histórico.
Não concede autorização de promoção, instalação, build ou release.

## Prompt para a próxima conversa

Continue o plano de conteúdo do Radiant somente na pendência real do **PC06-E**:
prova de VoiceOver em iPhone físico com o cliente de desenvolvimento existente,
com participação de Anderson. Não avance para PC07/PC08/PC09.

- Worktree: `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`.
- Branch: `claude/conteudo-reinicio-tecnologo`.
- HEAD medido: `dcb681072ddc95ab5e00aa9e8a34a770c9252ad0`.
- As entregas PC03–PC06 estão na árvore local suja; HEAD não contém essas
  entregas. O checkout principal não é substituto desta worktree.

Antes de editar, confira status, branch, HEAD, histórico recente, processos e
concorrência. Preserve alterações locais e decisões aprovadas. Não faça reset,
clean, stash, troca de branch, checkout de arquivos nem commit em bloco.
Este encerramento não fez commit/push/merge ou alteração de código do app.

### Leitura obrigatória e hierarquia

1. Instruções `AGENTS.md`, `.loop/project.yaml`, `docs/STATUS.md`, item de conteúdo
   em `docs/FILA.md` e `docs/plans/2026-07-27-radiant-launch-roadmap.md`.
2. Plano único `docs/plans/2026-11-02-planejamento-conteudo-radiant.md`, sobretudo
   decisões da seção 0, famílias da seção 3 e execução da seção 13.
3. `docs/CONTENT_PIPELINE.md` e ADRs
   `docs/adr/ADR-2026-11-02-reinicio-conteudo-e-foco-tecnologo.md` e
   `docs/adr/ADR-2026-11-03-pc05-contrato-piloto-e-identidades.md`.
4. `docs/evidence/2026-11-03-pc03b-revisao-claude.md`,
   `docs/evidence/2026-11-03-pc04-pacote-piloto.md`,
   `docs/evidence/2026-11-03-pc05-payloads.md` e o pacote único
   `docs/evidence/2026-11-03-pc05-payloads.json`.
5. `docs/evidence/2026-11-04-pc06e-integracao-e-provas.md` **inteiro, incluindo a
   segunda passagem**, e `docs/evidence/2026-11-05-pc06e-aviso-texto-ampliado.md`.
6. Roteiro canônico `radiant-app/docs/ACCESSIBILITY_QA_V1.md`. Seus aceites
   históricos de agosto não provam as novas interações do PC06.
7. Código atual: rota `radiant-app/src/app/editorial-preview.tsx`, módulo
   `radiant-app/src/features/editorial-preview/`, renderers em
   `radiant-app/src/features/lesson-flow/renderers/`, transição em
   `radiant-app/src/features/content/`, `radiant-app/metro.config.js` e
   `radiant-app/scripts/editorial-preview-resolver.cjs`.

O [handoff de 03/11](2026-11-03-conteudo-pc06-prompt-de-continuidade.md) conserva
os recibos PC06-A/B/C/D, mas sua ordem de implementar a integração já foi
executada. Não refaça essa entrega nem sua antiga exigência de offline nas prévias.
Medição atual de código/ambiente prevalece sobre qualquer fotografia.

Inicie com `lean-task-start`; use as skills solicitadas `using-loop`,
`using-superpowers` e `task-observer` proporcionalmente ao objetivo. Consulte o
cérebro pela CLI pública e leia `00 Radiant.md`. Antes de escrever, abra seu
próprio writer pelo `scripts/loop/abrir.mjs`, declarando a união completa de
arquivos e subprodutos. Não contorne `PROJECT_BUSY`. Runs fechados não transferem
controle de escrita; nenhuma edição está autorizada por um run antigo.

### O que já foi entregue e não deve ser refeito

- Catálogo ativo vazio e exemplos retirados; motores, biblioteca, interface e
  dados pessoais preservados. Progresso legado não vira conclusão nova.
- PC03-A aprovado por Anderson; PC03-B aceito por Claude em 03/11. PC04 contém
  cinco briefs e M01.01 completa, quatro diagramas e direitos delimitados.
  Quatro aulas completas e seus checkpoints ainda faltam para promover o lote.
- PC05 aceita explicitamente Q1–Q5, com identidades, rubricas e vínculo ao hash.
  O lote permanece recusado por quatro competências sem checkpoint. M01.01
  ainda não possui os seis aceites por hash. Q6 continua recusado pelo contrato
  editorial, apesar de seu renderer textual já existir.
- PC06-A/B/C/D entregaram prévias por injeção, ajuda/checkpoint/recuperações,
  práticas/ativos locais/cena abstrata, aviso de retirada e renderer Q6.
- PC06-E integra a rota `/editorial-preview`, apenas com `__DEV__` e
  `EXPO_PUBLIC_RADIANT_EDITORIAL_PREVIEW=1`. O laboratório usa o pacote PC05
  único; Q6 usa cenário sintético separado, sem aprovar uma aula. Não grava
  progresso, XP ou vidas. Metro exclui laboratório, JSON de revisão e cenário
  sintético do grafo de release.
- Em 04/11, houve prova por toque em M01.01 e Q2–Q6 no simulador E262, usando
  cliente existente 1.4.0(3), e correções de Q3 cortada, índice do hotspot,
  aparência travada da ordenação e coluna estreita em AX5. Exportação JS de
  release com opt-in não incluiu o laboratório ou os quatro PNGs. Não foi build
  autônoma, prova de leitor de tela ou prova offline.
- Em 05/11, o aviso de retirada passou a remedir título/corpo ao trocar escala
  com a tela aberta, preservando botão/tela e anúncio/foco único. Quatro
  suítes/30 testes e medições nativas no E262 cobriram versões aula/revisão,
  normal→AX5, AX4→AX5 e início em AX5. Treze medidas correlacionadas por nó
  mostraram altura suficiente. Instrumentação removida. Isso não mede fala,
  ordem de foco, alcance por rolagem nem Android a 200%.

| Entrega local | Writer fechado | Gate configurado |
|---|---|---|
| Integração PC06-E, primeira passagem | `run-1793791456840-0d771202` | 15/15, segundo ciclo |
| Toque e correções, segunda passagem | `run-1793799555460-cecc68c9` | 15/15, um ciclo |
| Aviso e escala dinâmica, 05/11 | `run-1793875917068-c8297725` | 15/15, um ciclo |

São resultados locais da árvore suja, não CI de um commit limpo. Evidências e
limites estão nos relatos acima. O achado editorial de **texto de brief exposto
nas práticas** segue aberto: corrigir na autoria antes da promoção, sem inventar
texto no renderer durante a prova técnica.

### Decisões aprovadas que não devem ser reabertas

- Público: graduação tecnológica em radiologia, depois especializações; piloto
  vertical de cinco aulas, navegação alternada/manipulação inicial a testar e
  nivelamento para formados no PC08.
- PC03-A é autorização de produto; PC03-B é revisão editorial por IA. Claude
  efetivamente fez a revisão, sem aprovação clínica/humana presumida.
- Preservar histórico/conquistas e oferecer transição, sem mapear conclusão
  antiga para nova. A retirada só entra na main com o primeiro lote aprovado.
- Diagramas: “Radiant — criado com assistência de IA (Codex), 2026”, CC BY 4.0
  nos direitos que possam ser concedidos, sem exclusividade/autoria humana
  presumida. Modelo qualitativo 27×33 cm/área relativa e cena abstrata nova de
  alvo artificial 18 cm/faixa 18–20 cm; sem dose, espalhamento ou protocolo.
- **Anderson decidiu em 04/11 que offline autônomo será provado no primeiro lote
  real promovido. Não pedir novamente essa decisão e não criar build das prévias
  para satisfazer offline.** Metro conectado não comprova offline autônomo.
- Renderer Q6 não amplia publisher nem supera a recusa editorial. Nenhum aceite
  novo por hash, promoção, currículo ativado ou release resulta deste handoff.

### Preparação física: medido e ainda não executado

Anderson respondeu **“iPhone com cliente de desenvolvimento”**. O inventário
local de 05/11 identificou iPhone 16, iOS 27.2, disponível/pareado naquele
momento. Isso não comprova versão do Radiant ou compatibilidade do cliente.
A consulta restrita ao app falhou por aparelho bloqueado/DDI e, depois, por
CoreDevice 4016 (usage assertions indisponíveis). Não houve diagnóstico de
incompatibilidade nem instalação para contornar os erros.

Foi iniciado Metro LAN nesta worktree e enviada orientação de conexão ao cliente
existente. **Não houve confirmação de abertura do menu, cliente no inspector,
requisição de bundle físico observada ou relato de fala/gestos.** A pergunta
sobre abertura do menu ficou sem resposta antes do pedido de encerramento.
Portanto, todos os casos físicos de VoiceOver seguem **NÃO EXECUTADOS**.

O Metro desta preparação foi encerrado para o handoff; a porta 8081 ficou sem
listener na conferência. IP/QR de conexão eram temporários: não reutilize um IP
antigo como medição atual nem dependa de arquivos em `/tmp`. Remeça rede, porta,
cliente e aparelho. Não persista inventário bruto, serial, ECID ou dados privados.
O agente não instalou app, limpou armazenamento ou editou dados do iPhone.

O E262 (`E262D4C1-99BE-496B-8567-0291C14E6533`) terminou a prova anterior desligado,
com fonte `large` restaurada. **Não toque no simulador reservado
`5FD8C926-BC5A-4E9E-B5BE-2E080B2ED2A3`, seu container, relógio ou revisão de dia 2.**
Não confunda ID de simulador com alvo físico; inventarie o ID físico completo
antes de qualquer comando dirigido. Não mate processos de outras sessões.

### Correção medida em 05/11, 11:41: o caminho abaixo está bloqueado

**Este prompt é histórico como entrada:** use o
[prompt do lote do piloto](2026-11-05-conteudo-lote-piloto-prompt-de-continuidade.md).

O Radiant do iPhone, **1.4.0 (11)**, ignorou a URL do cliente, não fez pedido ao
Metro e respondeu "Unmatched Route" à rota da prévia. O "cliente existente" não serve
para esta prova, e Anderson escolheu registrar e encerrar. Não repita os passos abaixo
sem um cliente de desenvolvimento nesse aparelho, cujo build e instalação exigem
autorização nova do dono.
[Evidência](../../evidence/2026-11-05-pc06e-iphone-cliente-sem-metro.md).

### Retomada mínima da prova com Anderson

1. Confira o estado atual e se outra sessão já executou os casos. Se não,
   restabeleça a conexão com o cliente existente: iPhone desbloqueado, mesma
   rede, IP atual e porta livre. Se 8081 estiver ocupada, identifique o dono;
   não encerre um processo alheio. No diretório `radiant-app`, com Node 20:

   ```sh
   PATH=/Users/anderson/.nvm/versions/node/v20.20.2/bin:$PATH \
   EXPO_NO_DOTENV=1 EXPO_NO_TYPESCRIPT_SETUP=1 \
   EXPO_PUBLIC_RADIANT_EDITORIAL_PREVIEW=1 \
   npx expo start --dev-client --lan --port 8081
   ```

   Não use `CI=1` nessa sessão interativa. `expo-env.d.ts` já existia antes;
   não o altere nem declare (fora da política). O opt-in é por processo, não
   grave credenciais/configuração em `.env`. Abra o servidor no cliente
   existente e, após carregar, a rota `radiantapp://editorial-preview`.
2. Confirme com Anderson o menu “Prévias do conteúdo · PC06-E” e registre
   modelo/OS e versão/build do cliente **somente se efetivamente verificados**.
   Se a conexão falhar, diagnostique o ambiente existente e peça o passo
   concreto que dependa do dono. Não faça build, instalação, prebuild, novo
   driver, EAS/OTA ou troca de binário por inferência.
3. Guie VoiceOver em lotes curtos. Registre cada cenário como PASSOU/FALHOU/
   NÃO EXECUTADO e se a fonte é relato de Anderson, observação nativa ou teste
   automatizado. Uma árvore de UI, pedido de anúncio via API ou captura não
   comprova experiência falada. “Funcionou” genérico não encerra todos os casos.
4. Verifique nome/papel/estado/instrução e ordem de foco; seleção antes do
   retorno, confirmar indisponível antes de escolher, confirmação explícita,
   bloqueio após confirmar, retorno específico uma vez, próxima interação com
   contexto/seleção/foco adequados e feedback final antes da saída.
5. Cubra M01.01 com ajuda/checkpoint e ambos os contextos de recuperação;
   Q2 frente/costas por lista de regiões; Q3 por nomes acessíveis; Q4 cena
   abstrata por incremento e valor atual; Q5 reordenação, limites dos botões e
   trava; Q6 textual sintético com decisão/motivo/apoio e segundo toque final.
6. Cubra avisos de aula retirada e revisão indisponível, texto ampliado e
   troca de escala com tela aberta, alcance do botão por rolagem e retorno à
   trilha. Confira movimento reduzido conforme roteiro. Não confunda prova
   geométrica já feita com estes novos aceites de uso.

Não apague armazenamento real para fabricar casos. Se algum cenário exigir
fixture/configuração nova, prepare o recorte revisável dentro do escopo e
registre o limite; não improvise sobre dados do dono. VoiceOver iOS não prova
TalkBack Android. PC06 permanece aberto enquanto seus critérios não forem
medidos; PC07 exige participantes/retenção posterior, sem recrutamento automático.

### Validação, documentação e fechamento

Node 20.20.2 para app/testes; somente Loop usa Node 24.14.1, PATH por comando.
Testes focados só quando a mudança exigir; a entrega documental não cria testes
que espelhem prosa. Se alterar o aviso ou a integração, a regressão recente é:

```sh
EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand --runTestsByPath \
  src/features/content/components/ContentUpdatedScreen.test.tsx \
  src/features/content/services/ContentTransition.test.tsx \
  src/features/editorial-preview/EditorialPreviewLab.test.tsx \
  src/test/routes/licao-hibrida.test.tsx
```

Esse conjunto mediu quatro suítes/30 testes em 05/11; não substitui o gate
configurado. Se criar guarda, preserve recibo vermelho do defeito específico.
Se editar UI, confira visual estrito sem inventar exceção. Ao concluir, atualize
STATUS, FILA e plano/roadmap no mesmo escopo. Execute uma validação configurada
final, repetida apenas diante de falha real. O app-quality é
`EXPO_NO_DOTENV=1 CI=1 npm run quality`; Jest isolado não equivale a ele.
Confira carga próxima de 5 ou menor, não concorra com E2E e use `caffeinate -i`
e `PYTHONDONTWRITEBYTECODE=1`. Feche a leitura antes do writer quando necessário
para `brain-links`.

Cheque cada envelope, sem encadear fechamento com `&&`:
`loop validate → loop step finish → [loop memory write, se aprendizado durável]
→ loop run close`. Feche a sessão do cérebro separadamente. Não edite vault,
estados ou evidências internas do Loop à mão. Termine os processos próprios e
informe o que deixou ativo; não encerre o app do usuário no iPhone por suposição.

Relatório final: arquivos alterados, comandos/resultados, casos efetivamente
medidos, fonte da observação e limitações, alvo/binário conhecidos ou não,
branch/HEAD/árvore, runs/sessões fechados e próxima ação concreta do dono. Não
colapse implementação, prova local, prova física e release em “concluído”.

### Sistemas e documento de produção

Documento canônico do piloto:
https://docs.google.com/document/d/1-OLHVS-QnG69Gm5EGwV_UslxBj3OP3g9W62GEUvAEUE

Produção editorial permanece nele; implementação/evidência técnica no repositório.
Trello não foi atualizado nesta passagem. Nenhuma tarefa Todoist foi solicitada
ou criada; não criar uma automaticamente para o teste manual. Não houve edição
de Google Docs/Obsidian ou nova decisão de produto. Cérebro somente pela CLI Loop.

### Recibo deste encerramento documental

Writer `run-1793883210851-fe26b896`, escopo de sete arquivos documentais.
Sessão de leitura `brain-session-1793883178064-d5b6f7b6` fechada antes do writer.
Gate configurado executado uma vez: **13/15 aprovados**, `VALIDATION_FAILED`;
`app-quality` e `app-test` terminaram em **timeout**, os demais passaram, incluindo
`docs-contract` e `brain-links`. A carga medida subiu de cerca de 15 para 84 durante
a execução por processos de vídeo alheios; não houve nova tentativa nessa condição.
O Jest órfão do `app-test`, identificado pela cadeia de processos e worktree, foi
encerrado após o timeout para liberar o recibo. Nenhum processo de vídeo foi morto.
Resultado não equivale a novo gate 15/15; os gates anteriores permanecem históricos.

Passaram também os 18 testes documentais, o contrato documental e a conferência de
21 caminhos explícitos/627 links locais nos sete documentos. `git diff --check`
sem erro. Nenhum código do app alterado neste recorte. O recibo configurado está em
`.loop/runs/run-1793883210851-fe26b896/final-validation.json`.

O resultado devolveu o writer a `editing`, sem `STEP_SUCCEEDED`, e portanto não
permite `step finish`/memória validada. Fechamento direto pela CLI pública:
`loop run close --run run-1793883210851-fe26b896`, sem declarar sucesso. O estado
terminal fica no recibo `run-closed` desse run; confira-o antes de abrir outro
writer e não retome este run. Uma nova
entrega que exija gate completo deve aguardar a carga baixar e usar seu próprio
ciclo. Não reabrir a prova física ou uma build para compensar os timeouts.
