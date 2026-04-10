import { getContentHealth, getStatusCounts, getWave1TrackReadiness } from "@/lib/content-io";

export default function StatusPage() {
  const counts = getStatusCounts();
  const wave1Readiness = getWave1TrackReadiness();
  const health = getContentHealth();

  return (
    <div className="space-y-6">
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

      <section className="border border-gray-800 rounded p-4">
        <h2 className="text-sm text-gray-400 mb-3">Wave 1 por trilha</h2>
        <div className="space-y-3">
          {wave1Readiness.tracks.map((track) => (
            <div key={track.trackId} className="rounded border border-gray-800 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-100">{track.title}</p>
                  <p className="text-xs text-gray-500">{track.trackId}</p>
                </div>
                <span className={`text-xs font-bold ${stateColor(track.state)}`}>
                  {track.state}
                </span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-gray-900">
                <div
                  className="h-2 rounded-full bg-green-400"
                  style={{ width: `${Math.min(100, track.readinessPercent)}%` }}
                />
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2 text-xs text-gray-400">
                <span>{track.lessonCount} lições</span>
                <span>{track.bundlesReady} prontos</span>
                <span>{track.bundlesInReview} em revisão</span>
                <span>{track.bundlesBlocked} bloqueados</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-gray-800 rounded p-4">
        <h2 className="text-sm text-gray-400 mb-3">Saúde do conteúdo</h2>
        <pre className="text-xs text-gray-300 whitespace-pre-wrap">{JSON.stringify(health, null, 2)}</pre>
      </section>
    </div>
  );
}

function stateColor(state: "ready" | "in-review" | "blocked" | "not-started") {
  switch (state) {
    case "ready":
      return "text-green-400";
    case "in-review":
      return "text-yellow-400";
    case "blocked":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-gray-300 text-sm">{label}</span>
      <span className={`${color} font-bold text-sm`}>{value}</span>
    </div>
  );
}
