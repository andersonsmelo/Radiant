# Classificação

Esta pasta guarda a camada editorial que liga `extrações/` à `taxonomia/`.

## Regras

- cada `excerpt` extraído deve gerar um `classification record`
- cada registro precisa apontar para `galaxyId`, `planetId` e `starId` válidos
- registros com baixa confiança ficam marcados para revisão
- a classificação do piloto usa um baseline determinístico local, sem API externa

## Estado atual

O livro-piloto `Fundamentos de Radiologia` é a primeira obra destinada a receber classificação completa nesta camada.
