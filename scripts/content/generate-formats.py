from __future__ import annotations

import argparse
import json
import re
import unicodedata
from collections import defaultdict
from pathlib import Path


CONTENT_ROOT_NAME = "conteúdo"
GENERATOR_VERSION = "deterministic-concept-format-v1"
TAXONOMY_VERSION = "mvp-2026-04-04"


FORMAT_TITLES = {
    "microlições": "Microlição",
    "quizzes": "Quiz",
    "reviews": "Revisão",
    "casos": "Caso",
}

FORMAT_TYPES = tuple(FORMAT_TITLES.keys())


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    normalized = normalized.lower()
    normalized = re.sub(r"[^a-z0-9]+", "-", normalized)
    return re.sub(r"-+", "-", normalized).strip("-")


def stable_slot(seed: str, size: int = 4) -> int:
    if size <= 0:
        return 0
    return sum(ord(ch) for ch in seed) % size


def dedupe(values: list[str]) -> list[str]:
    seen = set()
    result = []
    for value in values:
        if value and value not in seen:
            result.append(value)
            seen.add(value)
    return result


def format_page_ranges(page_numbers: list[int]) -> str:
    if not page_numbers:
        return "p. ?"

    ranges = []
    start = page_numbers[0]
    previous = page_numbers[0]
    for page in page_numbers[1:]:
        if page == previous + 1:
            previous = page
            continue
        ranges.append((start, previous))
        start = page
        previous = page
    ranges.append((start, previous))

    formatted = []
    for start_page, end_page in ranges:
        if start_page == end_page:
            formatted.append(f"p. {start_page}")
        else:
            formatted.append(f"p. {start_page}-{end_page}")
    return ", ".join(formatted)


def load_source_entry(repo_root: Path, source_slug: str) -> dict:
    source_index = read_json(repo_root / CONTENT_ROOT_NAME / "fontes" / "index.json")
    for source in source_index["sources"]:
        if source["slug"] == source_slug:
            return source
    raise ValueError(f"Unknown source slug: {source_slug}")


def load_concepts(repo_root: Path, source_slug: str) -> dict:
    return read_json(repo_root / CONTENT_ROOT_NAME / "conceitos" / source_slug / "concepts.json")


def load_excerpts(repo_root: Path, source_slug: str) -> dict[str, dict]:
    payload = read_json(repo_root / CONTENT_ROOT_NAME / "extrações" / source_slug / "excerpts.json")
    return {item["id"]: item for item in payload["excerpts"]}


def build_concept_order(concepts: list[dict], excerpt_lookup: dict[str, dict]) -> list[dict]:
    def concept_key(concept: dict) -> tuple[int, str]:
        pages = [
            excerpt_lookup[source_excerpt_id]["pageStart"]
            for source_excerpt_id in concept["sourceExcerptIds"]
            if source_excerpt_id in excerpt_lookup
        ]
        return (min(pages) if pages else 9999, concept["title"])

    return sorted(concepts, key=concept_key)


def collect_dominant_signals(concept: dict) -> list[str]:
    dominant = concept.get("dominantSignals") or {}
    ordered = []
    for level in ("star", "planet", "galaxy"):
        ordered.extend(dominant.get(level, []))
    return dedupe(ordered)


def build_source_pages(concept: dict, excerpt_lookup: dict[str, dict]) -> list[int]:
    return sorted(
        {
            page
            for source_excerpt_id in concept["sourceExcerptIds"]
            for page in range(
                excerpt_lookup[source_excerpt_id]["pageStart"],
                excerpt_lookup[source_excerpt_id]["pageEnd"] + 1,
            )
        }
    )


def build_evidence_block(source_pages: list[int], source_excerpt_count: int) -> dict:
    return {
        "id": "evidence",
        "type": "evidence",
        "title": "Evidência",
        "bullets": [
            f"Trechos-base: {format_page_ranges(source_pages)}",
            f"Fontes associadas: {source_excerpt_count}",
        ],
    }


def build_bundle_title(format_type: str, concept_title: str) -> str:
    return f"{FORMAT_TITLES[format_type]}: {concept_title}"


