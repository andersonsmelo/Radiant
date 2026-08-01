# Links legais no app — design aprovado

**Data:** 2026-08-01  
**Status:** aprovado para planejamento; implementação ainda não iniciada  
**Escopo:** aplicativo móvel Radiant 1.3.0 (iOS e Android)

## Problema

O cadastro do Radiant no App Store Connect já existe e está em **Preparar para envio**, mas o aplicativo ainda não oferece um caminho interno, fácil e permanente, para os dois destinos públicos exigidos no fluxo de publicação:

- Política de Privacidade: `https://saudediagnostica.com/radiant/privacidade/`
- Central de Suporte: `https://saudediagnostica.com/radiant/suporte/`

Depender apenas dos campos externos das lojas deixa o usuário sem acesso direto a essas informações dentro do produto e enfraquece a preparação para revisão.

## Objetivo

Adicionar à aba **Progresso** um cartão sempre visível chamado **Ajuda e informações**, com dois links:

1. **Política de Privacidade**
2. **Central de Suporte**

Os links devem abrir no navegador interno fornecido pelo Expo, sem criar nova rota, nova aba ou tela “Sobre”.

## Requisitos funcionais aprovados

- O cartão aparece no fim do conteúdo funcional da tela de Progresso, depois de **Conta e sincronização** e antes das ferramentas exclusivas de desenvolvimento.
- O cartão é visível mesmo quando o usuário está sem autenticação, sem API configurada ou sem conectividade.
- Cada item abre exatamente o destino HTTPS correspondente.
- A abertura usa o componente compartilhado `ExternalLink`, que mantém o usuário no contexto do aplicativo por meio de `expo-web-browser` em plataformas nativas.
- Uma falha ao abrir o navegador mostra uma mensagem simples e não altera progresso, autenticação, fila de sincronização ou qualquer outro estado do aplicativo.

## Requisitos de experiência e acessibilidade

- O cartão reutiliza os tokens visuais galaxy já adotados na tela.
- As novas áreas interativas usam `Pressable` e possuem alvo de toque de pelo menos 44 pontos de altura.
- Cada destino é exposto como link para tecnologias assistivas, com rótulo e dica explícitos.
- O texto do link continua legível sem depender apenas de cor para indicar interatividade.
- A ordem de foco acompanha a ordem visual: privacidade antes de suporte.
- Não serão introduzidas animações novas.

## Arquitetura

### Contrato de URLs

Um módulo pequeno em `radiant-app/src/config/legal.ts` concentra os destinos legais. Isso evita strings duplicadas entre componentes e testes e torna uma futura troca de domínio observável em um único ponto.

### Componente de apresentação

`LegalLinksCard` será criado em `radiant-app/src/features/progress/components/LegalLinksCard.tsx`. Ele será responsável somente por:

- apresentar o título do cartão;
- renderizar os dois links e suas descrições;
- aplicar tokens visuais e semântica de acessibilidade.

O componente não recebe estado de conta, API ou progresso e não dispara telemetria nesta entrega.

### Integração

`ProgressScreen` apenas importa e posiciona `LegalLinksCard`. A abertura externa continua centralizada em `radiant-app/components/external-link.tsx`, que ganhará tratamento seguro para rejeições de `openBrowserAsync`.

## Fluxo de dados

```text
config/legal.ts
      ↓
LegalLinksCard
      ↓ toque
ExternalLink
      ↓ plataforma nativa
expo-web-browser
      ↓
URL pública HTTPS
```

Não há gravação local, chamada à API do Radiant ou envio de dados pessoais nesse fluxo.

## Tratamento de erro

- Em plataforma web, o comportamento padrão do link é preservado.
- Em plataforma nativa, o comportamento padrão é interrompido e `openBrowserAsync` é chamado.
- Se a abertura falhar, o erro é contido e um alerta informa que o link não pôde ser aberto naquele momento.
- A URL não é copiada para armazenamento nem registrada como dado de usuário.

## Estratégia de testes

1. Teste unitário do contrato legal: URLs exatas e protocolo HTTPS.
2. Teste do `ExternalLink`: prevenção da navegação padrão no nativo, abertura interna, propriedades de acessibilidade e falha contida.
3. Teste do `LegalLinksCard`: textos, papéis acessíveis, dicas e destinos.
4. Teste de integração do `ProgressScreen`: cartão presente na tela.
5. Gates existentes do aplicativo e validação integral do Loop.
6. Após a implementação, inspeção manual em iPhone físico e VoiceOver permanece um gate separado de homologação.

## Fora de escopo

- Criar tela “Sobre”, nova rota ou nova aba.
- Alterar autenticação ou sincronização remota.
- Modificar o conteúdo das páginas públicas.
- Preencher campos do App Store Connect nesta etapa.
- Produzir ou enviar um build ao TestFlight.

## Alternativas consideradas

### 1. Cartão na aba Progresso — escolhida

É a menor mudança com boa descoberta, visibilidade permanente e baixo risco de navegação.

### 2. Nova tela “Sobre/Ajuda”

Melhora a expansão futura, mas exige rota, entrada de navegação, novos estados e mais QA do que o necessário para os dois links atuais.

### 3. Links apenas nos metadados das lojas

Evita código novo, porém não oferece acesso dentro do produto e não atende ao objetivo de preparação do aplicativo para revisão.

## Registro de decisões

- **2026-08-01 — Local:** o usuário escolheu a recomendação de usar um cartão na aba Progresso.
- **2026-08-01 — Escopo:** o usuário confirmou que devemos trabalhar em ordem e aprovou a compreensão funcional e os requisitos não funcionais.
- **2026-08-01 — Arquitetura:** o usuário aprovou centralizar URLs, reutilizar `ExternalLink`, não criar nova rota e cobrir o fluxo com testes.
- **2026-08-01 — Gate:** documentação e planejamento precedem qualquer edição de código do aplicativo.
