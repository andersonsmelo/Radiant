# Product

## Register

product

## Platform

adaptive

## Users

Estudantes de Radiologia, técnicos e tecnólogos da área são o público primário.
Estudam no celular, em blocos de poucos minutos encaixados entre aula, plantão e
deslocamento — raramente sentados diante de um computador com uma hora livre. O
trabalho que querem concluir não é "ler sobre radiologia", é **sustentar o hábito
de raciocinar sobre imagem** até que ele vire reflexo profissional.

Residentes, profissionais em atualização e instituições de ensino permanecem
registrados como público de fase futura. Eles não orientam decisão de tela hoje:
quando uma escolha de design servir a um e prejudicar o outro, o estudante ganha.

## Product Purpose

O Radiant transforma estudo técnico de radiologia em hábito diário, com retenção
de longo prazo. Microlições, prática ativa, revisão espaçada e progressão por
domínio — não por tempo decorrido. Funciona offline, porque o momento de estudo
do usuário nem sempre tem rede.

Ele não substitui curso nem residência. Sucesso é a pessoa voltar amanhã, e
continuar voltando — retenção medida em constância, não em minutos por sessão.

## Positioning

Hábito diário gamificado aplicado a uma área técnica séria. É a tensão que toda
tela precisa sustentar: o laço de engajamento que faz voltar não pode custar o
rigor clínico do conteúdo, e o rigor não pode tornar o retorno penoso. Quando as
duas coisas competirem numa decisão de design, a tela precisa entregar as duas —
não escolher uma.

## Brand Personality

**Preciso, encorajador, moderno.** A precisão vem primeiro e é inegociável: é
conteúdo médico, e a interface nunca deve sugerir mais certeza do que a evidência
sustenta. O encorajamento é o tom do reforço, não do conteúdo — o Pixel apoia sem
infantilizar, e o erro é tratado como informação, nunca como punição. Moderno
significa contemporâneo e cuidado, não enfeitado.

## Anti-references

**Dashboard hospitalar.** Prontuário eletrônico, sistema de gestão clínica,
tabela densa em cinza: frio, burocrático, desenhado para quem é obrigado a usar.
O Radiant é usado por escolha, todo dia, e a interface precisa merecer esse
retorno. Qualquer proposta que aproxime o app da estética de software clínico
obrigatório está errada, por mais "profissional" que pareça.

## Design Principles

**Erro não pune.** Vidas não bloqueiam estudo e feedback de erro é caloroso.
Nenhum mecanismo de gamificação pode transformar errar em custo que desencoraja
tentar de novo — errar é como se aprende raciocínio diagnóstico.

**Rigor primeiro, calor depois.** Quando precisão e simpatia competirem numa
mesma frase ou tela, precisão vence e o calor se acomoda em volta. Copy que soa
acolhedora ao preço de ser vaga está errada.

**Uma identidade, dois comportamentos.** A cara do Radiant é idêntica em iOS e
Android; o comportamento respeita a convenção de cada sistema — voltar, gestos,
safe area, componentes de sistema. Identidade autoral nunca justifica quebrar o
que o usuário já sabe fazer no aparelho dele.

**A sessão tem fim.** Estudo em blocos curtos, com começo e término visíveis. O
produto não persegue tempo de tela: rolagem infinita, isca de engajamento e
métrica de vaidade contradizem o objetivo de constância.

## Accessibility & Inclusion

WCAG 2.1 nível AA como critério de aprovação, não intenção: contraste mínimo de
4,5:1 para texto corrido e 3:1 para texto grande e elementos gráficos
informativos. Toda animação precisa de alternativa sob movimento reduzido —
tipicamente crossfade ou transição instantânea. Elementos interativos e
indicadores carregam rótulo de leitor de tela.

O projeto já sustenta parte disso por contrato automatizado (`test:contrast-contract`
e o contrato de easing do Reanimated). Regra prática que decorre daí: um rótulo
de acessibilidade complementa o texto visível, nunca o substitui.
