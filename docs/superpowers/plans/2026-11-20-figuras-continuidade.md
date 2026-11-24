# Troca das figuras: plano de continuidade

> Escrito em 2026-11-20 e atualizado em 2026-11-21 (fase 2 feita) para quem assume a execução do [plano de troca das figuras](2026-11-19-troca-das-figuras.md) sem ter participado das sessões anteriores. Este documento manda no que diz respeito a **como** executar; o plano original continua mandando no **quê** (lista de figuras por fase). Onde os dois divergem, vale este, que é mais novo. Estado vivo: [`docs/STATUS.md`](../../STATUS.md).

**Objetivo:** trocar as 72 figuras usadas pela trilha `rtg-2026` por arte que o dono aceite, sem perder o rigor do que já foi entregue.

**Regra de ouro:** nesta frente, todo defeito sério foi achado por **medida de um revisor independente**, nunca pelo verificador automático. Um lote só está pronto depois de integração, revisão independente, correções, gate completo e captura no simulador. Não pule etapa para ganhar tempo.

## Plano de fechamento por criticidade (2026-11-24)

**Objetivo.** Deixar a frente de figuras da RTG-2026 revisada, com evidência de funcionamento no iOS e no Android, pronta para a decisão de merge. Escopo de acessibilidade deste plano: manter as alternativas textuais e a semântica dos controles. VoiceOver está fora desta rodada, a pedido de Anderson. Merge, build de loja, envio e gastos dependem do dono.

**Ponto de partida verificado em 2026-11-24.** O piloto M23.02 está no commit `120587fc` e tem prova no Radiant F7 e Loop 15/15. A PR #97 está em rascunho, com 10 conflitos preexistentes com `claude/figuras-base` (`fc298957`) e zero checks no commit do piloto. A ordem de dependências medida no GitHub é `#89 → #90 → #91 → #93 → #94 → #95 → #96 → #97`, da base ao topo. As sete PRs abaixo da #97 aparecem sem conflito com suas bases imediatas. A #92 é uma frente separada de contas de loja. A ordem abaixo orienta a próxima execução; as seções seguintes preservam o histórico e o método. [Estado vivo](../../STATUS.md) · [Piloto e captura](../../evidence/2026-11-19-figuras/imagens-reais.md#piloto-de-artefato-de-objeto-2026-11-23) · [PR #97](https://github.com/andersonsmelo/Radiant/pull/97).

### P0 — Destravar a PR #97

- [x] **Simular a integração com a base atual em worktree isolada.** Conferir os SHAs no GitHub e usar `git merge-tree --write-tree` para reproduzir os conflitos. Agrupar os conflitos por comportamento: toques e selos, registro e regeneração de figuras, e a cena `raio-x-movel-no-leito`. Para cada grupo, ler o que cada branch mudou e preservar os comportamentos aprovados, incluindo a M23.02 e os créditos do exame.
- [x] **Validar a árvore candidata.** Regerar os derivados afetados, conferir a fonte dos alvos e executar os testes focados de `hotspotTouch`, registro e geradores. Depois, executar `loop validate` e revisar o diff da PR contra a base atual. Atualizar somente a branch em rascunho quando autorizado pelo fluxo vigente.
- **Aceite.** GitHub indica que a #97 está sem conflitos, `loop validate` passa, os checks aplicáveis de Radiant App Quality e Content Scripts passam no SHA publicado e os demais elos da pilha permanecem íntegros. Se alguma linha de conflito exigir escolha entre dois comportamentos aprovados, apresentar os dois resultados ao dono antes da integração.

**Prova da reconciliação (2026-11-24).** As árvores de `2a09b6d4` e `d1b1057b` são iguais. As árvores de `fc298957` e `a433f4a2` também são iguais, e `a433f4a2` já é ancestral do piloto. O commit de reconciliação incorpora a base atual e preserva a árvore de código de `120587fc`, inclusive a cena do leito do lote 2B, o toque e os créditos da M23.02. No GitHub, a PR #97 ficou sem conflitos, em rascunho. O Loop passou 15/15. O commit `52e9c468` passou [Radiant App Quality](https://github.com/andersonsmelo/Radiant/actions/runs/45386580028) e [Content Scripts](https://github.com/andersonsmelo/Radiant/actions/runs/45386580113).

### P1 — Recuperar a prova de ponta a ponta

- [x] **Corrigir o roteiro e comprovar o comportamento no app.** Reproduzir separadamente a conexão do dev client no Android, a rolagem de classificação e o toque em controles junto ao cabeçalho ou rodapé. Corrigir a origem em `scripts/qa/` ou no subfluxo compartilhado e regerar os YAMLs afetados. Conferir no iPhone os fluxos de rotular que falhavam e a transição da última fala na M23.02, que exigiu um toque extra no roteiro temporário.
- [x] **Rodar um primeiro lote no RadiantPlay.** Executar M23.02, uma questão com rotulagem, uma com classificação e uma cena do kit que usava o roteiro corrigido. Abrir as capturas e confirmar toque na área certa, retorno correto e avanço para o passo seguinte.
- **Dependência e aceite.** Pode reproduzir problemas enquanto o P0 está em andamento. A prova final usa a árvore reconciliada. O contrato Maestro e os geradores em modo `--check` passam, e o lote prova o fluxo no iOS e no Android. Se um roteiro falhar, capturar o estado antes de classificar a falha como automação ou defeito do app.

