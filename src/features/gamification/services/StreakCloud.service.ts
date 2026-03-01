import { supabase } from '../../../api/supabaseClient';
import { getStreak, updateStreakFromCloud } from '../../../db_local/api_local';

export interface StreakData {
    current_streak: number;
    highest_streak: number;
    last_active_date: string | null;
    history: string[];
    freezes_available: number;
    freezes_used: number;
}

import { NotificationService } from './Notification.service';

export const StreakCloudService = {
    syncUp: async (localData: StreakData) => {
        try {
            // Schedule notification based on current active state
            await NotificationService.scheduleStreakReminder(localData.current_streak, localData.last_active_date);

            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            const user = session?.user;
            if (sessionError || !user) {
                console.log('[StreakCloud] No active session, skipping upstream sync.', sessionError?.message || '');
                return;
            }

            const { error: syncError } = await supabase
                .from('user_streaks')
                .upsert({
                    user_id: user.id,
                    current_streak: localData.current_streak,
                    highest_streak: localData.highest_streak,
                    last_active_date: localData.last_active_date,
                    history: localData.history,
                    freezes_available: localData.freezes_available,
                    freezes_used: localData.freezes_used,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });

            if (syncError) {
                console.warn('[StreakCloud] Failed to sync streak up:', syncError.message);
            } else {
                console.log('[StreakCloud] Streak synced UP successfully.');
            }
        } catch (error) {
            console.error('[StreakCloud] Error syncing up:', error);
        }
    },

    syncDown: async (): Promise<StreakData | null> => {
        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            const user = session?.user;
            if (sessionError || !user) {
                console.log('[StreakCloud] No active session, skipping downstream sync.', sessionError?.message || '');
                return null;
            }

            const { data, error } = await supabase
                .from('user_streaks')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) {
                if (error.code !== 'PGRST116') { // Not found error code in Supabase
                    console.warn('[StreakCloud] Failed to sync streak down:', error.message);
                }
                return null;
            }

            if (data) {
                return {
                    current_streak: data.current_streak,
                    highest_streak: data.highest_streak,
                    last_active_date: data.last_active_date,
                    history: data.history || [],
                    freezes_available: data.freezes_available,
                    freezes_used: data.freezes_used,
                };
            }
            return null;
        } catch (error) {
            console.error('[StreakCloud] Error syncing down:', error);
            return null;
        }
    },

    syncWithLocal: async () => {
        try {
            const localData = await getStreak();
            const cloudData = await StreakCloudService.syncDown();

            if (!cloudData) {
                // If there's no cloud data (PGRST116 or other), push local up to initialize
                console.log('[StreakCloud] No cloud data found, initializing with local data.');
                await StreakCloudService.syncUp(localData);
                return;
            }

            // Merge strategy matching user request to prioritize highest numbers:
            let shouldUpdateLocal = false;

            const newHistorySet = new Set([...localData.history, ...cloudData.history]);
            const newHistory = Array.from(newHistorySet).sort();

            let newCurrentStreak = localData.current_streak;
            let newHighestStreak = Math.max(localData.highest_streak, cloudData.highest_streak);
            let newFreezesAvailable = localData.freezes_available;
            let newFreezesUsed = Math.max(localData.freezes_used, cloudData.freezes_used);
            let newLastActiveDate = localData.last_active_date;

            // We update local if cloud has a better streak
            if (cloudData.current_streak > localData.current_streak ||
                (cloudData.current_streak === localData.current_streak && cloudData.last_active_date !== null &&
                    (localData.last_active_date === null || cloudData.last_active_date > localData.last_active_date))) {
                newCurrentStreak = cloudData.current_streak;
                newLastActiveDate = cloudData.last_active_date;
                newFreezesAvailable = cloudData.freezes_available;
                shouldUpdateLocal = true;
            }

            if (newHighestStreak > localData.highest_streak || newHistory.length > localData.history.length || newFreezesUsed > localData.freezes_used) {
                shouldUpdateLocal = true;
            }

            if (shouldUpdateLocal) {
                // Update local db
                const mergedData = {
                    current_streak: newCurrentStreak,
                    highest_streak: newHighestStreak,
                    last_active_date: newLastActiveDate,
                    history: newHistory,
                    freezes_available: newFreezesAvailable,
                    freezes_used: newFreezesUsed
                };
                await updateStreakFromCloud(mergedData);
                console.log('[StreakCloud] Local DB updated from cloud sync.');
            } else {
                // Push local changes up just in case
                await StreakCloudService.syncUp(localData);
            }
        } catch (error) {
            console.error('[StreakCloud] Error syncing with local:', error);
        }
    }
};
