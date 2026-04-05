"use client";

import { useEffect, useState } from "react";

interface Bundle {
  id: string;
  formatType: string;
  title: string;
  reviewStatus: string;
  qualityScore: number | null;
  aiContent: Record<string, unknown>;
}

export default function BundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [filter, setFilter] = useState("needs-review");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/bundles?status=${filter}`)
      .then((r) => r.json())
      .then((data) => setBundles(data.bundles))
      .finally(() => setLoading(false));
  }, [filter]);

  async function updateStatus(id: string, status: "approved" | "needs-review") {
    await fetch(`/api/bundles/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewStatus: status }),
    });
    setBundles((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Bundles Pedagógicos</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm"
        >
          <option value="needs-review">Needs review</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </div>
      {loading && <p className="text-gray-400 text-sm">Carregando...</p>}
      {!loading && bundles.length === 0 && (
        <p className="text-gray-400 text-sm">Nenhum bundle com status &quot;{filter}&quot;.</p>
      )}
      <ul className="space-y-3">
        {bundles.map((b) => (
          <li key={b.id} className="border border-gray-800 rounded p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{b.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {b.formatType} · score: {b.qualityScore ?? "—"}
                </p>
                <pre className="text-xs text-gray-300 mt-2 bg-gray-900 rounded p-2 overflow-auto max-h-40">
                  {JSON.stringify(b.aiContent, null, 2)}
                </pre>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => updateStatus(b.id, "approved")}
                  className="px-3 py-1 bg-green-700 hover:bg-green-600 text-xs rounded"
                >
                  Aprovar
                </button>
                <button
                  onClick={() => updateStatus(b.id, "needs-review")}
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
