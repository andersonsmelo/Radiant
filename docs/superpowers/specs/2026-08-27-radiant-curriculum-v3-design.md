# Radiant Curriculum V3 — design da trilha contínua e do Arco 1

**Data:** 2026-08-27
**Estado:** aprovado pelo dono; Arco 1 aprovado com correções pelo auditor de
domínio. Fundação técnica J2 implementada; produção das lições do Arco 1 ainda
pendente, conforme o [status canônico](../../STATUS.md).
**Decisor de produto:** Anderson
**ADR:**
[`ADR-2026-08-27-curriculo-v3-trilha-continua.md`](../../adr/ADR-2026-08-27-curriculo-v3-trilha-continua.md)

## 1. Contexto

A auditoria no iPhone 16 mostrou que o currículo embarcado não sustenta a
proposta do produto. A primeira atividade de profissão usa um painel genérico
de radiografia de tórax, oferece uma chamada de interação que não produz
investigação real e conduz a um quiz sobre ética e atribuições. O inventário
posterior separou 18 aulas legadas, 12 atividades promovidas, 72 nós de jornada
e 96 pacotes editoriais; essas contagens não representam 72 aulas distintas.

O Radiant V3 deixa de tratar ética e atribuições profissionais como razão
principal para instalar o aplicativo. O produto passa a oferecer treinamento
prático e contínuo para melhorar o desempenho diário dentro da radiologia. Os
pilares de entrada são anatomia, fisiologia e física, retomados com maior
profundidade em cada modalidade.

Esta especificação define:

- a arquitetura curricular contínua;
- a aposentadoria segura do currículo anterior;
- o contrato de qualidade, domínio, gamificação e acessibilidade das lições;
- o primeiro arco, sobre orientação espacial;
- os gates que separam design aprovado de conteúdo publicável.

Esta spec registra o design; não concede por si só autorização de execução.
O dono autorizou posteriormente a implementação, e a fundação J2 foi entregue
em `320e10d`. Exclusão física do legado, build e submissão às lojas continuam
fora dessa autorização. A próxima execução segue o
[roteiro do Arco 1](../../runbooks/curriculum-v3-arco-1.md).

## 2. Objetivo do produto educacional

> Oferecer treinamento prático e contínuo para aprimorar o desempenho diário
> em radiologia, conectando anatomia, fisiologia e física às decisões e imagens
> de cada modalidade.

O conteúdo é dirigido ao público em geral interessado ou atuante em radiologia.
O currículo não cria rótulos rígidos de perfil, nível acadêmico ou função
profissional. A profundidade é expressa pelo próprio conteúdo:

1. essencial;
2. aprofundamento opcional;
3. prática aplicada;
4. limites, variações e informação insuficiente.

## 3. Sequência curricular aprovada

O V3 é uma estrada única, organizada em arcos, nesta ordem:

1. Fundamentos — anatomia, fisiologia e física;
2. Radiografia;
3. Mamografia;
4. Tomografia computadorizada;
5. Ressonância magnética;
6. Medicina nuclear;
7. Radioterapia;
8. Outras especializações.

Essa sequência é uma decisão editorial do Radiant, não uma classificação
científica universal. Fundamentos formam um núcleo inicial delimitado; não
tentam esgotar anatomia, fisiologia e física antes da entrada nas modalidades.
Os três pilares retornam em espiral:

- anatomia de referência evolui para anatomia projetada e seccional;
- fisiologia reaparece na função dos sistemas e nos contrastes observados;
- física reaparece na formação, aquisição, qualidade e segurança da imagem.

## 4. Arquitetura do currículo

### 4.1 Identidade e versionamento

O novo currículo tem identidade própria, conceitualmente `curriculum:v3`.
Identificadores de arco, lição, atividade, objetivo e item avaliativo são
estáveis e não dependem do título, da ordem visual ou do texto traduzido.

Reordenação editorial não pode alterar o significado de um identificador já
publicado. Mudança que modifique objetivo, resposta ou evidência de domínio
gera nova versão do conteúdo, preservando a tentativa anterior.

### 4.2 Publicação incremental sem nós vazios

O V3 pode ser produzido lição por lição, mas somente caminhos completos entram
no catálogo publicável. Um caminho completo contém:

- introdução e modelo explicativo;
- exploração funcional;
- prática;
- evidência independente do objetivo essencial;
- feedback e remediação;
- destino de revisão.

O aplicativo não exibe títulos futuros, nós provisórios, interações falsas ou
atividades que terminem sem avaliação do objetivo declarado.

### 4.3 Estrada contínua e domínio

A estrada apresenta uma única fronteira entre o percorrido e o próximo passo.
O desbloqueio depende de objetivos essenciais praticados, não de XP, tempo de
uso, número de toques, vidas ou mera passagem por telas.

