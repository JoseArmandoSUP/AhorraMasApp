import { Text,  StyleSheet, View, Button, ImageBackground, TextInput, Image, Switch} from "react-native";
import React, { useState } from 'react'

export default function LoginScreen (){

    const [correo, setCorreo] = useState ()
    const [password, setPassword] = useState ()
    
    return(
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
            <Button title="INICIAR SESION"></Button>
            <Text>¿No tienes cuenta? REGISTRARSE</Text>
        </View>
    )
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

})