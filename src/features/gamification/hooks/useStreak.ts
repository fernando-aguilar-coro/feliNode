import { useState, useEffect, useCallback } from 'react';
import { getStreak, updateStreak as updateStreakInDb } from '../../../db_local/api_local';
import { useFocusEffect } from '@react-navigation/native';
import { StreakCloudService } from '../services/StreakCloud.service';
export const useStreak = () => {
    const [streak, setStreak] = useState<{ current_streak: number; highest_streak: number; last_active_date: string | null; history: string[]; freezes_available: number; freezes_used: number }>({
        current_streak: 0,
        highest_streak: 0,
        last_active_date: null,
        history: [],
        freezes_available: 2,
        freezes_used: 0,
    });
    const [loading, setLoading] = useState(true);

    const fetchStreak = useCallback(async () => {
        try {
            const data = await getStreak();
            setStreak(data);

            // Background sync
            StreakCloudService.syncWithLocal()
                .then(() => getStreak())
                .then(updatedData => {
                    // Update UI only if values legitimately changed
                    setStreak(prev => {
                        if (prev.current_streak !== updatedData.current_streak || prev.highest_streak !== updatedData.highest_streak) {
                            return updatedData;
                        }
                        return prev;
                    });
                })
                .catch(e => console.log('[Sync] Background sync check failed:', e));

        } catch (error) {
            console.error('Failed to fetch streak:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch when screen focuses to ensure it's always up-to-date
    useFocusEffect(
        useCallback(() => {
            fetchStreak();
        }, [fetchStreak])
    );

    const updateStreak = async () => {
        try {
            const newData = await updateStreakInDb();
            setStreak({
                current_streak: newData.current_streak,
                highest_streak: newData.highest_streak,
                last_active_date: newData.last_active_date,
                history: newData.history,
                freezes_available: newData.freezes_available,
                freezes_used: newData.freezes_used,
            });

            // Upload streak change asynchronously
            StreakCloudService.syncUp(newData).catch(e => console.log('[Sync] Background sync push failed:', e));

            return newData;
        } catch (error) {
            console.error('Failed to update streak:', error);
            throw error;
        }
    };

    return {
        streak,
        loading,
        fetchStreak,
        updateStreak,
    };
};
