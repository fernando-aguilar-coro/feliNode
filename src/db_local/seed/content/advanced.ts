import { SeedLesson } from "../types";

export const PLACEMENT_TEST_ADVANCED: SeedLesson = {
    id: 'placement_test_advanced',
    title: 'Prueba Nivel: Avanzado',
    desc: 'Evaluaremos tus conocimientos avanzados.',
    status: 'available',
    order: 2,
    exercises: [
        {
            type: 'multiple_choice',
            instruction: 'Select the correct conditional sentence.',
            content: {
                options: [
                    { option_text: 'If I were you, I would go.', is_correct: true },
                    { option_text: 'If I was you, I will go.', is_correct: false },
                    { option_text: 'If I am you, I would go.', is_correct: false }
                ],
                correct_answer: 'If I were you, I would go.'
            },
            order_index: 0
        }
    ]
};
