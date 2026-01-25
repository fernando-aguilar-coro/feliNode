import json
from supabase import create_client, Client

# --- CONFIGURATION ---
# REPLACE THESE WITH YOUR ACTUAL SUPABASE CREDENTIALS
url: str = "https://tkandopbazibmvohvckm.supabase.co"
key: str = "sb_secret_u9KFjveTrXtgHOuyJXyTCw_iqd2AWnE"

supabase: Client = create_client(url, key)

def insert_data():
    print("Starting data insertion...")

    # 1. Define Data
    
    # Mock theory content since the original was an import
    theory_content = """
# Verbos Modales (Can, Must, Should)

Los verbos modales son verbos auxiliares que expresan posibilidad, necesidad, habilidad u obligación.

## Can (Poder/Habilidad)
Se usa para expresar habilidad o posibilidad.
Ejemplo: I can swim (Puedo nadar).

## Must (Deber/Obligación)
Se usa para expresar una obligación fuerte o necesidad.
Ejemplo: You must wear a seatbelt (Debes usar cinturón de seguridad).

## Should (Debería/Consejo)
Se usa para dar consejos o sugerencias.
Ejemplo: You should sleep more (Deberías dormir más).
    """

    lesson_id = 'lesson_modal_verbs'
    
    # 2. Insert Module
    # We create a new module for this lesson. 
    # In a real app, you might look up an existing module.
    module_data = {
        "title": "Unit 1: Grammar Essentials",
        "order_index": 1
    }
    
    print(f"Inserting module: {module_data['title']}")
    module_res = supabase.table("modules").insert(module_data).execute()
    
    if not module_res.data:
        print("Failed to insert module or no data returned.")
        return

    module_id = module_res.data[0]['id']
    print(f"Module inserted with ID: {module_id}")

    # 3. Insert Lesson
    lesson_data = {
        "id": lesson_id,
        "module_id": module_id,
        "title": 'Verbos Modales (Can, Must, Should)',
        "description": 'Aprende a expresar habilidad, obligación y consejo en inglés.',
        "status": 'available',
        "order_index": 1,
        "theory": theory_content
    }

    print(f"Inserting lesson: {lesson_data['title']}")
    # Upsert allows us to update if it exists, but usually for new data insert is fine.
    # Using upsert to be safe if running multiple times (requires distinct on conflict, usually PK)
    lesson_res = supabase.table("lessons").upsert(lesson_data).execute()
    
    if not lesson_res.data:
        print("Failed to insert lesson.")
        return
        
    print(f"Lesson inserted with ID: {lesson_data['id']}")

    # 4. Insert Exercises
    exercises = [
        {
            "type": 'multiple_choice',
            "instruction": 'Selecciona el verbo modal correcto para expresar habilidad:',
            "content": {
                "options": [
                    { "option_text": 'can', "is_correct": True },
                    { "option_text": 'must', "is_correct": False },
                    { "option_text": 'should', "is_correct": False }
                ],
                "correct_answer": 'can'
            },
            "order_index": 6
        },
        {
            "type": 'scrambled_sentence',
            "instruction": 'Ordena las palabras para formar un consejo:',
            "content": {
                "segments": ['should', 'water', 'drink', 'You'],
                "correct_answer": 'You should drink water'
            },
            "order_index": 2
        },
        {
            "type": 'translate',
            "instruction": 'Traduce al español la siguiente frase sobre obligación:',
            "content": {
                "phrase": 'I must study',
                "correct_answer": 'Yo debo estudiar'
            },
            "order_index": 3
        },
        {
            "type": 'fill_blank',
            "instruction": 'Completa la frase con el modal de habilidad :',
            "content": {
                "phrase": 'Birds ____ fly.',
                "correct_answer": 'can'
            },
            "order_index": 4
        },
        {
            "type": 'multiple_choice',
            "instruction": 'Selecciona el icono que representa una "Idea":',
            "content": {
                "options": [
                    { "option_text": 'Bulb', "is_correct": True, "icon": 'bulb-outline' },
                    { "option_text": 'Book', "is_correct": False, "icon": 'book-outline' },
                    { "option_text": 'Rocket', "is_correct": False, "icon": 'rocket-outline' }
                ],
                "correct_answer": 'Bulb'
            },
            "order_index": 5
        },
        {
            "type": 'pronunciation',
            "instruction": 'Lee en voz alta la siguiente frase:',
            "content": {
                "phrase": 'I can speak English',
                "correct_answer": 'I can speak English'
            },
            "order_index": 1
        }
    ]

    # Add lesson_id to each exercise
    for ex in exercises:
        ex['lesson_id'] = lesson_id

    print(f"Inserting {len(exercises)} exercises...")
    exercises_res = supabase.table("exercises").insert(exercises).execute()
    
    print("Exercises inserted successfully.")
    print("Done!")

