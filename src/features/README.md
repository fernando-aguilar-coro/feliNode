# Features Directory

This directory contains the core business logic of the application, organized by feature.

## Structure of a Feature
Each feature folder (e.g., `nodes`) should follow this internal structure:

- **`components/`**: UI components only used within this feature.
- **`screens/`**: Full screen components registered in the navigation.
- **`hooks/`**: Custom hooks for feature logic (state management).
- **`services/`**: API calls and data fetching specific to this feature.
- **`types/`**: TypeScript interfaces and types for this feature.
- **`index.ts`**: The public API of the feature. Only export what other features need.

## Current Features
- **`auth`**: Authentication (Login, Register).
- **`audio`**: Management of offline audio assets.
- **`gamification`**: "Feli" interactions, progress tracking.
- **`lesson`**: Educational content delivery (Theory & Practice).
- **`nodes`**: The Skill Tree / Graph visualization and logic.
- **`onboarding`**: Initial assessment flow.
