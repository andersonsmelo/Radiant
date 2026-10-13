# Radiant — experiência de estudo, primeiro pacote visual

**Direção aprovada por Anderson em 2026-10-12**, nesta conversa, pela resposta
“Aprovar esta direção e preparar a implementação”. Referência visual aprovada:
[prancheta](../../design/2026-10-12-study-experience.html), commit `bb450a5`.
Esta spec traduz a direção para o runtime. Contrato aplicado localmente em
2026-10-13; [evidência e limites](../../evidence/2026-10-12-study-experience-implementation.md).
Matriz iOS registrada; revisão final e validação integral em fechamento.
Sem publicação; limitações nativas permanecem explicitadas na evidência.

## Objetivo e limites

Melhorar leitura e clareza de Estude, atividade e conclusão no fluxo já
disponível. Preservar galaxy/Sora/Pixel, navegação nativa, duas abas, catálogo,
vidas, assinatura, reforço, XP, revisão e backup. Não ativar V3 nem promover
L1 híbrida; não instalar Rive/Lottie, produzir voz ou criar analytics.
Conteúdo e números da prancheta são exemplos, nunca dados para o app.

## Contrato por tela

**Estude:** contexto e progresso da unidade → uma recomendação acionável →
trecho da trilha. A recomendação vem de `snapshot.nextRecommendedNode`, com
rota/eligibilidade pelos helpers existentes. Ela ocupa o header rolável da
`FlatList`; remover o CTA duplicado no rodapé. Preservar a trilha virtualizada,
IDs e mapa; não criar catálogo/lista paralela. Pixel pequeno e decorativo.
Com texto grande, todo o header rola; safe area/tab bar continuam reservadas.

Recomendação distingue retomada, revisão devida, avaliação, conquista e lição.
Nomear a ação pelo tipo real: uma avaliação pausada não vira “Retomar lição”.
Sem próximo nó elegível, não desenhar botão principal inerte nem prometer novo
arco. Mostrar revisão futura com data real quando disponível. **Revisão futura
não bloqueia outra lição elegível.** Ausência de data não fabrica data.
Zero vidas reutiliza os guards e a folha existentes: não inferir que todo nó
custa vida nem aplicar o bloqueio da fixture legada ao primeiro contato híbrido.

**Atividade:** barra/saída nativas → conteúdo → escolha → confirmação →
explicação → continuidade. Reduzir decoração atrás do texto; preservar os
renderers V2 e legados. Selecionar/trocar alternativa continua sem confirmar,
persistir, cobrar vida ou emitir resultado. Para múltipla escolha, nomear a
confirmação “Conferir resposta” e sincronizar hints de acessibilidade. Demais
formatos e apresentações mantêm seus CTAs atuais nesta fatia. A tela/player
continua sendo dono da confirmação; renderer só recebe valor/callback.

O retorno correto/incorreto usa a explicação aprovada e estado do player.
Pixel acompanha esse estado sem determinar resultado ou executar outra
transação. Reutilizar feedback/sons/haptics existentes, sem evento duplicado.
Pausar, relançar ou voltar da assinatura preserva o cursor/seleção conforme
contratos atuais. Não transferir o loop híbrido para a tela legada nesta fatia.

**Conclusão:** reduzir a faixa de celebração, manter Pixel/estrelas e mostrar
resultados em linhas. Texto factual baseado no resultado atual; não inferir
competência clínica ou progresso novo de repetição de lição. Manter todos os
casos: XP positivo, zero (“Progresso registrado”), null (“Sem XP nesta
tentativa”), estrelas sem melhora, unidade sem total e revisão ausente.
Usar data/intervalo fornecido pelo fluxo, sem fixar “1 dia”. Avaliação da aula
continua opcional, com nota já dada preservada; avaliação da loja segue nas
rotas de revisão/conquista, nunca no quiz por causa do redesign.

## Sistema visual e acessibilidade

Tokens semânticos do app; escala de espaço existente; superfícies de leitura
menos translúcidas. Fundo focado nas telas de estudo, preservando o padrão
de outras telas e a pausa por foco/movimento reduzido. Controles ≥44 pt iOS e
≥48 dp Android; texto cresce sem truncar; estado tem texto/ícone, além da cor.
Texto necessário nunca depende de Pixel, som ou animação. Não copiar px/fontes
base64 do HTML para produção; usar recursos nativos existentes.

## Aceite

1. A mesma jornada recomenda a mesma ação/rota antes e depois do layout.
2. Só uma ação principal; header/trilha e rodapé não escondem texto ou controles.
3. Concluir L1 legada libera a próxima lição elegível, mesmo com revisão futura.
4. Revisão ainda futura e conquista já coletada não recebem ação indevida.
5. Selecionar duas alternativas cobra zero vidas; confirmar uma vez produz
   uma resposta/transação. Toques repetidos não duplicam os efeitos existentes.
6. Todos os casos de XP/estrelas/total/revisão acima ficam legíveis e corretos.
7. Pausa/retorno/offline/assinatura e reforço persistente continuam funcionando.
8. Texto ampliado, movimento reduzido e leitura assistiva são verificados
   nativamente; browser não fecha esses gates.

Implementar pelo [plano executável](../plans/2026-10-12-study-experience-plan.md).
Novo build de distribuição, release, conteúdo L1 e coleta externa continuam
fora da autorização “preparar a implementação”.
