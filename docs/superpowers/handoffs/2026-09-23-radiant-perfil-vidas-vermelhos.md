# Execuções vermelhas — Perfil e recompensa leem a fonte viva de vidas (2026-09-23)

Evidência do [relatório](2026-09-23-radiant-perfil-vidas-relatorio.md).
Registrada como saída de execução, não como prosa: "falhou antes" sem saída
não dá para auditar.

Ambiente: Node `v20.20.2`, `radiant-app`,
`npx jest --runInBand src/features/missions src/features/rewards`.

## 1. As guardas contra o código anterior (`HEAD` = `0b0283e`)

Testes finais rodados com `MissionsScreen.tsx` e `RewardScreen.tsx` na versão
de `HEAD`, sem nenhuma outra mudança. Os sete testes novos falham. Seis falham
pelo defeito que nomeiam: a tela desenha **`5 de 5 vidas`**, que vem do
contador legado, enquanto o `heartsRepository` guarda 2, 3, 0 ou ilimitado. O
sétimo falha porque a tela nunca lê a chave do `heartsRepository`, e é esse o
defeito que ele nomeia.

```text
  ● MissionsScreen — seção Vidas no Perfil › mostra as vidas que a Jornada descontou, não o contador legado
    Unable to find an element with accessibility label: 2 de 5 vidas
          accessibilityLabel="5 de 5 vidas"
  ● MissionsScreen — seção Vidas no Perfil › conta a próxima vida pelo relógio do heartsRepository
    Unable to find an element with text: /^Próximo coração em (9|10):\d\d$/
          accessibilityLabel="5 de 5 vidas"
  ● MissionsScreen — seção Vidas no Perfil › avisa do bloqueio quando o heartsRepository está vazio
    Unable to find an element with accessibility label: 0 de 5 vidas
          accessibilityLabel="5 de 5 vidas"
  ● MissionsScreen — seção Vidas no Perfil › assinante vê ∞ e "ilimitadas", sem corações, relógio nem aviso
    Unable to find an element with accessibility label: Vidas ilimitadas
          accessibilityLabel="5 de 5 vidas"
  ● MissionsScreen — seção Vidas no Perfil › não mostra corações antes de ler o heartsRepository
    Expected: "@radiant:hearts_v1"
  ● RewardScreen flow › HUD — vidas do heartsRepository, não do contador legado › mostra as vidas que a lição descontou
    Unable to find an element with accessibility label: /^2 de 5 vidas/
                accessibilityLabel="5 de 5 vidas"
  ● RewardScreen flow › HUD — vidas do heartsRepository, não do contador legado › assinante vê ∞
    Unable to find an element with text: ∞
                accessibilityLabel="5 de 5 vidas"
Test Suites: 2 failed, 2 total
Tests:       7 failed, 9 passed, 16 total
```

Os 9 que passam são os testes anteriores do `RewardScreen` (coleta, marcos da
unidade e `canCollectReward`), intocados.

## 2. Mutação depois da correção: coração desenhado antes da leitura

O último teste do Perfil existe para uma regressão que o vermelho acima não
exercita: com a correção, alguém volta a desenhar `MAX_HEARTS` enquanto o
snapshot é `null`, e isso pisca vidas cheias para quem tem 0 ou para o
assinante. Mutação aplicada: `) : hearts ? (` → `) : true ? (`, e a contagem
passou a cair em `hearts?.count ?? MAX_HEARTS`.

```text
    ✓ mostra as vidas que a Jornada descontou, não o contador legado (90 ms)
    ✓ conta a próxima vida pelo relógio do heartsRepository (61 ms)
    ✓ avisa do bloqueio quando o heartsRepository está vazio (59 ms)
    ✓ assinante vê ∞ e "ilimitadas", sem corações, relógio nem aviso (59 ms)
    ✕ não mostra corações antes de ler o heartsRepository (536 ms)
    > 134 |     expect(screen.queryByLabelText(/de 5 vidas/)).toBeNull();
Tests:       1 failed, 4 passed, 5 total
```

Reprova na asserção que nomeia a regressão (linha 134), e não no `waitFor`
anterior. Arquivo restaurado; verde de novo.

## 3. Verde

```text
Tests:       16 passed, 16 total
```

Gate completo na mesma data e no mesmo Node: `EXPO_NO_DOTENV=1 npm run quality`
saiu 0, **134 suítes / 1181 testes**, lint 0 erros / 26 avisos, Visual QA
sem regressão.
