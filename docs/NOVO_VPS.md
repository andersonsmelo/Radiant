# Novo VPS - Radiant API

Ultima atualizacao: `2026-06-14`

## Producao

- VPS: `143.95.208.237`
- SSH: `ssh novo-vps`
- Dominio API: `api.radiant.ascendcreative.com.br`
- Banco migrado: `radiant`
- Reverse proxy: Nginx
- Status atual: conhecido inativo, retorna `502`

## Health check esperado

```bash
curl -skSI https://api.radiant.ascendcreative.com.br/
```

Resultado esperado enquanto Radiant estiver fora de escopo:

```text
HTTP 502
```

Esse `502` nao foi tratado como regressao da migracao, porque era o estado conhecido/inativo antes do cutover.

## Onde olhar se Radiant voltar ao escopo

```bash
ssh novo-vps 'tail -n 120 /var/log/nginx/error.log'
ssh novo-vps 'nginx -t'
ssh novo-vps 'systemctl --failed --no-pager'
```

Observacao: em `2026-06-14`, logs registraram scanners buscando `.env` e `phpinfo` nesse dominio. Manter monitoramento e considerar remover/fechar o vhost caso o Radiant nao seja reativado.

## Documentacao central

```text
/Users/anderson/Developer/Novo VPS/docs/migration-2026-06/
```

