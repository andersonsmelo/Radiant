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

### Achados, nenhum corrigido nesta prova

1. **A avaliação não tem som nenhum.** Selecionar, perder coração, reprovar e aprovar
   ficam mudos. O log não registra nada, e `CheckpointScreen.tsx` não emite retorno.
2. **O coração cai em silêncio na avaliação.** Ele cai ao tocar em "Próxima questão",
   sem dizer qual questão errou. O leitor de tela recebe o anúncio; quem enxerga só vê
   o número mudar.
3. **O tempo do próximo coração saltou.** O rótulo da trilha dizia "próxima em 6
   minutos" às 16:02 e "próxima em 36 minutos" às 16:03. Às 16:09, ainda dizia 36 e
   mostrava 3 corações, embora o primeiro coração tenha caído por volta de 15:37 e o
   intervalo seja de 30 minutos. Causa não encontrada. Um relógio preso não explica,
   porque `Date.now()` roda a cada renderização.
4. **O último passo da aula repete o retorno.** Depois da fala final, aparece de novo o
   cartão "Resposta correta" da questão anterior, em cinza sobre verde.
5. **Na associação, o último par não tem escolha.** Sobra uma só opção, e cada par já
   sai verde na hora. O traço longo do texto do par também aparece na tela.
6. **O retorno de acerto repete a mesma frase** em "Sua resposta" e "Resposta certa".
7. **Na avaliação, a medalha ocupa metade da tela** e as opções ficam abaixo da dobra
   na primeira questão, o que exige rolar. A medalha diz "1" mesmo em "Avaliação 6 de 6".
8. **Na conquista, a ponta do balão de fala cobre a primeira letra** de "antes". Visto
   numa captura reduzida, então vale conferir.

### Não verificado

O card de missões na trilha depois de concluídas, a retomada no meio da aula, o texto
ampliado, o VoiceOver, o Android, o aparelho físico e a build de Release. Só a unidade
M01 foi jogada: as outras 19 unidades passaram pelo verificador e pelos testes, mas não
foram abertas no simulador. Os sons não foram ouvidos.
