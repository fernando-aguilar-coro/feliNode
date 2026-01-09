# Learning Feature

This module handles the core learning experience of the application, including lessons, exercises, and placement tests.

## Architecture

The features follows a standard React Native architecture with separation of concerns:

- **Screens**: UI views that orchestrate the user flow (e.g., `PlacementTestScreen`, `LessonScreen`).
- **Components**: Reusable UI elements for specific exercise types (`exercises/`).
- **Hooks**: Custom hooks for managing exercise logic and state (`useExercises`).
- **Services**: Data access layer that bridges the UI and the local database (`ExerciseService`).
- **Types**: TS definitions for system domain objects (`exercise.ts`).

## Directory Structure

```text
src/features/learning/
├── components/         # UI Components
│   └── exercises/      # Specific exercise type components
├── hooks/              # State logic (useExercises)
├── screens/            # Main feature screens
├── services/           # Data fetching and business logic
└── types/              # TypeScript definitions
```

## Logic & Implementation

### 1. Types (`src/features/learning/types/exercise.ts`)
We use a Discriminated Union type for `Exercise`. This allows TypeScript to infer the correct properties based on the `type` field (e.g., `options` only exists on `MULTIPLE_CHOICE`).

```typescript
export enum ExerciseType {
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    FILL_IN_THE_BLANK = 'FILL_IN_THE_BLANK',
    TRANSLATE = 'TRANSLATE',
}

export interface BaseExercise {
    id: string;
    type: ExerciseType;
    question: string;
}

export interface MultipleChoiceExercise extends BaseExercise {
    type: ExerciseType.MULTIPLE_CHOICE;
    options: string[];
    correctAnswer: string;
}
// ... (FillInTheBlankExercise, TranslateExercise)
export type Exercise = MultipleChoiceExercise | FillInTheBlankExercise | TranslateExercise;
```

### 2. State & Logic Hook (`useExercises.ts`)
The `useExercises` hook centralizes the logic for taking a test. It abstracts:
- Tracking the current question index.
- Validating answers (case-insensitive check).
- Handling "Next" navigation and "Finished" state.

It responds to data updates via `useEffect` to ensure state is synced when async data arrives from the DB.

```typescript
export const useExercises = (initialExercises: Exercise[]) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [exercises, setExercises] = useState<Exercise[]>(initialExercises);

    // Sync state when props change (e.g. async load)
    useEffect(() => {
        setExercises(initialExercises);
    }, [initialExercises]);

    const checkAnswer = (userAnswer: string) => {
        const isCorrect = userAnswer.trim().toLowerCase() === currentExercise.correctAnswer.trim().toLowerCase();
        // ... set feedback result
        return isCorrect;
    };
    // ...
}
```

### 3. Data Service (`ExerciseService.ts`)
The service layer (`ExerciseService`) is responsible for communicating with the local SQLite database (`api_local.ts`) and **mapping** the raw DB rows into our typed `Exercise` objects.

**Key Responsibility: Mapping**
The DB schema is flat (for SQL efficiency), but our app uses distinct types. The service handles this transformation:

```typescript
const mapDbExerciseToAppExercise = (dbExercise: any): Exercise | null => {
    switch (dbExercise.type) {
        case 'multiple_choice':
            return {
                type: ExerciseType.MULTIPLE_CHOICE,
                options: dbExercise.options?.map((o: any) => o.option_text) || [],
                // ...
            } as MultipleChoiceExercise;
        // ...
    }
};
```

**Key Function:**
`getExercisesForLesson` fetches data using `getExercisesByLessonId` (from `api_local`) and applies the mapping, filtering out any invalid or unknown types.

### 4. UI Library (`components/exercises`)
We use a **Strategy Pattern** via `ExerciseContainer`. The parent component doesn't need to know *how* to render a specific exercise; it just passes the data to the container.

```typescript
// ExerciseContainer.tsx
export const ExerciseContainer = ({ exercise, ... }: Props) => {
    // ...
    const renderContent = () => {
        switch (exercise.type) {
            case ExerciseType.MULTIPLE_CHOICE:
                return <MultipleChoiceExercise exercise={exercise} ... />;
            case ExerciseType.FILL_IN_THE_BLANK:
                return <FillInTheBlankExercise exercise={exercise} ... />;
            // ...
        }
    };
    // ...
};
```

## Usage Flow
1. **Screen** (`PlacementTestScreen`) calls `ExerciseService.getPlacementExercises()`.
2. **Service** fetches from SQLite and maps to `Exercise[]`.
3. **Screen** passes data to `useExercises` hook.
4. **Hook** provides `currentExercise`.
5. **Screen** renders `ExerciseContainer` with `currentExercise`.
6. **Container** picks the correct UI component (e.g., `MultipleChoiceExercise`) to display.
