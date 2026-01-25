# Supabase Seeding Guide: Modules, Lessons & Exercises

This guide explains how to add content to the FeliNode system via Supabase. It covers the structure required for modules, lessons, exercises, and dependencies.

## 1. Modules
Modules are the top-level containers for lessons.

| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | `text` | Display title (e.g., "Unit 1: Grammar"). |
| `order_index` | `int` | Position in the list. |

## 2. Lessons
Lessons contain theoretical content and a set of exercises.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `text` | Unique slug (e.g., `lesson_modal_verbs`). |
| `module_id` | `fk` | Reference to a module ID. |
| `title` | `text` | Display title. |
| `description` | `text` | Short summary. |
| `theory` | `text` | Markdown content for the theory section. |
| `status` | `text` | Initial state: `available` or `locked`. |
| `order_index` | `int` | Position within the module tree. |

## 3. Exercises
Each lesson should have multiple exercises. The `content` field is a JSON object.

### Exercise Types & Content Structure
| Type | Example Instruction | Content JSON Structure |
| :--- | :--- | :--- |
| `multiple_choice` | "Select the icon..." | `{"options": [{"text": "A", "is_correct": true}, ...], "correct_answer": "A"}` |
| `scrambled_sentence` | "Order the words..." | `{"segments": ["Word1", "Word2"], "correct_answer": "Word1 Word2"}` |
| `translate` | "Translate to..." | `{"phrase": "Hello", "correct_answer": "Hola"}` |
| `fill_blank` | "Complete the..." | `{"phrase": "Birds ____ fly.", "correct_answer": "can"}` |
| `pronunciation` | "Read aloud..." | `{"phrase": "I can swim", "correct_answer": "I can swim"}` |

## 4. Dependencies (Tree Connections)
Stored in the `lesson_dependencies` table to create the "Tree" graph.

- **`lesson_id`**: The lesson that is locked.
- **`prerequisite_id`**: The lesson that must be completed first.

*Note: For complex trees (DAGs), a lesson can have multiple prerequisites.*

## 5. Scripting Pattern (Python Example)
Use the following pattern (as seen in `test_save_lessons.py`) for clean insertion.

```python
# 1. DEFINE DATA
lessons_def = [{
    "id": "my_lesson",
    "module_id": mod_id,
    "title": "...",
    "prerequisites": ["another_lesson"],
    "exercises": [...] # Add exercises here to iterate later
}]

# 2. PROCESSING
for l in lessons_def:
    # Separate core lesson, prereqs, and exercises
    l_data = l.copy()
    prereqs = l_data.pop('prerequisites')
    exercises = l_data.pop('exercises')
    
    # 3. INSERTION ORDER
    # A. Insert Lesson
    supabase.table("lessons").upsert(l_data).execute()
    
    # B. Insert Prereqs
    for p in prereqs:
        supabase.table("lesson_dependencies").upsert({"lesson_id": l['id'], "prerequisite_id": p}).execute()
        
    # C. Insert Exercises
    for ex in exercises:
        ex['lesson_id'] = l['id']
        supabase.table("exercises").insert(ex).execute()
```

## UI & Tree View Details
- Lessons with **no prerequisites** are "Root" nodes.
- Placement tests should have IDs starting with `placement_test_` to be hidden from the tree view.
- The `status` field in `lessons` table determines if a first-time user sees the node as unlocked.
