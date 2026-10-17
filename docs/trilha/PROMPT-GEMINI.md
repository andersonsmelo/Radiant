# Brief para o Gemini — primeira contribuição à trilha

> **Substituído em 2026-10-17** pelo [prompt do Argon](PROMPT-ARGON.md): Anderson
> preferiu um norte sem escopo fechado em vez desta tarefa só de pesquisa. O texto
> abaixo fica como histórico, e o roteiro do P6 continua útil como referência.

**Preparado por:** Claude Opus 5.5 (Anthropic, `claude-opus-5-5`), 2026-10-17.
O Claude coordena e revisa o trabalho das IAs neste projeto, a pedido de
Anderson.
**Uso:** colar o bloco abaixo como primeira mensagem ao Gemini, depois do
prompt geral de contribuição. O estado vivo continua só no
[`STATUS.md`](../STATUS.md) e na [`FILA.md`](../FILA.md).

```text
Você vai contribuir com o Radiant, app de estudo para estudantes e técnicos de
radiologia no Brasil (React Native/Expo, TypeScript, local-first; iOS publicado
com assinatura paga, Android em teste). Raiz do repositório:
/Users/anderson/Developer/Radiant.

ANTES DE TUDO, leia nesta ordem:
1. docs/trilha/README.md — mapa da frente da trilha.
2. docs/trilha/avaliacoes/2026-10-17-revisao-do-trabalho-do-codex.md e
   docs/trilha/plano/2026-10-17-avancos-e-coordenacao-multi-ia.md — o estado
   revisado em 17/10 e o protocolo entre as IAs. Siga a seção 4 do segundo.
3. AGENTS.md — regras do repositório. As que mais custam caro: toda escrita
   passa por um run do Loop; há um escritor por vez; a CLI `loop` exige Node 24
   (export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"); nunca encadeie
   os comandos de fechamento com &&.
4. docs/STATUS.md e docs/FILA.md (itens 45, 52 e 54).
Depois confira git log, branches e a FILA para não refazer trabalho em
andamento.

SEU PAPEL: pesquisa. Neste primeiro ciclo você NÃO altera código. Sua entrega
é um documento novo em docs/trilha/pesquisas/. O Claude revisa a entrega antes
de ela ser marcada como feita.

PRIMEIRA TAREFA — P6 / FILA 52: acervo de imagens radiológicas com licença
compatível com uso COMERCIAL. O app é pago por assinatura, então licença
"não comercial" (NC) não serve, por mais conhecida que seja a fonte.

Pergunta: de onde o Radiant pode tirar imagens radiológicas reais para
exercícios de celular, com direito verificável de uso comercial, proveniência
rastreável e anonimização adequada?

Para cada fonte candidata, registre, sempre com o texto da licença ou do
termo de uso lido na fonte primária, URL e data de acesso:
- licença exata e versão. Atenção: no TCIA a licença é POR COLEÇÃO, não do
  portal inteiro;
- se permite uso comercial, se exige atribuição, se tem ShareAlike e o que o
  ShareAlike implicaria para o conteúdo do app;
- restrições de redistribuição, de modificação (recorte, anotação, setas) e
  de embarcar a imagem no binário;
- termo de uso de dados ou cadastro exigido (PhysioNet, desafios RSNA etc.);
- modalidades e regiões cobertas, e se serve ao foco decidido pelo dono:
  QUALIDADE TÉCNICA DA IMAGEM (posicionamento, exposição, artefatos), que é o
  trabalho do técnico, e não diagnóstico médico.
  Ver docs/adr/ADR-2026-10-16-foco-piloto-imagem-qualidade-tecnica.md;
- anonimização: o que a fonte garante (DICOM, pixels queimados) e o que o
  Radiant ainda precisaria fazer.

Inclua também as alternativas a acervo público: parcerias com escolas
técnicas ou serviços de imagem brasileiros, imagens de phantom produzidas pelo
projeto e imagens sintéticas. Para cada uma, diga o que exigiria em LGPD,
consentimento e contrato. Não precisa esgotar o tema jurídico; diga o que
precisa de advogado.

Entrega: docs/trilha/pesquisas/2026-10-<dia>-licencas-de-imagem-radiologica.md,
contendo:
- autoria (Gemini e o modelo exato), data, pergunta e método;
- uma tabela por fonte;
- uma lista curta recomendada, com 3 a 5 fontes, e por quê;
- as fontes descartadas e por quê;
- o que fica para o dono e para um advogado decidirem;
- o grau de CADA afirmação: [oficial], [terceiro], [usuário], [estudo],
  [código], [visto] ou [inferido].
Isto NÃO é parecer jurídico. Diga isso no documento. Não baixe nem embarque
imagem nenhuma no repositório.

Como gravar:
1. git status --porcelain (anote a sujeira existente e não mexa nela).
2. node scripts/loop/abrir.mjs "P6: pesquisa de licenças de imagem"
   docs/trilha/pesquisas/<arquivo>.md docs/FILA.md
3. Escreva o documento. Na FILA, no item 52, acrescente uma linha
   "Em andamento: Gemini <modelo>, <data>" com o link do documento. Não reescreva
   as outras linhas.
4. Feche, lendo o `code` de cada resposta antes do comando seguinte:
   loop validate --run <id> → loop step finish --run <id> → loop run close --run <id>.
   Se aparecer PROJECT_BUSY, outra IA está escrevendo: espere e avise.
5. Relate os arquivos tocados, o id e o estado final do run, e o que ficou em
   aberto.

Decisões de produto são de Anderson. Pergunte a ele quando a decisão for dele.
Discordar das pesquisas anteriores é bem-vindo; faça isso num documento novo,
sem editar o de outra IA.
```
