# Sons da lição

Nove sons, em dois grupos:

- **seis escolhidos de ouvido pelo dono em 2026-09-23**, entre 40 candidatos,
  para a camada de som e vibração da
  [spec do piloto](../../../docs/superpowers/specs/2026-09-23-licao-hibrida-piloto-design.md),
  §5.2;
- **três autorais, sintetizados em 2026-11-05** para a trilha ampla
  ([plano](../../../docs/plans/2026-11-05-radiant-trilha-ampla-e-engajamento.md),
  I6): `combo`, `nivel` e `unidade`.

Quem os toca é `src/ui/feedback/lessonSounds.ts`, que carrega os nove na
abertura da aula. Quem decide o que toca em cada evento é
`src/ui/feedback/lessonFeedback.ts`, que respeita os interruptores de som e
vibração do Perfil. A chave de silencioso do iPhone vale
(`playsInSilentMode: false`).

| Evento (`lessonFeedback`) | Som |
| --- | --- |
| `option_tap` | `toque` |
| `correct` | `acerto` |
| `incorrect` | `erro` |
| `heart_lost` | `vida`, 320 ms depois do erro e junto do aviso de vida perdida |
| `streak` | `sequencia`, na 3ª resposta certa seguida |
| `combo` | `combo`, na 5ª e na 10ª |
| `lesson_complete` | `fim`, na conclusão com pelo menos uma estrela |
| `level_up` | `nivel` |
| `unit_complete` | `unidade` |

## Licença

Os seis primeiros vêm do [Kenney](https://kenney.nl), sob **Creative Commons
Zero (CC0 1.0)**: uso comercial livre, sem crédito obrigatório. O texto da
licença de cada pacote está ao lado, como veio no download:
[`LICENSE-kenney-interface-sounds.txt`](LICENSE-kenney-interface-sounds.txt) e
[`LICENSE-kenney-music-jingles.txt`](LICENSE-kenney-music-jingles.txt).

`combo.m4a`, `nivel.m4a` e `unidade.m4a` são **obra autoral do projeto
Radiant**. Nenhum material de terceiros entra neles: cada um é uma soma de
senoides com decaimento, escrita como expressão matemática em
[`scripts/synth-sounds.mjs`](../../scripts/synth-sounds.mjs) e renderizada pelo
`ffmpeg`. Não há amostra, gravação nem download. Os direitos são do dono do
projeto, e os arquivos seguem a licença do repositório.

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

Os três autorais, gerados por `node scripts/synth-sounds.mjs` (AAC em `.m4a`,
mono, 44,1 kHz, pico em -3 dBFS). As durações foram medidas com `afinfo` em
2026-11-05 e são distintas entre si e das seis acima, o que permite reconhecer
cada som pelo log do simulador:

| Arquivo | Evento | Desenho | Duração |
| --- | --- | --- | --- |
| `combo.m4a` | 5 e 10 acertos seguidos | arpejo de dó maior, quatro notas para cima | 450 ms |
| `nivel.m4a` | subida de nível | arpejo de três notas que pousa num acorde | 700 ms |
| `unidade.m4a` | unidade concluída | fanfarra de quatro notas, acorde sustentado e um brilho | 1400 ms |

## Integridade (SHA-256)

| Arquivo | Original (`.ogg`) | Convertido (`.m4a`) |
| --- | --- | --- |
| `toque.m4a` | `aec0c31ea934a35936ae0d2ab8fac8123c93aa5647f935853a58dbaf90278b7a` | `ce08b57530c3f930cfcaaeb8518276c4baab1c304801f1b88f5991de5fa2cd68` |
| `acerto.m4a` | `063564703b6094d70718a3e787a55cc9141611e4ecd6b6637f8828f79b4a8c3a` | `0c0ee195ecf4fb5eb18c08581f8e95bad16acf04143bee01121fcede3cc6bf08` |
| `erro.m4a` | `eba17ecb2a426bfd4a8a6acff5f8a86202b6424a77af0fd842e37809a1ab6d81` | `adbee651eb2d3f95f3dc3e7bb80f8aa421590bb3deb0bd1ada618c3af69f5fac` |
| `vida.m4a` | `4ac4d1cef7e936965cbf795852ca2020300b9e2ba7daa59f2bf4f1f7bf416218` | `acb66ba62b818f2c5c8a9a12734e30ece0fe55543eaf23c4b4b0de56d019701f` |
| `sequencia.m4a` | `d1ccfd0aa466abe7240e7fb011390513c244884288b98366799bc763c6cff62d` | `6ca72d3908c09a3449fe5328c77189b86dd27a8bab899107c1fffc7eed1fc923` |
| `fim.m4a` | `f5fc4c01b106e6317acaee1bffb51704e41c85b0fa7529dff86b447bdabf150c` | `c1148e9e718fd9709c9e6e8cd60e9071c9933e089242c45c306c4dad66affe43` |
| `combo.m4a` | sintetizado, sem original | `fd09b983ebd8631fb87e8a9b22acd5bd19914e2eef0cc98f698b90afae30bd22` |
| `nivel.m4a` | sintetizado, sem original | `06b1a7c2ab8554b8ade5b6cd4f23029d2dd1ff8e9a59953a0aadcaf54304a647` |
| `unidade.m4a` | sintetizado, sem original | `5d2c8db8f16f61d8519364654340f729c02050d1b5bbcbda7862452641d21c10` |

Os três sintetizados saíram com os mesmos bytes em duas execuções seguidas do
script, com o ffmpeg 9.0.2. Outra versão do ffmpeg pode gerar bytes diferentes
para o mesmo som.

## Para trocar um som

Os nomes são por evento, não pelo som, de propósito: trocar um som é substituir
o arquivo, atualizar a linha correspondente nas tabelas acima e anotar a data.
O código não muda. Para os três sintetizados, mude as notas em
`scripts/synth-sounds.mjs`, rode o script e confira a duração com `afinfo`:
ela precisa continuar diferente das outras oito.

```bash
cd radiant-app/assets/sounds && shasum -a 256 *.m4a
```
