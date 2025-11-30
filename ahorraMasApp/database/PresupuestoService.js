import {Platform} from "react-native";
import * as SQLite from "expo-sqlite";

class PresupuestoService{

    constructor(){
        this.db = null;
        this.storageKey = "presupuestos";
    }

    async initialize(){
        if(Platform.OS === "web"){
            console.log("Usando web para presupuestos");
        }else{
            this.db = await SQLite.openDatabaseAsync("ahorraMasPresupuestos.db");
            await this.db.execAsync(`
                CREATE TABLE IF NOT EXISTS presupuestos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    categoria TEXT NOT NULL,
                    montolimite REAL NOT NULL,
                    mes INTEGER NOT NULL,
                    anio INTEGER NOT NULL,
                    creadoEn TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
            `);
        }
    }

    async add(categoria, montolimite, mes, anio){
        if(Platform.OS === "web"){
            const data = JSON.parse(localStorage.getItem(this.storageKey) || "[]");
            const nuevo = {
                id: Date.now(),
                categoria,
                montolimite,
                mes,
                anio,
                creadoEn: new Date().toISOString()
            };
            data.push(nuevo);
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return nuevo;
        }
        const result = await this.db.runAsync(
            `INSERT INTO presupuestos (categoria, montolimite, mes, anio, creadoEn)
            VALUES (?,?,?,?, datetime('now'))`,
            [categoria, montolimite, mes, anio]
        );
        return{
            id: result.lastInsertRowId,
            categoria,
            montolimite,
            mes,
            anio,
            creadoEn: new Date().toISOString()
        };
    }

    async getAll(){
        if(Platform.OS === "web"){
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        }

        return await this.db.getAllAsync("SELECT * FROM presupuestos ORDER BY anio DESC, mes DESC");
    }

    async remove(id){
        if(Platform.OS === "web"){
            const data = JSON.parse(localStorage.getItem(this.storageKey) || "[]");
            const nueva = data.filter(p => p.id !== id);
            localStorage.setItem(this.storageKey, JSON.stringify(nueva));
            return;
        }

        await this.db.runAsync("DELETE FROM presupuestos WHERE id = ?", [id]);
    }

    async update(id, categoria, montolimite, mes, anio){
        if(Platform.OS === "web"){
            const data = JSON.parse(localStorage.getItem(this.storageKey) || "[]");
            const idx = data.findIndex(p=>p.id === id);
            if(idx !== -1){
                data[idx] = { ...data[idx], categoria, montolimite, mes, anio};
                localStorage.setItem(this.storageKey, JSON.stringify(data));
            }
            return;
        }
        
        await this.db.runAsync(
            `UPDATE presupuestos
            SET categoria=?, montolimite=?, mes=?, anio=?
            WHERE id=?`,
            [categoria, montolimite, mes, anio, id]
        );  
    }
}

export default new PresupuestoService;