Cada objetivo pode estar em um destes estados:

- **introduzido:** explorado com orientação;
- **praticado:** demonstrado em item novo, sem ajuda;
- **consolidado:** recuperado de forma independente numa revisão posterior.

A próxima lição pode abrir no estado praticado. A consolidação acontece ao
longo da estrada e não cria espera artificial.

### 4.4 Aposentadoria do currículo anterior

O catálogo anterior não será apagado de forma imediata. Ele participa de
contratos persistidos de trilha, nós, tentativas e revisão em instalações
existentes.

O corte segue quatro fases:

1. construir o catálogo V3 e um primeiro bloco publicável;
2. migrar a autoridade ativa para o V3, preservando uma fotografia somente de
   leitura do histórico anterior;
3. retirar o currículo anterior das superfícies do produto e validar instalação
   limpa e atualização de instalação existente;
4. remover arquivos e adaptadores legados somente quando nenhum consumidor de
   runtime depender deles.

O histórico anterior não concede domínio no V3 e não é misturado às novas
evidências. A remoção física exige, no mínimo:

- migração coberta por testes;
- smoke de instalação limpa e atualização no iPhone 16;
- persistência e retomada verificadas;
- ausência de referências de runtime ao catálogo anterior;
- decisão explícita no corte destrutivo.

## 5. Contrato de uma lição V3

Cada lição percorre este ciclo, adaptado ao objetivo:

1. **situação:** apresenta uma dúvida real ou um problema espacial, físico ou
   fisiológico;
2. **modelo:** torna observável a relação que precisa ser compreendida;
3. **exploração:** permite manipulação ou comparação com resultado verificável;
4. **desafio:** exige uma decisão ligada ao objetivo;
5. **feedback causal:** explica por que a decisão funciona e o que mudaria;
6. **transferência:** aplica o conceito a um exemplo diferente;
7. **síntese:** registra poucas ideias essenciais e seus limites;
8. **revisão:** recupera o conceito mais tarde em novo contexto.

### 5.1 Regra de evidência

Todo objetivo essencial precisa de pelo menos um item novo, sem ajuda e
diferente do exemplo ensinado. O sistema registra separadamente:

- `initial_independent` — tentativa inicial independente;
- `assisted_practice` — prática após pista ou explicação;
- `later_independent_retrieval` — recuperação independente posterior.

Prática assistida, repetição imediata ou XP nunca fecham domínio. Depois de
qualquer ajuda, qualquer conceito exige nova recuperação independente.

### 5.2 Erro e remediação

O erro não retira vidas. Ele percorre:

1. classificação por conceito;
2. microexplicação específica;
3. prática isomórfica assistida, não pontuada como domínio;
4. item novo e independente em momento posterior.

O Arco 1 inaugura esta taxonomia:

| Código | Concepção observada |
| --- | --- |
| `E-LAT-OBS` | troca direita/esquerda do corpo com a do observador |
| `E-GRV` | confunde referência anatômica com cima/baixo gravitacional |
| `E-REL` | aplica incorretamente um par relacional |
| `E-PLN-MED` | trata qualquer sagital como plano mediano |
| `E-PLN-SEC` | confunde plano geométrico, região amostrada e imagem |
| `E-PLN-OBL` | não reconhece obliquidade em relação aos planos de referência |
| `E-SRC` | funde fontes distintas de orientação ou lateralidade |
| `E-POS` | trata `Patient Position` como geometria exata da imagem |
| `E-UNK` | infere orientação quando a informação é ausente ou conflitante |

## 6. Gamificação

Gamificação acompanha aprendizagem; não substitui sua evidência.

- XP é recompensa associada à prática, nunca autoridade de desbloqueio.
- A missão diária combina continuação curta e revisões pertinentes.
- A constância registra frequência sem apagar histórico por ausência em um dia.
- Conquistas nomeiam capacidades demonstradas, não quantidade de cliques.
- Casos progressivos e variações funcionam como recompensa de profundidade.
- Erro gera caminho menor e específico, sem punição artificial.

Uma indicação de interação só aparece quando a ação modifica o estado e ensina
algo observável. “Toque para examinar” sem exame funcional é proibido.

## 7. Animação e acessibilidade

O padrão recomendado para o primeiro arco é um mapa corporal vetorial em 2.5D:
mais controlável e leve que um corpo 3D completo e mais instrutivo que cartões
estáticos.

Toda interação possui:

1. gesto ou toque direto;
2. controles discretos nomeados e operáveis por VoiceOver e controle
   alternativo;
3. cenário textual equivalente que mede o mesmo conceito sem entregar a
   resposta;
4. forma, padrão ou rótulo além de cor;
5. estado estático equivalente, movimento interrompível e suporte a Reduce
   Motion.

