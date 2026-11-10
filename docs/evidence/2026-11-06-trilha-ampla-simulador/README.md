# Trilha ampla no simulador — 2026-11-06

Medido em 2026-11-06, às 03:56 (America/Bahia), no simulador "Radiant E2E 17 Pro"
(`E262D4C1-99BE-496B-8567-0291C14E6533`, iOS 26.5), com o cliente de desenvolvimento
instalado e o Metro servindo a branch `claude/conteudo-reinicio-tecnologo` no commit
`1e8725f`. É build Debug: não prova a build de Release.

| Captura | O que mostra |
| --- | --- |
| [01](01.png) | A aula M01.01 abre com a medalha, o cenário e a primeira fala da cena (Duda), "Fala 1 de 3". |
| [02](02.png) | A cena completa, com Duda, Caio e Pixel, e o objetivo da aula. |
| [03](03.png) | O passo de conceito, com o corpo e os pontos-chave. |
| [04](04.png) | A primeira interação, "Passo 3 de 8", com quatro alternativas. |
| [05](05.png) | O retorno de uma resposta errada: Pixel, "Vamos reforçar", a resposta dada, a certa e a explicação daquela alternativa; a vida cai de 5 para 4, com o aviso "Menos 1 vida". |

A trilha nova também foi vista na Estude: unidade "Entrar na profissão e cuidar",
"0 de 13", com a primeira aula liberada (sem captura versionada).

**Não verificado:** o fim da aula e o resumo, o confete, o selo de combo, os sons
(nenhum foi ouvido nem medido pelo log), a conferência, a retomada no meio da aula, as
metas, o texto ampliado, o VoiceOver, o Android e o aparelho físico.

## Prova completa da unidade M01 — 2026-11-07

Medido em 2026-11-07, das 15:31 às 16:09 (America/Bahia), no mesmo simulador e no
mesmo tipo de build (Debug, com o Metro), no commit `f85a68f`, com 20 unidades e 132
aulas. A aula M01.01 foi jogada à mão, com acerto, erro, reforço e as duas conferências.
As outras cinco aulas e conferências foram jogadas por um roteiro do Maestro, gerado
das próprias aulas e fora do repositório. Ninguém leu cada tela dessas cinco aulas.

| O que a lista pedia | Resultado | Evidência |
| --- | --- | --- |
| Jogar uma aula até o resumo | Passou: três estrelas, 5 de 5, +18 XP | [resumo](resumo-confete.jpg) |
| Confete | Passou no resumo, nas conferências aprovadas e na unidade | [resumo](resumo-confete.jpg) |
| Selo de combo | Passou: "5 seguidas" aparece e some em cerca de 2,4 s. O selo de 3 não foi capturado na tela, só o som dele | [selo](selo-combo-5-seguidas.jpg) |
| Conferência reprovada | Passou: 1 de 2, pede reforço e reabre a aula. O reforço dá 2 estrelas, mantém o recorde e não dá XP | [reprovada](conferencia-reprovada.jpg) |
| Conferência aprovada | Passou: confete, +18 XP e abre a aula seguinte | [aprovada](conferencia-aprovada.jpg) |
| Celebração de unidade | Passou: conquista registrada, 13 de 13 marcos, depois "Unidade concluída" com confete | [conquista](conquista-registrada.jpg), [celebração](celebracao-unidade.jpg) |
| Nível | Passou: nível 4 para 6, com "Você subiu de nível" na trilha | [celebração](celebracao-unidade.jpg) |
| Missões | Passou: as três concluídas na rota `/missions`, com +5 XP cada, o que explica o HUD subir 5 além do resumo | Texto lido da árvore de acessibilidade |

### Sons, medidos pelo log

A duração é a que o player registra (`endTime is duration`). Isso prova que o som
tocou, não que é audível nem agradável: essa parte é do dono.

