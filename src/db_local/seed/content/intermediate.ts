import { SeedLesson } from "../types";

export const PLACEMENT_TEST_INTERMEDIATE: SeedLesson = {
    id: 'placement_test_intermediate',
    title: 'Examen intermedio B1-B2',
    desc: 'Evaluaremos tus conocimientos intermedios (B1-B2).',
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
                correct_answer: 'May I go?',
                unlocks_lesson_id: 'TODO_modals_permission'
            },
            order_index: 0
        },
        {
            type: 'multiple_choice',
            instruction: 'Selecciona la opción correcta en relación al Pasado Simple / Presente Perfecto.',
            content: {
                options: [
                    { option_text: 'I have seen that movie yesterday.', is_correct: false },
                    { option_text: 'I saw that movie yesterday.', is_correct: true },
                    { option_text: 'I have saw that movie yesterday.', is_correct: false }
                ],
                correct_answer: 'I saw that movie yesterday.',
                unlocks_lesson_id: 'Presente Perfecto_7ee63f52-8352-4c28-9f5c-4270882cc221'
            },
            order_index: 1
        },
        {
            type: 'fill_blank',
            instruction: 'Completa la oración (Segundo Condicional).',
            content: {
                phrase: 'If I won the lottery, I ___ buy a big house.',
                correct_answer: 'would',
                unlocks_lesson_id: 'TODO_second_conditional'
            },
            order_index: 2
        },
        {
            type: 'translate',
            instruction: 'Traduce a voz pasiva.',
            content: {
                phrase: 'Alguien robó mi bicicleta.',
                correct_answer: 'My bike was stolen',
                unlocks_lesson_id: 'TODO_passive_voice'
            },
            order_index: 3
        },
        {
            type: 'scrambled_sentence',
            instruction: 'Ordena la oración en Reported Speech.',
            content: {
                correct_answer: 'She said that she was tired',
                unlocks_lesson_id: 'TODO_reported_speech'
            },
            order_index: 4
        },
        {
            type: 'select_pairs',
            instruction: 'Une los Phrasal Verbs con su significado.',
            content: {
                pairs: [
                    { left: 'Give up', right: 'Quit' },
                    { left: 'Look for', right: 'Search' },
                    { left: 'Take off', right: 'Depart' },
                    { left: 'Find out', right: 'Discover' }
                ],
                unlocks_lesson_id: 'TODO_phrasal_verbs'
            },
            order_index: 5
        }
    ]
};
