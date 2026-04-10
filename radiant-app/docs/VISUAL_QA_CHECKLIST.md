# 👁 Visual QA Checklist — Radiant

Este documento define os critérios de aceitação visual e estrutural para qualquer PR que toque em UI no Radiant.
Baseado em: `LAYOUT_PRIMITIVES.md` e `SCREEN_ARCHETYPES.md`.

---

## 1. Regras Globais (Zero Tolerância)

### ❌ Números Mágicos
**Proibido:** `margin: 18`, `padding: 22`, `borderRadius: 7`
**Correto:**
- Espaço: `space.s1` (8), `space.s2` (12), `space.s3` (16)... `space.s6` (32).
- Raio: `radius.rSm` (8), `radius.rMd` (12), `radius.rLg` (16).

### ❌ Wrappers Inúteis
**Proibido:** `<View><View><Card /></View></View>` sem estilo ou lógica.
**Correto:** Simplifique a árvore. `View` só existe se tiver função.

### ❌ Layout "Solto"
**Proibido:** Conteúdo principal fora de `layout.container`.
**Correto:** O conteúdo central deve respeitar `maxWidth` para Web.

---

## 2. Regras por Arquétipo

### A) Dashboard (Home)
- **Header:** Saudação + Lux Slot (opcional).
- **Ritmo:** `layout.stackMd` (respiro).
- **Motion:** Entrada em cascata.
- **Lux:** Permitido (Idle/Greeting).

### B) Flow (Quiz/Review)
- **Header:** Compacto, apenas progresso/título.
- **Foco:** Apenas 1 card central.
- **Lux:** **Proibido** no fluxo (apenas intro/fim).
- **Motion:** Rápido (<300ms), funcional.

### C) Summary (Finish)
- **Foco:** Celebração / Score.
- **Motion:** Exuberante (confetti, scale).
- **Lux:** Permitido (Celebrate).

### D) Utility (Debug/Settings)
- **Foco:** Densidade.
- **Motion:** Nulo.
- **Lux:** Proibido.

---

## 3. Motion Rules

- **Fonte Única:** Importar apenas de `src/ui/motion.ts`.
- **Proibido:** `new Animated.Value` ou `Reanimated` direto nas telas (exceto se criando novo primitive documentado).
- **Padrões:**
  - Entrar tela: `createFadeInUp`
  - Entrar card: `createCardEnter`
  - Feedback erro: `createShakeError`
  - Press: `createPressScale`

---

## 4. Character Rules

- **Gating:** Todo uso de `CharacterSlot` deve ser condicional ou respeitar `ENABLE_CHARACTER`.
- **Posição:** Sempre em slots definidos, nunca flutuando sobre texto.
- **Estado:** Respeitar o estado emocional do arquétipo.

---

## 5. Script Automático

Rode sempre antes de abrir PR:
```bash
npm run visual:qa
```

Este script verifica:
1. Uso de números mágicos em estilos inline/StyleSheet.
2. Redefinição de primitives existentes.
3. Importação direta de bibliotecas de animação.
4. Importação de Personagem em arquivos suspeitos.

**Como ignorar um falso positivo:**
(Ainda não implementado, ajuste o código se necessário ou justifique no PR).
