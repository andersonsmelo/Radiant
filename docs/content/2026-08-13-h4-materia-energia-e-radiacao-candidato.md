# H4 — candidato curricular: Matéria, energia e radiação

> **Estado:** candidato final revisado e aprovado para integração no repositório
> em 2026-08-13, por decisão explícita do dono após revisão profissional
> assistida. Este arquivo ainda não é um `ProductionBatchV1` e não está
> conectado ao catálogo ou a qualquer superfície do produto.

## Proveniência do candidato

- unidade: `unit:materia-energia-e-radiacao`;
- trilha: `track:fundamentos-e-seguranca-radiologica`;
- origem: segundo de três retornos de IA comparados em 2026-08-13;
- SHA-256 do anexo recebido:
  `d12c8c6cc0959f6344ec282454528fcdbe02855d0e4a3154994d28b2531695fe`;
- decisão de triagem: o primeiro retorno foi rejeitado por classificar
  incorretamente a edição atual de *OpenStax College Physics 2e* como CC BY 4.0;
  o terceiro interrompeu corretamente por evidência insuficiente, mas não
  encontrou as páginas específicas do LibreTexts; este segundo retorno foi
  escolhido como base por identificar páginas textuais que declaram CC BY 4.0
  e excluir mídia de terceiros;
- limite da decisão: a triagem documental reduz o bloqueio de descoberta de
  fontes, mas não substitui revisão jurídica, técnica, editorial, de
  acessibilidade ou aprovação de produto.

## Correções obrigatórias antes da conversão

1. trocar a declaração absoluta de direitos por “triagem documental concluída;
   aprovação jurídica pendente”;
2. registrar data de acesso, hash e atribuição completa por fonte, incluindo
   link da licença e indicação de tradução/adaptação;
3. completar a relação entre ionização e estabilidade na primeira competência;
4. tornar explícita a ponte entre transmissão diferencial, detector e contraste
   na competência de atenuação;
5. fortalecer distratores e reduzir repetição literal entre prática e
   checkpoint;
6. converter para o contrato real `LearningActivityV2`: 3–6 passos por
   atividade, 1–4 interações, proveniência, `evidenceKind`,
   `completionRule`, `criticalSafety: false`, feedback e acessibilidade;
7. manter checkpoint com 10 itens, dois por competência, meta de 80% e nenhum
   campo autoral `isCriticalError`;
8. gerar o lote, schemas e hashes somente depois da revisão do conteúdo; nenhuma
   aprovação humana pode ser inferida ou fabricada.

## Conteúdo recebido — preservado sem alteração

# Pacote curricular v2 — rascunho para revisão humana

**trackId:** `track:fundamentos-e-seguranca-radiologica`
**unitId:** `unit:materia-energia-e-radiacao`
**title:** Matéria, energia e radiação

**Competências fixas:**

1. `competency:materia-energia-e-radiacao:estrutura-atomica-e-ionizacao`
2. `competency:materia-energia-e-radiacao:ionizante-e-nao-ionizante`
3. `competency:materia-energia-e-radiacao:frequencia-comprimento-e-energia`
4. `competency:materia-energia-e-radiacao:raios-x-no-espectro`
5. `competency:materia-energia-e-radiacao:atenuacao-como-ponte`

---

# A. Manifesto de direitos

## A.1. Critério adotado

Para este rascunho, foram aceitas apenas páginas específicas que declaram **CC BY 4.0** de forma verificável. A licença CC BY 4.0 autoriza compartilhamento e adaptação, inclusive para finalidade comercial, desde que sejam cumpridas as condições de atribuição. ([Creative Commons][1])

Nenhuma figura, fotografia, tabela, vídeo, áudio, logotipo, marca ou diagrama das páginas pesquisadas foi incorporado ao pacote. Mesmo quando a página contém recursos visuais com licenças próprias, esses elementos foram deliberadamente excluídos. O texto curricular abaixo é uma redação original baseada apenas nos conceitos verificáveis.

### Fontes aceitas

| ID     | Fonte                                           | Instituição/autoria                                                                | URL direta                                                                                                                                                                                | Licença   | URL da licença                                 | Onde a licença aparece                                                                                                                                                                    | Uso                                        |
| ------ | ----------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| **S1** | *1.1: Historical Development of Atomic Theory*  | Kai Landskron / Chemistry LibreTexts / Lehigh University                           | `https://chem.libretexts.org/Bookshelves/Inorganic_Chemistry/Inorganic_Coordination_Chemistry_%28Landskron%29/01%3A_Atomic_Structure/1.01%3A_Historical_Development_of_Atomic_Theory`     | CC BY 4.0 | `https://creativecommons.org/licenses/by/4.0/` | Rodapé da página declara expressamente que a página é compartilhada sob CC BY 4.0 e identifica Kai Landskron como autor. ([Chemistry LibreTexts][2])                                      | `commercialUse: true`; adaptação permitida |
| **S2** | *Glossary — Chemistry 2e (OpenStax)*            | OpenStax via Chemistry LibreTexts                                                  | `https://chem.libretexts.org/Bookshelves/General_Chemistry/Chemistry_2e_%28OpenStax%29/zz%3A_Back_Matter/20%3A_Glossary`                                                                  | CC BY 4.0 | `https://creativecommons.org/licenses/by/4.0/` | Metadados da própria página registram `License: CC BY` e `License Version: 4.0`. A mesma página define radiação ionizante e não ionizante. ([chem.libretexts.org][3])                     | `commercialUse: true`; adaptação permitida |
| **S3** | *11.3: The Wave Aspect of Light — Interference* | OpenStax, versão disponibilizada por Physics LibreTexts / Georgia State University | `https://phys.libretexts.org/Courses/Georgia_State_University/GSU-TM-Introductory_Physics_II_%281112%29/11%3A_Physical_Optics/11.03%3A_The_Wave_Aspect_of_Light-_Interference`            | CC BY 4.0 | `https://creativecommons.org/licenses/by/4.0/` | Rodapé da página declara CC BY 4.0. O corpo apresenta a relação `c = fλ`. ([Physics LibreTexts][4])                                                                                       | `commercialUse: true`; adaptação permitida |
| **S4** | *30.3: The Photoelectric Effect*                | Andrew Morrison / CARLI / Physics LibreTexts                                       | `https://phys.libretexts.org/Courses/Joliet_Junior_College/JJC_-_PHYS_110/College_Physics_for_Health_Professions/30%3A_Introduction_to_Quantum_Physics/30.03%3A_The_Photoelectric_Effect` | CC BY 4.0 | `https://creativecommons.org/licenses/by/4.0/` | Rodapé declara CC BY 4.0; o texto explica a energia do fóton pela relação `E = hf`. ([Physics LibreTexts][5])                                                                             | `commercialUse: true`; adaptação permitida |
| **S5** | *24.4: The Electromagnetic Spectrum*            | Andrew Morrison / CARLI / Physics LibreTexts                                       | `https://phys.libretexts.org/Courses/Joliet_Junior_College/JJC_-_PHYS_110/College_Physics_for_Health_Professions/24%3A_Electromagnetic_Waves/24.04%3A_The_Electromagnetic_Spectrum`       | CC BY 4.0 | `https://creativecommons.org/licenses/by/4.0/` | Rodapé declara CC BY 4.0. A página posiciona os raios X na região de frequência elevada do espectro e descreve sua sobreposição com UV e gama. ([Physics LibreTexts][6])                  | `commercialUse: true`; adaptação permitida |
| **S6** | *6.1: X-ray Tube and Process*                   | J. S. Ballard / Linn-Benton Community College / Medicine LibreTexts                | `https://med.libretexts.org/Bookshelves/Allied_Health/Radiation_Safety_%28Ballard%29/06%3A_X-ray/6.01%3A_X-ray_Tube_and_Process`                                                          | CC BY 4.0 | `https://creativecommons.org/licenses/by/4.0/` | Rodapé declara explicitamente CC BY 4.0. O texto identifica raios X como radiação ionizante não particulada e descreve diferenças de absorção entre materiais. ([Medicine LibreTexts][7]) | `commercialUse: true`; adaptação permitida |
| **S7** | *6.4: Glossary*                                 | J. S. Ballard / Linn-Benton Community College / Medicine LibreTexts                | `https://med.libretexts.org/Bookshelves/Allied_Health/Radiation_Safety_%28Ballard%29/06%3A_X-ray/6.04%3A_Glossary`                                                                        | CC BY 4.0 | `https://creativecommons.org/licenses/by/4.0/` | Rodapé declara CC BY 4.0. O glossário cobre absorção, espalhamento Compton, elétron, próton, fóton, radiação ionizante e raios X. ([Medicine LibreTexts][8])                              | `commercialUse: true`; adaptação permitida |
| **S8** | *12.12: Dual energy X-ray absorptiometry (14.11)* | Rosalind S. Gibson / University of Otago / Medicine LibreTexts | `https://med.libretexts.org/Bookshelves/Nutrition/Principles_of_Nutritional_Assessment_3e_%28Gibson_et_al.%29/12%3A_Body_Composition-_Laboratory_Methods_%28Chapter_14%29/12.12%3A_Dual_energy_Xray_absorptiometry_%2814.11%29` | CC BY 4.0 | `https://creativecommons.org/licenses/by/4.0/` | Rodapé declara CC BY 4.0. A página descreve que um detector identifica fótons e que atenuação diferencial pode produzir contraste de imagem. ([Medicine LibreTexts][18]) | `commercialUse: true`; adaptação permitida |

