import { SeedLesson } from "../../../../types";
import theory from './modal_verbs.md';

const lesson_modal_verbs_id = 'lesson_modal_verbs';

export const LESSON_MODAL_VERBS: SeedLesson = {
    id: lesson_modal_verbs_id,
    title: 'Verbos Modales (Can, Must, Should)',
    desc: 'Aprende a expresar habilidad, obligación y consejo en inglés.',
    status: 'available',
    order: 1,
    theory: theory,
    exercises: [
        {
            type: 'multiple_choice',
            instruction: 'Selecciona el verbo modal correcto para expresar habilidad:',
            content: {
                options: [
                    { option_text: 'can', is_correct: true },
                    { option_text: 'must', is_correct: false },
                    { option_text: 'should', is_correct: false }
                ],
                correctAnswer: 'can'
            },
            order_index: 6
        },
        {
            type: 'scrambled_sentence',
            instruction: 'Ordena las palabras para formar un consejo:',
            content: {
                segments: ['should', 'water', 'drink', 'You'],
                correct_answer: 'You should drink water'
            },
            order_index: 2
        },
        {
            type: 'translate',
            instruction: 'Traduce al español la siguiente frase sobre obligación:',
            content: {
                phrase: 'I must study',
                correct_answer: 'Yo debo estudiar'
            },
            order_index: 3
        },
        {
            type: 'fill_blank',
            instruction: 'Completa la frase con el modal de habilidad :',
            content: {
                phrase: 'Birds ____ fly.',
                correct_answer: 'can'
            },
            order_index: 4
        },
        {
            type: 'multiple_choice',
            instruction: 'Selecciona el icono que representa una "Idea":',
            content: {
                options: [
                    { option_text: 'Bulb', is_correct: true, icon: 'bulb-outline' },
                    { option_text: 'Book', is_correct: false, icon: 'book-outline' },
                    { option_text: 'Rocket', is_correct: false, icon: 'rocket-outline' }
                ],
                correctAnswer: 'Bulb'
            },
            order_index: 5
        },
        {
            type: 'pronunciation',
            instruction: 'Lee en voz alta la siguiente frase:',
            content: {
                phrase: 'I can speak English',
                correct_answer: 'I can speak English'
            },
            order_index: 1
        }
    ]
};
