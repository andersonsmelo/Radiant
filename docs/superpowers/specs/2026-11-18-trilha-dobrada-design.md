# Trilha dobrada, internacional e menos textual (versão 1.7)

**Criado em 2026-11-18** pelo Claude (Fable 5.2), a pedido do dono (Anderson), na
conversa de 2026-11-18. Decisões do dono estão marcadas "dono"; as demais são
escolhas do Claude e podem ser corrigidas na leitura. Este documento não autoriza
merge, build nem envio à loja.

## 1. Intenção

O dono quer que a próxima versão do Radiant traga a trilha `rtg-2026` com o dobro do
tamanho, em unidades menores no tema, sem lei brasileira nem código de ética, e com
a entrega diversificada: hoje a aula é quase toda texto e múltipla escolha.

Por quê: a trilha precisa servir a um aluno fora do Brasil depois (uma possível
internacionalização), e o excesso de texto cansa. O conteúdo continua guiado pela
ementa do curso superior de Tecnologia em Radiologia e de suas especializações.

## 2. Ponto de partida (medido em 2026-11-18, `main` em `403401d3`)

Medido por contagem em Python sobre `content-manifest/rtg-2026/aulas/*.json`.

| Medida | Hoje |
| --- | --- |
| Unidades e aulas | 24 unidades, 157 aulas, 785 interações, 1.256 passos |
| Passos de texto, múltipla escolha ou decisão de caso | 77,4% |
| Interações nos formatos da 1.6 (`cloze`, `true-false`, `categorize`, `multi-select`) | 75 (9,6%), em 7 unidades |
| Imagens | 2, numa aula (M08.01) |
| Formatos com tela pronta e sem uso | `hotspot` e `bench` (0 aulas); `comparison` (1 aula) |
| Formatos no contrato sem tela | `parameter-lab`, `risk-hunt` |
| Menções a lei, norma ou órgão brasileiro | 129, em 35 aulas; 32 de 302 fontes são normas |
| Aula centrada em lei | S-US.06 (33 menções, Lei 12.842/2013) |
| Ideias de diagrama já escritas pelos autores (`diagramIdeas`) | presentes em 132 aulas, nenhuma produzida |
| Vídeo, Rive | não existem no app; Lottie só no medalhão da trilha |
| Tradução | nenhum mecanismo; texto em português nos JSON e nos `.tsx` |

## 3. Metas

Cada meta tem um número que um script confere.

1. **Tamanho (dono):** cerca de 48 unidades e 310 aulas. Aceite: 48 unidades e de
   300 a 320 aulas no inventário.
2. **Menos texto:** passos de texto, múltipla escolha e decisão de caso caem de 77%
   para no máximo 50% da trilha inteira.
3. **Toda aula tem algo para ver:** cada aula nova tem ao menos um passo visual
   (imagem, diagrama, animação ou interação sobre imagem). Nas 157 aulas atuais, ao
   menos 100 ganham um.
4. **Nenhuma unidade fica só nos formatos antigos:** toda unidade usa ao menos quatro
   famílias de interação além de múltipla escolha e decisão de caso.
5. **Sem lei brasileira:** zero menção a lei, decreto, portaria, resolução normativa,
   órgão ou conselho brasileiro no texto das aulas, e nenhuma fonte que seja norma
   brasileira. O verificador barra a volta.
6. **Quem já estuda não perde nada:** nenhuma aula ou interação existente muda de
   identificador; unidade inserida no meio não tira acesso (regra da F1, já na `main`).
7. **A unidade irmã é obrigatória para todos (dono):** ela faz parte do caminho. Quem
   concluiu a M01 e ainda não abriu a M02 passa pela M17 antes. Quem já começou uma
   unidade mais adiante mantém o acesso e encontra a irmã aberta para voltar. A regra
   de desbloqueio atual (`resolveTrackAccess`) já se comporta assim; o plano prova
   isso com teste, sem mudar a regra.

## 4. Fora do escopo

- Traduzir a trilha ou a interface, ou instalar biblioteca de tradução. Esta versão
  só deixa o conteúdo pronto para ser traduzido.
- Vídeo gravado ou baixado (dono: animação em código).
- Servidor, API ou sincronização.
- Radiologia industrial e estágio supervisionado, que seguem fora como hoje.
- Texto das lojas, build, envio e merge, que seguem com o dono.

## 5. O que tornaria isto um fracasso mesmo funcionando

- Aula mais bonita que ensina menos: formato novo usado como enfeite, sem pedir que o
  aluno recupere ou decida algo.
