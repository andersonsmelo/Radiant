# Branches remotos apagados em 2026-09-25

**Decisor:** Anderson Melo (dono), na conversa local de 2026-09-25, depois de
ver a lista abaixo ("Sim, os 25").  
**Executor:** o agente, com `git push origin --delete`, um branch por vez.
Foram 25 apagados e nenhuma falha.

**Conferido antes de apagar:**
- cada ponta está contida em `origin/main` (`c9062da`), pelo
  `git merge-base --is-ancestor`;
- não havia nenhuma PR aberta;
- depois, `git branch -r` mostra só `origin/main`.

**Só o remoto foi apagado.** Os branches locais deste Mac ficaram.

Para restaurar um branch:

```bash
git push origin <sha>:refs/heads/<branch>
```

O SHA completo sai do prefixo abaixo com `git rev-parse <prefixo>`, porque os
commits estão na `main`.

| Branch | Ponta |
|---|---|
| `ci/testes-de-conteudo` | `79fb9639329e` |
| `codex/curriculum-v3-foundation` | `6e7f80494175` |
| `codex/radiant-1-4` | `f93d3b2e03f5` |
| `docs/android-verificacao-chave-eas` | `3672661ecf46` |
| `docs/atualiza-estado-2026-09-23` | `1ef9a50cdc51` |
| `docs/consolida-estado-2026-09-23` | `e19bd840273d` |
| `docs/continuidade-2026-09-24` | `492dbb1a23ee` |
| `docs/fila-ressincronizada` | `a05e94be8833` |
| `docs/l2-parecer-v3` | `b05c39e1a6da` |
| `docs/licao-hibrida-piloto` | `85bd286a26d0` |
| `docs/prompt-continuidade-2026-09-24-2` | `de0c8be5d1d1` |
| `docs/radiant-ilimitado-product-ids` | `e3c9bf70c9c5` |
| `docs/sincroniza-pr18` | `064b311f3a3b` |
| `docs/status-repositorio-e-prompt-e2e` | `c2fe46f340cb` |
| `docs/storekit-modulo-local` | `92a5035207db` |
| `feat/1-4-cloudkit-private-backup` | `349468222956` |
| `feat/licao-hibrida-piloto` | `59995fd937ad` |
| `fix/ask-to-buy-pendente` | `0b0283e87d03` |
| `fix/e2e-defeitos-2-e-3` | `842e472c9d16` |
| `fix/licao-hibrida-tela` | `e773dba1bc77` |
| `fix/paridade-caixa-conteudo` | `a5130baa0510` |
| `integ/vidas-1-4` | `b36a398e6c61` |
| `pesquisa/ios27-xcode-eas` | `432bee4e330e` |
| `refactor/aposenta-vidas-legado` | `b7aa165a91d2` |
| `test/e2e-caminhos-dourados-1-4` | `b26d762474c7` |
