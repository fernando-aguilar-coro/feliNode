import { BaseRepository } from '../core/BaseRepository';

export class InfinityProgressRepository extends BaseRepository {
    async saveInfinityScore(targetId: string, score: number) {
        const db = await this.db;
        try {
            const existing: any = await db.getFirstAsync('SELECT max_score FROM infinity_progress WHERE target_id = ?', [targetId]);

            if (existing) {
                if (score > existing.max_score) {
                    await db.runAsync('UPDATE infinity_progress SET max_score = ?, updated_at = ? WHERE target_id = ?', [score, new Date().toISOString(), targetId]);
                    console.log(`[DB] Updated max score for ${targetId} to ${score}`);
                } else {
                    console.log(`[DB] Score ${score} not higher than existing ${existing.max_score} for ${targetId}`);
                }
            } else {
                await db.runAsync('INSERT INTO infinity_progress (target_id, max_score, updated_at) VALUES (?, ?, ?)', [targetId, score, new Date().toISOString()]);
                console.log(`[DB] Inserted new score for ${targetId}: ${score}`);
            }
        } catch (error) {
            console.error('[DB] Error saving infinity score:', error);
        }
    }

    async getInfinityScore(targetId: string): Promise<number> {
        const db = await this.db;
        try {
            const result: any = await db.getFirstAsync('SELECT max_score FROM infinity_progress WHERE target_id = ?', [targetId]);
            return result?.max_score || 0;
        } catch (error) {
            console.error('[DB] Error getting infinity score:', error);
            return 0;
        }
    }

    async getAllInfinityProgress(): Promise<{ target_id: string; max_score: number }[]> {
        const db = await this.db;
        try {
            const results: any[] = await db.getAllAsync('SELECT target_id, max_score FROM infinity_progress');
            return results;
        } catch (error) {
            console.error('[DB] Error getting all infinity progress:', error);
            return [];
        }
    }

    async saveInfinityScoreBulk(records: { target_id: string; max_score: number }[]) {
        const db = await this.db;
        if (records.length === 0) return;

        try {
            await db.withTransactionAsync(async () => {
                const now = new Date().toISOString();
                for (const record of records) {
                    await db.runAsync(
                        `INSERT INTO infinity_progress (target_id, max_score, updated_at) 
                         VALUES (?, ?, ?) 
                         ON CONFLICT(target_id) DO UPDATE SET 
                         max_score = excluded.max_score, 
                         updated_at = excluded.updated_at
                         WHERE excluded.max_score > infinity_progress.max_score`,
                        [record.target_id, record.max_score, now]
                    );
                }
            });
            console.log(`[DB] Bulk sync attempted for ${records.length} infinity scores.`);
        } catch (error) {
            console.error('[DB] Error bulk saving infinity scores:', error);
        }
    }
}
