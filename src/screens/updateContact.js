import { StatusBar } from 'react-native';
StatusBar.setBarStyle('light-contect', true);
StatusBar.setBackgroundColor('#14191f');
import * as SQLite from 'expo-sqlite';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import React, { useState, useRef, useEffect } from 'react';

const db = SQLite.openDatabase('contacts.db');

export default function UpdateContact({ navigation }) {
  const [value, setValue] = useState("");
  const [contact, setContact] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const phoneInput = useRef < PhoneInput > (null);
  const id = navigation.state.params.id;

  const home = () => {
    navigation.navigate('Home')
  }

  const cancel = () => {
    navigation.goBack();
  }

  const getData = () => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM contact WHERE id = ?;",
        [id],
        (_, { rows: { _array } }) => setContact(_array)
      );
    });
    print();
  }

  const print = () => {
    console.log(id);
    console.log(contact);
  }

  const accept = () => {
    let number = formattedValue;
    db.transaction(
      (tx) => {
        tx.executeSql(`UPDATE contact SET name = ?, last_name = ?, number = ? WHERE id = ?;`, [
          name,
          lastName,
          number,
          id,
        ]);
      }
    )
    navigation.navigate('Home')
  }

  useEffect(() => {
    getData();
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Editar contact</Text>
        <Text style={styles.header}>{contact[0].name}</Text>
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


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#14191f',
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
  header: {
    color: '#FFFFFF',
    fontSize: 40,
    textAlign: 'center',
    marginTop: 50,
  },
  usableScreen: {
    marginTop: 10,
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
})
