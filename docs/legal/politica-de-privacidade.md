# Política de Privacidade do Radiant

> **Versão para publicação.** Este texto foi redigido a partir do comportamento
> real do aplicativo (o que o código efetivamente coleta e transmite) e está
> pronto para ser hospedado na URL abaixo. Uma revisão jurídica continua
> recomendada como boa prática, mas não bloqueia a publicação — o conteúdo
> reflete fielmente o tratamento de dados atual.

**Última atualização:** 2026-07-29
**Aplicativo:** Radiant — aplicativo educacional de radiologia
**Controlador dos dados:** Anderson Melo (pessoa física)
**Contato para privacidade:** anderson.smelo94@gmail.com
**Endereço público desta política:** https://saudediagnostica.com/radiant/privacidade

---

## 1. Resumo em uma frase

O Radiant é um aplicativo **local-first**: ele funciona sem conta e, na
configuração distribuída nas lojas, **os seus dados de estudo ficam apenas no seu
dispositivo** e não são enviados para nós nem vendidos a terceiros.

## 2. Quem somos

O Radiant é um app educacional para estudo de radiologia. O responsável pelo
tratamento de dados (controlador, nos termos da Lei Geral de Proteção de Dados —
LGPD, Lei nº 13.709/2018) é **Anderson Melo**, que pode ser contatado pelo e-mail
**anderson.smelo94@gmail.com** para qualquer assunto de privacidade.

## 3. O que o app trata e onde isso fica

### 3.1. Dados que ficam apenas no seu dispositivo

O app guarda as informações abaixo **localmente**, no armazenamento privado do
próprio aplicativo (sandbox do sistema operacional). Elas **não são transmitidas
para nós**:

- **Progresso de aprendizado**: trilhas, lições, quizzes, revisões e checkpoints
  concluídos, e o progresso separado por trilha (Fundamentos, Tórax, Abdome).
- **Gamificação**: XP, sequência de dias (streak), "vidas" e conquistas.
- **Preferências de onboarding**: especialidade de interesse e meta diária de
  estudo que você seleciona.
- **Métricas de uso do próprio app** (telemetria): eventos de navegação e
  contadores agregados por dia/coorte, usados apenas dentro do dispositivo para
  o funcionamento do app. Nesta versão essa telemetria **não é enviada** a
  nenhum servidor.
- **Estado dos lembretes de estudo**: preferências e histórico de agendamento
  das notificações locais.

Você pode apagar todos esses dados a qualquer momento (ver seção 8).

### 3.2. Notificações locais

Com a sua permissão, o app pode agendar **lembretes de estudo** que aparecem no
seu dispositivo. Esses lembretes são **locais**: são programados e disparados
pelo próprio aparelho. O app **não registra um token de push** nem envia
notificações a partir de um servidor, portanto nenhum identificador de
notificação é transmitido para nós.

### 3.3. O que o app NÃO coleta

Na configuração distribuída nas lojas, o Radiant **não coleta**: nome, e-mail,
telefone, localização, lista de contatos, identificadores de publicidade, dados
de pagamento, nem qualquer dado clínico ou de paciente. O app **não exibe
anúncios**, **não usa rastreadores de marketing** e **não vende dados**.

## 4. Quando algum dado pode sair do dispositivo (terceiros)

Há três situações em que dados técnicos podem ser processados por terceiros. Só
a primeira é ativa na versão de lançamento.

### 4.1. Atualizações do aplicativo (Expo Updates) — ativo

Para entregar correções e melhorias sem exigir uma nova instalação, o app
verifica atualizações de software nos servidores da **Expo** (`u.expo.dev`).
Nessa verificação, a Expo pode receber **metadados técnicos** do dispositivo
(como versão do app, plataforma e endereço IP da conexão), o mínimo necessário
para entregar a atualização correta. Nenhum dado de estudo é enviado nesse
processo.

### 4.2. Relatórios de falha (Sentry) — apenas quando habilitado

Para diagnosticar travamentos e melhorar a estabilidade, o app pode usar o
serviço **Sentry**. Quando esse recurso está habilitado, em caso de erro são
enviados **dados de diagnóstico** — como tipo de erro, pilha de execução, versão
do app e ambiente — junto de um **identificador gerado pelo aplicativo** para
agrupar ocorrências. Esse envio é configurado com `sendDefaultPii` **desligado**,
ou seja, **sem o seu e-mail** e sem dados pessoais adicionais que a biblioteca
coletaria por padrão.

