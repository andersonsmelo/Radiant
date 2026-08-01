# Links Legais no App Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Exibir Política de Privacidade e Central de Suporte dentro da aba Progresso, abrindo os destinos públicos em navegador interno com acessibilidade e falha segura.

**Architecture:** Um contrato imutável concentra os dois destinos HTTPS. Um componente de apresentação independente renderiza o cartão e delega a navegação ao `ExternalLink` compartilhado. `ProgressScreen` apenas posiciona o cartão, preservando os domínios de progresso, conta e sincronização.

**Tech Stack:** Expo 54, React Native 0.81, TypeScript, Expo Router, `expo-web-browser`, Jest Expo e React Native Testing Library.

**Design aprovado:** `docs/superpowers/specs/2026-08-01-links-legais-no-app-design.md`

**Disciplina de execução:** executar em um run de escrita do Loop, declarar todos os arquivos antes da primeira edição, observar os testes focados vermelhos fora do orçamento de validação do Loop e usar `loop validate` somente quando a implementação estiver verde. Não criar commit sem autorização explícita do usuário.

---

### Task 1: Criar o contrato central das URLs legais

**Files:**
- Create: `radiant-app/src/config/legal.ts`
- Test: `radiant-app/src/config/legal.test.ts`

**Step 1: Write the failing test**

```ts
import { LEGAL_LINKS } from './legal';

describe('LEGAL_LINKS', () => {
  it('keeps the approved public HTTPS destinations', () => {
    expect(LEGAL_LINKS.privacy.href).toBe(
      'https://saudediagnostica.com/radiant/privacidade/',
    );
    expect(LEGAL_LINKS.support.href).toBe(
      'https://saudediagnostica.com/radiant/suporte/',
    );

    for (const link of Object.values(LEGAL_LINKS)) {
      expect(new URL(link.href).protocol).toBe('https:');
    }
  });
});
```

**Step 2: Run test to verify it fails**

Run:

```bash
cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand src/config/legal.test.ts
```

Expected: FAIL porque `./legal` ainda não existe.

**Step 3: Write minimal implementation**

```ts
export const LEGAL_LINKS = {
  privacy: {
    label: 'Política de Privacidade',
    description: 'Saiba como seus dados são tratados.',
    accessibilityHint: 'Abre a política de privacidade no navegador interno.',
    href: 'https://saudediagnostica.com/radiant/privacidade/',
  },
  support: {
    label: 'Central de Suporte',
    description: 'Encontre ajuda e canais de atendimento.',
    accessibilityHint: 'Abre a central de suporte no navegador interno.',
    href: 'https://saudediagnostica.com/radiant/suporte/',
  },
} as const;
```

**Step 4: Run test to verify it passes**

Run the focused command from Step 2.

Expected: PASS, 1 suite.

**Step 5: Checkpoint**

Confirmar que nenhuma URL aparece duplicada no novo componente. Não criar commit sem autorização.

---

### Task 2: Tornar falhas do navegador interno seguras

**Files:**
- Modify: `radiant-app/components/external-link.tsx`
- Create: `radiant-app/components/external-link.test.tsx`

**Step 1: Write the failing tests**

Mockar `expo-router` com um `Link` baseado em `Pressable`, e `expo-web-browser` com `openBrowserAsync: jest.fn()`. Cobrir os dois comportamentos:

```tsx
it('opens the destination inside the app on native', async () => {
  process.env.EXPO_OS = 'ios';
  const preventDefault = jest.fn();

  render(
    <ExternalLink
      href="https://example.com/privacy"
      accessibilityLabel="Política de Privacidade"
      accessibilityHint="Abre no navegador interno"
    >
      Política de Privacidade
    </ExternalLink>,
  );

  fireEvent.press(screen.getByRole('link'), { preventDefault });

  await waitFor(() => {
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(openBrowserAsync).toHaveBeenCalledWith(
      'https://example.com/privacy',
      { presentationStyle: WebBrowserPresentationStyle.AUTOMATIC },
    );
  });
  expect(screen.getByRole('link')).toHaveProp(
    'accessibilityHint',
    'Abre no navegador interno',
  );
});

it('contains a native browser failure and informs the user', async () => {
  process.env.EXPO_OS = 'ios';
  jest.mocked(openBrowserAsync).mockRejectedValueOnce(new Error('unavailable'));
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);

  render(<ExternalLink href="https://example.com/support">Suporte</ExternalLink>);
  fireEvent.press(screen.getByRole('link'), { preventDefault: jest.fn() });

  await waitFor(() => {
    expect(alert).toHaveBeenCalledWith(
      'Não foi possível abrir o link',
      'Tente novamente em instantes.',
    );
  });
});
```

