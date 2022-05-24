import { StatusBar } from 'react-native';
StatusBar.setBarStyle('light-contect', true);
StatusBar.setBackgroundColor('#14191f');
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import Trash from '../icons/trash-bin.png';
import Edit from '../icons/pluma-de-la-pluma.png';
import Plus from '../icons/plus.png';
import { TextInput } from 'react-native-gesture-handler';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-simple-toast';

const db = SQLite.openDatabase('contacts.db');

export default function Home({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState([]);
  const [searchAvailable, setSearchAvaiblable] = useState(false);

  const addContact = () => {
    navigation.navigate('addContact')
  }

  const createTableIfNotExist = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS contact(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, last_name TEXT NOT NULL, number TEXT NOT NULL, short_number TEXT NOT NULL);')
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


  return (
    <View style={styles.container}>

      <View styles={styles.inlineElements}>

        <TextInput style={styles.input} placeholder="Buscar"
          onChangeText={(text) => {
            if (text.length > 0) {
              setSearchAvaiblable(true);
              db.transaction((tx) => {
                tx.executeSql(`SELECT * FROM contact WHERE name LIKE ?;`,
                  ["%" + text + "%"],
                  (_, { rows: { _array } }) => setSearch(_array)
                );
              });
            } else {
              setSearchAvaiblable(false);
            }
          }}
        />

        <TouchableOpacity style={styles.addContact} onPress={addContact} >
          <Image style={styles.plus} source={Plus} />
        </TouchableOpacity>

      </View>

      <View style={styles.listContainer} >
        {search.map(element => {
          if (searchAvailable) {
            return (
              <View key={element.id} style={styles.row}>

                <Text key={element.name} style={styles.listElement}>{element.name}</Text>
                <Text key={element.last_name} style={styles.listElement} >{element.last_name.charAt(0)}.</Text>
                <TouchableOpacity onPress={() => {
                  Clipboard.setString(element.number)
                  Toast.show(`Número copiado: ${element.number}`);
                }}>
                  <Text style={styles.number}>{element.number}</Text>
                </TouchableOpacity>
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
          }
        })}
      </View>

      <View style={styles.listContainer}>
        {contacts.map(element => {
          if (!searchAvailable) {
            return (
              <View key={element.id} style={styles.row}>

                <Text style={styles.listElement}>{element.name}</Text>
                <Text style={styles.listElement} >{element.last_name.charAt(0)}.</Text>
                <TouchableOpacity onPress={() => {
                  Clipboard.setString(element.number)
                  Toast.show(`Número copiado: ${element.number}`);
                }}>
                  <Text style={styles.number}>{element.number}</Text>
                </TouchableOpacity>
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
          }

        })}
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
  listElement: {
    color: '#000',
    fontSize: 18,
    marginLeft: 10,
  },
  number: {
    fontSize: 18,
    marginLeft: 10,
  },
  listContainer: {
    marginLeft: 10,
    marginRight: 10,
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
  },
  plus: {
    width: 50,
    height: 50,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    padding: 18,
    marginLeft: 300,
  },
  input: {
    backgroundColor: '#FFF',
    width: 320,
    height: 60,
    marginLeft: 10,
    borderRadius: 10,
    padding: 10,
    fontSize: 20,
    // marginTop: 30,
  },
  addContact: {
    position: 'absolute',
    marginTop: 5,
    marginLeft: '80%',
  },
  inlineElements: {
    // flex: 1,
    // flexDirection: 'row',
    // flex: 2,
    // flexDirection: 'row',
  }
});