### Fontes rejeitadas

| Fonte/candidato                                                                                          | Motivo da rejeição                                                                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **OpenStax College Physics 2e**, edição consultada                                                       | Página de licenciamento encontrada sob **CC BY-NC-SA**, portanto incompatível com uso comercial. ([OpenStax][9])                                                                                                                                                                                            |
| **OpenStax Physics 15.1 — The Electromagnetic Spectrum**, página direta                                  | Embora a página declare Creative Commons Attribution, ela também apresenta uma restrição específica proibindo ingestão do livro em ofertas de IA/LLM sem permissão. Como este pacote é produzido em fluxo assistido por LLM, a fonte direta foi excluída para evitar ambiguidade jurídica. ([OpenStax][10]) |
| **OpenStax Physics 15.2 — The Behavior of Electromagnetic Radiation**, página direta                     | Mesma restrição específica relativa a LLM/IA. Não utilizada. ([OpenStax][11])                                                                                                                                                                                                                               |
| **OpenStax Physics 21.2 — Einstein and the Photoelectric Effect**, página direta                         | Mesma restrição específica relativa a LLM/IA. Não utilizada. ([OpenStax][12])                                                                                                                                                                                                                               |
| **OpenStax Physics 22.1 — The Structure of the Atom**, página direta                                     | Mesma restrição específica relativa a LLM/IA. Não utilizada. ([OpenStax][13])                                                                                                                                                                                                                               |
| **Chemistry LibreTexts — 5.4 Ionizing Radiation and Non-ionizing Radiation**, versão Furman University   | A página específica está em **CC BY-NC-SA 4.0**. Rejeitada. ([Chemistry LibreTexts][14])                                                                                                                                                                                                                    |
| **Chemistry LibreTexts — 5.3 Ionizing Radiation and Non-ionizing Radiation**, Cleveland State University | A página específica está em **CC BY-NC-SA 4.0**. Rejeitada. ([Chemistry LibreTexts][15])                                                                                                                                                                                                                    |
| **Medicine LibreTexts — 2.3 Ionizing Radiation: Basic Concepts**                                         | A página específica está em **CC BY-NC-SA 4.0**. Rejeitada. ([Medicine LibreTexts][16])                                                                                                                                                                                                                     |
| **UEN Pressbooks — Biological Effects of Radiation**                                                     | O resultado indexado indicava CC BY 4.0, mas a página direta não pôde ser documentalmente inspecionada pela ferramenta. Pela regra de não aceitar licença insuficientemente verificável, foi excluída.                                                                                                      |
| **Publicação do INCA previamente analisada**                                                             | Excluída por determinação expressa do briefing, por ter sido previamente identificada como não comercial. Não foi reutilizada nem reavaliada.                                                                                                                                                               |
| **X-ray Photon-Matter Interaction — Pattern Recognition Lab/FAU**                                        | A página associa CC BY 4.0 a materiais/imagens da aula, mas a licença integral do texto da página não ficou suficientemente inequívoca para este critério estrito. Rejeitada por ambiguidade. ([Pattern Recognition Lab][17])                                                                               |

**Observação jurídica:** a aceitação acima se refere ao **conteúdo textual das páginas identificadas**, não a recursos incorporados de terceiros.

**Triagem documental concluída; aprovação jurídica pendente.** A checagem
automática não substitui nenhuma revisão humana.

### Registro verificável das fontes usadas

Em 2026-08-13, cada URL direta foi recuperada por HTTPS e teve o corpo retornado
hasheado em SHA-256. O hash identifica aquela captura histórica. Como as páginas
podem incluir fragmentos dinâmicos, capturas sucessivas podem divergir sem mudança
editorial; portanto o hash não é uma identidade estável do conteúdo nem prova
isolada de licença. Título, autoria/curadoria, URL direta, licença CC BY 4.0,
URL da licença, data, hash e aviso de tradução/adaptação estão também no artefato
estruturado [`EditorialCurriculumCandidate.ts`](../../radiant-app/src/features/student-checkpoints/EditorialCurriculumCandidate.ts).

| ID | Hash SHA-256 do material recuperado |
| --- | --- |
| S1 | `692eb52f9934a34f9701c8517e2356be7f78bb84c9effcfd9625561f1cf51e52` |
| S2 | `5aeda0c0b6a9e70d31baae98739c9b1f03b6ef95accdd23cdd23871df763944e` |
| S3 | `f83d9766bc297ebc607f1ddf96fc99d02c0ca18045e03ae16bf95b7e520cc1a2` |
| S4 | `0bc4b4fbf2f786c2326414874289a72df488f3b086b0de0a32f8a44738e4fea9` |
| S5 | `8da9698ec668edc7ab803fd1c4155915dafadae05a474943cffd652418e8c692` |
| S6 | `ca8b9e62ee24c2f1b766c04bff09cee35d2b709cb9de4249b3e5865a75edeccf` |
| S7 | `191a81978c1f55a2d6f4fa5e28316e81f3a46207ae89144379f10f59a1ab308a` |
| S8 | `7fbb379cf18ffa743e14694a5ec725938e701689c9a296d2f04de89a38f41b75` |

