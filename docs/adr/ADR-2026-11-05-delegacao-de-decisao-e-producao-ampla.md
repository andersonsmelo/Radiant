# ADR 2026-11-05 — Delegação de decisão e produção ampla da trilha

**Data:** 2026-11-05, 19:27 (America/Bahia). **Decisor:** Anderson Melo, na conversa
com o Claude. **Vigência:** de 2026-11-05 até o fim de 2026-11-06, ou até o dono
revogar. **Executor:** Claude (Fable 5.1), com subagentes.

## Contexto

Em 2026-11-05 a loja tinha a `1.4.0`, com 18 aulas antigas. A branch
`claude/conteudo-reinicio-tecnologo` continha o redesenho Medalhão inteiro (PR #66,
aberta) e a retirada de todo o conteúdo antigo, com cinco aulas-piloto escritas e
nenhuma ativa para o aluno. A ativação dependia de revisão independente por pessoa
ou por IA que não o Claude, de seis aceites por hash e de decisões do dono em fila.
O dono descreveu o estado como "emperrado sem fluir".

## O que o dono disse

Trechos da mensagem de 2026-11-05, transcritos como foram escritos:

> "de hoje ate amanha toda a minha capacidade de maquina e tokens vai ser voltados so
> pra isso, preciso que voce crie uma trilha de aulas quizes e outras coisas precisamos
> de um app realmente profissional nossa referencia de aplicativo e o duolingo e
> semelhantes, vamoos utilizar a ementa do curso de tecnolog em radiologia e suas
> especializações e vamos criar uma ordem logica de trilha, nosso app deve ter micro e
> macro interações efeito sonoros dialogos personagens"

> "nossas fontes de criação devem ser todas gratuitas e voce tem autorização para criar
> o conteudo apartir de pesquisas, tambem tem autorização para criar quantos subagentes
> achar necessario"

> "não faça perguntas desnecessarias voce tem autorizadade nas tomadas de decisão
> visando a construção, melhoria e ampliação do aplicaivo, tudo deve ser devidamente
> documentado"

## Decisão do dono

1. **Delegação.** Durante a vigência, o Claude decide produto, conteúdo e engenharia
   para construir, melhorar e ampliar o app, sem perguntar antes.
2. **Conteúdo por pesquisa.** O Claude está autorizado a escrever as aulas a partir
   de pesquisa em fontes gratuitas.
3. **Subagentes.** Sem limite de quantidade.
4. **Documentação.** Tudo o que for feito fica registrado no repositório.

## O que o Claude decidiu sob essa delegação

Estas escolhas são do Claude, não palavras do dono. Cada uma pode ser revertida por
ele.

1. **Revisão por IA independente substitui os aceites pendentes.** Cada unidade é
   escrita por um agente e revista por outro, que não viu a redação e confere os
   fatos em fontes públicas. Os seis registros de aprovação do lote continuam
   existindo e são preenchidos com o papel real: revisão por IA sob delegação desta
   ADR. Isso não é revisão por profissional de radiologia nem aprovação clínica.
2. **O piloto com alunos (PC07) deixa de ser condição da produção (PC08).** A
   medição com alunos passa a acontecer depois, com o app em uso.
3. **Fonte de consulta entra no contrato.** Além de material CC BY 4.0, o contrato
   passa a aceitar `factual-reference`: a fonte sustenta o fato, a redação é
   original e nenhum trecho é reproduzido. Vale para normas (Anvisa, CNEN, CONTER),
   páginas institucionais e material de licença restrita. Continua proibido adaptar
   a expressão de material NC ou SA, usar PDFs locais e copiar questões.
4. **A aula passa a ter várias interações.** O contrato amplo aceita de 3 a 8
   interações por aula e as famílias múltipla escolha, caso com decisão, ordenação
   e associação. O contrato v1 e a extensão `pilot` não mudam.
5. **Ativos.** Nesta etapa, só diagramas autorais. Baixar imagens radiográficas de
   acervos abertos fica fora até o dono autorizar de forma explícita.
6. **Elenco.** As aulas ganham diálogo com Pixel, Profa. Lia, Caio, Duda e pacientes
   simulados com nome fictício.

## Complemento de 2026-11-06 — imagens de acervos abertos

**Decisor:** Anderson Melo, na conversa, em 2026-11-06, por volta das 09:50
(America/Bahia). O Claude perguntou: "Autoriza baixar radiografias de acervos abertos
(Wikimedia Commons, CC0 ou CC BY) para a trilha?". A resposta foi: "Autorizo".

Isto encerra o item 5 de "O que o Claude decidiu", que deixava as imagens fora até
essa autorização. O alcance, lido do que foi perguntado:

- **Coberto:** baixar radiografias de acervos abertos, com licença CC0 ou CC BY
  conferida na página de cada arquivo, para uso na trilha do Radiant.
- **Não coberto:** CC BY-SA, licenças NC ou ND, Radiopaedia, os PDFs locais, imagem
  com identificação de paciente visível e qualquer uso fora da trilha.
- **Continua obrigatório:** crédito de autor e licença por arquivo, registro da
  origem e do hash, e uma tela de créditos no app antes de qualquer release com
  imagem CC BY.

Nenhuma imagem foi baixada nesta data. **Em 2026-11-07,** o piloto usou duas imagens CC0,
abaixo da meta de 6 a 10, e a vigência desta delegação já tinha terminado: o trabalho
seguiu pela lista que o dono deixou no prompt de continuidade, e a ampliação fica com
ele. O procedimento está no
[prompt de continuidade](../superpowers/handoffs/2026-11-06-trilha-ampla-prompt-de-continuidade.md#imagens-radiográficas--autorizado-em-2026-11-06).

## O que não muda

- Build, envio à loja, texto da loja, merge na `main` e gasto de dinheiro continuam
  com o dono, como na política de decisão da [FILA](../FILA.md).
- A retirada do conteúdo antigo só chega à `main` junto com o conteúdo novo
  (decisão 6 do PC03-A).
- Nenhum validador é desligado. O ritual do Loop continua.
- Nenhum dado de paciente real. O aluno é sempre estudante em simulação
  supervisionada: sem diagnóstico, conduta, escolha de exame ou cálculo de dose
  para paciente.
- As amostras aposentadas não voltam.

## Riscos aceitos e como aparecem

- **Nenhuma pessoa da área revisou o conteúdo.** O app, a loja e o material de
  venda não podem dizer "revisado por especialista". Uma revisão por amostragem,
  feita por tecnólogo ou docente, é recomendada antes de campanha paga.
- **Volume alto em pouco tempo.** O verificador de forma barra os defeitos
  conhecidos (correta mais longa, posição fixa, retorno repetido, resposta
  constante). Erro de fato só a revisão pega, e ela é por IA.
- **Sem imagem radiográfica real.** A trilha desta etapa ensina com texto, cena e
  diagrama autoral.

## Onde está o resto

- Plano de execução:
  [`plans/2026-11-05-radiant-trilha-ampla-e-engajamento.md`](../plans/2026-11-05-radiant-trilha-ampla-e-engajamento.md).
- Guia de autoria: [`content/2026-11-05-guia-de-autoria-rtg-2026.md`](../content/2026-11-05-guia-de-autoria-rtg-2026.md).
- Mapa curricular: [`plans/2026-11-02-planejamento-conteudo-radiant.md`](../plans/2026-11-02-planejamento-conteudo-radiant.md).
- ADR que esta complementa:
  [reinício do conteúdo](ADR-2026-11-02-reinicio-conteudo-e-foco-tecnologo.md).
