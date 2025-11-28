import { Text,  StyleSheet, View, Button, ImageBackground, TextInput, Image, ScrollView, Alert} from "react-native";
import React, { useState, useEffect } from 'react'
//import LoginScreen from "./LoginScreen";
//import PantallaPrincipal from "./PantallaPrincipal";
//Navegacion
import { useNavigation } from "@react-navigation/native";
import { UsuarioController } from "../controllers/UsuarioController";

const controller = new UsuarioController();

export default function PantallaRegistro () {
    
    const nav = useNavigation();
    
    const [nombre, setNombre] = useState ('');
    const [usuario, setUsuario] = useState ('');
    const [edad, setEdad] = useState (''); 
    const [correo, setCorreo] = useState ('');
    const [telefono, setTelefono] = useState ('');
    const [password, setPassword] = useState('');

    //Inicializar SQLite
    useEffect(() => {
        controller.initialize();
    },[]);

    const handleRegistro = async () => {
        try{
            await controller.registrar(nombre, usuario, edad, correo, telefono, password);

            Alert.alert("Registrado correctamente");
            nav.navigate("Login");
        }catch(error){
            Alert.alert("Error", error.message);
        }
    };

    {/*const mostrarAlerta = () =>{
        if(nombre.trim() === '' || usuario.trim() === '' || edad.trim() === '' || correo.trim() === '' || telefono.trim() === '' || password.trim() === ''){
            Alert.alert("Faltan campos por llenar, porfavor completelos");
            alert("Faltan campos por llenar, porfavor completelos");
            return;
        }
        const validarCorreo = /^[\w.%+-]+@gmail\.com$/;
        if(!validarCorreo.test(correo)){
            Alert.alert("Correo electronico no valido, intente otra vez porfavor");
            alert("Correo electronico no valido, intente otra vez porfavor");
            return;
        }else{
            Alert.alert("Datos ingresados correctamente\n" + 
                `Nombre: ${nombre}\n usuario: ${usuario}\n Edad: ${edad}\n 
                Correo: ${correo}\n Telefono: ${telefono}\n`);
            alert("Datos ingresados correctamente\n" + 
                `Nombre: ${nombre}\n usuario: ${usuario}\n Edad: ${edad}\n 
                Correo: ${correo}\n Telefono: ${telefono}\n`);
        }
    }; */}

    const filtrarCaracteresE = (input) => {
        const numerico = input.replace(/[^0-9]/g, '');
        setEdad(numerico);
    };

    const filtrarCaracteresT = (input) => {
        const numerico = input.replace(/[^0-9]/g, '');
        setTelefono(numerico);
    };

    return (
        <ScrollView contentContainerStyle={{paddingBottom: 100}}>
            <View style={styles.container}>
                <Image style={styles.logo}
                    source={require('../assets/Logo.png')}
                />
                <Text style={styles.text}>REGISTRATE</Text>
                <Text style={styles.text2}>Completa el formulario para poder crear una cuenta</Text>   
                
                

                <TextInput style={styles.input}
                    placeholder='Escribe tu nombre'
                    value={nombre}
                    onChangeText={setNombre}
                />

                <TextInput style={styles.input}
                    placeholder='Escribe tu usuario'
                    value={usuario}
                    onChangeText={setUsuario}
                />

                <TextInput style={styles.input}
                    placeholder='Escribe tu edad'
                    keyboardType="numeric"
                    value={edad}
                    onChangeText={filtrarCaracteresE}
                />

                <TextInput style={styles.input}
                    placeholder='Escribe tu correo'
                    value={correo}
                    onChangeText={setCorreo}
                />

                <TextInput style={styles.input}
                    placeholder='Escribe tu numero telefonico'
                    keyboardType="numeric"
                    value={telefono}
                    onChangeText={filtrarCaracteresT}
                />

                <TextInput style={styles.input}
                    placeholder="Definir contraseña"
                    value={password}
                    secureTextEntry={true}
                    onChangeText={setPassword}
                ></TextInput>

                <Button
                    color="blue"
                    title="Resgistrarse"
                    onPress={handleRegistro}
                ></Button>

                <Button title="Volver al Login" onPress={()=>nav.navigate("Login")}></Button>

                <Button onPress={()=> nav.navigate("Home")} title="Volver al menú"></Button>
                
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
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',   
        marginLeft: 20,  
        fontWeight:'bold',
        fontSize: 30
    },
    text2:{
        justifyContent:'center',
        alignSelf: 'flex-start',
        marginLeft:20
    },
    input: {
        width: '80%', 
        borderWidth: 2,
        borderColor: 'white', 
        borderRadius: 10, 
        padding: 20,
        backgroundColor: 'white', 
        marginTop:20,
        marginBottom:20,
        color:'#000'
    },
    logo: {
        height: 250,
        width: 250,
        alignItems: 'center',
        justifyContent: 'center',
    }, 
    
})