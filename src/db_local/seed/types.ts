export interface SeedOption {
    option_text: string;
    is_correct: boolean;
    icon?: string;
}

export interface SeedExerciseContent {
    segments?: string[];
    correct_answer?: string;
    options?: SeedOption[];
    correctAnswer?: string; // For multiple_choice
    phrase?: string; // For translate
    // Add other fields as needed for different exercise types
}

export interface SeedExercise {
    type: string;
    instruction: string;
    content: SeedExerciseContent;
    order_index?: number;
}

export interface SeedTheorySection {
    type: 'text' | 'image' | 'code';
    content: string;
}

export interface SeedTheory {
    sections: SeedTheorySection[];
}

export interface SeedLesson {
    id: string;
    title: string;
    desc: string;
    status: string;
    order?: number;
    theory?: string; // Markdown content
    exercises?: SeedExercise[];
}

export interface SeedDependency {
    child: string;
    parent: string;
}

export interface SeedModule {
    title: string;
    order_index?: number;
    lessons: SeedLesson[];
    dependencies: SeedDependency[];
}

export interface SeedData {
    modules: SeedModule[];
    placement_test?: SeedLesson; // Special case for placement test which might not be in a module strictly or is standalone
}
