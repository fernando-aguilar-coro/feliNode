import { BaseRepository } from '../core/BaseRepository';

export class ExerciseRepository extends BaseRepository {
    async getExercisesByLessonId(lessonId: string) {
        const db = await this.db;
        const exercises: any[] = await db.getAllAsync('SELECT * FROM exercises WHERE lesson_id = ? ORDER BY order_index ASC', [lessonId]);
        return exercises;
    }
}