Na build de lançamento atual, o relatório de falhas **não está ativo**. Se e
quando for ativado (por exemplo, durante o beta, para monitorar estabilidade),
esta política já o cobre; a data de "Última atualização" será revista caso o
tratamento mude de forma relevante.

### 4.3. Lojas de aplicativos

O download e a distribuição do app são feitos pela **App Store (Apple)** e pelo
**Google Play (Google)**, que tratam dados conforme as suas próprias políticas de
privacidade, fora do controle do Radiant.

## 5. Conta e sincronização (não ativas nesta versão)

Esta versão do Radiant **não exige nem oferece a criação de conta** e **não
sincroniza** o seu progresso com nenhum servidor: todo o uso é anônimo e local.
Existe, no código, a base para um futuro recurso de conta (e-mail e senha) e de
sincronização, mas ele está **inativo** na versão distribuída.

Caso esse recurso passe a ser oferecido no futuro, esta política será
**atualizada antes** para descrever o tratamento de e-mail, senha e progresso
sincronizado, e o app passará a permitir a **exclusão da conta pelo próprio
aplicativo**, conforme exigido pelas lojas.

## 6. Para que usamos os dados e com que base legal

- **Fazer o app funcionar** (progresso, gamificação, lembretes, preferências):
  execução do serviço que você solicitou ao usar o app (art. 7º da LGPD).
- **Notificações de estudo**: com base no seu **consentimento**, dado ao permitir
  notificações; você pode revogá-lo nas configurações do sistema a qualquer
  momento.
- **Diagnóstico de estabilidade** (quando o relatório de falhas estiver ativo):
  legítimo interesse em manter o app funcionando e seguro, tratando o mínimo de
  dados técnicos necessários.

## 7. Compartilhamento

Nós **não vendemos e não compartilhamos** seus dados para fins de marketing. O
único compartilhamento possível é o processamento técnico pelos terceiros da
seção 4 (Expo e, quando ativo, Sentry), estritamente para operar e manter o app.

## 8. Retenção e como apagar seus dados

Os dados locais (seção 3.1) permanecem no dispositivo **enquanto o app estiver
instalado**. Você pode apagá-los a qualquer momento:

- **Desinstalando o aplicativo**; ou
- **Limpando os dados do app** nas configurações do sistema (Android); ou
- Usando a opção de reinício/limpeza de progresso dentro do app, quando
  disponível.

Dados de diagnóstico de falha (quando o recurso estiver ativo) são retidos pela
Sentry conforme a configuração de retenção do serviço e depois descartados.

## 9. Seus direitos (LGPD)

Como titular, você tem direito a confirmação de tratamento, acesso, correção,
anonimização, portabilidade, eliminação e informação sobre compartilhamento.
Como a maior parte dos dados fica **apenas no seu dispositivo**, você exerce
acesso e eliminação diretamente no aparelho (seção 8). Para os demais pedidos ou
para os dados tratados por terceiros, escreva para **anderson.smelo94@gmail.com**
e responderemos no prazo legal.

## 10. Crianças e adolescentes

O Radiant é voltado a **estudantes e profissionais de radiologia** e não é
direcionado a crianças. Não coletamos intencionalmente dados de menores. Se você
acredita que um menor forneceu dados pessoais, entre em contato para que sejam
removidos.

## 11. Segurança

Os dados locais ficam protegidos pelo isolamento (sandbox) do sistema operacional
do dispositivo. Na configuração atual, como não há transmissão de dados pessoais,
a superfície de exposição em trânsito é mínima. Quando houver transmissão técnica
(seção 4), ela ocorre por canais criptografados (HTTPS).

## 12. Transferência internacional

Os terceiros da seção 4 (Expo e, quando ativo, Sentry) podem processar os
metadados técnicos em servidores **fora do Brasil** (por exemplo, nos Estados
Unidos). Nesses casos, o tratamento se limita ao necessário para operar o app e
segue as salvaguardas aplicáveis.

## 13. Alterações nesta política

Podemos atualizar esta política para refletir mudanças no app ou na legislação.
Mudanças relevantes serão sinalizadas pela data de "Última atualização" no topo e,
quando o tratamento passar a incluir novas categorias de dados (por exemplo, ao
ativar conta e sincronização), a atualização será publicada **antes** de a
mudança entrar em vigor.

## 14. Contato

Dúvidas, solicitações de direitos ou reclamações sobre privacidade:
**anderson.smelo94@gmail.com** (Anderson Melo, controlador).

---

*O Radiant é um aplicativo educacional e não substitui avaliação, diagnóstico ou
orientação médica profissional. Este aviso é informativo e não integra o
tratamento de dados descrito acima.*
