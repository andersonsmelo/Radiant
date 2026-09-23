# Radiant 1.4 — Fluxo do usuário e padrão de robustez

**Data:** 2026-09-14 · **Decisor:** dono do projeto · **Autor do desenho:** agente,
em sessão de brainstorming com o dono · **Estado:** aprovado seção a seção;
aguarda revisão do texto antes do plano.

## 1. Contexto

A 1.3.1 (11) foi aprovada e liberada na App Store em 2026-09-14. Ela é o app
legado corrigido: 16 lições geradas, sem painel decorativo, com alternativas
embaralhadas e sem formulário de conta. Tudo o que a Apple leu e aprovou
afirma: **funciona offline, sem conta, não coleta dados, é educacional e não
diagnostica.**

A 1.4 é a primeira versão desenhada para não decepcionar quem paga. Esta spec
cobre **o fluxo do usuário e o padrão de robustez**. Ela é o primeiro de cinco
sub-projetos decididos em 2026-09-14, nesta ordem de dependência:

1. **Fluxo do usuário** — esta spec.
2. Conta e assinatura — *absorvido por esta spec* (seções 6 e 7), porque as
   decisões tomadas os reduziram a um serviço e um interruptor.
3. V3 na tela — J3 (resto do Arco 1), J4 (acessibilidade), J5 (corte seguro).
   Spec própria; a [spec do V3](2026-08-27-radiant-curriculum-v3-design.md)
   e a [ADR](../../adr/ADR-2026-08-27-curriculo-v3-trilha-continua.md)
   continuam valendo.
4. Sistema de desenho — tokens, componentes, estados. Spec própria.
5. Robustez de infraestrutura — testes em aparelho, E2E, orçamentos. O padrão
   está na seção 8 desta spec; a execução entra no plano de cada sub-projeto.

### 1.1 Decisões herdadas, não reabertas

- Produto: treinamento contínuo em radiologia, público geral, sem rótulos de
  perfil (spec V3 §2).
- Topologia: duas abas — **Estude** (a trilha contínua) e **Perfil**
  (ADR 2026-08-15). Nenhuma superfície nova além das obrigatórias.
- Liga como métrica local; sem comparação entre alunos (ADR 2026-08-15).
- Meta diária em XP (ADR 2026-08-13).
- Login e assinatura são 1.4, não 1.3.x (decisão de 2026-09-11).

### 1.2 Decisões desta spec, na ordem em que foram tomadas

| # | Decisão | Escolhido | Alternativas descartadas |
| --- | --- | --- | --- |
| 1 | Modelo de negócio | **freemium** | assinatura obrigatória; grátis até o V3 completar |
| 2 | Barreira gratuita | **por ritmo — vidas** | por conteúdo (1º arco grátis); por recurso; por minutos |
| 3 | Unidade do ritmo | **5 vidas que se recuperam com o tempo**; assinante ilimitado | N lições/dia; minutos/dia |
| 4 | Papel da conta | **opcional, só para guardar progresso** | obrigatória para assinar; obrigatória para todos |
| 5 | Primeiro uso | **boas-vindas → L1**, sem escolhas | meta diária antes; diagnóstico de posicionamento |
| 6 | Retorno com revisões | **a trilha decide: revisão devida vira o nó PRÓXIMO** | cartão "hoje"; aba Revisar |
| 7 | Forma do dia | **A · Trilha soberana** | B · Sessão guiada; C · Trilha + Praticar |
| 8 | Assinatura | **StoreKit 2 direto, sem trial** | RevenueCat; trial de 7 dias |
| 9 | Guardar progresso | **iCloud (CloudKit, banco privado)** | conta própria com e-mail + código |
| 10 | Diagnóstico de falhas | **Sentry ligado, configuração mínima** | continuar inerte |

Uma ressalva registrada na decisão 2 e aceita pelo dono: um limite diário é um
ritmo que não é o do aluno, e "estude no seu ritmo" está na loja. A escolha da
unidade (vidas) suaviza isso — quem acerta não é limitado — e a revisão nunca
consome vida.

## 2. Regra de ouro

**Toda tela de estudo funciona sem rede, sem conta e sem assinatura.** Rede e
dinheiro existem em exatamente três lugares — a folha de vidas, a tela de
assinatura e o cartão de backup — e nenhum deles é obrigatório para estudar.
É o que mantém verdadeira cada frase que a Apple já aprovou.

