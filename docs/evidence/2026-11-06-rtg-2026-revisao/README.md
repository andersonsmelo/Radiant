# Pareceres de revisão — trilha rtg-2026

Um parecer por unidade, escrito pelo revisor independente (agente diferente do autor),
sob a [ADR da delegação](../../adr/ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla.md).
**É revisão por IA, não por profissional de radiologia.** Cada parecer lista os achados,
a correção aplicada, as fontes consultadas e o que não pôde ser verificado. A unidade
só entra em `content-manifest/rtg-2026/aulas/` com o resultado "aprovado com correções".

O brief do revisor está na seção 7 do
[guia de autoria](../../content/2026-11-05-guia-de-autoria-rtg-2026.md).

## Pontos que os autores de M08 a M14 pediram para conferir

Registrados aqui porque entraram no prompt de cada revisor.

### M08 — Tórax, abdome e cabeça
1. m08-02: "dez costelas posteriores acima do diafragma" como marca de inspiração plena vem só do Radiopaedia ("no máximo dez"); o caso i5 trata sete costelas como inspiração insuficiente. Segunda fonte ou tirar o número.
2. m08-06: dois identificadores apoiados em fonte europeia. Citar o Protocolo de Identificação do Paciente (MS/Anvisa/Fiocruz), que diz "pelo menos dois identificadores".
3. m08-04: "4 cm acima do meato acústico externo", saída do feixe pelo násio, e o pré-requisito i1 citando OpenStax para o plano sagital.
4. m08-03: limites do campo do abdome.
5. m08-05 i4 (possível gravidez) só com RadiologyInfo: manter "pausar e avisar a equipe".

### M09 — Preparo, contraste e cuidado ampliado
Regra extra: o estudante nunca prescreve, escolhe nem administra contraste, nunca decide se a pessoa pode receber e nunca conduz uma reação. Reprovar item cuja resposta certa seja decisão clínica.
1. m09-05: lista de sinais contra a Tabela 1 do ACR Manual on Contrast Media, e o gesto "avisar quem injeta para interromper".
2. m09-03: frase sobre alergia a frutos do mar e "nenhum dado proíbe ou libera por si"; "hemodiálise → doença dos rins" no i2 sem fonte lida.
3. m09-06 i4: "combinar um sinal, como erguer a outra mão" é inferência do autor: dizer que é exemplo da aula ou achar fonte.
4. Tempo de observação escrito como "pelo tempo do protocolo", com a justificativa do ACR: conferir a redação.
5. Quem pode administrar contraste no Brasil ficou "equipe habilitada, sob supervisão médica": manter neutro.
6. "Pelo menos dois identificadores" só por trecho de busca: confirmar no protocolo do MS.

### M10 — Anatomia seccional e introdução à TC
Regra extra: CTDIvol e DLP são indicadores da saída do equipamento; nenhum item calcula dose de paciente nem estima risco individual.
1. m10-04: "corte fino = menos volume parcial, mais ruído" visto só em resumo de busca (Monnin 2017).
2. m10-03: definições de localizador e de axial contra helicoidal lidas do AAPM CT Lexicon por extração de texto.
3. m10-02: "aorta à esquerda da coluna / veia cava à direita da aorta": conferir e dizer de quem é a esquerda.
4. m10-05: CTDIvol/DLP apoiados em AAPM 204 e Radiopaedia: acrescentar fonte institucional se der.
5. Valores de Hounsfield (água 0, ar −1000, gordura perto de −100, osso centenas ou mais) e a conta de nível e largura de janela.
6. "Anterior no alto da tela": declarar o ponto de vista.
7. m10-06 i4: "pode estar nos dados e só não ter sido reconstruído" não tem fonte: abrandar ou cortar.

### M11 — Fundamentos próprios da RM
Regra extra: segurança primeiro; o estudante nunca libera implante, dispositivo ou adesivo e nunca decide que alguém pode entrar. Física honesta, sem metáfora falsa; número ilustrativo é rotulado.
1. m11-03 e m11-04 escritos em parte de memória: confirmar "T2 menor que T1 nos tecidos", "líquido tem T1 e T2 longos", "gordura brilha em T1", o papel de TR e TE na ponderação e os pares 500/20 ms e 2000/80 ms.
2. Anvisa IN 97/2021: confirmar vigência e se a redação das zonas e a triagem de metal batem com a norma.
3. Itens de segurança que não podem deixar o estudante liberar nada: m11-01 i4/i5, m11-05 i4/i5, m11-06 i4 e a conferência 1 (adesivo de medicação).
4. "O sinal captado pela bobina receptora cai com a distância" só por trecho de busca.
5. Percentuais de curva e tabela em m11-03 são ilustração: cada um rotulado "vale só para este esquema".

