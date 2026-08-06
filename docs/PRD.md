# Radiant — Product Requirements Document (PRD)

> **Estado:** requisitos-base vigentes. A evolução educacional por competências
> foi aprovada em 2026-07-31 e está sendo implementada de forma incremental; ver
> a [spec normativa](superpowers/specs/2026-07-31-sistema-aprendizagem-competencias-design.md)
> e o [status canônico](EXECUTION_STATUS_2026-08-06.md).

## 1. Visão do Produto

Radiant é um aplicativo educacional gamificado premium focado em **Radiologia**, projetado para transformar o estudo técnico em um **hábito diário**, com retenção de longo prazo e aplicação prática real.

O Radiant combina **microlearning**, **casos clínicos reais**, **repetição espaçada** e **gamificação séria**, respeitando o rigor técnico e científico da área médica.

O app não substitui cursos completos ou residência, mas atua como um **treinador diário de raciocínio radiológico**.

---

## 2. Objetivo do Produto

Permitir que estudantes e profissionais de radiologia:

* Estudem em blocos curtos (2–5 minutos)
* Fixem o conhecimento por meio de revisão inteligente
* Desenvolvam raciocínio diagnóstico progressivo
* Criem constância no estudo

---

## 3. Público-Alvo

### Público Primário (MVP)

* Estudantes de Radiologia
* Técnicos e Tecnólogos em Radiologia

### Público Secundário (fase futura)

* Residentes em Radiologia
* Profissionais em atualização
* Instituições de ensino (B2B)

---

## 4. Problemas que o Radiant Resolve

* Estudo teórico desconectado da prática clínica
* Baixa retenção de conteúdo ao longo do tempo
* Falta de feedback imediato
* Falta de constância e disciplina no estudo
* Ferramentas educacionais pouco interativas para radiologia

---

## 5. Proposta de Valor

* Microlições objetivas (2–5 minutos)
* Casos clínicos baseados em imagens reais
* Repetição espaçada automatizada
* Progressão baseada em domínio, não em tempo
* Gamificação focada em competência clínica
* Interface moderna, limpa e técnica

---

## 6. Escopo do MVP

### 6.1 O que o MVP INCLUI

* 1 trilha inicial de aprendizado
  * Exemplo: CXR básico + introdução à TC
* Sistema de quiz interativo
* Feedback imediato de acerto/erro
* Repetição espaçada (algoritmo SM-2 simplificado)
* Sistema de XP
* Streak diário
* Badges por marcos clínicos
* Anotação simples em imagens (JPEG)
* Dark mode
* Onboarding com "quick win" antes do login

### 6.2 O que o MVP NÃO INCLUI

* Viewer DICOM completo
* Upload de casos por usuários
* Comunidade ativa ou comentários abertos
* Leaderboards globais
* Certificação oficial ou créditos CME
* Conteúdo em vídeo longo

---

## 7. Fluxo Principal do Usuário

1. Usuário abre o app
2. Realiza uma microlição inicial sem login
3. Recebe feedback imediato
4. É convidado a criar conta para salvar progresso
5. Escolhe trilha inicial
6. Realiza lições diárias
7. Mantém streak e progresso
8. Recebe revisões automáticas (spaced repetition)

---

## 8. Experiência do Usuário (UX)

* Interface limpa e sem poluição visual
* Feedback imediato (<500ms)
* Linguagem técnica, clara e encorajadora
* Gamificação discreta (apoio ao aprendizado, não distração)
* Acessível para estudo rápido em qualquer momento do dia

---

## 9. Gamificação (nível MVP)

### Elementos incluídos

* XP por lição concluída
* Bônus por desempenho
* Streak diário visível
* Badges clínicos (ex: "Pneumotórax — 5 casos corretos")

### Princípios

* Gamificação deve reforçar aprendizado
* Evitar recompensas abstratas
* Evitar pressão excessiva ou punição severa

---

## 10. Métricas de Sucesso (MVP)

* Retenção D1 ≥ 35%
* Retenção D7 ≥ 20%
* Retenção D30 ≥ 15%
* Conversão Free → Premium ≥ 10%
* Sessão média ≥ 3 minutos
* Avaliação nas lojas ≥ 4.5

---

## 11. Restrições Técnicas

* Código modular e simples
* Evitar overengineering
* Arquitetura preparada para escalar
* Uso de IA apenas como apoio técnico (não decisório)
* Conteúdo médico revisado

---

## 12. Fora de Escopo

Qualquer funcionalidade não explicitamente descrita neste documento está fora do escopo do MVP.

---

## 13. Princípio Norteador

> O Radiant não ensina para passar em prova.
> Ele treina para pensar como radiologista.

---

## 14. Evolução aprovada — aprendizagem por competências

A primeira expansão após o baseline do MVP atende estudantes iniciantes de
técnico em radiologia na trilha **Fundamentos e Segurança Radiológica**.

Contratos de produto aprovados:

- sessões principais de 3–5 minutos;
- currículo espiral com 30 competências em seis unidades;
- tentativa ativa, feedback causal, aplicação visual e recuperação posterior;
- checkpoint por unidade com gate específico para erros críticos de segurança;
- domínio e retenção como métricas primárias de aprendizagem;
- XP e sequência como apoio, sem punição severa;
- vidas nunca bloqueiam estudo;
- ranking global fora da primeira fase;
- conteúdo e mídia promovidos somente após direitos, proveniência, anonimização
  e revisão humana.

Esta seção define intenção de produto. Estado, sequência e bloqueios pertencem
ao roadmap e ao status canônico, não a este PRD.