Restaurar `process.env.EXPO_OS` e mocks em `afterEach` para não contaminar outras suítes.

**Step 2: Run test to verify it fails**

```bash
cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand components/external-link.test.tsx
```

Expected: o teste de falha segura reprova porque a rejeição ainda escapa e nenhum alerta é mostrado.

**Step 3: Write minimal implementation**

Atualizar o manipulador nativo em `external-link.tsx`:

```tsx
import { Alert } from 'react-native';

// dentro de onPress, depois de event.preventDefault()
try {
  await openBrowserAsync(href, {
    presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
  });
} catch {
  Alert.alert(
    'Não foi possível abrir o link',
    'Tente novamente em instantes.',
  );
}
```

Manter o comportamento web atual e a passagem de propriedades de acessibilidade por `...rest`.

**Step 4: Run tests to verify they pass**

Run the focused command from Step 2.

Expected: PASS, incluindo abertura e falha segura.

**Step 5: Checkpoint**

Confirmar que nenhum erro, URL ou dado do usuário é persistido. Não criar commit sem autorização.

---

### Task 3: Implementar o cartão acessível de ajuda

**Files:**
- Create: `radiant-app/src/features/progress/components/LegalLinksCard.tsx`
- Create: `radiant-app/src/features/progress/components/LegalLinksCard.test.tsx`

**Step 1: Write the failing test**

Mockar `ExternalLink` de forma que ele clone o filho e exponha `href`, preservando as propriedades de acessibilidade do `Pressable`.

```tsx
it.each([
  ['Política de Privacidade', LEGAL_LINKS.privacy.href],
  ['Central de Suporte', LEGAL_LINKS.support.href],
])('renders %s as an accessible link to the approved destination', (label, href) => {
  render(<LegalLinksCard />);

  const link = screen.getByRole('link', { name: label });
  expect(link).toHaveProp('href', href);
  expect(link.props.accessibilityHint).toContain('navegador interno');
});

it('identifies the section', () => {
  render(<LegalLinksCard />);
  expect(screen.getByText('Ajuda e informações')).toBeTruthy();
});
```

**Step 2: Run test to verify it fails**

```bash
cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand src/features/progress/components/LegalLinksCard.test.tsx
```

Expected: FAIL porque o componente ainda não existe.

**Step 3: Write minimal implementation**

Implementar `LegalLinksCard` com esta estrutura:

```tsx
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ExternalLink } from '../../../../components/external-link';
import { LEGAL_LINKS } from '../../../config/legal';
import { galaxyColors } from '../../../ui/theme';
import { typography } from '../../../ui/styles';

const links = [LEGAL_LINKS.privacy, LEGAL_LINKS.support];

export function LegalLinksCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title} accessibilityRole="header">
        Ajuda e informações
      </Text>
      {links.map((link, index) => (
        <ExternalLink key={link.href} href={link.href} asChild>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={link.label}
            accessibilityHint={link.accessibilityHint}
            style={({ pressed }) => [
              styles.link,
              index > 0 && styles.divider,
              pressed && styles.linkPressed,
            ]}
          >
            <View style={styles.copy}>
              <Text style={styles.linkLabel}>{link.label}</Text>
              <Text style={styles.description}>{link.description}</Text>
            </View>
            <Text style={styles.arrow} accessibilityElementsHidden importantForAccessibility="no">
              ↗
            </Text>
          </Pressable>
        </ExternalLink>
      ))}
    </View>
  );
}
```

Completar `StyleSheet.create` usando somente `galaxyColors` e `typography`, com `minHeight: 44`, `paddingVertical: 12`, borda e raio equivalentes aos cartões da tela, e `gap` para separar título e itens. Não introduzir valores próprios de cor.

