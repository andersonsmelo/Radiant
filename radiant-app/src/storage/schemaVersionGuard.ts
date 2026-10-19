/**
 * A regra do G7 (ADR de 2026-10-19): uma versão antiga do app não grava por
 * cima de um store cujo `schemaVersion` ela não conhece.
 *
 * O caso real é a volta de versão: TestFlight ou teste interno voltando de
 * build, backup restaurado num aparelho com versão velha e o rollback. O store
 * foi gravado por uma versão mais nova, e só ela sabe o que os campos
 * significam. A versão antiga segue com o que tem em memória e deixa o dado
 * intacto para a nova encontrar quando voltar.
 *
 * Store sem `schemaVersion`, ou que nem é objeto, não é "de outra versão": cada
 * store continua tratando esse caso como sempre tratou (ausente, corrompido ou
 * legado). A regra só fala de quem declara uma versão e declara uma que este
 * app não conhece.
 */
export function hasUnknownSchemaVersion(value: unknown, known: readonly unknown[]): boolean {
    return typeof value === 'object'
        && value !== null
        && !Array.isArray(value)
        && 'schemaVersion' in value
        && !known.includes((value as { schemaVersion: unknown }).schemaVersion);
}

/** O mesmo, sobre a string crua do AsyncStorage. JSON quebrado não é de outra versão. */
export function rawHasUnknownSchemaVersion(raw: string | null, known: readonly unknown[]): boolean {
    if (raw === null) return false;
    try {
        return hasUnknownSchemaVersion(JSON.parse(raw), known);
    } catch {
        return false;
    }
}
