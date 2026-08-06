# B8 — Gate 2 item 1: Reduce Motion em iPhone físico — 2026-08-06

- **Data da coleta:** 2026-08-06, 12:21–12:22 (`-03`)
- **Responsável pela execução:** Anderson
- **Alvo:** iPhone físico, build TestFlight `1.3.1 (5)`
- **Resultado:** `passed` — item 1 do Gate 2 fechado no escopo ampliado de
  2026-08-03
- **Código alterado:** nenhum

As capturas ficaram fora do Git, conforme a política desta pasta. Este registro
conserva o que elas mostravam e o que foi observado ao vivo.

## Método — e por que houve uma captura antes de ligar a preferência

O critério deste item não é "nada se mexe"; é **remover o movimento sem apagar
a informação**. Um brilho que serve para distinguir planeta ativo de concluído e
de comum não pode ir a zero sob a preferência — se todos ficarem iguais, a
preferência apagou estado, e isso é defeito.

Julgar isso olhando só o "depois" é impossível: uma tela sóbria parece correta
sozinha. Por isso a coleta começou por **uma captura do mapa da galáxia com a
preferência desligada**, e a comparação é contra ela.

Sequência: captura de base → `Ajustes → Acessibilidade → Movimento → Reduzir
Movimento` ligado → app encerrado e reaberto → mapa da galáxia, interior da
galáxia `Anatomia` e interior do planeta `Cabeça & Pescoço`, com captura de cada
uma.

## Resultado por tela

| Tela | Movimento espontâneo | Distinção de estado preservada |
| --- | --- | --- |
| Mapa das galáxias | nenhum | **sim** — comparação direta com a base |
| Interior de `Anatomia` | nenhum | **sim** — três níveis legíveis |
| Interior de `Cabeça & Pescoço` | nenhum | não aplicável (tela de um mundo só) |

**Mapa das galáxias.** As capturas com e sem a preferência são visualmente
equivalentes: `ANATOMIA` mantém o halo aceso, continua a mais brilhante das
quatro e conserva o selo `EM ANDAMENTO`; `FÍSICA RADIOLÓGICA` segue com brilho
médio e rótulo legível; `CASOS CLÍNICOS` e `TECNOLOGIA EM IMAGEM` seguem
apagadas. O brilho **repousou no valor de descanso do ciclo em vez de ir a
zero**, que é a regra escrita no roteiro.

**Interior de `Anatomia`.** É a tela que decide o critério, porque é onde os
estados coexistem. Com a preferência ligada permaneceram distinguíveis a olho:
`Tórax` aceso e com o selo `8 lições` (ativo), `Cabeça & Pescoço` e `Coluna
Vertebral` disponíveis com halo mais fraco, `Abdômen` e `Membros` com cadeado e
apagados.

**Interação.** Tocar num planeta **abre sem animação** — sem recuo de toque,
sem entrada escalonada. Observado ao vivo; captura estática não prova ausência
de movimento, e é por isso que este item exige humano.

## Cobertura honesta — o que esta passagem NÃO prova

1. **O estado "concluído" não foi exercitado.** Nenhum planeta da conta está
   concluído: `Tórax` está em andamento e `Cabeça & Pescoço` tem `0/0 lições`.
   A distinção verificada foi **ativo × disponível × bloqueado**. Se um planeta
   concluído passar a existir, o critério merece uma passagem nova — o estado
   novo pode colidir visualmente com um dos três já testados.
2. **Ausência de movimento é observação humana**, não medição de ferramenta.
   Não há artefato que a corrobore, e reverificar significa repetir a
   caminhada.
3. Vale só para iOS. O equivalente com TalkBack no Android é a **C5**, aberta.

## Nota lateral, fora do gate

`Cabeça & Pescoço` aparece entre os `3 / 5 mundos disponíveis` e abre com
`0/0 lições` e `🚀 Em breve — conteúdo chegando!`. Não é defeito de
acessibilidade e não afeta este item; fica registrado como lacuna de conteúdo
para quem for decidir a vitrine do beta.
