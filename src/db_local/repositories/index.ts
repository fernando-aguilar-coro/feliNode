import { ModuleRepository } from './ModuleRepository';
import { LessonRepository, LessonNode } from './LessonRepository';
import { StreakRepository } from './StreakRepository';
import { ExerciseRepository } from './ExerciseRepository';
import { UserProgressRepository } from './UserProgressRepository';
import { InfinityProgressRepository } from './InfinityProgressRepository';

export const moduleRepository = new ModuleRepository();
export const lessonRepository = new LessonRepository();
export const streakRepository = new StreakRepository();
export const exerciseRepository = new ExerciseRepository();
export const userProgressRepository = new UserProgressRepository();
export const infinityProgressRepository = new InfinityProgressRepository();

export {
    ModuleRepository,
    LessonRepository,
    StreakRepository,
    ExerciseRepository,
    UserProgressRepository,
    InfinityProgressRepository,
    LessonNode
};
