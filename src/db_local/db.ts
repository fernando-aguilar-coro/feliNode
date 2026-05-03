import * as SQLite from 'expo-sqlite';
import { DB_NAME } from './config';

let dbInstance: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const initDatabase = async () => {
  if (dbInstance) return dbInstance;

  if (!initPromise) {
    initPromise = (async () => {
      try {
        const db = await SQLite.openDatabaseAsync(DB_NAME);

        // Set journal mode to WAL for better performance
        await db.execAsync('PRAGMA journal_mode = WAL');
        await db.execAsync('PRAGMA foreign_keys = ON');

        // Schema definition
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS modules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            order_index INTEGER,
            language_code TEXT DEFAULT 'es'
          );

          CREATE TABLE IF NOT EXISTS module_dependencies (
            module_id INTEGER,
            prerequisite_id INTEGER,
            FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
            FOREIGN KEY (prerequisite_id) REFERENCES modules(id) ON DELETE CASCADE,
            PRIMARY KEY (module_id, prerequisite_id)
          );

          CREATE TABLE IF NOT EXISTS lessons (
            id TEXT PRIMARY KEY,
            module_id INTEGER,
            title TEXT NOT NULL,
            description TEXT,
            theory TEXT, -- Markdown content
            status TEXT DEFAULT 'available',
            order_index INTEGER,
            youtube_id TEXT,
            updated_at TEXT,
            FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
          );

          CREATE TABLE IF NOT EXISTS lesson_dependencies (
            lesson_id TEXT,
            prerequisite_id TEXT,
            FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
            FOREIGN KEY (prerequisite_id) REFERENCES lessons(id) ON DELETE CASCADE,
            PRIMARY KEY (lesson_id, prerequisite_id)
          );

          CREATE TABLE IF NOT EXISTS exercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lesson_id TEXT,
            type TEXT,
            instruction TEXT,
            content TEXT, -- JSON String: containing options, correct_answer, sentence, etc.
            order_index INTEGER,
            FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
          );

          CREATE TABLE IF NOT EXISTS user_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lessons_completed TEXT DEFAULT '[]', -- JSON Array of completed lesson IDs
            is_synced BOOLEAN DEFAULT 0,
            updated_at TEXT
          );

          CREATE TABLE IF NOT EXISTS infinity_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            target_id TEXT UNIQUE, -- lessonId OR topic name
            max_score INTEGER DEFAULT 0,
            updated_at TEXT
          );

          CREATE TABLE IF NOT EXISTS user_streaks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            current_streak INTEGER DEFAULT 0,
            highest_streak INTEGER DEFAULT 0,
            last_active_date TEXT, -- YYYY-MM-DD
            history TEXT DEFAULT '[]', -- JSON array of YYYY-MM-DD strings
            freezes_available INTEGER DEFAULT 2,
            freezes_used INTEGER DEFAULT 0,
            updated_at TEXT
          );
          
          CREATE TABLE IF NOT EXISTS user_currencies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            xp INTEGER DEFAULT 0,
            michi_coins INTEGER DEFAULT 0,
            inventory TEXT DEFAULT '{}',
            updated_at TEXT
          );

          CREATE TABLE IF NOT EXISTS xp_history (
            id TEXT PRIMARY KEY, 
            xp_amount INTEGER NOT NULL,
            earned_at TEXT NOT NULL,
            is_synced BOOLEAN DEFAULT 0
          );
        `);

        // Migration: Add inventory column if it doesn't exist in older databases
        try {
          await db.execAsync("ALTER TABLE user_currencies ADD COLUMN inventory TEXT DEFAULT '{}';");
        } catch (e) {}

        // Migration: Add language_code to modules
        try {
          await db.execAsync("ALTER TABLE modules ADD COLUMN language_code TEXT DEFAULT 'es';");
        } catch (e) {}

        // Migration: Add youtube_id to lessons
        try {
          await db.execAsync("ALTER TABLE lessons ADD COLUMN youtube_id TEXT;");
        } catch (e) {}

        // Migration: Add updated_at to lessons
        try {
          await db.execAsync("ALTER TABLE lessons ADD COLUMN updated_at TEXT;");
        } catch (e) {}

        dbInstance = db;
        return db;
      } catch (error) {
        initPromise = null;
        throw error;
      }
    })();
  }

  return initPromise;
};

export const clearContentDatabase = async () => {
    const db = await initDatabase();
    await db.execAsync(`
        DELETE FROM exercises;
        DELETE FROM lesson_dependencies;
        DELETE FROM lessons;
        DELETE FROM module_dependencies;
        DELETE FROM modules;
    `);
    console.log('[DB] Course content wiped locally.');
};
