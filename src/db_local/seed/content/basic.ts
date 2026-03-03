import { SeedLesson } from "../types";

export const PLACEMENT_TEST_BASIC: SeedLesson = {
    id: 'placement_test_basic',
    title: 'Examen basico A1-A2',
    desc: 'Evaluaremos tus conocimientos básicos (A1-A2).',
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
                correct_answer: 'Hello',
                unlocks_lesson_id: 'Saludos y Presentaciones: El Verbo "To Be"_5b92ef70-9781-459a-bf79-4f3622f1fe92'
            },
            order_index: 0
        },
        {
            type: 'multiple_choice',
            instruction: 'Selecciona el verbo correcto para completar la oración: He ___ a student.',
            content: {
                options: [
                    { option_text: 'am', is_correct: false },
                    { option_text: 'is', is_correct: true },
                    { option_text: 'are', is_correct: false }
                ],
                correct_answer: 'is',
                unlocks_lesson_id: 'verbo_"to_be"_y_pronombres_personales_6441'
            },
            order_index: 1
        },
        {
            type: 'fill_blank',
            instruction: 'Completa la oración con la preposición correcta.',
            content: {
                phrase: 'The cat is ___ the table.',
                correct_answer: 'under',
                unlocks_lesson_id: 'Preposiciones de Lugar en Inglés: In, On, At y Más_2592491a-54bc-435f-941d-b096cd03c49a'
            },
            order_index: 2
        },
        {
            type: 'translate',
            instruction: 'Traduce la siguiente frase al inglés.',
            content: {
                phrase: 'Yo no juego tenis los sábados.',
                correct_answer: 'I do not play tennis on Saturdays',
                unlocks_lesson_id: 'El Presente Simple Negativo: Don\'t y Doesn\'t_c4a869cb-36af-4f04-a051-2f13970317cc'
            },
            order_index: 3
        },
        {
            type: 'scrambled_sentence',
            instruction: 'Ordena las palabras para formar una pregunta en pasado simple.',
            content: {
                correct_answer: 'Did you go to the cinema yesterday',
                unlocks_lesson_id: 'El Pasado Simple (Past Simple)_aff12633-7b37-4254-a5c1-0261d5c0db0a'
            },
            order_index: 4
        },
        {
            type: 'select_pairs',
            instruction: 'Une los opuestos.',
            content: {
                pairs: [
                    { left: 'Big', right: 'Small' },
                    { left: 'Hot', right: 'Cold' },
                    { left: 'Fast', right: 'Slow' },
                    { left: 'Happy', right: 'Sad' }
                ],
                unlocks_lesson_id: 'Adjetivos Descriptivos en Inglés_21e67471-ea00-401e-8bef-6db4b4ed4d20'
            },
            order_index: 5
        }
    ]
};
