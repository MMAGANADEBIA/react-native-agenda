import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';

const db = SQLite.openDatabase('../database/contacts.db');
// const db = SQLite.openDatabase('../database/db.sqlite');

export default function Home({ navigation }) {
  const [contacts, setContacts] = useState("");

  const newNote = () => {
    navigation.navigate('addContact')
  }

  const getData = () => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM contacts",
        [],
        (_, { rows: { _array } }) => setContacts(_array),
        () => console.log("error fetching")
      );
    })
    console.log(contacts);
  }

  useEffect(() => {
    getData();
  })

  return (
    <View style={styles.container}>
      <View>
        <Button title="Agregar contacto" onPress={newNote} />
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
  },
  button: {
    alignItems: "center",
    backgroundColor: "#000000",
    padding: 10,
    height: 100,
    width: 100
  }
});
