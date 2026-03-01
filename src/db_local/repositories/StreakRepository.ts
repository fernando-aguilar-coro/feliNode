import { BaseRepository } from '../core/BaseRepository';

export class StreakRepository extends BaseRepository {
    private getLocalDateStr() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    private async processProtectorsOnLoad(streakData: any) {
        if (!streakData.last_active_date || streakData.current_streak === 0) return streakData;

        const todayStr = this.getLocalDateStr();
        if (streakData.last_active_date === todayStr) return streakData;

        const [lastYear, lastMonth, lastDay] = streakData.last_active_date.split('-').map(Number);
        const [todayYear, todayMonth, todayDay] = todayStr.split('-').map(Number);

        const lastDate = new Date(lastYear, lastMonth - 1, lastDay);
        const todayDate = new Date(todayYear, todayMonth - 1, todayDay);
        const diffTime = todayDate.getTime() - lastDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        const db = await this.db;

        if (diffDays > 1) {
            let daysMissed = diffDays - 1;
            let newFreezesAvailable = streakData.freezes_available || 0;
            let newFreezesUsed = streakData.freezes_used || 0;
            let newCurrentStreak = streakData.current_streak;
            let newLastActiveDate = streakData.last_active_date;
            let newHistory = Array.isArray(streakData.history) ? [...streakData.history] : [];
            let changed = false;

            let savedDays = 0;
            const newFrozenDays: string[] = [];

            while (daysMissed > 0 && newFreezesAvailable > 0) {
                newFreezesAvailable -= 1;
                newFreezesUsed += 1;
                daysMissed -= 1;
                savedDays += 1;
                changed = true;

                const frozenDate = new Date(lastDate);
                frozenDate.setDate(frozenDate.getDate() + savedDays);
                const uy = frozenDate.getFullYear();
                const um = String(frozenDate.getMonth() + 1).padStart(2, '0');
                const ud = String(frozenDate.getDate()).padStart(2, '0');
                newFrozenDays.push(`${uy}-${um}-${ud}_frozen`);
            }

            if (daysMissed > 0) {
                newCurrentStreak = 0;
                changed = true;
            } else if (savedDays > 0) {
                const updatedLastDate = new Date(lastDate);
                updatedLastDate.setDate(updatedLastDate.getDate() + savedDays);
                const uy = updatedLastDate.getFullYear();
                const um = String(updatedLastDate.getMonth() + 1).padStart(2, '0');
                const ud = String(updatedLastDate.getDate()).padStart(2, '0');
                newLastActiveDate = `${uy}-${um}-${ud}`;
            }

            if (changed) {
                if (savedDays > 0) {
                    newHistory.push(...newFrozenDays);
                }
                const nowIso = new Date().toISOString();
                await db.runAsync(
                    'UPDATE user_streaks SET current_streak = ?, last_active_date = ?, history = ?, freezes_available = ?, freezes_used = ?, updated_at = ?',
                    [newCurrentStreak, newLastActiveDate, JSON.stringify(newHistory), newFreezesAvailable, newFreezesUsed, nowIso]
                );
                return {
                    ...streakData,
                    current_streak: newCurrentStreak,
                    last_active_date: newLastActiveDate,
                    history: newHistory,
                    freezes_available: newFreezesAvailable,
                    freezes_used: newFreezesUsed
                };
            }
        } else if (diffDays < 0) {
            const nowIso = new Date().toISOString();
            await db.runAsync(
                'UPDATE user_streaks SET current_streak = 0, freezes_available = ?, freezes_used = ?, updated_at = ?',
                [streakData.freezes_available, streakData.freezes_used, nowIso]
            );
            return {
                ...streakData,
                current_streak: 0
            };
        }

        return streakData;
    }

    async getStreak(): Promise<{ current_streak: number, highest_streak: number, last_active_date: string | null, history: string[], freezes_available: number, freezes_used: number }> {
        const db = await this.db;
        try {
            const result: any = await db.getFirstAsync('SELECT current_streak, highest_streak, last_active_date, history, freezes_available, freezes_used FROM user_streaks LIMIT 1');
            if (result) {
                if (result.history && typeof result.history === 'string') {
                    try {
                        result.history = JSON.parse(result.history);
                    } catch (e) {
                        result.history = [];
                    }
                } else if (!result.history) {
                    result.history = [];
                }
                return await this.processProtectorsOnLoad(result);
            } else {
                await db.runAsync('INSERT INTO user_streaks (current_streak, highest_streak, last_active_date, history, freezes_available, freezes_used) VALUES (0, 0, NULL, "[]", 2, 0)');
                return { current_streak: 0, highest_streak: 0, last_active_date: null, history: [], freezes_available: 2, freezes_used: 0 };
            }
        } catch (error) {
            console.error('[DB] Error getting streak:', error);
            return { current_streak: 0, highest_streak: 0, last_active_date: null, history: [], freezes_available: 2, freezes_used: 0 };
        }
    }

