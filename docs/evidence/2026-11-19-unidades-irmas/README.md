# Unidades irmãs da trilha dobrada (fase C), evidência

**Medido em 2026-11-19**, na branch `claude/trilha-dobrada-fase-c-lote-1`.
[Plano](../../superpowers/plans/2026-11-19-trilha-dobrada-fase-c-unidades-irmas.md).

A revisão de cada unidade foi feita por um agente de IA (Claude Opus) diferente do
autor (Claude Sonnet). Não é revisão por profissional de radiologia.

## Lote 1

| Unidade | Irmã de | Parecer | Correções na revisão | Texto ou formato antigo | Aulas com passo visual | Famílias |
| --- | --- | --- | --- | --- | --- | --- |
| M17 Segurança do paciente na sala | M01 | [m17.md](m17.md) | 23 | 50,0% | 6 de 6 | 10 |
| M18 Esqueleto, articulações e marcos de superfície | M02 | [m18.md](m18.md) | 12 | 47,9% | 6 de 6 | 10 |
| M19 Eletricidade, tubo e gerador | M03 | [m19.md](m19.md) | 19 | 50,0% | 6 de 6 | 9 |
| M20 Sistemas do corpo em funcionamento | M15 | [m20.md](m20.md) | 17 | 50,0% | 6 de 6 | 9 |

As três colunas da direita saem de `node scripts/content/rtg-inventory.mjs`.

## Lote 2

Na branch `claude/trilha-dobrada-fase-c-lote-2`.

| Unidade | Irmã de | Parecer | Correções na revisão | Texto ou formato antigo | Aulas com passo visual | Famílias |
| --- | --- | --- | --- | --- | --- | --- |
| M21 Radiobiologia e dosimetria | M04 | [m21.md](m21.md) | 18 | 50,0% | 6 de 6 | 11 |
| M22 Processamento, exibição e informática da imagem | M05 | [m22.md](m22.md) | 18 | 50,0% | 6 de 6 | 10 |
| M23 Leitura crítica da imagem | M06 | [m23.md](m23.md) | 20 | 50,0% | 6 de 6 | 11 |
| M24 Membro inferior, pelve e coluna | M07 | [m24.md](m24.md) | 14 | 47,9% | 6 de 6 | 10 |

Gates do lote 2, medidos em 2026-11-19 depois de um render de vídeo alheio terminar
(o `ffmpeg` ocupava a máquina; o gate esperou 8 minutos): app, saída 0, 297 suítes e
4.230 testes; conteúdo e roteiros, 407 de 408 (a mesma falha de ambiente); lotes
gerados e roteiros do Maestro de m21 a m24 conferidos com `--check`. O run do Loop foi
fechado sem `loop validate`, pelo mesmo motivo do lote 1.

Dezessete diagramas novos, conferidos por imagem pelo controlador. Simplificações e
limites conhecidos do lote 2:

- `radiografia-roteiro`, `artefatos-de-objeto`, `artefatos-do-detector`: esquemas
  desenhados de um tórax em PA, não imagens reais. A trança parece uma corrente de
  elos; a linha morta está clara, e em alguns sistemas aparece escura; o corte de
  grade em faixas laterais é descrição do esquema, sem fonte lida.
- `vertebra-tipica`: sem alvo para a lâmina.
- `femur-proximal-e-quadril`: o osso do quadril está muito simplificado.
- `pelve-de-frente`: só o ílio é alvo; ísquio e púbis são cobrados pela cor.
- `dosimetro-no-corpo`: o anel é um aro encostado na mão; o dosímetro sobre o avental
  é um arranjo possível, e a aula diz que o serviço define.
- `histograma-e-lut`: o lado de cada pico depende do sistema; a aula diz "neste esquema".
- Os PNG com alvos da m24 usados na revisão saíram cortados no topo; o controlador
  renderizou o quadro inteiro e conferiu os cinco desenhos.

Limites do lote 2:

- M23.04 e M23.05 usam a bancada, cujo fantoma é um joelho estilizado, numa unidade
  cujos esquemas são de tórax. O texto diz que é um simulador e qual é o fantoma.
