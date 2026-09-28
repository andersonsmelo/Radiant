# ADR — A 1.4 sai com som e vibração na lição do aluno (2026-09-28)

**Status:** aceita  
**Decisor:** Anderson Melo (dono do projeto), em 2026-09-28, de manhã, antes
da build de produção da 1.4. O agente levou duas opções, e o dono escolheu a
recomendada (B).  
**Registro:** as razões são a leitura do agente apresentada ao dono, e não
palavras dele.  
**Escopo:** a lição do aluno (`LessonFlowScreen`) e o Perfil.  
**Complementa:** a [spec do piloto](../superpowers/specs/2026-09-23-licao-hibrida-piloto-design.md),
§5.2, e a [ADR de 2026-09-23](ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md),
item 3.

## Contexto

- **O achado veio do dono.** Na build `development` `c4eeeb44`, a lição não
  tocava os sons que ele escolheu em 2026-09-23.
- **A investigação mostrou que não era defeito:**
  - a camada de som e vibração (`src/ui/feedback/`) existia desde 2026-09-23,
    com os seis sons, as preferências e o respeito ao modo silencioso;
  - só a lição híbrida do piloto a usava, e essa lição fica atrás de
    `SHOW_DEV_TOOLS`. Era o escopo da spec: "Onde: piloto na L1";
  - a lição do aluno, que é a legada, vibrava só ao concluir, e o card "Sons e
    vibração" do Perfil ficava escondido em produção;
  - a 1.4, do jeito que estava, sairia sem som nenhum.

## Decisão

**B: ligar a camada à lição do aluno antes da build de produção da 1.4.** A
outra opção era sair sem som e esperar as lições do V3.

| Momento | Som | Vibração |
|---|---|---|
| Tocar numa alternativa | toque | seleção |
| "Continuar" com acerto | acerto | sucesso |
| "Continuar" com erro | erro | erro |
| A vida cai de fato (o mesmo critério do anúncio ao leitor de tela) | vida | perda de vida |
| Fim da lição aprovada | fim | comemoração |

- **O card "Sons e vibração" passa a aparecer no Perfil de produção.** Os dois
  interruptores valem para a lição. A comemoração, que antes vibrava sempre,
  passa a obedecer ao interruptor.
- **Ficam fora:**
  - o checkpoint, que o dono quer remover (FILA, 29);
  - o quiz antigo, que não é alcançável;
  - a vibração leve de todos os botões, que não é da lição.

## Consequências

- **O `expo-audio` já entrava no binário.** O módulo nativo existe desde
  2026-09-23, então a build de produção não ganha dependência nova.
- **A verificação depende do ouvido do dono.** O Jest mede que o som foi
  pedido, e não que saiu.
- **Escala futura:** a lição híbrida e a lição do aluno montam a camada cada
  uma do seu jeito. Quando o V3 substituir as lições legadas, sobra uma só.
