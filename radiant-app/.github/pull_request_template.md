# Visual QA & Code Review Template

## 📋 Contexto
<!-- O que este PR faz? Link para card/issue se houver. -->

## 🖼 Telas Alteradas
<!-- Liste as telas impactadas e defina o arquétipo utilizado (Dashboard, Flow, Summary, Utility) -->
- Ex: `HomeScreen.tsx` (Dashboard)
- Ex: `ReviewScreen.tsx` (Flow)

## ✅ Visual QA Checklist

### Arquitetura de Layout
- [ ] **Arquétipo Correto**: A tela segue estritamente a estrutura do seu arquétipo?
- [ ] **Primitives**: `layout.screen` no root, `layout.container` no conteúdo principal?
- [ ] **Ritmo Vertical**: Uso de `layout.stackSm` / `layout.stackMd` ao invés de margins manuais?
- [ ] **Sem Números Mágicos**: Espaçamentos/Radii usam tokens (`space.*`, `radius.*`)?

### Motion & Character
- [ ] **Motion Autorizado**: Apenas helpers de `src/ui/motion.ts` (sem `Animated` direto)?
- [ ] **Character Gating**: Lux aparece nos lugares certos (Home/Summary) e respeita `ENABLE_CHARACTER`?
- [ ] **Sem Motion Decorativo**: Animação tem propósito (entrada, feedback, atenção)?

### Screenshots (Before / After)
<!-- Adicione prints para validar. Se possível Mobile + Web. -->
| Antes | Depois |
|-------|--------|
| (img) | (img)  |

---

## 🧪 Teste Manual
- [ ] Fluxo principal da alteração
- [ ] Navegação ida e volta (sem loops)
- [ ] Dark Mode (se aplicável)
- [ ] Sem erros no console/logs

## 🤖 Automático
- [ ] `npm run visual:qa` passou?
- [ ] `npx tsc --noEmit` passou?
