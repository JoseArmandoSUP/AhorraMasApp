import { Text,  StyleSheet, View, Button, ImageBackground, TextInput, Image} from "react-native";
import React, { useState } from 'react'
import LoginScreen from "./LoginScreen";

export default function PantallaRegistro () {
    const [nombre, setNombre] = useState ()
    const [usuario, setUsuario] = useState ()
    const [edad, setEdad] = useState () 
    const [correo, setCorreo] = useState ()
    const [telefono, setTelefono] = useState ()
    const [registrar, setRegistrar] = useState ()

    switch(registrar){
        case 'registro':
            return <LoginScreen/>;
    }
    return (
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
        value={edad}
        onChangeText={setEdad}
        />

        <TextInput style={styles.input}
        placeholder='Escribe tu correo'
        value={correo}
        onChangeText={setCorreo}
        />

        <TextInput style={styles.input}
        placeholder='Escribe tu numero telefonico'
        value={telefono}
        onChangeText={setTelefono}
        />

        <Button
        color="blue"
        title="Resgistrarse"
        onPress={()=> setRegistrar('registro')}
        ></Button>

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
        height: 250,
        width: 250,
        alignItems: 'center',
        justifyContent: 'center',
    }, 
    
})