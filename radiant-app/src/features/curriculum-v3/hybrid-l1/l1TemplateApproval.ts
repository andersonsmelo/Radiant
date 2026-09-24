import { reviewSample } from './l1HybridLessonPlan';

export type TemplateApproval = Readonly<{ fingerprint: string; approvedOn: string; approvedBy: string }>;

/**
 * Preenchido quando o dono aprovar a amostra em
 * `__snapshots__/l1TemplateApproval.test.ts.snap`. `null` = aguardando revisão.
 * Se o conteúdo mudar depois, o teste reprova e a tela volta a mostrar "prévia".
 */
export const L1_TEMPLATE_APPROVAL: TemplateApproval | null = null;

/** FNV-1a de 32 bits: detecta mudança, não protege contra adulteração. */
export function fnv1a(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

export function l1TemplateFingerprint(): string {
  return fnv1a(JSON.stringify(reviewSample()));
}

export function isL1TemplateApproved(): boolean {
  return L1_TEMPLATE_APPROVAL !== null && L1_TEMPLATE_APPROVAL.fingerprint === l1TemplateFingerprint();
}
