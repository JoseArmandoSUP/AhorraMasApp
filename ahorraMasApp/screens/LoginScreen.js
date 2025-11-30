import { Text,  StyleSheet, View, Button, ImageBackground, TextInput, Image, Switch, ScrollView, Alert} from "react-native";
import React, { useState, useEffect } from 'react'
//import PantallaPrincipal from "./PantallaPrincipal";
//import PantallaRegistro from "./PantallaRegistro";
//Navegacion
import { useNavigation } from "@react-navigation/native";
//Importar el controlador de Usuario
import { UsuarioController } from "../controllers/UsuarioController";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const controller = new UsuarioController();

export default function LoginScreen (){

    const nav = useNavigation();

    const {setUsuario} = useContext(AuthContext);

    const [correo, setCorreo] = useState ('')
    const [password, setPassword] = useState ('')

    // Inicializar SQLite (solo una vez)
    useEffect(()=>{
        controller.initialize();
    },[]);

    //Funcion de Login real
    const iniciarSesion = async () => {
        if(correo.trim() === "" || password.trim() === ""){
            Alert.alert("Faltan campos por llenar, porfavor completelos");
            return;
        }
        try{
            const usuario = await controller.login(correo, password);
            setUsuario(usuario); // <-- Guarda el usuario
            Alert.alert("Sesion iniciada de", `${usuario.nombre}`);

            //Pasar al usuario a la pantalla principal
            nav.navigate("Home", {usuario});

        }catch(error){
            Alert.alert("Error al iniciar sesión", error.message);
        }
    };

    {/* const mostrarAlerta = () =>{
        if(correo.trim() === '' || password.trim() === ''){
            Alert.alert("Faltan campos por llenar, porfavor completelos");
            alert("Faltan campos por llenar, porfavor completelos");
            return false;
        }
        const validarCorreo = /^[\w.%+-]+@gmail\.com$/;
        if(!validarCorreo.test(correo)){
            Alert.alert("Correo electronico no valido, intente otra vez porfavor");
            alert("Correo electronico no valido, intente otra vez porfavor");
            return false;
        }else{
            Alert.alert("Inicio de sesión esxitoso\n");
            alert("Inicio de sesión esxitoso\n");
            return true;
        }
    }; */}

    return(
        <ScrollView contentContainerStyle={{paddingBottom: 100}}>
            <View style={styles.container}>
                <Image 
                    source={require('../assets/Logo.png')}
                />
                <Text style={styles.text} >Iniciemos Sesion..!</Text>
                <Text style={styles.text2}>Inicie sesion para poder acceder a su cuenta</Text>
                <TextInput style={styles.input}
                    placeholder='Correo'
                    keyboardType="email-address"
                    value={correo}
                    onChangeText={setCorreo}
                />
                <TextInput style={styles.input}
                    placeholder='Password'
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    secureTextEntry={true}
                />
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Switch></Switch>
                    <Text>Aceptar Terminos y Condiciones</Text>
                </View>
                
                <Button title="INICIAR SESION" onPress={iniciarSesion}></Button>
                
                <Text style={{marginTop: 15}}>¿No tienes cuenta? REGISTRARSE</Text>

                <Button style={styles.boton} onPress={()=> nav.navigate("Registro")} title="Registrarse"></Button>

            </View>
        </ScrollView>
        
    );
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F9FF'
    },
    text: {
        alignSelf: 'flex-start',   
        marginLeft: 20,  
        fontWeight:'bold',
        fontSize: 30,
        marginTop: 10,
    },
    text2:{
        alignSelf: 'flex-start',
        marginLeft:20,
        marginBottom: 20,
    },
    input: {
        width: '80%', 
        borderWidth: 2,
        borderColor: 'white', 
        borderRadius: 10, 
        padding: 20,
        backgroundColor: 'white', 
        marginTop:20,
        color:'#000'
    },
    logo: {
        height: '30%',
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    boton:{
        flex: 1,
    },
})