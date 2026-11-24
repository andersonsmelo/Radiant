# ADR 2026-11-18: trilha dobrada, com base internacional e menos texto (1.7)

- **Data:** 2026-11-18
- **Decisor:** Anderson Melo (dono)
- **Registrado por:** Claude, como controlador, em 2026-11-18

## Contexto

Em 2026-11-18 o dono pediu que a próxima versão traga a trilha `rtg-2026` com o
dobro do tamanho, em unidades divididas, sem menção a lei brasileira nem a código de
ética (pensando numa possível internacionalização) e com a entrega diversificada,
porque as aulas dependem demais de texto: personagens, imagens, vídeos curtos e
pequenos jogos. O conteúdo continua guiado pela ementa do curso de Tecnologia em
Radiologia e de suas especializações. Ele autorizou subagentes em modelo menor, com
o controlador julgando os resultados, e o uso de qualquer skill, plugin, hook ou MCP.

A medição do ponto de partida e o desenho estão na
[especificação](../superpowers/specs/2026-11-18-trilha-dobrada-design.md), que o dono
aprovou na mesma conversa.

## Decisões do dono

1. **Dobrar aulas e unidades:** cerca de 48 unidades e 310 aulas. Cada unidade atual
   ganha uma unidade irmã com a outra metade do tema.
2. **A unidade irmã é obrigatória para todos**, inclusive para quem já estuda.
3. **Animação em código no lugar de vídeo.** O app não tem vídeo nem servidor.
4. **Sem lei brasileira e sem código de ética** no conteúdo.
5. **Delegação da noite de 2026-11-18:** "você deve trabalhar a noite toda, tem
   autoridade para tomar decisões para manter a continuidade da implementação do
   plano". Leitura do controlador: cobre decisões de construção naquela noite. Merge,
   build, loja e gasto novo seguem com o dono.

## Decisões do controlador, sob a delegação

1. **Cinco fases, cada uma com plano próprio:** A base internacional, B formatos,
   C unidades irmãs, D conversão das aulas atuais, E integração.
2. **Base internacional, não ausência de base.** O fato técnico e de segurança fica,
   apoiado em IAEA (GSR Part 3, SSG-46), ICRP, OMS e, na ressonância, no manual de
   segurança do ACR. O que muda de país para país vira princípio mais "o serviço e as
   regras locais definem".
3. **Número que só a norma brasileira fixava sai**, salvo fonte aberta lida que o
   sustente: frequência de testes, prazo de relato, idade mínima do acompanhante.
   Ficam os limites de dose da ICRP 103 e a faixa de 150 a 200 N da compressão
   motorizada, que a IAEA sustenta.
4. **Consentimento, sigilo e privacidade ficam** como cuidado com o paciente, apoiados
   na Declaração de Lisboa da WMA. O dono pediu a retirada das menções a lei e a
   código de ética; o tema não saiu.
5. **O verificador barra a volta.** `scripts/content/rtg-national-terms.mjs` reprova
   lei, norma, órgão e conselho de um país em qualquer campo de texto da aula-fonte.
6. **Autor em modelo menor, revisor independente em modelo maior, controlador
   decide.** Nenhum lote entrou sem a revisão independente abrir as fontes.

## Consequências

- A trilha deixa de ensinar a regra brasileira específica (grupos de resíduo por
  letra, periodicidade de testes, quem lauda). O aluno brasileiro perde esse detalhe;
  o aluno de qualquer país ganha um conteúdo que não está errado onde ele estuda.
- Nenhuma aula ou interação mudou de identificador, tipo, papel ou marca de
  segurança: o progresso de quem já estuda continua valendo.
- A tradução do conteúdo e da interface não faz parte desta decisão.

## Evidência

[`docs/evidence/2026-11-18-base-internacional/`](../evidence/2026-11-18-base-internacional/README.md).
