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
| `soltar.m4a` | 392 em 0 s e 523,25 em 0,035 s, decaimento 40 | 110 ms | −12,1 / −24,3 dBFS | `e70ae9e8…b83d8` |
| `fala.m4a` | 880 em 0 s, decaimento 45 | 80 ms | −12,0 / −23,3 dBFS | `89cdaf11…e8e19` |

O pico pedido ao script foi −14 e −12 dBFS; a codificação AAC subiu o do
`soltar` para −12,1.

## Nivelamento com os nove existentes

Medido com `ffmpeg -af volumedetect` no mesmo dia:

| Som | Duração | Pico | Média |
| --- | --- | --- | --- |
| `toque` | 40 ms | −27,5 | −44,3 |
| `fala` (novo) | 80 ms | −12,0 | −23,3 |
| `soltar` (novo) | 110 ms | −12,1 | −24,3 |
| `erro` | 136 ms | −1,0 | −21,1 |
| `vida` | 188 ms | −11,0 | −27,1 |
| `acerto` | 290 ms | −0,9 | −11,5 |
| `sequencia` | 373 ms | −4,8 | −14,8 |
| `combo` | 450 ms | −3,0 | −14,7 |
| `nivel` | 700 ms | −2,9 | −17,1 |
| `fim` | 993 ms | −4,0 | −14,8 |
| `unidade` | 1400 ms | −3,0 | −17,6 |

Os dois novos têm pico perto do `vida` (−11,0), mas média mais alta (−23 a −24
contra −27,1). Ficam abaixo dos sons de resultado e **uns 15 dB acima do `toque`**
no pico (20 dB na média), embora o `soltar` tome o lugar do `toque` nas fichas.
Foi escolha para o encaixe ser percebido; se soa alto demais é decisão de ouvido do
dono (baixar o `peakDb` no script e regerar). As onze durações dos arquivos são distintas.
No log do simulador, porém, o `endTime` dos dois novos saiu menor que o arquivo
(85 e 55 ms), e eles foram identificados pela ordem dos players e pelo horário de
cada gesto ([`simulador.txt`](simulador.txt)).

**Não verificado:** se os dois soam agradáveis ou se o volume relativo funciona
no alto-falante de um iPhone. Isso é do dono, de ouvido.
