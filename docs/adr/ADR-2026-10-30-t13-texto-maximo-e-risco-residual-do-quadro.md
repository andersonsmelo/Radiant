# ADR — T13: texto máximo com dois corredores e risco residual do quadro

**Data:** 30/10/2026, America/Bahia.
**Estado:** aceita quanto às escolhas G1=A e G3-Q1; implementação e prova
nativa têm estados próprios no [STATUS](../STATUS.md).
**Decisor:** Anderson Melo, neste chat de continuidade da T13.
**Pacote avaliado:** [alternativas concretas G1/G3](../plans/2026-10-30-medalhao-t13-pacote-de-decisao.md),
publicadas em `b1bc3543f74e86f19dbd48644ba92c738d637a2f`.

## Decisão citável

O agente apresentou explicitamente **“Recomendo A + Q1”**, com A preservando
os dois corredores de 64 pt e tratando hifenização/data/lembrete; Q1 aceitando
somente o risco residual do quadro, com nova observação em T18. Anderson
respondeu:

> siga conforme recomendação

Essa autorização resolve a escolha da alternativa A e a aceitação delimitada
Q1. Não é autorização tácita para B, novos builds ou aceite global.

## G1 — alternativa A

1. Preservar os dois corredores laterais de 64 pt, cabeça/medalha/percurso e
   os contratos de fonte, incluindo o teto compartilhado herdado do AppButton.
2. Inserir pontos discricionários de hifenização pt-BR somente na apresentação
   da coluna ampliada. Preservar título canônico e rótulo acessível íntegros.
   Sem redução de fonte, teto novo, truncamento ou reticências em coluna.
3. Permitir que a data se distribua por componentes, mantendo integralmente
   números, separadores, ordem e hora; não exigir a data inteira numa linha.
4. Tornar título/data/CTA/lembrete alcançáveis por rolagem. O lembrete pode
   entrar como rodapé da lista, com identidade e I/O preservados.
5. Aceitar o custo de mais linhas/rolagem. A validade da implementação exige
   testes de geometria/lifecycle e captura nativa normal/AX5/Android200;
   escolher A não prova que a implementação já satisfaz esses critérios.

## G3 — Q1, somente o recorte do quadro

Aceitar explicitamente o risco residual documentado: houve conserto parcial,
uma ocorrência posterior preservada e depois não reprodução em13 rodadas
válidas (9 rastreadas e4 limpas). **Isso não declara o defeito corrigido.**
A causa restante permanece sem observação; não produzir patch de hipótese.

Manter observação em T18. Se reaparecer, preservar quadro/timeline e só então
abrir correção causal com vermelho/verde e revisão independente. A decisão
não encerra arte/acabamento, G3 global, texto máximo ou T13 integral.

## Limites preservados

Sora/Pixel/quatro momentos/ouro/lábio/fingerprint; economia, primeira resposta,
retomada, currículo, storage, M7/A2 e demais gates não mudam. G6 local da T11
não transfere autorização. Sem novo build/install/componentes/EAS/OTA/loja/
merge/dependência/política, relógio/fixture/storage privado ou acesso ao
reservado `5FD8C926-BC5A-4E9E-B5BE-2E080B2ED2A3`.
Capturas podem usar clientes existentes compatíveis, destino explícito e
APIs públicas, com fonte/processos/portas medidos e restaurados.

Esta ADR registra a decisão; resultados e limites de execução ficam na
[evidência da alternativa A](../evidence/2026-10-30-medalhao-t13-a.md).
