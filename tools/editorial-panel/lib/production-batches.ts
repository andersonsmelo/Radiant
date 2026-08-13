import { PRODUCTION_BATCHES } from "../../../radiant-app/src/features/student-checkpoints/production-batches";

export type ProductionBatchPanelItem = {
  batchId: string;
  state: "promoted";
  contentVersion: string;
  materialSha256: string;
  activityCount: number;
  checkpointItemCount: number;
  competencyCount: number;
  approvalGates: string[];
  promotedAt: string;
  promotionRef: string;
};

export function getProductionBatchStatus(): ProductionBatchPanelItem[] {
  return PRODUCTION_BATCHES.map((batch) => ({
    batchId: batch.batchId,
    state: batch.state,
    contentVersion: batch.contentVersion,
    materialSha256: batch.materialSha256,
    activityCount: batch.activities.length,
    checkpointItemCount: batch.checkpoint.items.length,
    competencyCount: batch.competencyIds.length,
    approvalGates: batch.approvals.map((approval) => approval.gate),
    promotedAt: batch.promotedAt,
    promotionRef: batch.promotionRef,
  }));
}
