import { getModules, getLessonsByModuleId, getCompletedLessons } from '../../../db_local/api_local';

export interface LessonProgress {
    id: string;
    title: string;
    description: string;
    status: 'available' | 'completed';
    order_index: number;
}

export interface ModuleProgress {
    id: number;
    title: string;
    description: string;
    order_index: number;
    lessons: LessonProgress[];
}

export const getModuleProgressView = async (): Promise<ModuleProgress[]> => {
    const modules: any[] = await getModules();
    const completedLessons = await getCompletedLessons();

    const result: ModuleProgress[] = [];

    for (const mod of modules) {
        const lessons: any[] = await getLessonsByModuleId(mod.id);

        const mappedLessons: LessonProgress[] = lessons.map(l => {
            let status: 'available' | 'completed' = 'available';
            if (completedLessons.includes(l.id)) {
                status = 'completed';
            }
            return {
                id: l.id,
                title: l.title,
                description: l.description,
                status: status,
                order_index: l.order_index
            };
        });

        result.push({
            id: mod.id,
            title: mod.title,
            description: mod.description,
            order_index: mod.order_index,
            lessons: mappedLessons
        });
    }

    return result;
};
