# Arquitectura del Proyecto Felinode

Este documento describe la arquitectura de software, la estructura de directorios y los patrones de diseño adoptados para el desarrollo de Felinode.

## 1. Filosofía de Arquitectura: Feature-Based

Adoptamos una **Arquitectura orientada a Features (Funcionalidades)**. En lugar de agrupar archivos por tipo (todas las pantallas en `screens/`, todos los componentes en `components/`), agrupamos por **dominio de negocio**.

### ¿Por qué?
- **Escalabilidad**: Nuevas features (ej. "Modo Examen") se añaden como carpetas aisladas sin "contaminar" el resto de la app.
- **Mantenibilidad**: Todo lo relacionado con "Nodos" está en un solo lugar.
- **Colaboración**: Reduce conflictos de merge al trabajar en features distintas.

## 2. Estructura de Carpetas (`src/`)

### Core (`src/`)
Directorios transversales que dan soporte a toda la aplicación.

- **`assets/`**: Recursos estáticos globales (fuentes, imágenes base).
- **`components/`**: **UI Kit Global**. Componentes puramente presentacionales y reutilizables (Botones, Inputs, Cards). Siguen principios de *Atomic Design*.
- **`config/`**: Variables de entorno, configuración de librerías (Firebase, Gemini, etc.).
- **`hooks/`**: Custom Hooks globales (ej. `useConnectivity`, `useTheme`).
- **`navigation/`**: Configuración de rutas y navegadores (React Navigation).
- **`services/`**: Clientes de API globales, configuración de Axios/Fetch, Loggers.
- **`store/`**: Gestión de estado global (Zustand/Redux/Context) para datos que persisten entre features (ej. Sesión de usuario).
- **`theme/`**: **Sistema de Diseño**. Definiciones de colores, tipografía, espaciado. Fundamental para el look "Premium".
- **`types/`**: Definiciones TypeScript globales (Interfaces de Usuario, Respuestas de API genéricas).
- **`utils/`**: Funciones puras de ayuda (formateo de fechas, validaciones regex).

### Features (`src/features/`)
El corazón de la lógica de negocio. Cada carpeta aquí representa un módulo funcional.

#### Estructura Interna de una Feature
Cada feature (ej. `src/features/nodes`) debe seguir esta estructura interna:

- **`components/`**: Componentes UI específicos de esta feature (no se usan fuera).
- **`screens/`**: Pantallas completas (Page views) que se montan en el navegador.
- **`hooks/`**: Lógica de estado compleja extraída de los componentes.
- **`services/`**: Llamadas a API específicas de este dominio.
- **`types/`**: Tipos TS exclusivos de la feature.
- **`index.ts`**: **Public API**. Único punto de entrada para exportar lo que otras partes de la app pueden usar.

#### Features Principales
- **`auth`**: Login, Registro, Recuperación de contraseña.
- **`audio`**: Sistema de descarga, caché y reproducción de "Inteligencia Artesanal".
- **`gamification`**: Lógica de la mascota "Feli", rachas, logros.
- **`lesson`**: El motor de la clase (Teoría + Práctica).
- **`nodes`**: Lógica del Grafo (Skill Tree), dependencias entre nodos, visualización de la "Nebulosa".
- **`onboarding`**: Test de diagnóstico inicial (Smart Diagnostic).

## 3. Patrones y Decisiones Técnicas

### Gestión de Estado
- **Estado Local**: `useState` para interactividad simple UI.
- **Estado de Feature**: Context API o Hooks para compartir datos dentro de una feature.
- **Estado Global**: (Por definir: Zustand recomendado) para Sesión, Progreso del Árbol y Configuraciones.

### Estilos y UI
- **Design Tokens**: Todo color o medida debe venir de `src/theme`. Prohibido hardcodear valores hex o pixeles "mágicos".
- **Estética**: Prioridad en degradados, micro-interacciones y feedback háptico.


### IA y Backend
- La comunicación con Gemini 1.5 Flash se hace a través de `src/services/ai` (o feature específica) para mantener las *keys* seguras y centralizar la lógica de prompts.

## 4. Ejemplo Práctico: Implementando "Writing Exercise"

Para entender cómo se conectan los componentes, veamos el ejemplo de `src/features/lesson`.

### Flujo de Dependencias (De abajo hacia arriba)
 
1.  **Fundamentos (Theme)**: Se definen colores y espaciados en `src/theme`.
    *   `src/theme/colors.ts`: Define `primary: '#6C63FF'`.

2.  **UI Kit Global (Core Components)**: Componentes tontos que usan el theme.
    *   `src/components/Button.tsx`: Importa `theme` y renderiza un botón genérico. **No sabe qué es una lección.**

3.  **Lógica de Negocio (Feature Hooks)**:
    *   `src/features/lesson/hooks/useLesson.ts`: Maneja el estado (`userAnswer`, `checkAnswer`). **Sin UI.**

4.  **Componentes de Feature (Feature UI)**:
    *   `src/features/lesson/components/WritingExercise.tsx`:
        *   Importa `Button` y `TextInput` de `src/components`.
        *   Recibe props de lógica (`onSubmit`, `feedback`).
        *   Conecta la UI genérica con la lógica específica.

5.  **Pantalla (Feature Screen)**:
    *   `src/features/lesson/screens/LessonScreen.tsx`:
        *   Usa el hook `useLesson`.
        *   Renderiza `WritingExercise` pasándole los datos del hook.
        *   Esta es la "página" que ve el usuario.
