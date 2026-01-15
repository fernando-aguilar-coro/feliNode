import { SeedData } from './types';

const lesson_modal_verbs = 'lesson_modal_verbs';

export const INITIAL_DATA: SeedData = {
    modules: [
        {
            title: 'Unidad 1: Verbos Modales',
            order_index: 1,
            lessons: [
                {
                    id: lesson_modal_verbs,
                    title: 'Verbos Modales (Can, Must, Should)',
                    desc: 'Aprende a expresar habilidad, obligación y consejo en inglés.',
                    status: 'available',
                    order: 1,
                    theory: `
## ¿Qué son los Modal Verbs?

Los **modal verbs** (verbos modales) son verbos auxiliares especiales que modifican el significado del verbo principal. Expresan posibilidad, habilidad, permiso, obligación o consejo.

### Características Principales

Los verbos modales tienen características únicas:

- **No cambian de forma** con la tercera persona (he/she/it)
- **No usan "to"** antes del verbo principal
- **No necesitan auxiliares** para preguntas o negaciones
- Se colocan **antes del verbo principal**

## Verbos Modales Comunes

### CAN / COULD

**CAN** expresa habilidad o posibilidad en el presente:

- I **can** swim very well
- She **can** speak three languages
- **Can** you help me?

**COULD** es la forma pasada de can o expresa posibilidad:

- I **could** run faster when I was younger
- We **could** go to the beach tomorrow

> **EJEMPLO:**
> *I can play the guitar, but I couldn't play the piano when I was a child.*

### MUST / HAVE TO

**MUST** expresa obligación fuerte o deducción lógica:

- You **must** wear a seatbelt (obligación)
- She **must** be tired after working all day (deducción)

**HAVE TO** también expresa obligación, pero es más neutral:

- I **have to** wake up early tomorrow
- Do you **have to** work on weekends?

### SHOULD / OUGHT TO

Expresan consejo o recomendación:

- You **should** study more for the exam
- We **ought to** visit our grandparents
- He **shouldn't** eat so much sugar

> **EJEMPLO:**
> *You should drink more water. It's good for your health.*

### MAY / MIGHT

Expresan posibilidad o permiso:

- It **may** rain tomorrow (posibilidad)
- **May** I use your phone? (permiso formal)
- She **might** come to the party (posibilidad menor)

### WOULD

Expresa acciones hipotéticas, deseos o costumbres pasadas:

- I **would** travel the world if I had money
- **Would** you like some coffee?
- When I was young, I **would** play in the park every day

## Estructura Gramatical

### Afirmaciones

**Sujeto + Modal + Verbo base**

- She **can** dance
- They **must** leave now
- We **should** practice more

### Negaciones

**Sujeto + Modal + not + Verbo base**

- I **cannot** (can't) swim
- You **must not** (mustn't) smoke here
- He **should not** (shouldn't) lie

### Preguntas

**Modal + Sujeto + Verbo base?**

- **Can** you drive?
- **Should** we wait?
- **Must** I go?

## Diferencias Importantes

### CAN vs MAY (Permiso)

- **CAN** es informal: *Can I go to the bathroom?*
- **MAY** es formal: *May I leave early, sir?*

### MUST vs HAVE TO (Obligación)

- **MUST** es más fuerte y personal
- **HAVE TO** es más neutral y externo

### SHOULD vs MUST (Consejo vs Obligación)

- **SHOULD** es consejo: *You should rest*
- **MUST** es obligación: *You must take this medicine*

## Errores Comunes

**Evita estos errores:**

- ❌ He cans speak English
- ✅ He can speak English

- ❌ Do you can help me?
- ✅ Can you help me?

- ❌ I must to go
- ✅ I must go

> **EJEMPLO:**
> *She doesn't have to work tomorrow (no obligation), but she must finish her report today (strong obligation).*

## Resumen Rápido

- **CAN/COULD**: habilidad, posibilidad
- **MUST/HAVE TO**: obligación
- **SHOULD/OUGHT TO**: consejo
- **MAY/MIGHT**: posibilidad, permiso
- **WOULD**: situaciones hipotéticas

**Recuerda:** Los modal verbs nunca llevan "s" en tercera persona y no usan "to" antes del verbo principal.
                    `,
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
                            order_index: 1
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
                        }
                    ]
                }
            ],
            dependencies: []
        }
    ],

    placement_test: {
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
    }
};
