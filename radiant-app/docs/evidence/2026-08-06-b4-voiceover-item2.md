# B4 — Gate 2 item 2: VoiceOver, o que foi ouvido e o que não existe — 2026-08-06

- **Data:** 2026-08-05 (abas e estado desabilitado) e 2026-08-06 (dica e rotor)
- **Responsável pela execução:** Anderson
- **Alvo:** iPhone físico, build TestFlight `1.3.1 (5)`
- **Resultado:** item 2 **fechado** — três dos quatro elementos com anúncio
  audível em controle real; o quarto coberto por contrato unitário **porque não
  é produzível nesta build**
- **Código alterado:** nenhum

## O que foi ouvido

| Elemento | Anúncio | Data |
| --- | --- | --- |
| nome + posição/função | `Galáxia, aba 2 de 4, botão`; `Progresso, aba 3 de 4, botão` | 2026-08-05 |
| estado desabilitado | `Confirmar reset com token, escurecido` | 2026-08-05 |
| nome + função + **dica** | `Fazer revisão` → `botão` → `Abre o próximo passo elegível da trilha ativa` | 2026-08-06 |

O anúncio de 08-06 é o do **CTA da home** (`JourneyHomeScreen`), e ele importa
por ser o **único `AppButton` do produto que carrega `accessibilityHint`** —
todos os outros controles com dica são `Pressable` e não exercitam este item.
O rótulo foi dito **uma vez**, seguido do papel e da dica, nessa ordem: é
exatamente o "anunciado uma vez e na ordem esperada" que o item pede, e afasta a
suspeita de duplicação que o componente permitiria em tese, já que o mesmo texto
existe como `accessibilityLabel` e como `Text` filho.

## O `ações disponíveis` que apareceu no fim, e por que não é nada

O anúncio terminava com `ações disponíveis`. Duas fontes independentes
mostraram que não vem do app:

1. **Código:** varredura em `src` e `components` não encontra nenhuma
   `accessibilityActions`, `onAccessibilityAction` ou
   `accessibilityCustomActions`.
2. **Sistema:** no aparelho, o rotor **não oferece a opção "Ações"** para esse
   controle — e o iOS só a oferece quando há ações customizadas.

Uma fonte é o que declaramos, a outra é o que o sistema expõe; concordarem
significa alguma coisa. É fala padrão do VoiceOver para controle acionável.

## O estado ocupado: não medido porque não existe

O único `AppButton` que recebe `loading` — e portanto
`accessibilityState.busy` — está no `PaywallOfferCard`. Ele só renderiza no
`CheckpointScreen` quando há oferta, e `PaywallService.evaluateEligibility()`
devolve `blocked / paywall_disabled` sem `AppConfig.ENABLE_PAYWALL`.
`EXPO_PUBLIC_ENABLE_PAYWALL` **não é declarada em nenhum perfil** do `eas.json`,
e o default em `src/config.ts` é `false`. Mesmo com a flag ligada, a janela
ocupada são dois `await` de AsyncStorage — milissegundos — e termina zerando a
oferta, o que **desmonta** o botão em vez de devolvê-lo ao estado ocioso.

Não é "faltou sessão": é **inalcançável**, e a mesma classe de defeito da B0 —
flag ausente dos perfis de produção.

## A decisão, dita como decisão

O item foi fechado aceitando o **contrato unitário do `AppButton`** como
cobertura de `busy` (`accessibilityState={{ disabled, busy }}`, coberto por
`AppButton.test.tsx`), em vez de construir um harness de dev-tools só para
produzir o estado. Isso é uma troca, não uma equivalência: o gate pediu anúncio
audível e recebeu contrato de componente para um dos quatro elementos.

**Gatilho de reabertura, para quem vier depois:** se `EXPO_PUBLIC_ENABLE_PAYWALL`
passar a ser declarada em qualquer perfil, ou se qualquer outro `AppButton`
receber `loading`, o estado ocupado passa a ser produzível e **este item merece
uma passagem nova**. A cobertura atual vale enquanto o produto não tiver um
botão ocupado que um humano consiga alcançar.

## O que este registro não prova

1. Nada sobre **TalkBack** — o equivalente Android é a **C5**, aberta.
2. A lacuna conhecida da apresentação (o rótulo da ilustração não compõe o
   rótulo do grupo) não foi reclassificada aqui.
3. Ausência de duplicação foi verificada nos controles ouvidos, não em todos os
   `AppButton` do app.