    async updateStreak(): Promise<{ current_streak: number, highest_streak: number, last_active_date: string | null, streak_extended: boolean, history: string[], freezes_available: number, freezes_used: number }> {
        const db = await this.db;
        try {
            const streakData = await this.getStreak();
            const todayStr = this.getLocalDateStr();

            if (streakData.last_active_date === todayStr) {
                return { ...streakData, streak_extended: false };
            }

            let newCurrentStreak = streakData.current_streak;
            let newHistory = Array.isArray(streakData.history) ? [...streakData.history] : [];
            let newFreezesAvailable = streakData.freezes_available || 0;
            let newFreezesUsed = streakData.freezes_used || 0;

            if (streakData.last_active_date) {
                const [lastYear, lastMonth, lastDay] = streakData.last_active_date.split('-').map(Number);
                const [todayYear, todayMonth, todayDay] = todayStr.split('-').map(Number);

                const lastDate = new Date(lastYear, lastMonth - 1, lastDay);
                const todayDate = new Date(todayYear, todayMonth - 1, todayDay);

                const diffTime = todayDate.getTime() - lastDate.getTime();
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    newCurrentStreak += 1;
                    if (!newHistory.includes(todayStr)) newHistory.push(todayStr);
                } else if (diffDays > 1) {
                    newCurrentStreak = 1;
                    if (!newHistory.includes(todayStr)) newHistory.push(todayStr);
                } else if (diffDays < 0) {
                    newCurrentStreak = 1;
                    if (!newHistory.includes(todayStr)) newHistory.push(todayStr);
                }
            } else {
                newCurrentStreak = 1;
                if (!newHistory.includes(todayStr)) newHistory.push(todayStr);
            }

            const newHighestStreak = Math.max(streakData.highest_streak, newCurrentStreak);
            const nowIso = new Date().toISOString();

            await db.runAsync(
                'UPDATE user_streaks SET current_streak = ?, highest_streak = ?, last_active_date = ?, history = ?, freezes_available = ?, freezes_used = ?, updated_at = ?',
                [newCurrentStreak, newHighestStreak, todayStr, JSON.stringify(newHistory), newFreezesAvailable, newFreezesUsed, nowIso]
            );

            return {
                current_streak: newCurrentStreak,
                highest_streak: newHighestStreak,
                last_active_date: todayStr,
                streak_extended: true,
                history: newHistory,
                freezes_available: newFreezesAvailable,
                freezes_used: newFreezesUsed
            };

        } catch (error) {
            console.error('[DB] Error updating streak:', error);
            throw error;
        }
    }

    async updateStreakFromCloud(cloudData: Partial<{ current_streak: number, highest_streak: number, last_active_date: string | null, history: string[], freezes_available: number, freezes_used: number }>) {
        const db = await this.db;
        try {
            const streakData = await this.getStreak();

            const newCurrentStreak = cloudData.current_streak ?? streakData.current_streak;
            const newHighestStreak = cloudData.highest_streak ?? streakData.highest_streak;
            const newLastActiveDate = cloudData.last_active_date !== undefined ? cloudData.last_active_date : streakData.last_active_date;
            const newHistory = cloudData.history ?? streakData.history;
            const newFreezesAvailable = cloudData.freezes_available ?? streakData.freezes_available;
            const newFreezesUsed = cloudData.freezes_used ?? streakData.freezes_used;
            const nowIso = new Date().toISOString();

            await db.runAsync(
                'UPDATE user_streaks SET current_streak = ?, highest_streak = ?, last_active_date = ?, history = ?, freezes_available = ?, freezes_used = ?, updated_at = ?',
                [newCurrentStreak, newHighestStreak, newLastActiveDate, JSON.stringify(newHistory), newFreezesAvailable, newFreezesUsed, nowIso]
            );
            return await this.getStreak();
        } catch (error) {
            console.error('[DB] Error updating streak from cloud:', error);
            throw error;
        }
    }
}
