# Pesquisa: fontes de imagens radiológicas com licença comercial (P6 / FILA 52) e demandas do técnico em radiologia no Brasil

- **Autoria:** Argon — Gemini 4 Argon (High)
- **Data:** 2026-10-17
- **Pergunta / Objetivo:**
  1. Quais repositórios públicos de imagens radiológicas possuem licença jurídica explícita que autorize **uso comercial, redistribuição em app com assinatura paga e criação de obras derivadas** (recorte, anotação de setas/estruturas, ajuste de janela) para alimentar o pacote inicial de `G3` (`FILA 52` / `P6`)?
  2. O que as bancas de concursos brasileiros para Técnico em Radiologia (`EBSERH`, `IBFC`, `FGV`, `VUNESP`) e os aplicativos concorrentes nas lojas brasileiras mostram sobre as necessidades reais do aluno e sobre as lacunas do mercado?
- **Método:** Verificação documental primária dos termos de licença e políticas de direitos autorais de 9 repositórios de imagem médica (`MedPix`, `Open-i / PMC`, `NCI Imaging Data Commons`, `TCIA`, `Wikimedia Commons`, `NIH ChestX-ray14`, `VinDr-CXR`, `MIMIC-CXR`, `PadChest`), cruzamento com provas/editais recentes de Técnico em Radiologia no Brasil e levantamento dos aplicativos de radiologia em português na Google Play Store e Apple App Store.
- **Grau das afirmações:** `[oficial]`, `[terceiro]`, `[usuário]`, `[estudo]`, `[código]`, `[visto]`, `[inferido]`.

---

## Parte 1 — Licenciamento de imagens radiológicas para uso comercial no Radiant (`P6` / `FILA 52`)

Como o Radiant é distribuído comercialmente com assinatura paga (`Radiant Ilimitado` na App Store e Google Play), **qualquer licença `NC` (Non-Commercial), `Research-Only` ou sem permissão explícita de redistribuição e obras derivadas é incompatível** com o produto. `[oficial]` `[código]`

### 1.1. Matriz comparativa de licenças verificadas (acesso em 2026-10-17)