## Adaptação estruturada independente — ainda candidata, nunca lote promovido

O módulo `EditorialCurriculumCandidate.ts` é uma adaptação estruturada independente
deste candidato preservado, não uma conversão fiel e item a item do Markdown. Ele
contém 12 `LearningActivityV2` (três passos e uma interação cada), o checkpoint de
10 itens com meta de 80% e os dois ciclos de reforço. Enunciados, respostas corretas
e feedback são identificados como `source-backed`; distratores são identificados como
`authorial-distractor` e não carregam IDs de fonte, para não atribuir uma afirmação
falsa à fonte consultada. Todas as interações têm
`criticalSafety: false`; o runtime, e não o conteúdo, calcula `isCriticalError`.
O artefato estruturado requer revisão técnica própria antes de qualquer gate humano;
uma aprovação deste Markdown não o aprova implicitamente.

O módulo valida que o candidato fica em `human-gates-pending`, rejeitando qualquer
aprovação humana fabricada. Ele não é `ProductionBatchV1`, não entra no catálogo
e não é importado por tela ou fluxo de produção.

### Decisão da revisão final

Em 2026-08-13, a revisão final não encontrou defeito técnico, editorial ou físico
de severidade bloqueadora no candidato. As oito páginas diretas foram novamente
inspecionadas e continuavam declarando CC BY 4.0; o pacote usa somente redação
original em português e não incorpora mídia dessas páginas. O dono autorizou
explicitamente a integração no repositório. Esta decisão encerra novas rodadas de
revisão deste candidato, salvo alteração material. Ela não finge disponibilidade
no app: `ProductionBatchV1`, promoção e experiência executável são trabalho de
engenharia posterior.

---

# B. Mapa de cobertura

| Competência                                                              | Objetivo de aprendizagem                                                                                                                                              | Fontes aprovadas                       | Atividades | Checkpoint | Evidência de domínio                                                                                         |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ---------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| `competency:materia-energia-e-radiacao:estrutura-atomica-e-ionizacao`    | Reconhecer os componentes básicos do átomo e explicar conceitualmente como a remoção de um elétron pode produzir um íon.                                              | S1, S2, S7 ([Chemistry LibreTexts][2]) | 01, 02, 03 | 01, 02     | Identifica prótons, nêutrons e elétrons e relaciona perda de elétron à formação de um íon positivo.          |
| `competency:materia-energia-e-radiacao:ionizante-e-nao-ionizante`        | Diferenciar radiação ionizante de não ionizante pela capacidade de produzir ionização. A avaliação de risco e segurança fica fora do escopo deste candidato.              | S2, S4, S7 ([Chemistry LibreTexts][3]) | 04, 05     | 03, 04     | Classifica situações conceituais usando energia suficiente ou insuficiente para remover elétrons.            |
| `competency:materia-energia-e-radiacao:frequencia-comprimento-e-energia` | Explicar a relação inversa entre frequência e comprimento de onda e a relação direta entre frequência e energia de cada fóton.                                        | S3, S4 ([Physics LibreTexts][4])       | 06, 07, 08 | 05, 06     | Prevê corretamente o efeito de aumentar frequência sobre comprimento de onda e energia do fóton.             |
| `competency:materia-energia-e-radiacao:raios-x-no-espectro`              | Localizar conceitualmente os raios X no espectro eletromagnético e reconhecê-los como fótons de radiação eletromagnética ionizante.                                   | S5, S6, S7 ([Physics LibreTexts][6])   | 09, 10     | 07, 08     | Posiciona raios X entre regiões de alta frequência do espectro e não os confunde com partículas carregadas.  |
| `competency:materia-energia-e-radiacao:atenuacao-como-ponte`             | Entender atenuação como redução do feixe que permanece na direção original após interações com matéria, conectando absorção e espalhamento à transmissão diferencial. | S6, S7, S8 ([Medicine LibreTexts][18]) | 11, 12     | 09, 10     | Explica por que diferentes interações podem reduzir a quantidade de radiação que continua no feixe original. |

---

# C. Conteúdo-base

## C1. Estrutura atômica e ionização

**Competência:** `competency:materia-energia-e-radiacao:estrutura-atomica-e-ionizacao`

### Conceito

A matéria pode ser descrita em termos de átomos. Em um modelo introdutório, o átomo contém um núcleo associado a prótons e nêutrons e uma região eletrônica ocupada por elétrons. Prótons têm carga positiva, elétrons têm carga negativa e nêutrons não possuem carga elétrica líquida. As fontes aprovadas identificam prótons, nêutrons e elétrons como partículas subatômicas e definem ionização em termos da formação de íons pela remoção de elétrons. ([Chemistry LibreTexts][2])

Neste módulo, o caso de ionização mais importante para construir o conceito é simples: se uma interação fornece energia suficiente para retirar um elétron de um átomo ou molécula, a distribuição de cargas deixa de estar equilibrada e forma-se um íon. ([Chemistry LibreTexts][3])

### Vocabulário essencial

* átomo;
* núcleo;
* próton;
* nêutron;
* elétron;
* carga elétrica;
* íon;
* ionização.

### Exemplo conceitual seguro

Imagine um átomo simplificado eletricamente neutro. Uma interação transfere energia suficiente para retirar um de seus elétrons. O núcleo não precisa ser quebrado para que ocorra ionização. O que mudou foi o balanço eletrônico do átomo.

### Confusão comum

**Confusão:** “Ionizar significa partir o núcleo do átomo.”

**Correção:** não. A ionização pode ocorrer pela remoção de um elétron, sem que o núcleo seja fragmentado. ([Chemistry LibreTexts][3])

### Verificação de entendimento

Se um átomo inicialmente neutro perde um elétron, ele continua eletricamente neutro?

**Resposta esperada:** não. A perda do elétron deixa um excesso relativo de carga positiva.

**Referências:** S1, S2, S7.

---

## C2. Radiação ionizante e não ionizante

**Competência:** `competency:materia-energia-e-radiacao:ionizante-e-nao-ionizante`

### Conceito

A diferença fundamental não é se a radiação é “forte”, “fraca”, “natural” ou “artificial”. A distinção está na capacidade de a interação fornecer energia suficiente para promover ionização.

Uma fonte aprovada define radiação ionizante como aquela capaz de provocar perda de elétron e formação de íon, enquanto a não ionizante não possui energia suficiente para produzir essa ionização. ([chem.libretexts.org][3])

Para radiação eletromagnética, isso se conecta à energia de cada fóton: a energia do fóton aumenta com a frequência. Portanto, classificar uma radiação eletromagnética como ionizante envolve considerar a energia disponível por fóton e a interação com a matéria, não apenas a quantidade total de radiação. ([Physics LibreTexts][5])

Este candidato não mede risco, dose, exposição, distância nem decisão técnica. Essas avaliações ficam fora de escopo e não podem ser inferidas apenas da classificação ionizante ou não ionizante.

### Vocabulário essencial

* radiação;
* radiação ionizante;
* radiação não ionizante;
* ionização;
* fóton;
* energia por fóton.

