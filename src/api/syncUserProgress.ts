import { supabase } from './supabaseClient';
import { userProgressRepository } from '../db_local/repositories';
import { useUserStore } from '../store/UserStore';

export const syncUserProgress = async () => {
    try {
        const { isGuest, guestId } = useUserStore.getState();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        let userId = user?.id;

        if (isGuest && guestId) {
            userId = guestId;
        } else if (userError || !user) {
            return;
        }

        if (!userId) return;

        // 1. Fetch Local Data
        const localCompleted = await userProgressRepository.getCompletedLessons();;

        // 2. Fetch Remote Data
        const { data: remoteProfile, error: remoteError } = await supabase
            .from('profiles')
            .select('lesson_ids, updated_at')
            .eq('id', userId)
            .single();

        if (remoteError && remoteError.code !== 'PGRST116') { // Ignore 'not found' error if just created
            console.error('[Sync] Error fetching remote profile:', remoteError);
            return;
        }

        const remoteCompleted: string[] = remoteProfile?.lesson_ids || [];

        // 3. Merge Logic (Union)
        // We simply take the set of all unique completed lessons from both sources.
        // We aren't doing strict timestamp-based conflict resolution (e.g. overwriting)
        // because we want to preserve ANY progress made on either side.
        const mergedSet = new Set([...localCompleted, ...remoteCompleted]);
        const mergedCompleted = Array.from(mergedSet);

        // Sort to ensure consistency (optional but good for comparisons)
        mergedCompleted.sort();


        // 4. Update Local if different
        const localSet = new Set(localCompleted);
        const hasNewForLocal = mergedCompleted.some(id => !localSet.has(id));

        if (hasNewForLocal) {

            await userProgressRepository.setCompletedLessons(mergedCompleted);
        }

        // 5. Update Remote if different
        const remoteSet = new Set(remoteCompleted);
        const hasNewForRemote = mergedCompleted.some(id => !remoteSet.has(id));

        if (hasNewForRemote) {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    lesson_ids: mergedCompleted,
                    last_sync: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .eq('id', userId);

            if (updateError) {
                console.error('[Sync] Failed to update remote:', updateError);
            }
        }

    } catch (error) {
        console.error('[Sync] Critical error during sync:', error);
    }
};