Descrições acessíveis de itens avaliativos identificam controles e dados
disponíveis, mas não nomeiam a resposta. A equivalência de dificuldade entre
versão visual e textual é um gate medido no aplicativo, não uma conclusão desta
spec.

## 8. Governança científica e editorial

Cada objetivo publicado possui:

- fonte oficial pertinente, edição e data de revisão;
- glossário versionado;
- definição operacional e limites;
- erro previsível e item que o mede;
- proveniência e direitos de cada ativo;
- revisão técnica especializada registrada.

Conteúdo técnico ou clínico usa fontes primárias ou normativas. Texto editorial
em português não se apresenta como tradução oficial quando a fonte não fornece
uma versão oficial em português.

## 9. Arco 1 — Orientação espacial

### 9.1 Composição

1. **L1 — O corpo como referência**
2. **L2 — Cortando o espaço**
3. **P1 — Prática intercalada**
4. **L3 — Do corpo para a imagem**
5. **C1-A — Mapa corporal**
6. **C1-B — Planos e orientação da imagem**
7. **R1/R2 — Revisões espaçadas e reaplicações posteriores**

### 9.2 L1 — O corpo como referência

**Pergunta:** como descrever uma relação sem depender da posição do observador
ou da gravidade?

Objetivos essenciais:

- reconstruir a posição anatômica de referência;
- distinguir direita/esquerda do corpo e do observador;
- aplicar superior/inferior, anterior/posterior, medial/lateral,
  proximal/distal e superficial/profundo;
- manter a referência sob mudança de postura.

A atividade inicial de lateralidade é diagnóstica e não pontuada. Linha
mediana, ligação do membro e camadas locais sustentam visualmente as relações.
Indicadores de direção não são chamados de eixos. O domínio usa novo par, nova
postura e ausência de pista.

### 9.3 L2 — Cortando o espaço

**Pergunta:** como uma referência geométrica se relaciona com os dados de uma
região do corpo?

Objetivos essenciais:

- distinguir planos coronais, sagitais, mediano e transversais;
- reconhecer plano oblíquo em relação aos planos de referência;
- entender que o plano mediano é um caso específico entre planos sagitais;
- separar plano geométrico, região amostrada, espessura e imagem resultante.

A formulação editorial preferida é:

> A imagem seccional representa dados de uma região espacial, que pode possuir
> espessura nominal.

Eixos são aprofundamento opcional e não bloqueiam o arco. Movimento articular
fica fora desta lição. “Axial” só aparece quando o contexto declarado justificar
o uso. Cada item avaliativo registra objetivo e erro; mudar apenas o nível
anatômico não produz automaticamente um item novo.

### 9.4 P1 — Prática intercalada

A matriz cobre `E-LAT-OBS`, `E-GRV`, as famílias de `E-REL`, `E-PLN-MED`,
`E-PLN-SEC` e `E-PLN-OBL`. A quantidade deriva da cobertura e pode ser dividida
em sessões. Não existe teto editorial que permita omitir um objetivo.

### 9.5 L3 — Do corpo para a imagem

**Pergunta:** quais informações permitem orientar uma imagem com segurança?

A lição separa cinco classes:

1. indicação visual presente nos pixels ou na apresentação;
2. `Patient Orientation`, com direções positivas de linhas e colunas;
3. `Image Orientation (Patient)` e `Image Position (Patient)`, que descrevem
   geometria no sistema do paciente;
4. `Laterality` e `Image Laterality`, que descrevem o lado da parte anatômica
   examinada e não a geometria das linhas e colunas;
5. aparência anatômica, tratada como pista e nunca prova isolada.

`Patient Position` é descrição nominal da posição em relação ao equipamento e
não fornece sozinho a geometria exata. A/P/R/L/H/F aparecem somente no contexto
DICOM para orientação anatômica bípede e não são declarados obrigatoriamente
visíveis.

O objetivo não é calcular cossenos diretores. A pessoa distingue a função das
fontes e julga suficiência. Um caso novo contém informação suficiente e
coerente; outro contém ausência ou conflito e exige “não é possível determinar
com segurança”. Conflito entre atributos que deveriam ser consistentes é
rotulado como dado inconsistente ou não conforme, não como normalidade.

Projeção e incidência ficam fora desta lição e serão definidas no arco de
radiografia com fontes e convenção editorial próprias.

### 9.6 C1 — Matriz de evidências

O checkpoint é dividido para controlar a carga sem reduzir cobertura.

**C1-A — seis decisões independentes:**

1. lateralidade do corpo versus observador;
2. superior/inferior;
3. anterior/posterior sob mudança de postura;
4. medial/lateral;
5. proximal/distal;
6. superficial/profundo.