### Exemplo conceitual seguro

Considere duas radiações hipotéticas:

* Radiação A: seus fótons não possuem energia suficiente para retirar um elétron do material considerado.
* Radiação B: seus fótons podem fornecer energia suficiente para produzir essa remoção.

Nesse modelo, B é ionizante; A é não ionizante.

### Confusão comum

**Confusão:** “Toda radiação é ionizante.”

**Correção:** não. O termo radiação abrange formas ionizantes e não ionizantes. ([chem.libretexts.org][3])

### Verificação de entendimento

Qual característica separa conceitualmente as duas categorias?

**Resposta esperada:** a capacidade ou não de produzir ionização.

**Referências:** S2, S4, S7.

---

## C3. Frequência, comprimento de onda e energia

**Competência:** `competency:materia-energia-e-radiacao:frequencia-comprimento-e-energia`

### Conceito

A frequência indica quantos ciclos de uma onda passam por um ponto em determinado intervalo de tempo. O comprimento de onda representa a distância associada a um ciclo.

Para uma onda eletromagnética no vácuo:

`c = fλ`

Como `c` permanece constante, frequência e comprimento de onda variam de maneira inversa: se a frequência aumenta, o comprimento de onda diminui. ([Physics LibreTexts][4])

Para um fóton:

`E = hf`

Como `h` é constante, maior frequência corresponde a maior energia por fóton. Assim, no mesmo contexto, menor comprimento de onda está associado a maior frequência e maior energia por fóton. ([Physics LibreTexts][5])

### Vocabulário essencial

* frequência;
* comprimento de onda;
* fóton;
* energia;
* relação inversa;
* relação direta.

### Exemplo conceitual seguro

Compare dois fótons A e B no vácuo. Se B tem frequência maior que A, então B possui:

* menor comprimento de onda;
* maior energia por fóton.

Não é necessário decorar números para chegar a essa conclusão.

### Confusão comum

**Confusão:** “Maior frequência significa maior comprimento de onda.”

**Correção:** no vácuo ocorre o contrário. Como `c = fλ`, quando a frequência cresce, o comprimento de onda diminui. ([Physics LibreTexts][4])

### Verificação de entendimento

Se a frequência de um fóton aumenta, o que acontece com sua energia?

**Resposta esperada:** aumenta.

**Referências:** S3, S4.

---

## C4. Raios X no espectro eletromagnético

**Competência:** `competency:materia-energia-e-radiacao:raios-x-no-espectro`

### Conceito

Raios X são radiação eletromagnética, isto é, podem ser descritos como fótons e não como partículas carregadas semelhantes a elétrons ou prótons. ([Physics LibreTexts][6])

Em uma organização simplificada por frequência crescente, encontramos:

**ondas de rádio → infravermelho → luz visível → ultravioleta → raios X**

As fronteiras do espectro não funcionam como muros rígidos. A faixa dos raios X pode se sobrepor ao extremo de maior frequência do ultravioleta e à faixa inferior dos raios gama. Raios X e gama de mesma frequência têm as mesmas características físicas; a distinção entre seus nomes depende da origem. ([Physics LibreTexts][6])

### Vocabulário essencial

* espectro eletromagnético;
* raio X;
* fóton;
* ultravioleta;
* raio gama;
* frequência;
* radiação eletromagnética.

### Exemplo conceitual seguro

Entre rádio, visível, UV e raios X, uma organização simplificada de frequência crescente coloca os raios X após UV. Não se usa a fronteira entre raios X e gama como gabarito único, pois seus intervalos podem se sobrepor e a classificação também considera a origem.

### Confusão comum

**Confusão:** “Um raio X é um elétron muito rápido.”

**Correção:** não. Elétrons podem participar de processos que originam raios X, mas o raio X produzido é um fóton de radiação eletromagnética. ([Medicine LibreTexts][7])

### Verificação de entendimento

Raios X pertencem ao espectro eletromagnético?

**Resposta esperada:** sim.

**Referências:** S5, S6.

---

## C5. Atenuação como ponte

**Competência:** `competency:materia-energia-e-radiacao:atenuacao-como-ponte`

### Conceito

Quando um conjunto de fótons atravessa matéria, interações podem retirar fótons do feixe original ou mudar sua direção. Para este nível introdutório, **atenuação** será usada como a ideia de redução da quantidade ou intensidade de radiação que continua no feixe original após a passagem pelo material.

A absorção reduz a intensidade ao transferir energia para o meio. No espalhamento, como no exemplo do espalhamento Compton descrito pela fonte, o fóton pode transferir parte de sua energia e prosseguir em outra direção. Ambos ajudam a compreender por que menos radiação permanece seguindo exatamente o trajeto inicial. ([Medicine LibreTexts][8])

A fonte sobre raios X também registra que, mantendo a mesma energia dos fótons, materiais diferentes podem apresentar absorção diferente. ([Medicine LibreTexts][7])

Essa é a “ponte” conceitual desta competência: **estrutura da matéria → interação fóton-matéria → transmissão diferente do feixe**.

Em um contexto de imagem, uma fonte adicional descreve a sequência conceitual transmissão diferencial → sinal do detector → contraste. Nesta unidade, ela é usada somente como ponte conceitual, sem ensinar técnica, exposição, dose ou decisão clínica. ([Medicine LibreTexts][18])

### Vocabulário essencial

* atenuação;
* transmissão;
* absorção;
* espalhamento;
* interação;
* feixe original.

### Exemplo conceitual seguro

Um mesmo feixe hipotético atravessa separadamente dois blocos de materiais diferentes. Se um deles remove ou redireciona mais fótons do feixe, menos radiação emerge seguindo a direção original. Dizemos, conceitualmente, que ocorreu maior atenuação nesse percurso.

### Confusão comum

**Confusão:** “Atenuação significa que todos os fótons foram absorvidos.”

**Correção:** não. A redução do feixe original pode envolver absorção, mas também processos que redirecionam fótons, como o espalhamento. ([Medicine LibreTexts][8])

### Verificação de entendimento

Se parte dos fótons muda de direção durante a passagem por um material, a intensidade que continua na direção original pode diminuir?

**Resposta esperada:** sim.

**Referências:** S6, S7, S8.

---

# D. 12 atividades de aprendizagem

## `activity:materia-energia-e-radiacao:01`

**Competência:** `competency:materia-energia-e-radiacao:estrutura-atomica-e-ionizacao`

**Formato:** múltipla escolha.

**Enunciado:**
Qual alternativa descreve corretamente um modelo introdutório da estrutura do átomo?

A. Prótons e elétrons ficam apenas no núcleo.
B. Prótons e nêutrons estão associados ao núcleo, enquanto elétrons ocupam a região eletrônica.
C. O átomo contém somente elétrons.
D. Fótons são componentes permanentes do núcleo.

**Resposta correta:** B.

**Feedback para acerto:**
Correto. O modelo básico distingue o núcleo, associado a prótons e nêutrons, da região ocupada pelos elétrons.

**Feedback para erro:**
Revise quais partículas pertencem ao núcleo e qual partícula possui carga negativa e ocupa a região eletrônica.

