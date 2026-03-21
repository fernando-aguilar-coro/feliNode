import { BaseRepository } from '../core/BaseRepository';
import { UserProgressRepository } from './UserProgressRepository';

export interface LessonNode {
    id: string;
    title: string;
    description: string;
    status: string;
    parents: string[]; // List of parent IDs
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

    async getLessonNodes(): Promise<LessonNode[]> {
        const db = await this.db;

        const lessons: any[] = await db.getAllAsync("SELECT id, title, description, status FROM lessons WHERE id NOT LIKE 'placement_test%' ORDER BY order_index ASC");
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
