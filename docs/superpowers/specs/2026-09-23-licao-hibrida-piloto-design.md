# Lição híbrida — piloto na L1 do Arco 1

**Data:** 2026-09-23
**Estado:** desenho aprovado pelo dono em conversa; **nada implementado**.
**Decisor:** Anderson Melo
**ADR:** [`ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md`](../../adr/ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md)
**Altera:** o contrato de lição da
[spec V3](2026-08-27-radiant-curriculum-v3-design.md) (§5, §5.2, §6 e §7), a
partir das lições no formato híbrido.

## 1. Por que existe

Medido em 2026-09-23. O que o aluno tem na 1.3.1 são 18 aulas legadas com 1 a 3
perguntas cada, todas de múltipla escolha, sem som: `expo-haptics` é usado num
único arquivo e não há biblioteca de áudio. O app tem cinco renderers
(múltipla escolha, hotspot, comparação, associação, ordenação), mas nenhum
conteúdo publicado usa os quatro últimos. O currículo V3 tem mais rigor
pedagógico do que o Duolingo (domínio medido e taxonomia de erros), mas produziu
**uma lição aprovada em quatro semanas**, e a L2 foi reprovada em seis
auditorias.

O dono definiu a prioridade: **o aluno precisa sentir uma lição gostosa de
fazer**, no nível do Duolingo. O gargalo não é a tela, é a forma da lição e o
custo de produzi-la.

## 2. Referência: o que o Duolingo faz e o que tiramos dele