**Justificativa pedagógica:**
Estabelece o modelo mental necessário antes de introduzir ionização.

**Referências de origem:** S1, S7. ([Chemistry LibreTexts][2])

---

## `activity:materia-energia-e-radiacao:02`

**Competência:** `competency:materia-energia-e-radiacao:estrutura-atomica-e-ionizacao`

**Formato:** associação textual.

**Enunciado:**
Associe cada partícula à descrição correta.

1. Próton
2. Nêutron
3. Elétron

Descrições:

A. Carga negativa.
B. Sem carga elétrica líquida.
C. Carga positiva.

**Resposta correta:**
1-C; 2-B; 3-A.

**Feedback para acerto:**
Correto. Esse mapa de cargas permite entender por que retirar um elétron altera o equilíbrio elétrico de um átomo.

**Feedback para erro:**
Concentre-se primeiro nos sinais: próton positivo, elétron negativo e nêutron eletricamente neutro.

**Justificativa pedagógica:**
Consolida o vocabulário que sustenta o conceito de íon.

**Referências de origem:** S1, S7. ([Chemistry LibreTexts][2])

---

## `activity:materia-energia-e-radiacao:03`

**Competência:** `competency:materia-energia-e-radiacao:estrutura-atomica-e-ionizacao`

**Formato:** sequência textual.

**Enunciado:**
Coloque os acontecimentos em ordem lógica:

A. Forma-se um íon.
B. Um átomo está inicialmente neutro.
C. Uma interação transfere energia suficiente para retirar um elétron.
D. O equilíbrio entre cargas positivas e negativas deixa de ser o mesmo.

**Resposta correta:**
B → C → D → A.

**Feedback para acerto:**
Correto. A sequência conecta estrutura atômica, remoção eletrônica e formação do íon.

**Feedback para erro:**
Comece pelo estado inicial neutro. A formação do íon é consequência da alteração no número de elétrons.

**Justificativa pedagógica:**
Transforma uma definição estática em uma cadeia causal.

**Referências de origem:** S2, S7. ([Chemistry LibreTexts][3])

---

## `activity:materia-energia-e-radiacao:04`

**Competência:** `competency:materia-energia-e-radiacao:ionizante-e-nao-ionizante`

**Formato:** múltipla escolha.

**Enunciado:**
Uma radiação hipotética interage com um material, mas cada quantum não possui energia suficiente para retirar elétrons e produzir ionização. Como ela é classificada nesse contexto?

A. Ionizante.
B. Não ionizante.
C. Necessariamente raio X.
D. Necessariamente partícula carregada.

**Resposta correta:** B.

**Feedback para acerto:**
Correto. A classificação depende da capacidade de produzir ionização.

**Feedback para erro:**
Não use “radiação” como sinônimo automático de “ionizante”. Pergunte se a interação possui energia suficiente para produzir a remoção eletrônica.

**Justificativa pedagógica:**
Testa o critério conceitual da classificação, sem exigir memorização de valores.

**Referências de origem:** S2. ([chem.libretexts.org][3])

---

## `activity:materia-energia-e-radiacao:05`

**Competência:** `competency:materia-energia-e-radiacao:ionizante-e-nao-ionizante`

**Formato:** múltipla escolha com correção de equívoco.

**Enunciado:**
Um estudante afirma: “Se houver muitos fótons, cada fóton automaticamente passa a ter mais energia.” Qual resposta corrige melhor essa ideia?

A. Correto, porque quantidade e energia por fóton são sempre a mesma propriedade.
B. Incorreto. A energia de cada fóton está relacionada à sua frequência; aumentar o número de fótons não é a mesma coisa que aumentar a energia de cada um.
C. Correto somente para luz visível.
D. Incorreto porque fótons não possuem energia.

**Resposta correta:** B.

**Feedback para acerto:**
Correto. Número de fótons e energia por fóton são conceitos diferentes.

**Feedback para erro:**
Revise `E = hf`. A frequência determina a energia de cada fóton. A intensidade pode envolver a quantidade de fótons sem alterar necessariamente a energia individual deles.

**Justificativa pedagógica:**
Previne a confusão entre intensidade e energia por quantum, importante para compreender ionização.

**Referências de origem:** S4. ([Physics LibreTexts][5])

---

## `activity:materia-energia-e-radiacao:06`

**Competência:** `competency:materia-energia-e-radiacao:frequencia-comprimento-e-energia`

**Formato:** múltipla escolha.

**Enunciado:**
No vácuo, a frequência de uma onda eletromagnética aumenta. O que acontece com seu comprimento de onda?

A. Aumenta.
B. Diminui.
C. Permanece necessariamente igual.
D. Deixa de existir.

**Resposta correta:** B.

**Feedback para acerto:**
Correto. Frequência e comprimento de onda são inversamente relacionados para a propagação no vácuo.

**Feedback para erro:**
Use a relação `c = fλ`. Como `c` permanece constante, o aumento de `f` exige redução de `λ`.

**Justificativa pedagógica:**
Avalia entendimento relacional em vez de cálculo ou memorização numérica.

**Referências de origem:** S3. ([Physics LibreTexts][4])

---

## `activity:materia-energia-e-radiacao:07`

**Competência:** `competency:materia-energia-e-radiacao:frequencia-comprimento-e-energia`

**Formato:** associação textual.

**Enunciado:**
Associe cada mudança à consequência correta, considerando fótons eletromagnéticos no mesmo contexto de propagação:

1. Frequência aumenta.
2. Comprimento de onda aumenta.
3. Frequência diminui.

Consequências:

A. Energia por fóton diminui.
B. Comprimento de onda diminui e energia por fóton aumenta.
C. Frequência diminui e energia por fóton diminui.

**Resposta correta:**
1-B; 2-C; 3-A.

**Feedback para acerto:**
Correto. Você combinou as relações `c = fλ` e `E = hf`.

**Feedback para erro:**
Separe o problema em duas relações: frequência versus comprimento de onda e frequência versus energia.

**Justificativa pedagógica:**
Promove integração entre duas relações físicas em vez de tratá-las isoladamente.

**Referências de origem:** S3, S4. ([Physics LibreTexts][4])

---

## `activity:materia-energia-e-radiacao:08`

**Competência:** `competency:materia-energia-e-radiacao:frequencia-comprimento-e-energia`

**Formato:** correção de equívoco.

**Enunciado:**
Dois fótons, A e B, propagam-se no vácuo. B possui comprimento de onda menor que A. Qual conclusão é coerente?

A. B tem frequência menor e energia menor.
B. B tem frequência maior e energia maior.
C. B tem frequência igual e energia menor.
D. O comprimento de onda não possui relação com frequência.

**Resposta correta:** B.

**Feedback para acerto:**
Correto. Menor comprimento de onda corresponde a maior frequência e, para fótons, maior energia.

**Feedback para erro:**
Menor `λ` implica maior `f`; com `E = hf`, maior `f` implica maior energia.

**Justificativa pedagógica:**
Verifica transferência do conceito para uma comparação entre dois fótons.

**Referências de origem:** S3, S4. ([Physics LibreTexts][4])

---

## `activity:materia-energia-e-radiacao:09`

**Competência:** `competency:materia-energia-e-radiacao:raios-x-no-espectro`

**Formato:** sequência textual.

