import { Platform } from "react-native";
import TransaccionService from "../database/TransaccionService";
import {Transaccion} from "../models/Transaccion";

export class TransaccionController{
    constructor(){
        this.initialized = false;
        this.listeners = [];
    }

    async initialize(){
        if(this.initialized){
            return;
        }
        await TransaccionService.initialize();
        this.initialized = true;
    }

    async agregar(tipo, categoria, monto, descripcion){
        Transaccion.validarP(tipo, categoria, monto);

        const t = await TransaccionService.add(tipo, categoria, monto, descripcion);
        return new Transaccion(
            t.id, t.tipo, t.categoria, t.monto, t.descripcion, t.fecha
        );
    }

    async obtenerDatos(){
        return await TransaccionService.getAll();
    }

    async listar(){
        try{
            {/*if(Platform.OS === "web"){
                const data = await this.getAll();
                return data;
            }else{
                const sql = "SELECT * FROM transacciones ORDER BY fecha DESC";
                const rows = await this.db.getAllAsync(sql);
                return rows;
            }*/}
            return await TransaccionService.getAll();
        }catch(error){
            console.error(error);
            throw new Error("Error al obtener transacciones " + error.message);
        }
    }

    addListener(cb){
        this.listeners.push(cb)
    }

    removeListener(cb){
        this.listeners = this.listeners.filter(f => f !== cb)
    }

    notifyListeners(){
        this.listeners.forEach(f => f())
    }


    async listarFiltardo(fecha, categoria, tipo){
        try{
            return await TransaccionService.filter(fecha, categoria, tipo);
        }catch(error){
            throw new Error("Error al filtrar transacciones: " + error.message);
        }
    }

    async eliminar(id){
        await TransaccionService.remove(id);
    }

    async actualizar(id, tipo, categoria, monto, descripcion, fecha){
        Transaccion.validarP(tipo, categoria, monto);
        await TransaccionService.update(id, tipo, categoria, monto, descripcion, fecha);
    }
}