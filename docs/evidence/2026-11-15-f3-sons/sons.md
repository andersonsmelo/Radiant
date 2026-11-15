# F3: sons novos (2026-11-15)

Dois sons, ambos **sintetizados no projeto**. Nada foi baixado, gravado ou
amostrado: cada um é uma soma de senoides com decaimento, escrita como
expressão do `aevalsrc` do ffmpeg em `radiant-app/scripts/synth-sounds.mjs`.
Os direitos são do dono do projeto, como os de `combo`, `nivel` e `unidade`.

## Comando gerador

```bash
cd radiant-app && node scripts/synth-sounds.mjs soltar fala
```

ffmpeg 9.0.2 (`/Users/anderson/.local/bin/ffmpeg`). O argumento limita a geração
aos dois; `combo`, `nivel` e `unidade` não foram regerados (`git status` limpo
neles). Três execuções seguidas deram os mesmos bytes.

| Arquivo | Notas (Hz, início, decaimento/s) | Duração (`afinfo`) | Pico / média (`volumedetect`) | SHA-256 |
| --- | --- | --- | --- | --- |
| `soltar.m4a` | 392 em 0 s e 523,25 em 0,035 s, decaimento 40 | 110 ms | −28,0 / −39,2 dBFS | `05b4a122…3056` |
| `fala.m4a` | 880 em 0 s, decaimento 45 | 80 ms | −28,0 / −39,5 dBFS | `a71f6339…7ab4` |

O pico pedido ao script é −28 dBFS para os dois (`peakDb`).

### Nivelamento, 2026-11-15 às 16h15

A primeira versão saiu com o pico em −12,1 e −12,0 dBFS, uns 15 dB acima do `toque`, e
foi apontada na revisão independente (achado 12). O controlador pediu o nivelamento
com os sons de interação antes do merge. Os dois foram regerados com
`peakDb: -28`, sem mudar notas nem duração:

| Som | Antes: pico / média | Depois: pico / média | `toque`: pico / média |
| --- | --- | --- | --- |
| `soltar` | −12,1 / −24,3 dBFS | −28,0 / −39,2 dBFS | −27,5 / −44,3 dBFS |
| `fala` | −12,0 / −23,3 dBFS | −28,0 / −39,5 dBFS | −27,5 / −44,3 dBFS |

O pico agora fica 0,5 dB abaixo do `toque`. A média fica uns 5 dB acima, porque os
dois duram duas a três vezes mais que ele (110 e 80 ms contra 40). As durações não
mudaram e continuam distintas das outras nove.

## Nivelamento com os nove existentes

Medido com `ffmpeg -af volumedetect` no mesmo dia:

| Som | Duração | Pico | Média |
| --- | --- | --- | --- |
| `toque` | 40 ms | −27,5 | −44,3 |
| `fala` (novo) | 80 ms | −28,0 | −39,5 |
| `soltar` (novo) | 110 ms | −28,0 | −39,2 |
| `erro` | 136 ms | −1,0 | −21,1 |
| `vida` | 188 ms | −11,0 | −27,1 |
| `acerto` | 290 ms | −0,9 | −11,5 |
| `sequencia` | 373 ms | −4,8 | −14,8 |
| `combo` | 450 ms | −3,0 | −14,7 |
| `nivel` | 700 ms | −2,9 | −17,1 |
| `fim` | 993 ms | −4,0 | −14,8 |
| `unidade` | 1400 ms | −3,0 | −17,6 |

Os dois novos ficam na faixa do `toque`, o som de interação que o `soltar`
substitui nas fichas, e bem abaixo dos sons de resultado. As onze durações dos arquivos são distintas.
No log do simulador, porém, o `endTime` dos dois novos saiu menor que o arquivo
(85 e 55 ms), e eles foram identificados pela ordem dos players e pelo horário de
cada gesto ([`simulador.txt`](simulador.txt)).

**Não verificado:** se os dois soam agradáveis ou se o volume relativo funciona
no alto-falante de um iPhone. Isso é do dono, de ouvido.
