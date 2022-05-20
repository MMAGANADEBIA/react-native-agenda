import { StatusBar } from 'react-native';
StatusBar.setBarStyle('light-contect', true);
StatusBar.setBackgroundColor('#14191f');
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
// import Accept from '../components/buttons/accept.js';
import Trash from '../icons/trash-bin.png';
import Edit from '../icons/pluma-de-la-pluma.png';
import { TextInput } from 'react-native-gesture-handler';

const db = SQLite.openDatabase('contacts.db');

export default function Home({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");

  const addContact = () => {
    navigation.navigate('addContact')
  }

  const createTableIfNotExist = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS contact(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, last_name TEXT NOT NULL, number TEXT NOT NULL, short_number TEXT NOT NULL);')
    })

  }

  const searchContact = (text) => {
    contacts.map(element => {
      if (element.name.includes(text) || element.last_name.includes(text) || element.number.includes(text)) {
        console.log(element);
      }
    })
  }

  useEffect(() => {
    createTableIfNotExist();
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM contact;",
        [],
        (_, { rows: { _array } }) => setContacts(_array)
      );
    });
  }, [contacts]);

  //TODO: search input.
  //TODO: copy number on touch it.
  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity style={[styles.button, styles.accept]} onPress={addContact} >
          <Text style={styles.buttonText}>Nuevo contacto</Text>
        </TouchableOpacity>
        <TextInput style={styles.input} placeholder="Buscar"
          onChangeText={(text) => {
            searchContact(text);
          }}
        />
        <View style={styles.listContainer}>
          {contacts.map(element => {
            return (
              <View key={element.id} style={styles.row}>
                <Text style={styles.listElement}>{element.name}</Text>
                <Text style={styles.listElement} >{element.last_name.charAt(0)}.</Text>
                <Text style={styles.number}>{element.number}</Text>

                <View style={styles.icons}>
                  <TouchableOpacity onPress={() => {
                    navigation.navigate('updateContact', { id: element.id })
                  }}>
                    <Image style={styles.image} source={Edit} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {
                    Alert.alert(
                      "¿Seguro?",
                      `¿Quieres eliminar a ${element.name}?`,
                      [
                        {
                          text: "Cancelar",
                          style: "cancel"
                        },
                        {
                          text: "Aceptar", onPress: () => {
                            console.log("Aceptar")
                            db.transaction((tx) => {
                              tx.executeSql('DELETE FROM contact WHERE id = ?;', [element.id]);
                              tx.executeSql("SELECT * FROM contact;",
                                [],
                                (_, { rows: { _array } }) => setContacts(_array)
                              );
                            })
                          }
                        }
                      ]
                    )
                  }}>
                    <Image style={styles.image} source={Trash} />
                  </TouchableOpacity>
                </View>

              </View>
            )
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: 50,
    backgroundColor: '#14191f',
  },
  text: {
    color: '#FFF',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
  },
  button: {
    width: 250,
    height: 60,
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    color: '#FFF',
    marginLeft: 10,
  },
  accept: {
    backgroundColor: '#008000'
  },
  listElement: {
    // backgroundColor: '#FFF',
    // marginTop: 5,
    // marginBottom: 5,
    color: '#000',
    fontSize: 18,
    marginLeft: 10,
  },
  number: {
    fontSize: 18,
    marginLeft: 10,
  },
  listContainer: {
    // alignSelf: 'stretch',
    // textAlign: 'left',
    marginLeft: 10,
    marginRight: 10,
  },
  row: {
    backgroundColor: '#FFF',
    marginTop: 30,
    borderRadius: 10,
    padding: 18,
    height: 60,
    // width: 420,
    flexDirection: 'row',

  },
  image: {
    width: 30,
    height: 30,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // width: 200,
    position: 'absolute',
    padding: 18,
    marginLeft: 300,
  },
  input: {
    backgroundColor: '#FFF',
    width: 300,
    height: 60,
    marginLeft: 70,
    borderRadius: 10,
    padding: 10,
    fontSize: 20,
    marginTop: 30,
  },

});