- M21: os fatores de ponderação da radiação para partículas não têm valor na aula,
  porque a tabela da ICRP é imagem. Duas páginas (Wikipedia e CDC) ficaram como apoio
  de física sem releitura pelo revisor.
- M22: a frase sobre a lista de trabalho foi conferida pelo controlador na DICOM PS3.4,
  seção K.6.1.1; a nota está no fim do parecer.
- M23: "não culpar" na análise de rejeição é limite da unidade, não frase de fonte.

## Lote 3

Na branch `claude/trilha-dobrada-fase-c-lote-3`.

| Unidade | Irmã de | Parecer | Correções na revisão | Texto ou formato antigo | Aulas com passo visual | Famílias |
| --- | --- | --- | --- | --- | --- | --- |
| M25 Crânio, face e exames no leito | M08 | [m25.md](m25.md) | 20 | 50,0% | 6 de 6 | 9 |
| M26 Exames contrastados e fluoroscopia | M09 | [m26.md](m26.md) | 16 | 50,0% | 6 de 6 | 11 |
| M27 Criança, idoso e gestante na aquisição | M16 | [m27.md](m27.md) | 17 | 50,0% | 6 de 6 | 9 |
| M28 Anatomia seccional II | M10 | [m28.md](m28.md) | 17 | 47,9% | 6 de 6 | 10 |

Gates do lote 3, medidos em 2026-11-19: app, saída 0, 297 suítes e 4.281 testes;
conteúdo e roteiros, 407 de 408 (a mesma falha de ambiente); lotes gerados e roteiros
do Maestro de m25 a m28 conferidos com `--check`. A primeira execução do gate reprovou
no contrato de texto: a licença "CC BY 3.0" em `rtgImages.ts` conta como rótulo em
maiúsculas; a linha de base ganhou um teto de uma ocorrência para esse arquivo. O run
do Loop foi fechado sem `loop validate`, pelo mesmo motivo do lote 1.

Imagens reais (decisão do dono em 2026-11-19, "Radiografias reais"), todas do Wikimedia
Commons, registradas em `content-manifest/rtg-2026/imagens.json`:

| Imagem | Licença | Usada em | O que os itens afirmam |
| --- | --- | --- | --- |
| Crânio de perfil (Tomáš Vendiš; licença dupla GFDL ou CC BY 3.0, usada a CC BY 3.0) | CC BY 3.0 | m25-03 | projeção de perfil, lado para onde a face aponta, marcador de lado |
| Tomografia axial, corte 13 (Mikael Häggström) | CC0 | m28-05, m28-06 | plano; é o corte mais alto dos dois |
| Tomografia axial, corte 33 (mesmo exame) | CC0 | m28-05, m28-06 | plano; é o corte mais baixo dos dois |
| Tomografia coronal (mesmo exame) | CC0 | m28-05 | plano |
| Tomografia sagital (mesmo exame) | CC0 | m28-05 | plano |

As axiais e a coronal foram recortadas para tirar o quadro de localização e as marcas
do visualizador. A ordem dos dois cortes axiais foi estabelecida pelo revisor pela
linha de referência do quadro de localização nos arquivos originais. Não se achou, com
licença CC0 ou CC BY: crânio de frente (só CC BY-SA), exame com bário, urografia e mão
de criança e de adulto (o servidor do acervo recusou os downloads por mais de uma
hora, e uma das candidatas tem licença fora da autorização). Por isso a M25.03 não
compara duas radiografias reais, e a M26.01 e a M27.03 usam só os diagramas.

Dezessete diagramas novos, conferidos por imagem pelo controlador. Simplificações e
limites conhecidos do lote 3:

- `corte-abdome-superior`: o pâncreas inteiro aparece num só corte.
- `corte-pelve`: o púbis aparece no corte das cabeças do fêmur; o espaço entre bexiga
  e reto fica vazio de propósito.
- `coluna-sagital-e-axial`: o corte axial está ampliado em relação ao sagital.
- `trauma-raio-horizontal`: o paciente é visto pela cabeceira, em corte no pescoço; é
  correto, mas abstrato, e o texto da aula explica a vista.
- `sala-de-fluoroscopia-espalhada`: o operador está no fim da mesa porque a vista é
  lateral; nenhum item depende disso.