**C1-B — no mínimo oito decisões independentes:**

1. mediano versus sagital não mediano;
2. coronal versus transversal;
3. oblíquo;
4. plano versus região/imagem com espessura;
5. fonte de orientação/lateralidade (`E-SRC`);
6. limite de `Patient Position` (`E-POS`);
7. orientação com evidência suficiente;
8. evidência ausente, conflitante ou inconsistente (`E-UNK`).

O número decorre da matriz e pode crescer. Não se remove item para manter uma
faixa fixa. Qualquer ajuda exige nova recuperação independente. O relatório
distingue demonstrado, frágil, recuperado após apoio e não avaliado.

### 9.7 Revisões

R1 é alvo editorial após dois outros nós; R2, após cinco a oito. O agendador
adapta o retorno conforme as três classes de evidência. Revisão só conta quando
exige recuperação ativa independente. Exemplos variam postura, plano, nível e
modalidade. Atraso não apaga domínio ou constância.

Os conceitos reaparecem naturalmente em radiografia, mamografia, tomografia e
ressonância.

## 10. Glossário inicial

Fonte: **Terminologia Anatomica 2, Part 1**, consultada em 2026-08-27. A coluna
PT-BR é redação editorial do Radiant sujeita a revisão especializada.

| TA2 | Termo TA2 | PT-BR editorial |
| --- | --- | --- |
| 7 | `Dexter` | direito |
| 8 | `Sinister` | esquerdo |
| 10 | `Medialis` | medial |
| 11 | `Lateralis` | lateral |
| 12 | `Anterior` | anterior |
| 13 | `Posterior` | posterior |
| 18 | `Superior` | superior |
| 19 | `Inferior` | inferior |
| 32 | `Superficialis` | superficial |
| 33 | `Profundus` | profundo |
| 34 | `Proximalis` | proximal |
| 35 | `Distalis` | distal |
| 46 | `Plana referentiae` | planos de referência |
| 48 | `Plana coronalia` | planos coronais |
| 49 | `Plana sagittalia` | planos sagitais |
| 50 | `Planum medianum` | plano mediano |
| 51 | `Planum paramedianum` | plano paramediano |
| 52 | `Plana transversa` | planos transversais |

“Frontais” pode aparecer como sinônimo contextual de planos coronais. `Axialis`
(TA2 28) permanece termo geral e não cria equivalência universal com
transversal.

## 11. Fontes fixadas para o Arco 1

- FIPAT, **Terminologia Anatomica 2, Part 1**, edição consultada em 2026-08-27.
- DICOM **PS3.3 2026c**, General Image Module, Image Plane Module e Patient
  Position.
- DICOM **PS3.17 2026c**, Anexo A — Explanation of Patient Orientation.
- Apple Human Interface Guidelines — Accessibility, e critérios de avaliação
  de VoiceOver, consultados em 2026-08-27.

Referências “current” podem ser mantidas como ponte de consulta, mas a ficha do
conteúdo registra a edição 2026c e a data para evitar que uma URL mutável mude a
base silenciosamente.

## 12. Resultado da auditoria independente

O auditor independente classificou:

- L1, P1, revisões, glossário e taxonomia: aprovados;
- L2, L3 e C1: aprovados com correções incorporadas nesta spec;
- Arco 1: aprovado com correções, sem reprovação conceitual remanescente.

O arco permanece bloqueado para publicação até:

1. cada item ligar objetivo, erro e evidência;
2. revisão técnica especializada ser executada e registrada;
3. VoiceOver, controle alternativo, Reduce Motion, redundância sem cor e
   equivalência visual/textual serem testados no aplicativo;
4. direitos e proveniência dos ativos serem registrados;
5. instalação limpa, atualização e persistência passarem no aparelho físico.

## 13. Limites para a implementação futura

- Nenhum arquivo legado será apagado na primeira fase.
- Nenhuma lição V3 reutilizará automaticamente texto, imagem ou resposta do
  catálogo anterior.
- Nenhum mockup será apresentado como interação real.
- Nenhuma fonte de terceiros sem direitos alimentará um ativo.
- Nenhum teste automatizado substituirá revisão científica, visual ou em
  aparelho.
- A arquitetura/versionamento foi entregue pelo plano J2. O próximo plano
  trata apenas da produção do Arco 1 sobre essa fundação, sem tentar produzir
  todas as modalidades de uma vez ou antecipar o corte J5.

## 14. Critério de saída do design

O design está pronto para virar plano quando:

- esta spec e a ADR estiverem versionadas;
- o estado e o roadmap apontarem para o V3;
- o auditor não registrar reprovação conceitual;
- o plano futuro preservar todos os gates de publicação sem convertê-los em
  conclusão antecipada.
