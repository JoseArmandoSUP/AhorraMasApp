import * as SQLite from "expo-sqlite";

//Abre o crea la base de datos
const db = SQLite.openDatabase("ahorraMas.db");

//Ejecuta el comando SQL dentro de la promesa
export const executeSql = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                params,
                (_, result) => resolve(result),
                (_, error) => reject(error)
            );
        });
    });


//Inicializar las tablas
export const inicializarBasedatos = async () => {
    try{
        //Activa las llaves foraneas
        await executeSql("PRAGMA foreign_keys = ON;");
        
        //Tabla de usuarios
        await executeSql(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                usuario TEXT NOT NULL UNIQUE,
                correo TEXT NOT NULL UNIQUE,
                contraseña TEXT NOT NULL,
                telefono TEXT
            );
        `);
        //Tabla de transacciones
        await executeSql(`
            CREATE TABLE IF NOT EXISTS transacciones (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tipo TEXT NOT NULL,
                categoria TEXT NOT NULL,
                monto REAL NOT NULL,
                fecha TEXT NOT NULL,
                descripcion TEXT,
                usuario_id INTEGER,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
            );
        `);
        //Tabla de presupuestos
        await executeSql(`
            CREATE TABLE IF NOT EXISTS presupuestos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                categoria TEXT NOT NULL,
                limite REAL NOT NULL,
                mes TEXT NOT NULL,
                usuario_id INTEGER,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
            );    
        `);
        
        console.log("Base de datos creada");
        return true;

    }catch(error){
        console.log("Error en inicializarBasedatos:", error);
        throw error;
    }
    
};

export {db};