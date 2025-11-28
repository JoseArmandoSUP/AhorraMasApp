export class Usuario{
    constructor(id, nombre, usuario, edad, correo, telefono, password, fechaCreacion){
        this.id = id;
        this.nombre = nombre;
        this.usuario = usuario;
        this.edad = edad;
        this.correo = correo;
        this.telefono = telefono;
        this.password = password;
        this.fechaCreacion = fechaCreacion || new Date().toString();
    }

    //Validaciones del modelo
    static validarRegistro(nombre, usuario, edad, correo, telefono, password){
        if(!nombre || !usuario || !edad || !correo || !telefono || !password){
            throw new Error("Ningún campo puede estar vacio");
        }
        if(nombre.length > 50){
            throw new Error("El nombre no puede tener más de 50 caracteres");
        }
        if(!/^[\w.%+-]+@gmail\.com$/.test(correo)){
            throw new Error("Correo inválido");
        }
        if(!password || password.length < 4){
            throw new Error("La contraseña debe tener al menos 4 caracteres");
        }

        return true;
    }
}