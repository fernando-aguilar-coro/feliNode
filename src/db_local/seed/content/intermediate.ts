import { SeedLesson } from "../types";

export const PLACEMENT_TEST_INTERMEDIATE: SeedLesson = {
    id: 'placement_test_intermediate',
    title: 'Prueba Nivel: Intermedio',
    desc: 'Evaluaremos tus conocimientos intermedios.',
    status: 'available',
    order: 1,
    exercises: [
        {
            type: 'multiple_choice',
            instruction: '¿Cuál es la forma correcta para pedir permiso formalmente?',
            content: {
                options: [
                    { option_text: 'May I go?', is_correct: true },
                    { option_text: 'Must I go?', is_correct: false },
                    { option_text: 'Should I go?', is_correct: false }
                ],
                correct_answer: 'May I go?'
            },
            order_index: 0
        }
    ]
};
