# Prompt de continuidade — Radiant 1.4 · Task 8 · CloudKit

Cole o bloco entre as linhas `---` como primeira mensagem para a IA executora.
Este handoff é deliberadamente focado no **slice CloudKit** da Task 8. Não mistura
StoreKit nem Sentry nesta execução.

---

Você vai continuar a versão 1.4 do Radiant, um app iOS de treinamento em
radiologia (Expo / React Native). As Tasks 1–7 já foram implementadas e revisadas.
O dono acabou de concluir o gate externo do Apple Developer para iCloud/CloudKit.
Sua missão nesta execução é transformar o contrato de backup já existente em uma
integração CloudKit privada real, preservando o princípio local-first.

## 1. Estado externo confirmado pelo dono em 2026-09-15

Apple Developer:

- App ID / Bundle ID: `com.ascendcreative.radiant`
- capability **iCloud**: habilitada
- **Include CloudKit support**: habilitado
- iCloud Container criado: `iCloud.com.ascendcreative.radiant`
- descrição do container: `Radiant CloudKit`
- exatamente 1 container associado ao App ID
- alteração salva e confirmada
- a Apple alertou que provisioning profiles que usam esse App ID podem precisar
  ser regenerados

Documentação durável desta decisão:

`docs/adr/ADR-2026-09-15-cloudkit-private-backup.md`

O `main` remoto no momento em que este handoff foi criado termina em:

`2ba91ec8fd36c988f2cb95e4440472a0029d73c4`

Esse SHA é apenas ponto de referência. **Remeça antes de começar**; não assuma que
a árvore continua igual.

## 2. Leia antes de alterar qualquer arquivo

Nesta ordem:

1. `AGENTS.md`
2. `docs/STATUS.md`
3. `docs/superpowers/specs/2026-09-14-radiant-1-4-fluxo-do-usuario-design.md`
4. `docs/adr/ADR-2026-09-14-1-4-freemium-por-vidas-storekit-e-icloud.md`
5. `docs/adr/ADR-2026-09-15-cloudkit-private-backup.md`
6. `docs/adr/ADR-2026-09-15-radiant-ilimitado-storekit-products.md`
7. `docs/superpowers/plans/2026-09-14-radiant-1-4-fluxo-do-usuario-plan.md`
8. `docs/superpowers/handoffs/2026-09-14-radiant-1-4-relatorio-execucao.md`
9. `docs/superpowers/handoffs/2026-09-14-radiant-1-4-prompt-de-continuidade-2.md`

Depois localize, sem adivinhar paths, usando `rg`/`find`:

- `ProgressSyncService`
- `PrivateCloudPort`
- `UnavailablePrivateCloudAdapter`
- `LocalProgressAdapter`
- `ICloudBackupCard`
- `backupNow`
- `restoreOnLaunch`
- startup/bootstrap da aplicação
- configuração Expo iOS (`app.json`/config equivalente)
- `eas.json`
- testes existentes do backup/merge/startup

## 3. Pré-voo obrigatório

Antes de editar:

```bash
git rev-parse --short HEAD
git status --porcelain
git branch -a
gh pr list --state open
```

Reproduza os gates atuais do app antes da mudança. Use os comandos canônicos do
repositório, não uma lista inventada. Se o `STATUS.md` ou `AGENTS.md` indicar uma
versão específica de Node para Loop e outra para o app, respeite isso.

Preserve qualquer alteração alheia. Não limpe, não reverta e não inclua arquivos
que não são desta tarefa.

Abra o trabalho numa branch própria, por exemplo:

`feat/1-4-cloudkit-private-backup`

Use o Loop conforme `AGENTS.md`. Se houver `PROJECT_BUSY`, `needs_human`,
`OUT_OF_SCOPE_CHANGE` ou `SECRET_DETECTED`, pare e reporte; não contorne.

## 4. Contrato de produto que não pode mudar

