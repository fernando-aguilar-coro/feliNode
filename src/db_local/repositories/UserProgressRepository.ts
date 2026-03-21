import { BaseRepository } from '../core/BaseRepository';
import { updateUser } from '../../api/UpdateUser';
import { StreakRepository } from './StreakRepository';

export class UserProgressRepository extends BaseRepository {
    private streakRepo = new StreakRepository();

    async getCompletedLessons(): Promise<string[]> {
        const db = await this.db;
        const profile: any = await db.getFirstAsync('SELECT lessons_completed FROM user_progress LIMIT 1');
        if (!profile) return [];
        return JSON.parse(profile.lessons_completed);
    }

    async setCompletedLessons(completedLessons: string[]) {
        const db = await this.db;
        const json = JSON.stringify(completedLessons);
        const now = new Date().toISOString();

        const profile: any = await db.getFirstAsync('SELECT id FROM user_progress LIMIT 1');

        if (profile) {
            await db.runAsync('UPDATE user_progress SET lessons_completed = ?, updated_at = ? WHERE id = ?', [json, now, profile.id]);
        } else {
            await db.runAsync('INSERT INTO user_progress (lessons_completed, updated_at) VALUES (?, ?)', [json, now]);
        }
    }

    async clearUserProgress() {
        const db = await this.db;
        try {
            await db.runAsync('DELETE FROM user_progress');

        } catch (error) {
            console.error('[DB] Error clearing user progress:', error);
        }
    }

    async isLessonCompleted(lessonId: string) {
        const completed = await this.getCompletedLessons();
        return completed.includes(lessonId);
    }

    async saveUserProgress(lessonId: string, score: number) {
        const db = await this.db;

        if (score >= 80) {
            let profile: any = await db.getFirstAsync('SELECT * FROM user_progress LIMIT 1');

            let completed: string[] = [];
            if (profile && profile.lessons_completed) {
                completed = JSON.parse(profile.lessons_completed);
            }

            if (!completed.includes(lessonId)) {
                completed.push(lessonId);
                const json = JSON.stringify(completed);

                const now = new Date().toISOString();

                if (profile) {
                    await db.runAsync('UPDATE user_progress SET lessons_completed = ?, updated_at = ? WHERE id = ?', [json, now, profile.id]);
                } else {
                    await db.runAsync('INSERT INTO user_progress (lessons_completed, updated_at) VALUES (?, ?)', [json, now]);
                }

                // Code to update dependents from 'locked' to 'available' has been removed
                // since lessons are no longer 'locked'.
            }
            try {
                await this.streakRepo.updateStreak();
            } catch (e) {
                console.error('[DB] Error attempting to update streak:', e);
            }

            updateUser(completed).catch(err => {

            });
        }
    }
}