## 3. Mapa de telas

Legenda: **muda** = existe hoje e é alterada · **nova** · **fica** = existe e
não muda nesta spec.

### 3.1 Entrada

| Tela | Estado | O que muda | Estados a tratar | Vai para |
| --- | --- | --- | --- | --- |
| Boas-vindas (3 telas) | fica | — ; "Rever apresentação" continua no Perfil | — | L1 (Começar) · Trilha (Pular) |
| Abertura do app | muda | roda migração de armazenamento com backup | `carregando` (esqueleto até o progresso local ler) · `armazenamento corrompido` (restaura backup; nunca apaga em silêncio) · `migração` (barra se > 1 s) | Boas-vindas (1ª vez) · Trilha |

### 3.2 Estude

| Tela | Estado | O que muda | Estados a tratar | Vai para |
| --- | --- | --- | --- | --- |
| Trilha | muda | o nó PRÓXIMO é decidido pelo motor (§4); cabeçalho ganha vidas com relógio de recuperação; lista virtualizada | `tudo concluído` ("novo arco em breve"; revisões e checkpoints seguem vivos) · `offline` (idêntico) · `vazio` é impossível por desenho | Lição · Revisão · Checkpoint · Folha de vidas (toque nos corações) |

### 3.3 Nós

| Tela | Estado | O que muda | Estados a tratar | Vai para |
| --- | --- | --- | --- | --- |
| Lição (4 passos) | muda | errar consome 1 vida (só em lição nova); em 0 vidas no meio, a lição **pausa, não perde** | `retomada` (voltou no passo em que parou) · `sem vidas` · `conteúdo indisponível` (tem tela, não deve ocorrer) | Conclusão · Folha de vidas · ✕ Trilha (progresso salvo) |
| Conclusão ★★★ | muda | ganha "próxima revisão em N dias" quando o SM-2 agendou | — | Trilha |
| Revisão (SM-2) | muda | **nunca consome vida**; errar reagenda | `nada devido` (não é PRÓXIMO) · `N devidas` (contador no nó) | Trilha |
| Checkpoint | fica | consome vida como avaliação | — | Recompensa → Trilha |

### 3.4 Barreira

| Tela | Estado | Conteúdo | Estados a tratar | Vai para |
| --- | --- | --- | --- | --- |
| Folha de vidas | nova | folha sobre a tela atual, nunca uma página. Sempre as três saídas: **Esperar** ("próxima vida em N min") · **Revisar** (faz uma revisão devida, ganha +1) · **Assinar** | `sem revisão devida` (a saída 2 **some**, não desabilita) · `offline` (assinar indisponível, com o motivo) · `assinante` (a folha nunca aparece) | volta · Revisão · Assinatura |
| Assinatura | nova | o que desbloqueia (vidas ilimitadas — e só isso, escrito assim), preço mensal e anual da Apple, período e renovação por extenso, Restaurar compras, termos, privacidade, como cancelar | `carregando preços` · `loja indisponível` · `compra pendente` (Ask to Buy) · `já assinante` · `restaurado` · `cancelada` | volta para onde estava |

### 3.5 Perfil

| Tela | Estado | O que muda | Estados a tratar | Vai para |
| --- | --- | --- | --- | --- |
| Perfil | muda | cartão **Vidas** ganha relógio e "assinante: ilimitadas"; cartão **Backup no iCloud** (novo, §7); cartão **Assinatura** (estado + gerenciar/restaurar); some qualquer palavra de infraestrutura | `sem backup` · `backup ativo com data` · `backup com erro` (informa, não bloqueia) · `assinante` · `assinatura expirada` | Backup · Assinatura · Rever apresentação |

### 3.6 Transições que cruzam áreas

