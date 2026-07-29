# Publicação das páginas legais do Radiant — pacote de entrega

**Para que serve:** hospedar as duas páginas legais obrigatórias do Radiant no
domínio `saudediagnostica.com`, destravando as tasks **L2.3 (A4)** e **L2.8 (E5)**
do [plano de closed testing](../plans/2026-07-29-android-closed-testing-plan.md).
Sem as duas URLs respondendo, a ficha do Play e a do App Store não fecham.

**Estado medido em 2026-07-29:** ambas as URLs retornam **HTTP 404**. As páginas
existem prontas neste repositório e nunca foram publicadas.

## Como usar

1. Anexe os dois arquivos à conversa com a IA que cuida do site:
   - `docs/legal/politica-de-privacidade.html`
   - `docs/legal/pagina-de-suporte.html`
2. Copie o bloco **PROMPT** abaixo (da linha de abertura até o fim) e envie. O
   prompt já embute o HTML completo das duas páginas, então funciona mesmo se os
   anexos não passarem.
3. Quando ela responder, me avise — eu verifico as duas URLs de fora e confirmo
   que estão publicadas de verdade, não só que alguém disse que subiu.

**Checksums das fontes (SHA-256).** Servem para detectar divergência entre o que
está aqui e o que foi publicado:

| Arquivo | SHA-256 |
| --- | --- |
| `politica-de-privacidade.html` | `0f309c05f336cba5d6aafe58980982d8f481a2e3502ea9a299cec18c9f07c749` |
| `pagina-de-suporte.html` | `668a8b3936e8fd7d41bd69837eac233aa0d0d98313db51c0e908cbe660307c13` |

---

# PROMPT — copie daqui para baixo

Preciso publicar duas páginas estáticas no site **saudediagnostica.com**. Elas são
as páginas legais obrigatórias de um aplicativo que vai para a App Store e para o
Google Play, e os revisores das duas lojas vão abrir essas URLs. O HTML completo
das duas está no fim desta mensagem.

## As duas URLs, exatamente assim

| Página | URL final |
| --- | --- |
| Política de Privacidade | `https://saudediagnostica.com/radiant/privacidade` |
| Página de Suporte | `https://saudediagnostica.com/radiant/suporte` |

Os endereços não são negociáveis: eles já estão escritos dentro do próprio HTML
(as páginas linkam uma para a outra) e vão ser preenchidos nos formulários das
lojas. Se por alguma limitação do site o caminho tiver de mudar, **me avise antes
de publicar** em vez de escolher outro caminho — eu preciso atualizar o HTML e os
metadados das lojas junto.

## Critérios de aceite

Cada URL precisa satisfazer todos estes pontos:

1. **HTTP 200 direto**, sem cadeia de redirecionamento. Se o site normaliza barra
   final, faça `/radiant/privacidade` e `/radiant/privacidade/` chegarem à mesma
   página (uma pode redirecionar para a outra, mas só um salto).
2. **Público e anônimo.** Os revisores da Apple e do Google abrem a URL sem login,
   de fora do Brasil, às vezes por robô. Nada de área logada, senha, captcha,
   geobloqueio ou muro de e-mail.
3. **Conteúdo visível sem interação.** Se o site tem banner de cookies ou consent
   wall, o texto da página precisa estar legível por trás dele. Uma página que só
   mostra o conteúdo depois de aceitar cookies é reprovada como "sem política".
4. **Indexável:** sem `noindex` e sem bloqueio de `/radiant/` no `robots.txt`. O
   HTML já traz `<meta name="robots" content="index,follow">`.
5. **UTF-8 e `lang="pt-BR"`** preservados — o texto tem acentuação, e codificação
   errada quebra a leitura.
6. **Os links internos entre as duas páginas precisam funcionar.** A página de
   suporte aponta para a de privacidade em dois lugares, com URL absoluta.
7. **Responsivo e legível no celular.** O CSS já está embutido no `<head>`; não há
   arquivo externo, fonte remota nem script — e não precisa haver.

## O que você pode e o que você não pode mudar

**Pode:** envolver o conteúdo no cabeçalho/rodapé/navegação padrão do site,
ajustar o estilo para casar com a identidade do saudediagnostica.com, e adaptar o
formato ao CMS (página, post ou arquivo estático — o que for mais simples de
manter).

