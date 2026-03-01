import * as SQLite from 'expo-sqlite';
import { initDatabase } from '../db';

export abstract class BaseRepository {
    /**
     * Returns a promise resolving to the SQLite database instance.
     * Ensures the database is initialized before any operations.
     */
    protected get db(): Promise<SQLite.SQLiteDatabase> {
        return initDatabase();
    }
}
