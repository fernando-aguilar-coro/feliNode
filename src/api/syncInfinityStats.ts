import { supabase } from './supabaseClient';
import { infinityProgressRepository } from '../db_local/repositories';

export const syncInfinityStats = async () => {
    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        const user = session?.user;

        let userId = user?.id;

        if (sessionError || !user) {
            return;
        }

        if (!userId) return;

        // 1. Fetch Local Data
        const localProgress = await infinityProgressRepository.getAllInfinityProgress();
        // Map: target_id -> max_score
        const localMap = new Map<string, number>();
        localProgress.forEach(p => localMap.set(p.target_id, p.max_score));

        // 2. Fetch Remote Data
        const { data: remoteStats, error: remoteError } = await supabase
            .from('stats')
            .select('target_id, max_score, updated_at')
            .eq('user_id', userId);

        if (remoteError) {
            console.error('[SyncStats] Error fetching remote stats:', remoteError);
            return;
        }

        const remoteMap = new Map<string, number>();
        if (remoteStats) {
            remoteStats.forEach((s: any) => remoteMap.set(s.target_id, s.max_score));
        }

        // 3. Merge Logic (Max Score Wins)
        // We want a unified view of the highest scores
        const allTargetIds = new Set([...localMap.keys(), ...remoteMap.keys()]);

        const toUpdateLocal: { target_id: string; max_score: number }[] = [];
        const toUpdateRemote: { user_id: string; target_id: string; max_score: number; updated_at: string }[] = [];

        for (const targetId of allTargetIds) {
            const localScore = localMap.get(targetId) || 0;
            const remoteScore = remoteMap.get(targetId) || 0;
            const maxScore = Math.max(localScore, remoteScore);

            const isMissingRemote = !remoteMap.has(targetId);
            const isMissingLocal = !localMap.has(targetId);

            // If verified max is greater than local, or if the record doesn't exist locally, update local
            if (maxScore > localScore || isMissingLocal) {
                toUpdateLocal.push({ target_id: targetId, max_score: maxScore });
            }

            // If verified max is greater than remote, or if the record doesn't exist remotely, update remote
            if (maxScore > remoteScore || isMissingRemote) {
                toUpdateRemote.push({
                    user_id: userId,
                    target_id: targetId,
                    max_score: maxScore,
                    updated_at: new Date().toISOString()
                });
            }
        }

        // 4. Execute Updates
        if (toUpdateLocal.length > 0) {

            await infinityProgressRepository.saveInfinityScoreBulk(toUpdateLocal);
        }

        if (toUpdateRemote.length > 0) {

            const { error: upsertError } = await supabase
                .from('stats')
                .upsert(toUpdateRemote, { onConflict: 'user_id, target_id' }); // Conflict on unique constraint

            if (upsertError) {
                console.error('[SyncStats] Failed to update remote stats:', upsertError);
            } else {

            }
        }



    } catch (error) {
        console.error('[SyncStats] Critical error during stats sync:', error);
    }
};
