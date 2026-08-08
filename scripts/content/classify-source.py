from __future__ import annotations

import argparse
import json
import re
import unicodedata
from pathlib import Path


CONTENT_ROOT_NAME = "conteúdo"
CLASSIFIER_VERSION = "deterministic-keyword-v1"
TAXONOMY_VERSION = "eixo-tecnico-2026-08-07"


GALAXY_RULES: dict[str, list[tuple[str, float]]] = {
    "galaxy-tecnologia": [
        # Eixo tecnico, acrescentado em 2026-08-08. O vocabulario foi PODADO
        # contra o boilerplate da fonte: "tecnico em radiologia" aparece em 77
        # dos 109 excertos porque e o cabecalho de pagina do modulo, e usa-lo
        # como sinal punha um excerto de dose em "profissao e aplicacoes". O
        # termo de maior aparencia semantica era o do rodape.
        ("bucky", 4.2),
        ("chassi", 4.2),
        ("cassete", 3.8),
        ("ecran", 4.0),
        ("écran", 4.0),
        ("colimador", 4.0),
        ("grade antidifusora", 4.4),
        ("estativa", 3.6),
        ("revelacao", 4.0),
        ("revelação", 4.0),
        ("revelador", 4.0),
        ("fixador", 4.0),
        ("camara escura", 4.4),
        ("câmara escura", 4.4),
        ("processamento", 3.4),
        # "medicina nuclear" fica BAIXO na galaxia e alto no planeta: ele
        # aparece de passagem em texto de dose, e peso alto aqui diluia a
        # confianca de excertos que nao mudavam de destino.
        ("medicina nuclear", 2.6),
        ("cintilografia", 4.4),
        ("radiofarmaco", 4.2),
        ("radiofármaco", 4.2),
        ("ressonancia magnetica", 4.0),
        ("ressonância magnética", 4.0),
        ("irradiacao de alimentos", 4.6),
        ("irradiação de alimentos", 4.6),
        ("alimento", 3.2),
        ("alimentos", 3.2),
        ("esterilizacao", 3.4),
        ("esterilização", 3.4),
        ("carreira", 3.4),
        ("etica profissional", 3.8),
        ("ética profissional", 3.8),
    ],
    "galaxy-fisica": [
        ("energia", 3.0),
        ("matéria", 2.4),
        ("materia", 2.4),
        ("átomo", 3.0),
        ("atomo", 3.0),
        ("núcleo", 3.0),
        ("nucleo", 3.0),
        ("radioatividade", 3.5),
        ("radiação", 3.0),
        ("radiacao", 3.0),
        ("raios x", 4.2),
        ("raio x", 4.2),
        ("raios-x", 4.2),
        ("ionização", 2.8),
        ("ionizacao", 2.8),
        ("tomografia computadorizada", 4.0),
        ("equipamento", 1.6),
        ("equipamentos", 1.6),
        ("acessório", 1.6),
        ("acessorio", 1.6),
        ("dose", 1.8),
        ("proteção", 1.8),
        ("protecao", 1.8),
        ("segurança", 1.8),
        ("seguranca", 1.8),
        ("física", 2.0),
        ("fisica", 2.0),
        ("imagem", 1.4),
    ],
    "galaxy-patologias": [
        ("patologia", 3.0),
        ("patológica", 3.0),
        ("patologica", 3.0),
        ("pneumonia", 3.4),
        ("tumor", 3.0),
        ("tumores", 3.0),
        ("fratura", 3.0),
        ("fraturas", 3.0),
        ("câncer", 3.2),
        ("cancer", 3.2),
        ("síndrome", 3.0),
        ("sindrome", 3.0),
        ("lesão", 3.0),
        ("lesao", 3.0),
        ("pneumotórax", 3.4),
        ("pneumotorax", 3.4),
        ("alveolar", 3.0),
        ("pulmonar", 2.6),
        ("pulmonares", 2.6),
    ],
    "galaxy-anatomia": [
        ("anatomia", 3.0),
        ("tórax", 3.2),
        ("torax", 3.2),
        ("abdome", 3.0),
        ("abdômen", 3.0),
        ("abdomen", 3.0),
        ("pelve", 2.8),
        ("coluna", 2.8),
        ("costela", 2.8),
        ("costelas", 2.8),
        ("ossos", 2.4),
        ("osso", 2.4),
        ("crânio", 2.4),
        ("cranio", 2.4),
        ("pulmão", 2.6),
        ("pulmao", 2.6),
    ],
}


