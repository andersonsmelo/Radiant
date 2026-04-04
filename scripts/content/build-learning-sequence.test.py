import importlib.util
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("build-learning-sequence.py")
SPEC = importlib.util.spec_from_file_location("build_learning_sequence", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


class TopologicalSortTests(unittest.TestCase):
    def test_basic_chain_is_ordered(self):
        nodes = [{"id": "A"}, {"id": "B"}, {"id": "C"}]
        edges = [
            {"from": "A", "to": "B", "status": "auto-accepted"},
            {"from": "B", "to": "C", "status": "auto-accepted"},
        ]
        ordered, cycles = MODULE.topological_sort(nodes, edges)
        self.assertLess(ordered.index("A"), ordered.index("B"))
        self.assertLess(ordered.index("B"), ordered.index("C"))
        self.assertEqual(cycles, [])

    def test_cycle_is_detected(self):
        nodes = [{"id": "A"}, {"id": "B"}]
        edges = [
            {"from": "A", "to": "B", "status": "auto-accepted"},
            {"from": "B", "to": "A", "status": "auto-accepted"},
        ]
        _ordered, cycles = MODULE.topological_sort(nodes, edges)
        self.assertEqual(len(cycles), 2)

    def test_pending_review_edges_excluded(self):
        nodes = [{"id": "A"}, {"id": "B"}]
        edges = [{"from": "A", "to": "B", "status": "pending-review"}]
        ordered, cycles = MODULE.topological_sort(nodes, edges)
        self.assertEqual(len(ordered), 2)
        self.assertEqual(cycles, [])

    def test_human_validated_edges_included(self):
        nodes = [{"id": "A"}, {"id": "B"}]
        edges = [{"from": "A", "to": "B", "status": "human-validated"}]
        ordered, cycles = MODULE.topological_sort(nodes, edges)
        self.assertLess(ordered.index("A"), ordered.index("B"))

    def test_rejected_edges_excluded(self):
        nodes = [{"id": "A"}, {"id": "B"}]
        edges = [{"from": "A", "to": "B", "status": "rejected"}]
        ordered, cycles = MODULE.topological_sort(nodes, edges)
        self.assertEqual(len(ordered), 2)
        self.assertEqual(cycles, [])

    def test_isolated_nodes_included(self):
        nodes = [{"id": "A"}, {"id": "B"}, {"id": "C"}]
        edges = [{"from": "A", "to": "B", "status": "auto-accepted"}]
        ordered, cycles = MODULE.topological_sort(nodes, edges)
        self.assertIn("C", ordered)
        self.assertEqual(cycles, [])


class DetectGapsTests(unittest.TestCase):
    def test_detects_missing_prerequisite(self):
        nodes = [{"id": "concept:B"}]
        edges = [{"from": "concept:A", "to": "concept:B", "status": "auto-accepted"}]
        gaps = MODULE.detect_gaps(nodes, edges)
        self.assertIn("concept:A", gaps)

    def test_no_gaps_when_all_present(self):
        nodes = [{"id": "concept:A"}, {"id": "concept:B"}]
        edges = [{"from": "concept:A", "to": "concept:B", "status": "auto-accepted"}]
        gaps = MODULE.detect_gaps(nodes, edges)
        self.assertEqual(gaps, [])

    def test_gaps_are_deduplicated(self):
        nodes = [{"id": "concept:B"}, {"id": "concept:C"}]
        edges = [
            {"from": "concept:A", "to": "concept:B", "status": "auto-accepted"},
            {"from": "concept:A", "to": "concept:C", "status": "auto-accepted"},
        ]
        gaps = MODULE.detect_gaps(nodes, edges)
        self.assertEqual(gaps.count("concept:A"), 1)


class GroupByPlanetTests(unittest.TestCase):
    def test_groups_by_galaxy_and_planet(self):
        nodes = [
            {"id": "A", "galaxyId": "galaxy-fisica", "planetId": "planet-x", "starId": "star-1"},
            {"id": "B", "galaxyId": "galaxy-fisica", "planetId": "planet-x", "starId": "star-1"},
            {"id": "C", "galaxyId": "galaxy-anatomia", "planetId": "planet-y", "starId": "star-2"},
        ]
        ordered = ["A", "B", "C"]
        groups = MODULE.group_by_planet(nodes, ordered)
        planet_ids = [g["planetId"] for g in groups]
        self.assertIn("planet-x", planet_ids)
        self.assertIn("planet-y", planet_ids)

    def test_preserves_order_within_planet(self):
        nodes = [
            {"id": "A", "galaxyId": "galaxy-fisica", "planetId": "planet-x", "starId": "star-1"},
            {"id": "B", "galaxyId": "galaxy-fisica", "planetId": "planet-x", "starId": "star-1"},
        ]
        ordered = ["A", "B"]
        groups = MODULE.group_by_planet(nodes, ordered)
        group = next(g for g in groups if g["planetId"] == "planet-x")
        self.assertEqual(group["sequence"], ["A", "B"])

    def test_unknown_node_id_in_ordered_is_skipped(self):
        nodes = [{"id": "A", "galaxyId": "galaxy-fisica", "planetId": "planet-x", "starId": "star-1"}]
        ordered = ["A", "UNKNOWN"]
        groups = MODULE.group_by_planet(nodes, ordered)
        group = next(g for g in groups if g["planetId"] == "planet-x")
        self.assertNotIn("UNKNOWN", group["sequence"])


if __name__ == "__main__":
    unittest.main()