O Radiant é **local-first**.

- estudo, trilha, revisão, checkpoints e vidas funcionam sem rede;
- nenhuma conta própria é exigida;
- iCloud é backup opcional de continuidade, não banco primário do produto;
- falha de CloudKit nunca bloqueia startup ou estudo;
- usuário sem iCloud/Apple ID ativo continua usando o app normalmente;
- nuvem vazia nunca substitui progresso local válido;
- não criar UI de login;
- não ativar iCloud Documents;
- não usar banco público ou compartilhado;
- não introduzir backend próprio para este fluxo.

Preserve integralmente as regras de merge já aprovadas:

- união de nós concluídos por trilha;
- agenda de revisão mais nova por nó;
- maior XP;
- maior streak/sequência;
- `lastRefillAt` mais recente;
- snapshot vazio da nuvem nunca apaga local.

## 5. Entitlements canônicos

O projeto deve gerar no target iOS os entitlements equivalentes a:

```json
{
  "com.apple.developer.icloud-container-identifiers": [
    "iCloud.com.ascendcreative.radiant"
  ],
  "com.apple.developer.icloud-services": [
    "CloudKit"
  ]
}
```

Configure-os pela estratégia correta para o projeto Expo/EAS atual. Não adicione
`iCloud Documents`, ubiquity containers ou key-value storage sem necessidade
provada e sem nova decisão.

Não hardcode `com.apple.developer.icloud-container-environment` arbitrariamente.
Deixe signing/provisioning definir o ambiente, salvo se a documentação oficial e
a configuração real do projeto demonstrarem que o campo é necessário.

## 6. Implementação nativa

Implemente um adaptador real de CloudKit privado atrás do `PrivateCloudPort`
existente.

Regras:

1. use o container `iCloud.com.ascendcreative.radiant`;
2. use **private database**;
3. preserve a interface existente sempre que possível;
4. não faça a camada de domínio importar APIs nativas diretamente;
5. se precisar adicionar biblioteca ou native module, primeiro investigue o que
   já existe no projeto e a compatibilidade real com a versão atual de Expo/RN;
   não instale uma dependência apenas porque o nome parece adequado;
6. se a integração exigir config plugin ou módulo nativo próprio, mantenha a
   superfície mínima e documente por que foi necessário;
7. trate explicitamente: iCloud indisponível, conta não autenticada/restrita,
   rede ausente, registro ausente, erro transitório e erro não recuperável;
8. nenhuma dessas falhas pode transformar o startup em erro fatal.

Antes de escolher o formato dos registros CloudKit, meça o snapshot atual e
documente o schema mínimo. Não inclua e-mail, nome, identificador próprio do
Radiant ou outros dados pessoais desnecessários. O container privado do usuário
é a fronteira de identidade deste recurso.

## 7. Corrigir as duas lacunas CloudKit já conhecidas

### 7.1 `backupNow()` sem caller de produção

Hoje o método existe, mas não há caminho de produção confirmado.

Ligue o backup a um evento pedagógico seguro, preferencialmente **conclusão de
nó**, conforme a spec/plano existente. O fluxo deve ser best-effort:

- conclusão local acontece primeiro;
- persistência local não espera CloudKit;
- falha de backup não desfaz a conclusão;
- evite chamadas duplicadas por re-render/toque repetido.

### 7.2 ordem de restore/hydration no startup

Reproduza a ordem atual antes de alterar. Há risco conhecido de restore remoto e
hidratação local se atropelarem.

A propriedade a provar é:

> depois do startup, o estado final local contém o merge determinístico entre o
> progresso válido do aparelho e o backup privado, sem uma etapa posterior
> sobrescrever o merge com um snapshot mais antigo.

Não conserte por `setTimeout` ou delays. Corrija a dependência/ordem real.

Se o fluxo de boas-vindas ainda reaparecer apesar de progresso restaurado, trate
isso somente se estiver diretamente acoplado a essa ordem e já estiver previsto
na spec da 1.4; não amplie o escopo para redesign.

