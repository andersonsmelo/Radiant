# Parecer de revisão — S-OD

Data: 2026-11-13
Revisor: Claude (Opus 5.5, claude-opus-5-5), agente independente do autor, sob a ADR-2026-11-05

Esta é uma revisão feita por IA, não por profissional de radiologia ou de odontologia. Conferi fatos em fontes públicas, limites profissionais e qualidade dos itens. A exatidão clínica fina continua merecendo um olhar humano da área.

## Achados e correções

| Aula/item | Problema | Correção aplicada | Fonte consultada |
| --- | --- | --- | --- |
| S-OD.01 conceito, i4, CK2, fechamento | O vocabulário de anatomia citava FDA 2012 e Rondon 2014, que usam os termos sem defini-los. O conceito omitia os caninos, e "dentes posteriores = pré-molares e molares" não estava em nenhuma fonte lida. | Conceito reescrito: incisivos na frente, caninos nos cantos, pré-molares atrás dos caninos e molares no fundo da boca. i4 e CK2 perguntam agora quais grupos ficam atrás dos caninos, e as pontos-chave e o fechamento acompanham. Fonte nova `teachme-dentition` nos itens de anatomia. | TeachMeAnatomy, The Dentition; MSD Manual, Dental Anatomy |
| S-OD.01 recuperação guiada | O gancho ("posterior quer dizer…") não tinha relação com o item, que pergunta pela maxila. | Gancho trocado para "a arcada de baixo pertence à…", que prepara o item sem entregar a resposta. | — |
| S-OD.02 i2 (categorize) | "Usado para avaliar o desenvolvimento dos dentes" (panorâmico) e "Usado em ortodontia e cirurgia oral" (feixe cônico) não tinham resposta única: a FDA cita panorâmica **ou periapical** para dentes em desenvolvimento, e a panorâmica também serve à ortodontia. | Trocados por "Gira ao redor da cabeça, fora da boca" e "Entrega um volume, e não uma imagem plana", os dois ensinados no conceito. | FDA/ADA 2012; ADA X-rays/Radiographs |
| S-OD.02 i5 | O retorno do distrator "um dente só… e em volume" dizia que esse era "o perfil do intraoral", mas o intraoral não produz volume. | O retorno separa agora o volume, que é da tomografia, do detalhe de poucos dentes, que é do intraoral. Na correta e no CK1, "a arcada" passou a "as arcadas", porque a panorâmica mostra as duas. | Cleveland Clinic, Dental X-Rays |
| S-OD.02 conceito | As INs 94 e 95 eram citadas sem confirmação. | Confirmadas na listagem do CBR: IN 94/2021 trata dos sistemas extraorais e IN 95/2021, dos intraorais. A ordem do conceito ("intraorais e extraorais… INs 95 e 94") está certa. A nota da fonte foi atualizada. | CBR, página de legislação Anvisa |
| S-OD.03 i2 (matching) | "Panorâmica: avaliar o desenvolvimento dos dentes" também valia para a periapical, o que deixava o par ambíguo. | O lado direito passou a "Mostrar dentes e maxilares numa imagem plana". | FDA/ADA 2012 |
| S-OD.03 conceito, i3, CK2 | O termo "dentes posteriores" aparecia sem ter sido ensinado, depois da correção da S-OD.01. | Trocado por "dentes de trás", tradução fiel de "posterior bitewings". | FDA/ADA 2012 |
| S-OD.03 i5 | Dona Marta era chamada de "o paciente" e "ele". | Concordância corrigida para "a paciente" e "ela". | — |
| S-OD.03 (vários) | Periapical, interproximal e oclusal não tinham fonte sobre o que cada uma mostra além da FDA. | Fonte `cleveland-dental-xrays` acrescentada. A FDA sustenta a oclusal "para localizar a posição de um dente" e a interproximal nas faces proximais. | Cleveland Clinic; FDA/ADA 2012 |
| S-OD.04 i4 | A ajuda perguntava "mais perto ou mais longe do foco", termo ambíguo. | Ajuda reescrita: "a cabeça estava à frente ou atrás da região de foco?". | Rondon 2014 |
| S-OD.05 conceito | O conceito dizia que a ADA aponta a tomografia como "o maior contribuinte isolado". A página diz "major single contributor", que não quer dizer o maior. A frase "bem maior" também estava sem medida. | Reescrito como "grande contribuinte". A dose aparece como "de algumas vezes a dezenas de vezes a de uma panorâmica", como na tabela da HPA. | ADA; HPA-CRCE-010 |
| S-OD.06 conceito | A regra "sem cabine, o operador fica a no mínimo 2 metros" estava geral demais. O art. 54, parágrafo único, só a aplica ao equipamento **intraoral** e admite, como alternativa, o levantamento radiométrico. | A frase foi cortada, porque nenhum item a cobrava. | RDC 611/2022, art. 54 |
| S-OD.06 i2 (ordering) | O enunciado dizia "na ordem ensinada nesta aula", mas o conceito não ensinava a sequência. | O conceito declara agora a ordem: pedido, proteção, colimação, ponto de disparo e disparo com a supervisora. | Guia, seção 6.6 |
| S-OD.06 i3, CK2; S-OD.07 recuperação de transferência | Os retornos afirmavam que "não existe regra universal" sobre avental e protetor de tireoide. Isso é afirmação factual, e a RDC 611 tem regra geral condicionada (art. 61). | Os retornos dizem agora que a alternativa afirma uma regra por conta própria e que o que vale é o protocolo do serviço. "Avental no pescoço" virou "protetor no pescoço". | RDC 611/2022, art. 61; ADA |
| S-OD.06 recuperação guiada | "Um adulto que não esteja grávida" tinha erro de concordância, era incompleto diante do art. 56 (há outras condições) e o gancho não tinha relação com o item. | Item invertido: "quem **não** pode ser acompanhante?". A correta é a gestante, e os distratores são adultos voluntários. O gancho foi trocado. | RDC 611/2022, art. 56 §3º |

