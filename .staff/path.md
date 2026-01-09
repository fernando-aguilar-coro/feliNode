# Ruta de Desarrollo Proyecto Felinode

Esta es una guía paso a paso basada en las mejores prácticas para apps de aprendizaje de idiomas.

## 1. Configuración Inicial (Base)
- [ ] **Configuración de Base de Datos**: Asegurar que SQLite esté listo para guardar progreso.
- [ ] **Estructura de Navegación**: Definir `MainNavigator` con rutas para Auth, Exam, y Home.

## 2. Examen de Nivelación (Exam Initial)
El primer punto de entrada lógico para un usuario nuevo.
- [ ] **Diseñar `ExamInitialScreen`**: Pantalla de bienvenida al examen.
- [ ] **Lógica de Preguntas**: Implementar un set básico de preguntas progresivas (fácil -> difícil).
- [ ] **Algoritmo de Nivelación**: Determinar el nivel inicial (ej. A1, A2) basado en respuestas correctas.
- [ ] **Guardar Resultado**: Persistir el nivel del usuario en la base de datos/store.

## 3. Componentes de Ejercicios (Exercises)
Bloques fundamentales para las lecciones.
- [ ] **Componente Genérico de Ejercicio**: Un contenedor que maneje el estado (correcto/incorrecto).
- [ ] **Exercise: Multiple Choice**: Selección múltiple (texto e imágenes).
- [ ] **Exercise: Fill in the Blank**: Completar oraciones.
- [ ] **Exercise: Listening**: Reproducir audio y seleccionar respuesta (si aplica).
- [ ] **Exercise: Speaking/Pronunciation**: (Opcional para fase avanzada).

## 4. Flujo de Lecciones (Lesson Flow)
Integrar los ejercicios en una experiencia de usuario.
- [ ] **Lesson Screen**: Pantalla que carga una serie de ejercicios.
- [ ] **Barra de Progreso**: Visualizar avance en la lección actual.
- [ ] **Validación en Tiempo Real**: Feedback inmediato (sonidos/colores) al responder.
- [ ] **Pantalla de Resumen**: Mostrar XP ganado y precisión al finalizar.

## 5. Gamificación y Progreso
- [ ] **Sistema de Vidas/Corazones**: Restar vidas por errores.
- [ ] **Árbol de Lecciones (Path)**: Bloquear/Desbloquear niveles según progreso.
- [ ] **Racha (Streak)**: Tracking de días consecutivos.
