
import { userProgressRepository } from '../db_local/repositories';

/**
 * Fetches the count of completed lessons from the local database.
 * This is used by the UserStore and Navigation to determine user progress.
 */
export const getUserCompletedLessons = async (): Promise<number> => {
    try {
        const completedLessons = await userProgressRepository.getCompletedLessons();
        return completedLessons.length;
    } catch (error) {
        console.error('Error fetching user completed lessons:', error);
        return 0;
    }
};