PLANET_RULES: dict[str, dict[str, list[tuple[str, float]]]] = {
    "galaxy-tecnologia": {
        "planet-equipamento": [
            ("bucky", 4.4), ("chassi", 4.4), ("cassete", 4.0), ("ecran", 4.2), ("écran", 4.2),
            ("colimador", 4.2), ("grade", 3.0), ("estativa", 3.8), ("mesa", 2.4),
            ("aparelho", 2.6), ("equipamento", 2.6), ("componente", 3.0),
            ("acessorio", 3.0), ("acessório", 3.0), ("gerador", 2.6),
        ],
        "planet-modalidades": [
            ("medicina nuclear", 4.6), ("cintilografia", 4.6), ("radiofarmaco", 4.4),
            ("radiofármaco", 4.4), ("radioisotopo", 4.2), ("radioisótopo", 4.2),
            ("ressonancia", 4.0), ("ressonância", 4.0), ("tomografia", 3.6),
            ("gama", 2.8), ("ultrassom", 3.0), ("modalidade", 3.0),
        ],
        "planet-imagem-na-pratica": [
            ("revelacao", 4.4), ("revelação", 4.4), ("revelador", 4.4), ("fixador", 4.4),
            ("camara escura", 4.6), ("câmara escura", 4.6), ("processamento", 4.0),
            ("densidade", 2.6), ("contraste", 2.6), ("nitidez", 3.4),
            ("resolucao", 2.8), ("resolução", 2.8), ("artefato", 2.8),
            ("qualidade de imagem", 4.2),
        ],
        "planet-profissao-e-aplicacoes": [
            ("irradiacao de alimentos", 4.8), ("irradiação de alimentos", 4.8),
            ("alimento", 3.6), ("alimentos", 3.6), ("esterilizacao", 3.6),
            ("esterilização", 3.6), ("conservacao", 2.6), ("conservação", 2.6),
            ("carreira", 3.4), ("atuacao", 3.0), ("atuação", 3.0),
            ("etica profissional", 4.0), ("ética profissional", 4.0),
            ("mercado de trabalho", 4.0),
        ],
    },
    "galaxy-fisica": {
        "planet-fisica-da-radiacao": [
            ("energia", 3.4), ("materia", 3.0), ("matéria", 3.0), ("atomo", 3.8), ("átomo", 3.8),
            ("nucleo", 3.8), ("núcleo", 3.8), ("eletron", 3.6), ("elétron", 3.6),
            ("proton", 3.6), ("próton", 3.6), ("neutron", 3.6), ("nêutron", 3.6),
            ("radioatividade", 4.2), ("isotopo", 3.6), ("isótopo", 3.6), ("decaimento", 3.8),
            ("becquerel", 4.2), ("curie", 4.2), ("roentgen", 3.4), ("foton", 3.2), ("fóton", 3.2),
        ],
        "planet-producao-e-protecao": [
            ("producao dos raios", 4.4), ("produção dos raios", 4.4), ("ampola", 4.2),
            ("catodo", 4.2), ("cátodo", 4.2), ("anodo", 4.2), ("ânodo", 4.2),
            ("filamento", 3.8), ("tubo de raios", 4.0), ("compton", 4.2),
            ("fotoeletrico", 4.2), ("fotoelétrico", 4.2), ("atenuacao", 3.6), ("atenuação", 3.6),
            ("blindagem", 4.0), ("avental", 4.0), ("chumbo", 3.6), ("dosimetro", 4.0),
            ("dosímetro", 4.0), ("radioprotecao", 4.2), ("radioproteção", 4.2), ("barreira", 3.0),
        ],
        "planet-formacao-imagem": [
            ("imagem", 2.4),
            ("formação da imagem", 4.4),
            ("formacao da imagem", 4.4),
            ("raios x", 3.8),
            ("raio x", 3.8),
            ("raios-x", 3.8),
            ("tomografia computadorizada", 4.2),
            ("ressonância", 3.0),
            ("ressonancia", 3.0),
            ("angiografia", 2.8),
            ("software", 1.8),
            ("equipamento", 2.4),
            ("equipamentos", 2.4),
            ("aparelho", 2.0),
            ("aparelhos", 2.0),
            ("detector", 1.8),
            ("filme", 1.4),
            ("feixe", 1.8),
            ("tubo", 1.6),
        ],
        "planet-radiopacidade": [
            ("dose", 3.6),
            ("proteção", 3.2),
            ("protecao", 3.2),
            ("segurança", 3.0),
            ("seguranca", 3.0),
            ("atenuação", 3.2),
            ("atenuacao", 3.2),
            ("absorção", 3.0),
            ("absorcao", 3.0),
            ("ionização", 2.8),
            ("ionizacao", 2.8),
            ("efeitos", 2.4),
            ("radiação", 2.2),
            ("radiacao", 2.2),
            ("nêutrons", 2.4),
            ("neutrons", 2.4),
            ("meia vida", 2.0),
            ("atividade", 1.8),
            ("co 60", 2.0),
        ],
    },
    "galaxy-patologias": {
        "planet-padroes-pulmonares": [
            ("pneumonia", 4.4),
            ("pulmonar", 3.2),
            ("pulmão", 3.2),
            ("pulmao", 3.2),
            ("alveolar", 3.6),
            ("intersticial", 3.2),
            ("edema", 2.8),
            ("consolidação", 2.8),
            ("consolidacao", 2.8),
            ("atelectasia", 2.8),
            ("espessamento", 2.0),
        ],
        "planet-patologia-toracica": [
            ("tumor", 4.0),
            ("tumores", 4.0),
            ("fratura", 3.8),
            ("fraturas", 3.8),
            ("câncer", 4.0),
            ("cancer", 4.0),
            ("lesão", 3.6),
            ("lesao", 3.6),
            ("nódulo", 3.2),
            ("nodulo", 3.2),
            ("pneumotórax", 4.2),
            ("pneumotorax", 4.2),
            ("mediastino", 2.6),
        ],
    },
    "galaxy-anatomia": {
        "planet-torax": [
            ("tórax", 4.8),
            ("torax", 4.8),
            ("costela", 3.0),
            ("costelas", 3.0),
            ("pulmão", 3.2),
            ("pulmao", 3.2),
            ("mediastino", 2.6),
            ("coluna", 2.4),
        ],
        "planet-abdomen": [
            ("abdome", 4.6),
            ("abdômen", 4.6),
            ("abdomen", 4.6),
            ("pelve", 4.0),
            ("bacia", 3.4),
            ("visceral", 2.4),
            ("intestino", 2.6),
            ("fígado", 2.6),
            ("figado", 2.6),
        ],
    },
}


