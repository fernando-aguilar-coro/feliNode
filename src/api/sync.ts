import { authService } from '../features/auth/services/authService';

const API_URL = 'https://feli-node-back.vercel.app/api';

export const syncUserProgress = async (completedLessons: string[]) => {
    try {
        const session = await authService.getSession();

        if (!session?.access_token) {
            console.log('[Sync] No active session, skipping cloud sync.');
            return;
        }

        const token = session.access_token;

        const response = await fetch(`${API_URL}/sync`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lesson_ids: completedLessons,
                timestamp: new Date().toISOString(),
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.warn('[Sync] Failed to sync progress:', response.status, errorText);
            throw new Error(`Sync failed: ${response.status}`);
        }

        console.log('[Sync] Progress synced successfully.');

    } catch (error) {
        console.error('[Sync] Error syncing progress:', error);
        // We do not re-throw because we don't want to block local progress saving
    }
};
