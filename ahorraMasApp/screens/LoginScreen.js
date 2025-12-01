import { Text,  StyleSheet, View, Button, ImageBackground, TextInput, Image, Switch, ScrollView, Alert, TouchableOpacity} from "react-native";
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
                
                <TouchableOpacity onPress={iniciarSesion} style={styles.volverBoton}>
                    <Text style={styles.volverBotonTexto}>INICIAR SESION</Text>
                </TouchableOpacity>
                
                <Text style={{marginTop: 15}}>¿No tienes cuenta? REGISTRATSE</Text>

                <TouchableOpacity style={styles.volverBoton1} onPress={()=> nav.navigate("Registro")}>
                    <Text style={styles.volverBotonTexto1}>REGISTRARSE</Text>
                </TouchableOpacity> 

                <TouchableOpacity onPress={() => nav.navigate("RecuperarPassCorreo")}>
                    <Text style={{ 
                        color: "#e4c61fff", 
                        fontWeight: "bold", 
                        textAlign: "center",
                        marginTop: 10 
                    }}>
                        Olvidé mi contraseña
                    </Text>
                </TouchableOpacity>
  

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
    volverBoton:{
        flex: 1,
        backgroundColor: '#2e7d32',
        borderRadius: 10,
        paddingVertical: 10,
        marginTop: 5,
        alignItems: 'center',
    },

    volverBotonTexto:{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    volverBoton1:{
        flex: 1,
        backgroundColor: '#1154b9ff',
        borderRadius: 10,
        paddingVertical: 10,
        marginTop: 5,
        alignItems: 'center',
    },

    volverBotonTexto1:{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
})