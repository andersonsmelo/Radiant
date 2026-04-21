# Feature Specification — [NOME DA FEATURE]

## 1. Objetivo da Feature
Descrever claramente o que esta feature faz e por que ela existe.

---

## 2. App Store Impact

- Sinal principal impactado:
- Hipótese de ganho:
- Risco para `D7`, nota média ou estabilidade:
- Mercado afetado: `pt-BR` | `en-US` | ambos
- Plano de medição:
- Janela de leitura:
- Melhora discoverability?
- Melhora conversão?
- Melhora hábito?
- Protege reputação técnica?

---

## 3. Arquivos Envolvidos

### Arquivos a CRIAR
- src/[path]/[file].ts
- src/[path]/[file].tsx

### Arquivos a MODIFICAR
- src/[path]/[file].ts

---

## 4. Estrutura de Pastas
Descrever onde a feature vive no projeto.

Exemplo:
```
src/
 ├─ app/
 ├─ components/
 ├─ hooks/
 ├─ data/
 └─ constants/
```

---

## 5. Fluxo da Feature (Passo a Passo)
1. Usuário inicia a feature
2. Sistema carrega dados necessários
3. Usuário interage
4. Sistema calcula resultado
5. Feedback é exibido
6. Estado é persistido

---

## 6. Estruturas de Dados

### Exemplo
```ts
type Lesson = {
  id: string
  title: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  questions: Question[]
}
```

---

## 7. Regras de Negócio
Definir regras claras. Sem exceções implícitas.

Exemplo:
- Acertou ≥ 80% → domínio confirmado
- Errou ≥ 2 vezes → entra em revisão

---

## 8. Lógica Principal (Pseudo-código)
```
IF answer_correct
  increase XP
  update streak
  update spaced repetition interval
ELSE
  show hint
  schedule early review
END
```

---

## 9. UI / UX (comportamento)
- Feedback imediato (<500ms)
- Mensagens curtas e encorajadoras
- Nenhuma animação obrigatória no MVP
- Se a mudança tocar iOS, explicitar impacto em discoverability, conversão,
  hábito ou reputação técnica

---

## 10. Limitações do MVP
O que conscientemente NÃO será feito agora.

---

## 11. Critérios de Aceitação
- Feature funciona conforme regras descritas
- Nenhum comportamento implícito
- Código modular e legível
- Sem dependências desnecessárias
- Possui plano mínimo de medição
- Não contradiz o App Store Operating System

---

## 12. Fora de Escopo
Qualquer comportamento não descrito neste documento.
