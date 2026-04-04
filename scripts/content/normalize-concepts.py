from __future__ import annotations

import argparse
import json
import re
import unicodedata
from collections import Counter
from pathlib import Path


CONTENT_ROOT_NAME = "conteúdo"
NORMALIZER_VERSION = "deterministic-page-cluster-v1"
TAXONOMY_VERSION = "mvp-2026-04-04"


CONCEPT_SPECS: list[dict[str, object]] = [
    {
        "title": "Profissão e atuação do técnico em radiologia",
        "slug": "profissao-e-atuacao-do-tecnico-em-radiologia",
        "pageRanges": [(1, 3)],
        "galaxyId": "galaxy-fisica",
        "planetId": "planet-formacao-imagem",
        "starId": "star-artefatos-basicos",
        "definition": "Consolida os trechos introdutórios sobre o papel do técnico em radiologia, sua rotina de trabalho e sua atuação no fluxo de diagnóstico por imagem.",
    },
    {
        "title": "Energia e matéria",
        "slug": "energia-e-materia",
        "pageRanges": [(4, 7)],
        "galaxyId": "galaxy-fisica",
        "planetId": "planet-formacao-imagem",
        "starId": "star-artefatos-basicos",
        "definition": "Agrupa a base conceitual sobre energia, matéria e conversão de energia que prepara o leitor para compreender os fenômenos físicos da radiologia.",
    },
    {
        "title": "Estrutura da matéria e núcleo atômico",
        "slug": "estrutura-da-materia-e-nucleo-atomico",
        "pageRanges": [(8, 11)],
        "galaxyId": "galaxy-fisica",
        "planetId": "planet-formacao-imagem",
        "starId": "star-artefatos-basicos",
        "definition": "Consolida a explicação sobre átomo, núcleo, prótons, nêutrons, isótopos e fissão nuclear como fundamento da física aplicada ao livro.",
    },
    {
        "title": "Radioatividade, partículas e atividade",
        "slug": "radioatividade-particulas-e-atividade",
        "pageRanges": [(12, 16)],
        "galaxyId": "galaxy-fisica",
        "planetId": "planet-radiopacidade",
        "starId": "star-dose-radiacao",
        "definition": "Reúne os trechos sobre descoberta da radioatividade, emissão de radiações, partículas associadas e efeitos biológicos da atividade nuclear.",
    },
    {
        "title": "Raios X: descoberta e propriedades",
        "slug": "raios-x-descoberta-e-propriedades",
        "pageRanges": [(17, 20)],
        "galaxyId": "galaxy-fisica",
        "planetId": "planet-formacao-imagem",
        "starId": "star-artefatos-basicos",
        "definition": "Agrupa a origem histórica dos raios X, suas propriedades básicas e a relação entre radiação e produção de imagem diagnóstica.",
    },
    {
        "title": "Interação das radiações e proteção radiológica",
        "slug": "interacao-das-radiacoes-e-protecao-radiologica",
        "pageRanges": [(21, 25), (57, 59)],
        "galaxyId": "galaxy-fisica",
        "planetId": "planet-radiopacidade",
        "starId": "star-dose-radiacao",
        "definition": "Consolida os trechos sobre interação da radiação com matéria, dose, exposição ocupacional, proteção e blindagem radiológica.",
    },
    {
        "title": "Aplicações radioisotópicas e medicina nuclear",
        "slug": "aplicacoes-radioisotopicas-e-medicina-nuclear",
        "pageRanges": [(26, 32), (39, 40)],
        "galaxyId": "galaxy-fisica",
        "planetId": "planet-radiopacidade",
        "starId": "star-dose-radiacao",
        "definition": "Agrupa as aplicações dos radioisótopos em diagnóstico, terapia, indústria e estudos funcionais, com destaque para medicina nuclear.",
    },
    {
        "title": "Tomografia computadorizada",
        "slug": "tomografia-computadorizada",
        "pageRanges": [(33, 34)],
        "galaxyId": "galaxy-fisica",
        "planetId": "planet-formacao-imagem",
        "starId": "star-artefatos-basicos",
        "definition": "Consolida os trechos sobre aquisição de projeções, reconstrução e funcionamento básico da tomografia computadorizada.",
    },
    {
        "title": "Ressonância magnética",
        "slug": "ressonancia-magnetica",
        "pageRanges": [(35, 38)],
        "galaxyId": "galaxy-fisica",
        "planetId": "planet-formacao-imagem",
        "starId": "star-artefatos-basicos",
        "definition": "Reúne a base física da ressonância magnética, o comportamento dos prótons e a leitura do sinal em campo magnético.",
    },
    {
        "title": "Preservação de alimentos por irradiação",
        "slug": "preservacao-de-alimentos-por-irradicao",
        "pageRanges": [(41, 42)],
        "galaxyId": "galaxy-fisica",
        "planetId": "planet-radiopacidade",
        "starId": "star-dose-radiacao",
        "definition": "Agrupa o uso da radiação na conservação e tratamento de alimentos, com foco em finalidade, aplicação e efeito tecnológico.",
    },
    {
        "title": "Equipamentos de radiologia convencional",
        "slug": "equipamentos-de-radiologia-convencional",
        "pageRanges": [(43, 46)],
        "galaxyId": "galaxy-fisica",
        "planetId": "planet-formacao-imagem",
        "starId": "star-artefatos-basicos",
        "definition": "Consolida os trechos sobre equipamento fixo, equipamento móvel e a operação básica dos sistemas de radiologia convencional.",
    },
    {
        "title": "Componentes básicos do equipamento",
        "slug": "componentes-basicos-do-equipamento",
        "pageRanges": [(47, 49)],
        "galaxyId": "galaxy-fisica",
        "planetId": "planet-formacao-imagem",
        "starId": "star-artefatos-basicos",
        "definition": "Agrupa os elementos estruturais do equipamento radiológico, como cabeçote, colimação, feixe, mesa e estativa.",
    },
    {
        "title": "Acessórios radiológicos",
        "slug": "acessorios-radiologicos",
        "pageRanges": [(50, 55), (60, 60)],
        "galaxyId": "galaxy-fisica",
        "planetId": "planet-formacao-imagem",
        "starId": "star-artefatos-basicos",
        "definition": "Reúne os acessórios e suportes radiológicos usados para posicionamento, contenção, proteção e apoio operacional do exame.",
    },
    {
        "title": "Processamento radiográfico",
        "slug": "processamento-radiografico",
        "pageRanges": [(56, 56), (61, 61), (66, 69)],
        "galaxyId": "galaxy-fisica",
        "planetId": "planet-radiopacidade",
        "starId": "star-dose-radiacao",
        "definition": "Consolida os trechos sobre processamento, revelação, fixação e formação/armazenamento da imagem radiográfica.",
    },
    {
        "title": "Produção dos raios X",
        "slug": "producao-dos-raios-x",
        "pageRanges": [(62, 65)],
        "galaxyId": "galaxy-fisica",
        "planetId": "planet-formacao-imagem",
        "starId": "star-artefatos-basicos",
        "definition": "Agrupa a explicação sobre como o tubo e seus componentes produzem raios X a partir da aceleração e da interação de elétrons.",
    },
    {
        "title": "Qualidade de imagem",
        "slug": "qualidade-de-imagem",
        "pageRanges": [(70, 75)],
        "galaxyId": "galaxy-fisica",
        "planetId": "planet-radiopacidade",
        "starId": "star-dose-radiacao",
        "definition": "Reúne os critérios técnicos de qualidade da imagem radiográfica, incluindo contraste, densidade, distorção e velamento.",
    },
]


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    normalized = normalized.lower()
    normalized = re.sub(r"[^a-z0-9]+", "-", normalized)
    return re.sub(r"-+", "-", normalized).strip("-")


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def page_in_ranges(page_number: int, page_ranges: list[tuple[int, int]]) -> bool:
    return any(start <= page_number <= end for start, end in page_ranges)


