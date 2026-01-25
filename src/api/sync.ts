import { supabase } from './supabaseClient';
import { getCompletedLessons, setCompletedLessons } from '../db_local/api_local';

export const syncUserProgress = async () => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.log('[Sync] No active session, skipping cloud sync.');
            return;
        }

        console.log('[Sync] Starting synchronization for user:', user.email);

        // 1. Fetch Local Data
        const localCompleted = await getCompletedLessons();
        console.log('[Sync] Local progress:', localCompleted);

        // 2. Fetch Remote Data
        const { data: remoteProfile, error: remoteError } = await supabase
            .from('profiles')
            .select('lesson_ids, updated_at')
            .eq('id', user.id)
            .single();

        if (remoteError && remoteError.code !== 'PGRST116') { // Ignore 'not found' error if just created
            console.error('[Sync] Error fetching remote profile:', remoteError);
            return;
        }

        const remoteCompleted: string[] = remoteProfile?.lesson_ids || [];
        console.log('[Sync] Remote progress:', remoteCompleted);

        // 3. Merge Logic (Union)
        // We simply take the set of all unique completed lessons from both sources.
        // We aren't doing strict timestamp-based conflict resolution (e.g. overwriting)
        // because we want to preserve ANY progress made on either side.
        const mergedSet = new Set([...localCompleted, ...remoteCompleted]);
        const mergedCompleted = Array.from(mergedSet);

        // Sort to ensure consistency (optional but good for comparisons)
        mergedCompleted.sort();

        console.log('[Sync] Merged progress:', mergedCompleted);

        // 4. Update Local if different
        const localSet = new Set(localCompleted);
        const hasNewForLocal = mergedCompleted.some(id => !localSet.has(id));

        if (hasNewForLocal) {
            console.log('[Sync] Updating local database...');
            await setCompletedLessons(mergedCompleted);
        }

        // 5. Update Remote if different
        const remoteSet = new Set(remoteCompleted);
        const hasNewForRemote = mergedCompleted.some(id => !remoteSet.has(id));

        if (hasNewForRemote) {
            console.log('[Sync] Updating remote database...');
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    lesson_ids: mergedCompleted,
                    last_sync: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id);

            if (updateError) {
                console.error('[Sync] Failed to update remote:', updateError);
            }
        }

        if (!hasNewForLocal && !hasNewForRemote) {
            console.log('[Sync] databases are already in sync.');
        } else {
            console.log('[Sync] Synchronization complete.');
        }

    } catch (error) {
        console.error('[Sync] Critical error during sync:', error);
    }
};