### M12 — Mamografia e densitometria
Regra extra: o estudante nunca classifica achado, não usa BI-RADS como exercício de laudo e não interpreta resultado de densitometria.
1. m12-03: critérios da MLO (peitoral "pelo menos até o nível da papila") e a regra de 1 cm entre CC e MLO apoiados só em Popli 2014 e Sweeney 2018, sem fonte brasileira.
2. m12-02 conferência 2 (sem grade em exame sem ampliação o equipamento não pode ser usado) depende da IN 92/2021 art. 6º VIII, e o conceito só ensina a regra geral de parar e avisar.
3. m12-05 i4 (prótese de quadril no lado pedido) e o item do bário: ficar em "pausar e levar à equipe", sem escolha de exame.
4. URL da ISCD e números de artigos da RDC 611 em licenseNote (17, 23, 24, 38, 53).
5. A competência de m12-03 foi reescrita para "em descrições de imagens", porque não há imagem.

### M13 — Panorama de MN, RT e intervencionista
Regra extra: o estudante nunca manuseia nem administra radiofármaco, nunca planeja nem entrega tratamento, nunca executa ato invasivo.
1. m13-05: proteção na sala intervencionista (avental, protetor de tireoide, óculos, anteparo suspenso, mais espalhamento do lado do tubo) apoiada em um artigo aberto e nos arts. 23, 51 e 65 da RDC 611: segunda fonte (IN da Anvisa para fluoroscopia e intervencionista) ou abrandar.
2. Condutas dos itens de segurança além do texto da norma: m13-02 i4 ("avisa quem se aproxima"), m13-05 i4 (avisar a equipe na sala), m13-06 i4 (recusar a seringa): cada uma lida como "pare, não aja sozinho, avise a equipe".
3. m13-01 i1: fonte indireta para "o tubo é a fonte na radiografia".
4. Norma citada para medicina nuclear: Norma CNEN/ANSN 3.05 (Resolução CNEN 159/2013): confirmar vigência e o que ela exige onde é citada.
5. "O radiofármaco costuma ser líquido" é inferência: confirmar ou cortar.
6. A Lei 7.394/1985 fala em "Técnico em Radiologia": não citar errado.
7. As siglas MN e RT dos títulos são escritas por extenso no primeiro uso de cada aula.

### M14 — Qualidade, gestão e integração
1. m14-05: luva não usada e sem contato com sangue como Grupo D (Anexo I da RDC 222/2018); regra dos 3/4 do coletor de perfurocortantes (art. 87); o item do avental de chumbo responde "consultar o plano" de propósito.
2. m14-06 conferência 2: leitura do art. 72 da RDC 611 (foto de exame como registro ou imagem de laudo).
3. m14-03: alcance da lei de prioridade (Lei 10.048/2000, art. 2º fala em repartições públicas e concessionárias; os casos estão em "hospital público"); o Decreto 5.296/2004 não foi conferido.
4. Itens de ordenação de m14-01, m14-03 e m14-04 são convenções da aula, declaradas "na ordem ensinada nesta aula".
5. As ajudas de m14-06 são genéricas de propósito ("use as três perguntas").
6. Os pré-requisitos só apontam para M01, M06 e aulas anteriores de M14, porque M08 a M13 não existiam: m14-06 deve revisitar competências de M02 a M13 em casos novos.

## Pontos que os autores dos aprofundamentos pediram para conferir

Valem como registro do que entrou no prompt de cada revisor. O destino de cada ponto está no parecer da unidade.

### S-TC — Aprofundamento em tomografia computadorizada
Regra extra: CTDIvol e DLP são indicadores da saída do equipamento; o estudante não decide contraste nem conduz reação.
1. "CTDIvol não é dose do paciente" só com fonte de tipo wiki: pedir segunda fonte.
2. s-tc-03: relações de corrente, sinal-ruído e indicador, e CTDIvol = CTDIw/pitch.
3. "Kernel duro: mais ruído", pitch 1 e abaixo de 1, e trocar o kernel sem nova exposição, sem fonte direta.
4. Aparência do artefato em anel e classe do artefato de metal.
5. s-tc-05 (o estudante só relata; extravasamento) e s-tc-08 i5.