STAR_RULES: dict[str, dict[str, list[tuple[str, float]]]] = {
    "galaxy-tecnologia": {},
    "galaxy-fisica": {
        "star-artefatos-basicos": [
            ("equipamento", 3.0),
            ("equipamentos", 3.0),
            ("acessório", 2.8),
            ("acessorio", 2.8),
            ("aparelho", 2.6),
            ("aparelhos", 2.6),
            ("filme", 2.0),
            ("detector", 2.4),
            ("grade", 2.0),
            ("diafragma", 2.0),
            ("mesa", 1.6),
            ("tela", 1.6),
            ("software", 1.8),
        ],
        "star-dose-radiacao": [
            ("dose", 3.8),
            ("proteção", 3.4),
            ("protecao", 3.4),
            ("segurança", 3.2),
            ("seguranca", 3.2),
            ("radiação", 2.8),
            ("radiacao", 2.8),
            ("ionização", 2.8),
            ("ionizacao", 2.8),
            ("efeitos", 2.4),
            ("co 60", 2.0),
        ],
    },
    "galaxy-patologias": {
        "star-sindrome-alveolar": [
            ("síndrome", 4.0),
            ("sindrome", 4.0),
            ("alveolar", 4.2),
            ("pneumonia", 3.8),
            ("pulmonar", 3.0),
            ("pulmão", 3.0),
            ("pulmao", 3.0),
        ],
        "star-pneumotorax": [
            ("pneumotórax", 4.4),
            ("pneumotorax", 4.4),
            ("pleural", 2.8),
            ("colapso", 2.4),
        ],
    },
    "galaxy-anatomia": {
        "star-coluna": [
            ("coluna", 4.0),
            ("vertebra", 3.0),
            ("vértebra", 3.0),
            ("torácica", 3.0),
            ("toracica", 3.0),
        ],
        "star-pelve": [
            ("pelve", 4.0),
            ("bacia", 3.4),
            ("quadril", 3.0),
            ("coxal", 2.2),
        ],
    },
}


