import { Pool } from 'pg';

export const connection = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: Number(process.env.DB_PORT),
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

interface DbWrapper {
  read: <T>(query: string, bindings?: Array<unknown>, pool?: Pool) => Promise<T | undefined>;
  readFirst: <T>(query: string, bindings?: Array<unknown>, pool?: Pool) => Promise<T | undefined>;
  execute: <T>(query: string, bindings?: Array<unknown>, pool?: Pool) => Promise<T>;
}

export const db = {
  read: async <T>(query: string, bindings?: Array<unknown>, pool?: Pool) => {
    const conn = pool || connection;
    const result = await conn.query(query, bindings);
    return result.rows as T | undefined;
  },
  readFirst: async <T>(query: string, bindings?: Array<unknown>, pool?: Pool) => {
    const conn = pool || connection;
    const result = await conn.query(`${query} LIMIT 1`, bindings);
    return result.rows[0] as T | undefined;
  },
  execute: async <T>(query: string, bindings?: Array<unknown>, pool?: Pool) => {
    const conn = pool || connection;
    const result = await conn.query(query, bindings);
    return result.rows[0] as T;
  },
  transaction: async <T>(callback: (db: DbWrapper, pool: Pool) => Promise<T>) => {
    const conn = connection;
    try {
      await conn.query('BEGIN');
      const result = await callback(db, conn);
      await conn.query('COMMIT');
      return result;
    } catch (error) {
      await conn.query('ROLLBACK');
      throw error;
    }
  },
};
