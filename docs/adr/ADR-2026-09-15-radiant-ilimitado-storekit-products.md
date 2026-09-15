# ADR — Radiant Ilimitado: grupo e produtos StoreKit (2026-09-15)

**Status:** aceita  
**Decisor:** Anderson Melo (dono do projeto)  
**Escopo:** Radiant 1.4 · App Store · StoreKit

## Contexto

A spec ativa da 1.4 definiu o modelo freemium com um único grupo de assinatura, **Radiant Ilimitado**, usando StoreKit direto e sem RevenueCat. O benefício pago da 1.4 é **vidas ilimitadas — e somente isso**. Não há trial ou oferta introdutória na 1.4.

Em 2026-09-15, o grupo e os dois produtos foram configurados no App Store Connect pelo dono do projeto. Esta ADR fixa os identificadores e o estado observado para impedir divergência entre App Store Connect, código, testes e futuras IAs executoras.

## Decisão

### Grupo de assinatura

- **Nome de referência:** `Radiant Ilimitado`
- **Nome exibido:** `Radiant Ilimitado`
- **Idioma:** Português (Brasil)
- **App exibido:** `Radiant — Radiologia`
- **Tipo:** assinaturas auto-renováveis
- **Benefício:** vidas ilimitadas
- **Trial/oferta introdutória:** nenhum na 1.4
- **Disponibilidade:** Brasil
- **Nível de serviço:** mensal e anual no mesmo nível, porque entregam o mesmo benefício e diferem apenas pela duração

### Produtos

| Plano | Nome de referência | Product ID | Duração | Preço Brasil | Estado observado em 2026-09-15 |
| --- | --- | --- | --- | --- | --- |
| Mensal | `Radiant Ilimitado Mensal` | `com.andersonmelo.radiant.ilimitado.mensal` | 1 mês | **R$ 19,90/mês** | Criado e com metadados, imagem, captura e notas de revisão preenchidos |
| Anual | `Radiant Ilimitado Anual` | `com.andersonmelo.radiant.ilimitado.anual` | 1 ano, pagamento antecipado | **R$ 149,90/ano** | Criado e com metadados, imagem, captura e notas de revisão preenchidos |

O modo **“mensal com compromisso de 12 meses”** não faz parte do produto aprovado e permanece desativado.

## Regras de implementação

1. A Task 8 deve usar exatamente os dois Product IDs acima.
2. Não criar aliases, IDs alternativos ou variantes por ambiente sem nova decisão explícita do dono.
3. StoreKit é a fonte de verdade para preço exibido e estado da compra; os valores acima registram a configuração inicial do Brasil.
4. A implementação nativa deve carregar mensal e anual do mesmo grupo e tratar a troca entre eles como mudança entre produtos equivalentes do mesmo nível.
5. Assinatura ativa torna as vidas ilimitadas. Nenhum conteúdo exclusivo é prometido na 1.4.
6. Restauração de compras deve usar StoreKit. RevenueCat permanece fora do desenho aprovado.
7. O estudo continua local-first: nenhuma tela de estudo depende de rede, conta ou assinatura.
8. A primeira submissão do grupo deve acompanhar uma nova versão do app. Os produtos não devem ser enviados isoladamente antes da 1.4.0.
9. Compartilhamento Familiar permanece desativado na 1.4, salvo nova decisão.

## Metadados de revisão já preparados

Ambos os produtos têm localização em Português (Brasil), imagem 1024×1024, captura da tela de assinatura e notas para a equipe de revisão. A captura mostra os dois planos e os preços iniciais configurados.

## Estado externo do dono em 2026-09-15

- Paid Apps Agreement: aceito; processamento/ativação final ainda deve ser confirmado no App Store Connect antes da submissão.
- Formulário fiscal do Brasil: ativo.
- U.S. Certificate of Foreign Status of Beneficial Owner: ativo.
- U.S. Form W-8BEN: ativo.
- Conta bancária: enviada; processamento final ainda deve ser confirmado.
- Grupo e produtos de assinatura: configuração do dono concluída.

## Relação com a 1.4

Esta ADR concretiza a seção de assinatura da spec `docs/superpowers/specs/2026-09-14-radiant-1-4-fluxo-do-usuario-design.md`.

Para estado operacional, `docs/STATUS.md` continua sendo o único documento vivo. Esta ADR registra a decisão durável e os identificadores que a implementação não deve reinventar.
