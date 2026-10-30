# T13 / Task 15 — pacote de decisão G1 e recorte de G3

Preparado em **30/10/2026, America/Bahia**. Após a apresentação, Anderson
autorizou A+Q1: [decisão A/Q1](../adr/ADR-2026-10-30-t13-texto-maximo-e-risco-residual-do-quadro.md). Implementação e prova têm
estado próprio na [evidência A](../evidence/2026-10-30-medalhao-t13-a.md) e no
[STATUS](../STATUS.md); as alternativas abaixo preservam o pacote avaliado.
Fontes vinculantes: [T13 do integrador](2026-10-25-medalhao-pendencias-e-fechamento.md#t13--texto-máximo-da-trilha-e-aceite-do-quadro-antecipado),
[Task 15](2026-10-25-medalhao-execucao-subagentes.md#task-15-t13--texto-máximo-e-quadro-antecipado),
[spec](../superpowers/specs/2026-10-21-trilha-medalhao-e-aula-bancada-design.md),
[ADR aceita](../adr/ADR-2026-10-21-trilha-medalhao-aula-bancada-e-recomeco.md)
e [prancheta aprovada](../design/2026-10-21-trilha-medalhao.html).

## Decisões apresentadas

**G1 — recomendação A:** manter os dois corredores de 64 pt e acrescentar
hifenização deliberada em pt-BR, distribuição da data por componentes e
rolagem que alcance título, data, CTA e lembrete completos. A fonte mantém
seu contrato atual, sem teto novo, redução ou corte. Custo: mais linhas e
rolagem no máximo de acessibilidade. B oferece mais largura com uma mudança
explícita de reserva lateral, mas ainda precisa de hifenização.

**G3 — recomendação para o recorte do quadro:** aceitar explicitamente o risco
residual documentado e manter observação em T18. Isso significa aceitar a
evidência delimitada; não significa declarar o defeito corrigido. Se o dono
exigir demonstração de eliminação antes do aceite, escolher manter esse
recorte bloqueado. Arte/acabamento e o restante de G3 continuam separados.

**Decisão posterior do dono,30/10:** “siga conforme recomendação”, após a
recomendação explícita A+Q1. [decisão A/Q1](../adr/ADR-2026-10-30-t13-texto-maximo-e-risco-residual-do-quadro.md). G1=A e o recorte Q1
estão resolvidos; implementação/prova nativa e arte/G3global permanecem
separados. A autorização não fecha T13 nem inicia T14.

## Base atual e problema observável

Base medida: worktree `trilha-2026-10-20`, branch
`claude/trilha-medalhao-design`, HEAD `f304610c8c1a28cf964b88b81c9a8af5abd6ad97`,
árvore inicialmente limpa; remoto e PR66 no mesmo SHA. Checks existentes
App Quality `41078608281` e Content `41078608516`: SUCCESS nesse SHA.
Não são CI desta entrega documental. [Medições e revisão](../evidence/2026-10-30-medalhao-t13.md).

A [retomada de 23/10, §3](../evidence/2026-10-23-trilha-medalhao-retomada.md#3-revisão-dos-vídeos-ios-e-do-texto-máximo)
preserva cabeça inteira no AX5/Android 200%, mas registra palavras partidas,
data dividida e corte pelo lembrete. A captura não estabelece a causa do
corte do lembrete. Não houve remedição nativa atual nesta tarefa.

### Consumidores e régua atual

- `JourneyHomeScreen` dá padding horizontal de 16 pt à `JourneyTrail` e monta
  `ReminderRow` como irmão da lista, fora de sua rolagem.
- `JourneyTrail` entra em coluna quando `fontScale > 1,3`; usa
  `trailColumnContentWidth`, cabeça sm 48 × 46 como reserva e slots medidos
  em runtime. A cabeça efetiva é medida: 46 é a reserva nominal, não prova
  de altura universal.
- `trailLayout` atende posição de medalhas, caminhos, altura de linhas e
  encaixe do Pixel. Sua mudança alcança repouso, animação, rolagem e âncora.
- `nodeCopy` forma a data e CTA; `JourneyDefinitionService` forma revisões
  com `Revisar ${title}`. Copy de acessibilidade deve continuar integral.
- `ReminderRow` tem layout empilhado acima de 1,3 e `flexShrink: 1` no texto.
  Isso é inspeção de código, não diagnóstico causal do corte histórico.
  Seu outro consumidor real é `SettingsScreen`; preservá-lo ao alterar a
  apresentação da Home. `JourneyTrail` também tem consumidores em stories.
- Abas são consumidor separado: o corte histórico dos rótulos não será
  declarado resolvido por mudar a trilha. Deve entrar na conferência T17/T18.

Se W é a largura da janela e L a da lista, na Home atual `L = W − 32`.
Em coluna, `C = L − 2 × (48 + 2 × 8) = W − 160`.
Em composição normal, máximo nominal do título `L/2 − 16`; deslocamentos
das medalhas `±0,35 × L/2`. São contas do código, sem shaping de texto.

| W, pt/dp lógicos | L | Título normal | Coluna atual/A | Coluna B proposta | Deslocamento normal |
| --- | --- | --- | --- | --- | --- |
| 320 | 288 | 128 | 160 | 224 | ±50,4 |
| 390 | 358 | 163 | 230 | 294 | ±62,65 |
| 412 | 380 | 174 | 252 | 316 | ±66,5 |

Os números são **derivados**, não medidas dos aparelhos históricos. A dimensão
real da lista continua sendo autoridade no runtime, inclusive se safe area
ou consumidor mudar.

### Textos de estresse reais

Não há máximo editorial futuro aprovado. Maior por caracteres no catálogo
local auditado não é garantia de maior largura tipográfica nem do catálogo
substituto. A matriz mínima inclui:

| Caso | Texto integral | Origem |
| --- | --- | --- |
| Histórico | Princípios de Tomografia Computadorizada | `src/data/lessons.ts`, lesson-2 |
| Revisão histórica | Revisar Princípios de Tomografia Computadorizada | Prefixo de revisão + lesson-2 |
| Maior título de revisão por caracteres auditado | Revisar Interação das radiações e proteção radiológica | `src/data/ai-lessons.ts` + `JourneyDefinitionService.ts` |
| Palavra extensa | Revisar Aplicações radioisotópicas e medicina nuclear | Mesmas fontes |
| Data | Disponível em 24/10/2026 às 06:20 | Formato de `nodeCopy.ts`; exemplo histórico, sem editar relógio |
| Ação/lembrete | Retomar avaliação; Receber conquista; Lembrete diário | `nodeCopy.ts` / `ReminderRow.tsx` |

Soma estática dos avanços da Sora SemiBold local, sem kerning/shaping nativo:
“Computadorizada” ≈120,97 a 13 pt, 241,93 a 26 pt e 374,99 a 40,3 pt.
Mesmo uma faixa de texto com toda a lista de 358 pt não garante essa palavra
inteira no maior cenário ilustrativo. **Mais largura sozinha não resolve.**
13 é a caption atual; 2× e 3,1× aqui são multiplicações ilustrativas, não
conversão comprovada da tipografia AX5 ou Android 200% de todos os textos.

## G1 — alternativas comparáveis

Veja o [diagrama interativo isolado](../design/2026-10-30-medalhao-t13-alternativas.html).
Ele embute Sora local e permite comparar a mesma largura e escala. Mostra
caixas de planejamento, não o app nem renderização AX5/Android nativa.
Não redesenha Pixel ou medalhas: os retângulos marcam envelopes nominais.

### A — dois corredores, hifenização deliberada e fluxo vertical completo — recomendada

**Composição:** manter cabeça, medalha, percurso e dois corredores como hoje.
Na coluna, título e data crescem em altura. Acrescentar pontos discricionários
de hifenização pt-BR apenas à apresentação, preservando título canônico e
rótulo acessível. A data permite quebras entre componentes, mantendo todos
os números, separadores e a hora. Não exigir `24/10/2026` inteiro em uma
linha: ele próprio pode ultrapassar os 160 pt de W320.

**Geometria:** intervalos em coordenadas da lista, com H=L/2:
texto `[−H+64, H−64]`; corredores `[−H,−H+64]` e `[H−64,H]`.
Uma cabeça de 48 pt centrada em `−H+32` ocupa `[−H+8,−H+56]`, com 8 pt até
o texto. Conservar a travessia lateral somente abaixo do texto/CTA na reserva
vertical já definida, e o encaixe ao lado da medalha. Nenhuma largura é tomada
dos corredores. As guardas futuras devem verificar o envelope inteiro da
cabeça em todo o percurso, incluindo a troca de lado, e não só esses extremos.

**Lembrete:** propor um rodapé da própria lista, preservando uma única
instância e o fluxo de preferência existente. Isso o torna alcançável por
rolagem sem disputar altura fixa com a trilha. Montagem/desmontagem, retorno
do foco, erro/retry e alternância durante operação pendente precisam de
regressão: mover o consumidor não autoriza nova persistência ou permissão.
Se a montagem no rodapé ameaçar esse contrato, o implementador deve preservar
o controlador estável e rolar somente sua apresentação.

**Consequências:** menor alteração do trajeto; mantém a identidade aprovada.
Texto máximo fica alto e pode exigir mais rolagem. Hifenização depende de
segmentação linguística conferida e funcionamento real nos dois sistemas.
Não pressupor suporte automático do motor nem instalar dependência.

### B — corredor esquerdo permanente de 64 pt + hifenização

**Composição:** manter medalha central e Pixel de repouso ao lado dela;
na região de título/data/CTA, reservar somente a faixa esquerda. Texto ganha
64 pt e desloca o centro 32 pt para a direita. A mudança da reserva direita
exige **aprovação G1 explícita**; não é refinamento técnico automático.

**Geometria proposta:** texto `[−H+64,H]`, largura `L−64`. Trânsito ao lado
do texto fica sempre na esquerda, centro da cabeça `−H+32`, com envelope
`[−H+8,−H+56]` e folga 8. Conexão de/para o slot passa pela faixa visual
da medalha, acima do texto; cruzamentos sob o texto precisam manter a altura
de cabeça e 4 pt de folga já contratados. É proposta de rota verificável,
**ainda não prova de validade da rota implementada**.

**Consequências:** menos linhas que A e mais intervenção em caminho/âncoras.
Hifenização e data em componentes continuam necessárias no AX5 e em W320.
Requer testes de todos os pontos/interpolações e estados de repouso, espera,
trajeto e chegada. Footer/lembrete segue a mesma proposta de A. O zigue-zague
normal não muda por essa escolha da coluna ampliada.

### C — manter a composição e aceitar o limite observado

Não muda produto nem exige autorização implícita. Preserva as palavras
partidas e os cortes históricos como pendência conhecida; não entrega prova
de texto completo nem torna T13 aprovada. É uma decisão possível do dono
de aceitar um limite, com custo de leitura explícito. Não recomendada.

### Contrato de implementação depois de G1

| Critério | A | B | C |
| --- | --- | --- | --- |
| Reserva lateral | Dois × 64 pt | Um × 64 pt, aprovação expressa | Dois × 64 pt |
| Fonte / título canônico | Preservados | Preservados | Preservados |
| Palavra longa | Hifenização conferida | Hifenização conferida | Limite conhecido |
| Data / lembrete | Inteiros e alcançáveis por rolagem | Idem | Cortes não resolvidos |
| Rota | Preservar e verificar envelope inteiro | Alterar e provar envelope inteiro | Atual |
| Prova nativa nova | Pendente | Pendente | Não corrige a ausência de prova |

Escopo futuro inicial vem dos seis arquivos de T13 no integrador. A e B
também exigem declarar explicitamente `ReminderRow.tsx` e seus testes reais,
`nodeCopy.ts`/testes ou novo módulo de apresentação se tocados, contratos
Maestro se a copy/estrutura consumida mudar e cada captura/evidência. Esta
lista é um mapa de consumidores, não autorização para editar neste run.
Não mudar serviços, economia, currículo, M7/A2 ou storage.

Antes de implementar: registrar a escolha citável; enumerar novamente os
consumidores; produzir união nominal exata. Vermelho causal de largura e
validade, mínimo verde e mutações específicas. Asserções sobre props não
provam tipografia: o teste atual que diz “data inteira cabe” não substitui
medida do texto nativo no `anchor.width` real. Medir altura das linhas após
layout, atualizar assinaturas/âncoras sem reutilizar altura antiga e conferir
que a faixa inferior não cruza texto/CTA. Preservar o fix T12: nenhuma nova
consulta persistente `getSnapshotForNode` no foco.

Matriz de aceite futura: normal, AX5 iOS e Android 200%, com mesma largura
medida antes/depois, textos acima, revisão futura/devida, retomada, lembrete
visível/erro/retry, rolagem ponta a ponta e volta, repouso/momento/reduzido.
Cabeça inteira, título/data/CTA/lembrete completos, alvo alcançável e ordem
de leitura correta. Registrar também W320 como estresse sem vender uma
simulação de escala como aparelho. Rodar focais, revisão independente e uma
final configurada; native NOT_VERIFIED impede afirmar esse aceite.

## G3 — o que o quadro 0/13 prova

Fontes: [retomada](../evidence/2026-10-23-trilha-medalhao-retomada.md) e
[campanha nativa](../evidence/2026-10-23-trilha-medalhao-quadro.md).

| Campanha histórica | Com o quadro | Limite |
| --- | --- | --- |
| Antes do conserto parcial, sem instrumentação | 2/4 | Sintoma observado |
| Depois do conserto parcial, sem instrumentação | 1/4 | Defeito remanescente observado |
| Depois, instrumentação JS pesada/leve | 0/10 | A observação pode alterar o sintoma |
| Campanha nativa posterior, 9 rastreadas + 4 limpas | 0/13 válidas | Não reprodução em condições daquela campanha |

`l4/l5` foram corretamente excluídas: a gravação terminou antes do momento.
Não foram rodadas verdes. Os 13 vídeos/traces brutos não estão versionados;
`deteccao.txt` preserva o agregado, e `alinhamento.txt` tem seis alinhamentos,
não todos os treze. Não prometer reprocessamento integral a partir do Git.

O detector usa recortes absolutos e thresholds RGB próprios da composição.
A releitura offline do excerto versionado pós-conserto, adaptada à metade
da resolução, encontrou estado final → desaparecimento → chegada posterior.
Tempos do excerto: 0,249 / 0,283 / 0,883 s; **não são os PTS/duração do
quadro original**. O registro original preserva 3,456 / 3,477 / 4,082 s.
[Comando, hash e saída desta auditoria](../evidence/2026-10-30-medalhao-t13.md).

O código pertinente continua equivalente à base da campanha; isso prova
continuidade, não ausência de corrida no HEAD atual. Causa restante não
observada. Os testes do conserto parcial não rasterizam a corrida nativa.
`0,75¹³≈2%` depende de uma taxa estimada em apenas quatro rodadas e de
condições comparáveis; não é confiança de correção.

**Opção G3-Q1 — aceitar o recorte com risco residual (recomendação):**
reconhecer o conserto parcial, a ocorrência posterior e a não reprodução
seguinte; manter causa aberta e observação em T18. Não encerra arte/fundação,
G3 inteiro, texto máximo ou T13.

**Opção G3-Q2 — manter esse recorte bloqueado:** nova observação nativa atual
antes de decidir. Mesmo outra série sem ocorrência provará apenas não
reprodução. Para corrigir, é necessário capturar o sintoma e investigar sua
causa; não produzir patch da hipótese remanescente.

Na nova coleta: registrar SHA/binário/destino/fonte/carga, vídeo bruto com PTS
desde antes do toque até depois da chegada, separar rodadas limpas/rastreadas
e preservar inválidas. Recalibrar detector com conferência visual. Não executar
cegamente scripts históricos: o preparo contém `clearState: true`, proibido
nesta tarefa. Se reaparecer em T18, preservar quadro/timeline antes da correção.

## Limites e registro do aceite

GUI `Simulator.app` ausente no Xcode selecionado, reconfirmado por inventário
read-only; nenhum runtime foi iniciado. Nenhuma captura nativa nova normal,
AX5 ou Android 200%; sem build/install/componentes, estado privado ou relógio.
Reservado `5FD8C926-BC5A-4E9E-B5BE-2E080B2ED2A3` intocado.
G6 local da T11 não transfere autorização. Sora/Pixel/quatro momentos/ouro/
lábio/fingerprint preservados; G2/G4–G8 e decisões curriculares não consumidas.

Registro da decisão posterior à apresentação:

- G1: **A**, Anderson,30/10; citação na ADR acima. B/C não escolhidas.
- G3 quadro: **Q1**, mesmo decisor/data/citação; risco residual aceito e
  observaçãoT18 preservada, sem declarar conserto.
- Arte/acabamento de G3: continua separado; não herdado de Q1.

A foi implementada, revisada e validada estaticamente em `19fbde5`, publicado
com CI Quality41127437509/Content41127437415 SUCCESS no mesmo SHA
(207suítes/2.833testes); finalLoop15/15, memória A/Q1 escrita e writer/cérebro
CLOSED. [Recibos](../evidence/2026-10-30-medalhao-t13-a.md).
A próxima ação da T13 é medir a apresentação nativa:0/7 capturas verificadas,
com bloqueio de shell/display iOS e espaço para o AVD. Manter limites de
runtime/Q1, sem repetir decisão G1/Q1 ou avançar automaticamente à T14.
