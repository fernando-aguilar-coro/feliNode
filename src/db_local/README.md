# Database Module (Local SQLite)

This module manages local data persistence using `expo-sqlite`.

## Nodes Feature: Lesson Tree Structure

The purpose of the "nodes" feature is to organize lessons into a hierarchical tree/graph structure where completing one lesson unlocks specific subsequent lessons.

### Responsibilities
- Provide a data structure representing the lesson dependency graph.
- **Strictly Data Only**: The API layer (`api_local.ts`) returns raw data objects (interfaces), NOT UI components.

### Proposed Schema Change

Update the `lessons` table to include a `children` field. This field will store the IDs of the lessons that are "unlocked" or "extensions" of the current lesson.

```sql
ALTER TABLE lessons ADD COLUMN children TEXT DEFAULT '[]'; -- JSON Array of Lesson IDs
```

### Proposed Data Interface

The API will return objects matching this interface:

```typescript
interface LessonNode {
  id: string;
  title: string;
  status: 'locked' | 'available' | 'completed';
  children: string[]; // Array of Lesson IDs that are children of this node
  position?: { x: number, y: number }; // Optional: for UI layout if needed
}
```

### Required API Changes (`api_local.ts`)

1. **`getLessonNodes()`**: 
   - Fetches lessons.
   - Parses the `children` JSON string into an array.
   - Computes status based on `user_progress` and the dependency graph (e.g., if parent is completed, children become available).
