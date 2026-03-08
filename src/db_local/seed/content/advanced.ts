import { SeedLesson } from "../types";

export const PLACEMENT_TEST_ADVANCED: SeedLesson = {
    id: 'placement_test_advanced',
    title: 'Examen avanzado C1-C2',
    desc: 'Evaluaremos tus conocimientos avanzados (C1-C2).',
    status: 'available',
    order: 2,
    exercises: [
        {
            type: 'multiple_choice',
            instruction: 'Selecciona la oración condicional que está escrita correctamente.',
            content: {
                options: [
                    { option_text: 'If I were you, I would go.', is_correct: true },
                    { option_text: 'If I was you, I will go.', is_correct: false },
                    { option_text: 'If I am you, I would go.', is_correct: false }
                ],
                correct_answer: 'If I were you, I would go.',
                unlocks_lesson_id: 'TODO_advanced_conditionals'
            },
            order_index: 0
        },
        {
            type: 'multiple_choice',
            instruction: 'Selecciona la oración que utiliza la estructura correcta de énfasis (Inversión).',
            content: {
                options: [
                    { option_text: 'Never I have seen such a beautiful sunset.', is_correct: false },
                    { option_text: 'Never have I seen such a beautiful sunset.', is_correct: true },
                    { option_text: 'Never I had seen such a beautiful sunset.', is_correct: false }
                ],
                correct_answer: 'Never have I seen such a beautiful sunset.',
                unlocks_lesson_id: 'TODO_inversion'
            },
            order_index: 1
        },
        {
            type: 'fill_blank',
            instruction: 'Completa la oración condicional asumiendo una consecuencia en el presente de una acción pasada.',
            content: {
                phrase: 'If she had studied harder, she ___ be in this situation now.',
                correct_answer: 'would not',
                unlocks_lesson_id: 'TODO_third_conditional'
            },
            order_index: 2
        },
        {
            type: 'translate',
            instruction: 'Traduce la siguiente frase al inglés.',
            content: {
                phrase: 'Habiendo terminado su trabajo, se fue a casa.',
                correct_answer: 'Having finished his work he went home',
                unlocks_lesson_id: 'TODO_participle_clauses'
            },
            order_index: 3
        },
        {
            type: 'scrambled_sentence',
            instruction: 'Ordena las palabras para formar la oración de manera formal.',
            content: {
                correct_answer: 'It is crucial that he arrive on time',
                unlocks_lesson_id: 'TODO_subjunctive'
            },
            order_index: 4
        },
        {
            type: 'select_pairs',
            instruction: 'Une los modismos (Idioms) con su significado.',
            content: {
                pairs: [
                    { left: 'Bite the bullet', right: 'Face a difficult situation' },
                    { left: 'Cut corners', right: 'Do something poorly to save time' },
                    { left: 'Break the ice', right: 'Initiate a conversation' },
                    { left: 'Under the weather', right: 'Feeling sick' }
                ],
                unlocks_lesson_id: 'TODO_idioms'
            },
            order_index: 5
        }
    ]
};
