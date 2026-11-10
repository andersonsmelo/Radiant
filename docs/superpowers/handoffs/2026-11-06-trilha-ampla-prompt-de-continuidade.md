# Continuidade — trilha ampla rtg-2026 e engajamento

Fotografia de **06/11/2026, America/Bahia**, escrita pelo Claude (Fable 5.1) para a IA
que continua o trabalho. O estado vivo é o [`docs/STATUS.md`](../../STATUS.md); a
medição atual vale mais que este texto. Este documento não autoriza build, envio à
loja, merge na `main` nem download de imagens.

## Prompt para a próxima conversa

Continue a trilha ampla do Radiant na worktree
`/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`, branch
`claude/conteudo-reinicio-tecnologo`. Leia, nesta ordem e só isto: este documento, a
[ADR da delegação](../../adr/ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla.md),
o [plano](../../plans/2026-11-05-radiant-trilha-ampla-e-engajamento.md) e a seção
"Trilha ampla e engajamento" do `docs/STATUS.md`. Meça o estado com o bloco abaixo
antes de qualquer edição. Depois siga "O que falta, em ordem". Não refaça o que está
marcado como feito.

## Medir o estado em um minuto

```bash
cd /Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20
git status --porcelain | head -20; git log --oneline -4
ls -t .loop/runs | head -1 | xargs -I{} python3 -c "import json;print('{}', json.load(open('.loop/runs/{}/state.json'))['state'])"
ls content-manifest/rtg-2026/aulas | tr '\n' ' '
node scripts/content/rtg-lesson-lint.mjs content-manifest/rtg-2026/aulas/*.json
node scripts/content/build-rtg-batches.mjs --check > /dev/null; echo "gerador exit=$?"
sysctl -n vm.loadavg; ls ~/Documents > /dev/null && echo documentos-ok
```

Unidade listada em `aulas/` está revista e ativa na trilha. O parecer de cada uma está
em [`docs/evidence/2026-11-06-rtg-2026-revisao/`](../../evidence/2026-11-06-rtg-2026-revisao/).

## Como o trabalho foi desenhado

A aula é **dado**, não código. Uma unidade inteira mora num arquivo
`content-manifest/rtg-2026/aulas/<unidade>.json` (formato aula-fonte). O verificador
`scripts/content/rtg-lesson-lint.mjs` confere a forma, e o gerador
`scripts/content/build-rtg-batches.mjs` transforma as aulas-fonte nos lotes que a
trilha lê, em `radiant-app/src/features/student-checkpoints/batches/`. **Nunca edite
os arquivos gerados à mão:** edite a aula-fonte e rode o gerador.

Cada unidade passa por quatro passos, sempre nesta ordem:

1. **Autoria** por um agente, pelo
   [guia de autoria](../../content/2026-11-05-guia-de-autoria-rtg-2026.md), com os
   fatos conferidos em fontes gratuitas na web.
2. **Verificador** até imprimir `OK`.
3. **Revisão independente** por outro agente, que não viu a conversa do autor, pelo
   brief do revisor (seção 7 do guia). Ele corrige a unidade e escreve o parecer.
4. **Admissão:** copiar a unidade e o parecer para o repositório, gerar e conferir.

```bash
# passo 4, da raiz da worktree, com <u> = m08, s-tc etc.
cp <rascunho>/<u>.json content-manifest/rtg-2026/aulas/<u>.json
cp <pareceres>/<u>.md docs/evidence/2026-11-06-rtg-2026-revisao/<u>.md
node scripts/content/rtg-lesson-lint.mjs content-manifest/rtg-2026/aulas/<u>.json
node scripts/content/build-rtg-batches.mjs > /dev/null
node scripts/content/build-rtg-batches.mjs --check > /dev/null; echo "exit=$?"   # precisa ser 0
```

Unidade sem parecer "aprovado com correções" não entra em `aulas/`.

## Regras de qualidade que não se negociam

Estas regras são a razão de a trilha ter saído boa. Um modelo mais fraco tende a
relaxá-las; não relaxe.

1. **Autor e revisor são agentes diferentes.** Quem escreveu não revisa. A revisão
   achou de 10 a 16 defeitos por unidade nas sete primeiras, inclusive um fato
   invertido que dois autores escreveram igual.
2. **Fato sem fonte lida sai.** Trecho de busca não é leitura. Fato de segurança com
   uma só fonte de tipo wiki vira "siga o protocolo do serviço e peça apoio à equipe".
3. **Limite profissional.** O aluno é estudante em simulação supervisionada: não
   diagnostica, não escolhe exame, não prescreve nem administra, não calcula dose de
   paciente, não libera implante, não corrige registro sozinho. Na dúvida, a resposta
   certa é parar e levar à equipe.
