# Radiant — Closed Beta Scope (v1)

Este documento define **exatamente** o que faz parte da beta fechada do Radiant
e, mais importante, **o que não faz**.

O objetivo da beta é **aprender com controle**, não abrir escala ampla.

---

## 🎯 Objetivo da Beta

Validar, com usuários reais e conhecidos:

- Clareza do fluxo de aprendizado
- Ritmo entre Quiz e Review
- Compreensão de XP, meta diária e streak
- Percepção emocional do personagem Pixel
- Conforto visual (layout + motion)

---

## ✅ O que está incluído

### Core Learning
- Quiz (modo normal)
- Review (Flashcard Review v2)
- XP, streak e meta diária
- Summary screens (Quiz e Review)

### UI & Experiência
- Layout Primitives v1
- Motion Referential Layer
- Pixel (personagem) - ativado de forma sutil
- Dark-first UI
- Learning Road V2 com rollout controlado por flag

### Plataforma
- auth por email/senha
- bootstrap de sessão com refresh
- fila local de sync
- fallback offline-first
- tela `Progresso` como superfície operacional de homologação

### Telemetry
- eventos de uso (Quiz, Review, XP)
- Health Score em shadow mode
- heurísticas em shadow mode
- tela `/telemetry` para análise e debug

---

## ❌ O que NÃO está incluído

- ❌ Lançamento público amplo
- ❌ Aquisição paga ou escala agressiva de crescimento
- ❌ Monetização ativa em produção
- ❌ Multi-tenancy ou backend distribuído por serviço sem gatilho
- ❌ Social, ranking e comunidade
- ❌ Otimizações prematuras de infraestrutura
- ❌ Refatoração estrutural sem necessidade mensurável

---

## ⚠️ Limitações conhecidas

- O app continua local-first e não pode depender da rede para o loop principal
- A camada remota ainda está em rollout controlado e precisa de homologação contínua
- O catálogo inicial ainda é limitado e evolui por ciclos
- Parte da instrumentação continua em fase de amadurecimento

## ✅ O que já existe nesta fase

- auth por email/senha
- bootstrap de sessão persistida
- fila local de sync com retry
- Learning Road V2 atrás de flag
- painel operacional em `Progresso`
- mascote Pixel como referência canônica da experiência

---

## 📌 Importante

Esta beta **não representa a versão final** do produto.
Mudanças estruturais ainda são esperadas com base no aprendizado e nos gatilhos de escala.
