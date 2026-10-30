# Continuidade Medalhão — T13: prova nativa pendente

Consolidado em **30/10/2026, America/Bahia**. Prompt operacional; o único
estado vivo continua em [STATUS](../../STATUS.md).

## Objetivo da retomada

Completar a prova nativa da alternativa A da T13 quando o ambiente permitir.
**A já foi implementada, revisada e validada estaticamente. Não refazer T00–T12,
T13 estática nem P2 PushOptIn; não pedir novamente G1=A ou Q1. Não iniciar T14.**
T13 integral ainda não está aceita: captura normal/AX5/Android200 e acabamento
visível permanecem sem prova atual.

## Fontes e decisões vinculantes

Ler AGENTS, .loop/project.yaml, STATUS e roadmap ativo
`docs/plans/2026-07-27-radiant-launch-roadmap.md`; depois T13 do
[integrador](../../plans/2026-10-25-medalhao-pendencias-e-fechamento.md),
Task15 do [roteiro por subagentes](../../plans/2026-10-25-medalhao-execucao-subagentes.md),
[ADR A/Q1](../../adr/ADR-2026-10-30-t13-texto-maximo-e-risco-residual-do-quadro.md),
[pacote avaliado](../../plans/2026-10-30-medalhao-t13-pacote-de-decisao.md),
[spec](../specs/2026-10-21-trilha-medalhao-e-aula-bancada-design.md),
[evidência A](../../evidence/2026-10-30-medalhao-t13-a.md) e
[recibo nativo](../../evidence/2026-10-30-medalhao-t13-a-native.json).
As evidências de23/10 de retomada/quadro continuam fontes históricas de Q1.

Anderson respondeu “siga conforme recomendação” após a recomendação A+Q1.
G1=A: dois corredores64 preservados, hifenização deliberada só na apresentação
ampliada, data por componentes, lembrete em footer rolável estável. Mapa local
não garante palavras futuras; título/label canônicos e fonte permanecem.
Q1 aceita **somente risco residual** do quadro (0/13 posteriores:9 rastreadas+
4 limpas, com ocorrência pós-conserto parcial preservada). Causa ainda aberta,
observação emT18; nenhum segundo patch ou declaração de correção. Não encerra
arte/acabamento ou G3global.

## Checkout e evidência confirmada

Usar a worktree existente
`/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`, branch
`claude/trilha-medalhao-design`, [PR66](https://github.com/andersonsmelo/Radiant/pull/66).
Não implementar no checkout principal nem criar outra worktree por padrão.

Commit de implementação: `19fbde5aedc36df0987bb55954d1df4703e7bc66`, publicado.
CI do mesmo SHA: App Quality41127437509 e Content41127437415 SUCCESS;
207suítes/2.833testes, visualQA0regressões/41baseline/3exceções. RF estático
Spec PASS/Qualidade APPROVED,336focais/7suítes, tipos/lint/43contratos e
29 violações específicas detectadas/restauradas;1survivor ornamental explicado.
Não tratar essas contagens focais como a suíte inteira nem como renderização.

Writer de implementação `run-1793391172160-16609a84`: **CLOSED**, após final
Loop15/15 em um ciclo, STEP_SUCCEEDED→MEMORY_WRITTEN→RUN_CLOSED, em chamadas
separadas. Memória fingerprint
`0d71160c0d4f3d2c880306f4f46edb0840507ca1bb068f906e9f666b5575d26e`.
Cérebro `brain-session-1793390942699-3c7a0658`: CLOSED. Não reutilizar esses IDs.
Reconfirmar HEAD/status/remoto/CI, concorrência e fonte antes de reaproveitar
PASS; commits documentais posteriores não herdam CI de19fbde5.

## Bloqueios reais de ambiente e próxima ação

As sete capturas tentadas estão **NOT_VERIFIED e ausentes**, sem PNG fabricado:

- iOS E262: GUI Simulator.app ausente; a tentativa headless chegou aBooted,
  mas o shell não abriu (FBSOpenApplicationServiceErrorDomain5), deep link
  expirou e não houve default displayport. Cliente1.4.0(3) por appinfo não
  comprova compatibilidade atual. Fonte `large→large`, AX5 nunca aplicado;
  destino encerrado emShutdown.
- Android `radiant-entrada-api34`: abortou antes do boot por disco insuficiente;
  medição da tentativa2,9GiB livres/volume100%. Cliente/fonte não mensurados,
  nada alterado. Não tratar null do JSON como ausência medida da preferência.
- Metro encerrado,8081/8082livres, ADB22919 preexistente preservado. Nenhuma
  revisão/lição consumida; fonte e dados do reservado não foram alterados.

Antes de repetir, medir se o shell/framebuffer iOS consegue iniciar e se há
espaço suficiente para o AVD existente. Não repetir o mesmo bloqueio sem
mudança externa. Ausência de GUI não prova impossibilidade de toda rota
headless, mas a tentativa registrada efetivamente falhou antes de renderizar.
Não limpar armazenamento, instalar componentes/driver, resetar AVD ou criar
fixtures para contornar. Se o ambiente continuar impedido, preservar o limite;
registro documental não substitui observação.

## Prova e validação futuras

Um implementador novo se houver mudança de produto e revisão independente;
controlador mantém um cérebro/writer próprios, união nominal completa antes
de escrita e snapshots. PROJECT_BUSY não se contorna. Node24 somente Loop;
app/testes/Metro Node20.20.2. Close do cérebro antes da final pode ser necessário
pela reentrada brain-links. Fechar writer e cérebro separadamente.
Final configurada: `loop validate --run <writer-novo>`, com runtime encerrado
e carga baixa/caffeinate. Seu validador app-quality executa, em radiant-app
no Node20, `EXPO_NO_DOTENV=1 CI=1 npm run quality` integral, conforme política
e workflow versionados. Focais não substituem esse gate.

Usar somente cliente existente compatível, destino explícito e APIs públicas;
medir processos/portas/fontes antes/depois e restaurar o que mudar. Comparar
normal, normal→máximo montado e máximo inicial, incluindo troca entre escalas
grandes; mesma régua/largura real. Provar cabeça inteira, texto/data/CTA e
lembrete alcançáveis por rolagem, foco e erro/retry. Sem prova de glifos por
props de Jest. Se houver defeito observado, preservar captura/timeline,
vermelho causal e patch mínimo com nova revisão. Não alterar rota para
satisfazer caixa transparente nem corrigir a hipótese do quadroQ1.

Preservar Sora/Pixel/quatro momentos/ouro/lábio/fingerprint, economia,
primeira resposta, retomada, currículo, storage, M7/A2. T12 usa retorno do
setter já sequenciado no bootstrap; **não reintroduzir getSnapshotForNode no
foco como leitura pura**, pois persistia fotografia antiga e apagava cursor.
G6 local da T11 comprova apenas Debug9a62bca/StoreKitTesting noE262; não
transfere autorização de build/install para T13.

Reservado `5FD8C926-BC5A-4E9E-B5BE-2E080B2ED2A3` intocável. Segundo dia e E2E
integral sóT18, sem relógio/fixture/storage privado. Sem novo build/install/
EAS/OTA/loja/merge/dependência/política/retirada de conteúdo ou mensagens/
tarefas externas. Trello/Todoist/Obsidian/Google Docs não receberam escrita
externa nesta atualização; a memória da decisão já passou pelo Loop.

Ao entregar: evidência efetiva, limites, arquivos/commit/CI do SHA publicado,
processos/fontes restaurados e estados separados de writer/cérebro. Não marcar
T13 integral ou G3global aceitos nem avançar silenciosamente paraT14.