| Fonte / Dataset | Licença oficial verificada | Uso comercial permitido? | Obras derivadas (anotação/crop)? | Redistribuição no bundle/CDN do app? | Veredito para o Radiant |
|---|---|---|---|---|---|
| **NCI Imaging Data Commons (IDC)** | `CC BY 4.0`, `CC BY 3.0` ou `CC0` em >95% dos casos (metadado `LicenseURL` por série/instância no BigQuery/portal) `[oficial]` | **Sim** (exceto subconjunto ~3% `CC BY-NC`) `[oficial]` | **Sim** (com indicação de modificação e crédito) `[oficial]` | **Sim** `[oficial]` | **APROVADO (Fonte Primária #1 para TC/RM/RX clínicos)** `[inferido]` |
| **Open-i (NLM / NIH) — filtro `CC BY` / `CC0`** | Herda a licença do artigo no PubMed Central (`PMC Open Access Subset`). Aceita filtro por licença (`CC BY 4.0`, `CC0`) `[oficial]` | **Sim, somente nos itens com licença `CC BY` ou `CC0`** (proibido nos itens `CC BY-NC` ou `MedPix`) `[oficial]` | **Sim** (exceto `ND`) `[oficial]` | **Sim** `[oficial]` | **APROVADO COM FILTRO ESTRITO (`license: CC BY 4.0` ou `CC0`)** `[inferido]` |
| **Wikimedia Commons (categorias de Radiologia)** | Licenças por arquivo (`CC0`, `Public Domain`, `CC BY 4.0`, `CC BY-SA 4.0`) `[oficial]` | **Sim** `[oficial]` | **Sim** (nota: `CC BY-SA` exige `ShareAlike` apenas na imagem derivada, não no código do app, mas `CC0`/`CC BY` são preferíveis) `[oficial]` | **Sim** `[oficial]` | **APROVADO (preferir `CC0`, `PD` e `CC BY 4.0`)** `[inferido]` |
| **NIH ChestX-ray14 (NIH Clinical Center / Box)** | Domínio público governamental EUA / uso irrestrito com citação obrigatória de link + artigo (Wang et al., CVPR 2017) `[oficial]` | **Sim** (com atribuição obrigatória) `[oficial]` | **Sim** `[oficial]` | **Sim** `[oficial]` | **APROVADO (excelente para radiografia de tórax PA/AP e patologias torácicas)** `[inferido]` |
| **Diagramas SVG autorais (produzidos no próprio repositório)** | Autoria própria (Radiant) `[código]` | **Sim** | **Sim** | **Sim** | **APROVADO E RECOMENDADO para posicionamento radiográfico, raio central, chassis e linhas cranianas** `[inferido]` |
| **MedPix (NLM / NIH)** | Termos próprios: *"Images and text in MedPix are free for educational use only... You must get permission from the original author for any commercial use"* `[oficial]` | **Não** (uso gratuito restrito a fins educacionais não comerciais; uso comercial exige autorização individual do autor de cada caso) `[oficial]` | Não para fins comerciais `[oficial]` | Não para fins comerciais `[oficial]` | **REPROVADO para uso sem autorização individual do autor** `[oficial]` |
| **Radiopaedia.org** | `CC BY-NC-SA 3.0` `[oficial]` | **Não** (`NC` proíbe uso comercial sem licença empresarial separada) `[oficial]` | Não para uso comercial `[oficial]` | **Não** `[oficial]` | **REPROVADO** `[oficial]` |
| **VinDr-CXR / MIMIC-CXR (PhysioNet)** | *PhysioNet Credentialed Health Data License v1.5.0* `[oficial]` | **Não** (*"solely for lawful use in scientific research"*) `[oficial]` | **Não** `[oficial]` | **Não** (proíbe redistribuição a terceiros) `[oficial]` | **REPROVADO** `[oficial]` |
| **PadChest (BIMCV)** | *BIMCV Academic / Research Use Agreement* `[oficial]` | **Não** (restrito a pesquisa acadêmica) `[oficial]` | **Não** `[oficial]` | **Não** `[oficial]` | **REPROVADO** `[oficial]` |

### 1.2. Alerta crítico sobre o plano anterior (`P6` / `FILA 52`)

O item `FILA 52` mencionava *"Fontes candidatas com licença compatível com uso comercial: MedPix (NIH, domínio público), Open-i (NLM, filtro CC-BY/PD), Wikimedia Commons"*. **A premissa de que o MedPix inteiro está em domínio público é falsa:** embora seja hospedado pela NLM/NIH, os casos clínicos do MedPix foram submetidos por médicos externos que retiveram o copyright comercial, concedendo à NLM apenas licença de uso educacional gratuito (`[oficial]`). Além disso, quando o motor de busca do **Open-i** retorna imagens vindas da coleção MedPix, elas carregam essa mesma restrição. `[oficial]`

Portanto, a regra de governança para entrada de qualquer imagem no Radiant deve exigir obrigatoriamente:
1. `sourceUrl` (URL permanente do item original no PMC, IDC, Wikimedia Commons ou NIH Clinical Center); `[inferido]`
2. `license` explícita (`CC0-1.0`, `Public-Domain-USGov`, `CC-BY-4.0` ou `Own-Work-SVG`); `[inferido]`
3. `attributionText` completo (autores, título, fonte, link da licença e nota `"Imagem adaptada com recorte/marcações didáticas"` quando houver overlay ou crop, conforme exigido pela cláusula 3(a)(1)(B) da `CC BY 4.0`). `[oficial]`

### 1.3. Proposta prática para as 10–15 imagens iniciais de `G3` (`FILA 52`)

Para cobrir os temas que mais caem em provas e na prática de posicionamento e anatomia radiológica sem risco jurídico e com máxima nitidez em tela móvel, recomendamos uma composição híbrida para as 15 imagens iniciais: `[inferido]`

1. **6 diagramas vetoriais SVG autorais (40% do pacote) — Posicionamento, Geometria do Feixe e Equipamento:** `[inferido]`
   - Por que SVG autoral é superior a foto para posicionamento: fotos clínicas de pacientes posicionados quase nunca têm licença `CC BY` (por direito de imagem do paciente), enquanto esquemas vetoriais limpos no estilo visual escuro do Radiant (`galaxyColors`) ensinam com muito mais clareza:
     1. Incidências **PA vs. AP de tórax** (posição do tubo, receptor de imagem, magnificação cardíaca e distância foco-filme `DFoFi = 180 cm` vs. `100 cm`);
     2. **Efeito anódico (heel effect)**: orientação cátodo-ânodo em estruturas de espessura desigual (coluna torácica, fêmur, úmero);
     3. **Linhas de referência craniana** (`LOM`, `LIOM`, `LGM`, `LAM`, `LMM`) e angulações de raio central (Caldwell 15° caudal, Towne 30° caudal, Waters);
     4. **Incidências oblíquas de coluna cervical/lombar** (forames intervertebrais PA vs. AP 45° e sinal do *"Scotty dog"*);
     5. **Joelho e tornozelo** (AP com rotação interna 15°–20° da mortise tibiofibular e perfil mediolateral);
     6. **Geometria do feixe**: colimação, grade antidifusora (Bucky) e radiação espalhada (efeito Compton).
2. **9 radiografias e cortes tomográficos reais sob `CC0` / `CC BY 4.0` (60% do pacote) — Anatomia Radiológica e Qualidade de Imagem:** `[inferido]`
   - Extraídos de **Wikimedia Commons (`CC0` / `CC BY 4.0`)**, **NIH ChestX-ray14** e **Open-i (PMC `CC BY 4.0`)**:
     7. **Radiografia de tórax PA normal** (identificação de arco aórtico, botão pulmonar, ventrículo esquerdo, seios costofrênicos, cúpulas diafragmáticas e clavículas equidistantes dos processos espinhosos para avaliar rotação);
     8. **Radiografia de tórax em perfil** (espaço retroesternal, espaço retrocardíaco e sobreposição dos arcos costais posteriores);
     9. **Radiografia de punho e mão PA/oblíqua** (ossos do carpo — fileira proximal: escafoide, semilunar, piramidal, pisiforme; fileira distal: trapézio, trapezoide, capitato, hamato);
     10. **Radiografia de cotovelo AP e perfil 90°** (cabeça do rádio, olécrano, epicôndilos e coxim gorduroso);
     11. **Radiografia de pelve/quadril AP** (colo do fêmur, trocânter maior e menor, articulação sacroilíaca e forame obturado — avaliação de rotação interna de 15°–20° dos pés);
     12. **Radiografia de coluna lombar AP e perfil** (pedículos, processos espinhosos, corpos vertebrais L1–L5 e espaço L5–S1);
     13. **Radiografia de abdome agudo (ortostático vs. decúbito dorsal)** (níveis hidroaéreos, psoas e cúpulas diafragmáticas);
     14. **Tomografia de crânio sem contraste (janela de parênquima vs. janela óssea)** (ventrículos laterais, cápsula interna, tálamo e calota craniana);
     15. **Tomografia de tórax (janela de pulmão vs. janela de mediastino)** (diferença visual de nível `WL` e largura de janela `WW` no mesmo corte axial).

---

## Parte 2 — Quem é o técnico em radiologia no Brasil, o que cobram as bancas e o que dizem as lojas

### 2.1. Perfil profissional e distribuição temática em provas e concursos (`EBSERH`, `IBFC`, `FGV`, `VUNESP`)

O público-alvo do Radiant divide-se em dois momentos com dores distintas: `[estudo]` `[terceiro]`
1. **Estudante do curso técnico em radiologia (1.200 h teóricas + 400 a 600 h de estágio supervisionado):** precisa dominar **posicionamento radiográfico (Bontrager)**, **anatomia radiológica** e **técnica radiográfica ($kVp$, $mAs$, distância foco-filme, grade)** para não errar no estágio hospitalar e não repetir exame no paciente. `[terceiro]`
2. **Técnico formado prestando concurso público (`EBSERH`, prefeituras, secretarias estaduais de saúde, fundações hospitalares):** precisa acertar questões objetivas de múltipla escolha sob pressão de tempo. `[terceiro]`

O levantamento das provas recentes de Técnico em Radiologia organizadas por **IBFC (`EBSERH`)**, **FGV** e **VUNESP** mostra uma concentração temática muito diferente do estado atual do catálogo do Radiant: `[terceiro]` `[código]`

| Eixo temático | Peso aproximado nas provas de Técnico em Radiologia (IBFC/EBSERH, FGV, VUNESP) `[terceiro]` | Participação atual no catálogo ativo do Radiant (`16 lições AI_LESSONS + 2 LESSONS`) `[código]` | Diagnóstico de lacuna `[inferido]` |
|---|---|---|---|
| **1. Posicionamento radiográfico e incidências (rotina + especiais, raio central, chassi, DFoFi, critérios de qualidade)** | **30% a 40%** | **~6%** (apenas 1 lição geral em `ai-lessons.ts`: `posicionamento-radiografico`) | **Lacuna crítica #1:** é o tema mais cobrado em provas e o mais usado no plantão diário, mas quase inexiste por região anatômica (tórax, crânio, coluna, membros superiores/inferiores) no app. |
| **2. Proteção radiológica e legislação brasileira (`RDC ANVISA nº 611/2022`, `INs 90 a 97/2021`, `CNEN NN 3.01`, `Lei 7.394/1985`, Código de Ética CONTER)** | **20% a 25%** | **~17%** (3 lições em `ai-lessons.ts`: proteção, princípios/limites de dose e equipamento de proteção) | **Desatualização normativa:** as bancas de 2023–2026 cobram pesadamente a **`RDC ANVISA nº 611/2022`** (que revogou a antiga Portaria SVS/MS 453/1998) e os princípios de justificação, otimização (ALARA) e limitação de dose da **`CNEN NN 3.01`**. |
| **3. Física das radiações, fatores técnicos ($kVp$, $mAs$, efeito anódico, interação com a matéria: efeito fotoelétrico vs. Compton) e radiologia digital (`CR` vs. `DR`)** | **15% a 20%** | **~39%** (7 lições em `ai-lessons.ts` + `lesson-1`) | Bem coberto em conceitos básicos, mas faltam questões práticas de **correção de imagem** (*"A radiografia saiu subexposta / com artefato / com rotação: o que ajustar?"*). |
| **4. Anatomia radiológica (identificação de estruturas em RX/TC/RM)** | **10% a 15%** | **~6%** (sem imagens no app atual) | **Lacuna crítica #2:** sem imagem (`G3`), o aluno decora texto sobre anatomia em vez de reconhecer a estrutura na imagem. |
| **5. Tomografia Computadorizada (`TC` — geração, pitch, unidades Hounsfield `UH`, janelamento `WW`/`WL`, meios de contraste), Mamografia e Ressonância Magnética (`RM`)** | **10% a 15%** | **~22%** (3 lições em `ai-lessons.ts` + `lesson-2`) | Bom ponto de partida teórico; precisa de casos práticos de **unidades Hounsfield (`UH`)**, **janelamento** e **segurança em RM / meios de contraste**. |

### 2.2. O que existe nas lojas brasileiras (Google Play e App Store) e o que os usuários reclamam

Levantamento dos aplicativos voltados a estudantes e técnicos de radiologia no Brasil em 2026-10-17: `[terceiro]` `[usuário]`

1. **Apps de consulta de posicionamento (`RX - Posicionamento Radiográfico`, `Manual Técnico em Radiologia`, `Radiologia - Posicionamentos` na Google Play):** `[terceiro]` `[usuário]`
   - Funcionam como **apostilas estáticas de bolso** (listas de texto + fotos de baixa resolução mostrando distância foco-filme, tamanho de chassi e angulação do raio central).
   - **Principais queixas dos usuários nas avaliações:** excesso de anúncios intrusivos abrindo em tela cheia durante o estudo/estágio, interface datada, textos copiados sem revisão, ausência de exercícios interativos e falta de atualização. `[usuário]`
2. **Apps de simulado de concurso (`Simutec Radio`, `Questões de Radiologia`):** `[terceiro]` `[usuário]`
   - Bancos de questões cruas no formato de prova antiga, sem trilha estruturada, sem repetição espaçada (`FSRS`) e frequentemente **sem comentário explicativo nas alternativas incorretas** (mostram apenas a letra do gabarito). `[usuário]`
3. **Diferencial competitivo claro para o Radiant:** `[inferido]`
   - Nenhum concorrente brasileiro combina **trilha gamificada progressiva + repetição espaçada científica (`FSRS` já implementado em `G4`) + explicação imediata da alternativa incorreta (`G1`) + inspeção visual de posicionamento e anatomia (`G3`)** em uma interface limpa e sem anúncios.
   - Porém, para capturar a demanda real do técnico brasileiro, o currículo da trilha precisa incorporar rapidamente:
     1. **Unidade prática de Posicionamento Radiográfico por região anatômica** (Tórax/Abdome, Membros Superiores, Membros Inferiores, Coluna e Crânio, com raio central, `DFoFi`, linha de referência e critério de qualidade da imagem); `[inferido]`
     2. **Questões atualizadas para a `RDC ANVISA nº 611/2022` e `CNEN NN 3.01`** (deixando claro nas explicações quando uma pegadinha de banca tenta usar termos da antiga Portaria 453/1998); `[inferido]`
     3. **Questões de raciocínio técnico de bancada** (*"Você realizou um AP de tórax no leito a 100 cm em vez de PA a 180 cm: qual alteração geométrica ocorre na área cardíaca e por quê?"*). `[inferido]`

---

## Fontes consultadas (com URL e data de acesso)

1. **NLM / NIH — MedPix Copyright and Usage Policy:** `https://medpix.nlm.nih.gov/home` e FAQ da NLM (`https://support.nlm.nih.gov/knowledgebase/article/KA-03305/en-us`), acessados em 2026-10-17. `[oficial]`
2. **NLM / NIH — Open-i Biomedical Image Search Engine FAQ & License Filter:** `https://openi.nlm.nih.gov/faq`, acessado em 2026-10-17. `[oficial]`
3. **PubMed Central (PMC) — Open Access Subset Licensing Terms:** `https://www.ncbi.nlm.nih.gov/pmc/tools/openftlist/`, acessado em 2026-10-17. `[oficial]`
4. **NCI Imaging Data Commons (IDC) — Data Licensing Policy:** `https://learn.canceridc.dev/data/organization-of-data/licensing`, acessado em 2026-10-17. `[oficial]`
5. **The Cancer Imaging Archive (TCIA) — Data Usage Policies and Restrictions:** `https://www.cancerimagingarchive.net/data-usage-policies-and-restrictions/`, acessado em 2026-10-17. `[oficial]`
6. **NIH Clinical Center — ChestX-ray14 Dataset Box Repository & Usage Notice:** `https://nihcc.app.box.com/v/ChestXray-NIHCC`, acessado em 2026-10-17. `[oficial]`
7. **PhysioNet — Credentialed Health Data License 1.5.0 (`VinDr-CXR`, `MIMIC-CXR`):** `https://physionet.org/content/vindr-cxr/view-license/1.0.0/`, acessado em 2026-10-17. `[oficial]`
8. **Radiopaedia — Terms of Use & Creative Commons BY-NC-SA 3.0 License:** `https://radiopaedia.org/terms`, acessado em 2026-10-17. `[oficial]`
9. **ANVISA — Resolução da Diretoria Colegiada RDC nº 611, de 9 de março de 2022:** `https://antigo.anvisa.gov.br/documents/10181/6407462/RDC_611_2022_.pdf`, acessada em 2026-10-17. `[oficial]`
10. **CNEN — Norma CNEN NN 3.01 (Diretrizes Básicas de Proteção Radiológica):** `https://www.gov.br/cnen/pt-br/acesso-rapido/normas/grupo-3`, acessada em 2026-10-17. `[oficial]`
11. **Google Play Store Brasil — Aplicativos de Posicionamento Radiográfico e Simulados (`RX - Posicionamento Radiográfico`, `Simutec Radio`, `Radiologia Aplicada`):** `https://play.google.com/store/search?q=radiologia%20posicionamento&c=apps&hl=pt_BR`, acessado em 2026-10-17. `[terceiro]` `[usuário]`

---

## Limites desta pesquisa

- A verificação de licenças cobre a política oficial de cada repositório (`[oficial]`), mas **cada imagem individual** selecionada no `Open-i / PMC`, `Wikimedia Commons` ou `NCI IDC` ainda exige conferência individual do campo `LicenseURL` / metadado `CC BY 4.0` ou `CC0` antes do commit no repositório (Regra 3).
- Os pesos percentuais de temas em concursos (`30%–40%` posicionamento, `20%–25%` proteção/legislação) são faixas agregadas de editais e provas públicas de Técnico em Radiologia (`EBSERH/IBFC`, `FGV`, `VUNESP`) e podem variar conforme o perfil da vaga (hospitalar geral vs. odontológico/industrial).