**Não pode:** alterar, resumir, reordenar ou "melhorar" o **texto** das páginas.
Ele é jurídico e está amarrado, frase a frase, às declarações de **Data Safety**
(Google) e **Privacy Labels** (Apple) que já foram preenchidas. Divergência entre
o que a política diz e o que foi declarado no console é motivo de reprovação. Isso
inclui a data "Última atualização: 29 de julho de 2026", o nome do controlador, o
e-mail de contato e o aviso de que o app é educacional. Se algo no texto parecer
errado, **me diga em vez de corrigir**.

## O que me responder

Quando terminar, me mande:

- as duas URLs finais publicadas;
- o código HTTP que cada uma devolve numa requisição anônima;
- se você envolveu o conteúdo em algum template do site, e qual;
- qualquer coisa que você teve de mudar, e o motivo.

---

## Arquivo 1 — Política de Privacidade, em `/radiant/privacidade`

```html
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="index,follow">
<title>Política de Privacidade — Radiant</title>
<style>
  :root { --ink:#1a1a2e; --muted:#555; --accent:#2155FF; --line:#e6e8ef; --bg:#ffffff; }
  * { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    margin: 0; background: var(--bg); color: var(--ink);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.65; font-size: 17px;
  }
  .wrap { max-width: 720px; margin: 0 auto; padding: 48px 24px 80px; }
  header { border-bottom: 1px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }
  h1 { font-size: 1.9rem; line-height: 1.2; margin: 0 0 8px; letter-spacing: -0.01em; }
  h2 { font-size: 1.25rem; margin: 40px 0 12px; letter-spacing: -0.01em; }
  p, li { color: var(--ink); }
  .meta { color: var(--muted); font-size: 0.95rem; margin: 4px 0; }
  .meta strong { color: var(--ink); }
  .lead { font-size: 1.05rem; }
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }
  ul { padding-left: 22px; }
  li { margin: 6px 0; }
  .note {
    background: #f5f7ff; border: 1px solid var(--line); border-radius: 12px;
    padding: 14px 18px; color: var(--muted); font-size: 0.95rem; margin: 24px 0;
  }
  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }
  .disclaimer { color: var(--muted); font-size: 0.95rem; font-style: italic; }
  footer { margin-top: 48px; color: var(--muted); font-size: 0.9rem; }
  @media (prefers-color-scheme: dark) {
    :root { --ink:#eef0f6; --muted:#a7abbd; --line:#2a2d3a; --bg:#0f1017; }
    .note { background:#171a26; }
  }
</style>
</head>
<body>
<main class="wrap">
  <header>
    <h1>Política de Privacidade do Radiant</h1>
    <p class="meta"><strong>Aplicativo:</strong> Radiant — aplicativo educacional de radiologia</p>
    <p class="meta"><strong>Última atualização:</strong> 29 de julho de 2026</p>
    <p class="meta"><strong>Controlador dos dados:</strong> Anderson Melo (pessoa física)</p>
    <p class="meta"><strong>Contato para privacidade:</strong> <a href="mailto:anderson.smelo94@gmail.com">anderson.smelo94@gmail.com</a></p>
  </header>

  <h2>1. Resumo em uma frase</h2>
  <p class="lead">O Radiant é um aplicativo <strong>local-first</strong>: ele funciona sem conta e, na configuração distribuída nas lojas, <strong>os seus dados de estudo ficam apenas no seu dispositivo</strong> e não são enviados para nós nem vendidos a terceiros.</p>

  <h2>2. Quem somos</h2>
  <p>O Radiant é um app educacional para estudo de radiologia. O responsável pelo tratamento de dados (controlador, nos termos da Lei Geral de Proteção de Dados — LGPD, Lei nº 13.709/2018) é <strong>Anderson Melo</strong>, que pode ser contatado pelo e-mail <a href="mailto:anderson.smelo94@gmail.com">anderson.smelo94@gmail.com</a> para qualquer assunto de privacidade.</p>

  <h2>3. O que o app trata e onde isso fica</h2>
  <h3>3.1. Dados que ficam apenas no seu dispositivo</h3>
  <p>O app guarda as informações abaixo <strong>localmente</strong>, no armazenamento privado do próprio aplicativo (sandbox do sistema operacional). Elas <strong>não são transmitidas para nós</strong>:</p>
  <ul>
    <li><strong>Progresso de aprendizado</strong>: trilhas, lições, quizzes, revisões e checkpoints concluídos, e o progresso separado por trilha (Fundamentos, Tórax, Abdome).</li>
    <li><strong>Gamificação</strong>: XP, sequência de dias (streak), "vidas" e conquistas.</li>
    <li><strong>Preferências de onboarding</strong>: especialidade de interesse e meta diária de estudo que você seleciona.</li>
    <li><strong>Métricas de uso do próprio app</strong> (telemetria): eventos de navegação e contadores agregados por dia/coorte, usados apenas dentro do dispositivo para o funcionamento do app. Nesta versão essa telemetria <strong>não é enviada</strong> a nenhum servidor.</li>
    <li><strong>Estado dos lembretes de estudo</strong>: preferências e histórico de agendamento das notificações locais.</li>
  </ul>
  <p>Você pode apagar todos esses dados a qualquer momento (ver seção 8).</p>

  <h3>3.2. Notificações locais</h3>
  <p>Com a sua permissão, o app pode agendar <strong>lembretes de estudo</strong> que aparecem no seu dispositivo. Esses lembretes são <strong>locais</strong>: são programados e disparados pelo próprio aparelho. O app <strong>não registra um token de push</strong> nem envia notificações a partir de um servidor, portanto nenhum identificador de notificação é transmitido para nós.</p>

  <h3>3.3. O que o app NÃO coleta</h3>
  <p>Na configuração distribuída nas lojas, o Radiant <strong>não coleta</strong>: nome, e-mail, telefone, localização, lista de contatos, identificadores de publicidade, dados de pagamento, nem qualquer dado clínico ou de paciente. O app <strong>não exibe anúncios</strong>, <strong>não usa rastreadores de marketing</strong> e <strong>não vende dados</strong>.</p>

  <h2>4. Quando algum dado pode sair do dispositivo (terceiros)</h2>
  <p>Há três situações em que dados técnicos podem ser processados por terceiros. Só a primeira é ativa na versão de lançamento.</p>
  <h3>4.1. Atualizações do aplicativo (Expo Updates) — ativo</h3>
  <p>Para entregar correções e melhorias sem exigir uma nova instalação, o app verifica atualizações de software nos servidores da <strong>Expo</strong> (<code>u.expo.dev</code>). Nessa verificação, a Expo pode receber <strong>metadados técnicos</strong> do dispositivo (como versão do app, plataforma e endereço IP da conexão), o mínimo necessário para entregar a atualização correta. Nenhum dado de estudo é enviado nesse processo.</p>
  <h3>4.2. Relatórios de falha (Sentry) — apenas quando habilitado</h3>
  <p>Para diagnosticar travamentos e melhorar a estabilidade, o app pode usar o serviço <strong>Sentry</strong>. Quando esse recurso está habilitado, em caso de erro são enviados <strong>dados de diagnóstico</strong> — como tipo de erro, pilha de execução, versão do app e ambiente — junto de um <strong>identificador gerado pelo aplicativo</strong> para agrupar ocorrências. Esse envio é configurado com <code>sendDefaultPii</code> <strong>desligado</strong>, ou seja, <strong>sem o seu e-mail</strong> e sem dados pessoais adicionais que a biblioteca coletaria por padrão. Na build de lançamento atual, o relatório de falhas <strong>não está ativo</strong>.</p>
  <h3>4.3. Lojas de aplicativos</h3>
  <p>O download e a distribuição do app são feitos pela <strong>App Store (Apple)</strong> e pelo <strong>Google Play (Google)</strong>, que tratam dados conforme as suas próprias políticas de privacidade, fora do controle do Radiant.</p>

  <h2>5. Conta e sincronização (não ativas nesta versão)</h2>
  <p>Esta versão do Radiant <strong>não exige nem oferece a criação de conta</strong> e <strong>não sincroniza</strong> o seu progresso com nenhum servidor: todo o uso é anônimo e local. Existe, no código, a base para um futuro recurso de conta e de sincronização, mas ele está <strong>inativo</strong> na versão distribuída. Caso passe a ser oferecido, esta política será <strong>atualizada antes</strong>, e o app permitirá a <strong>exclusão da conta pelo próprio aplicativo</strong>, conforme exigido pelas lojas.</p>

  <h2>6. Para que usamos os dados e com que base legal</h2>
  <ul>
    <li><strong>Fazer o app funcionar</strong> (progresso, gamificação, lembretes, preferências): execução do serviço que você solicitou ao usar o app (art. 7º da LGPD).</li>
    <li><strong>Notificações de estudo</strong>: com base no seu <strong>consentimento</strong>, dado ao permitir notificações; você pode revogá-lo nas configurações do sistema a qualquer momento.</li>
    <li><strong>Diagnóstico de estabilidade</strong> (quando o relatório de falhas estiver ativo): legítimo interesse em manter o app funcionando e seguro, tratando o mínimo de dados técnicos necessários.</li>
  </ul>

  <h2>7. Compartilhamento</h2>
  <p>Nós <strong>não vendemos e não compartilhamos</strong> seus dados para fins de marketing. O único compartilhamento possível é o processamento técnico pelos terceiros da seção 4 (Expo e, quando ativo, Sentry), estritamente para operar e manter o app.</p>

  <h2>8. Retenção e como apagar seus dados</h2>
  <p>Os dados locais (seção 3.1) permanecem no dispositivo <strong>enquanto o app estiver instalado</strong>. Você pode apagá-los a qualquer momento:</p>
  <ul>
    <li><strong>Desinstalando o aplicativo</strong>; ou</li>
    <li><strong>Limpando os dados do app</strong> nas configurações do sistema (Android); ou</li>
    <li>Usando a opção de reinício/limpeza de progresso dentro do app, quando disponível.</li>
  </ul>
  <p>Dados de diagnóstico de falha (quando o recurso estiver ativo) são retidos pela Sentry conforme a configuração de retenção do serviço e depois descartados.</p>

  <h2>9. Seus direitos (LGPD)</h2>
  <p>Como titular, você tem direito a confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação e informação sobre compartilhamento. Como a maior parte dos dados fica <strong>apenas no seu dispositivo</strong>, você exerce acesso e eliminação diretamente no aparelho (seção 8). Para os demais pedidos, escreva para <a href="mailto:anderson.smelo94@gmail.com">anderson.smelo94@gmail.com</a> e responderemos no prazo legal.</p>

  <h2>10. Crianças e adolescentes</h2>
  <p>O Radiant é voltado a <strong>estudantes e profissionais de radiologia</strong> e não é direcionado a crianças. Não coletamos intencionalmente dados de menores. Se você acredita que um menor forneceu dados pessoais, entre em contato para que sejam removidos.</p>

  <h2>11. Segurança</h2>
  <p>Os dados locais ficam protegidos pelo isolamento (sandbox) do sistema operacional do dispositivo. Na configuração atual, como não há transmissão de dados pessoais, a superfície de exposição em trânsito é mínima. Quando houver transmissão técnica (seção 4), ela ocorre por canais criptografados (HTTPS).</p>

  <h2>12. Transferência internacional</h2>
  <p>Os terceiros da seção 4 (Expo e, quando ativo, Sentry) podem processar os metadados técnicos em servidores <strong>fora do Brasil</strong> (por exemplo, nos Estados Unidos). Nesses casos, o tratamento se limita ao necessário para operar o app e segue as salvaguardas aplicáveis.</p>

  <h2>13. Alterações nesta política</h2>
  <p>Podemos atualizar esta política para refletir mudanças no app ou na legislação. Mudanças relevantes serão sinalizadas pela data de "Última atualização" no topo e, quando o tratamento passar a incluir novas categorias de dados, a atualização será publicada <strong>antes</strong> de a mudança entrar em vigor.</p>

  <h2>14. Contato</h2>
  <p>Dúvidas, solicitações de direitos ou reclamações sobre privacidade: <a href="mailto:anderson.smelo94@gmail.com">anderson.smelo94@gmail.com</a> (Anderson Melo, controlador).</p>

  <hr>
  <p class="disclaimer">O Radiant é um aplicativo educacional e não substitui avaliação, diagnóstico ou orientação médica profissional. Este aviso é informativo e não integra o tratamento de dados descrito acima.</p>
  <footer>© Radiant — Anderson Melo. Política de privacidade.</footer>
</main>
</body>
</html>
```