| Dimensão | Duolingo | O que o Radiant adota |
| --- | --- | --- |
| Lição | ~15 itens curtos, feedback imediato, som e vibração | 10–15 itens, uma ação cada, explicação dentro do feedback |
| Erro | O item errado volta no fim da lição | Igual, com variação (outra postura, outro par) |
| Caminho | Linear, com revisão intercalada ([blog](https://blog.duolingo.com/new-duolingo-home-screen-design)) | Já é assim: a trilha decide o próximo passo |
| Custo do erro | Corações; em 2025 viraram energia gasta por exercício, com forte rejeição ([duoplanet](https://duoplanet.com/duolingo-energy-system/), [Class Central](https://www.classcentral.com/report/duolingo-breaks-hearts-for-energy/)) | Só o desafio custa vida; o primeiro contato nunca custa |
| Personagem | Rive com máquina de estados e reação por resposta ([Rive](https://rive.app/blog/duolingo-s-ai-powered-video-call-brings-lily-to-life)) | Fase 2. Na fase 1 o Pixel reage só em momentos-chave |
| Produção | IA para rascunho com revisão humana ([blog](https://blog.duolingo.com/large-language-model-duolingo-lessons/)) | Modelos de exercício por regra + IA para texto + revisão do dono |
| Assunto técnico | Xadrez passou de 1 milhão de usuários ativos por dia em um trimestre ([ETIH](https://www.edtechinnovationhub.com/news/duolingo-rides-ai-momentum-with-fastest-course-launch-and-40-dau-growth-in-q2)) | Evidência de que conteúdo técnico funciona fatiado em passos curtos |

**Não adotamos:** ligas entre pessoas (o contrato de privacidade não admite
comparação entre alunos), energia gasta por exercício e personalização por
modelo treinado em dados de uso (não há coleta).

## 3. Resumo do entendimento

- **O quê:** um formato de lição de 3 a 5 minutos, com 10 a 15 itens curtos,
  uma ação por item, a explicação no feedback e o item errado voltando no fim.
  O ciclo de oito passos do V3 continua como esqueleto, diluído nos itens.
- **Onde:** piloto na L1 do Arco 1 ("O corpo como referência"), cujo conteúdo e
  fontes já foram aprovados no parecer v4.
- **Sensação:** primeiro som e vibração, sobre as microanimações que já existem.
- **Vidas:** itens de primeiro contato nunca custam; desafio e checkpoint custam.
- **Produção:** modelos de exercício com gabarito calculado pelo código, IA para
  texto e o dono como revisor de domínio.
- **Validação:** teste com 3 a 5 pessoas reais antes de escalar.

## 4. Premissas

1. A lição funciona inteira offline; os sons vêm dentro do app.
2. O feedback aparece em menos de 100 ms depois do toque.
3. Nada depende só do som. O app respeita o modo silencioso, Reduce Motion e
   VoiceOver, e tem interruptores de som e de vibração.
4. Nenhuma coleta nova de dados. A avaliação usa teste com pessoas e medidas
   guardadas no aparelho.
5. A lição é calibrada para ~85% de acerto, para ninguém ficar sem vidas.
6. O tempo de revisão do dono limita a produção; por isso ele revisa regras e
   amostras, não item por item.
7. Os sons do piloto vêm de um pacote com licença livre para uso comercial,
   com troca prevista para sound designer depois da validação.

## 5. Desenho

### 5.1 A L1 no formato híbrido

Cerca de 4 minutos: 12 itens mais os que voltam por erro.

1. **Abertura** — um cartão de ~10 s: o mapa corporal e a pergunta da situação
   ("a marca está à esquerda — esquerda de quem?"). Um botão, "Começar".
2. **Primeiro contato** — itens 1 a 4, sem custo de vida. Cada item introduz uma
   ideia pela ação do aluno ("toque no lado direito do paciente"). No erro, a
   linha mediana acende, uma frase curta nomeia a confusão ("você usou o seu
   lado, não o dele") e ele tenta de novo. A remediação por código de erro
   (§5.2 da spec V3) vive aqui, sem tela de explicação separada.
3. **Desafio** — itens 5 a 12, com custo de vida. Variações geradas por regra,
   mudando postura (anatômica, decúbito dorsal, decúbito ventral), vista
   (frente, costas) e par relacional (superior/inferior, medial/lateral,
   proximal/distal, superficial/profundo). Três formatos se alternam: **tocar**
   no corpo, **escolher** entre 2 a 4 opções e **decidir** verdadeiro/falso. O
   item errado volta no fim, variado. Acertos seguidos acendem um contador.
4. **Fim** — uma tela com XP, precisão, tempo e maior sequência de acertos, e a
   síntese ("a referência é o corpo, não você nem a gravidade"). "Continuar"
   nunca fica preso pela celebração.

**Continua valendo:** domínio só com item novo e sem ajuda (os itens do desafio
registram `initial_independent`; quem precisou de ajuda leva revisão para
depois); XP não desbloqueia nada; o VoiceOver oferece as mesmas opções,
numeradas, sem anunciar a resposta. O próximo item entra imediatamente depois
de "Continuar", sem tela de carregamento.

### 5.2 A camada de som e vibração

Uma peça independente do conteúdo. A lição emite eventos; a camada decide o
que toca, vibra ou anima. Serve para qualquer lição, inclusive as legadas.

| Evento | Som | Vibração | Visual / Pixel |
| --- | --- | --- | --- |
| Acerto | "plim" curto e brilhante | leve | pulso verde no item |
| Erro | tom grave e suave | média | tremor do item (já existe) |
| 3 e 5 acertos seguidos | som crescente | dupla | o Pixel aparece e comemora |
| Perda de vida | som discreto de coração | média | animação de perda de coração (já existe) |
| Fim de lição | fanfarra de ~1 s | sucesso | o Pixel celebra; os números sobem |
| Toque em opção | clique quase inaudível | seleção | — |

Regras: seis sons, curtos (< 300 ms, exceto o do fim) e de um mesmo estilo;
pré-carregados na abertura da lição; respeitam o botão de silencioso; dois
interruptores no Perfil ("Sons" e "Vibração"), ligados por padrão; todo evento
tem equivalente visual; com Reduce Motion o Pixel aparece parado.
Tecnologia: `expo-haptics` (já instalado) e `expo-audio`.

### 5.3 Modelos de exercício, IA e revisão

Um **modelo** é uma regra que gera itens. Tem quatro peças: parâmetros,
**gabarito calculado pelo código**, enunciado com lacunas e um feedback por
código de erro.

| Modelo | Varia | Gabarito vem de |
| --- | --- | --- |
| Lateralidade | postura, vista, lado pedido | geometria do mapa corporal |
| Relação anatômica | par de estruturas, relação pedida | tabela curta de pares revisada pelo dono |
| Verdadeiro/falso | derivado dos dois acima | gabarito do item de origem |

**A IA** escreve variações de enunciado, o feedback por código de erro e
alternativas erradas plausíveis. **Nunca decide a resposta.** A saída é um
arquivo de dados que passa por guardas automáticas:

- resposta calculada pelo código;
- item ligado a objetivo e código de erro;
- texto dentro do limite da tela;
- nada copiado das fontes (validadores `content-no-verbatim` e
  `content-source-rights`);
- **validade do que o item pede**: o alvo está dentro da região que o enunciado
  nomeia. É a guarda que faltou na L2, e segue a lição 1 de 2026-09-22 do
  `AGENTS.md`: diferença sem validade autoriza o defeito.

**O dono revisa, uma vez por modelo:** a regra e a tabela de pares; os textos
de feedback por código de erro; uma amostra de ~20 itens gerados. A aprovação
fica registrada pelo hash do arquivo; se o modelo muda, a aprovação cai. A
auditoria independente passa a ser **por arco e por amostra**.

### 5.4 Teste com pessoas e critério para escalar

Build interno (TestFlight e distribuição interna Android), gerado só com
autorização do dono. De 3 a 5 pessoas do público, recrutadas pelo dono; a lista
"Radiant Alpha" do Play é um ponto de partida.

Protocolo, ~15 minutos por pessoa:

1. faz a L1 sozinha, observada ou gravando a tela;
2. responde: de 1 a 5, quão gostoso foi? faria a próxima agora? algo irritou ou
   travou? quando errou, entendeu por quê?
3. no dia seguinte, faz a revisão R1.

Medidas no aparelho, sem envio: tempo por item, acertos e erros por código,
itens que voltaram, vidas gastas, ponto de abandono. Visíveis no console de
desenvolvimento; a pessoa mostra a tela.

| Medida | Meta |
| --- | --- |
| Terminaram sem ajuda | ≥ 4 de 5 |
| Tempo mediano | 3 a 5 min |
| "Faria a próxima agora" | ≥ 4 de 5 |
| Nota de "gostoso" | mediana ≥ 4 |
| Acerto no desafio | entre 75% e 90% |
| Ficaram sem vidas na L1 | ninguém |
| "Não entendi por que errei" | ninguém |

**Passou:** os mesmos modelos e a camada seguem para L2 e L3, e o Arco 1 é
produzido no formato híbrido. **Não passou:** ajustar o formato pelo observado
e testar de novo com outras pessoas antes de produzir qualquer outra lição.

## 6. Impacto no que existe

1. **Vidas.** A regra "só o desafio custa" substitui o item 2 da
   [ADR da 1.4](../../adr/ADR-2026-09-14-1-4-freemium-por-vidas-storekit-e-icloud.md)
   **a partir das lições híbridas**. A 1.4 sai como está. O serviço de vidas
   passa a conhecer o tipo do item (primeiro contato ou desafio).
2. **Spec V3.** §5, §5.2, §6 e §7 passam a apontar para esta spec. A frase "o
   erro não retira vidas" deixa de valer; vale a regra do item 1.
3. **L2.** A v7 fica **pausada** até o resultado do piloto. Se o formato passar,
   a L2 é refeita com modelos (planos de corte gerados por regra). Nada é
   apagado.
4. **L1.** Reaproveita mapa corporal, posturas, landmarks, acessibilidade e
   texto aprovado. Muda a forma de percorrer, não o conteúdo.
5. **1.4.** O piloto não a bloqueia nem depende dela.

## 7. Fora de escopo

Ligas e social; o Pixel em Rive a cada item; animação didática; a frente de
"voltar todo dia"; reformular as 18 aulas legadas (exceto receber a camada de
som, se o dono quiser).

## 8. Registro de decisões

| Decisão | Alternativas consideradas | Por quê |
| --- | --- | --- |
| Prioridade: lição gostosa de fazer | trilha longa e variada; eficácia comprovada; hábito diário | escolha do dono |
| Formato híbrido | estilo Duolingo puro; ciclo V3 polido | ritmo do Duolingo com o rigor do V3 |
| Só o desafio custa vida | todo erro custa (1.4); só o checkpoint custa | não pune o primeiro contato e mantém a barreira do plano gratuito |
| Som e vibração primeiro | Pixel em Rive a cada item; animação didática | barato, sem depender de `.riv`, maior salto de sensação |
| Modelos + IA + revisão humana | só IA com revisão; autoria manual | única via com volume sem perder a verdade técnica |
| O dono revisa o domínio | profissional parceiro; indefinido | escolha do dono |
| Piloto vertical na L1 | motor genérico primeiro; reformar as aulas legadas | prova a sensação com gente real, com o menor esforço, e tudo é reaproveitado |
| Sons de pacote com licença livre no piloto | sound designer; áudio gerado por IA | mais rápido; troca prevista após validação |
| A 1.4 sai como está | mudar o custo de vida já na 1.4 | a 1.4 está perto de sair e as lições dela são as legadas |
| Pausar a v7 da L2 | continuar a v7 | evita gastar uma rodada num formato que pode mudar |

## 9. Perguntas em aberto

- Quais dos cinco renderers entram primeiro, e se faltam tipos (arrastar, tocar
  num ponto do corpo em imagem).
- Se a L2 é refeita inteira no formato híbrido ou só a parte de desafio.
- Quando a camada de som chega às aulas legadas.