4. **Não se cobra o que a aula não ensinou.** Foi o defeito mais comum.
5. **Texto original.** Nenhuma frase copiada ou parafraseada de perto. Nada dos PDFs
   locais nem de `Conteúdo/`. OpenStax é só consulta (hoje é CC BY-NC-SA).
6. **Normas vigentes:** Anvisa RDC 611/2022 e suas instruções normativas; "Norma ANSN
   3.01" (Resolução CNEN 344/2025). Leia o texto antes de atribuir algo à norma.
7. **Toda asserção nova de teste é vista falhando** com o defeito que ela nomeia, e a
   saída vermelha vai para a evidência.
8. **Nada de dizer "revisado por especialista"** no app, na loja ou em documento: a
   revisão é por IA.
9. **O que não foi verificado se escreve como não verificado.**

## Ritual do Loop que funcionou aqui

O Loop exige a **lista exata** de arquivos na abertura; diretório não vale, e arquivo
novo fora da lista derruba o run. Monte a lista por script e passe ao embrulho por
`subprocess`, porque o zsh não divide variável em palavras:

```bash
python3 - <<'EOF'
import subprocess, os
dirs = ['radiant-app/src', 'scripts/content', 'scripts/qa', 'content-manifest',
        'docs/evidence/2026-11-06-rtg-2026-revisao', 'radiant-app/scripts']
files = set(subprocess.run(['git', 'ls-files', *dirs], capture_output=True, text=True).stdout.split('\n'))
units = [f'm{n:02d}' for n in range(1, 15)] + ['s-tc', 's-rm', 's-md', 's-mn', 's-rt', 's-ir']
files |= {f'content-manifest/rtg-2026/aulas/{u}.json' for u in units}
files |= {f'radiant-app/src/features/student-checkpoints/batches/rtg-2026-{u}.ts' for u in units}
files |= {f'docs/evidence/2026-11-06-rtg-2026-revisao/{u}.md' for u in units}
files |= {'docs/STATUS.md', 'docs/FILA.md', 'docs/archive/STATUS_historico.md', 'docs/archive/FILA_concluidos.md',
          'docs/plans/2026-11-05-radiant-trilha-ampla-e-engajamento.md',
          'docs/content/2026-11-05-guia-de-autoria-rtg-2026.md',
          'docs/superpowers/handoffs/2026-11-06-trilha-ampla-prompt-de-continuidade.md'}
files = sorted(f for f in files if f)          # acrescente aqui todo arquivo novo que for criar
env = dict(os.environ, PATH=os.path.expanduser('~/.nvm/versions/node/v24.14.1/bin') + ':' + os.environ['PATH'])
print(subprocess.run(['node', 'scripts/loop/abrir.mjs', '<descrição do run>', *files],
                     capture_output=True, text=True, env=env).stdout[-200:])
EOF
```

Fechamento, um comando por vez, lendo o `code` de cada resposta:

1. `cd radiant-app && EXPO_NO_DOTENV=1 npm run quality` no **Node 20**
   (`export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"`). Leva uns 6 minutos.
2. `loop validate --run <id>` no **Node 24**, com a carga abaixo de 5. Precisa dar
   `VALIDATION_PASSED`.
3. `loop step finish --run <id>` → `STEP_SUCCEEDED`.
4. Se houver aprendizado: gere o candidato (resumo abaixo de 1000 caracteres, `type`
   `validated-learning`, `evidenceIds` dos validadores `passed`) e, em outra chamada,
   `loop memory write --run <id> --input <arquivo>`.
5. `loop run close --run <id>` → `RUN_CLOSED`.
6. `git add` dos arquivos do run, commit e `git push origin claude/conteudo-reinicio-tecnologo`.

## Ritmo e custo

Dez subagentes juntos esgotaram a janela de uso de 5 horas em 30 minutos, três vezes.
O que funcionou: no máximo três ou quatro agentes por vez; um **orquestrador** que
lança autores e revisores e só devolve uma tabela; pedir respostas finais de até 8
linhas; e limitar cada agente a 15 ou 20 consultas na web. Cada resposta do
controlador custa o contexto inteiro dele, então agrupe as ações.

## O que falta, em ordem

Confira cada item pela medição antes de começar; o estado no fechamento desta
conversa está na última seção.

1. **Fechar o núcleo.** As 14 unidades (M01 a M14) em `aulas/`, com parecer. São 84 aulas.
2. **Os seis aprofundamentos** (`s-tc`, `s-rm`, `s-md`, `s-mn`, `s-rt`, `s-ir`), 8
   aulas cada, pela tabela da seção 7 do
   [mapa curricular](../../plans/2026-11-02-planejamento-conteudo-radiant.md).