DEFAULT_TRACKS = {
    # Sem estrela: os planetas do eixo tecnico nao tem camada de estrela.
    "galaxy-tecnologia": ("planet-equipamento", None),
    "galaxy-fisica": ("planet-formacao-imagem", "star-artefatos-basicos"),
    "galaxy-patologias": ("planet-patologia-toracica", "star-pneumotorax"),
    "galaxy-anatomia": ("planet-torax", "star-coluna"),
}

PLANET_STAR_IDS = {
    "planet-formacao-imagem": ["star-artefatos-basicos"],
    "planet-radiopacidade": ["star-dose-radiacao"],
    "planet-padroes-pulmonares": ["star-sindrome-alveolar"],
    "planet-patologia-toracica": ["star-pneumotorax"],
    "planet-torax": ["star-coluna"],
    "planet-abdomen": ["star-pelve"],
}


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def normalize_text(value: str) -> str:
    normalized = unicodedata.normalize("NFD", value)
    normalized = "".join(ch for ch in normalized if unicodedata.category(ch) != "Mn")
    normalized = normalized.lower()
    normalized = re.sub(r"[^a-z0-9]+", " ", normalized)
    normalized = re.sub(r"\s+", " ", normalized).strip()
    return normalized


def phrase_pattern(phrase: str) -> re.Pattern[str]:
    parts = [re.escape(part) for part in normalize_text(phrase).split()]
    if not parts:
        return re.compile(r"$^")
    return re.compile(r"\b" + r"\s+".join(parts) + r"\b")


def score_rules(normalized_text: str, rules: list[tuple[str, float]]) -> tuple[float, list[str]]:
    score = 0.0
    matches: list[str] = []
    for phrase, weight in rules:
        if phrase_pattern(phrase).search(normalized_text):
            score += weight
            matches.append(phrase)
    return score, matches


def rank_scores(scores: dict[str, float]) -> list[tuple[str, float]]:
    return sorted(scores.items(), key=lambda item: (-item[1], item[0]))


def confidence_from_scores(
    scores: dict[str, float],
    fallback_id: str,
) -> tuple[float, str, float, float]:
    ranking = rank_scores(scores)
    top_id, top_score = ranking[0]
    runner_up_score = ranking[1][1] if len(ranking) > 1 else 0.0
    total = sum(scores.values())

    if total <= 0:
        return 0.35, fallback_id, scores.get(fallback_id, 0.0), 0.0

    strength = top_score / total
    gap = max(top_score - runner_up_score, 0.0)
    confidence = 0.45 + (strength * 0.35) + (min(gap, 4.0) * 0.05)
    confidence = round(min(confidence, 0.98), 3)
    return confidence, top_id, top_score, runner_up_score


def best_match(
    normalized_text: str,
    rules: list[tuple[str, list[tuple[str, float]]]],
    fallback_id: str,
) -> tuple[str, float, list[str], float]:
    scores = {}
    matches_by_id = {}
    for target_id, target_rules in rules:
        score, matches = score_rules(normalized_text, target_rules)
        scores[target_id] = score
        matches_by_id[target_id] = matches

    confidence, best_id, top_score, runner_up_score = confidence_from_scores(scores, fallback_id)
    return best_id, confidence, matches_by_id[best_id], runner_up_score