def insert_tree_test_data():
    print("Starting TREE TEST data insertion...")

    # 1. Define Module
    module_data = {
        "title": "Unit Tree Test: Complex Dependencies",
        "order_index": 2
    }
    
    print(f"Inserting module: {module_data['title']}")
    module_res = supabase.table("modules").insert(module_data).execute()
    
    if not module_res.data:
        print("Failed to insert module or no data returned.")
        return

    module_id = module_res.data[0]['id']
    print(f"Module inserted with ID: {module_id}")

    # 2. Define Lessons with Embedded Dependencies
    # Structure:
    #       [Root]
    #      /      \
    #  [Branch A] [Branch B]
    #      \      /
    #    [Convergence]

    lessons_def = [
        {
            "id": "lesson_root",
            "module_id": module_id,
            "title": "Root Lesson (Start Here)",
            "description": "The beginning of the tree.",
            "status": "available", # First one is available
            "order_index": 1,
            "theory": "# Root Theory\n\nThis is the root lesson.",
            "prerequisites": [] # No parents
        },
        {
            "id": "lesson_branch_a",
            "module_id": module_id,
            "title": "Branch A",
            "description": "Left branch of the tree.",
            "status": "locked",
            "order_index": 2,
            "theory": "# Branch A Theory\n\nThis is branch A.",
            "prerequisites": ["lesson_root"] # Parent: Root
        },
        {
            "id": "lesson_branch_b",
            "module_id": module_id,
            "title": "Branch B",
            "description": "Right branch of the tree.",
            "status": "locked",
            "order_index": 3,
            "theory": "# Branch B Theory\n\nThis is branch B.",
            "prerequisites": ["lesson_root"] # Parent: Root
        },
        {
            "id": "lesson_convergence",
            "module_id": module_id,
            "title": "Convergence",
            "description": "Requires both A and B.",
            "status": "locked",
            "order_index": 4,
            "theory": "# Convergence Theory\n\nYou made it!",
            "prerequisites": ["lesson_branch_a", "lesson_branch_b"] # Parents: A, B
        }
    ]

    # Prepare lesson objects for insertion (exclude 'prerequisites' key if strict schema, 
    # but supabase-py might ignore extra keys. Better to be clean.)
    lessons_to_insert = []
    dependencies_to_insert = []

    for l in lessons_def:
        # Create a copy for insertion without the 'prerequisites' key
        l_copy = l.copy()
        prereqs = l_copy.pop('prerequisites')
        lessons_to_insert.append(l_copy)

        # Build dependencies list
        for p_id in prereqs:
            dependencies_to_insert.append({
                "lesson_id": l['id'],
                "prerequisite_id": p_id
            })

    print(f"Inserting {len(lessons_to_insert)} lessons...")
    supabase.table("lessons").upsert(lessons_to_insert).execute()

    # 3. Insert Dependencies
    print(f"Inserting {len(dependencies_to_insert)} dependencies...")
    if dependencies_to_insert:
        supabase.table("lesson_dependencies").upsert(dependencies_to_insert).execute()

    # 4. Insert Dummy Exercises
    exercises = []
    
    for lesson in lessons_to_insert:
        # Add one simple exercise per lesson
        exercises.append({
            "lesson_id": lesson['id'],
            "type": "multiple_choice",
            "instruction": f"Pass {lesson['title']}?",
            "content": {
                "options": [
                    { "option_text": "Yes", "is_correct": True },
                    { "option_text": "No", "is_correct": False }
                ],
                "correct_answer": "Yes"
            },
            "order_index": 1
        })

    print(f"Inserting {len(exercises)} dummy exercises...")
    supabase.table("exercises").insert(exercises).execute()

    print("TREE TEST data inserted successfully.")

if __name__ == "__main__":
    insert_data()
    insert_tree_test_data()