**Enunciado:**
Organize estas regiões em uma sequência simplificada de frequência crescente:

* raios X;
* luz visível;
* ondas de rádio;
* ultravioleta.

**Resposta correta:**
ondas de rádio → luz visível → ultravioleta → raios X.

**Feedback para acerto:**
Correto. Raios X ocupam a região de alta frequência do espectro, acima do ultravioleta em uma representação simplificada.

**Feedback para erro:**
Localize primeiro os extremos: rádio está no lado de menor frequência e raios X ficam após UV nesta representação simplificada.

**Justificativa pedagógica:**
Constrói um mapa textual do espectro sem depender de imagem.

**Referências de origem:** S5. ([Physics LibreTexts][6])

---

## `activity:materia-energia-e-radiacao:10`

**Competência:** `competency:materia-energia-e-radiacao:raios-x-no-espectro`

**Formato:** múltipla escolha.

**Enunciado:**
Qual frase descreve melhor um raio X?

A. Um próton emitido pelo núcleo.
B. Um elétron livre que viaja pelo espaço.
C. Um fóton de radiação eletromagnética ionizante.
D. Uma onda sonora de alta frequência.

**Resposta correta:** C.

**Feedback para acerto:**
Correto. Raios X pertencem ao espectro eletromagnético e são descritos como fótons ionizantes.

**Feedback para erro:**
Não confunda o processo que pode gerar um raio X com a natureza do raio X produzido. O produto é radiação eletromagnética.

**Justificativa pedagógica:**
Ataca diretamente uma confusão frequente entre elétrons e fótons de raios X.

**Referências de origem:** S5, S6, S7. ([Physics LibreTexts][6])

---

## `activity:materia-energia-e-radiacao:11`

**Competência:** `competency:materia-energia-e-radiacao:atenuacao-como-ponte`

**Formato:** múltipla escolha conceitual.

**Enunciado:**
Um feixe de fótons atravessa um bloco. Parte dos fótons é absorvida e parte muda de direção por espalhamento. O que acontece com o feixe que continua exatamente na direção original?

A. Sua intensidade pode diminuir.
B. Sua intensidade obrigatoriamente aumenta.
C. Nada pode mudar porque os fótons ainda existem em algum lugar.
D. Ele deixa automaticamente de ser radiação eletromagnética.

**Resposta correta:** A.

**Feedback para acerto:**
Correto. Absorção e desvio de fótons podem reduzir a parcela que continua no feixe original.

**Feedback para erro:**
Atenuação se refere ao que resta no feixe original. Um fóton espalhado pode continuar existindo, mas já não segue necessariamente naquela direção.

**Justificativa pedagógica:**
Distingue conservação física da radiação e redução do feixe transmitido na direção considerada.

**Referências de origem:** S7. ([Medicine LibreTexts][8])

---

## `activity:materia-energia-e-radiacao:12`

**Competência:** `competency:materia-energia-e-radiacao:atenuacao-como-ponte`

**Formato:** associação textual.

**Enunciado:**
Associe cada fenômeno à descrição mais adequada:

1. Absorção.
2. Espalhamento.
3. Maior transmissão pelo trajeto original.

Descrições:

A. Mais fótons continuam seguindo a direção considerada.
B. Energia é transferida ao meio e há redução da radiação que prossegue.
C. O fóton interage e passa a seguir outra direção.

**Resposta correta:**
1-B; 2-C; 3-A.

**Feedback para acerto:**
Correto. Essa distinção prepara o caminho para compreender como interações com a matéria modificam um feixe.

**Feedback para erro:**
Pergunte, em cada opção, se o fóton permanece no feixe original, é absorvido ou muda de direção.

**Justificativa pedagógica:**
Organiza os três conceitos que sustentam a ideia inicial de atenuação.

**Referências de origem:** S6, S7. ([Medicine LibreTexts][7])

---

# E. Checkpoint da unidade

**Estrutura:** 10 itens, dois por competência.

Para implementação futura, a estrutura permite uma meta de **80%**, correspondente a 8 acertos em 10 itens. Essa regra de progressão permanece sujeita à validação de produto e ao schema real do aplicativo.

---

## `checkpoint:materia-energia-e-radiacao:01`

**Competência:** `competency:materia-energia-e-radiacao:estrutura-atomica-e-ionizacao`

**Enunciado:**
Uma interação remove um elétron de um átomo inicialmente neutro. Qual é a consequência conceitual mais direta?

A. O átomo necessariamente perde um próton.
B. Forma-se um íon com excesso relativo de carga positiva.
C. O núcleo desaparece.
D. O átomo ganha carga negativa.

**Resposta correta:** B.

**Justificativa:**
A remoção de carga negativa altera o equilíbrio elétrico sem exigir mudança do núcleo.

**Referências:** S1, S2. ([Chemistry LibreTexts][2])

---

## `checkpoint:materia-energia-e-radiacao:02`

**Competência:** `competency:materia-energia-e-radiacao:estrutura-atomica-e-ionizacao`

**Enunciado:**
Qual evento é suficiente para representar ionização neste módulo introdutório?

A. Um átomo mudar de posição.
B. Um elétron ser removido de um átomo ou molécula.
C. Um nêutron mudar de direção.
D. Uma onda passar pelo espaço sem interação.

**Resposta correta:** B.

**Justificativa:**
As fontes adotadas definem ionização pela formação de íons associada à remoção de elétrons. ([Chemistry LibreTexts][3])

**Referências:** S2, S7.

---

## `checkpoint:materia-energia-e-radiacao:03`

**Competência:** `competency:materia-energia-e-radiacao:ionizante-e-nao-ionizante`

**Enunciado:**
Qual critério melhor diferencia radiação ionizante de não ionizante?

A. Ser visível ou invisível.
B. Ser natural ou produzida por tecnologia.
C. Ter capacidade de produzir ionização.
D. Viajar rapidamente.

**Resposta correta:** C.

**Justificativa:**
A classificação se baseia na capacidade de produzir ionização, não na origem ou visibilidade.

**Referências:** S2. ([chem.libretexts.org][3])

---

## `checkpoint:materia-energia-e-radiacao:04`

**Competência:** `competency:materia-energia-e-radiacao:ionizante-e-nao-ionizante`

**Enunciado:**
Um estudante diz: “Uma radiação só é ionizante quando existem muitos fótons juntos.” Qual correção é mais adequada?

A. Correto, porque a quantidade de fótons determina automaticamente a energia individual.
B. Incorreto, porque a capacidade de ionização envolve a energia disponível na interação; para fótons eletromagnéticos, a energia individual relaciona-se à frequência.
C. Correto para qualquer radiação.
D. Incorreto porque fótons nunca interagem com elétrons.

**Resposta correta:** B.

**Justificativa:**
`E = hf` relaciona a energia individual do fóton à frequência e permite separar energia por fóton de quantidade de fótons. ([Physics LibreTexts][5])

**Referências:** S2, S4.

---

## `checkpoint:materia-energia-e-radiacao:05`

**Competência:** `competency:materia-energia-e-radiacao:frequencia-comprimento-e-energia`

**Enunciado:**
No vácuo, uma onda eletromagnética passa a ter frequência maior. Qual combinação é coerente?

