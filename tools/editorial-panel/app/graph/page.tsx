"use client";

import { useEffect, useState } from "react";

interface Edge {
  from: string;
  to: string;
  confidence: number;
  status: string;
  reason: string;
}

export default function GraphPage() {
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/graph")
      .then((r) => r.json())
      .then((data) => setEdges(data.edges))
      .finally(() => setLoading(false));
  }, []);

  async function updateEdge(from: string, to: string, status: "human-validated" | "rejected") {
    const edgeKey = encodeURIComponent(`${from}|${to}`);
    await fetch(`/api/graph/${edgeKey}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setEdges((prev) => prev.filter((e) => !(e.from === from && e.to === to)));
  }

  const shortId = (id: string) => id.split(":").pop() ?? id;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Grafo de Dependências — Revisão Pendente</h1>
      {loading && <p className="text-gray-400 text-sm">Carregando...</p>}
      {!loading && edges.length === 0 && (
        <p className="text-gray-400 text-sm">Nenhuma aresta pendente de revisão.</p>
      )}
      <ul className="space-y-3">
        {edges.map((e) => (
          <li key={`${e.from}|${e.to}`} className="border border-gray-800 rounded p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm">
                  <span className="text-blue-300">{shortId(e.from)}</span>
                  <span className="text-gray-500 mx-2">→</span>
                  <span className="text-indigo-300">{shortId(e.to)}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  confiança: {e.confidence.toFixed(2)} · {e.reason}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => updateEdge(e.from, e.to, "human-validated")}
                  className="px-3 py-1 bg-green-700 hover:bg-green-600 text-xs rounded"
                >
                  Validar
                </button>
                <button
                  onClick={() => updateEdge(e.from, e.to, "rejected")}
                  className="px-3 py-1 bg-red-800 hover:bg-red-700 text-xs rounded"
                >
                  Rejeitar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
