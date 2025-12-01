import {Platform} from "react-native";
import * as SQLite from "expo-sqlite";

class UsuarioService{
    constructor(){
        this.db = null;
        this.storageKey = "usuarios";
    }

    async initialize(){
        if(Platform.OS === "web"){
            console.log("Usando LocalStorage para Usuarios");
        }else{
            console.log("Usando SQLite (Usuarios)");
            this.db = await SQLite.openDatabaseAsync("ahorraMas.db");

            await this.db.execAsync(`
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre TEXT NOT NULL,
                    usuario TEXT NOT NULL,
                    edad INTEGER,
                    correo TEXT UNIQUE NOT NULL,
                    telefono TEXT,
                    password TEXT NOT NULL,
                    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            `);
        }
    }

    async getAll(){
        if(Platform.OS === "web"){
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        }else{
            return await this.db.getAllAsync("SELECT * FROM usuarios ORDER BY id DESC");
        }
    }

    async getByCorreo(correo){
        if(Platform.OS === "web"){
            const data = await this.getAll();
            return data.find(u => u.correo === correo) || null;
        }else{
            const res = await this.db.getAllAsync(
                "SELECT * FROM usuarios WHERE correo = ?",
                [correo]
            );
            return res.length > 0 ? res[0] : null;
        }
    }

    async add(nombre, usuario, edad, correo, telefono, password){
        if(Platform.OS === "web"){
            const usuarios = await this.getAll();

            const nuevo = {
                id: Dete.now(),
                nombre, 
                usuario,
                edad,
                correo,
                telefono,
                password,
                fecha_creacion: new Date().toString()
            };

            usuarios.push(nuevo);
            localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
            return nuevo;
        }else{
            const result = await this.db.runAsync(
                "INSERT INTO usuarios(nombre, usuario, edad, correo, telefono, password) VALUES(?,?,?,?,?,?)",
                [nombre, usuario, edad, correo, telefono, password]
            );

            return{
                id: result.lastInsertRowId,
                nombre, 
                usuario,
                edad,
                correo,
                telefono,
                password,
                fecha_creacion: new Date().toString()
            };
        }
    }

    async updatePassword(id, nuevaPass) {
        await this.db.runAsync(
            "UPDATE usuarios SET password=? WHERE id=?",
            [nuevaPass, id]
        );
    }

}

export default new UsuarioService();