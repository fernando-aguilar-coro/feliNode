# Guía de Refactorización y Creación de Ejercicios - FeliNode

Este documento sirve como base para replicar el estilo de redacción de ejercicios en los exámenes de nivelación (Placement Tests). El objetivo es crear ejercicios desafiantes, claros y sin ambigüedades, evitando pistas innecesarias que "regalen" la respuesta.

## Principios de Redacción

1. **Eliminar Ambigüedad Semántica**:
   - En ejercicios de preposiciones o vocabulario, si una frase admite varias respuestas correctas (ej: "The cat is ___ the table"), se debe añadir una aclaración en la instrucción que especifique el significado deseado (ej: "que significa 'debajo de'").
   - En selecciones múltiples como saludos, especificar qué tipo de saludo se busca (ej: "Selecciona la forma correcta de decir 'Hola'").

2. **Instrucciones Naturales, no Teóricas**:
   - Evitar etiquetas puramente gramaticales como "Segundo Condicional" o "Reported Speech" de forma aislada.
   - En su lugar, describir la **función comunicativa** (ej: "Completa la oración asumiendo una situación hipotética o imaginaria" o "Relata lo que alguien más dijo previamente").

3. **Sin Pistas Técnicas (Giveaways)**:
   - No indicar con qué palabra debe empezar una oración desordenada (ej. No usar "iniciando con la palabra 'Did'").
   - No dar instrucciones sobre el formato técnico de la respuesta (ej. No decir "sin usar contracciones")
4. **Nivel de Dificultad Adecuado**:
   - **Básico (A1-A2)**: Instrucciones claras en español que definan bien el contexto.
   - **Intermedio (B1-B2)**: Fomentar que el usuario identifique el tiempo verbal correcto basándose en adverbios de tiempo (ej: "yesterday", "since", "already").
   - **Avanzado (C1-C2)**: Instrucciones minimalistas. El usuario debe deducir la estructura compleja (subjuntivos, inversiones, participle clauses) por el contexto de la frase.

## Ejemplos de Refactorización

| Tipo | Antes (Ambiguo/Con Pistas) | Después (Correcto/Desafiante) |
| :--- | :--- | :--- |
| **MCQ** | "Select the correct greeting." | "Selecciona la forma correcta de decir 'Hola'." |
| **Fill Blank** | "The cat is ___ the table." | "Completa con la preposición que significa 'debajo de'." |
| **Scrambled** | "Forma una pregunta (empieza por Did)." | "Ordena las palabras para formar una pregunta en pasado simple." |
| **Translate** | "Traduce a voz pasiva." | "Traduce la siguiente frase al inglés usando la voz pasiva." |
| **Advanced** | "Completa (Third Conditional)." | "Completa asumiendo una consecuencia presente de una acción pasada." |

## Estructura JSON/Objeto
Siempre mantener la consistencia con el esquema de `SeedLesson`:
```typescript
{
    type: 'tipo_de_ejercicio', // multiple_choice, fill_blank, translate, scrambled_sentence, select_pairs
    instruction: 'Instrucción siguiendo los principios de arriba',
    content: {
        // ... campos específicos del tipo
        unlocks_lesson_id: 'ID_DE_LA_LECCION_RELACIONADA'
    },
    order_index: X
}
```
