# Image Annotation — Specification (Radiant)

> Este documento define **exatamente** como a anotação em imagens funciona no MVP do Radiant.
> No MVP, trabalhamos com **JPEG/PNG de alta qualidade**, com **zoom/pan** e **marcação simples**.
> A anotação deve ser **rápida, estável e simples** (não é um PACS).

---

## 1. Objetivo da Feature

Permitir que o usuário interaja com imagens radiológicas (JPEG/PNG) para:

* Identificar e marcar achados (lesão/estrutura/anormalidade)
* Reforçar raciocínio visual (não apenas múltipla escolha)

A anotação é um diferencial do Radiant, mas deve ser implementada de forma pragmática no MVP.

---

## 2. Escopo (MVP)

### Inclui

* Visualização de imagem (JPEG/PNG) em tela cheia
* Zoom e pan (nativo)
* Modo de marcação simples:
  * **Ponto** (tap para marcar)
  * **Retângulo** (touch + arrastar)
* Confirmação de resposta e validação automática
* Persistência do resultado (acertou/errou) e coordenadas marcadas

### Não inclui

* Desenho livre (freehand)
* Ferramentas avançadas (círculo, seta, múltiplas camadas)
* Múltiplas marcações por questão
* DICOM viewer
* Ajuste de janela/nível (WL/WW)

---

## 3. Dependências / Bibliotecas (MVP)

### Abordagem preferida

* Implementação nativa simples com `react-native-gesture-handler` + `react-native-reanimated` (zoom/pan)
* Renderização das marcações com `View` absolutas (overlay)

### Alternativa (se necessário)

* `react-native-signature-canvas` apenas se o overlay nativo não atender requisitos

> Nota: No MVP, evitar WebView se possível.

---

## 4. Arquivos Envolvidos

### Criar

* `src/components/ImageViewer.tsx`
* `src/components/AnnotationOverlay.tsx`
* `src/components/AnnotationControls.tsx`
* `src/services/annotation.ts`
* `src/types/annotation.ts`

### Modificar

* `src/components/QuizQuestion.tsx` (para suportar questão de imagem com anotação)
* `src/constants/quiz.ts` (para habilitar tipos de questão)

---

## 5. Estrutura de Pastas

```
src/
 ├─ components/
 │   ├─ ImageViewer.tsx
 │   ├─ AnnotationOverlay.tsx
 │   └─ AnnotationControls.tsx
 ├─ services/
 │   └─ annotation.ts
 ├─ types/
 │   └─ annotation.ts
 └─ constants/
     └─ quiz.ts
```

---

## 6. Estruturas de Dados

### Annotation Types

```ts
export type Point = { x: number; y: number }

export type Rect = {
  x: number
  y: number
  width: number
  height: number
}

export type Annotation =
  | { kind: 'point'; point: Point }
  | { kind: 'rect'; rect: Rect }
```

### ImageQuestion (extensão do Question)

```ts
type ImageQuestion = {
  id: string
  type: 'image'
  prompt: string
  imageUrl: string
  annotationMode: 'point' | 'rect'
  // região-alvo correta
  target:
    | { kind: 'point'; center: Point; radius: number }
    | { kind: 'rect'; rect: Rect }
  explanation: string
}
```

### StoredAnswer (para salvar tentativa)

```ts
type StoredAnswer = {
  questionId: string
  annotation?: Annotation
  isCorrect: boolean
  answeredAt: string // ISO
}
```

---

## 7. Regras de Negócio (Validação)

### 7.1 Normalização de coordenadas

* Todas as coordenadas de anotação devem ser salvas **normalizadas** (0..1), relativas ao tamanho exibido da imagem.
* Isso garante consistência entre diferentes telas.

```txt
normalizedX = x / imageDisplayWidth
normalizedY = y / imageDisplayHeight
```

### 7.2 Validação — modo ponto

* Usuário toca e gera um ponto.
* A resposta é correta se a distância do ponto ao centro-alvo for <= radius.

```txt
correct if distance(userPoint, targetCenter) <= radius
```

### 7.3 Validação — modo retângulo

* Usuário arrasta para formar um retângulo.
* A resposta é correta se o retângulo do usuário tiver **IoU** (intersection over union) >= limiar.

No MVP, usar limiar simples:

* `IOU_THRESHOLD = 0.3`

> Se IoU for complexo demais no MVP, alternativa aceita:
>
> * considerar correto se o **centro do retângulo do usuário** estiver dentro do retângulo-alvo.
>   Essa decisão deve ficar parametrizada em `annotation.ts`.

---

## 8. Comportamento de UI / UX

### ImageViewer

* Exibe a imagem em modo escuro (dark-friendly)
* Permite zoom e pan
* Mostra overlay de marcação por cima

### AnnotationControls

* Botão "Marcar" (ativa modo de marcação)
* Botão "Limpar" (remove marcação atual)
* Botão "Confirmar" (finaliza resposta)

### Feedback

* Após confirmar, exibir feedback imediato (acerto/erro) e explicação curta
* Não permitir múltiplas tentativas na mesma pergunta no MVP

---

## 9. API Interna (assinaturas)

### annotation.ts

```ts
export function normalizePoint(p: Point, w: number, h: number): Point
export function normalizeRect(r: Rect, w: number, h: number): Rect

export function isPointCorrect(params: {
  user: Point
  targetCenter: Point
  radius: number
}): boolean

export function iou(a: Rect, b: Rect): number

export function isRectCorrect(params: {
  user: Rect
  target: Rect
  threshold: number
  mode?: 'iou' | 'center-in-target'
}): boolean
```

---

## 10. Integração com Quiz

### Regras

* Questões de imagem entram no fluxo do Quiz como `type: 'image'`.
* O Quiz deve:
  1. renderizar `ImageViewer`
  2. coletar anotação
  3. validar via `annotation.ts`
  4. gerar `isCorrect`
  5. exibir `QuizFeedback`

---

## 11. Limitações do MVP

* 1 anotação por questão
* Sem ferramentas avançadas
* Sem export de imagem
* Sem DICOM

---

## 12. Critérios de Aceitação

* Usuário consegue dar zoom/pan sem travar
* Consegue marcar ponto/retângulo
* Validação de resposta funciona conforme regras
* Coordenadas são salvas normalizadas
* Integração com Quiz funciona sem quebra de fluxo

---

## 13. Fora de Escopo

Qualquer comportamento não descrito aqui.