A. Maior comprimento de onda e menor energia por fóton.
B. Menor comprimento de onda e maior energia por fóton.
C. Maior comprimento de onda e maior energia por fóton.
D. Mesmo comprimento de onda e mesma energia.

**Resposta correta:** B.

**Justificativa:**
`c = fλ` torna frequência e comprimento de onda inversos; `E = hf` torna frequência e energia do fóton diretamente relacionadas. ([Physics LibreTexts][4])

**Referências:** S3, S4.

---

## `checkpoint:materia-energia-e-radiacao:06`

**Competência:** `competency:materia-energia-e-radiacao:frequencia-comprimento-e-energia`

**Enunciado:**
O fóton A tem frequência menor que o fóton B. Qual afirmação está correta?

A. A possui maior energia por fóton.
B. B possui maior energia por fóton.
C. Ambos necessariamente possuem a mesma energia.
D. Frequência e energia não possuem relação.

**Resposta correta:** B.

**Justificativa:**
A energia de um fóton cresce com sua frequência.

**Referências:** S4. ([Physics LibreTexts][5])

---

## `checkpoint:materia-energia-e-radiacao:07`

**Competência:** `competency:materia-energia-e-radiacao:raios-x-no-espectro`

**Enunciado:**
Qual afirmação é adequada sobre raios X e raios gama?

A. São definidos exclusivamente pela frequência.
B. Podem se sobrepor em frequência; na mesma frequência, a distinção está na origem.
C. Raios X sempre têm frequência maior que raios gama.
D. Raios gama são partículas carregadas.

**Resposta correta:** B.

**Justificativa:**
As faixas podem se sobrepor; em uma mesma frequência, raios X e gama se distinguem pela origem. ([Physics LibreTexts][6])

**Referências:** S5.

---

## `checkpoint:materia-energia-e-radiacao:08`

**Competência:** `competency:materia-energia-e-radiacao:raios-x-no-espectro`

**Enunciado:**
Um colega afirma: “O elétron que participa da produção de um raio X e o raio X produzido são a mesma coisa.” Qual resposta está correta?

A. Sim, porque ambos possuem carga negativa.
B. Não. O elétron é uma partícula carregada; o raio X produzido é radiação eletromagnética composta por fótons.
C. Sim, porque todo fóton é um elétron.
D. Não, porque raios X são ondas sonoras.

**Resposta correta:** B.

**Justificativa:**
As fontes distinguem elétrons de fótons e classificam raios X como radiação eletromagnética ionizante. ([Medicine LibreTexts][7])

**Referências:** S6, S7.

---

## `checkpoint:materia-energia-e-radiacao:09`

**Competência:** `competency:materia-energia-e-radiacao:atenuacao-como-ponte`

**Enunciado:**
Dois feixes idênticos atravessam materiais diferentes. Após a passagem, o feixe A mantém mais fótons na direção original do que o feixe B. Qual conclusão conceitual é mais adequada?

A. O percurso de B apresentou maior redução do feixe original.
B. A e B sofreram necessariamente interações idênticas.
C. B obrigatoriamente possui maior frequência após sair.
D. Nenhuma comparação é possível.

**Resposta correta:** A.

**Justificativa:**
Menos fótons permanecendo no feixe original representa maior redução de sua intensidade nessa direção.

**Referências:** S6, S7. ([Medicine LibreTexts][7])

---

## `checkpoint:materia-energia-e-radiacao:10`

**Competência:** `competency:materia-energia-e-radiacao:atenuacao-como-ponte`

**Enunciado:**
Qual afirmação sobre atenuação está mais adequada ao modelo desta unidade?

A. Só existe atenuação quando absolutamente todos os fótons são absorvidos.
B. A redução do feixe original pode ocorrer quando fótons são absorvidos ou desviados de sua direção por interações.
C. Atenuação significa aumento obrigatório de energia dos fótons.
D. Espalhamento sempre aumenta a quantidade de fótons no trajeto original.

**Resposta correta:** B.

**Justificativa:**
Absorção reduz a radiação transmitida e espalhamento pode retirar fótons da direção original. ([Medicine LibreTexts][8])

**Referências:** S7.

---

# F. Ciclos de reforço

## Ciclo 1 — recuperação guiada após erro

### 1. Estrutura atômica e ionização

**Recuperação:**
Pense primeiro nas cargas. Elétron é negativo; próton é positivo. Se um elétron é retirado de um átomo inicialmente neutro, desaparece uma carga negativa, mas as cargas positivas do núcleo permanecem. ([Chemistry LibreTexts][2])

**Verificação guiada:**
Um átomo neutro perde um elétron. O resultado fica relativamente mais positivo, mais negativo ou continua neutro?

**Resposta esperada:** relativamente mais positivo.

---

### 2. Ionizante e não ionizante

**Recuperação:**
Não pergunte primeiro se a radiação é visível, artificial ou intensa. Pergunte: a interação consegue produzir ionização? Essa é a chave classificatória. ([chem.libretexts.org][3])

**Verificação guiada:**
Uma radiação que não possui energia suficiente para produzir ionização é classificada, nesse contexto, como quê?

**Resposta esperada:** não ionizante.

---

### 3. Frequência, comprimento e energia

**Recuperação:**
Use duas setas mentais:

`frequência ↑ → comprimento de onda ↓`

`frequência ↑ → energia do fóton ↑`

Essas relações decorrem de `c = fλ` e `E = hf`. ([Physics LibreTexts][4])

**Verificação guiada:**
Se a frequência cai, o comprimento de onda aumenta ou diminui no vácuo?

**Resposta esperada:** aumentar.

---

### 4. Raios X no espectro

**Recuperação:**
Raios X não são elétrons. Eles pertencem ao espectro eletromagnético e ocupam uma região de frequência elevada, acima do ultravioleta em uma representação simplificada. Raios X e gama podem se sobrepor; a distinção também depende da origem. ([Physics LibreTexts][6])

**Verificação guiada:**
Entre luz visível, raios X e ondas de rádio, qual está na região de maior frequência?

**Resposta esperada:** raios X.

---

### 5. Atenuação como ponte

**Recuperação:**
A pergunta central é: “Quantos fótons continuam no feixe original depois da interação?” Absorção pode removê-los; espalhamento pode desviá-los. ([Medicine LibreTexts][8])

**Verificação guiada:**
Um fóton continua existindo, mas foi espalhado para outra direção. Ele ainda pertence ao feixe que segue exatamente no trajeto original?

**Resposta esperada:** não.

---

## Ciclo 2 — nova tentativa com contexto levemente diferente

### 1. Estrutura atômica e ionização

**Situação:**
Um modelo contém cinco cargas positivas e cinco negativas. Após uma interação, restam cinco positivas e quatro negativas.

**Pergunta:**
O sistema ficou neutro, positivo ou negativo?

**Resposta esperada:** positivo.

**Feedback:**
Uma carga negativa foi removida. Essa é uma forma simples de visualizar a formação de um íon positivo.

**Referências:** S1, S2. ([Chemistry LibreTexts][2])

---

### 2. Ionizante e não ionizante

**Situação:**
A radiação R1 transfere energia, mas não consegue remover elétrons do material considerado. A radiação R2 consegue provocar essa remoção.

