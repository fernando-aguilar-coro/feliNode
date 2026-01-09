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
      status TEXT DEFAULT 'locked',
      order_index INTEGER,
      children TEXT DEFAULT '[]', -- JSON Array of Lesson IDs
      FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS lesson_theory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id TEXT,
      content TEXT, -- JSON String
      order_index INTEGER,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
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
      is_synced BOOLEAN DEFAULT 0
    );
  `);

  console.log('Database initialized successfully');
  return db;
};
