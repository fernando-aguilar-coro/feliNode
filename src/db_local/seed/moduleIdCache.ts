/**
 * In-process cache mapping Supabase module IDs (string) → local SQLite integer IDs.
 *
 * Populated during `seedDatabase` as each module is upserted into the local DB.
 * Used by `ensureModuleDependencies` to resolve foreign key references before insertion.
 */
const supabaseToLocalModuleId = new Map<string, number>();

/** Register a Supabase module ID → local ROWID mapping. */
export const registerModuleId = (supabaseId: string, localId: number): void => {
    supabaseToLocalModuleId.set(supabaseId, localId);
};

/** Resolve a Supabase module ID to its local SQLite integer ID. Returns undefined if not found. */
export const supModuleIdToLocalId = (supabaseId: string): number | undefined => {
    return supabaseToLocalModuleId.get(supabaseId);
};

/** Clear the cache (call at the start of each full re-seed). */
export const clearModuleIdCache = (): void => {
    supabaseToLocalModuleId.clear();
};
