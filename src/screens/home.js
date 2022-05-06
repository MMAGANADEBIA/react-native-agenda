import { StatusBar } from 'react-native';
StatusBar.setBarStyle('light-contect', true);
StatusBar.setBackgroundColor('#14191f');
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
// import Accept from '../components/buttons/accept.js';
import Trash from '../icons/trash-bin.png';

const db = SQLite.openDatabase('contacts.db');

export default function Home({ navigation }) {
  const [contacts, setContacts] = useState("");

  const addContact = () => {
    navigation.navigate('addContact')
  }

  const createTableIfNotExist = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS contact(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, last_name TEXT NOT NULL, number TEXT NOT NULL);'
      )
    })

    //Uncomment only to delete the the database.
    // db.transaction((tx) => {
    // tx.executeSql('DELETE * FROM contact;');
    //   tx.executeSql('DROP TABLE contact;');
    // })

    getData();
  }

  const getData = () => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM contact;",
        [],
        (_, { rows: { _array } }) => setContacts(_array)
      );
    });
    print();
  }


  const print = () => {
    console.log(contacts);
  }

  useEffect(() => {
    createTableIfNotExist();
  }, [])

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity style={[styles.button, styles.accept]} onPress={addContact} >
          <Text style={styles.buttonText}>Nuevo contacto</Text>
        </TouchableOpacity>
        <View style={styles.listContainer}>
          {contacts.map(element => {
            return (
              <View key={element.id} style={styles.row}>
                <Text key={element.name} style={styles.listElement}>{element.name}</Text>
                <Text key={element.last_name} style={styles.listElement} >{element.last_name.charAt(0)}.</Text>
                <Text key={element.number} style={styles.number}>{element.number}</Text>
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
    alignSelf: 'stretch',
    // textAlign: 'left',
    marginLeft: 10,
  },
  row: {
    backgroundColor: '#FFF',
    marginTop: 30,
    borderRadius: 10,
    padding: 18,
    height: 60,
    flexDirection: 'row',
  },
  image: {
    width: 30,
    height: 30,
  }
});