| Evento | Comportamento |
| --- | --- |
| Notificação de lembrete | abre direto no nó PRÓXIMO (deep link), não na trilha genérica |
| Vidas chegam a 5 | notificação opcional "suas vidas voltaram", só se o aluno saiu por falta de vidas |
| Assinatura confirmada | cabeçalho troca corações por ∞; folha nunca mais aparece; Perfil mostra "gerenciar" |
| Assinatura expira ou é reembolsada | volta a 5 vidas cheias, nunca a zero; Perfil mostra "renovar" |
| Backup ligado com progresso local | sobe o local; nunca substitui por nuvem vazia |
| Reinstalação com iCloud ativo | desce o progresso na abertura, antes das boas-vindas; boas-vindas não aparecem se há progresso |
| Erro de rede | só Assinatura e Backup mostram erro, e sem bloquear o resto |

## 4. O motor do próximo nó

Serviço puro `NextNodeResolver`. Entrada: fotografia do estado (progresso
local, agenda do SM-2, estrutura do currículo). Saída: um nó e um motivo.
**Não lê rede, conta nem assinatura.** Roda ao abrir a trilha, ao abrir
qualquer nó e ao voltar de qualquer tela.

Quatro degraus, em ordem; o primeiro que se aplica vence:

| # | Condição | PRÓXIMO | Consome vida |
| --- | --- | --- | --- |
| 1 | há lição pausada | ela, no passo em que parou | já contou |
| 2 | há revisão devida (`dueAt ≤ agora`) | a mais vencida; nó mostra "N devidas" | nunca |
| 3 | há checkpoint destravado | o checkpoint | sim |
| 4 | senão | próxima lição não concluída na ordem do currículo | sim |