---

## Arquivo 2 — Página de Suporte, em `/radiant/suporte`

```html
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="index,follow">
<title>Suporte — Radiant</title>
<style>
  :root { --ink:#1a1a2e; --muted:#555; --accent:#2155FF; --line:#e6e8ef; --bg:#ffffff; }
  * { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    margin: 0; background: var(--bg); color: var(--ink);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.65; font-size: 17px;
  }
  .wrap { max-width: 720px; margin: 0 auto; padding: 48px 24px 80px; }
  header { border-bottom: 1px solid var(--line); padding-bottom: 24px; margin-bottom: 32px; }
  h1 { font-size: 1.9rem; line-height: 1.2; margin: 0 0 8px; letter-spacing: -0.01em; }
  h2 { font-size: 1.25rem; margin: 40px 0 12px; letter-spacing: -0.01em; }
  h3 { font-size: 1.02rem; margin: 22px 0 4px; }
  .meta { color: var(--muted); font-size: 0.95rem; margin: 4px 0; }
  .meta strong { color: var(--ink); }
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }
  .contact {
    display: inline-block; background: var(--accent); color: #fff !important;
    padding: 12px 22px; border-radius: 12px; font-weight: 600; margin: 8px 0 4px;
  }
  .contact:hover { text-decoration: none; opacity: 0.92; }
  .faq h3 { color: var(--ink); }
  .faq p { margin: 4px 0 16px; color: var(--muted); }
  hr { border: none; border-top: 1px solid var(--line); margin: 40px 0; }
  .disclaimer { color: var(--muted); font-size: 0.95rem; font-style: italic; }
  footer { margin-top: 48px; color: var(--muted); font-size: 0.9rem; }
  @media (prefers-color-scheme: dark) {
    :root { --ink:#eef0f6; --muted:#a7abbd; --line:#2a2d3a; --bg:#0f1017; }
  }
</style>
</head>
<body>
<main class="wrap">
  <header>
    <h1>Suporte — Radiant</h1>
    <p class="meta"><strong>Aplicativo:</strong> Radiant — aplicativo educacional de radiologia</p>
    <p class="meta"><strong>Última atualização:</strong> 29 de julho de 2026</p>
  </header>

  <h2>Como falar com a gente</h2>
  <p>Dúvidas, problemas, sugestões ou relato de bugs:</p>
  <p><a class="contact" href="mailto:anderson.smelo94@gmail.com">anderson.smelo94@gmail.com</a></p>
  <p class="meta">Respondemos o mais rápido possível. Ao relatar um problema, ajuda informar o <strong>modelo do aparelho</strong>, a <strong>versão do sistema</strong> (Android/iOS) e a <strong>versão do app</strong>, além de descrever <strong>o que você fez</strong> e <strong>o que aconteceu</strong>.</p>

  <h2>Perguntas frequentes</h2>
  <div class="faq">
    <h3>Preciso criar uma conta para usar?</h3>
    <p>Não. O Radiant é <strong>local-first</strong>: funciona sem cadastro e sem login. É só abrir e estudar.</p>

    <h3>Funciona sem internet?</h3>
    <p>Sim. O catálogo, o progresso e as revisões funcionam <strong>offline</strong>; seu progresso fica salvo no próprio aparelho.</p>

    <h3>Onde fica o meu progresso?</h3>
    <p>No <strong>seu dispositivo</strong>. Ele não é enviado para servidores nem sincronizado nesta versão — veja a <a href="https://saudediagnostica.com/radiant/privacidade">Política de Privacidade</a>.</p>

    <h3>Como reinicio ou apago meu progresso?</h3>
    <p>Você pode limpar os dados do app nas configurações do sistema, ou desinstalar o app. (Se houver uma opção de reinício dentro do app, ela também zera o progresso.)</p>

    <h3>Não estou recebendo os lembretes de estudo.</h3>
    <p>Os lembretes são <strong>notificações locais</strong> e dependem da permissão de notificações. Verifique em Ajustes → Notificações se o Radiant está autorizado.</p>

    <h3>O conteúdo do Radiant vale como orientação médica?</h3>
    <p>Não. O Radiant é <strong>educacional</strong>. Veja o aviso abaixo.</p>
  </div>

  <h2>Privacidade</h2>
  <p>Consulte a <a href="https://saudediagnostica.com/radiant/privacidade">Política de Privacidade do Radiant</a>. Resumo: o app não coleta seus dados de estudo — eles ficam no seu aparelho.</p>

  <hr>
  <p class="disclaimer">O Radiant é um aplicativo educacional de radiologia. O conteúdo tem finalidade de estudo e <strong>não substitui</strong> formação, julgamento clínico ou orientação médica profissional.</p>
  <footer>© Radiant — Anderson Melo. Página de suporte.</footer>
</main>
</body>
</html>
```
