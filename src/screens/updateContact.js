import { StatusBar, Alert } from 'react-native';
StatusBar.setBarStyle('light-contect', true);
StatusBar.setBackgroundColor('#14191f'); import * as SQLite from 'expo-sqlite'; import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import React, { useState, useRef, useEffect } from 'react';

const db = SQLite.openDatabase('contacts.db');

export default function UpdateContact({ navigation }) {
  const [value, setValue] = useState([]);
  const [contact, setContact] = useState([]);
  const [formattedValue, setFormattedValue] = useState([]);
  const [name, setName] = useState([]);
  const [lastName, setLastName] = useState([]);
  const phoneInput = useRef < PhoneInput > (null);
  const id = navigation.state.params.id;


  const cancel = () => {
    // navigation.goBack();
    navigation.navigate('Home')
  }


  const accept = () => {
    let number = formattedValue;
    let shortNumber = value;
    Alert.alert(
      "¿Actualizar?",
      "Los datos modificados serán actualizados. Esta acción es irreversible.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Aceptar", onPress: () => {
            contact.map(element => {

              if (name == "") {
                db.transaction(
                  (tx) => {
                    tx.executeSql(`UPDATE contact SET name = ? WHERE id = ?;`, [
                      element.name,
                      element.id,
                    ]);
                  }
                )
              } else {
                db.transaction(
                  (tx) => {
                    tx.executeSql(`UPDATE contact SET name = ? WHERE id = ?;`, [
                      name,
                      element.id,
                    ]);
                  }
                )
              }

              if (lastName == "") {
                db.transaction(
                  (tx) => {
                    tx.executeSql(`UPDATE contact SET last_name = ? WHERE id = ?;`, [
                      element.last_name,
                      element.id,
                    ]);
                  }
                )
              } else {
                db.transaction(
                  (tx) => {
                    tx.executeSql(`UPDATE contact SET last_name = ? WHERE id = ?;`, [
                      lastName,
                      element.id,
                    ]);
                  }
                )
              }

              if (shortNumber == "") {
                db.transaction(
                  (tx) => {
                    tx.executeSql(`UPDATE contact SET number = ?, short_number = ? WHERE id = ?;`, [
                      element.number,
                      element.short_number,
                      element.id,
                    ]);
                  }
                )
              } else if (shortNumber.length == 10) {
                db.transaction(
                  (tx) => {
                    tx.executeSql(`UPDATE contact SET number = ?, short_number = ? WHERE id = ?;`, [
                      number,
                      shortNumber,
                      element.id,
                    ]);
                  }
                )
              }


            })

            navigation.navigate('Home');

          }
        }
      ]
    )


  }


  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM contact WHERE id = ?;",
        [id],
        (_, { rows: { _array } }) => setContact(_array)
      );
    });
  }, [])


  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Editar contacto</Text>

        {contact.map(element => {
          return (
            <View key={element.id}>
              <Text style={styles.text} >Nombre</Text>
              <TextInput style={styles.input} placeholder="Nombre"
                defaultValue={element.name}
                onChangeText={(text) => {
                  setName(text);
                }}
              />
              <Text style={styles.text}>Apellido</Text>
              <TextInput style={styles.input} placeholder="Apellido"
                defaultValue={element.last_name}
                onChangeText={(text) => {
                  setLastName(text);
                }}
              />
              <Text style={styles.text}>Número</Text>
              <PhoneInput
                defaultCode="MX"
                defaultValue={element.short_number}
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
          )
        })}
        <View style={styles.usableScreen}>
          <View style={styles.form}>

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
})
