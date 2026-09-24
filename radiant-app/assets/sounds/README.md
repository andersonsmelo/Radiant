# Sons da lição híbrida

Os seis sons da camada de som e vibração descrita na
[spec do piloto](../../../docs/superpowers/specs/2026-09-23-licao-hibrida-piloto-design.md),
§5.2. **Escolhidos de ouvido pelo dono em 2026-09-23**, entre 40 candidatos.
Ainda não são usados pelo app: nenhum código os referencia.

## Licença

Todos vêm do [Kenney](https://kenney.nl), sob **Creative Commons Zero (CC0
1.0)**: uso comercial livre, sem crédito obrigatório. O texto da licença de
cada pacote está ao lado, como veio no download:
[`LICENSE-kenney-interface-sounds.txt`](LICENSE-kenney-interface-sounds.txt) e
[`LICENSE-kenney-music-jingles.txt`](LICENSE-kenney-music-jingles.txt).

## Origem de cada arquivo

Baixados em 2026-09-23 das páginas oficiais dos pacotes e convertidos de Ogg
Vorbis para AAC (`.m4a`) com `afconvert -f m4af -d aac`, sem outra edição.

| Arquivo | Evento | Original | Pacote | Duração |
| --- | --- | --- | --- | --- |
| `toque.m4a` | toque em opção | `select_001.ogg` | [Interface Sounds](https://kenney.nl/assets/interface-sounds) 1.0 | 40 ms |
| `acerto.m4a` | acerto | `confirmation_001.ogg` | [Interface Sounds](https://kenney.nl/assets/interface-sounds) 1.0 | 290 ms |
| `erro.m4a` | erro | `error_008.ogg` | [Interface Sounds](https://kenney.nl/assets/interface-sounds) 1.0 | 136 ms |
| `vida.m4a` | perda de vida | `drop_002.ogg` | [Interface Sounds](https://kenney.nl/assets/interface-sounds) 1.0 | 188 ms |
| `sequencia.m4a` | 3 e 5 acertos seguidos | `8-Bit jingles/jingles_NES14.ogg` | [Music Jingles](https://kenney.nl/assets/music-jingles) | 373 ms |
| `fim.m4a` | fim de lição | `Pizzicato jingles/jingles_PIZZI12.ogg` | [Music Jingles](https://kenney.nl/assets/music-jingles) | 993 ms |

## Integridade (SHA-256)

| Arquivo | Original (`.ogg`) | Convertido (`.m4a`) |
| --- | --- | --- |
| `toque.m4a` | `aec0c31ea934a35936ae0d2ab8fac8123c93aa5647f935853a58dbaf90278b7a` | `ce08b57530c3f930cfcaaeb8518276c4baab1c304801f1b88f5991de5fa2cd68` |
| `acerto.m4a` | `063564703b6094d70718a3e787a55cc9141611e4ecd6b6637f8828f79b4a8c3a` | `0c0ee195ecf4fb5eb18c08581f8e95bad16acf04143bee01121fcede3cc6bf08` |
| `erro.m4a` | `eba17ecb2a426bfd4a8a6acff5f8a86202b6424a77af0fd842e37809a1ab6d81` | `adbee651eb2d3f95f3dc3e7bb80f8aa421590bb3deb0bd1ada618c3af69f5fac` |
| `vida.m4a` | `4ac4d1cef7e936965cbf795852ca2020300b9e2ba7daa59f2bf4f1f7bf416218` | `acb66ba62b818f2c5c8a9a12734e30ece0fe55543eaf23c4b4b0de56d019701f` |
| `sequencia.m4a` | `d1ccfd0aa466abe7240e7fb011390513c244884288b98366799bc763c6cff62d` | `6ca72d3908c09a3449fe5328c77189b86dd27a8bab899107c1fffc7eed1fc923` |
| `fim.m4a` | `f5fc4c01b106e6317acaee1bffb51704e41c85b0fa7529dff86b447bdabf150c` | `c1148e9e718fd9709c9e6e8cd60e9071c9933e089242c45c306c4dad66affe43` |

## Para trocar um som

Os nomes são por evento, não pelo som, de propósito: trocar um som é substituir
o arquivo, atualizar a linha correspondente nas duas tabelas acima e anotar a
data. O código não muda.

```bash
cd radiant-app/assets/sounds && shasum -a 256 *.m4a
```
