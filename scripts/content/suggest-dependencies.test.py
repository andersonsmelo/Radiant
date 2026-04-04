import importlib.util
import json
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).with_name("suggest-dependencies.py")
SPEC = importlib.util.spec_from_file_location("suggest_dependencies", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


class BuildGraphNodesTests(unittest.TestCase):
    def test_adds_new_node(self):
        graph = {"version": 1, "nodes": [], "edges": []}
        concepts = [
            {
                "id": "concept:test:foo",
                "title": "Foo",
                "galaxyId": "galaxy-fisica",
                "planetId": "planet-a",
                "starId": "star-b",
            }
        ]
        result = MODULE.build_graph_nodes(graph, concepts)
        self.assertEqual(len(result["nodes"]), 1)
        self.assertEqual(result["nodes"][0]["id"], "concept:test:foo")

    def test_skips_existing_node(self):
        existing = {
            "id": "concept:test:foo",
            "title": "Foo",
            "galaxyId": "galaxy-fisica",
            "planetId": "planet-a",
            "starId": "star-b",
        }
        graph = {"version": 1, "nodes": [existing], "edges": []}
        concepts = [existing]
        result = MODULE.build_graph_nodes(graph, concepts)
        self.assertEqual(len(result["nodes"]), 1)


class ApplyThresholdTests(unittest.TestCase):
    def test_confidence_threshold_constant(self):
        self.assertEqual(MODULE.CONFIDENCE_THRESHOLD, 0.85)

    def test_high_confidence_auto_accepted(self):
        edge = {"from": "concept:a", "to": "concept:b", "confidence": 0.90, "reason": "test"}
        result = MODULE.apply_threshold(edge)
        self.assertEqual(result["status"], "auto-accepted")

    def test_low_confidence_pending_review(self):
        edge = {"from": "concept:a", "to": "concept:b", "confidence": 0.70, "reason": "test"}
        result = MODULE.apply_threshold(edge)
        self.assertEqual(result["status"], "pending-review")

    def test_boundary_085_is_auto_accepted(self):
        edge = {"from": "concept:a", "to": "concept:b", "confidence": 0.85, "reason": "test"}
        result = MODULE.apply_threshold(edge)
        self.assertEqual(result["status"], "auto-accepted")


class MergeEdgesTests(unittest.TestCase):
    def test_adds_new_edge(self):
        graph = {"version": 1, "nodes": [], "edges": []}
        new_edges = [{"from": "concept:a", "to": "concept:b", "confidence": 0.90, "reason": "test"}]
        result = MODULE.merge_edges(graph, new_edges)
        self.assertEqual(len(result["edges"]), 1)
        self.assertEqual(result["edges"][0]["status"], "auto-accepted")

    def test_skips_duplicate_edge(self):
        existing = {
            "from": "concept:a",
            "to": "concept:b",
            "confidence": 0.9,
            "status": "auto-accepted",
            "reason": "old",
        }
        graph = {"version": 1, "nodes": [], "edges": [existing]}
        new_edges = [{"from": "concept:a", "to": "concept:b", "confidence": 0.95, "reason": "new"}]
        result = MODULE.merge_edges(graph, new_edges)
        self.assertEqual(len(result["edges"]), 1)
        self.assertEqual(result["edges"][0]["reason"], "old")

    def test_adds_reverse_direction_as_new_edge(self):
        existing = {
            "from": "concept:a",
            "to": "concept:b",
            "confidence": 0.9,
            "status": "auto-accepted",
            "reason": "forward",
        }
        graph = {"version": 1, "nodes": [], "edges": [existing]}
        new_edges = [{"from": "concept:b", "to": "concept:a", "confidence": 0.88, "reason": "reverse"}]
        result = MODULE.merge_edges(graph, new_edges)
        self.assertEqual(len(result["edges"]), 2)


if __name__ == "__main__":
    unittest.main()
