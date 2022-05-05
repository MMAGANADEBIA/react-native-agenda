import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Accept() {
  return (
    <TouchableOpacity style={[styles.button, styles.accept]} >
      <Text style={styles.buttonText}>Aceptar</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: '#FFF',
    fontSize: 20,
  },
  button: {
    width: 150,
    height: 60,
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    color: '#FFF',
  },
  accept: {
    backgroundColor: '#008000'
  },

})
