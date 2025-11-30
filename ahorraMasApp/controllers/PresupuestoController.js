import PresupuestoService from "../database/PresupuestoService";
import { Presupuesto } from "../models/Presupuesto";

export class PresupuestoController {
    constructor(){
        this.initialized = false;
        this.listeners = [];
    }

    async initialize(){
        if(this.initialized){
            return;
        }
        await PresupuestoService.initialize();
        this.initialized = true;
    }

    async agregar(categoria, montolimite, mes, anio){
        Presupuesto.validar(categoria, montolimite, mes, anio);
        const p = await PresupuestoService.add(categoria, montolimite, mes, anio);
        return new Presupuesto(p.id, p.categoria, p.montolimite, p.mes, p.anio, p.creadoEn);
    }

    async listar(){
        const data = await PresupuestoService.getAll();
        return data.map(
            p => new Presupuesto(p.id, p.categoria, p.montolimite, p.mes, p.anio, p.creadoEn)
        );
    }

    async actualizar(id, categoria, montolimite, mes, anio){
        Presupuesto.validar(categoria, montolimite, mes, anio);
        await PresupuestoService.update(id, categoria, montolimite, mes, anio);
    }

    async eliminar(id){
        await PresupuestoService.remove(id);
    }

    addListener(cb){
        this.listeners.push(cb);
    }

    removeListener(cb){
        this.listeners = this.listeners.filter(f => f !== cb); 
    }

    notifyListeners(){
        this.listeners.forEach(f => f());
    }
}