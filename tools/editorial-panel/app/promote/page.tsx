"use client";

import { useState } from "react";

export default function PromotePage() {
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runPromotion() {
    setLoading(true);
    setOutput(null);
    setError(null);
    try {
      const res = await fetch("/api/promote", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setOutput(data.output);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Promoção para Catálogo</h1>
      <p className="text-sm text-gray-400 mb-6">
        Gera <code className="bg-gray-900 px-1 rounded">conteúdo/governança/catalog-payload.json</code>{" "}
        com todos os bundles aprovados ordenados pela sequência de aprendizagem.
      </p>
      <button
        onClick={runPromotion}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded text-sm font-medium"
      >
        {loading ? "Executando..." : "Promover para Catálogo"}
      </button>
      {output && (
        <pre className="mt-4 bg-gray-900 border border-gray-800 rounded p-4 text-xs text-green-300 whitespace-pre-wrap">
          {output}
        </pre>
      )}
      {error && (
        <pre className="mt-4 bg-gray-900 border border-red-900 rounded p-4 text-xs text-red-300 whitespace-pre-wrap">
          {error}
        </pre>
      )}
    </div>
  );
}
