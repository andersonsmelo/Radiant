import { getStatusCounts } from "@/lib/content-io";

export default function StatusPage() {
  const counts = getStatusCounts();

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Status Editorial</h1>
      <div className="grid grid-cols-2 gap-4">
        <section className="border border-gray-800 rounded p-4">
          <h2 className="text-sm text-gray-400 mb-3">Bundles Pedagógicos</h2>
          <Stat label="Aprovados" value={counts.bundles.approved} color="text-green-400" />
          <Stat label="Needs review" value={counts.bundles.needsReview} color="text-yellow-400" />
          <Stat label="Pendentes" value={counts.bundles.pending} color="text-gray-400" />
        </section>
        <section className="border border-gray-800 rounded p-4">
          <h2 className="text-sm text-gray-400 mb-3">Arestas do Grafo</h2>
          <Stat label="Auto-aceitas" value={counts.edges.autoAccepted} color="text-green-400" />
          <Stat label="Pendentes revisão" value={counts.edges.pendingReview} color="text-yellow-400" />
          <Stat label="Validadas" value={counts.edges.humanValidated} color="text-blue-400" />
          <Stat label="Rejeitadas" value={counts.edges.rejected} color="text-red-400" />
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-gray-300 text-sm">{label}</span>
      <span className={`${color} font-bold text-sm`}>{value}</span>
    </div>
  );
}
