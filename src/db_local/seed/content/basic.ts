import { SeedLesson } from "../types";

export const PLACEMENT_TEST_BASIC: SeedLesson = {
    id: 'placement_test_basic',
    title: 'Prueba Nivel: Básico',
    desc: 'Evaluaremos tus conocimientos básicos.',
    status: 'available',
    order: 0,
    exercises: [
        {
            type: 'multiple_choice',
            instruction: 'Select the correct greeting.',
            content: {
                options: [
                    { option_text: 'Hello', is_correct: true },
                    { option_text: 'Goodbye', is_correct: false },
                    { option_text: 'Night', is_correct: false }

                ],
                correct_answer: 'Hello'
            },
            order_index: 0
        }
    ]
};