def build_microlesson_bundle(
    source: dict,
    concept: dict,
    excerpt_lookup: dict[str, dict],
) -> dict:
    source_pages = build_source_pages(concept, excerpt_lookup)
    dominant_signals = collect_dominant_signals(concept)

    objective = (
        f"Reconhecer {concept['title'].lower()} dentro da galáxia "
        f"{concept['galaxyId'].replace('galaxy-', '').replace('-', ' ')}."
    )

    blocks = [
        {
            "id": "objective",
            "type": "objective",
            "title": "Objetivo",
            "text": objective,
        },
        {
            "id": "summary",
            "type": "summary",
            "title": "Resumo",
            "text": concept["definition"],
        },
        {
            "id": "signals",
            "type": "signals",
            "title": "Sinais-chave",
            "bullets": dominant_signals[:4],
        },
        {
            "id": "evidence",
            "type": "evidence",
            "title": "Evidência",
            "bullets": build_evidence_block(source_pages, len(concept["sourceExcerptIds"]))["bullets"],
        },
    ]

    return {
        "id": f"format:microlições:{source['slug']}:{concept['slug']}",
        "formatType": "microlições",
        "title": build_bundle_title("microlições", concept["title"]),
        "sourceId": source["id"],
        "sourceSlug": source["slug"],
        "taxonomyVersion": concept["taxonomyVersion"],
        "generationStrategy": GENERATOR_VERSION,
        "reviewStatus": concept["reviewStatus"],
        "conceptIds": [concept["id"]],
        "sourceExcerptIds": concept["sourceExcerptIds"],
        "payload": {
            "conceptId": concept["id"],
            "conceptTitle": concept["title"],
            "objective": objective,
            "summary": concept["definition"],
            "sourcePages": source_pages,
            "blocks": blocks,
        },
    }


def build_review_bundle(
    source: dict,
    concept: dict,
    excerpt_lookup: dict[str, dict],
) -> dict:
    source_pages = build_source_pages(concept, excerpt_lookup)
    dominant_signals = collect_dominant_signals(concept)
    key_signals = dominant_signals[:4]
    if not key_signals:
        key_signals = [concept["title"]]

    blocks = [
        {
            "id": "prompt",
            "type": "prompt",
            "title": "Pergunta",
            "text": f"Como relembrar {concept['title'].lower()}?",
        },
        {
            "id": "recall",
            "type": "recall",
            "title": "Reforço",
            "text": concept["definition"],
        },
        {
            "id": "signals",
            "type": "signals",
            "title": "Gatilhos",
            "bullets": key_signals,
        },
        {
            "id": "evidence",
            "type": "evidence",
            "title": "Evidência",
            "bullets": build_evidence_block(source_pages, len(concept["sourceExcerptIds"]))["bullets"],
        },
    ]

    return {
        "id": f"format:reviews:{source['slug']}:{concept['slug']}",
        "formatType": "reviews",
        "title": build_bundle_title("reviews", concept["title"]),
        "sourceId": source["id"],
        "sourceSlug": source["slug"],
        "taxonomyVersion": concept["taxonomyVersion"],
        "generationStrategy": GENERATOR_VERSION,
        "reviewStatus": concept["reviewStatus"],
        "conceptIds": [concept["id"]],
        "sourceExcerptIds": concept["sourceExcerptIds"],
        "payload": {
            "conceptId": concept["id"],
            "conceptTitle": concept["title"],
            "reviewPrompt": f"Revise {concept['title'].lower()} em uma passada curta.",
            "summary": concept["definition"],
            "keySignals": key_signals,
            "sourcePages": source_pages,
            "blocks": blocks,
        },
    }


def build_distractor_pool(concepts: list[dict], current_concept: dict, kind: str) -> list[str]:
    values = []
    if kind == "title":
        for concept in concepts:
            if concept["id"] != current_concept["id"]:
                values.append(concept["title"])
    else:
        for concept in concepts:
            if concept["id"] == current_concept["id"]:
                continue
            values.extend(collect_dominant_signals(concept))
        values.extend([concept["title"] for concept in concepts if concept["id"] != current_concept["id"]])
    return dedupe(values)