## 8. CloudKit schema e ambientes

CloudKit separa ambiente de desenvolvimento e produção. Não declare produção
pronta apenas porque um registro funciona em development.

Durante a implementação:

- documente record type(s), campos, tipos e record IDs usados;
- prefira schema pequeno, versionável e idempotente;
- determine como o schema será criado/validado em development;
- determine se haverá passo humano no CloudKit Console para **Deploy Schema to
  Production** antes da submissão 1.4;
- se esse passo só puder ser feito após o primeiro build/teste, registre-o como
  gate humano explícito no relatório; não esconda essa dependência.

Não modifique dados reais do usuário durante testes automatizados.

## 9. Provisioning / EAS

A capability do App ID mudou; perfis antigos podem estar inválidos.

Prepare o projeto para que o próximo build EAS gere/use um provisioning profile
compatível com os novos entitlements.

Pode inspecionar configuração e credenciais, mas:

- **não execute `eas build` sem autorização explícita do dono**;
- não execute build de produção;
- não execute submit;
- não revogue certificado válido sem necessidade;
- se `eas credentials` exigir decisão/interação do dono, pare nesse ponto e
  reporte exatamente a opção necessária.

Valide estaticamente que o app config resolvido contém os entitlements esperados
antes de pedir build.

## 10. Testes obrigatórios

Adicione testes para o novo adapter/integração e preserve os existentes.

No mínimo, prove:

- leitura de backup existente;
- ausência de registro remoto;
- escrita/atualização de backup;
- merge local + remoto;
- nuvem vazia não apaga local;
- CloudKit indisponível mantém modo local;
- sem rede mantém modo local;
- erro remoto no `backupNow()` não falha conclusão do nó;
- caller de backup ocorre uma vez por conclusão lógica;
- restore/hydration não sofre overwrite tardio;
- configuração contém exatamente o container esperado e serviço `CloudKit`;
- nenhum entitlement de iCloud Documents foi introduzido por acidente.

Rode a suíte focada durante o desenvolvimento e, antes de entregar, os gates
canônicos completos da 1.4. Relate números reais, não estimativas.

## 11. Fora do escopo desta execução

Não faça nesta branch:

- implementação StoreKit real;
- instalação/configuração de Sentry;
- mudança de preços ou Product IDs;
- trial/oferta introdutória;
- Currículo V3;
- redesign da tela de assinatura;
- submissão à App Store;
- build de produção;
- publicação de schema CloudKit em produção sem explicitar o gate e a evidência.

Os Product IDs já são canônicos em outra ADR; não os altere.

## 12. Documentação e fechamento

Ao final:

1. atualize `docs/STATUS.md` com uma linha/bloco datado em 2026-09-15, sem criar
   outro arquivo de status;
2. atualize documentação técnica apenas onde o comportamento realmente mudou;
3. produza o relatório:
   `docs/superpowers/handoffs/2026-09-15-radiant-1-4-relatorio-cloudkit.md`;
4. registre claramente:
   - branch e HEAD;
   - arquivos alterados;
   - dependência/native module adotado ou justificativa para não adotar;
   - entitlements finais;
   - schema CloudKit;
   - estado do provisioning/EAS;
   - testes focados e suíte completa;
   - qualquer gate humano restante, especialmente deploy do schema para
     production e build físico;
   - riscos residuais;
5. feche o Loop conforme `AGENTS.md`.

Faça commits lógicos. Não faça merge na `main` e não faça push se o contrato de
coordenação atual proibir; se push/PR for permitido pela política vigente,
abra PR e pare antes do merge.

O resultado desta tarefa só pode ser chamado de **implementado** antes do build
físico; só pode ser chamado de **validado nativamente** depois de um build com os
entitlements assinados rodar em aparelho real e comprovar backup + restore.

---