| Som | Arquivo (s) | No log (s) | Vezes | Quando |
| --- | --- | --- | --- | --- |
| `toque` | 0,040 | 0,040 | 68 | Tocar numa opção da aula |
| `erro` | 0,136 | 0,136 | 1 | Resposta errada, 0,33 s antes de `vida` |
| `vida` | 0,188 | 0,188 | 1 | Perda de coração na aula |
| `acerto` | 0,290 | 0,290 | 21 | Resposta certa |
| `sequencia` | 0,373 | 0,373 | 7 | Terceira certa seguida |
| `combo` | 0,450 | 0,425 | 6 | Quinta certa seguida |
| `nivel` | 0,700 | 0,675 | 2 | Subida de nível |
| `fim` | 0,993 | 0,993 | 7 | Fim da aula |
| `unidade` | 1,400 | 1,375 | 1 | Celebração da unidade |

Três durações saem 25 ms menores que o arquivo. A identificação desses três é por
proximidade, porque nenhum outro som tem duração parecida.

### Achados

Os achados 1 e 2 foram corrigidos em código em 2026-11-07 (`476803d`) e vistos no
simulador em 2026-11-08, na seção "Prova da correção" no fim deste arquivo. Os achados 4
e 7 foram corrigidos e vistos no simulador em 2026-11-10. Os outros seguem abertos.

1. **A avaliação não tem som nenhum.** Selecionar, perder coração, reprovar e aprovar
   ficam mudos. O log não registra nada, e `CheckpointScreen.tsx` não emite retorno.
   **Corrigido em código:** a avaliação usa a camada de som da aula. Selecionar soa o
   toque, aprovar soa o fim e reprovar soa o erro, conforme as preferências do aluno.
2. **O coração cai em silêncio na avaliação.** Ele cai ao tocar em "Próxima questão",
   sem dizer qual questão errou. O leitor de tela recebe o anúncio; quem enxerga só vê
   o número mudar. **Corrigido em código:** o aviso "Menos 1 vida", o mesmo da aula,
   aparece ao lado de "Questão N de M" por 2,4 s, e o som da vida toca junto dele. A
   avaliação continua sem dizer qual opção era a certa, como pede a FILA, 35.
3. **O tempo do próximo coração saltou.** O rótulo da trilha dizia "próxima em 6
   minutos" às 16:02 e "próxima em 36 minutos" às 16:03. Às 16:09, ainda dizia 36 e
   mostrava 3 corações, embora o primeiro coração tenha caído por volta de 15:37 e o
   intervalo seja de 30 minutos. Causa não encontrada. Um relógio preso não explica,
   porque `Date.now()` roda a cada renderização.
4. **O último passo da aula repete o retorno.** Depois da fala final, aparece de novo o
   cartão "Resposta correta" da questão anterior, em cinza sobre verde.
   **Corrigido:** o fechamento repetia o retorno da última questão em toda aula que não
   fosse híbrida, e trocava o próprio título e texto por ele. Agora só repete quando é o
   único retorno da aula: uma questão só, que não seja de caso. Na aula 3 de M02, em 2026-11-10,
   o passo 8 de 8 mostrou o próprio título e texto, sem o cartão
   ([captura](aula-fechamento-sem-repeticao.jpg)).
5. **Na associação, o último par não tem escolha.** Sobra uma só opção, e cada par já
   sai verde na hora. O traço longo do texto do par também aparece na tela.
6. **O retorno de acerto repete a mesma frase** em "Sua resposta" e "Resposta certa".
7. **Na avaliação, a medalha ocupa metade da tela** e as opções ficam abaixo da dobra
   na primeira questão, o que exige rolar. A medalha diz "1" mesmo em "Avaliação 6 de 6".
   **Corrigido:** enquanto o aluno responde, a medalha e o texto de abertura saem, e o
   topo diz qual avaliação é ("Avaliação 2 de 6"). Na avaliação 2 de M02, em 2026-11-10,
   a questão, as quatro opções e o botão couberam numa tela só
   ([captura](avaliacao-questao-sem-medalha.jpg)). O "1" ficou: é o número da unidade
   dentro do nível, o mesmo da trilha e do título "Avaliação da unidade 1", e não o da
   avaliação. A medalha continua na abertura e no resultado. Não verificado com texto
   ampliado.
