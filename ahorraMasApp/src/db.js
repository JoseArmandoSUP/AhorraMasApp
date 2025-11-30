import * as SQLite from "expo-sqlite";



let db;

export async function initDB() {
  db = await SQLite.openDatabaseAsync("ahorramas_v1.db");

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS transacciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,
      categoria TEXT NOT NULL,
      monto REAL NOT NULL,
      fecha TEXT NOT NULL,
      descripcion TEXT
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      usuario TEXT,
      edad INTEGER,
      correo TEXT UNIQUE,
      telefono TEXT,
      password TEXT
    );
  `);

  console.log("Base de datos lista");
}

export function getDB() {
  return db;
}