### S-RM — Aprofundamento em ressonância magnética
Regra extra: o app não libera implante. Qualquer dúvida é parar, manter a pessoa fora da sala e levar à equipe. O estudante não aciona quench nem conduz emergência.
1. Quench em s-rm-02 i4 e s-rm-08: ventilação, oxigênio e botão com fonte única.
2. Emergência em s-rm-08 i5 e "campo constante, silêncio não desliga".
3. s-rm-05: sentidos de TR, TE, passos de fase, sinal e tempo.
4. "50% a 75%" com um só site, e região e movimento em s-rm-06 i2, em parte inferidos.
5. Vigência da IN 97/2021 e periódico de Grover 2015, citado de memória.

### S-MD — Aprofundamento em mamografia e densitometria
Regra extra: sem categoria BI-RADS, sem ler T-score ou Z-score como resultado de alguém e sem decidir incidência complementar. A dose glandular média é só conceito e indicador de qualidade.
1. s-md-02: 150 a 200 N. O INCA fala em força aplicada na mama; a IN 92/2021 fala do sistema automático. O texto segue a IN 92 e o CBR, com atribuição, e nenhum item pede aplicar valor de força.
2. s-md-04 i2 e i4: contas com 0,5 e 1,5 cm e o critério de 1 cm.
3. s-md-07: o que torna válida a comparação em densitometria.
4. Dose da tomossíntese com uma só fonte, itens de implante, gestação e escalonamento à equipe, e privacidade apoiada no art. 53 da RDC 611.

### S-MN — Aprofundamento em medicina nuclear
Regra extra: o estudante não prepara, fraciona nem administra radiofármaco, não escolhe atividade nem a calcula para paciente, não decide liberação e não descontamina sozinho. Contaminação e suspeita de troca vão à equipe e ao serviço de proteção radiológica.
1. Vigência da ANSN 3.05 e atualidade do texto citado.
2. s-mn-04 i2 e i4: a ordem do derramamento é convenção da aula e vinha de um único hospital estrangeiro.
3. s-mn-06: periodicidades dos anexos da norma e a cena "antes do primeiro paciente".
4. s-mn-07 i4 (marca-passo) e a frase sobre metal, apoiadas em artigo antigo.
5. s-mn-03 i5: monitor para roupa.

### S-RT — Aprofundamento em radioterapia
Regra extra: o estudante não prescreve nem altera dose, fracionamento, campo ou técnica, não planeja, não aprova plano nem imagem, não inicia nem pula fração e não julga sintoma. Divergência vai à equipe. A unidade não comprova planejamento clínico, entrega de tratamento nem formação de dosimetrista.
1. Vigência da ANSN 6.10 e o que dizem os arts. 24, 25, 26, 35, 36, 42 e 62, porque o rascunho leu só trechos.
2. "Teste que falhou: pare e avise" e o que sustenta essa frase.
3. Sequências didáticas de s-rt-04 e s-rt-08, s-rt-08 i4 e s-rt-03 i4.
4. Dosimetrista em s-rt-06 diante de onde a norma brasileira põe o planejamento.
5. Papéis da equipe e ritmo da física lidos em fonte dos EUA, fantoma só para IMRT e os cinco Rs como vocabulário.

### S-IR — Aprofundamento em radiologia intervencionista
Regra extra: a unidade não ensina execução independente de ato invasivo. O estudante não punciona, não opera campo estéril, não escolhe nem administra contraste, não aciona fluoroscopia por decisão própria e não conduz reação. Indicadores de dose são vocabulário.
1. s-ir-04 i4 e a recuperação guiada: o que sustenta o conteúdo de campo estéril.
2. s-ir-07: indicadores sem julgamento e i5 (alarme) diante do art. 2 II da IN 91.
3. s-ir-04 i3 (distância) e de quem é a exposição.
4. s-ir-02 i5 diante do art. 7 IV da IN 91, que pode valer só para equipamento vendido depois da norma.
5. Lista britânica, papéis lidos em fonte dos EUA e subtração digital apoiada em fonte de tipo wiki. O revisor cortou a subtração por falta de leitura, e ela voltou por um segundo autor e um segundo revisor, com a seção própria no parecer.

### Imagens em M08
Regra extra: só orientação, sem achado, sem marco na imagem e sem critério técnico que a página do acervo não sustenta. O parecer está no fim de [m08.md](m08.md).
1. Licença, autor e identificação visível de cada arquivo, reabrindo a página do Commons.
2. "A coluna torácica aparece com clareza" e "uma clavícula de cada lado da coluna".
3. O corte da frase que dizia que o texto é descrição para estudo, não protocolo de atendimento.
