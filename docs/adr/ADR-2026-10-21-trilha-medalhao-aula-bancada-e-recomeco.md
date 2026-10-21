# ADR — Trilha Medalhão, aula-bancada e recomeço do conteúdo

**Data:** 2026-10-21 (America/Bahia).
**Estado:** aceita.
**Decisor:** Anderson Melo, na conversa de 2026-10-20 e 21. As respostas dele
estão citadas abaixo.
**Autoria do registro:** Claude Opus 5.5 (Anthropic, `claude-opus-5-5`).
**Substitui:** a [ADR da identidade galaxy dark](ADR-2026-07-27-identidade-visual-galaxy-dark.md),
de 2026-07-27, quanto ao mundo visual. A regra de **uma** identidade única no
app continua valendo.
**Relaciona-se com:**
- a [ADR da evolução global sem pilotos](ADR-2026-10-16-evolucao-global-da-trilha-sem-pilotos.md);
- a [ADR da régua de estrelas e da última vida](ADR-2026-10-18-regua-de-estrelas-e-ultima-vida.md);
- a [ADR do motor híbrido](ADR-2026-10-18-motor-hibrido-nas-licoes-legadas.md).

**Desenho:** a [spec](../superpowers/specs/2026-10-21-trilha-medalhao-e-aula-bancada-design.md)
e as pranchetas da [trilha](../design/2026-10-21-trilha-medalhao.html) e da
[aula](../design/2026-10-21-aula-bancada.html).

## Contexto

Visto no simulador iOS em 2026-10-21, na `main` em `bcf1a90`:
- a trilha é uma coluna de cartões de texto sobre o céu escuro;
- a aula é abertura, ideia-chave e múltipla escolha, só em texto.

O dono pediu uma experiência premium e mandou como referência a trilha de um
app de idiomas, com caminho em zigue-zague, nós ilustrados e animados, estrelas
e uma animação até a próxima aula. A pesquisa de 2026-10-21, resumida na spec,
mostrou que os apps que saem do óbvio fazem o aluno manipular o objeto do
domínio:
- o xadrez do Duolingo é cerca de 75% quebra-cabeça no tabuleiro;
- o Brilliant ensina por problemas manipuláveis.

Em radiologia, ninguém faz isso no celular com trilha gamificada.

Foram avaliadas três direções visuais: Constelação, Medalhão e Negatoscópio. A
primeira versão do Medalhão foi rejeitada por "muita cara de IA". A segunda,
com ilustração em três tons, silhueta no bloqueado e ícones desenhados, foi a
escolhida.

## Decisão

1. **Todas as aulas atuais saem, e as novas já nascem com o design novo.**
   "o proximo passo vai ser apagar todas as aulas, e a criação das novas aulas
   ja devem vir com um designer mais premium".
2. **A retirada inclui o conteúdo-fonte das aulas e os validadores ligados a
   ele.** Opção "Tudo, inclusive a fonte", e o currículo novo começa do zero.
   **Antes de apagar, o agente apresenta um inventário com cada caminho marcado
   "sai" ou "fica", e o dono aprova.** A biblioteca de referência (livros,
   extrações, taxonomia e registro de direitos) é decidida nesse inventário.
3. **Quem já estuda recomeça do zero.** Somem o progresso e as revisões das
   aulas antigas, e XP e sequência ficam. Opção "Recomeçam do zero".
4. **Design primeiro, depois o conteúdo.** Opção "Design primeiro". O currículo
   novo **e** o formato de criação das aulas são escolhidos em conjunto com o
   dono, no projeto seguinte: "vamos escolher junto nao so o novo curriculum
   mais o formato de criação das aulas".
5. **O mundo visual é o Medalhão, no app inteiro.** "gostei do B", "V2" e opção
   "App inteiro". Um DESIGN.md novo substitui o "céu navegável", e os tokens são
   refeitos.
6. **O formato da aula é a bancada.** Na maioria dos passos, o aluno opera o
   equipamento e a imagem (kV, mAs, colimação, posicionamento) e não lê
   parágrafos. Resposta: "Sim. Monte o mockup de uma aula no formato bancada" e
   "prossiga".
7. **As animações são produzidas pelo agente**, com qualquer skill, plugin ou
   MCP: "que voce produza pode utilizar quais quer skill, plugin ou mcp".

## Consequências

- **Distribuição:** o pacote acrescenta uma dependência nativa,
  `@shopify/react-native-skia` 2.2.12, a versão do Expo SDK 54. Por isso exige
  build nova do dev client e da loja; uma atualização OTA não o entrega. Build e
  distribuição continuam com o dono.
- **Momento da troca:** nenhuma build de loja sai com dois mundos visuais, com a
  trilha vazia ou com só as aulas de exemplo. Ela sai junto com o primeiro lote
  do currículo novo.
- **Roteiros e testes:**
  - os roteiros Maestro e os testes que dependem das aulas atuais são reescritos
    sobre as novas;
  - os contratos de contraste e o `visual:qa:strict` são remedidos sobre os
    tokens novos.
- **Política do Loop:** remover validadores do `.loop/project.yaml` muda a
  política para todo agente futuro. Por isso entra na mesma aprovação do
  inventário.
- **Loja:** as capturas e o texto mudam, e o texto de loja é decisão do dono.
- **Continuam valendo:**
  - a guarda de `schemaVersion` desconhecido (G7), que protege o aparelho que
    volta para a `1.4.0` depois da troca;
  - primeiro contato sem custo de vida;
  - estrelas pela primeira resposta;
  - o Pixel como mascote.
