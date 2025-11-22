import { Text,  StyleSheet, View, Button, ImageBackground, TextInput, Image, Switch, ScrollView, Alert} from "react-native";
import React, { useState } from 'react'
//import PantallaPrincipal from "./PantallaPrincipal";
//import PantallaRegistro from "./PantallaRegistro";

//Navegacion
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen (){

    const nav = useNavigation();

    const [correo, setCorreo] = useState ('')
    const [password, setPassword] = useState ('')

    const mostrarAlerta = () =>{
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
                    value={correo}
                    onChangeText={setCorreo}
                />
                <TextInput style={styles.input}
                    placeholder='Password'
                    value={password}
                    onChangeText={setPassword}
                />
                <View>
                    <Switch></Switch>
                    <Text></Text>
                </View>
                
                <Button 
                    title="INICIAR SESION" 
                    onPress={()=>{
                        const valido = mostrarAlerta();
                        if (valido) nav.navigate("Home");
                    }}
                ></Button>
                
                <Text>¿No tienes cuenta? REGISTRARSE</Text>

                <Button 
                    style={styles.boton} 
                    onPress={()=> nav.navigate("Registro")} title="Registrarse"
                ></Button>

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
        height: '30%',
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    boton:{
        flex: 1,
    },
})