def classify_excerpt(excerpt: dict, default_galaxy_id: str = "galaxy-fisica") -> dict:
    normalized_text = normalize_text(excerpt["text"])
    galaxy_scores = {
        galaxy_id: score_rules(normalized_text, rules)[0]
        for galaxy_id, rules in GALAXY_RULES.items()
    }
    galaxy_confidence, galaxy_id, _, galaxy_runner_up = confidence_from_scores(
        galaxy_scores,
        default_galaxy_id,
    )
    galaxy_matches = score_rules(normalized_text, GALAXY_RULES[galaxy_id])[1]

    planet_rules = list(PLANET_RULES[galaxy_id].items())
    default_planet_id, default_star_id = DEFAULT_TRACKS[galaxy_id]
    planet_id, planet_confidence, planet_matches, planet_runner_up = best_match(
        normalized_text,
        planet_rules,
        default_planet_id,
    )
    # A camada de estrela e OPCIONAL. Os planetas do eixo tecnico nao tem
    # estrela, por decisao do dono em 2026-08-07, e antes disto a indexacao
    # direta em PLANET_STAR_IDS[planet_id] e em [0] tornava esses planetas
    # inalcancaveis: a classificacao estourava antes de poder pousar neles.
    star_ids_for_planet = PLANET_STAR_IDS.get(planet_id, [])

    if star_ids_for_planet:
        star_rules = [(star_id, STAR_RULES[galaxy_id][star_id]) for star_id in star_ids_for_planet]
        star_fallback_id = (
            default_star_id if default_star_id in star_ids_for_planet else star_ids_for_planet[0]
        )
        star_id, star_confidence, star_matches, star_runner_up = best_match(
            normalized_text,
            star_rules,
            star_fallback_id,
        )
        combined_confidence = round(
            min(0.98, (galaxy_confidence * 0.5) + (planet_confidence * 0.3) + (star_confidence * 0.2)),
            3,
        )
    else:
        star_id, star_confidence, star_matches, star_runner_up = None, 0.0, [], 0.0
        # RENORMALIZA. Reaproveitar 0.5/0.3 sem a parcela de 0.2 poria todo
        # planeta sem estrela num teto de 0.8 do que ele mereceria, e o limiar de
        # needs_review e 0.7 — planeta sem estrela cairia em revisao POR
        # CONSTRUCAO, que e o oposto do objetivo de dar destino a eles.
        # 0.5/0.8 = 0.625 e 0.3/0.8 = 0.375.
        combined_confidence = round(
            min(0.98, (galaxy_confidence * 0.625) + (planet_confidence * 0.375)),
            3,
        )
    needs_review = combined_confidence < 0.7 or (galaxy_runner_up > 0 and (galaxy_scores[galaxy_id] - galaxy_runner_up) < 2.0)
    review_status = "needs-review" if needs_review else "approved"

    star_reason = (
        f"star {star_id} from matches {star_matches or ['fallback']}."
        if star_id is not None
        else "sem estrela: o planeta nao tem camada de estrela, e a confianca foi renormalizada."
    )
    decision_reason = (
        f"Galaxy {galaxy_id} from matches {galaxy_matches or ['fallback']}; "
        f"planet {planet_id} from matches {planet_matches or ['fallback']}; "
        f"{star_reason}"
    )

    return {
        "id": f"classification:{excerpt['id']}",
        "sourceExcerptId": excerpt["id"],
        "sourceSlug": excerpt["sourceSlug"],
        "taxonomyVersion": TAXONOMY_VERSION,
        "classifierVersion": CLASSIFIER_VERSION,
        "strategy": CLASSIFIER_VERSION,
        "galaxyId": galaxy_id,
        "planetId": planet_id,
        "starId": star_id,
        "confidence": combined_confidence,
        "decisionReason": decision_reason,
        "needsReview": needs_review,
        "reviewStatus": review_status,
        "matchedSignals": {
            "galaxy": galaxy_matches,
            "planet": planet_matches,
            "star": star_matches,
        },
        "candidateScores": {
            "galaxies": galaxy_scores,
            "planetRunnerUpScore": planet_runner_up,
            "starRunnerUpScore": star_runner_up,
        },
    }


def load_source_entry(repo_root: Path, source_slug: str) -> dict:
    source_index = read_json(repo_root / CONTENT_ROOT_NAME / "fontes" / "index.json")
    for source in source_index["sources"]:
        if source["slug"] == source_slug:
            return source
    raise ValueError(f"Unknown source slug: {source_slug}")


def load_excerpts(repo_root: Path, source_slug: str) -> list[dict]:
    excerpts_path = repo_root / CONTENT_ROOT_NAME / "extrações" / source_slug / "excerpts.json"
    payload = read_json(excerpts_path)
    return payload["excerpts"]


def load_taxonomy(repo_root: Path) -> dict:
    taxonomy_root = repo_root / CONTENT_ROOT_NAME / "taxonomia"
    galaxies = read_json(taxonomy_root / "galaxias.json")
    planets = read_json(taxonomy_root / "planetas.json")
    stars = read_json(taxonomy_root / "estrelas.json")
    return {
        "galaxies": galaxies,
        "planets": planets,
        "stars": stars,
        "galaxy_ids": {item["id"] for item in galaxies},
        "planet_ids": {item["id"] for item in planets},
        "star_ids": {item["id"] for item in stars},
    }


