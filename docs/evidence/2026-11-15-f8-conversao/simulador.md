# F8: o que foi visto no simulador (2026-11-15)

**Ambiente:** simulador próprio "Radiant F8" (`FA8716BD-2295-4AC6-8D93-29C04A34947A`,
iPhone 17 Pro, iOS 26.5), criado porque o "Radiant F2" estava com o Maestro de outra
sessão rodando. O cliente de desenvolvimento instalado é uma cópia do que estava no
"Radiant F2" (`com.ascendcreative.radiant`). O JS veio do Metro desta worktree, na
porta 8082, com `EXPO_NO_TYPESCRIPT_SETUP=1`, `EXPO_NO_DOTENV=1` e
`EXPO_PUBLIC_ENABLE_CONVERSION_PROMPTS=true`. A tela foi lida por `maestro hierarchy`,
sem capturas. Commit da árvore: `7e363c3`.

**Preparação do estado:** com o app fechado, gravei zero vidas em `@radiant:hearts_v1`
no AsyncStorage do simulador. Para testar a amostra num "dia seguinte", voltei
`lastInviteDay` de `@radiant:conversion_v1` para `2026-11-14`. É dado de teste no
simulador, e o código não mudou.

**Tropeço registrado:** na primeira tentativa passei `=1`, e a folha mostrou o link
antigo. `readBooleanFlag` (`src/config/contracts.ts:33-39`) só aceita `"true"`. A ADR e o
plano diziam `=1` e foram corrigidos para `=true`. Não era defeito do app, e com a chave
"desligada" (`1`) a folha se comportou como a `main`, o que conta como contraprova
vista na tela.

## Visto

1. **Folha sem vidas, chave ligada** (toque no contador "0 de 5 vidas"):
   "Sem vidas", "0 de 5 vidas", o texto de espera, "A próxima volta em 23 min.",
   "Com o Radiant Ilimitado, errar não gasta vida.", "Você seguiria agora, sem esperar a
   próxima vida. As aulas são as mesmas nos dois planos.", o botão "Conhecer o Ilimitado"
   (56 pt de altura, `[17,603][385,659]`), o botão "Experimentar 30 min sem gastar vidas"
   (56 pt), "Uma vez por aparelho, sem custo. Depois, suas vidas voltam cheias." e
   "Voltar". Nenhum preço e nenhum prazo.
2. **"Conhecer o Ilimitado" → tela de assinatura:** a comparação com três linhas lidas
   pelo leitor de tela como um nó cada:
   "Aulas, revisões e avaliações. Gratuito: Todas. Assinante: Todas.",
   "Vidas. Gratuito: 5; cada erro gasta uma, e uma volta a cada 30 min. Assinante:
   Ilimitadas: errar não gasta vida." e "Revisão concluída. Gratuito: Devolve 1 vida.
   Assinante: Continua valendo como estudo.". Depois vêm os dois planos e
   "Assinar anual", com os preços vindos da configuração StoreKit do cliente.
3. **Folha reaberta no mesmo dia:** volta ao link "Vidas ilimitadas" da `main`, sem convite.
4. **Amostra** (no "dia seguinte" preparado): o toque fechou a folha, e o cabeçalho
   passou a "Vidas ilimitadas".
5. **Console de desenvolvimento**, cartão "Convites de assinatura":
   "Chave ENABLE_CONVERSION_PROMPTS: ligada · último convite em 2026-11-15", convite visto
   sem vidas 2, fim de unidade 0, tela aberta 1, compra iniciada 0, compra concluída 0 e
   amostra usada 1. Bate com o que foi feito.

Ao terminar: app encerrado, simulador "Radiant F8" desligado, Metro parado,
`.claude/launch.json` apagado e `radiant-app/expo-env.d.ts` ausente.

## Não visto

- **Compra em sandbox:** não toquei em "Assinar". As contagens de compra iniciada e
  concluída só têm prova em teste (`SubscriptionScreen.conversion.test.tsx`).
- **Convite da comemoração de unidade:** fechar uma unidade inteira não coube. Só tem
  prova em teste (`UnitCompleteCelebration.test.tsx`).
- A amostra **expirando** no meio de uma aula, a folha da aula e da avaliação (vi só a do
  cabeçalho da Estude), texto ampliado, VoiceOver, Android e aparelho físico.
