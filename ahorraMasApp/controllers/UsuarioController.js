import { Usuario } from "../models/Usuario";
import UsuarioService from "../database/UsuarioService";

export class UsuarioController{
    constructor(){
        this.initialized = false;
    }

    async initialize(){
        if(this.initialized){
            return;
        }
        await UsuarioService.initialize();
        this.initialized = true;
    }
    
    //Registro
    async registrar(nombre, usuario, edad, correo, telefono, password){
        Usuario.validarRegistro(nombre, usuario, edad, correo, telefono, password);

        const existente = await UsuarioService.getByCorreo(correo);
        if(existente){
            throw new Error("Este correo ya esta registrado");
        }

        const user = await UsuarioService.add(nombre, usuario, edad, correo, telefono, password);
        return new Usuario(user.id, user.nombre, user.usuario, user.edad, user.correo, user.telefono, user.password, user.fecha_creacion);
    }

    //Login
    async login(correo, password){
        try{
            const usuarios = await UsuarioService.getAll();
            const user = usuarios.find(u => u.correo === correo);

            if(!user){
                throw new Error("Correo no registrado")
            }
            if(user.password !== password){
                throw new Error("Contrasela Incorrecta");
            }

            return user;
        }catch(error){
            throw error;
        }
    }
}