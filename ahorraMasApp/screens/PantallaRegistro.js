import { Text,  StyleSheet, View, Button, ImageBackground, TextInput, Image, ScrollView, Alert} from "react-native";
import React, { useState } from 'react'
import LoginScreen from "./LoginScreen";
import PantallaPrincipal from "./PantallaPrincipal";

export default function PantallaRegistro () {
    
    const[screen, setScreen]=useState('menu');
    
    const [nombre, setNombre] = useState ('')
    const [usuario, setUsuario] = useState ('')
    const [edad, setEdad] = useState ('') 
    const [correo, setCorreo] = useState ('')
    const [telefono, setTelefono] = useState ('')

    const mostrarAlerta = () =>{
        if(nombre.trim() === '' || usuario.trim() === '' || edad.trim() === '' || correo.trim() === '' || telefono.trim() === ''){
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
    };

    switch(screen){
        case 'registro':
            return <LoginScreen/>;
        case 'pantallaPrincipal':
            return<PantallaPrincipal></PantallaPrincipal>
        case 'menu':
            default:
                return (
                    <ScrollView>
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
                                onPress={mostrarAlerta}
                            ></Button>

                            <Button 
                                onPress={()=> setScreen('pantallaPrincipal')} title="Volver al menú"
                            ></Button>
                            
                        </View>
                    </ScrollView> 
                );
    }
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