def build_question(prompt: str, correct_answer: str, distractors: list[str], seed: str) -> dict:
    options = dedupe([correct_answer] + distractors)
    while len(options) < 4:
        options.append(f"Alternativa de apoio {len(options) + 1}")
    options = options[:4]
    slot = stable_slot(seed, len(options))
    options.remove(correct_answer)
    options.insert(slot, correct_answer)
    choice_ids = ["A", "B", "C", "D"]
    choices = [{"id": choice_ids[index], "text": value} for index, value in enumerate(options)]
    return {
        "id": f"{slugify(prompt)}-{slugify(seed)}",
        "type": "multiple-choice",
        "prompt": prompt,
        "choices": choices,
        "correctChoiceId": choice_ids[slot],
    }


def build_quiz_bundle(
    source: dict,
    concept: dict,
    concepts: list[dict],
    excerpt_lookup: dict[str, dict],
) -> dict:
    source_pages = build_source_pages(concept, excerpt_lookup)
    dominant_signals = collect_dominant_signals(concept)
    title_distractors = build_distractor_pool(concepts, concept, "title")
    signal_distractors = build_distractor_pool(concepts, concept, "signal")
    primary_signal = dominant_signals[0] if dominant_signals else concept["title"]

    questions = [
        build_question(
            "Qual conceito melhor resume esta unidade?",
            concept["title"],
            title_distractors,
            f"{concept['slug']}:recognition",
        ),
        build_question(
            "Qual sinal aparece com mais força nesta unidade?",
            primary_signal,
            signal_distractors,
            f"{concept['slug']}:signal",
        ),
    ]

    return {
        "id": f"format:quizzes:{source['slug']}:{concept['slug']}",
        "formatType": "quizzes",
        "title": build_bundle_title("quizzes", concept["title"]),
        "sourceId": source["id"],
        "sourceSlug": source["slug"],
        "taxonomyVersion": concept["taxonomyVersion"],
        "generationStrategy": GENERATOR_VERSION,
        "reviewStatus": concept["reviewStatus"],
        "conceptIds": [concept["id"]],
        "sourceExcerptIds": concept["sourceExcerptIds"],
        "payload": {
            "conceptId": concept["id"],
            "conceptTitle": concept["title"],
            "sourcePages": source_pages,
            "questions": questions,
            "explanation": concept["definition"],
        },
    }


def build_case_bundle(
    source: dict,
    concept: dict,
    excerpt_lookup: dict[str, dict],
) -> dict:
    source_pages = build_source_pages(concept, excerpt_lookup)
    dominant_signals = collect_dominant_signals(concept)
    key_signals = dominant_signals[:3]
    if not key_signals:
        key_signals = [concept["title"]]

    signal_phrase = ", ".join(key_signals[:2]) if len(key_signals) >= 2 else key_signals[0]
    blocks = [
        {
            "id": "case",
            "type": "case",
            "title": "Caso",
            "text": (
                f"Em um caso curto de radiologia, a equipe observa pistas como {signal_phrase}. "
                f"Depois, precisa enquadrá-las em {concept['title'].lower()}."
            ),
        },
        {
            "id": "question",
            "type": "question",
            "title": "Pergunta",
            "text": "Qual conceito canônico melhor explica esse caso?",
        },
        {
            "id": "answer",
            "type": "answer",
            "title": "Resposta",
            "text": concept["definition"],
        },
        {
            "id": "evidence",
            "type": "evidence",
            "title": "Evidência",
            "bullets": build_evidence_block(source_pages, len(concept["sourceExcerptIds"]))["bullets"],
        },
    ]

    return {
        "id": f"format:casos:{source['slug']}:{concept['slug']}",
        "formatType": "casos",
        "title": build_bundle_title("casos", concept["title"]),
        "sourceId": source["id"],
        "sourceSlug": source["slug"],
        "taxonomyVersion": concept["taxonomyVersion"],
        "generationStrategy": GENERATOR_VERSION,
        "reviewStatus": concept["reviewStatus"],
        "conceptIds": [concept["id"]],
        "sourceExcerptIds": concept["sourceExcerptIds"],
        "payload": {
            "conceptId": concept["id"],
            "conceptTitle": concept["title"],
            "casePrompt": f"Analise o caso e relacione-o a {concept['title'].lower()}.",
            "keySignals": key_signals,
            "sourcePages": source_pages,
            "blocks": blocks,
        },
    }


