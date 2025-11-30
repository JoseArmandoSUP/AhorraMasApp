import * as SQLite from "expo-sqlite";

let db;
let initializing = false;
let initPromise = null;

export async function initDB() {
  // Si ya se está inicializando, esperar a que termine
  if (initializing && initPromise) {
    return initPromise;
  }

  // Si ya está inicializada, retornar la BD existente
  if (db) {
    return db;
  }

  initializing = true;
  initPromise = (async () => {
    try {
      // Abrir o crear la base de datos
      db = await SQLite.openDatabaseAsync("ahorramas_v1.db");
      
      if (!db) {
        throw new Error("No se pudo abrir la base de datos");
      }

      // Esperar un momento para asegurar que la BD esté lista
      await new Promise(resolve => setTimeout(resolve, 100));

      // Crear tabla de usuarios usando runAsync
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          usuario TEXT,
          edad INTEGER,
          correo TEXT UNIQUE,
          telefono TEXT,
          password TEXT
        )
      `);

      // Crear tabla de transacciones (sin usuario_id primero)
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS transacciones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tipo TEXT NOT NULL,
          categoria TEXT NOT NULL,
          monto REAL NOT NULL,
          fecha TEXT NOT NULL,
          descripcion TEXT
        )
      `);

      // Verificar si existe la columna usuario_id
      let columnaExiste = false;
      try {
        await db.getFirstAsync("SELECT usuario_id FROM transacciones LIMIT 1");
        columnaExiste = true;
        console.log("Columna usuario_id ya existe en transacciones");
      } catch (e) {
        // La columna no existe, intentar agregarla
        try {
          await db.runAsync(`ALTER TABLE transacciones ADD COLUMN usuario_id INTEGER`);
          console.log("Columna usuario_id agregada a transacciones");
        } catch (alterError) {
          // Si falla, puede ser que la columna ya exista o la tabla esté vacía
          console.log("Info: No se pudo agregar columna usuario_id (puede que ya exista):", alterError.message);
        }
      }

      // Crear tabla de presupuestos
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS presupuestos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          categoria TEXT NOT NULL,
          monto REAL NOT NULL,
          fecha TEXT NOT NULL
        )
      `);

      // Verificar si existe la columna usuario_id en presupuestos
      try {
        await db.getFirstAsync("SELECT usuario_id FROM presupuestos LIMIT 1");
        console.log("Columna usuario_id ya existe en presupuestos");
      } catch (e) {
        try {
          await db.runAsync(`ALTER TABLE presupuestos ADD COLUMN usuario_id INTEGER`);
          console.log("Columna usuario_id agregada a presupuestos");
        } catch (alterError) {
          console.log("Info: No se pudo agregar columna usuario_id en presupuestos:", alterError.message);
        }
      }

      console.log("Base de datos lista");
      initializing = false;
      return db;
    } catch (error) {
      console.error("Error crítico en initDB:", error);
      initializing = false;
      initPromise = null;
      throw error;
    }
  })();

  return initPromise;
}

export function getDB() {
  return db;
}