O motor **recomenda, não tranca**: os demais nós disponíveis continuam
tocáveis. O motivo aparece como legenda no nó ("revisão devida", "continuar de
onde parou"). Empates: duas revisões devidas → a mais vencida; revisão devida e
lição pausada → a pausada (degrau 1). "Tudo concluído" é um estado legítimo —
os degraus 2 e 3 seguem vivos sem o 4.

A tabela é a suíte de testes, linha a linha, com relógio injetado.

## 5. A economia das vidas

Serviço puro `HeartsService`. Estado persistido:
`{ count, lastRefillAt, unlimitedUntil }`. Operações: `spend`,
`refillByTime`, `rewardReview`, `setUnlimited`. Cabeçalho e folha só leem.

### 5.1 Estados

| Estado | Vidas | Comportamento |
| --- | --- | --- |
| CHEIA | 5 | inicial de toda instalação; nenhum relógio corre; destino da assinatura expirada |
| RECUPERANDO | 1–4 | relógio conta a próxima; cabeçalho mostra "♥3 · +1 em N min"; estudo normal |
| VAZIA | 0 | lição nova e checkpoint bloqueados; **revisão livre**; a folha aparece no momento do bloqueio, não antes |
| ILIMITADA | ∞ | assinante ativo; corações somem; folha nunca aparece; errar não custa |

### 5.2 Transições

| Evento | Efeito |
| --- | --- |
| errar em lição nova ou checkpoint | −1; só a primeira resposta de cada pergunta conta |
| tempo passa | +1 a cada `REFILL_MIN`, até 5; calculado na abertura de qualquer tela a partir de `lastRefillAt`, nunca por timer em segundo plano |
| concluir uma revisão devida | +1 (até 5); **uma vez por revisão concluída**, não por cartão |
| assinatura confirmada | → ILIMITADA, de qualquer estado |
| assinatura expira ou é reembolsada | → CHEIA |
| atualização 1.3.1 → 1.4 | começa em CHEIA; as vidas de hoje são decorativas, nada a migrar |
| relógio do aparelho volta | "zero tempo passou": não desconta nem dá |
| relógio do aparelho pula à frente | ganha até CHEIA — que é o teto. **Brecha aberta de propósito**: sem servidor não há arbitragem, e o custo de um aluno grátis burlar vidas é zero. Com o backup no iCloud, `lastRefillAt` sincroniza, mas continua sendo relógio de aparelho; a decisão fica registrada aqui |

### 5.3 Constantes

| Constante | Valor inicial | Razão |
| --- | --- | --- |
| `MAX_HEARTS` | 5 | já é o número na tela |
| `REFILL_MIN` | 30 | uma lição inteira errada (4 erros) custa duas horas ou uma revisão. Generoso de propósito; apertar depois é mais fácil que soltar. Um número num arquivo de configuração |
| `REVIEW_REWARD` | 1 | mantém "revisar" útil sem esvaziar a assinatura |

## 6. A assinatura

**Produto.** Um grupo, "Radiant Ilimitado"; dois planos auto-renováveis,
mensal e anual. Desbloqueia **vidas ilimitadas — e só isso, escrito assim**.
Nenhuma promessa de conteúdo exclusivo enquanto ele não existir. **Sem trial
na 1.4**; entra como experimento quando houver base para medir. Preço: definido
pelo dono no App Store Connect antes da submissão; esta spec não fixa valor.

**Técnica: StoreKit 2 direto, por módulo Expo local em Swift, sem backend e
sem terceiro.** *(Emendado em 2026-09-23 pela
[ADR do módulo local](../../adr/ADR-2026-09-23-storekit-modulo-expo-local.md):
o texto original dizia `expo-iap`, que é um terceiro no caminho da compra.)* O
motivo decisivo é declarativo, não financeiro: a transação fica entre o
aparelho e a Apple, e as Privacy Labels **continuam "Dados não coletados"**
para quem assina. RevenueCat obrigaria a declarar histórico de compras e
identificador coletados por terceiro, e a reescrever a resposta à Apple e a
tela de boas-vindas.

**Direito de uso offline.** `SubscriptionService` lê
`Transaction.currentEntitlements` na abertura (local, sem rede) e grava
`unlimitedUntil` no `HeartsService`. Sem rede por dias, o cache vale até a
data; passada a data sem releitura → CHEIA, nunca VAZIA. Nunca há um "verifique
sua assinatura" bloqueando estudo.

**Exigências da Apple na tela (3.1.2):** preço e período por extenso, o que
renova e quando, Restaurar compras, links de termos e privacidade, como
cancelar (Ajustes do iOS).

**Fora do app, do dono:** produto de assinatura criado no App Store Connect;
**acordo de apps pagos aceito** (hoje só o gratuito está — o e-mail de
aprovação lembrou); Privacy Labels sem mudança por esta seção.

**Testes:** arquivo de configuração StoreKit no Xcode (compra sem loja,
renovação acelerada); sandbox no TestFlight; `HeartsService` com direito
injetado — ILIMITADA → CHEIA testada sem esperar um mês.

## 7. Backup no iCloud

**Escolha: CloudKit, banco privado do usuário.** Sem backend próprio, sem
e-mail, sem conta a criar ou excluir. A Apple não considera o banco privado do
usuário como coleta do desenvolvedor: **Privacy Labels continuam "Dados não
coletados"**, e a LGPD não encontra dado pessoal na mão do projeto.

**O que se guarda:** nós concluídos, agenda do SM-2, XP, sequência,
`lastRefillAt`. Um JSON pequeno (< 100 KB). Conteúdo não sincroniza.

**Serviço:** `ProgressSyncService` com `push(snapshot)` a cada conclusão de nó
e `pull()` na abertura. **Conflito: mescla, nunca apaga** — união de
concluídos, agenda mais recente por nó, maior XP e sequência, `lastRefillAt`
mais recente.

**No Perfil:** o cartão que saiu na 1.3.1 volta como **"Backup no iCloud"** —
um interruptor, a data do último backup, e um estado de erro que informa sem
bloquear. Nenhuma outra tela menciona backup.

**O que esta escolha não dá, e por quê é aceitável na 1.4:** não cobre
Android (precisa de outro caminho quando houver app Android) e não cria
relação com o cliente (o projeto não sabe quem assina). Os dois são motivos
legítimos para uma conta própria — em uma versão em que existam assinantes
para conhecer e um Android para sincronizar. Infraestrutura de contas para
clientes que ainda não existem fica fora.

**Risco nomeado:** o módulo de iCloud não é do Expo; entra por plugin de
configuração e exige o entitlement do iCloud no perfil de assinatura — o
próximo build pede credencial nova no EAS. Estimativa: um dia de infra.

## 8. Padrão de robustez — o que toda tela cumpre

1. **Quatro estados, desenhados e testados:** carregando (esqueleto, nunca
   branco), vazio (com a próxima ação), erro (o que aconteceu + o que fazer, na
   voz do Pixel), offline (igual ao normal onde nada depende de rede; explícito
   onde depende). A tabela tela × estado desta spec (§3) vira testes de tela
   **na configuração de produção** — a lição do formulário de login da 1.3.1.
2. **Persistência com contrato:** `schemaVersion` no armazenamento; migrações
   em ordem, com backup antes e recuperação se falhar; corrompido → restaura o
   backup ou começa limpo **avisando**. Testado com fixtures reais da 1.3.1.
3. **Acessibilidade medida:** rótulo de VoiceOver em todo controle; Dynamic
   Type até "grande" de acessibilidade sem cortar; *reduzir movimento*
   respeitado; contraste AA nos tokens. Lista de checagem em aparelho a cada
   build.
4. **Uma voz:** nenhuma palavra de infraestrutura em tela de aluno; erros dizem
   o que fazer; é o Pixel falando.
5. **Orçamentos, medidos em aparelho e datados no `STATUS.md`:** abertura até a
   trilha < 2 s num iPhone de 2020; trilha a 60 fps com centenas de nós (lista
   virtualizada); binário ≤ 60 MB.
6. **Pirâmide de testes:** serviços puros com relógio injetado
   (`NextNodeResolver`, `HeartsService`, `SubscriptionService`,
   `ProgressSyncService`) → testes de tela na configuração de produção → três
   caminhos dourados em E2E (Maestro): primeira execução até a conclusão da
   L1; segundo dia com revisão devida; vidas acabando no meio da lição até a
   folha → lista de smoke em aparelho como **gate de build**.
7. **Diagnóstico de falhas: Sentry ligado**, configuração mínima — sem IP, sem
   identificador, só a pilha do erro. Muda **um** rótulo: *Diagnóstico → Dados
   de falha, não vinculados a você*. Uma frase na Política de Privacidade.

## 9. O que muda nas declarações à loja

| Declaração | 1.3.1 | 1.4 |
| --- | --- | --- |
| "Funciona offline, sem conta" | verdadeiro | **verdadeiro** — backup é iCloud, opcional |
| Privacy Labels | Dados não coletados | **Dados de falha, não vinculados** (Sentry). Nada mais |
| Login necessário para revisão | não | não |
| In-App Purchase | nenhum | assinatura auto-renovável; revisor testa em sandbox |
| Acordo de apps pagos | não assinado | **obrigatório antes da submissão** |
| Item 7 (educacional, não diagnostica) | — | inalterado |

## 10. Fora do escopo desta spec

- Produção de conteúdo do V3 (J3), acessibilidade do V3 (J4) e corte seguro
  (J5): spec e plano próprios. Esta spec é agnóstica ao currículo — a trilha
  recebe os nós de qualquer currículo ativo.
- Sistema de desenho (tokens, componentes, motion): spec própria; esta spec
  define os estados que ele precisa cobrir.
- Android: o backup por iCloud não o cobre; decisão adiada com motivo (§7).
- Conta própria com e-mail: adiada com motivo (§7).
- Trial de assinatura: adiado com motivo (§6).

## 11. Riscos

| Risco | Mitigação |
| --- | --- |
| Módulo de iCloud fora do Expo quebra o build | plugin de configuração testado num build interno antes de qualquer produção; se falhar, o backup sai da 1.4 e o resto não depende dele |
| StoreKit em sandbox se comporta diferente da loja | caminho dourado testado no TestFlight com conta sandbox antes da submissão |
| `REFILL_MIN` calibrado no escuro | é uma constante; ajustável sem redesenho; medir retenção D2/D7 nas primeiras semanas |
| Revisor lê "vidas" como mecânica de jogo de azar | classificação etária já responde "não" a jogos de azar; vidas não envolvem dinheiro real nem aleatoriedade |
| Migração 1.3.1 → 1.4 corrompe progresso | backup antes de migrar; fixtures reais; a fotografia do J2 já existe |

## 12. Critério de saída e sequência

Esta spec está pronta para virar plano quando o dono aprovar o texto. O plano
de implementação (writing-plans) deve:

1. começar pelos serviços puros com suas tabelas de teste (§4, §5);
2. seguir pelas telas, cada uma com os quatro estados e o teste na
   configuração de produção;
3. deixar assinatura e backup por último, porque dependem de console e de
   credencial nova;
4. preservar todos os gates: 14 validadores do Loop, smoke em aparelho, E2E
   dos três caminhos dourados, e a lista de declarações à loja (§9)
   conferida antes de qualquer submissão.