**Provas de 2026-11-24.** Launcher Android, classificação e ordenação corrigidos na automação. M23.02, M24.04 e M25.05 validadas em simulador Android e iOS. [Falhas, retestes e capturas](../../evidence/2026-11-19-figuras/orcamento.md#10-reprovas-e-confirmações-no-maestro-2026-11-24).

### P1 — Concluir as quatro figuras que ainda têm esquema

- [ ] **Artefatos de objeto, M23.06.** Procurar uma radiografia com colar e botão ou exemplos independentes que permitam preservar a distinção entre adorno, roupa, aparelho e anatomia. Manter a M23.02 como referência de integração. Se o acervo cobrir só o colar, apresentar ao dono a amostra e a proposta para manter o botão no exercício textual.
- [ ] **Artefatos do detector, M23.03 e M32.04.** Separar o que as amostras confirmam: linhas de grade e imagem residual. Procurar imagens de linha morta e corte de grade. Conferir que a atividade de M32.04 ainda permite distinguir anatomia e marca do equipamento.
- [ ] **Artefatos de RM, M29.05 e M29.06.** Usar a amostra de movimento para avaliar a adaptação da M29.06. Para a comparação da M29.05, buscar também suscetibilidade e dobramento. Se a imagem escolhida mostrar desfoque sem fantasmas reconhecíveis, alinhar a pergunta ao sinal visível após revisão editorial.
- [ ] **Monitor e padrão de teste, M22.03.** Buscar foto ou captura de padrão de controle de qualidade com licença aceita, degraus de cinza legíveis e alvo de baixo contraste na faixa escura. Se a busca ficar sem candidata, registrar as fontes consultadas e levar ao dono a decisão sobre o esquema atual.
- **Dependência e aceite.** A busca pode começar junto com P0. Antes de integrar cada candidata, mostrar a amostra no tamanho do app, verificar autoria e licença na página de origem, conferir a revisão da fonte e obter aceite. Aceitar CC0, domínio público declarado ou CC BY. Na integração, registrar via `imageId`, revisar de modo independente a fidelidade, a geometria e o gabarito, e validar no app. Sem imagem adequada, a entrega do item é uma decisão explícita sobre o esquema e a cobertura didática.

**Busca em 2026-11-24.** Para M23.06, a imagem com roupa e adorno encontrada tem marcações que identificam os objetos e a origem da radiografia ainda precisa de confirmação. Para detector, há exemplos publicados de linha de grade e imagem residual. Linha morta e corte de grade seguem sem amostra aprovada. Para RM, há candidatas de movimento, suscetibilidade e dobramento. A adequação de cada recorte ao enunciado e o aceite ainda precisam ser verificados. Para M22.03, o TG270-sQC passou na triagem didática, com degraus e objetos de baixo contraste. A licença de redistribuição da imagem específica segue sem comprovação.

- [Objetos, figura 1A](https://www.mdpi.com/2227-9032/11/3/308) · [Linhas de grade](https://pmc.ncbi.nlm.nih.gov/articles/PMC6123149/#acm212425-fig-0002) · [Imagem residual](https://pmc.ncbi.nlm.nih.gov/articles/PMC5874089/#acm20001b-fig-0013).
- [Movimento em RM](https://www.nature.com/articles/s41597-022-01694-8#Fig1) · [Suscetibilidade, figura 4B](https://link.springer.com/article/10.1007/s00261-026-05800-x) · [Dobramento e perda de sinal](https://www.frontiersin.org/journals/neuroimaging/articles/10.3389/fnimg.2022.1073734/full) · [Aplicação do TG270](https://doi.org/10.1002/mp.14227).

Ferreira et al. têm um conjunto adicional sob CC BY 2.0, com recortes candidatos de movimento respiratório, dobramento e suscetibilidade junto a dispositivo. O exemplo de dobramento traz setas que apontam outro efeito. A M29.06 exige conferir se a repetição fica legível antes de reaproveitar o enunciado. [Movimento, figura 17](https://link.springer.com/article/10.1186/1532-429X-15-41/figures/17) · [Dobramento, figura 30B](https://link.springer.com/article/10.1186/1532-429X-15-41/figures/30) · [Suscetibilidade, figura 34A](https://link.springer.com/article/10.1186/1532-429X-15-41/figures/34) · [Licença do artigo](https://link.springer.com/article/10.1186/1532-429X-15-41#rightslink).

### P1 — Disposição dos painéis de RM

- [x] **M29.03, ponderações no encéfalo.** Anderson escolheu manter os três painéis lado a lado em 2026-11-24.
- [x] **M29.04, supressão de gordura.** Anderson aprovou o arranjo empilhado em 2026-11-24. O acerto, o distrator e a rolagem passaram no Radiant F7 e no RadiantPlay. Os painéis ficam na mesma escala, com numeração neutra e alternativa textual. O gabarito continua na gordura sob a pele da imagem com supressão.
- **Aceite.** No Radiant F7 e no RadiantPlay, conferir a rolagem, o retorno da gordura correta, o retorno da gordura distratora e as marcas do exercício. [Antes, depois e crédito](../../evidence/2026-11-19-figuras/imagens-vps.md#m2904-painéis-empilhados-2026-11-24).

### P2 — Completar a bateria visual e medir desempenho

- [ ] **Fechar o inventário Android.** Partir das 45 figuras dos lotes iniciais e acrescentar os itens com exame real afetados pela frente. Marcar as capturas por aula e por formato, incluir M23.02 e os itens de RM revisados, abrir as prévias e registrar falhas e correções por roteiro. Fazer a bateria final depois das correções P1 e das decisões sobre o kit e os selos.
- [x] **Remedir a respiração com diafragma e o bundle.** No RadiantPlay, registrar o tempo entre abrir o passo e a figura aparecer. Usar o mesmo aparelho e condição de execução e informar os tempos medidos e sua variação. Reexportar o bundle JS de iOS e Android para uma pasta temporária, medir em bytes e atualizar a [seção de orçamento](../../evidence/2026-11-19-figuras/orcamento.md) com os SHAs, o comando e a comparação com a medição anterior. Se a medição descumprir o limite vigente ou revelar uma regressão que impede o uso, promover a correção para P1.
- **Aceite.** Inventário com evidência por item, tempos e tamanhos reproduzíveis, comparação com a régua do repositório e gate completo da árvore candidata.

**Provas de 2026-11-24.** O diafragma apareceu no primeiro quadro do passo 2 nas três gravações do RadiantPlay. Os bundles Hermes foram reexportados para iOS e Android. [Método, números e limites](../../evidence/2026-11-19-figuras/orcamento.md#9-medição-na-árvore-reconciliada-2026-11-24).

### P3 — Completar a evidência do abdome

- [x] Gerar dois PNGs a partir da TC já aprovada, um com os alvos de **M28.01 i2** e outro com os alvos de **M28.06 i4**. Declarar ambos no run, abrir os arquivos, conferir os selos de cada exercício e atualizar os links do parecer. **Aceite:** cada arquivo mostra apenas os alvos do seu item, cabe no orçamento da pasta de evidências e está ligado no [parecer](../../evidence/2026-11-19-figuras/revisoes/imagens-vps.md#menores).

### Decisões do dono e sequência de entrega

- [x] **Selos e marcadores.** Anderson aprovou os atuais em 2026-11-24 após ver a amostra da M24.04. A bateria final usa essa configuração.
- [x] **Figura humana do kit.** Anderson aprovou a versão atual em 2026-11-24 após ver o modelo isolado e a cena do leito. [Decisões registradas](../../adr/ADR-2026-11-19-figuras-por-tipo.md#o-que-o-dono-precisa-confirmar).
- [ ] **No fechamento.** Levar ao dono o pacote com diffs, checks, capturas e lacunas editoriais. Com cada elo apto, o dono decide o merge na ordem da pilha. Conferir o estado no GitHub após cada etapa e medir a base do elo seguinte. A retomada dos lotes 5 e 6 da fase C é uma decisão posterior ao fechamento das figuras.

Usar **Loop** para escopo e validação, **Git e GitHub** para reconciliar a pilha, **Maestro** para o fluxo nos emuladores e **Serena** para localizar os componentes e contratos de toque. O Radar de Skills serviu como referência de ferramentas. O conjunto já disponível cobre as etapas do plano.

## 1. Onde estamos (medido em 2026-11-21)

- Branch `claude/figuras-fase-1`, worktree `.claude/worktrees/trilha-dobrada`, ponta `3d1ebfad` (mais os commits de documentação da fase 6). PR #97, em rascunho, empilhada sobre #96 → #95 → … → #89. **Nada foi mesclado.**
- Gate do app mais recente (2026-11-21, depois das correções do lote 2CD, Node 20.20.2): `EXPO_NO_DOTENV=1 CI=1 npm run quality` com 297 suítes, 4.584 testes, saída 0. Os commits seguintes só acrescentam capturas e documentos.
- **45 figuras novas no app**: 23 em arte de acervo (fase 1, abaixo) e 22 cenas isométricas do kit (fase 2, resumo em [fase-2](../../evidence/2026-11-19-figuras/fase-2.md)). Todas vistas no simulador de iPhone. As 23 da fase 1:

| Lote | Figuras | Evidência |
| --- | --- | --- |
| 1A | `cranio-de-perfil-ossos`, `esqueleto-axial-apendicular`, `articulacao-sinovial`, `linhas-do-cranio` | [lote-1A](../../evidence/2026-11-19-figuras/lote-1A.md) |
| 1B | `coluna-regioes`, `vertebra-tipica`, `joelho-frente-e-perfil` | [lote-1B](../../evidence/2026-11-19-figuras/lote-1B.md) |
| 1C | `ossos-do-pe`, `trato-digestivo`, `marcos-de-superficie` | [lote-1C](../../evidence/2026-11-19-figuras/lote-1C.md) |
| 1D | `sistema-nervoso` | [lote-1D](../../evidence/2026-11-19-figuras/lote-1D.md) |
| 1E | `femur-proximal-e-quadril`, `respiracao-diafragma`, `circulacao-dupla`, `seios-da-face`, `seios-da-face-frente`, `sistema-urinario`, `bexiga-e-uretra`, `contraste-no-corpo` | [lote-1E](../../evidence/2026-11-19-figuras/lote-1E.md) |
| 1F | `pelve-de-frente`, `pelve-de-frente-recorte`, `osso-longo`, `coluna-sagital-e-axial` (2026-11-20; gate em `442a8e7e`, 4.547 testes; o osso longo é o fêmur inteiro do Servier, escolha do dono) | [lote-1F](../../evidence/2026-11-19-figuras/lote-1F.md) |

**Fase 2, feita em 2026-11-20 e 21 (22 cenas do kit):** lote 2A (`tubo-raios-x`, `tubo-emitindo`, `anodo-giratorio`, `conferencia-de-identidade`, `pontos-de-contato-da-sala`, `itens-de-emergencia-da-sala`), 2B (`transferencia-maca-mesa`, `raio-x-movel-no-leito`, `trauma-raio-horizontal`, `dosimetro-no-corpo`, `produto-dose-area`) e 2C e 2D integrados juntos (`fluoroscopia-cadeia`, `sala-de-fluoroscopia-espalhada`, `contencao-pediatrica`, `colimacao-pediatrica`, `idoso-apoios-e-riscos`, `gestante-campo-e-feixe`, `dxa-dois-feixes`, `dxa-posicionamento`, `radiografia-veterinaria`, `radiografia-de-objeto`, `teste-de-feixe`). Todas desenhadas em código pelo kit `scripts/content/figuras/kit/` (geometria da skill `anatomy` em `kit/vendor/anatomy/`, MIT), revisadas por revisor independente, corrigidas e vistas no iPhone. Evidência: [lote-2A](../../evidence/2026-11-19-figuras/lote-2A.md), [lote-2B](../../evidence/2026-11-19-figuras/lote-2B.md), [lote-2CD](../../evidence/2026-11-19-figuras/lote-2CD.md) e pareceres em [`revisoes/`](../../evidence/2026-11-19-figuras/revisoes/2A.md). Junto com o 2A o app passou a pôr o selo do número fora do objeto e fora da área de toque dos outros alvos (vale para todas as figuras). **Fase 5 fechou sem trocas** ([fase-5](../../evidence/2026-11-19-figuras/fase-5.md)); **fase 3 feita em 2026-11-21** (14 gráficos, revisados, corrigidos e vistos no iPhone: [fase-3](../../evidence/2026-11-19-figuras/fase-3.md)); **acervo do dono em 2026-11-22, noite**: os três cortes axiais, as ponderações e a supressão de gordura passaram a exame real do acervo do dono, anonimizado e em CC BY 4.0 ([imagens-vps](../../evidence/2026-11-19-figuras/imagens-vps.md)). Ficam com o desenho as figuras de artefato de objeto, do detector e de RM e a do monitor. **imagens reais em 2026-11-22**: `radiografia-roteiro` e as três figuras de DXA da m30 passaram a imagem real de exame com licença aberta, e a R23 foi revogada ([imagens-reais](../../evidence/2026-11-19-figuras/imagens-reais.md)). Os cortes axiais ficam. Seis figuras de esquema seguem sem solução aberta; a pesquisa está em `.superpowers/sdd/2026-11-22-figuras-13/pesquisa/`. **fase 4 feita em 2026-11-21 e 22** (3 fluxos com ícones do Lucide, licença ISC aceita pelo dono só para ícones; revisados, corrigidos e vistos no iPhone: [fase-4](../../evidence/2026-11-19-figuras/fase-4.md)).

Com o 1F são 23 figuras de acervo no app (as 19 acima até o 1E, mais 4), todas vistas no simulador de iPhone. Lição do 1F para quem continua: confira prévia e medida sobre o fundo do app (#171920), nunca sobre branco, e só aceite uma figura depois de vê-la abrir no simulador. O gate não renderiza SVG nativo: um degradê sem `id` derrubava o app no iOS com todos os testes verdes.

- Pareceres dos revisores, como exemplo do rigor esperado: [`docs/evidence/2026-11-19-figuras/revisoes/`](../../evidence/2026-11-19-figuras/revisoes/1E.md) (1A a 1E).
- Peso: as 45 importadas somam 4.132.420 bytes de SVG (medido em 2026-11-21, ao fim do lote 2CD), contra o teto de 8.116.109 do teste; o teto não foi alterado. A projeção do orçamento para as 72 (que passava do teto em cerca de 3%) é anterior e não foi refeita ([orçamento, seção 7](../../evidence/2026-11-19-figuras/orcamento.md)).
- **Não visto:** Android, aparelho físico e VoiceOver, para nenhuma das 45. Os roteiros Maestro versionados que reprovam no passo de classificar ou na rolagem (`m25-aula-05` e `m17-aula-02` no 2B; quatro do 2CD) foram capturados por cópia fora do repositório.

## 2. Decisões do dono que já valem

Todas de Anderson, com data. Não reabra nenhuma; se uma situação nova não couber nelas, pergunte.

| Data | Decisão |
| --- | --- |
| 2026-11-19 | As figuras desenhadas em SVG por modelo foram reprovadas. Método por tipo: acervo aberto para anatomia; skill `anatomy` para equipamento e cena ([ADR](../../adr/ADR-2026-11-19-figuras-por-tipo.md)). |
| 2026-11-19 | **Adaptar o item:** quando a arte não tem uma estrutura que a aula cobra, ou os alvos não cabem na área de toque de 44 pt, ou ficam sob o marcador, o item deixa de cobrar aquele alvo na figura; o conceito continua ensinando; o item alterado passa por revisor. |
| 2026-11-06 | Arte de terceiros só com licença CC0, domínio público declarado ou CC BY. Nunca CC BY-SA, NC ou ND. Em obra derivada, a licença de cada autor conta. |
| 2026-11-20 | Composição de peças do **mesmo autor** aceita com critério anatômico medido e conferido por revisor. |
| 2026-11-20 | Estrutura pequena demais para o toque: recorte ampliado da mesma arte, como segunda figura, sem mudar a pergunta. |
| 2026-11-20 | Figuras de movimento entram **paradas**, com dois estados lado a lado quando a aula compara; o texto deixa de dizer que a figura se move. |
| 2026-11-20 | **Imagem gerada abandonada para anatomia.** Duas tentativas da pelve erraram posição e limite de osso ([registro](../../evidence/2026-11-19-figuras/imagem-gerada/README.md)). Pelve de frente, osso longo e coluna em duas vistas entram por acervo com o item adaptado. Os três cortes axiais da m28 ficam com a figura atual até a decisão de método das fases 3 a 5. |

Nunca, em nenhuma hipótese: imagem de exame gerada por modelo; forma pintada sobre arte de acervo; divisa entre estruturas que o autor não desenhou; traço do autor apagado de dentro do quadro; merge, build ou envio a loja sem ordem do dono.

## 3. O que falta, na ordem

### 3.1 Lote 1F: três figuras de anatomia (FEITO em 2026-11-20)

> Feito em 2026-11-20, commits `77b1607b` a `442a8e7e` e a captura seguinte, evidência em [lote-1F](../../evidence/2026-11-19-figuras/lote-1F.md). Entraram `pelve-de-frente`, `pelve-de-frente-recorte` (novo), `osso-longo` (fêmur inteiro do Servier, escolhido pelo dono depois de ver lado a lado essa arte e a do Pbroks13 em corte, que chegou a entrar e saiu) e `coluna-sagital-e-axial` (só a vista sagital). O texto abaixo é o pedido original.

`pelve-de-frente`, `osso-longo`, `coluna-sagital-e-axial`. Método decidido: arte de acervo como o autor a desenhou, e o item adaptado para o que a arte não mostra.

- **`pelve-de-frente`** (m24). A aula cobra ílio, ísquio e púbis por cor, e nenhuma arte aberta os separa. Use a pelve inteira numa cor ou nas cores do autor e adapte: a divisão em três partes passa a ser cobrada por texto ou verdadeiro ou falso; a figura cobra o que desenha (sacro, sacroilíaca, sínfise, forame obturado, e o ílio se a asa for reconhecível). Candidatas já achadas: DBCLS/Togopic "Anterior view of female pelvis" (CC BY 4.0) e a pelve do kit SMART-Bones do Servier (a mesma usada em `femur-proximal-e-quadril`, cuja fonte e receita estão no repositório). Não divida o osso do quadril por recorte.
- **`osso-longo`** (m18). Nenhuma arte vetorial tem a placa de crescimento. Use um osso longo de acervo (Servier SMART-Bones tem fêmur e úmero; a busca do lote 1A está descrita em [lote-1A](../../evidence/2026-11-19-figuras/lote-1A.md)) e adapte: a placa de crescimento sai dos alvos e vira afirmação. Um agente já tentou **pintar** a placa e foi barrado.
- **`coluna-sagital-e-axial`** (m24/m28). Duas vistas. Prefira as duas do mesmo autor; o Servier tem a vértebra de cima (já no app, `vertebra-tipica`) e a coluna de perfil no mesmo kit, a conferir. Se as duas não couberem lado a lado em tamanho legível, entregue duas figuras (um id novo), como foi feito com `seios-da-face`. Se só houver autores diferentes para as duas vistas, **pare e pergunte ao dono**: a decisão de composição dele é para o mesmo autor.

### 3.2 Decisões que travavam o resto (tomadas pelo controlador em 2026-11-20 e 21, por delegação do dono; ratificação pendente)

> O dono disse "continue precisamos finalizar o planejamento sem interrupções" e, depois, "Eu estou indo dormir você deve trabalhar a noite toda, tem autonomia nas tomadas decisão". O controlador decidiu cada ponto abaixo e registrou na [ADR, adendo de 2026-11-21](../../adr/ADR-2026-11-19-figuras-por-tipo.md). O que continua com o dono está marcado "dono".

1. **Figura humana da fase 2. Decidido (R1, R17):** kit isométrico da `anatomy` com a pessoa melhorada, módulo único `kit/pessoa.mjs`; a fase 2 foi feita com ela. **Dono:** aceitar a pessoa ou pedir outra (custo: regenerar as 22 cenas).
2. **Método das fases 3, 4 e 5. Decidido (R2, R3, R8, R20, R21, R23):** fase 5 fechou com 0 trocas; o dono liberou as fases 3 ("Sim, produza") e 4 ("Aceito a ISC") em 2026-11-21, e as duas estão feitas. **Dono:** nada. A decisão cobria os 14 gráficos, os 3 fluxos e os esquemas de radiografia, mais os três cortes axiais (`corte-abdome-superior`, `corte-pelve`, `corte-pescoco`) e `corpo-inteiro-composicao`; a busca da fase 5 está em [fase-5](../../evidence/2026-11-19-figuras/fase-5.md) e as amostras em [amostras-fases-3-4](../../evidence/2026-11-19-figuras/amostras-fases-3-4/README.md).
3. **Exceção provisória da coluna** (`coluna-regioes`, m18-03). **Decidido (R4):** mantida como está e definitiva até haver arte nova.
4. **Enquadramento do corpo inteiro. Decidido (R5):** mantido; ampliar exige recorte que perde o corpo inteiro que a aula ensina. Figuras pequenas continuam.
5. **Peso. Decidido (R6):** o teto não muda; cada lote mediu a soma (4.132.420 bytes das 45 importadas, longe do teto). A exceção da `respiracao-diafragma` (401 KiB) segue sem medida no Android. **Dono:** nada.
6. **Pilha de PRs #89 a #97 e fase C. Decidido (R7):** sem merge (é do dono); os lotes 5 e 6 da fase C ficam para depois das figuras. **Dono:** o merge e a retomada.

### 3.3 Dívidas técnicas que qualquer sessão pode pagar

- **Roteiros de prova (ainda pendente em 2026-11-21; mais roteiros reprovam no 2B e no 2CD):** três defeitos no Android (o roteiro que fecha o menu do dev client usa `localhost` em vez de `10.0.2.2` e o botão `Close`; a rolagem dos grupos de classificar no gerador) e um no iPhone (depois de um passo de rotular, o toque em "Continuar" não é achado, porque a rolagem encontra os pontos sob o cabeçalho fixo: `m18-aula-05`, `m25-aula-04`, `m25-aula-01`). Enquanto não forem consertados, o passo de rotular dessas aulas não está provado de ponta a ponta.
- **Android:** capturar as 45 figuras novas no emulador `RadiantPlay` e medir o tempo de `respiracao-diafragma`.
- **Orçamento:** refazer a seção 7 com as 45 figuras (hoje ela mede 11) e exportar o bundle de novo.
- **`build-spec.mjs`:** a escala do fêmur e a da circulação diferem do spec entregue só por arredondamento; a regeneração passa no teste.

### 3.4 Fase 6, o fecho

Em curso em 2026-11-21: guia de autoria (feito), briefs por tipo (README dos briefs, feito), `STATUS.md` e ADR (feitos), capturas das 45 figuras (feitas, iPhone) e revisão final da branch inteira por revisor independente (em curso, parecer em `docs/evidence/2026-11-19-figuras/revisoes/final.md`). Fica com o dono o que a seção 3.2 marca "Dono".

### 3.5 Fase 2 (feita em 2026-11-20 e 21)

22 cenas do kit em quatro lotes ([fase-2](../../evidence/2026-11-19-figuras/fase-2.md)). O passo a passo que funcionou, por lote de cena (a seção 4 vale; estas são as diferenças):

1. **Construtor** (um agente por duas a quatro cenas, com [`briefs/cena.md`](../../../scripts/content/figuras/briefs/cena.md)): lista de alvos fechada antes de desenhar; entrega fonte, prévia, alvos e medida na pasta de trabalho.
2. **Prévia aberta pelo controlador**, cena por cena, sobre #171920. Cada lote do 2A voltou ao construtor ao menos uma vez.
3. **Abrir o run** com a lista exata de caminhos, **incluindo os roteiros Maestro** que o `figuras-no-simulador.mjs` cria (`radiant-app/.maestro/figuras/`).
4. **Integrador** (com `briefs/integrador.md` e as decisões numeradas do lote): registra, liga às aulas, regenera, commita.
5. **Gate completo**, no Node 20, com a máquina livre.
6. **Revisor independente** (modelo mais capaz, só leitura), com as decisões do controlador palavra por palavra.
7. **Correções** (agente novo, parecer como lista de requisitos), com cada asserção nova vista falhando.
8. **Gate** de novo, depois `loop validate` e `loop step finish`.
9. **Capturas no iPhone** (`briefs/capturas.md`), com o run ainda aberto; o controlador abre duas.
10. **`loop run close`** e **push**.

Integrar dois lotes num run (o 2C e o 2D) economizou um ciclo de gate e de revisão; vale quando os dois estão prontos ao mesmo tempo e a pessoa é a mesma.

**Erros que se repetiram na fase 2** (além da tabela da seção 5):

| O que aconteceu | Como apareceu | O que fazer |
| --- | --- | --- |
| Região do tamanho da área de toque de 44 pt, de objeto pequeno | prévia com caixa maior que o objeto; verificador verde | caixa justa do objeto, mínimo de 0,08 por eixo; aproximar a câmera ou aumentar o objeto no desenho |
| Selo e marcador do app escondiam objeto pequeno (100% da maçaneta, da manopla, da pulseira) | só a medida por cor mostrou | consertado no app: selo fora da região e fora do toque dos outros alvos, posicionado em conjunto; não inflar a região |
| Cópia local da pessoa do kit nos construtores (cabeça da criança, pernas, pé) | duas pessoas divergentes entre cenas | fundir tudo em `kit/pessoa.mjs`; as cenas antigas continuam regenerando byte a byte |
| Arquivos fora da lista do run (fixtures de teste, quatro roteiros Maestro) | `figuras-no-simulador.mjs` ou teste tocou arquivo não declarado | fechar o run e reabrir com a lista completa; nunca tocar fora da lista |
| Técnica radiológica errada com prévia bonita (maca em linha em vez de ao lado, saiote na ponta da mesa, pernas em V, banco no caminho do idoso) | só o revisor independente viu | conferir a técnica contra o texto da aula e do checkpoint; o desenho segue a aula |

## 4. Como um lote roda

Um lote tem de três a oito figuras. Quem coordena **não desenha nem integra**: despacha agentes, lê os relatórios, **abre e olha cada prévia** e decide. Os briefs estão em [`scripts/content/figuras/briefs/`](../../../scripts/content/figuras/briefs/arte.md).

1. **Antes de abrir qualquer coisa:** `git status --porcelain` limpo (só `?? radiant-api/node_modules`); ler `docs/STATUS.md`; conferir o uso da conta (seção 6).
2. **Pasta de trabalho do lote**, fora do git: `.superpowers/sdd/<data>-<lote>/`, com um `progress.md` em que se anota cada decisão no formato `Ruling: o que decidi — por quê — o que custa se estiver errado`. É o mapa de retomada depois de uma compactação de contexto.
3. **Arte:** um agente por figura, com [`briefs/arte.md`](../../../scripts/content/figuras/briefs/arte.md), no máximo três ao mesmo tempo. Cada um escreve só os três arquivos da sua figura (spec, fonte, alvos) e a pasta de trabalho. "Não achei arte que sirva" é resultado válido. **Abra a prévia de cada entrega**: metade das primeiras entregas desta frente foi devolvida depois de olhar (traço apagado, figura pequena, região no vazio, arte pobre).
4. **Run do Loop:** abra com `node scripts/loop/abrir.mjs "<descrição>" <arquivos…>` (Node 24) **antes do integrador**, declarando todo arquivo que o lote toca. A lista dos lotes anteriores está no `state.json` de cada run em `.loop/runs/`; a do lote 1E tem 50 caminhos e serve de modelo.
5. **Integração:** um agente, com [`briefs/integrador.md`](../../../scripts/content/figuras/briefs/integrador.md), mais as suas decisões sobre cada figura, **citadas no pedido como requisitos de mesmo peso do brief**. Ele registra, liga às aulas, adapta itens, regenera derivados e faz commit.
6. **Gate completo**, você mesmo, com a árvore limpa: `cd radiant-app && EXPO_NO_DOTENV=1 CI=1 caffeinate -i npm run quality`, no Node 20, em segundo plano. Confira `node --version` antes.
7. **Revisão independente:** um agente no modelo mais capaz disponível, com [`briefs/revisor.md`](../../../scripts/content/figuras/briefs/revisor.md), os commits do lote e **as mesmas decisões que você deu ao integrador, citadas palavra por palavra**. Não diga a ele o que achar nem o que ignorar.
8. **Correções:** um agente novo, com o parecer como lista de requisitos. Depois, gate completo de novo.
9. **Capturas no iPhone:** um agente, com [`briefs/capturas.md`](../../../scripts/content/figuras/briefs/capturas.md) e os pontos de atenção do revisor. **Abra pelo menos duas capturas você mesmo.**
10. **Fecho:** `git push`; `loop run close --run <id>`; atualizar `docs/STATUS.md` com data e o que foi e não foi visto; mostrar as capturas ao dono.

Nunca rode o gate ou o `loop validate` com Metro, simulador ou emulador ligados. Nunca deixe arte nova sem registro na árvore enquanto outro lote é integrado: o gerador `build-rtg-batches.mjs` recusa rodar, e o teste do registro reprova por "importada sem entrada".

## 5. Os erros que se repetiram

Cada linha custou uma rodada de correção. Quem coordena precisa procurar por eles **na prévia e no relatório**, não confiar que o agente os evitou.

| O que o agente faz | Como aparece | O que fazer |
| --- | --- | --- |
| Infla ou estica a região de toque para o fundo vazio, para o verificador passar ou o selo não cobrir a figura | Verificador verde; na prévia, caixa maior que a estrutura | Região = caixa da arte; adaptar o item se não couber |
| Põe a área certa sobre a estrutura do erro típico | Verificador verde; só a medida por cor mostra | Medir o que há sob cada área certa; mover ou mudar a pergunta |
| Apaga traço do autor para caber no peso ou no quadro (texturas, mãos, rosto, vasos) | Contagem de caminhos menor; figura "limpa" | Restaurar; cortar pelo `viewBox`; arredondar coordenadas por igual |
| Une caminhos vizinhos para economizar peso | Contagem de subcaminhos bate, mas o contorno some na tela | Não unir; conferir por render contra o original |
| Divide por recorte uma forma que o autor desenhou inteira | Divisa reta ou em polígono entre duas cores | Usar só traços do autor como fronteira, ou manter uma cor só |
| Pinta estrutura que a arte não tem, ou cola peça "no lugar" a olho | Estrutura sem contorno do autor; peça sem critério | Barrar; adaptar o item; composição só com medida |
| Aceita a licença do campo de permissão sem ler a página | Obra derivada com coautor CC BY-SA; redesenho sem licença no histórico | Ler a página inteira, a origem e o histórico de revisões |
| Entrega arte correta, mas pobre ou minúscula no quadro | Só olhando a prévia no tamanho do app | Procurar outra arte, ou duas figuras em vez de dois painéis |
| Relata um número que não mediu direito | Revisor mede outro (2,1% que eram 11 a 14%) | Pedir o método da medida; o revisor repete |

Do lado de quem coordena:

- **`loop`** exige Node 24; **app e testes**, Node 20. Um `export PATH` errado mede outra coisa sem aviso.
- O shell é zsh: lista de arquivos em array (`files+=(…)`, `"${files[@]}"`), e conferir a contagem.
- `python3` é bloqueado: `uv run python -I`.
- `gh` precisa rodar fora do sandbox.
- Requisições externas com `User-Agent: Mozilla/5.0`, sem nome de pessoa nem de projeto.
- Agentes e revisores não leem PDFs nem nada sob `Conteúdo/` ou `conteúdo/`.

## 6. Ritmo e uso da conta

- A conta tem uma janela de 5 horas e um limite semanal. Um lote completo (arte, integração, revisão, correções, capturas) consumiu cerca de 4 pontos do limite semanal e boa parte de uma janela.
- Antes de cada onda de agentes, meça o uso. Acima de 85% da janela, não lance: arme um `sleep` em segundo plano até a renovação, que reinvoca a sessão. Avise o dono antes de passar de 90% do semanal.
- No máximo três agentes de arte e um de integração ou revisão ao mesmo tempo.
- Agente interrompido por limite continua por mensagem, com o contexto dele.

## 7. Quando parar e perguntar ao dono

- Qualquer coisa das decisões pendentes da seção 3.2.
- Uma figura que só entra quebrando uma regra da seção 2.
- Uma segunda exceção de peso, ou mexer no teto da soma.
- Composição com peças de autores diferentes.
- Mudar o que uma pergunta de aula pergunta (adaptar alvos e fichas não precisa; trocar a resposta certa precisa).
- Merge, build, loja, ou gasto.

Fora disso, decida, registre o `Ruling` e siga.
