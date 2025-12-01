import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

class TransaccionService{
    constructor(){
        this.db = null;
        this.storageKey = "transacciones";
    }

    async initialize(){
        if(Platform.OS === "web"){
            console.log("Usando LocalStorage para transacciones (web)");
        }else{
            this.db = await SQLite.openDatabaseAsync("ahorraMasTransacciones.db");

            await this.db.execAsync(`
                CREATE TABLE IF NOT EXISTS transacciones(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    tipo TEXT NOT NULL,
                    categoria TEXT NOT NULL,
                    monto REAL NOT NULL,
                    descripcion TEXT,
                    fecha TEXT NOT NULL  
                );    
            `);
        }
    }

    async add(tipo, categoria, monto, descripcion){
        {/*const fecha = new Date().toISOString().split("T")[0]; // <-- Para el formato AÑO-MES-DIA*/}

        const result = await this.db.runAsync(
            `INSERT INTO transacciones (tipo, categoria, monto, descripcion, fecha)
            VALUES (?,?,?,?, datetime('now'))`,
            [tipo, categoria, monto, descripcion]
        );

        return{
            id: result.lastInsertRowId,
            tipo,
            categoria,
            monto,
            descripcion,
            fecha: new Date().toISOString()
        };
    }

    async getAll(){
        if(Platform.OS == "web"){
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        }else{
            return await this.db.getAllAsync("SELECT * FROM transacciones ORDER BY fecha DESC");
        }
    }

    async filter(fecha, categoria, tipo){
        let sql = "SELECT * FROM transacciones WHERE 1=1";
        const params = [];

        if(fecha){
            sql += " AND fecha LIKE ?";
            params.push(fecha + "%");
        }

        if(categoria){
            sql += " AND categoria LIKE ?";
            params.push("%" + categoria + "%");
        }

        if(tipo){
            sql += " AND tipo = ?";
            params.push(tipo);
        }

        sql += " ORDER BY fecha DESC";
        return await this.db.getAllAsync(sql, params);
    }

    async remove(id){
        await this.db.runAsync("DELETE FROM transacciones WHERE id = ?", [id]);
    }

    async update(id, tipo, categoria, monto, descripcion, fecha){
        await this.db.runAsync(
            `UPDATE transacciones
            SET tipo=?, categoria=?, monto=?, descripcion=?, fecha=?
            WHERE id=?`,
            [tipo, categoria, monto, descripcion, fecha, id]
        );
    }
}

export default new TransaccionService();