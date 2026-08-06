from __future__ import annotations

import hashlib

BUCKETS = 1000


def effective_rate(ceiling_written: bool) -> float:
    return 1.0 if not ceiling_written else 0.0


def _bucket(lesson_id: str) -> int:
    digest = hashlib.sha256(lesson_id.encode("utf-8")).hexdigest()
    return int(digest[:8], 16) % BUCKETS


def selected_for_review(lesson_ids: list[str], rate: float) -> list[str]:
    corte = round(rate * BUCKETS)
    return [lid for lid in lesson_ids if _bucket(lid) < corte]
