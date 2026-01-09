# Database Module (Local SQLite)

This module manages local data persistence using `expo-sqlite`.

## Current Schema (Normalized)

Currently, the database uses a normalized relational structure:
- `modules` -> `lessons` -> `exercises`
- Specific exercise details are stored in separate tables:
  - `exercise_fill_blanks`
  - `exercise_options` (for multiple choice)

### Issues with Current Approach
1. **Complexity**: Fetching a single lesson requires multiple Joins or sequential queries (N+1 problem) to reassemble the data.
2. **Maintenance**: Adding a new exercise type requires creating new tables and updating the migration scripts and query logic.
3. **Performance**: Multiple queries to render a single screen can be slow on older devices.

## Recommended Optimization: JSON Storage (Single Table)

For a mobile app like Felinode, where the data is read-heavy and often consumed as complete objects (e.g., loading an entire lesson), a **Denormalized** approach is superior.

### Proposed Schema

Replace `exercise_fill_blanks`, `exercise_options`, etc., with a single `exercises` table containing a `content` column.

```sql
CREATE TABLE exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id TEXT,
    type TEXT,         -- 'multiple_choice', 'fill_blanks', etc.
    instruction TEXT,  -- Common field
    content TEXT,      -- JSON STRING containing all specific details
    order_index INTEGER,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);
```

### JSON Content Examples

**Multiple Choice:**
```json
{
  "options": ["Cat", "Dog", "Bird"],
  "correctAnswer": "Cat",
  "explanation": "Cat is the correct translation."
}
```

**Fill in the Blank:**
```json
{
  "sentence": "The sky is ___ blue",
  "correctAnswer": "very",
  "hint": "Adverb"
}
```

### Benefits
1. **Simplicity**: One query `SELECT * FROM exercises WHERE lesson_id = ?` returns everything needed for the UI.
2. **Flexibility**:  Adding a new exercise type only requires changing the frontend code and the JSON structure; no database schema migration is needed.
3. **Performance**: Faster reads and less overhead.

## Migration Plan (If approved)
1. Delete `exercise_*` specific tables.
2. Update `exercises` table to include `content` TEXT.
3. Update `seedDatabase` to insert JSON strings.
4. Update `ExerciseService.ts` to parse `JSON.parse(row.content)` instead of mapping separate tables.