3. **Prova completa no simulador** `E262D4C1-99BE-496B-8567-0291C14E6533` (nunca o
   `5FD8C926…`), fora de run aberto ou com o Metro em `EXPO_NO_TYPESCRIPT_SETUP=1`:
   jogar uma aula até o resumo, ver o confete, três acertos seguidos (selo de combo),
   a conferência aprovada e a reprovada, a celebração de unidade, o nível e as
   missões. Som se confere pelo log, pela duração: `toque` 40 ms, `erro` 136, `vida`
   188, `acerto` 290, `sequencia` 373, `combo` 450, `nivel` 700, `fim` 993, `unidade`
   1400. Capturas pequenas em `docs/evidence/2026-11-06-trilha-ampla-simulador/`.
4. **Documentação final:** `docs/STATUS.md`, `docs/FILA.md` (item 68), as caixas do
   plano e o roadmap.
5. **PR da branch para a `main`**, com o CI verde. O merge, o build e a loja são do dono.
6. **Imagens:** radiografias de acervos abertos, pela seção "Imagens radiográficas"
   abaixo, e diagramas autorais em SVG a partir do campo `diagramIdeas` de cada aula.
   As duas coisas abrem as famílias `hotspot` e `comparison` na trilha ampla.

## Imagens radiográficas — autorizado em 2026-11-06

