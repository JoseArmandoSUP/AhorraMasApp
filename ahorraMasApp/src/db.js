import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('ahorramas.db');

export function initDB() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY NOT NULL,
          nombre TEXT,
          email TEXT UNIQUE NOT NULL,
          passwordHash TEXT NOT NULL,
          salt TEXT NOT NULL,
          recoveryCode TEXT
        );`,
        [],
        () => resolve(),
        (_, err) => {
          console.log('Error creando tabla users', err);
          reject(err);
        }
      );
    });
  });
}

export default db;