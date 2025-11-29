export class Transaccion{
    constructor(id, tipo, categoria, monto, descripcion, fecha){
        this.id = id;
        this.tipo = tipo;
        this.categoria = categoria;
        this.monto = monto;
        this.descripcion = descripcion;
        this.fecha = fecha || new Date().toString();
    }
    
    static validarP(tipo, categoria, monto){
        if(!tipo || !categoria || !monto){
            throw new Error("Todos los campos obligatorios deben estar llenos");
        }
        if(tipo !== "Ingreso" && tipo !== "Gasto"){
            throw new Error("El tipo debe ser 'Ingreso' o 'Gasto'");
        }
        if(isNaN(monto) || Number(monto) <= 0){
            throw new Error("El monto debe ser un número mayor a cero");
        }

        return true;
    }
}