**Pergunta:**
Qual das duas é ionizante nessa situação?

**Resposta esperada:** R2.

**Feedback:**
A classificação foi feita pela capacidade de produzir ionização.

**Referências:** S2. ([chem.libretexts.org][3])

---

### 3. Frequência, comprimento e energia

**Situação:**
Dois fótons, M e N, propagam-se no vácuo. N possui frequência menor que M.

**Pergunta:**
Qual deles apresenta maior comprimento de onda e qual possui maior energia por fóton?

**Resposta esperada:**
N tem maior comprimento de onda; M tem maior energia por fóton.

**Feedback:**
Frequência menor corresponde a comprimento de onda maior, enquanto energia por fóton aumenta com a frequência.

**Referências:** S3, S4. ([Physics LibreTexts][4])

---

### 4. Raios X no espectro

**Situação:**
Um estudante recebe quatro cartões textuais: “infravermelho”, “visível”, “ultravioleta” e “raios X”.

**Pergunta:**
Qual cartão deve ficar imediatamente antes de “raios X” numa organização simplificada de frequência crescente entre essas quatro opções?

**Resposta esperada:** ultravioleta.

**Feedback:**
Nesta representação simplificada, ultravioleta vem antes de raios X. A fronteira entre raios X e gama não é usada como gabarito único, pois suas faixas podem se sobrepor.

**Referências:** S5. ([Physics LibreTexts][6])

---

### 5. Atenuação como ponte

**Situação:**
De 100 unidades conceituais de radiação incidentes, o material P permite que uma parcela maior continue na direção original do que o material Q. Nenhum cálculo adicional é necessário.

**Pergunta:**
Qual material apresentou maior atenuação do feixe original: P ou Q?

**Resposta esperada:** Q.

**Feedback:**
Se menor parcela continua no feixe original, houve maior redução desse feixe durante a travessia.

**Referências:** S6, S7. ([Medicine LibreTexts][7])

---

# G. Revisão humana pendente

* [ ] **PENDENTE** — revisão técnica por profissional qualificado em radiologia/física das radiações;
* [ ] **PENDENTE** — revisão editorial em português;
* [ ] **PENDENTE** — revisão de acessibilidade;
* [ ] **PENDENTE** — revisão jurídica das fontes e licença;
* [ ] **PENDENTE** — validação contra o schema real do repositório;
* [ ] **PENDENTE** — aprovação de produto para promoção.

[1]: https://creativecommons.org/licenses/by/4.0/ "Deed - Attribution 4.0 International - Creative Commons"
[2]: https://chem.libretexts.org/Bookshelves/Inorganic_Chemistry/Inorganic_Coordination_Chemistry_%28Landskron%29/01%3A_Atomic_Structure/1.01%3A_Historical_Development_of_Atomic_Theory "1.1: Historical Development of Atomic Theory - Chemistry LibreTexts"
[3]: https://chem.libretexts.org/Bookshelves/General_Chemistry/Chemistry_2e_%28OpenStax%29/zz%3A_Back_Matter/20%3A_Glossary "Glossary - Chemistry LibreTexts"
[4]: https://phys.libretexts.org/Courses/Georgia_State_University/GSU-TM-Introductory_Physics_II_%281112%29/11%3A_Physical_Optics/11.03%3A_The_Wave_Aspect_of_Light-_Interference "11.3: The Wave Aspect of Light- Interference - Physics LibreTexts"
[5]: https://phys.libretexts.org/Courses/Joliet_Junior_College/JJC_-_PHYS_110/College_Physics_for_Health_Professions/30%3A_Introduction_to_Quantum_Physics/30.03%3A_The_Photoelectric_Effect "30.3: The Photoelectric Effect - Physics LibreTexts"
[6]: https://phys.libretexts.org/Courses/Joliet_Junior_College/JJC_-_PHYS_110/College_Physics_for_Health_Professions/24%3A_Electromagnetic_Waves/24.04%3A_The_Electromagnetic_Spectrum "24.4: The Electromagnetic Spectrum - Physics LibreTexts"
[7]: https://med.libretexts.org/Bookshelves/Allied_Health/Radiation_Safety_%28Ballard%29/06%3A_X-ray/6.01%3A_X-ray_Tube_and_Process "6.1: X-ray Tube and Process - Medicine LibreTexts"
[8]: https://med.libretexts.org/Bookshelves/Allied_Health/Radiation_Safety_%28Ballard%29/06%3A_X-ray/6.04%3A_Glossary "6.4: Glossary - Medicine LibreTexts"
[9]: https://openstax.org/books/college-physics-2e/pages/preface?utm_source=chatgpt.com "Preface - College Physics 2e | OpenStax"
[10]: https://openstax.org/books/physics/pages/15-1-the-electromagnetic-spectrum "15.1 The Electromagnetic Spectrum - Physics | OpenStax"
[11]: https://openstax.org/books/physics/pages/15-2-the-behavior-of-electromagnetic-radiation "15.2 The Behavior of Electromagnetic Radiation - Physics | OpenStax"
[12]: https://openstax.org/books/physics/pages/21-2-einstein-and-the-photoelectric-effect "21.2 Einstein and the Photoelectric Effect - Physics | OpenStax"
[13]: https://openstax.org/books/physics/pages/22-1-the-structure-of-the-atom "22.1 The Structure of the Atom - Physics | OpenStax"
[14]: https://chem.libretexts.org/Courses/Furman_University/CHM101%3A_Chemistry_and_Global_Awareness_%28Gordon%29/05%3A_Basics_of_Nuclear_Science/5.04%3A_Ionizing_Radiation_and_Non-ionizing_Radiation?utm_source=chatgpt.com "5.4: Ionizing Radiation and Non-ionizing Radiation - Chemistry LibreTexts"
[15]: https://chem.libretexts.org/Courses/Cleveland_State_University/CHM_151%3A_Chemistry_Around_Us/05%3A_Nuclear_Chemistry/5.03%3A_Ionizing_Radiation_and_Non-ionizing_Radiation?utm_source=chatgpt.com "5.3: Ionizing Radiation and Non-ionizing Radiation - Chemistry LibreTexts"
[16]: https://med.libretexts.org/Bookshelves/Allied_Health/Undergraduate_Diagnostic_Imaging_Fundamentals_%28Burbridge_and_Mah%29/02%3A_Principles_of_Radiation_Biology_and_Radiation_Protection/2.03%3A_Ionizing_Radiation-_Basic_Concepts?utm_source=chatgpt.com "2.3: Ionizing Radiation- Basic Concepts - Medicine LibreTexts"
[17]: https://lme.tf.fau.de/lecture-notes/lecture-notes-me/x-ray-photon-matter-interaction/?utm_source=chatgpt.com "X-ray Photon-Matter Interaction - Pattern Recognition Lab"
[18]: https://med.libretexts.org/Bookshelves/Nutrition/Principles_of_Nutritional_Assessment_3e_%28Gibson_et_al.%29/12%3A_Body_Composition-_Laboratory_Methods_%28Chapter_14%29/12.12%3A_Dual_energy_Xray_absorptiometry_%2814.11%29 "12.12: Dual energy X-ray absorptiometry (14.11) - Medicine LibreTexts"
