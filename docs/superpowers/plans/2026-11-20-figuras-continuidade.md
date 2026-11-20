# Troca das figuras: plano de continuidade

> Escrito em 2026-11-20 para quem assume a execução do [plano de troca das figuras](2026-11-19-troca-das-figuras.md) sem ter participado das sessões anteriores. Este documento manda no que diz respeito a **como** executar; o plano original continua mandando no **quê** (lista de figuras por fase). Onde os dois divergem, vale este, que é mais novo. Estado vivo: [`docs/STATUS.md`](../../STATUS.md).

**Objetivo:** trocar as 72 figuras usadas pela trilha `rtg-2026` por arte que o dono aceite, sem perder o rigor do que já foi entregue.

**Regra de ouro:** nesta frente, todo defeito sério foi achado por **medida de um revisor independente**, nunca pelo verificador automático. Um lote só está pronto depois de integração, revisão independente, correções, gate completo e captura no simulador. Não pule etapa para ganhar tempo.

## 1. Onde estamos (medido em 2026-11-20)

- Branch `claude/figuras-fase-1`, worktree `.claude/worktrees/trilha-dobrada`, ponta `8267ab89` mais o commit deste documento. PR #97, em rascunho, empilhada sobre #96 → #95 → … → #89. **Nada foi mesclado.**
- Gate do app em `ee193fa9`: `EXPO_NO_DOTENV=1 CI=1 npm run quality` com 297 suítes, 4.454 testes, saída 0. Os commits seguintes só acrescentam capturas e documentos.
- **19 figuras em arte de acervo no app**, todas vistas no simulador de iPhone:

| Lote | Figuras | Evidência |
| --- | --- | --- |
| 1A | `cranio-de-perfil-ossos`, `esqueleto-axial-apendicular`, `articulacao-sinovial`, `linhas-do-cranio` | [lote-1A](../../evidence/2026-11-19-figuras/lote-1A.md) |
| 1B | `coluna-regioes`, `vertebra-tipica`, `joelho-frente-e-perfil` | [lote-1B](../../evidence/2026-11-19-figuras/lote-1B.md) |
| 1C | `ossos-do-pe`, `trato-digestivo`, `marcos-de-superficie` | [lote-1C](../../evidence/2026-11-19-figuras/lote-1C.md) |
| 1D | `sistema-nervoso` | [lote-1D](../../evidence/2026-11-19-figuras/lote-1D.md) |
| 1E | `femur-proximal-e-quadril`, `respiracao-diafragma`, `circulacao-dupla`, `seios-da-face`, `seios-da-face-frente`, `sistema-urinario`, `bexiga-e-uretra`, `contraste-no-corpo` | [lote-1E](../../evidence/2026-11-19-figuras/lote-1E.md) |
| 1F | `pelve-de-frente`, `pelve-de-frente-recorte`, `osso-longo`, `coluna-sagital-e-axial` (2026-11-20; gate em `442a8e7e`, 4.547 testes; o osso longo é o fêmur inteiro do Servier, escolha do dono) | [lote-1F](../../evidence/2026-11-19-figuras/lote-1F.md) |

Com o 1F são 23 figuras no app (as 19 acima até o 1E, mais 4), todas vistas no simulador de iPhone. Lição do 1F para quem continua: confira prévia e medida sobre o fundo do app (#171920), nunca sobre branco, e só aceite uma figura depois de vê-la abrir no simulador. O gate não renderiza SVG nativo: um degradê sem `id` derrubava o app no iOS com todos os testes verdes.

- Pareceres dos revisores, como exemplo do rigor esperado: [`docs/evidence/2026-11-19-figuras/revisoes/`](../../evidence/2026-11-19-figuras/revisoes/1E.md) (1A a 1E).
- Peso: as 19 somam 2.641.375 bytes de SVG, contra o teto de 8.116.109 do teste. A projeção para as 72 passa do teto em cerca de 3% ([orçamento, seção 7](../../evidence/2026-11-19-figuras/orcamento.md)). O teto não foi alterado.
- **Não visto:** Android e aparelho físico, para nenhuma das 19.

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

### 3.2 Decisões que travam o resto (são do dono; não comece sem elas)

1. **Figura humana da fase 2.** A amostra está em [`amostra-fase-2/`](../../evidence/2026-11-19-figuras/amostra-fase-2/relatorio.md): equipamento bom, gente ainda com cara de manequim, e a pessoa sem avental e o leito vizinho amontoados à esquerda. Alternativa prevista no plano: silhueta de acervo aberto sobre equipamento isométrico. **Sem o aceite da figura humana a fase 2 (22 cenas) não começa.**
2. **Método das fases 3, 4 e 5** (14 gráficos, 3 fluxos, 9 esquemas de radiografia): no plano são só propostas. Entram nessa decisão os três cortes axiais (`corte-abdome-superior`, `corte-pelve`, `corte-pescoco`) e `corpo-inteiro-composicao`, que é esquema de exame e foi reclassificada. Pista para os cortes: atlas de Sobotta, de 1906, em domínio público, tem um corte axial do abdome em raster.
3. **Exceção provisória da coluna** (`coluna-regioes`, m18-03): os marcadores ficam ao lado da coluna, não em cima.
4. **Enquadramento do corpo inteiro:** esqueleto, sistema nervoso e circulação ocupam cerca de um quarto da largura do quadro 4:3.
5. **Peso:** a projeção passa do teto em 3%, e a exceção de `respiracao-diafragma` (401 KiB, teto de 480 só para ela) não foi medida no Android.
6. **Pilha de PRs #89 a #97** e a retomada dos lotes 5 e 6 da fase C da trilha dobrada.

### 3.3 Dívidas técnicas que qualquer sessão pode pagar

- **Roteiros de prova:** três defeitos no Android (o roteiro que fecha o menu do dev client usa `localhost` em vez de `10.0.2.2` e o botão `Close`; a rolagem dos grupos de classificar no gerador) e um no iPhone (depois de um passo de rotular, o toque em "Continuar" não é achado, porque a rolagem encontra os pontos sob o cabeçalho fixo: `m18-aula-05`, `m25-aula-04`, `m25-aula-01`). Enquanto não forem consertados, o passo de rotular dessas aulas não está provado de ponta a ponta.
- **Android:** capturar as 19 figuras no emulador `RadiantPlay` e medir o tempo de `respiracao-diafragma`.
- **Orçamento:** refazer a seção 7 com as 19 figuras (hoje ela mede 11) e exportar o bundle de novo.
- **`build-spec.mjs`:** a escala do fêmur e a da circulação diferem do spec entregue só por arredondamento; a regeneração passa no teste.

### 3.4 Fase 6, o fecho

Só quando as outras fases terminarem: guia de autoria, briefs por tipo, capturas de todas as figuras e revisão final da branch inteira, como no plano original.

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
