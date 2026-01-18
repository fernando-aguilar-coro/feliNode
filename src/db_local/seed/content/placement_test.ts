import { SeedLesson } from "../types";

export const PLACEMENT_TEST: SeedLesson = {
    id: 'placement_test',
    title: 'Prueba de Nivel: Modales',
    desc: 'Evaluaremos tus conocimientos sobre los verbos modales en inglés.',
    status: 'available',
    order: 0,
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
                correctAnswer: 'May I go?'
            },
            order_index: 1
        },
        {
            type: 'translate',
            instruction: 'Traduce al inglés: "Debes comer vegetales"',
            content: {
                phrase: 'Debes comer vegetales',
                correct_answer: 'You must eat vegetables'
            },
            order_index: 2
        },
        {
            type: 'scrambled_sentence',
            instruction: 'Ordena la oración sobre una habilidad negativa:',
            content: {
                segments: ['cannot', 'He', 'dance'],
                correct_answer: 'He cannot dance'
            },
            order_index: 3
        },
        {
            type: 'fill_blank',
            instruction: 'Completa con el modal de consejo (should):',
            content: {
                phrase: 'We ____ be kind.',
                correct_answer: 'should'
            },
            order_index: 4
        }
    ]
};