def expand_page_ranges(page_ranges: list[tuple[int, int]]) -> list[int]:
    page_numbers: list[int] = []
    for start, end in page_ranges:
        page_numbers.extend(range(start, end + 1))
    return page_numbers


def mean(values: list[float]) -> float:
    return sum(values) / len(values) if values else 0.0


def clamp(value: float, lower: float, upper: float) -> float:
    return max(lower, min(upper, value))


def build_index_path(repo_root: Path) -> Path:
    return repo_root / CONTENT_ROOT_NAME / "conceitos" / "index.json"


def build_source_dir(repo_root: Path, source_slug: str) -> Path:
    return repo_root / CONTENT_ROOT_NAME / "conceitos" / source_slug


def select_records_by_pages(records: list[dict], page_ranges: list[tuple[int, int]]) -> list[dict]:
    selected: list[dict] = []
    for record in records:
        for start, end in page_ranges:
            if record["pageStart"] <= end and record["pageEnd"] >= start:
                selected.append(record)
                break
    selected.sort(key=lambda item: (item["pageStart"], item["pageEnd"], item["id"]))
    return selected


def normalize_concepts(source_slug: str, repo_root: Path, output_dir: Path, update_index: bool = True) -> dict:
    content_root = repo_root / CONTENT_ROOT_NAME
    source_index = read_json(content_root / "fontes" / "index.json")
    classification_index = read_json(content_root / "classificação" / "index.json")
    source_entry = next((item for item in source_index["sources"] if item["slug"] == source_slug), None)
    if source_entry is None:
        raise ValueError(f"Unknown source slug: {source_slug}")

    classification_job = next((job for job in classification_index["jobs"] if job["sourceSlug"] == source_slug), None)
    if classification_job is None or classification_job.get("status") != "classified":
        raise ValueError(f"Source {source_slug} must be classified before concept normalization")

    excerpts_record = read_json(content_root / "extrações" / source_slug / "excerpts.json")
    classifications_record = read_json(content_root / "classificação" / source_slug / "classifications.json")

    excerpts = excerpts_record["excerpts"]
    classifications = classifications_record["classifications"]
    excerpt_by_id = {item["id"]: item for item in excerpts}
    classification_by_excerpt_id = {item["sourceExcerptId"]: item for item in classifications}

    concepts: list[dict[str, object]] = []
    concept_source_excerpt_ids: list[str] = []
    review_queue: list[str] = []

    for spec in CONCEPT_SPECS:
        page_ranges = spec["pageRanges"]  # type: ignore[assignment]
        selected_excerpts = select_records_by_pages(excerpts, page_ranges)
        selected_classifications = [classification_by_excerpt_id[item["id"]] for item in selected_excerpts if item["id"] in classification_by_excerpt_id]

        if len(selected_excerpts) != len(selected_classifications):
            missing = sorted(item["id"] for item in selected_excerpts if item["id"] not in classification_by_excerpt_id)
            raise ValueError(f"Missing classifications for concept {spec['slug']}: {missing}")

        source_excerpt_ids = [item["id"] for item in selected_excerpts]
        source_classification_ids = [item["id"] for item in selected_classifications]
        concept_source_excerpt_ids.extend(source_excerpt_ids)

        total = len(selected_classifications)
        needs_review_count = sum(1 for item in selected_classifications if item["reviewStatus"] == "needs-review")
        review_ratio = needs_review_count / total if total else 0.0

        approved_confidences = [item["confidence"] for item in selected_classifications if item["reviewStatus"] == "approved"]
        base_confidence = mean(approved_confidences) if approved_confidences else mean([item["confidence"] for item in selected_classifications])
        confidence = round(clamp(base_confidence + min(0.04, total * 0.004) - (review_ratio * 0.08), 0.0, 0.99), 3)
        review_status = "needs-review" if review_ratio >= 0.3 else "approved"

        dominant_signals = {
            "galaxy": [],
            "planet": [],
            "star": [],
        }
        signal_counts = {
            "galaxy": Counter(),
            "planet": Counter(),
            "star": Counter(),
        }
        for item in selected_classifications:
            matched_signals = item.get("matchedSignals", {})
            for level in ("galaxy", "planet", "star"):
                signal_counts[level].update(matched_signals.get(level, []))

        for level in ("galaxy", "planet", "star"):
            aggregated = [signal for signal, _ in signal_counts[level].most_common(5)]
            dominant_signals[level] = aggregated

        concept = {
            "id": f"concept:{source_slug}:{spec['slug']}",
            "sourceId": source_entry["id"],
            "sourceSlug": source_slug,
            "slug": spec["slug"],
            "title": spec["title"],
            "taxonomyVersion": TAXONOMY_VERSION,
            "normalizationStrategy": NORMALIZER_VERSION,
            "galaxyId": spec["galaxyId"],
            "planetId": spec["planetId"],
            "starId": spec["starId"],
            "definition": spec["definition"],
            "confidence": confidence,
            "reviewStatus": review_status,
            "sourceExcerptIds": source_excerpt_ids,
            "sourceClassificationIds": source_classification_ids,
        }

        if any(dominant_signals[level] for level in dominant_signals):
            concept["dominantSignals"] = dominant_signals

        concepts.append(concept)

        if review_status == "needs-review":
            review_queue.append(concept["id"])

    if len(set(concept_source_excerpt_ids)) != len(concept_source_excerpt_ids):
        raise ValueError(f"Duplicate excerpt assignment detected for source {source_slug}")

    expected_excerpt_ids = {item["sourceExcerptId"] for item in classifications if item["sourceSlug"] == source_slug}
    if set(concept_source_excerpt_ids) != expected_excerpt_ids:
        missing = sorted(expected_excerpt_ids - set(concept_source_excerpt_ids))
        extras = sorted(set(concept_source_excerpt_ids) - expected_excerpt_ids)
        raise ValueError(f"Concept coverage mismatch for {source_slug}: missing={missing}, extra={extras}")

    concepts.sort(key=lambda item: item["id"])

    bundle = {
        "sourceId": source_entry["id"],
        "sourceSlug": source_slug,
        "strategy": NORMALIZER_VERSION,
        "taxonomyVersion": TAXONOMY_VERSION,
        "conceptCount": len(concepts),
        "needsReviewCount": len(review_queue),
        "concepts": concepts,
    }

    job = {
        "id": f"normalize:{source_slug}",
        "sourceId": source_entry["id"],
        "sourceSlug": source_slug,
        "status": "normalized",
        "strategy": NORMALIZER_VERSION,
        "taxonomyVersion": TAXONOMY_VERSION,
        "inputArtifacts": {
            "classifications": f"conteúdo/classificação/{source_slug}/classifications.json",
            "excerpts": f"conteúdo/extrações/{source_slug}/excerpts.json",
        },
        "artifacts": {
            "concepts": f"conceitos/{source_slug}/concepts.json",
            "conceptCount": len(concepts),
            "needsReviewCount": len(review_queue),
        },
        "reviewQueueConceptIds": review_queue,
    }

    output_dir.mkdir(parents=True, exist_ok=True)
    write_json(output_dir / "concepts.json", bundle)
    write_json(output_dir / "concept-job.json", job)

    if update_index:
        index_path = build_index_path(repo_root)
        if index_path.exists():
            index = read_json(index_path)
        else:
            index = {"version": 1, "jobs": []}

        jobs = [item for item in index.get("jobs", []) if item.get("id") != job["id"]]
        jobs.append({
            "id": job["id"],
            "sourceId": job["sourceId"],
            "sourceSlug": job["sourceSlug"],
            "status": job["status"],
            "strategy": job["strategy"],
            "artifacts": job["artifacts"],
        })
        index["version"] = index.get("version", 1)
        index["jobs"] = jobs
        write_json(index_path, index)

    return {
        "bundle": bundle,
        "job": job,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Normalize classified excerpts into canonical concepts.")
    parser.add_argument("--source-slug", required=True)
    parser.add_argument("--repo-root", default=str(Path(__file__).resolve().parents[2]))
    parser.add_argument("--output-dir", default=None)
    parser.add_argument("--no-update-index", action="store_true")
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    output_dir = Path(args.output_dir).resolve() if args.output_dir else build_source_dir(repo_root, args.source_slug)

    result = normalize_concepts(
        args.source_slug,
        repo_root,
        output_dir,
        update_index=not args.no_update_index,
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