- Jogo que pune: tempo ou sequência tirando vida ou travando o avanço.
- Imagem que mente: radiografia gerada por IA ou diagrama anatômico errado.
- Lei saindo e o fato técnico saindo junto: limite de dose e blindagem continuam
  ensinados, agora com base internacional.
- Volume sem revisão: 150 aulas escritas por modelo barato e mescladas sem leitura
  independente.

## 6. Restrições

- O aluno é estudante em simulação supervisionada: nenhum item pede diagnóstico,
  laudo, conduta clínica nem cálculo de dose para paciente (regra 1.3 do guia).
- Identificador de unidade: `m\d{2}` no núcleo e `s-[a-z]{2}` nos ramos.
- O app lê TypeScript gerado; o autor edita só `content-manifest/rtg-2026/aulas/`.
- Tudo funciona sem internet e sem servidor.
- Acessibilidade: todo formato novo funciona com leitor de tela e com "reduzir
  movimento"; nenhuma interação depende só de arrastar.
- Imagem real só de acervo aberto com licença CC0 ou CC BY conferida por arquivo
  (autorização do dono de 2026-11-06). Sem identificação de paciente.
- A janela de uso de 5 horas: no máximo três subagentes de autoria por vez, medindo o
  uso antes de cada lote.

## 7. Abordagens consideradas

1. **Três frentes em sequência (escolhida).** Tirar as leis, construir os formatos,
   escrever o conteúdo novo já nos formatos. Cada aula é escrita uma vez. Custa mais
   tempo de relógio.
2. **Conteúdo primeiro, formatos depois.** Dobra cedo, mas as aulas novas nasceriam em
   texto e seriam convertidas depois, como M01 a M03 na 1.6.
3. **Tudo em paralelo, como na 1.6.** Mais rápido, mas os autores escreveriam para
   formatos que ainda não existem, e muitas sessões juntas já esgotaram a janela de
   uso três vezes.

O dono deixou o como com o Claude; a escolhida é a 1.

## 8. Desenho

### 8.1 Como a trilha dobra

Cada unidade atual mantém código, aulas e identificadores, e ganha uma **unidade
irmã** nova, logo depois dela na ordem, com a outra metade do tema. As irmãs do
núcleo têm 6 aulas e as dos ramos 7: 16 × 6 + 8 × 7 = 152 aulas novas, total 309.

O tema de cada irmã abaixo é proposta do Claude. A lista aula a aula é trabalho do
plano: sai da leitura da unidade atual (para não repetir), das cinco matrizes
brasileiras já levantadas (C01 a C05) e das especificações internacionais (ARRT,
ASRT, ISRRT).

| Atual | Irmã | Tema da irmã |
| --- | --- | --- |
| m01 Entrar na profissão e cuidar | m17 | Segurança do paciente na sala: identificação, quedas, transferência, infecção, emergência |
| m02 Corpo, orientação e linguagem | m18 | Esqueleto, articulações e marcos de superfície |
| m03 Bases quantitativas e físicas | m19 | Eletricidade, tubo e gerador: como o feixe nasce |
| m15 Células, tecidos e funções | m20 | Sistemas do corpo em funcionamento |
| m04 Radiação, interação e proteção | m21 | Radiobiologia e dosimetria |
| m05 Formação da imagem digital | m22 | Processamento, exibição e informática da imagem |
| m06 Geometria, técnica e qualidade | m23 | Leitura crítica da imagem: artefatos, repetição e correção |
| m07 Musculoesquelético e posicionamento | m24 | Membro inferior, pelve e coluna |
| m08 Tórax, abdome e cabeça | m25 | Crânio, face, exame no leito e trauma |
| m09 Preparo, contraste e cuidado ampliado | m26 | Exames contrastados e fluoroscopia |
| m16 A condição do paciente na aquisição | m27 | Criança, idoso e gestante na aquisição |
| m10 Anatomia seccional e introdução à TC | m28 | Anatomia seccional II: abdome, pelve, pescoço e coluna |
| m11 Fundamentos próprios da RM | m29 | Sequências, contraste e artefatos básicos de RM |
| m12 Mamografia e densitometria | m30 | Densitometria óssea e composição corporal |
| m13 Panorama de MN, RT e intervencionista | m31 | Outros campos: veterinária, forense e pesquisa |
| m14 Qualidade, gestão e integração | m32 | Controle de qualidade de equipamentos e níveis de referência |
| s-tc Tomografia | s-ta | TC avançada: angiografia, coração, dose e protocolos |
| s-rm Ressonância | s-ra | RM avançada: difusão, angiografia, espectroscopia |
| s-md Mamografia e densitometria | s-mi | Tomossíntese, estereotaxia e métodos complementares da mama |
| s-mn Medicina nuclear | s-pt | PET/CT e terapia com radionuclídeos |
| s-rt Radioterapia | s-rp | Planejamento e técnicas avançadas de radioterapia |
| s-ir Intervencionista | s-hd | Hemodinâmica e cardiologia intervencionista |
| s-od Odontológica | s-oc | Feixe cônico e imagem maxilofacial |
| s-us Ultrassonografia | s-ud | Doppler e aplicações do ultrassom |

