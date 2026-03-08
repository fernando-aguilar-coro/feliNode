import { BaseRepository } from '../core/BaseRepository';

export interface UserCurrencies {
    xp: number;
    michi_coins: number;
}

export class UserCurrenciesRepository extends BaseRepository {
    async getCurrencies(): Promise<UserCurrencies> {
        const db = await this.db;
        try {
            const result: any = await db.getFirstAsync('SELECT xp, michi_coins FROM user_currencies LIMIT 1');
            if (result) {
                return { xp: result.xp, michi_coins: result.michi_coins };
            } else {
                await db.runAsync('INSERT INTO user_currencies (xp, michi_coins, updated_at) VALUES (0, 0, ?)', [new Date().toISOString()]);
                return { xp: 0, michi_coins: 0 };
            }
        } catch (error) {
            console.error('[DB] Error getting user currencies:', error);
            return { xp: 0, michi_coins: 0 };
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

            return { xp: newXp, michi_coins: newCoins };
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

    async updateCurrenciesFromCloud(cloudData: Partial<UserCurrencies>) {
        const db = await this.db;
        try {
            const current = await this.getCurrencies();
            const newXp = cloudData.xp ?? current.xp;
            const newCoins = cloudData.michi_coins ?? current.michi_coins;
            const nowIso = new Date().toISOString();

            await db.runAsync(
                'UPDATE user_currencies SET xp = ?, michi_coins = ?, updated_at = ?',
                [newXp, newCoins, nowIso]
            );
            return { xp: newXp, michi_coins: newCoins };
        } catch (error) {
            console.error('[DB] Error updating currencies from cloud:', error);
            throw error;
        }
    }

    async clearCurrencies() {
        const db = await this.db;
        try {
            await db.runAsync('DELETE FROM user_currencies');
        } catch (error) {
            console.error('[DB] Error clearing user currencies:', error);
        }
    }
}
