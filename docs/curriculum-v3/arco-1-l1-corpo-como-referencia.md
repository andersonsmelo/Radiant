# Arco 1 · L1 — O corpo como referência

**Estado:** rascunho local implementado, não publicado. **Pacote:**
`lesson:v3:arc:spatial-orientation:l1-body-reference` · versão `1.0.0-draft`.

Esta ficha registra o conteúdo original e a sua proveniência. Ela não ativa o
currículo V3, não altera o catálogo legado e não é comprovação de revisão em
aparelho.

## Fonte, edição e uso

| ID | Autoridade e edição | Seção consultada | URL | Consultada em | Uso na L1 |
| --- | --- | --- | --- | --- | --- |
| `fipat-ta2-part-1` | FIPAT / IFAA, *Terminologia Anatomica 2, Part 1* | termos 7–12, 18–19 e 32–35 | https://libraries.dal.ca/Fipat/ta2.html | 2026-08-27 | Termos normalizados de lateralidade, direção e profundidade; redação PT-BR é editorial do Radiant, não tradução oficial. |
| `ifaa-fipat-status` | IFAA, FIPAT Anatomical Terminology | status da TA2 | https://ifaa.net/committees/anatomical-terminology-fipat/ | 2026-08-27 | Confirma a TA2 como referência terminológica internacional adotada para a ficha. |
| `apple-hig-accessibility` | Apple, Human Interface Guidelines — Accessibility e VoiceOver | alternativas a gestos, rótulos, Reduce Motion e informação além da cor | https://developer.apple.com/design/human-interface-guidelines/accessibility/ | 2026-08-27 | Contrato de interação e acessibilidade da prévia local. |

As fontes DICOM PS3.3/PS3.17 permanecem registradas para L3. Esta L1 não usa
atributos DICOM para deduzir orientação de imagem, nem apresenta `Patient
Position` como geometria.

## Objetivos e cobertura

| Objetivo estável | Modelo e exemplo | Desafio independente | Erro previsto | Retorno |
| --- | --- | --- | --- | --- |
| `O-L1-lateralidade-corpo-observador` | Linha mediana no corpo à frente do observador | `l1-diagnostic-laterality`, sem XP | `E-LAT-OBS` | `l1-remediate-laterality`, depois `l1-laterality-transfer` |
| `O-L1-referencia-sob-mudanca-de-postura` | Frente/costas em postura anatômica e decúbito | `l1-transfer-posture`, em decúbito ventral | `E-GRV` | `l1-assisted-posture`, depois revisão `review:l1:postura-e-referencia` |
| relações anatômicas | Cabeça/pés, frente/costas, linha mediana, ligação do membro e camadas | `l1-superior-inferior`, `l1-medial-lateral`, `l1-proximal-distal`, `l1-superficial-deep` | `E-REL` | recuperação independente em contexto novo |

O diagnóstico registra uma leitura inicial; não concede XP nem demonstra
domínio. Uma pista ou explicação encaminha para prática assistida. Só uma
decisão correta em item diferente, sem ajuda e com nova postura ou novo par
relacional é registrada como recuperação independente.

## Roteiro editorial original

1. **Situação.** Uma pessoa descreve uma marca na “esquerda da tela”. O modelo
   pergunta: esquerda de quem? A tarefa passa a usar somente o corpo descrito.
2. **Modelo.** A silhueta vetorial mostra linha mediana, ligação dos membros e
   duas camadas. Frente/costas, cabeça/pés e as camadas têm texto, contorno e
   traço próprios; cor nunca é a única pista.
3. **Exploração.** A pessoa pode tocar a região 1, mudar entre frente/costas e
   alternar postura anatômica, decúbito dorsal e ventral. Os landmarks giram e
   espelham no mesmo plano do SVG e o toque seleciona a mesma alternativa dos
   cartões textuais; a confirmação é deliberadamente separada. Cada controle
   altera estado observável; o movimento de troca de vista é curto e o mesmo
   estado final aparece sem animação quando Reduce Motion está ativo.
4. **Diagnóstico.** A lateralidade é perguntada por opções numeradas, sem dica
   e sem XP. A descrição acessível não anuncia a alternativa correta.
5. **Feedback e remediação.** Se houver troca entre corpo e observador, a
   explicação recupera a linha mediana e oferece uma prática guiada. Se houver
   troca com gravidade, ela diferencia “frente do corpo” de “lado que está para
   cima” na postura mostrada.
6. **Transferência.** Em decúbito ventral, a pessoa identifica a superfície
   anterior sem reutilizar o enunciado do diagnóstico. A postura mudou; a
   referência anatômica não.
7. **Síntese e revisão.** A L1 resume referência anatômica, lateralidade do
   corpo e independência da gravidade. R1 recupera em postura diferente após
   dois nós; R2, após cinco a oito nós, em contexto de imagem novo.

## Ativo e acessibilidade

O mapa é SVG criado no código desta entrega: não há fotografia, ilustração de
terceiro, pessoa identificável ou derivação de figura da TA2. A área tocável de
região tem pelo menos 44 pt; todos os comandos de toque têm controles nomeados
para VoiceOver. Os rótulos expõem a vista, a postura, a seleção e a função do
controle, mas não o gabarito dos desafios. A alternativa textual usa o mesmo
conjunto de opções numeradas do modelo visual.

## Auditoria independente da implementação

- **Pré-auditoria (2026-08-27):** critérios e fontes entregues pelo auditor
  independente; nenhum teste, inspeção visual, VoiceOver ou aparelho foi
  executado por ele nesta etapa.
- **Parecer v1 (2026-08-27): reprovado.** O auditor encontrou quatro P0:
  geometria sem mudança real de postura/vista, opções corretas inalcançáveis,
  trilha correta interrompida e domínio atribuído após ajuda sem item novo. A
  versão v2 ligou opções a landmarks SVG, percorreu todos os objetivos e passou
  a exigir recuperação nova por objetivo.
- **Pareceres v2 e v3 (2026-08-27): reprovados e corrigidos.** Eles apontaram,
  respectivamente, que landmarks não acompanhavam a transformação do SVG nem
  selecionavam a alternativa, e que o VoiceOver não recebia a descrição espacial
  útil; também impediram repetir a segunda recuperação como domínio.
- **Parecer v4 (2026-08-27): aprovado.** Sem achados acionáveis na revisão
  estática final de conteúdo, fontes, equivalência visual/textual, fluxo de
  remediação e rótulos acessíveis. O auditor não executou testes, Storybook,
  inspeção visual/runtime, VoiceOver ou validação em aparelho.

## Limites preservados

- Não chamar `prepareV3()` nem conectar esta prévia a rota, catálogo ou
  `getPublishableManifest()`.
- Não usar XP ou repetição imediata como evidência de domínio.
- Não chamar os indicadores do mapa de eixos.
- Não afirmar que testes automatizados, Storybook ou este documento validam
  acessibilidade, equivalência de dificuldade ou qualidade científica em
  aparelho.