Total: 15 achados corrigidos.

## Fatos confirmados

- RDC 611/2022 (cópia compilada do CBR, texto extraído e lido): https://cbr.org.br/wp-content/uploads/2023/08/RDC-ANVISA-de-2022-no-611_Requisitos-sanitarios-de-organizacao-e-funcionamento-de-servico-de-radiologia-diagnostica-ou-intervencionista.pdf
  - art. 43: justificação, otimização, limitação da dose e prevenção de acidentes;
  - art. 56: acompanhante só quando imprescindível para conter, confortar ou ajudar, e o §3º proíbe gestantes e menores de 18 anos;
  - art. 78: opera o equipamento só quem é legalmente habilitado ou está em treinamento sob supervisão direta de profissional legalmente habilitado. A leitura "estudante em treinamento sob supervisão direta" é fiel ao texto;
  - art. 79, I: é proibida a exposição deliberada com o único objetivo de demonstração ou treinamento;
  - art. 54, parágrafo único: a dispensa de cabine vale para o equipamento intraoral, com 2 m do cabeçote e do paciente **ou** levantamento radiométrico. A afirmação foi removida da aula;
  - art. 61: blindagem de órgãos radiossensíveis, tireoide inclusive, quando estiverem no feixe primário ou a até 5 cm dele, salvo se ela degradar a informação ou aumentar a dose. Esse artigo motivou a correção dos retornos sobre "regra universal".
- INs 94/2021 (extraoral) e 95/2021 (intraoral): https://cbr.org.br/en/comissao-de-protecao-radiologica/legislacao-e-recomendacoes-cpr-cbr/anvisa-cpr-cbr/
- ADA:
  - a tomografia de feixe cônico é "major single contributor", com usos em cirurgia oral, ortodontia e endodontia e imagem 3D das estruturas maxilofaciais;
  - o protetor de tireoide não é mais recomendado;
  - a colimação restringe o feixe à área de interesse.

  https://www.ada.org/resources/research/science-and-research-institute/oral-health-topics/x-rays-radiographs
- FDA/ADA 2012:
  - colimação ao tamanho do receptor sempre que viável;
  - oclusal para localizar a posição de um dente;
  - bitewings posteriores para as faces proximais;
  - panorâmica ou periapical para os terceiros molares em desenvolvimento.

  https://www.fda.gov/media/84818/download
- Rondon 2014:
  - queixo elevado: sombra radiopaca do palato sobre as raízes superiores;
  - língua sem contato com o palato: faixa radiolúcida no ápice dos dentes superiores;
  - cabeça girada: um lado alargado e o outro encurtado;
  - cabeça à frente da camada de foco: dentes anteriores borrados e estreitados; atrás dela, alargados;
  - movimento: borramento e degraus na borda inferior da mandíbula.

  https://pmc.ncbi.nlm.nih.gov/articles/PMC3972400
- Van Acker 2019: usar o menor campo de visão disponível compatível com a aplicação clínica, critério SEDENTEXCT. Campo menor dá dose menor. https://pmc.ncbi.nlm.nih.gov/articles/PMC6476357
- HPA-CRCE-010 (texto extraído e lido):
  - panorâmica: 24 µSv;
  - tomografia com campo pequeno: 48 a 652 µSv; com campo grande: 68 a 1073 µSv. As faixas se sobrepõem;
  - a tomografia dá de algumas vezes a dezenas de vezes a dose da panorâmica;
  - usar o menor volume necessário;
  - campo grande para áreas além da região dentoalveolar.

  https://www.scottishdental.nhs.scot/wp-content/uploads/2014/10/HPA-CRCE-010_for_website.pdf
- TeachMeAnatomy:
  - coroa e raiz, e a ponta da raiz é o ápice;
  - incisivos na frente, caninos nos cantos, pré-molares entre os caninos e os molares, molares no fundo;
  - arcadas maxilar e mandibular;
  - dentes presos ao osso alveolar.

  https://teachmeanatomy.info/head/other/child-adult-dentition
- MSD Manual: coroa e raiz; osso alveolar e ligamento periodontal sustentam o dente. https://www.msdmanuals.com/professional/dental-disorders/approach-to-the-dental-patient/dental-anatomy-and-development
- Cleveland Clinic: o que mostram a interproximal, a periapical, a oclusal, a panorâmica e a tomografia de feixe cônico. https://my.clevelandclinic.org/health/diagnostics/11199-dental-x-rays

## O que não foi verificado

- O texto das INs 94 e 95 não foi lido. **Mantido** só o número e o assunto, confirmados na listagem do CBR. Nenhum conteúdo das INs é atribuído a elas.
- SEDENTEXCT aparece só como nota de fonte, por meio de Van Acker 2019. **Mantido** como nota, sem afirmação na aula.
- "Dentes posteriores = pré-molares e molares" não está em nenhuma fonte lida. **Removido**: a aula fala agora em "atrás dos caninos", que a fonte sustenta.
- A ordem de conferência da S-OD.06 é convenção didática, não fato normativo. **Mantida** porque o conceito e o retorno a declaram como a ordem desta aula.
- S-OD.07 i2 e a recuperação guiada, sobre divergência de identificação, citam a RDC 611, que não tem artigo específico sobre conferir a identidade do paciente. **Mantidos** porque não afirmam nada sobre a norma: a conduta "parar e chamar a equipe" é a regra de limite profissional do guia.

## Mecânica

`node scripts/content/rtg-lesson-lint.mjs <unidade>` imprime OK depois das correções. Conceitos alterados: S-OD.01 com 95 palavras, S-OD.05 com 100, S-OD.06 com 98. A posição das respostas corretas nos 14 itens de conferência não mudou.

Resultado: aprovado com correções. Os fatos de segurança e de norma agora batem com o texto lido da RDC 611/2022 e com as fontes. A regra dos 2 m, que estava ampla demais, saiu da aula, e todo item de escolha tem uma única resposta defensável.