- `fluoroscopia-pulsada`: a imagem retida aparece só como monitor sempre aceso.
- `contraste-no-corpo`: as cores são convenção do desenho; faltam fígado, duodeno e
  uretra.
- `cranio-de-perfil-ossos`: parietal e maxila repetem o amarelo; do esfenoide só a asa
  maior.
- `colimacao-pediatrica` e `gestante-campo-e-feixe` foram refeitos uma vez (campo
  ajustado largo demais; silhueta que parecia um joelho).

Limites do lote 3:

- M25: fontes fracas (dois guias de estudo entre seis); a distância no leito tem um
  artigo revisado por pares como segunda fonte, e o avental ficou como "a proteção que
  o serviço define". A ordem dos cinco passos no leito é sequência ensinada na aula,
  não frase de fonte.
- M26: "o pedal aciona o feixe" tem apoio indireto de uma fonte; quatro páginas de
  referência foram conferidas por amostragem.
- M27: os limites da imobilização pediátrica apoiam-se numa só fonte, e o texto remete
  ao protocolo do serviço; proteção de contato é "o serviço define".
- M28: três relações da pelve foram conferidas pelo controlador no OpenStax (nota no
  fim do parecer).
- Revisão por IA, não por profissional de radiologia; nada foi visto em simulador ou
  aparelho.

## Gates do lote 1

| Gate | Comando | Resultado |
| --- | --- | --- |
| App | `cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npm run quality` (Node 20) | saída 0; 297 suítes, 4.179 testes |
| Conteúdo e roteiros | `node --test scripts/content/*.test.mjs scripts/qa/*.test.mjs` | 407 de 408; a falha, `register-source`, é da worktree, que não tem o arquivo local do livro piloto, e não entra na lista do CI |
| Lotes gerados | `node scripts/content/build-rtg-batches.mjs --check` | saída 0 |
| Roteiros do Maestro | `node scripts/qa/generate-rtg-maestro.mjs --check m17` (e m18, m19, m20) | ok nos quatro |
| Loop | `loop validate` | não rodado: o validador `app-test` não cabe no prazo de 180 s; o run foi fechado sem validação, como nas fases A e B |

## Diagramas do lote 1

Dezoito diagramas novos, desenhados em código por agentes e conferidos por imagem pelo
controlador, em quadro parado, com os alvos de toque desenhados por cima. O revisor de
cada unidade conferiu de novo cada alvo contra a figura. Simplificações conhecidas:

- `anodo-giratorio`: disco de frente, com o feixe de elétrons desenhado no plano do disco.
- `circulacao-dupla`: coração como retângulo de quatro câmaras; azul é sangue pobre em
  oxigênio e amarelo é rico, porque a paleta não tem vermelho.
- `respiracao-diafragma`: o diafragma desce sem achatar.
- `trato-digestivo`: sem duodeno, vesícula e baço; o estômago não aparece ligado ao
  intestino delgado.
- `osso-longo`: não distingue a ponta proximal da distal.
- `esqueleto-axial-apendicular`: vai até o meio da coxa.
- `coluna-regioes`: sacro e cóccix dividem um alvo; a curva sacral quase não aparece.
- `marcos-de-superficie`: a espinha ilíaca ântero-superior aparece um pouco por fora
  do ponto mais alto da crista.

## Conserto de código

A figura de `hotspot`, `label` e `risk-hunt` animava o diagrama em laço enquanto os
alvos ficavam parados. Agora ela desenha o quadro de pôster. Execução vermelha do
teste, antes do conserto: [`vermelho-figura-parada.txt`](vermelho-figura-parada.txt).

## Limites do lote 1

- Nada foi visto em simulador nem em aparelho. Os roteiros do Maestro foram gerados e
  não foram executados.
- O teste "a irmã é obrigatória" (`rtgExpansionProgress.test.ts`) passou na primeira
  execução, porque a regra de acesso já se comportava assim; ele não foi visto falhar.
- M17: nada é atribuído à OMS, porque o documento de identificação do paciente só
  existe em PDF e não abriu.
- M19: quatro das sete fontes são Wikipedia ou Wikibooks, para fatos de física do tubo
  e do gerador. As páginas do StatPearls caíram em captcha.
- M17.06 e M17.05 saíram diferentes do plano; a razão está no plano e no parecer.