**Step 4: Run test to verify it passes**

Run the focused command from Step 2.

Expected: PASS para título, semântica, dica e destino.

**Step 5: Checkpoint**

Revisar visualmente a hierarquia do cartão e o tamanho dos alvos. Não criar commit sem autorização.

---

### Task 4: Integrar o cartão à aba Progresso

**Files:**
- Modify: `radiant-app/src/features/progress/screens/ProgressScreen.tsx`
- Modify: `radiant-app/src/features/progress/screens/ProgressScreen.flow.test.tsx`

**Step 1: Write the failing integration test**

Adicionar `Link` ao mock já existente de `expo-router`, devolvendo o filho recebido quando `asChild` estiver presente. Depois, adicionar ao fluxo:

```tsx
it('keeps legal help available in the progress screen', async () => {
  renderWithProviders(<ProgressScreen />);

  expect(await screen.findByText('Ajuda e informações')).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Política de Privacidade' })).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Central de Suporte' })).toBeTruthy();
});
```

**Step 2: Run test to verify it fails**

```bash
cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand src/features/progress/screens/ProgressScreen.flow.test.tsx
```

Expected: FAIL porque o cartão ainda não está montado pela tela.

**Step 3: Write minimal integration**

Em `ProgressScreen.tsx`, importar:

```ts
import { LegalLinksCard } from '../components/LegalLinksCard';
```

Renderizar imediatamente após o fechamento do cartão **Conta e sincronização** e antes de `showDeveloperTools`:

```tsx
{/* ── Ajuda e informações ── */}
<LegalLinksCard />
```

**Step 4: Run integration and focused regression tests**

```bash
cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand \
  src/config/legal.test.ts \
  components/external-link.test.tsx \
  src/features/progress/components/LegalLinksCard.test.tsx \
  src/features/progress/screens/ProgressScreen.flow.test.tsx
```

Expected: PASS em todas as suítes focadas.

**Step 5: Checkpoint**

Verificar no diff que o cartão está fora de qualquer condição de autenticação, API ou ferramentas de desenvolvimento. Não criar commit sem autorização.

---

### Task 5: Sinalizar o marco e executar os gates completos

**Files:**
- Modify: `docs/EXECUTION_STATUS_2026-07-29.md`
- Modify: `docs/plans/2026-07-27-radiant-launch-roadmap.md`
- Modify: `docs/release/CHECKLIST_RELEASE_V1.3.md`

**Step 1: Update operational documentation**

Registrar somente depois dos testes focados verdes:

- no status canônico, que os links internos foram implementados e testados, sem afirmar homologação física ou TestFlight;
- no roadmap, o subitem correspondente da preparação iOS como concluído, mantendo build, envio e revisão abertos;
- no checklist 1.3, as duas URLs e a evidência automatizada, mantendo a verificação manual em iPhone/VoiceOver pendente.

Preservar integralmente as mudanças não relacionadas já existentes nesses arquivos.

**Step 2: Run application quality gates**

```bash
cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npm run lint
cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npm run typecheck
cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand --no-cache
```

Expected: todos os comandos encerram com código 0.

**Step 3: Run the complete Loop validation**

```bash
loop validate --run <run-id>
```

Expected: os nove validadores configurados passam: contrato documental, fundação e wave 1 de conteúdo, qualidade e testes do app, lint/typecheck/testes da API e links do cérebro.

**Step 4: Finish and close the writer run**

```bash
loop step finish --run <run-id>
loop run close --run <run-id>
```

Expected: etapa `succeeded` e run fechado. Não criar memória apenas para repetir o conteúdo dos documentos.

**Step 5: Manual handoff gate**

No iPhone físico:

1. abrir Progresso sem autenticação;
2. confirmar que o cartão está visível;
3. abrir cada destino e conferir a URL final;
4. repetir com VoiceOver, verificando ordem, rótulo e dica;
5. voltar ao app e confirmar que progresso e sessão permanecem inalterados.

Esse gate é evidência operacional posterior; não deve ser marcado como concluído pelos testes automatizados.