8. **Na conquista, a ponta do balão de fala cobre a primeira letra** de "antes". Visto
   numa captura reduzida, então vale conferir.

### Não verificado

O card de missões na trilha depois de concluídas, a retomada no meio da aula, o texto
ampliado, o VoiceOver, o Android, o aparelho físico e a build de Release. Só a unidade
M01 foi jogada: as outras 19 unidades passaram pelo verificador e pelos testes, mas não
foram abertas no simulador. Os sons não foram ouvidos.

### Piloto de imagens em M08.01, 2026-11-07

No mesmo simulador, com a árvore que virou o commit `f151b06`, aberto direto pela rota
`/learn`, sem liberar a unidade M08.

| Captura | O que mostra |
| --- | --- |
| [comparação](comparacao-m08.jpg) | A radiografia em PA, carregada do pacote do app, com o rótulo neutro. A segunda imagem fica abaixo da dobra, então comparar exige rolar. |
| [retorno](comparacao-m08-retorno.jpg) | A resposta certa com o retorno, que cita o que o acervo descreve. |
| [créditos](creditos-imagens.jpg) | Autoria e licença de cada imagem, aberta a partir dos Ajustes. |

Não verificado: o restante de M08.01 com a troca do item, o toque em "Ver a página de
origem" e o leitor de tela. O item não pode ser respondido de forma justa com leitor de
tela, conforme o parecer.

## Prova da correção de som e aviso de vida na avaliação — 2026-11-08

Medido em 2026-11-08, das 18:23 às 19:01 (America/Bahia), no mesmo simulador, em build
Debug com o Metro, no commit `476803d`. As avaliações 1 e 2 de M02 foram jogadas por
roteiros do Maestro; as aulas antes delas também. Os sons foram medidos pelo log do
processo, como na prova anterior, e não foram ouvidos.

| Ação na avaliação | Som no log | Tela |
| --- | --- | --- |
| Tocar numa opção | `toque`, 0,040 s (18:24:17 e outros) | — |
| Errar a questão 1 e tocar em "Próxima questão" | `vida`, 0,188 s (18:24:24 e 19:00:32) | [aviso](avaliacao-aviso-vida.jpg): "Menos 1 vida" ao lado de "Questão 2 de 2", e o coração do topo vai de 5 para 4 |
| Acertar a questão 2 | nenhum além do toque | o aviso não aparece |
| Enviar com 1 de 2 | `erro`, 0,136 s (18:31:34) | "Reforço necessário antes de tentar novamente" |
| Refazer o reforço e enviar com 2 de 2 | `fim`, 0,993 s (18:49:56) | [aprovada](avaliacao-aprovada-m02.jpg): "Avaliação concluída", +18 XP |

O aviso ficou na tela por cerca de 2,5 s, medido em quadros do vídeo a cada 0,5 s. O
quadro da captura é de um vídeo da tela, porque o Maestro só lê a tela depois que ela
para, e então o aviso já tinha saído.

- **Leitor de tela:** o aviso se apresenta como "Você perdeu uma vida" e esconde o texto
  "Menos 1 vida" de dentro dele, igual na aula. O anúncio ao leitor de tela não foi
  verificado com o VoiceOver ligado.
- **Achado 3, mais um dado:** a vida caiu às 18:24:24, e às 18:33 e às 18:36 o rótulo do
  topo dizia "4 de 5 vidas; próxima em 32 minutos". Com intervalo de 30 minutos, deveria
  dizer cerca de 21 e depois 18. O número passou do intervalo e não mudou em três
  minutos. A causa continua não encontrada.
- **Não verificado:** os sons de ouvido, a vibração, a avaliação com o som desligado nos
  Ajustes, Android, aparelho físico e build de Release.
