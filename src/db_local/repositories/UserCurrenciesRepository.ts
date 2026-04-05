import { BaseRepository } from '../core/BaseRepository';

export interface UserCurrencies {
    xp: number;
    michi_coins: number;
    inventory: Record<string, any>;
    updated_at?: string;
}

export class UserCurrenciesRepository extends BaseRepository {
    async getCurrencies(): Promise<UserCurrencies> {
        const db = await this.db;
        try {
            const result: any = await db.getFirstAsync('SELECT xp, michi_coins, inventory, updated_at FROM user_currencies LIMIT 1');
            if (result) {
                let inventory = {};
                try {
                    inventory = result.inventory ? JSON.parse(result.inventory) : {};
                } catch (e) {
                    console.error('Failed to parse inventory JSON from DB');
                }
                return { xp: result.xp, michi_coins: result.michi_coins, inventory, updated_at: result.updated_at };
            } else {
                const now = new Date().toISOString();
                await db.runAsync("INSERT INTO user_currencies (xp, michi_coins, inventory, updated_at) VALUES (0, 0, '{}', ?)", [now]);
                return { xp: 0, michi_coins: 0, inventory: {}, updated_at: now };
            }
        } catch (error) {
            console.error('[DB] Error getting user currencies:', error);
            return { xp: 0, michi_coins: 0, inventory: {} };
        }
    }

    async addCurrencies(xpToAdd: number, coinsToAdd: number): Promise<UserCurrencies> {
        const db = await this.db;
        try {
            const current = await this.getCurrencies();
            const newXp = current.xp + xpToAdd;
            const newCoins = current.michi_coins + coinsToAdd;
            const nowIso = new Date().toISOString();

            await db.runAsync(
                'UPDATE user_currencies SET xp = ?, michi_coins = ?, updated_at = ?',
                [newXp, newCoins, nowIso]
            );

            return { ...current, xp: newXp, michi_coins: newCoins };
        } catch (error) {
            console.error('[DB] Error adding user currencies:', error);
            throw error;
        }
    }

    async spendCoins(amount: number): Promise<boolean> {
        const db = await this.db;
        try {
            const current = await this.getCurrencies();
            if (current.michi_coins < amount) {
                return false;
            }

            const newCoins = current.michi_coins - amount;
            const nowIso = new Date().toISOString();

            await db.runAsync(
                'UPDATE user_currencies SET michi_coins = ?, updated_at = ?',
                [newCoins, nowIso]
            );
            return true;
        } catch (error) {
            console.error('[DB] Error spending coins:', error);
            return false;
        }
    }

    async updateInventory(newInventory: Record<string, any>): Promise<UserCurrencies> {
        const db = await this.db;
        try {
            const current = await this.getCurrencies();
            const updatedInventory = { ...current.inventory, ...newInventory };
            const nowIso = new Date().toISOString();
            const inventoryStr = JSON.stringify(updatedInventory);

            await db.runAsync(
                'UPDATE user_currencies SET inventory = ?, updated_at = ?',
                [inventoryStr, nowIso]
            );
            return { ...current, inventory: updatedInventory };
        } catch (error) {
            console.error('[DB] Error updating inventory:', error);
            throw error;
        }
    }

    async updateCurrenciesFromCloud(cloudData: Partial<UserCurrencies>) {
        const db = await this.db;
        try {
            const current = await this.getCurrencies();
            const newXp = cloudData.xp ?? current.xp;
            const newCoins = cloudData.michi_coins ?? current.michi_coins;
            const newInventory = cloudData.inventory ? cloudData.inventory : current.inventory;

            const nowIso = new Date().toISOString();

            await db.runAsync(
                'UPDATE user_currencies SET xp = ?, michi_coins = ?, inventory = ?, updated_at = ?',
                [newXp, newCoins, JSON.stringify(newInventory), nowIso]
            );
            return { xp: newXp, michi_coins: newCoins, inventory: newInventory };
        } catch (error) {
            console.error('[DB] Error updating currencies from cloud:', error);
            throw error;
        }
    }

    async clearCurrencies() {
        const db = await this.db;
        try {
            await db.runAsync('DELETE FROM user_currencies');
            await db.runAsync('DELETE FROM xp_history');
        } catch (error) {
            console.error('[DB] Error clearing user currencies:', error);
        }
    }

    // --- XP HISTORY METHODS ---

    async addXpLog(xpAmount: number): Promise<void> {
        const db = await this.db;
        try {
            const id = Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
            const earnedAt = new Date().toISOString();
            
            await db.runAsync(
                'INSERT INTO xp_history (id, xp_amount, earned_at, is_synced) VALUES (?, ?, ?, 0)',
                [id, xpAmount, earnedAt]
            );
        } catch (error) {
            console.error('[DB] Error adding XP log:', error);
        }
    }

    async getUnsyncedXpLogs(): Promise<any[]> {
        const db = await this.db;
        try {
            return await db.getAllAsync('SELECT * FROM xp_history WHERE is_synced = 0');
        } catch (error) {
            console.error('[DB] Error getting unsynced XP logs:', error);
            return [];
        }
    }

    async markXpLogsAsSynced(ids: string[]): Promise<void> {
        if (!ids.length) return;
        const db = await this.db;
        try {
            const placeholders = ids.map(() => '?').join(',');
            await db.runAsync(`UPDATE xp_history SET is_synced = 1 WHERE id IN (${placeholders})`, ids);
        } catch (error) {
            console.error('[DB] Error marking XP logs as synced:', error);
        }
    }
}

