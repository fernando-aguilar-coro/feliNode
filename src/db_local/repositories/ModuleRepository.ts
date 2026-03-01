import { BaseRepository } from '../core/BaseRepository';

export class ModuleRepository extends BaseRepository {
    async getModules() {
        const db = await this.db;
        return await db.getAllAsync('SELECT * FROM modules ORDER BY order_index ASC');
    }
}
