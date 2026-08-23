# Smoke do TestFlight

> **Reconciliado em 2026-08-04.** Entre 2026-04-09 e esta data o roteiro mandava
> fazer login, inspecionar fila de sync e validar layout de tablet — três coisas
> que nenhuma build distribuída tem. Ele descrevia um produto que não foi
> construído, e quem o executasse gastaria a janela humana produzindo evidência
> sobre outro app. O `scripts/qa/docs-contract.mjs` agora deriva essas capacidades
> do `eas.json` e do `app.json`, e reprova o documento que voltar a afirmá-las.

## Antes de começar

- **Confirme a versão no binário instalado, não no `app.json`.** O `eas.json`
  declara `cli.appVersionSource: "remote"`: o contador vive no servidor do EAS e
  o campo do arquivo é decorativo. Leia o número no TestFlight ou em Ajustes →
  Geral → Armazenamento do iPhone.
- **Um smoke vale só para a build que ele mediu.** Anote versão e build no
  bloco de assinatura; sem isso o resultado vira afirmação sem sujeito.
- **Nada aqui exige rede.** O app é local-first e a API pública
  (`api.radiant.ascendcreative.com.br`) responde HTTP 502. Se algum passo
  parecer depender de servidor, o passo está errado, não o app.

## Cenário 1 — primeira abertura em instalação limpa

- desinstale o app antes: o gatilho da apresentação é a **ausência** da chave
  `@radiant/first_run_v1`, então uma instalação por cima não a mostra;
- a apresentação do Pixel abre **antes** da Learning Road, em três telas
  puláveis, narradas pelo mascote;
- "Pular apresentação" funciona a partir de qualquer uma das três;
- a ordem esperada é splash → bootstrap → apresentação → Learning Road;
- a Learning Road recebe com "Foco de hoje";
- reabrir o app **não** mostra a apresentação de novo.

## Cenário 2 — barra de status

- em todas as telas, o conteúdo da barra do sistema (relógio, bateria, sinal)
  fica legível sobre o fundo escuro `#03030d`;
- este cenário existe porque até `b62f529` o app declarava conteúdo **escuro**
  sobre fundo escuro, contraste medido de 1,02:1, em todas as telas e nas duas
  plataformas. Com `edgeToEdgeEnabled: true` o app desenha atrás da barra, então
  o estilo é responsabilidade dele.

## Cenário 3 — o laço de estudo local-first

- da Learning Road, abra a lição do dia;
- percorra contexto → ideia-chave → questão → reforço e use "Concluir e voltar";
- abra o checkpoint e conclua: a celebração mostra `CONQUISTA DESBLOQUEADA` e o
  CTA leva ao próximo nó recomendado;
- a aba **Perfil** — que desde 2026-08-21 absorveu Progresso e Missões — mostra
  XP e sequência com valores diferentes de zero, no cabeçalho e na seção de
  progresso;
- `REVISÕES` conta somente cards **já vencidos** (`getDueLessons` filtra
  `nextReviewAt <= agora`). O valor esperado no mesmo dia é `0`, e o motivo é
  mais forte do que "o intervalo ainda não venceu": `recordQuizResult` cria o
  card **e aplica o SM-2 na mesma chamada**, e todo ramo — inclusive o de
  falha — termina com intervalo ≥ 1 dia (`INITIAL_INTERVALS[0]`,
  `MIN_INTERVAL_DAYS`). Nenhum card é persistido vencido. Isso vale também
  quando o aluno erra tudo. Comprovar uma revisão pendente exige outra data ou
  avanço controlado do relógio; exigir `REVISÕES > 0` aqui reprovava uma captura
  correta.

## Cenário 4 — relaunch offline

- ative o modo avião **antes** de abrir;
- o app abre e o estudo continua disponível;
- feche e reabra: o progresso da sessão anterior continua lá;
- nenhuma tela de erro bloqueia o caminho; se aparecer aviso, ele é legível e
  o caminho segue.

## Cenário 5 — links legais (pendência nomeada da F1)

- na aba **Perfil**, rolando até o fim, o cartão **Ajuda e informações** está
  sempre visível;
- "Política de Privacidade" abre `https://saudediagnostica.com/radiant/privacidade/`;
- "Central de Suporte" abre `https://saudediagnostica.com/radiant/suporte/`;
- os dois destinos respondem e o retorno ao app funciona;
- este cenário é o que fecha a parte de UI da F1: os destinos já foram medidos
  em HTTP 200 de fora, mas abertura no aparelho nunca foi exercitada.

## Cenário 6 — prompt de avaliação

- o prompt **não** aparece na primeira abertura nem antes de um momento de
  valor;
- depois de concluir quiz ou revisão em sessões sucessivas, o diálogo do sistema
  pode aparecer — é `SKStoreReviewController`, e a Apple limita a frequência;
- não aparecer não reprova o cenário; aparecer **cedo demais**, sim;
- o serviço só age com `EXPO_PUBLIC_APP_ENV=production`, então este cenário só
  existe na build de loja.

## Cenário 7 — integridade da conquista

- abra `radiantapp://reward?nodeId=node%3Areward%3Afundamentos%3Afinal` com a
  trilha ainda no começo;
- a tela mostra "Conquista da unidade" e "Bloqueada até a unidade fechar";
- **não** existe botão de coletar;
- até `130d8ea` esta tela dizia "Pronta para ser coletada" com 0 de 14 marcos e
  o botão gravava a conquista — por um esquema invocável de fora do app.

## O que este roteiro deliberadamente não pede

Cada ausência abaixo já esteve no documento como passo executável. Estão aqui
para que ninguém as recoloque sem antes mudar o app.

- **Conta e sessão.** Não há login alcançável: o bloco existe no código mas é
  inerte sem `EXPO_PUBLIC_API_BASE_URL`, que nenhum perfil do `eas.json` declara.
- **Sincronização remota.** O perfil `production` declara
  `EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false`; não há fila a drenar nem status a ler.
- **Tablet.** A v1.3 declara `supportsTablet: false` — não existe build de
  tablet para verificar.
- **Perfil da jornada.** A Learning Road é a home em todos os perfis desde o
  [ADR de 2026-07-27](../../../docs/adr/ADR-2026-07-27-learning-road-como-home.md);
  não há flag a ligar.
- **Conquista destravada.** A trilha ativa tem sete lições e o nó só abre depois
  da última: percorrer até lá não é smoke. A cobertura dessa regra segue aberta
  (metade restante da B5).

## Evidência a capturar

- versão e build lidas do binário instalado;
- captura da apresentação de primeiro uso e da Learning Road;
- captura de uma tela qualquer mostrando a barra de status legível;
- captura do checkpoint concluído e da aba **Perfil** com valores;
- captura dos dois destinos legais abertos a partir do app;
- captura da tela de conquista bloqueada, sem botão de coleta;
- se o prompt de avaliação aparecer, em que momento apareceu.

## Critérios de aprovação

- nenhuma queda na abertura, na apresentação ou no relaunch;
- o modo avião não bloqueia o estudo;
- os dois links legais abrem a partir do aparelho;
- nenhuma superfície de homologação ou depuração visível na build de loja;
- a build ainda merece a metadata declarada em
  [`APP_STORE_METADATA.md`](APP_STORE_METADATA.md) — se algum cenário
  contradisser a ficha, a ficha muda junto, no mesmo trabalho.

## Assinatura

- Responsável:
- Data:
- Versão / build lidas do binário:
- Aparelho e versão do iOS:
- Notas:
