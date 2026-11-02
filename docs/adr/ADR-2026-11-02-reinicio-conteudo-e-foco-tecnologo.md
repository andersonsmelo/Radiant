# ADR — Retirada integral das aulas e novo planejamento de conteúdo

**Data:** 02/11/2026, America/Bahia. **Estado:** aceita quanto ao escopo e à ordem;
pesquisa curricular e desenho da experiência serão propostas revisadas, sem aulas novas ativadas.
**Decisor:** Anderson Melo, nesta conversa.

## Instrução que altera a ordem anterior

Anderson pediu planejamento próprio de conteúdo, pesquisa ampla na internet de
aplicativos semelhantes, fontes gratuitas, ementas de radiologia e especializações,
sequência lógica de aulas e questões, interação, gamificação, animação,
microinterações e incentivos. Determinou apagar todas as aulas antes de iniciar
a pesquisa e retirar a documentação curricular anterior para evitar duplicidade.

Na confirmação do escopo respondeu:

> Sim, retirar todo o conteúdo de aulas, inclusive exemplos e protótipos

Sobre o documento antigo:

> Não sei, você deve analisar a documentação

E definiu o público:

> Graduação tecnológica em radiologia, seguida de especializações

Esta decisão sucede a ordem de execução da
[ADR G4](ADR-2026-11-01-t15-inventario-aprovado-g4.md): a retirada no checkout de
desenvolvimento antecede a definição do currículo substituto G7. O inventário T15-v1
continua congelado como evidência da decisão anterior; a autorização atual inclui
também exemplos da bancada e protótipos V3. Não se exige nova confirmação da retirada
já pedida. O novo currículo será pesquisado e proposto, sem promover conteúdo clínico.

## Escopo da retirada

Retirar conteúdo de aulas dos dados legados/IA, H4/registro de produção, exemplos
exposição/colimação, protótipos V3 e prosa embutida em apresentadores/geradores;
incluindo o exercício de kV embutido na apresentação inicial; retirar bundles,
claims e cópias curriculares/documentais, bem como os seeds de dados
SQL 002/003 do repositório. Não executar SQL nem alterar banco remoto. O schema SQL 001
permanece; a história original dos artefatos continua recuperável pelo Git.

O catálogo deve declarar estado explícito `retired`, e o runtime deve recusar
reintrodução por catálogo remoto, fallback ou deep link antigo. Ausência acidental
de arquivos não equivale a retirada válida. Os testes usam fixtures sintéticas,
sem copiar as aulas removidas; nenhuma aula sintética é publicada no catálogo ativo.

Preservar motores genéricos, contratos/tipos, geometria, modelos físicos, renderizadores,
UI Medalhão/Pixel/Sora, direitos, taxonomia, biblioteca de referência e extrações locais.
Preservar economia, assinaturas, primeira resposta, retomada e schema guards. Não ler
PDFs/extrações locais nem dados privados, não limpar/migrar AsyncStorage e não tocar
o simulador reservado. Nenhum build, instalação, EAS/OTA, merge ou publicação em loja.
A retirada é deste checkout, não do binário já distribuído.

Manter os papéis de validação de conteúdo, direitos e qualidade. Adaptar somente
os contratos dependentes de datasets aposentados, comprovando zero conteúdo ativo
sob estado explícito e mantendo falhas para conteúdo residual/ausência não declarada.
Não desligar validadores nem substituir regressões genéricas por checks sempre verdes.
A perda dos roteiros operacionais ligados às aulas antigas deve ficar explícita;
não atribuir sua cobertura a um smoke de catálogo vazio.

## Uma entrada canônica para o conteúdo novo

O principal plano curricular anterior é a spec V3 de 27/08/2026. Também são retirados
planos/fichas L1/L2, runbook do Arco 1, candidato H4, documento das aulas de exemplo
e atlas que reproduz as aulas antigas. ADRs, relatórios e evidências históricas
continuam como histórico, sem se apresentar como currículo vigente.

A entrada única do planejamento passa a ser
[Planejamento de conteúdo](../plans/2026-11-02-planejamento-conteudo-radiant.md).
A pesquisa de fontes/ementas/concorrentes será um anexo de evidências referenciado
pelo plano, sem manter um segundo currículo. `CONTENT_PIPELINE.md` continua sendo
contrato técnico de produção e direitos, apontando para o plano novo.
A fundação técnica V3 e specs de pipeline preservadas deixam explícito que as
sequências/propostas curriculares antigas foram substituídas por esta decisão.

## Gates e proveniência

G1=A/Q1 não são reabertos. T14/G2 das amostras retiradas deixam de ser trabalho
para promover essas aulas; o conteúdo novo terá revisão própria. Capturas e E2E
legados permanecem históricos e não aprovam o catálogo vazio ou o currículo futuro.
T18 não pode consumir o container reservado nem fabricar dados para reproduzir
uma trilha removida. O desenho e o primeiro lote do novo currículo continuam
sujeitos à revisão de Anderson e à aprovação editorial/clinicamente aplicável.

Base limpa `34147e114de338a73a02ec68e8079c6bf3296c1d`, branch
`claude/trilha-medalhao-design`, worktree `trilha-2026-10-20`.
A implementação começou no writer `run-1793624313125-0d00dd8b`, união de235
arquivos. Ele foi fechado de `editing`, sem sucesso declarado, para incluir três
consumidores de testes descobertos. O sucessor `run-1793633695270-2992c675`,238
arquivos, também foi fechado de `editing` após revisão independente apontar
runbook/API README ainda instruindo usar artefatos retirados. As mudanças foram
preservadas e auditadas contra a união nominal; não houve edição fora dela.
O writer `run-1793634647644-24849977`,240arquivos, teve primeiro gate12/15PASS;
foi fechado sem sucesso para declarar o teste Python de claims que ainda exigia
conteúdo antigo. A outra causa do gate era uma variável de fixture interpretada
como chave de storage; a guarda permaneceu intacta. Writer de fechamento
`run-1793651829785-f0e48499`,241arquivos, passou15/15, mas foi encerrado sem
`step finish` após auditoria revelar o exemplo didático do primeiro uso ainda
embutido no apresentador. O writer `run-1793652255899-681f207a`,243arquivos, retirou o exercício e foi
fechado de `editing` para incluir reentrada e a frase de convite do componente.
Writer de fechamento `run-1793652411232-ce3ced90`,246arquivos, inclui essa correção
e valida o diff completo contra `34147e1`.
Os runs anteriores não recebem sucesso retroativo.
Abertura anterior `run-1793624190997-c5e9fff3` foi fechada sem nenhuma edição após
preflight descobrir um gerador com corpus fora da primeira lista. Nenhum sucesso
retroativo: a baseline de implementação estava limpa.
