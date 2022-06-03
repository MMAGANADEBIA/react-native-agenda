import { StatusBar, Alert } from 'react-native';
StatusBar.setBarStyle('light-contect', true);
StatusBar.setBackgroundColor('#14191f');
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useRef } from 'react';
import PhoneInput from 'react-native-phone-number-input';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('contacts.db');

export default function Home({ navigation }) {

  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const phoneInput = useRef < PhoneInput > (null);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");


  const accept = () => {
    let number = formattedValue;
    //Regular expression to clean number input values.
    let regex = /[./,/\-/ ]/
    //Check name and last name are not empty.
    if (name != "" && lastName != "") {
      //Check number has 10 digits and the number are clean.
      if (value.length == 10 && !value.match(regex)) {
        //Navigate back to home and insert the new contact into the database.
        navigation.navigate('Home')
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO contact(name, last_name, number, short_number) values (?, ?, ?, ?);', [name, lastName, number, value]);
        })
      } else {
        //If number are not clean and does not have 10 digits, alert it.
        setValid(false);
        Alert.alert(
          "Número inválido",
          "El número debe de tener 10 dígitos",
        )
      }
    } else {
      //If name and last name are empty.
      Alert.alert(
        "Campos vacíos",
        "Llene los campos con datos válidos",
      )
    }

  }

  //Go home if cancel.
  const cancel = () => {
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container}>
      {/*Form with inputs like name, last name and number.*/}
      <Text style={styles.header}>Nuevo Contacto</Text>
      <View style={styles.usableScreen}>
        <View style={styles.form}>
          <Text style={styles.text}>Nombre</Text>
          <TextInput style={styles.input} placeholder="Nombre"
            onChangeText={(text) => {
              setName(text);
            }}
          />
          <Text style={styles.text}>Apellido</Text>
          <TextInput style={styles.input} placeholder="Apellido"
            onChangeText={(text) => {
              setLastName(text);
            }}
          />
          <Text style={styles.text}>Número</Text>
          {/*Phone input allows you select and country and her number prefix.*/}
          <PhoneInput
            defaultCode="MX"
            defaultValue={value}
            useRef={phoneInput}
            layout="first"
            placeholder='Número'
            withDarkTheme
            withShadow
            onChangeText={(text) => {
              setValue(text);
            }}
            onChangeFormattedText={(text) => {
              setFormattedValue(text);
            }}
            textInputStyle={styles.textInputStyle}
            containerStyle={styles.containerStyle}
            textContainerStyle={styles.textContainerStyle}
            codeTextStyle={styles.codeTextStyle}
          />

        </View>
        {/*Cancel and accept buttons.*/}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, styles.cancel]} onPress={cancel}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.accept]} onPress={accept}>
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#14191f',
  },
  header: {
    color: '#FFFFFF',
    fontSize: 40,
    textAlign: 'center',
    marginTop: 100,
  },
  usableScreen: {
    marginTop: 80,
  },
  input: {
    backgroundColor: '#FFF',
    // width: 300,
    width: '82%',
    height: 60,
    // marginLeft: 70,
    marginLeft: '8%',
    borderRadius: 10,
    padding: 10,
    paddingLeft: 15,
    fontSize: 20
  },
  textInputStyle: {
    fontSize: 20,
    borderRadius: 10,
  },
  containerStyle: {
    // marginLeft: 70,
    marginLeft: '8%',
    height: 60,
    // width: 300,
    width: '82%',
    borderRadius: 10,
  },
  textContainerStyle: {
    fontSize: 20,
    borderRadius: 10
  },
  codeTextStyle: {
    fontSize: 20,
  },
  text: {
    color: '#FFF',
    // marginLeft: 70,
    marginLeft: '8%',
    marginTop: 20,
    fontSize: 20,
  },
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
  cancel: {
    backgroundColor: '#ff0000',
  },
  accept: {
    backgroundColor: '#008000'
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: 'space-around',
    marginTop: 50
  }
});
