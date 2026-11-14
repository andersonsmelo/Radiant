# Candidatos a personagem para a 1.6

Proposta da frente F7, de 2026-11-13. **Nenhum dos dois está nas aulas.** O
tipo `LessonCastId` (contrato editorial, da F2) continua com os cinco de
sempre. A entrada depende da decisão do controlador e da frente de conteúdo
(F1).

A arte de cada candidato já existe no padrão da
[bíblia](2026-11-13-biblia-de-personagens.md). Ela fica em
`radiant-app/src/ui/characters/cast/castLooks.ts` (`dentista` e `ultrassom`),
com o registro em `castCandidates.ts`. Passa pela mesma guarda do elenco e
aparece na grade do Storybook ("Personagens/Elenco"), abaixo do elenco.

## Por que dois, e por que estes

A 1.6 abre três unidades: radiologia odontológica, ultrassom e biologia
aplicada. O elenco tem uma docente (Lia), um tecnólogo (Caio), uma colega
(Duda), o guia (Pixel) e o paciente. Falta uma voz que as 132 cenas nunca
precisaram: **o profissional que decide o exame e o executa ao lado do
tecnólogo, com responsabilidade própria.** As cenas publicadas repetem uma lição
("o que você faz, o que você não decide e o que você leva para alguém"). Nas
duas unidades novas, o "alguém" é um profissional que ainda não existe no
elenco:

- **Odontológica.** Quem indica a radiografia intraoral e responde por ela é o
  cirurgião-dentista. O tecnólogo atua na clínica de imagem odontológica:
  panorâmica, telerradiografia e tomografia de feixe cônico. Sem essa voz, a
  cena põe o Caio ou a Lia num consultório odontológico, onde nenhum dos dois
  responde pelo exame.
- **Ultrassom.** O exame é ato médico: quem o executa e laudo é o médico
  ultrassonografista. O papel do tecnólogo ali é preparo, acolhimento e
  organização da sala. Sem essa voz, a cena tende a pôr o transdutor na mão do
  Caio, e isso ensinaria o limite de atuação ao contrário.

**Biologia aplicada não pede voz nova.** É conteúdo de sala de aula, e a Lia (a
docente) e o Pixel (o guia) já cobrem esse lugar nas aulas de física e
anatomia.

## Dra. Iara — cirurgiã-dentista da clínica-escola

**Papel na história.** Cirurgiã-dentista que atende na clínica-escola de
odontologia vizinha ao serviço de imagem. Pede o exame e diz o que precisa ver.
Recebe o estagiário de radiologia na clínica de imagem odontológica.

**Personalidade.** Objetiva, didática, bem-humorada.

**Como fala.** Diz o que precisa ver na imagem, não o nome do exame. Explica com
o dente na mão. Agradece quando o tecnólogo pergunta antes de repetir.

- Certo: "Preciso ver a raiz inteira desse molar, até o ápice. Na panorâmica
  ela fica curta. O que você sugere?"
- Certo: "Boa pergunta antes de disparar. Repetir aqui é dose de novo na
  criança."
- Errado: "Faz qualquer uma, depois eu vejo." Ela nunca terceiriza o critério
  do exame.

**Quando aparece.** Na unidade de radiologia odontológica, em cenas de pedido,
posicionamento intraoral e repetição. **Quando não aparece.** Fora da
odontologia, e nunca como supervisora do estágio (esse papel é da Lia).

**Ficha visual.**
- Proporção: a da grade. A touca descartável cobre o cabelo e é a silhueta
  (de y 9,5 a 24).
- Paleta: `castColors.candidates.dentista`: pele, touca (`cap`), pijama
  lilás (`scrub`, `scrubShade`) e faixa de luz da touca (`hairLight`). A
  máscara usa `pixelColors.coat`.
- Traço: pregas da touca e elásticos da máscara em detalhe (1,2).
- Olhos e boca: os do conjunto comum.
- Identidade sem cor: **touca com pregas, máscara abaixada no pescoço com os
  elásticos e gola em V.**

## Dr. Ravi — médico ultrassonografista

**Papel na história.** Médico que faz os exames de ultrassom do serviço-escola.
É quem segura o transdutor e escreve o laudo. Conta com o tecnólogo para o
preparo da sala e para o acolhimento do paciente.

**Personalidade.** Calmo, preciso, atencioso.

**Como fala.** Fala devagar, nomeia o que o tecnólogo faz bem e marca com
clareza o que é dele ("isso fica comigo"). Com o paciente, explica o gel e o
tempo do exame.

- Certo: "O preparo foi perfeito: bexiga cheia, paciente tranquila. Daqui em
  diante o exame é comigo."
- Certo: "Se ela perguntar o que eu vi, você diz que o laudo sai comigo. Não é
  segredo, é responsabilidade."
- Errado: "Segura aqui o transdutor e vê se acha o fígado." Ele nunca põe o
  exame na mão do tecnólogo.

**Quando aparece.** Na unidade de ultrassom, nas cenas de preparo, sala e
devolutiva ao paciente. **Quando não aparece.** Em cena de raio X, tomografia
ou ressonância, e nunca dando diagnóstico ao paciente diante do estagiário.

**Ficha visual.**
- Proporção: a da grade. Cabelo curto de topo arredondado e barba curta abaixo
  da boca (a barba começa em y 36,5, a boca aberta termina em 35,5).
- Paleta: `castColors.candidates.ultrassom`: pele, cabelo e barba, faixa de luz
  e a camisa escura (`shirt`). O jaleco usa `pixelColors.coat`.
- Traço: lapelas do jaleco em detalhe (1,2).
- Olhos e boca: os do conjunto comum.
- Identidade sem cor: **barba curta, jaleco aberto sobre camisa escura, sem
  óculos e sem crachá.** O jaleco aberto e a barba o separam da Lia, que também
  usa jaleco.

## O que falta para entrarem

1. Decisão do controlador sobre cada um.
2. A frente dona do contrato editorial acrescenta o id a `LessonCastId` e a
   `LESSON_CAST_IDS`. Depois, `CAST` (nome e papel) e `CastAvatar` passam a
   aceitar o id; a arte já existe.
3. A frente de conteúdo escreve as cenas com a ficha acima, e a guarda de
   conteúdo confere as falas.