def classify_source(
    source_slug: str,
    repo_root: Path,
    output_dir: Path,
    update_index: bool = True,
) -> dict:
    source = load_source_entry(repo_root, source_slug)
    extraction_job = read_json(
        repo_root / CONTENT_ROOT_NAME / "extrações" / source_slug / "extraction-job.json"
    )
    excerpts = load_excerpts(repo_root, source_slug)
    taxonomy = load_taxonomy(repo_root)
    default_galaxy_id = extraction_job.get("targetGalaxyIds", ["galaxy-fisica"])[0]

    classifications = []
    review_ids: list[str] = []
    for excerpt in excerpts:
        record = classify_excerpt(excerpt, default_galaxy_id=default_galaxy_id)
        if record["galaxyId"] not in taxonomy["galaxy_ids"]:
            raise ValueError(f"Unknown galaxy {record['galaxyId']} for excerpt {excerpt['id']}")
        if record["planetId"] not in taxonomy["planet_ids"]:
            raise ValueError(f"Unknown planet {record['planetId']} for excerpt {excerpt['id']}")
        # Guarda irma da de classify_excerpt, e ela precisava da MESMA excecao:
        # `starId` nulo e legitimo para planeta sem estrela. Corrigir so o
        # classificador deixava esta aqui, e ela reprovava o mesmo caso — o
        # teste do bundle foi quem pegou.
        if record["starId"] is not None and record["starId"] not in taxonomy["star_ids"]:
            raise ValueError(f"Unknown star {record['starId']} for excerpt {excerpt['id']}")
        classifications.append(record)
        if record["reviewStatus"] == "needs-review":
            review_ids.append(record["sourceExcerptId"])

    bundle = {
        "sourceSlug": source_slug,
        "sourceId": source["id"],
        "strategy": CLASSIFIER_VERSION,
        "taxonomyVersion": TAXONOMY_VERSION,
        "classificationCount": len(classifications),
        "needsReviewCount": len(review_ids),
        "classifications": classifications,
    }

    job_record = {
        "id": f"classify:{source_slug}",
        "sourceId": source["id"],
        "sourceSlug": source_slug,
        "status": "classified",
        "strategy": CLASSIFIER_VERSION,
        "inputArtifacts": {
            "excerpts": f"conteúdo/extrações/{source_slug}/excerpts.json",
            "pages": f"conteúdo/extrações/{source_slug}/pages.json",
        },
        "artifacts": {
            "classifications": "classifications.json",
            "classificationCount": len(classifications),
            "needsReviewCount": len(review_ids),
        },
        "reviewQueueExcerptIds": review_ids,
    }

    output_dir.mkdir(parents=True, exist_ok=True)
    write_json(output_dir / "classifications.json", bundle)
    write_json(output_dir / "classification-job.json", job_record)

    classification_index_path = repo_root / CONTENT_ROOT_NAME / "classificação" / "index.json"
    if update_index:
        classification_index = {"version": 1, "jobs": []}
        if classification_index_path.exists():
            classification_index = read_json(classification_index_path)

        jobs = [job for job in classification_index.get("jobs", []) if job.get("id") != job_record["id"]]
        jobs.append(
            {
                "id": job_record["id"],
                "sourceId": job_record["sourceId"],
                "sourceSlug": job_record["sourceSlug"],
                "status": job_record["status"],
                "strategy": job_record["strategy"],
                "artifacts": {
                    "classifications": f"classificação/{source_slug}/classifications.json",
                    "classificationCount": len(classifications),
                    "needsReviewCount": len(review_ids),
                },
            }
        )
        classification_index["jobs"] = sorted(jobs, key=lambda job: job["id"])
        write_json(classification_index_path, classification_index)

    return {
        "sourceSlug": source_slug,
        "classificationCount": len(classifications),
        "needsReviewCount": len(review_ids),
        "classificationIndexPath": str(classification_index_path),
        "outputDir": str(output_dir),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-slug", required=True)
    parser.add_argument("--output-dir")
    parser.add_argument("--repo-root")
    args = parser.parse_args()

    script_root = Path(args.repo_root) if args.repo_root else Path(__file__).resolve().parents[2]
    output_dir = (
        Path(args.output_dir)
        if args.output_dir
        else script_root / CONTENT_ROOT_NAME / "classificação" / args.source_slug
    )

    result = classify_source(args.source_slug, script_root, output_dir, update_index=True)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
