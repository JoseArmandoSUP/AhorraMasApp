import { Alert } from 'react-native';

export default class AlertController {

  static camposVacios() {
    Alert.alert("Error", "Faltan campos por llenar, por favor complételos");
  }

  static correoInvalido() {
    Alert.alert("Error", "Correo electrónico no válido. Intente otra vez");
  }

  static registroExitoso(nombre, usuario, edad, correo, telefono) {
    Alert.alert(
      "Registro exitoso",
      `Nombre: ${nombre}\nUsuario: ${usuario}\nEdad: ${edad}\nCorreo: ${correo}\nTeléfono: ${telefono}`
    );
  }
}
