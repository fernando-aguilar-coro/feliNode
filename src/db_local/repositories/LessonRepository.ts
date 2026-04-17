import { BaseRepository } from '../core/BaseRepository';
import { UserProgressRepository } from './UserProgressRepository';

export interface LessonNode {
    id: string;
    title: string;
    description: string;
    status: string;
    parents: string[]; // List of parent IDs
    order_index: number;
}

export class LessonRepository extends BaseRepository {
    private userProgressRepo = new UserProgressRepository();

    async getLessonsByModuleId(moduleId: number) {
        const db = await this.db;
        return await db.getAllAsync('SELECT * FROM lessons WHERE module_id = ? ORDER BY order_index ASC', [moduleId]);
    }

    async getLessonById(lessonId: string) {
        const db = await this.db;
        return await db.getFirstAsync('SELECT * FROM lessons WHERE id = ?', [lessonId]);
    }

    async getLessonStatus(lessonId: string) {
        const isCompleted = await this.userProgressRepo.isLessonCompleted(lessonId);
        if (isCompleted) return 'completed';

        return 'available';
    }

    /**
     * Returns the lesson with the highest `order_index` among those the user
     * has already completed.  The row includes `module_title` for display.
     * Returns `null` when the user has no completed lessons yet.
     */
    async getHighestCompletedLesson(): Promise<{
        id: string;
        title: string;
        description: string;
        order_index: number;
        module_id: number;
        module_title: string;
    } | null> {
        const completedIds = await this.userProgressRepo.getCompletedLessons();
        if (completedIds.length === 0) return null;

        const db = await this.db;
        const placeholders = completedIds.map(() => '?').join(',');
        const row: any = await db.getFirstAsync(
            `SELECT l.id, l.title, l.description, l.order_index, l.module_id,
                    m.title AS module_title
             FROM lessons l
             JOIN modules m ON m.id = l.module_id
             WHERE l.id IN (${placeholders})
               AND l.id NOT LIKE 'placement_test%'
             ORDER BY l.order_index DESC
             LIMIT 1`,
            completedIds
        );
        return row ?? null;
    }

    /**
     * Returns the next uncompleted lesson immediately after the highest
     * completed one (by `order_index`).  Falls back to the very first lesson
     * if the user has never completed anything.
     */
    async getNextLesson(): Promise<{
        id: string;
        title: string;
        description: string;
        order_index: number;
        module_id: number;
        module_title: string;
    } | null> {
        const db = await this.db;
        const highest = await this.getHighestCompletedLesson();
        const afterIndex = highest ? highest.order_index : -1;

        const row: any = await db.getFirstAsync(
            `SELECT l.id, l.title, l.description, l.order_index, l.module_id,
                    m.title AS module_title
             FROM lessons l
             JOIN modules m ON m.id = l.module_id
             WHERE l.order_index > ?
               AND l.id NOT LIKE 'placement_test%'
             ORDER BY l.order_index ASC
             LIMIT 1`,
            [afterIndex]
        );
        return row ?? null;
    }

    async getLessonNodes(): Promise<LessonNode[]> {
        const db = await this.db;

        const lessons: any[] = await db.getAllAsync("SELECT id, title, description, status, order_index FROM lessons WHERE id NOT LIKE 'placement_test%' ORDER BY order_index ASC");
        const dependencies: any[] = await db.getAllAsync('SELECT lesson_id, prerequisite_id FROM lesson_dependencies');

        const dependencyMap = new Map<string, string[]>();
        dependencies.forEach(dep => {
            if (!dependencyMap.has(dep.lesson_id)) {
                dependencyMap.set(dep.lesson_id, []);
            }
            dependencyMap.get(dep.lesson_id)?.push(dep.prerequisite_id);
        });

        const completedLessons = await this.userProgressRepo.getCompletedLessons();

        return lessons.map(row => {
            const parents = dependencyMap.get(row.id) || [];
            let status = row.status;

            if (completedLessons.includes(row.id)) {
                status = 'completed';
            } else {
                status = 'available';
            }

            return {
                ...row,
                status,
                parents
            };
        });
    }
}
