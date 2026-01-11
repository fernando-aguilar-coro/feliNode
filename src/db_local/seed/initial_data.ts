import { SeedData } from './types';

const l1 = 'lesson_intro';
const l2 = 'lesson_basics';
const l3 = 'lesson_vocab';
const l4 = 'lesson_conjugation';
const l5 = 'lesson_final_quiz';

export const INITIAL_DATA: SeedData = {
    modules: [
        {
            title: 'Unit 1: Foundations',
            order_index: 1,
            lessons: [
                {
                    id: l1,
                    title: 'Welcome',
                    desc: 'Start your journey',
                    status: 'available',
                    order: 1,
                    theory: {
                        sections: [{ type: 'text', content: 'Welcome to Felinode! In this module, you will learn the basics.' }]
                    },
                    exercises: [
                        {
                            type: 'scrambled_sentence',
                            instruction: 'Arrange the words',
                            content: {
                                segments: ['Felinode', 'to', 'Welcome'],
                                correct_answer: 'Welcome to Felinode'
                            },
                            order_index: 1
                        }
                    ]
                },
                {
                    id: l2,
                    title: 'Grammar Basics',
                    desc: 'Learn the structure',
                    status: 'locked',
                    order: 2,
                    theory: {
                        sections: [
                            { type: 'text', content: 'In Spanish, sentences often follow the Subject-Verb-Object order, just like in English.' },
                            { type: 'text', content: 'For example: "El gato come" means "The cat eats".' }
                        ]
                    },
                    exercises: [
                        {
                            type: 'scrambled_sentence',
                            instruction: 'Form the sentence: "The cat eats"',
                            content: {
                                segments: ['El', 'gato', 'come'],
                                correct_answer: 'El gato come'
                            },
                            order_index: 1
                        },
                        {
                            type: 'translate',
                            instruction: 'Translate: "The dog"',
                            content: {
                                phrase: 'The dog',
                                correct_answer: 'El perro'
                            },
                            order_index: 2
                        }
                    ]
                },
                {
                    id: l3,
                    title: 'Essential Vocab',
                    desc: 'Words you must know',
                    status: 'locked',
                    order: 3,
                    theory: {
                        sections: [
                            { type: 'text', content: 'Let\'s learn some common nouns.' },
                            { type: 'text', content: 'House = Casa. Car = Auto. Tree = Árbol.' }
                        ]
                    },
                    exercises: [
                        {
                            type: 'multiple_choice',
                            instruction: 'What is "House"?',
                            content: {
                                options: [
                                    { option_text: 'Auto', is_correct: 0 },
                                    { option_text: 'Casa', is_correct: 1 },
                                    { option_text: 'Árbol', is_correct: 0 }
                                ],
                                correctAnswer: 'Casa'
                            },
                            order_index: 1
                        },
                        {
                            type: 'translate',
                            instruction: 'Translate "Car"',
                            content: {
                                phrase: 'Car',
                                correct_answer: 'Auto'
                            },
                            order_index: 2
                        }
                    ]
                },
                {
                    id: l4,
                    title: 'Verb Mastery',
                    desc: 'Conjugation rules',
                    status: 'locked',
                    order: 4,
                    theory: {
                        sections: [
                            { type: 'text', content: 'Verbs change depending on who is doing the action.' },
                            { type: 'text', content: 'I eat = Yo como. You eat = Tú comes.' }
                        ]
                    },
                    exercises: [
                        {
                            type: 'scrambled_sentence',
                            instruction: 'Translate: "I eat"',
                            content: {
                                segments: ['Yo', 'como', 'tú'],
                                correct_answer: 'Yo como'
                            },
                            order_index: 1
                        }
                    ]
                },
                {
                    id: l5,
                    title: 'Unit 1 Quiz',
                    desc: 'Test your knowledge',
                    status: 'locked',
                    order: 5,
                    exercises: [
                        {
                            type: 'multiple_choice',
                            instruction: 'Select the translation for "The cat eats"',
                            content: {
                                options: [
                                    { option_text: 'El perro come', is_correct: 0 },
                                    { option_text: 'El gato come', is_correct: 1 },
                                    { option_text: 'La casa come', is_correct: 0 }
                                ],
                                correctAnswer: 'El gato come'
                            },
                            order_index: 1
                        },
                        {
                            type: 'translate',
                            instruction: 'Translate: "I eat"',
                            content: {
                                phrase: 'I eat',
                                correct_answer: 'Yo como'
                            },
                            order_index: 2
                        }
                    ]
                },
            ],
            dependencies: [
                { child: l2, parent: l1 }, // Intro -> Basics
                { child: l3, parent: l1 }, // Intro -> Vocab
                { child: l4, parent: l2 }, // Basics -> Conjugation
                { child: l4, parent: l3 }, // Vocab -> Conjugation (SECOND PARENT)
                { child: l5, parent: l4 }, // Conjugation -> Quiz
            ]
        }
    ],
    placement_test: {
        id: 'placement_test',
        title: 'Placement Test',
        desc: 'Evaluate your level',
        status: 'available',
        order: 0,
        exercises: [
            {
                type: 'multiple_choice',
                instruction: 'Choose the correct translation for "The cat"',
                content: {
                    options: [
                        { option_text: 'El perro', is_correct: 0 },
                        { option_text: 'El gato', is_correct: 1 },
                        { option_text: 'El pájaro', is_correct: 0 }
                    ],
                    correctAnswer: 'El gato'
                },
                order_index: 1
            },
            {
                type: 'translate',
                instruction: 'Traduce al español:',
                content: {
                    phrase: 'The sky is blue',
                    correct_answer: 'El cielo es azul'
                },
                order_index: 2
            }
        ]
    }
};