def write_json_artifact(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    write_json(path, payload)


def generate_format_layer(
    source_slug: str,
    repo_root: Path,
    formats_root: Path,
    update_index: bool = True,
) -> dict:
    source = load_source_entry(repo_root, source_slug)
    concept_bundle = load_concepts(repo_root, source_slug)
    excerpt_lookup = load_excerpts(repo_root, source_slug)
    concepts = build_concept_order(concept_bundle["concepts"], excerpt_lookup)
    current_format_index_path = formats_root / "index.json"
    if current_format_index_path.exists():
        format_index = read_json(current_format_index_path)
    else:
        format_index = {"version": 1, "jobs": []}

    summary = {}
    for format_type in FORMAT_TYPES:
        bundles = []
        review_ids = []
        for concept in concepts:
            if format_type == "microlições":
                bundle = build_microlesson_bundle(source, concept, excerpt_lookup)
            elif format_type == "quizzes":
                bundle = build_quiz_bundle(source, concept, concepts, excerpt_lookup)
            elif format_type == "reviews":
                bundle = build_review_bundle(source, concept, excerpt_lookup)
            else:
                bundle = build_case_bundle(source, concept, excerpt_lookup)
            bundles.append(bundle)
            if bundle["reviewStatus"] == "needs-review":
                review_ids.append(bundle["id"])

        bundle_dir = formats_root / format_type / source_slug
        bundles_record = {
            "sourceId": source["id"],
            "sourceSlug": source_slug,
            "formatType": format_type,
            "generationStrategy": GENERATOR_VERSION,
            "taxonomyVersion": TAXONOMY_VERSION,
            "bundleCount": len(bundles),
            "needsReviewCount": len(review_ids),
            "bundles": bundles,
        }
        job_record = {
            "id": f"generate:{format_type}:{source_slug}",
            "sourceId": source["id"],
            "sourceSlug": source_slug,
            "formatType": format_type,
            "status": "generated",
            "strategy": GENERATOR_VERSION,
            "taxonomyVersion": TAXONOMY_VERSION,
            "inputArtifacts": {
                "concepts": f"conteúdo/conceitos/{source_slug}/concepts.json",
            },
            "artifacts": {
                "bundles": "bundles.json",
                "bundleCount": len(bundles),
                "needsReviewCount": len(review_ids),
            },
            "reviewQueueBundleIds": review_ids,
        }

        write_json_artifact(bundle_dir / "bundles.json", bundles_record)
        write_json_artifact(bundle_dir / "format-job.json", job_record)

        summary[format_type] = {
            "bundleCount": len(bundles),
            "needsReviewCount": len(review_ids),
            "outputDir": str(bundle_dir),
        }

        if update_index:
            jobs = [job for job in format_index.get("jobs", []) if job.get("id") != job_record["id"]]
            jobs.append(
                {
                    "id": job_record["id"],
                    "sourceId": job_record["sourceId"],
                    "sourceSlug": job_record["sourceSlug"],
                    "formatType": job_record["formatType"],
                    "status": job_record["status"],
                    "strategy": job_record["strategy"],
                    "artifacts": {
                        "bundles": f"formatos/{format_type}/{source_slug}/bundles.json",
                        "bundleCount": len(bundles),
                        "needsReviewCount": len(review_ids),
                    },
                }
            )
            format_index["version"] = format_index.get("version", 1)
            format_index["jobs"] = sorted(jobs, key=lambda item: item["id"])
            write_json_artifact(current_format_index_path, format_index)

    return {
        "sourceSlug": source_slug,
        "formatSummary": summary,
        "formatIndexPath": str(current_format_index_path),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate pedagogical format bundles from normalized concepts.")
    parser.add_argument("--source-slug", required=True)
    parser.add_argument("--repo-root", default=str(Path(__file__).resolve().parents[2]))
    parser.add_argument("--formats-root", default=None)
    parser.add_argument("--no-update-index", action="store_true")
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    formats_root = (
        Path(args.formats_root).resolve()
        if args.formats_root
        else repo_root / CONTENT_ROOT_NAME / "formatos"
    )

    result = generate_format_layer(
        args.source_slug,
        repo_root,
        formats_root,
        update_index=not args.no_update_index,
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