Onde a unidade atual já cobre parte do tema da irmã (M07 e M12 são os casos
prováveis), a aula atual fica onde está e a irmã aprofunda; nenhuma aula é movida.

### 8.2 Formatos

**Ligar o que já existe:** `hotspot` (tocar na estrutura) e `bench` (bancada de
exposição e colimação) têm tela e passam a ser aceitos pelo formato de aula-fonte,
pelo verificador e pelo gerador. `comparison` (escolher entre imagens) já é aceito e
só tem uma aula; passa a ser usado.

**Construir cinco telas novas:**

| Formato | O que o aluno faz | Serve a | Conteúdo exige |
| --- | --- | --- | --- |
| `label` (rotular) | toca num rótulo e depois no ponto da imagem | anatomia, partes do equipamento | 1 imagem e pontos |
| `risk-hunt` (caça ao erro) | toca no que está errado numa cena ou imagem | proteção, posicionamento, artefato | 1 imagem e regiões |
| `parameter-lab` (controle) | move um controle e vê o efeito no desenho | kV, mAs, distância, tempo, blindagem, colimação | regras e um desenho em código |
| `conversation` (conversa) | conduz uma conversa com um personagem; cada escolha tem consequência | comunicação, preparo, segurança | só texto e o elenco |
| `blitz` (rodada rápida) | responde verdadeiro ou falso em sequência, com contagem de acertos seguidos | vocabulário, unidades, revisão | só texto |

`risk-hunt` e `parameter-lab` já têm contrato em `learningActivity.ts`; ganham tela.
A conversa se chama `conversation` porque `dialogue` já nomeia a cena de abertura.
`label` é por toque, não por arrasto. O `blitz` tem tempo que o aluno pode desligar,
desliga sozinho com leitor de tela, e nunca tira vida.

**O conceito ganha imagem:** o passo de conceito passa a aceitar um visual opcional,
que é um diagrama desenhado em código (SVG) ou uma animação em laço. É um campo
estruturado (`visual`, com o nome do diagrama ou do laço), que o verificador confere
contra um registro no código e que o inventário conta como passo visual. Os
`diagramIdeas` que os autores já escreveram em 132 aulas são a fila de produção. O
corpo do conceito das aulas novas cai de 110 para 80 palavras quando há visual.

**Animação em código (dono):** uma pequena biblioteca de laços reutilizáveis (tubo
emitindo, colimador abrindo, feixe atenuando no corpo, corte tomográfico girando,
precessão na RM, decaimento), referenciados por nome no conteúdo. O plano fixa a
lista inicial, de 12 a 16 laços, e a técnica (a base de Lottie com Skia já existe no
medalhão).

**Personagens:** o elenco de cinco continua. O `dialogue` dá ao paciente e ao Caio o
papel de interlocutor na `conversation`, com as expressões que a bíblia de personagens já define.

### 8.3 Imagens

- **Diagramas próprios primeiro.** Desenho vetorial feito para a aula não tem risco de
  licença e é o que mais cabe em anatomia de base, física e equipamento. Cada um é um
  componente registrado por nome no código, fora de `imagens.json` (que continua só
  com imagem de terceiros e sua licença). `label`, `hotspot` e `risk-hunt` aceitam
  imagem ou diagrama, com pontos e regiões em coordenadas normalizadas, como o
  `hotspot` de hoje.
- **Radiografia real** só de acervo aberto, com licença, autor e endereço registrados
  em `imagens.json`, como as duas de hoje.
- **Nunca** radiografia gerada por IA.
- **Orçamento:** até 150 KB por imagem e até 15 MB somados ao aplicativo.

### 8.4 Sem lei brasileira

