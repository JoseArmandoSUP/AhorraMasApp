export class Presupuesto{
    constructor(id, categoria, montolimite, mes, anio, creadoEn){
        this.id = id;
        this.categoria = categoria;
        this.montolimite = montolimite;
        this.mes = mes;
        this.anio = anio;
        this.creadoEn = creadoEn || new Date().toString();
    }

    static validar(categoria, montolimite, mes, anio){
        if(!categoria || !montolimite || !mes || !anio){
            throw new Error("Todos los campos deben estar llenos");
        }
        if(isNaN(montolimite) || Number(montolimite) <= 0){
            throw new Error("Campo no válido");
        }
        if(isNaN(mes) || mes < 1 || mes > 12){
            throw new Error("Mes no valido");
        }
        if(isNaN(anio) || anio < 2000 || anio > 2100){
            throw new Error("Año inválido");
        }

        return true;
    }
}