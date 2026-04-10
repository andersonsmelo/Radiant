# Rating And Paywall Timing

## Objetivo

Definir quando o Radiant pode pedir avaliação e quando pode pressionar por
monetização sem sabotar retenção, reviews e percepção de valor.

## Regras do review prompt

### Elegível

O prompt de avaliação pode ser disparado apenas quando o usuário:

- concluiu um momento real de sucesso;
- não está em falha de auth, sync ou rede;
- não está no primeiro open;
- já entendeu o loop central do produto.

Momentos recomendados:

- após completar `Journey -> Lesson -> Checkpoint -> Reward`;
- após uma segunda ou terceira sessão bem-sucedida;
- após completar quiz/review com sensação clara de progresso.

### Bloqueado

Não pedir avaliação:

- no primeiro open;
- antes do `first_value_moment_reached`;
- logo após erro, loading longo ou falha de sync;
- na mesma sessão em que o paywall apareceu cedo demais;
- em builds de debug, homologação ou contexto operacional.

## Regras do paywall

### Estratégia oficial

- monetização padrão: `freemium equilibrado`
- objetivo: converter sem destruir valor inicial

### Permitido

- quick win antes de qualquer pressão comercial;
- paywall contextual depois de valor percebido;
- limite claro de uso sem sensação de “produto ansioso”.

### Proibido

- paywall agressivo no primeiro open;
- bloquear a primeira experiência útil;
- mostrar paywall antes do usuário entender quiz/review/jornada;
- empilhar paywall e review prompt na mesma sessão.

## Eventos obrigatórios

- `first_value_moment_reached`
- `paywall_view`
- `paywall_cta_tap`
- `paywall_outcome`
- `rating_prompt_eligible`
- `rating_prompt_shown`
- `rating_prompt_deferred`
- `rating_prompt_blocked`

## Leituras semanais

- o paywall apareceu antes do valor?
- o prompt de review aconteceu depois de sucesso real?
- houve queda em `D1` ou `D7` após mudança de timing?
- houve aumento de reviews negativos ligados a pressão, travas ou confusão?
