//Import and style of status bar.
import { StatusBar } from 'react-native';
StatusBar.setBarStyle('light-contect', true);
StatusBar.setBackgroundColor('#14191f');
//Import modules necessary.
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import Toast from 'react-native-simple-toast';
import { TextInput } from 'react-native-gesture-handler';
import * as Clipboard from 'expo-clipboard';
//Import of images and icons.
import Trash from '../icons/trash-bin.png';
import Edit from '../icons/pluma-de-la-pluma.png';
import Plus from '../icons/plus.png';
import Search from '../icons/search.png';

//Open slqite database.
const db = SQLite.openDatabase('contacts.db');

export default function Home({ navigation }) {
  //Variables with data to show.
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState([]);
  const [searchAvailable, setSearchAvaiblable] = useState(false);

  //Function to navigate into other screens.
  const addContact = () => {
    navigation.navigate('addContact')
  }

  //Create the database table in case this does not exist.
  //Table used to save the contacts data.
  const createTableIfNotExist = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS contact(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, last_name TEXT NOT NULL, number TEXT NOT NULL, short_number TEXT NOT NULL);')
    })
  }

  //Getting all the contacts and set it to the setContact variable.
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

      {/*Search bar and plus icon to add contact.*/}
      <View styles={styles.inlineElements}>

        <View style={styles.searchBar}>
          <Image style={styles.searchIcon} source={Search} />
          {/*Get data from the database while you type and set the data.*/}
          <TextInput style={styles.input} placeholder="Buscar"
            onChangeText={(text) => {
              if (text.length > 0) {
                setSearchAvaiblable(true);
                db.transaction((tx) => {
                  tx.executeSql(`SELECT * FROM contact WHERE name LIKE ? OR last_name LIKE ? OR number like ?;`,
                    ["%" + text + "%", "%" + text + "%", "%" + text + "%"],
                    (_, { rows: { _array } }) => setSearch(_array)
                  );
                });
              } else {
                setSearchAvaiblable(false);
              }
            }}
          />
        </View>

        <TouchableOpacity style={styles.addContact} onPress={addContact} >
          <Image style={styles.plus} source={Plus} />
        </TouchableOpacity>

      </View>

      {/*List searched elements while type in the search bar.*/}
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

      {/*Show all elements in the database while not typing.*/}
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

                  <TouchableOpacity style={styles.delete} onPress={() => {
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
                            //delete a database element when touch the trash icon.
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
    paddingTop: '12%',
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
    // justifyContent: 'flex-end',
    justifyContent: 'space-around',
    position: 'absolute',
    padding: 18,
    // marginLeft: 300,
    marginLeft: '75%',
  },
  searchIcon: {
    width: 30,
    height: 30,
    position: 'absolute',
    zIndex: 2,
    marginTop: 15,
    marginLeft: 16,
  },
  input: {
    backgroundColor: '#FFF',
    // width: 320,
    width: '75%',
    height: 60,
    marginLeft: 10,
    borderRadius: 10,
    // padding: 20,
    paddingLeft: 55,
    fontSize: 20,
  },
  addContact: {
    position: 'absolute',
    marginTop: 5,
    marginLeft: '80%',
  },
  delete: {
    marginLeft: 30,
  },
});
