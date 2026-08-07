from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import sys
from pathlib import Path

MANIFEST_FIELDS = ("id", "sourceSlug", "pageStart", "pageEnd")
MOTIVO_SEM_CATALOGO = "fonte ausente do catalogo de direitos"
MOTIVO_SEM_AUTORIZACAO = "classe de direitos nao autorizada"


def excerpt_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def manifest_line(excerpt: dict, rights_class: str) -> dict:
    line = {field: excerpt[field] for field in MANIFEST_FIELDS}
    line["hash"] = excerpt_hash(excerpt["text"])
    line["rightsClass"] = rights_class
    return line


def write_manifest(lines: list[dict], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    ordenadas = sorted(lines, key=lambda line: line["id"])
    corpo = "\n".join(json.dumps(line, ensure_ascii=False) for line in ordenadas)
    path.write_text(corpo + "\n", encoding="utf-8")


def rights_by_slug(catalog: dict, normalize) -> dict[str, dict]:
    tabela: dict[str, dict] = {}
    for fonte in catalog["sources"]:
        slug = normalize(Path(fonte["primaryPath"]).name)
        tabela[slug] = {
            "sourceId": fonte["id"],
            "rightsClass": fonte["rightsClass"],
            "commercialUse": fonte.get("commercialUse"),
        }
    return tabela


def partition_excerpts(excerpts: list[dict], rights: dict) -> tuple[list[dict], list[dict]]:
    linhas: list[dict] = []
    descartes: list[dict] = []
    for excerpt in excerpts:
        info = rights.get(excerpt["sourceSlug"])
        if info is None:
            descartes.append(
                {
                    "excerptId": excerpt["id"],
                    "sourceSlug": excerpt["sourceSlug"],
                    "sourceId": None,
                    "rightsClass": None,
                    "motivo": MOTIVO_SEM_CATALOGO,
                }
            )
            continue
        if info["rightsClass"] != "authorized":
            descartes.append(
                {
                    "excerptId": excerpt["id"],
                    "sourceSlug": excerpt["sourceSlug"],
                    "sourceId": info["sourceId"],
                    "rightsClass": info["rightsClass"],
                    "motivo": MOTIVO_SEM_AUTORIZACAO,
                }
            )
            continue
        linhas.append(manifest_line(excerpt, info["rightsClass"]))
    return linhas, descartes


def write_descartes(descartes: list[dict], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps({"descartes": descartes}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def _normalize_source_slug():
    spec = importlib.util.spec_from_file_location(
        "extract_source", Path(__file__).with_name("extract-source.py")
    )
    modulo = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(modulo)
    return modulo.normalize_source_slug


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--extractions", required=True, help="raiz de Conteúdo/extrações")
    parser.add_argument("--catalog", required=True)
    parser.add_argument("--out-dir", required=True)
    args = parser.parse_args()

    catalog = json.loads(Path(args.catalog).read_text(encoding="utf-8"))
    direitos = rights_by_slug(catalog, _normalize_source_slug())

    excerpts: list[dict] = []
    for arquivo in sorted(Path(args.extractions).glob("*/excerpts.json")):
        excerpts.extend(json.loads(arquivo.read_text(encoding="utf-8"))["excerpts"])

    linhas, descartes = partition_excerpts(excerpts, direitos)
    out = Path(args.out_dir)
    write_manifest(linhas, out / "manifest.jsonl")
    write_descartes(descartes, out / "descartes.json")

    print(
        json.dumps(
            {"excerptsLidos": len(excerpts), "linhas": len(linhas), "descartes": len(descartes)},
            ensure_ascii=False,
        )
    )
    return 0 if linhas else 1


if __name__ == "__main__":
    sys.exit(main())
