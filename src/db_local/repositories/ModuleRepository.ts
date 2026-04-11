import { BaseRepository } from '../core/BaseRepository';
import { UserProgressRepository } from './UserProgressRepository';

export interface ModuleNode {
    id: string;
    title: string;
    description: string;
    status: 'available' | 'completed';
    parents: string[];
    order_index: number;
}

export class ModuleRepository extends BaseRepository {
    private progressRepo = new UserProgressRepository();

    async getModules(): Promise<any[]> {
        const db = await this.db;
        return await db.getAllAsync('SELECT * FROM modules ORDER BY order_index ASC');
    }

    async getModuleNodes(): Promise<ModuleNode[]> {
        const db = await this.db;

        // 1. Get all modules
        const modules: any[] = await db.getAllAsync('SELECT id, title, order_index FROM modules ORDER BY order_index ASC');

        // 2. Get all dependencies (the DAG we just created)
        const dependencies: any[] = await db.getAllAsync('SELECT module_id, prerequisite_id FROM module_dependencies');

        const dependencyMap = new Map<number, number[]>();
        dependencies.forEach(dep => {
            if (!dependencyMap.has(dep.module_id)) {
                dependencyMap.set(dep.module_id, []);
            }
            dependencyMap.get(dep.module_id)?.push(dep.prerequisite_id);
        });

        // 3. Get progress info
        const completedLessonIds = await this.progressRepo.getCompletedLessons();
        const allLessons: any[] = await db.getAllAsync('SELECT id, module_id FROM lessons');

        return modules.map(row => {
            const parents = (dependencyMap.get(row.id) || []).map(id => id.toString());

            // Simple status calculation:
            // Check if all lessons in this module are completed
            const moduleLessons = allLessons.filter(l => l.module_id === row.id);
            const isCompleted = moduleLessons.length > 0 &&
                moduleLessons.every(l => completedLessonIds.includes(l.id));

            return {
                id: row.id.toString(),
                title: row.title,
                description: '', // Description can be empty for now if not available in table
                status: isCompleted ? 'completed' : 'available',
                parents,
                order_index: row.order_index
            };
        });
    }
}
