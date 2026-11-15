# ADR 2026-11-13: delegação da atualização 1.6 e merge pelo controlador

- **Data:** 2026-11-13 (delegação) e 2026-11-15 (merge)
- **Decisor:** Anderson Melo (dono)
- **Registrado por:** Claude, como controlador das frentes, em 2026-11-15

## Contexto

Em 2026-11-13 o dono pediu a atualização 1.6 e mandou uma sessão do Claude
atuar como líder técnico: distribuir as tarefas a outras sessões, com briefs
detalhados, avaliar cada retorno e corrigir os erros. Autorizou o uso de
qualquer skill, plugin, hook ou MCP, a escolha do modelo de cada sessão e o
avanço contínuo, com liberdade para decidir pelo objetivo.

O pedido cobria: ampliar a trilha pela ementa do curso, diversificar aulas e
interações, micro e macrointerações, diálogos, sons e incentivos, o
ranqueamento, widgets, notificações e decorações personalizadas, a evolução dos
personagens com um padrão, e incentivos para o aluno gratuito assinar.

Em 2026-11-15, com as PRs abertas, o dono escreveu: "vc mesmo deve fazer a merge
depois que todas frentes terminarem".

## Decisões

1. **Oito frentes, cada uma numa sessão e numa PR.** F1 trilha ampliada, F2
   formatos de interação, F3 sons e microinterações, F4 liga semanal, F5
   widgets, F6 notificações e decorações, F7 personagens, F8 convites de
   assinatura. As decisões de cada frente estão nas ADRs próprias, de 2026-11-13
   e 2026-11-15.
2. **Tudo que muda comportamento entra atrás de chave desligada por padrão.** As
   exceções são as quatro famílias de interação e as 25 aulas novas, que são
   conteúdo, e a regra de desbloqueio da trilha (item 4).
3. **O ranqueamento usa o Game Center.** A API pública está fora do ar e o app
   não tem login; um placar próprio exigiria servidor e conta. Competidor
   simulado é proibido.
4. **Unidade inserida no meio da trilha não tira acesso de quem já avançou.**
   As unidades M15 e M16 entram depois de M03 e de M09, na ordem da ementa. Uma
   unidade concluída ou iniciada continua aberta, e a unidade inserida atrás do
   aluno aparece como "Disponível", sem puxar a tela inicial de volta. Quem
   ainda não começou a unidade seguinte passa a ver a nova antes dela.
5. **"Decorações" foi lido como cosméticos do perfil.** O pedido dizia
   "decações personalizadas"; o controlador avisou a leitura e o dono não a
   contestou.
6. **Convite por sequência em risco ficou de fora.** A assinatura não protege a
   sequência, e o convite prometeria o que o código não entrega.
7. **Fala em voz alta dos diálogos não entrou.** Pede um módulo nativo novo
   (`expo-speech`); fica como pendência do dono.
8. **O merge das PRs da 1.6 foi feito pelo controlador,** por ordem do dono, uma
   PR por vez, com `gh pr merge --merge`, esperando o CI da `main` entre elas.
   Leitura do controlador: a ordem vale só para essas PRs.

## O que continua com o dono

Build de distribuição, App Store Connect, portal da Apple, atualização remota,
ligar qualquer chave e o merge de qualquer outra PR.

## Consequências

- A `main` em `0428b7d` tem as oito frentes, com o CI verde depois de cada merge.
- A revisão automática do Codex, disparada quando cada PR saiu do rascunho,
  achou cinco defeitos que a revisão do controlador não tinha pego: um na regra
  de retomada da trilha e um em cada uma de liga, decorações, convites e
  widgets. Todos foram corrigidos com teste antes do merge.
- Nada do que é novo foi visto em aparelho. O que falta ver está no
  [`STATUS.md`](../STATUS.md).
