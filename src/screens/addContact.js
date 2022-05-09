import { StatusBar } from 'react-native';
StatusBar.setBarStyle('light-contect', true);
StatusBar.setBackgroundColor('#14191f');
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useRef } from 'react';
import PhoneInput from 'react-native-phone-number-input';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('contacts.db');
// const db = SQLite.openDatabase('contact.db');

export default function Home({ navigation }) {

  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const phoneInput = useRef < PhoneInput > (null);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");


  const accept = () => {
    if (value.length == 10) {
      setValid(true);
      let number = formattedValue;
      if (name != "" && lastName != "") {
        // console.log(name, lastName);
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO contact(name, last_name, number) values (?, ?, ?);', [name, lastName, number]);
          tx.executeSql('SELECT * FROM contact;', [], (_, { rows }) => {
            console.log(JSON.stringify(rows._array[0].name))
          })
        })
        // navigation.goBack();
        navigation.navigate('Home')
      }
      // console.log(formattedValue);
      // console.log(value);
    } else {
      setValid(false);
    }
  }

  const cancel = () => {
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container}>
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
    width: 300,
    height: 60,
    marginLeft: 70,
    borderRadius: 10,
    padding: 10,
    fontSize: 20
  },
  textInputStyle: {
    fontSize: 20,
    borderRadius: 10,
  },
  containerStyle: {
    marginLeft: 70,
    height: 60,
    width: 300,
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
    marginLeft: 70,
    marginTop: 20,
    fontSize: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
  },
  // form: {
  //   flex: 1,

  // },
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
