import { getProductionBatchStatus } from "@/lib/production-batches";

export default function ProductionBatchesPage() {
  const batches = getProductionBatchStatus();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Batches de produção</h1>
        <p className="mt-2 text-sm text-gray-400">
          Visão somente leitura do catálogo que o app compila. A promoção gravável exige expected hash e rename atômico pela biblioteca versionada.
        </p>
      </div>
      {batches.map((batch) => (
        <section key={batch.batchId} className="rounded border border-gray-800 p-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bold text-gray-100">{batch.batchId}</h2>
              <p className="text-xs text-gray-500">{batch.contentVersion}</p>
            </div>
            <span className="text-xs font-bold text-green-400">{batch.state}</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <span>{batch.activityCount} atividades</span>
            <span>{batch.checkpointItemCount} itens</span>
            <span>{batch.competencyCount} competências</span>
          </div>
          <div className="text-xs text-gray-400">
            Gates: {batch.approvalGates.join(", ")}
          </div>
          <code className="block break-all rounded bg-gray-900 p-2 text-xs text-gray-400">
            sha256:{batch.materialSha256}
          </code>
          <p className="text-xs text-gray-500">{batch.promotedAt} · {batch.promotionRef}</p>
        </section>
      ))}
    </div>
  );
}