- Sai do texto das 35 aulas toda citação a lei, norma, órgão e "no Brasil". O fato
  técnico fica, apoiado em fonte internacional: ICRP (publicação 103), IAEA (GSR
  Part 3 e SSG-46), OMS, e as especificações de ARRT, ASRT e ISRRT.
- As 32 fontes normativas são trocadas, mantendo a regra de fonte por afirmação. A
  fonte nova entra como referência factual (`use: factual-reference`), como as normas
  entram hoje, e precisa estar aberta para leitura gratuita na web; documento pago
  não serve.
- **S-US.06** é reescrita: o papel do tecnólogo na equipe de ultrassom, dizendo que o
  alcance da atuação varia por país e serviço, sem citar lei.
- **M14.03** (prioridade por lei) vira prioridade por condição do paciente; **M14.05**
  (resíduos por norma) vira princípios de segregação e descarte.
- Consentimento, sigilo e privacidade ficam como cuidado com o paciente, sem lei e
  sem código de ética (proposta do Claude; o dono pediu a retirada das menções, não
  do tema).
- O guia de autoria troca a regra 1.4 ("contexto brasileiro") por "base
  internacional", e o verificador ganha uma regra que lê os campos de texto do JSON e
  barra os termos, com teste que a mostra falhando.
- As conversões mantêm `id`, `role` e `criticalSafety` de cada item.

### 8.5 As 157 aulas atuais

Além da limpeza de lei, cada unidade atual passa por uma conversão: de uma a duas
interações por aula mudam de múltipla escolha para um formato novo ou da 1.6, sem
acrescentar fato, e as aulas com `diagramIdeas` mais simples ganham o visual do
conceito. É isso que leva as metas 2, 3 e 4 às 16 unidades que hoje só têm os
formatos antigos.

### 8.6 Fases

| Fase | Entrega | PR |
| --- | --- | --- |
| A. Base internacional | guia, regra do verificador, 35 aulas e 32 fontes reescritas | uma |
| B. Formatos | cinco telas, três formatos ligados, visual do conceito, laços de animação, verificador, gerador, gerador de roteiros do Maestro, guia, ADR | uma |
| C. Conteúdo novo | 24 unidades irmãs, em seis lotes de quatro | uma por lote |
| D. Conversão das atuais | 24 unidades, em lotes, em paralelo com a C | uma por lote |
| E. Integração | ordem final, inventário com as metas, uma unidade por lote jogada no simulador, `STATUS.md` e roadmap | uma |

**Ordem:** a B começa depois de a A entrar na `main`, porque as duas mexem no
verificador e no guia. C e D só começam depois da B. A D converte o texto que a A já
limpou, e nunca roda sobre uma unidade com PR da A aberta. Cada unidade irmã é uma
unidade como as outras: conferência própria por aula e cartas de revisão. Entrar uma
irmã exige editar `RTG_UNIT_ORDER` e a mensagem de identificadores do verificador.

**Autoria e revisão:** autores em modelo menor (Sonnet), cada um com uma unidade e a
lista exata de arquivos; um revisor independente em modelo maior lê cada unidade
contra as fontes; o Claude controlador reproduz os verificadores, confere uma amostra
no texto e decide. Uma unidade passa pelo gerador e pelo gate antes de produzir em
volume. PR em rascunho aberta cedo em cada fase, para o CI rodar.

## 9. Deixado para o plano

- A lista aula a aula de cada unidade irmã e a conferência de sobreposição.
- O formato exato de cada interação nova no JSON e as réguas do verificador.
- A lista dos laços de animação e a técnica de cada um.
- O aspecto das cinco telas, dentro do design system atual.
- A ordem dos lotes e quem escreve o quê.

## 10. Riscos

- **Custo:** a trilha atual levou dois dias e cerca de quarenta subagentes; esta tem
  mais conteúdo e ainda código. Estimativa do Claude: de uma a duas semanas de
  relógio, em lotes.
- **Tamanho do aplicativo** com imagens: o orçamento da seção 8.3 é o freio.
- **Fonte internacional gratuita** pode não sustentar um fato que a norma brasileira
  sustentava; nesse caso o fato sai, pela regra 1.2 do guia.
- **Armazenamento da revisão:** o `STATUS.md` mede 4 MiB para 5.000 cartas, de 6 MB
  no Android. Dobrar a trilha dobra as cartas possíveis. A fase B mede o consumo com a
  trilha dobrada antes de a fase C produzir em volume; se passar do teto, o desenho
  da revisão volta ao dono.
- **Nada disto foi visto em aparelho** até a fase E, e som e toque só o dono confere.