O dono autorizou baixar radiografias de acervos abertos (Wikimedia Commons), com
licença **CC0 ou CC BY**, para a trilha
([ADR, complemento de 2026-11-06](../../adr/ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla.md#complemento-de-2026-11-06--imagens-de-acervos-abertos)).
Nenhuma imagem foi baixada ainda. Não cobre CC BY-SA, NC, ND, Radiopaedia nem PDFs
locais. Faça **depois** dos aprofundamentos e da prova no simulador, nesta ordem:

1. **Piloto pequeno primeiro:** uma unidade só (M08, tórax), de 6 a 10 imagens. Não
   baixe em massa. Só amplie depois de ver o piloto no simulador.
2. **Por arquivo, antes de baixar:** abra a página do arquivo no Commons e leia a
   licença no modelo de licença da própria página, nunca num resumo de busca. Anote
   autor, URL da página, licença e URL da licença. **Recuse** a imagem que mostrar
   nome, número de registro ou data de paciente, e a que não disser na descrição que
   projeção e que região mostra.
3. **Arquivo:** baixe o original, registre o SHA-256, reduza para no máximo 1200 px
   no lado maior e cerca de 150 KB, e guarde em
   `radiant-app/assets/content/rtg-2026/imagens/<unidade>/<nome>.jpg`. O app funciona
   sem rede: imagem remota não serve.
4. **Registro:** um arquivo `content-manifest/rtg-2026/imagens.json` com, por imagem:
   `id`, `file`, `sourcePage`, `author`, `license`, `licenseUrl`, `retrievedAt`,
   `sha256Original`, `sha256Asset`, `modification` (por exemplo "recorte e redução"),
   `alt` e `usedIn`. O texto alternativo descreve a imagem sem entregar a resposta.
5. **Engenharia, com teste vermelho primeiro:** a extensão `wide` hoje recusa ativos.
   Ela precisa aceitar o tipo `licensed-image` (CC0 ou CC BY, com os campos acima) e
   as famílias `hotspot` e `comparison`; o verificador e o gerador precisam conhecer
   as imagens; e a `LessonFlowScreen` precisa passar aos renderers um resolvedor local
   de imagem (hoje ela não passa nenhum, e os renderers caem numa URL remota). O
   resolvedor da prévia editorial, em
   `radiant-app/src/features/editorial-preview/EditorialLocalDiagrams.ts`, é o modelo.
6. **Créditos no app:** uma tela "Créditos das imagens", alcançável pela
   Configuração, com autor e licença de cada imagem. CC BY exige o crédito. Sem essa
   tela, nenhuma build com imagem CC BY pode sair.
7. **Uso didático:** a imagem serve para orientação, lateralidade, anatomia e
   critérios técnicos (rotação, cobertura, inspiração). Nunca para o aluno achar
   doença. O item só afirma o que a descrição da imagem no acervo sustenta: um modelo
   de IA não é fonte para dizer o que uma radiografia mostra.
8. **Revisão:** o revisor independente reabre a página de cada arquivo, confere a
   licença e confere que o item não diz mais do que a descrição do acervo.

## Dívidas conhecidas

- Os itens de conferência perdem o retorno por alternativa da aula-fonte: o tipo do
  item só guarda um retorno de acerto e um de erro.
- `scripts/content/production-batch.mjs` não conhece a extensão `wide`. O gerador não
  o usa.
- `contentVersion` é fixo em `rtg-2026-<unidade>-v1`. Antes do primeiro release, o
  texto pode mudar à vontade. Depois dele, mudar texto de uma unidade publicada deve
  subir a versão. Isto é inferência do Claude a partir das chaves da revisão por item
  (`[lessonId, itemId, contentVersion]`); confira no código antes de decidir.
- Tamanho do bundle e tempo de abertura da Estude com 20 trilhas não foram medidos.
- O passo de conceito mostra o rótulo "IDEIA-CHAVE" em maiúsculas, herdado do renderer.
- A pista aberta reduz o ganho de memória daquele item (`hintPenalty`), regra que já
  existia. Acertos, estrelas e XP não mudam.
- VoiceOver, TalkBack, Android, aparelho físico e a build de Release não foram tocados.

## Estado no fechamento desta conversa

Medido em 2026-11-07, às 16:45.

- **Feito:** itens 1, 2 e 3 de "O que falta" (20 unidades, 132 aulas) e as frentes A,
  C e D do plano. Gate local com 234 suítes e 3074 testes; `loop validate`
  aprovado.
- **Aprofundamentos (item 2), medido em 2026-11-07:** os seis admitidos (`s-tc`, `s-rm`, `s-md`, `s-mn`, `s-rt` e `s-ir`), com parecer (48 aulas). A trilha tem 20 unidades e 132 aulas. Autor e revisor rodaram em Opus 5.5, e os pareceres dizem isso. Cada unidade gastou de 15% a 30% da janela de 5 horas, em um por vez.
- **Prova no simulador (item 3), medida em 2026-11-07:** feita na unidade M01, com oito
  achados; os dois da avaliação (som e aviso de vida) foram corrigidos em código no
  mesmo dia e vistos no simulador em 2026-11-08; o do relógio do coração (achado 3), o do
  fechamento repetido (achado 4) e o da medalha (achado 7) foram corrigidos e vistos em
  2026-11-10; três seguem abertos, em
  [`docs/evidence/2026-11-06-trilha-ampla-simulador/`](../../evidence/2026-11-06-trilha-ampla-simulador/README.md).
  As outras 19 unidades não foram abertas no simulador.
- **Imagens (item 6), medido em 2026-11-07:** piloto em M08.01 com duas radiografias CC0,
  abaixo da meta de 6 a 10, com parecer e créditos. Dezenas de arquivos foram recusados, e
  a lista ficou fora do repositório. Só a família `comparison` foi aberta: `hotspot` segue
  recusado porque nenhuma página aceita descreve marcos da imagem. O item não serve a
  leitor de tela. **Próximo passo:** o dono decide os três achados abertos da prova, se amplia as
  imagens por outro acervo ou por imagem marcada, e quando a PR sai do rascunho.
- **PR:** [#69](https://github.com/andersonsmelo/Radiant/pull/69) aberta em rascunho em 2026-11-06. No primeiro CI, `quality` passou e `content` reprovou num teste antigo (`concepts-reader.test.py` exigia conceitos, e o índice está vazio desde a retirada); o teste foi ajustado, e no commit `2bf480f` os dois jobs passaram. Confira com `gh pr checks 69` e só tire do rascunho com os aprofundamentos e a prova no simulador feitos.
- **Documentação (item 4):** arquitetura, fluxo do aluno, roadmap e lições do `AGENTS.md` atualizados em 2026-11-06; o [relatório](2026-11-06-trilha-ampla-relatorio.md) resume tudo.
- **Pendências pequenas de engenharia:** `IosHomologationService` não apaga as chaves
  `@radiant:streak_freeze_v1`, `@radiant:daily_missions_v1` e
  `@radiant:unit_celebrations_v1`; a frase-gancho da recuperação não aparece na
  revisão; o bônus de missão só é pago quando Estude, Perfil ou `/missions` são
  abertos no mesmo dia; a Estude mantém um tocador com nove sons, custo não medido.
- **Reinício do Mac apaga os rascunhos:** em 2026-11-07, o scratchpad em `/private/tmp`
  amanheceu vazio. Rascunho e parecer só existem ali até a admissão, então admita logo
  depois da aprovação. O autor grava o rascunho inteiro assim que o tiver.
- **Roteiro do Maestro:** para jogar uma unidade, gere o roteiro a partir das aulas e
  leia o rótulo pela árvore, em vez de capturas: elas custaram 280 mil tokens de contexto
  numa só aula. A ordem inicial da ordenação está no lote gerado.
- **Pastas temporárias:** os rascunhos e pareceres desta conversa estavam em
  `/private/tmp/claude-501/…/scratchpad/rtg/`. Tudo o que importa já está no
  repositório; a pasta pode ter sumido.
