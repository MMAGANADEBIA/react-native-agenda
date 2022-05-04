import { StatusBar } from 'react-native';
StatusBar.setBarStyle('light-contect', true);
StatusBar.setBackgroundColor('#14191f');
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';

const db = SQLite.openDatabase('contacts.db');
// const db = SQLite.openDatabase('contact.db');

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
    let data = JSON.stringify(contacts);
    // console.log('Contactos: ' + data);
    // console.log(contacts);
    console.log(data);
  }

  useEffect(() => {
    createTableIfNotExist();
    // getData();
    // console.log(contacts.data)
  }, [])

  return (
    <View style={styles.container}>
      <View>
        <Button title="Agregar contacto" onPress={addContact} />
        {/* <Button title="Data" onPress={getData} /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#14191f',
  },
  button: {
    alignItems: "center",
    backgroundColor: "#000000",
    padding: 10,
    height: 100,
    width: 100
  }
});
