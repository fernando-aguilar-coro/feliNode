import * as SQLite from 'expo-sqlite';
import { DB_NAME } from './config';

export const initDatabase = async () => {
  const db = await SQLite.openDatabaseAsync(DB_NAME);

  // Set journal mode to WAL for better performance
  await db.execAsync('PRAGMA journal_mode = WAL');
  await db.execAsync('PRAGMA foreign_keys = ON');

  // Schema definition
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      order_index INTEGER
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      module_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      theory TEXT, -- Markdown content
      status TEXT DEFAULT 'locked',
      order_index INTEGER,
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
  `);

  console.log('Database initialized successfully');
  return db;
};
