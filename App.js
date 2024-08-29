import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList } from 'react-native';

export default function App() {
  const [names, setNames] = useState([]);

  useEffect(() => {
    const url = "https://prueba-gurudev.turso.io/v2/pipeline";
    const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjQ5NDI5MjYsImlkIjoiMjMzMTYwOTktYzE3OS00MmNlLTk1NTAtMzZkY2M2ODIzNjMxIn0.l-aGn0jaL_NUbfnjnkzt9fmAOIR8nVDaKCGdwg8oa5HMe5x1ZsKDAg7nX2h9xhCwGN98uDuiAP242qcUxwfpAQ";

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          { type: "execute", stmt: { sql: "SELECT * FROM mitabla LIMIT 10" } }, // Limitar a los primeros 10 registros
          { type: "close" },
        ],
      }),
    })
      .then((res) => res.text()) // Cambiar a .text() para ver la respuesta completa
      .then((text) => {
        try {
          const data = JSON.parse(text);
          if (data.results) {
            const extractedNames = [];
            data.results.forEach(result => {
              if (result.response && result.response.result && result.response.result.rows) {
                result.response.result.rows.forEach(row => {
                  if (row[1] && row[1].value) {
                    extractedNames.push(row[1].value); // Extraer el segundo valor (nombre)
                  }
                });
              }
            });
            setNames(extractedNames);
          } else {
            console.log("No results found");
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={names}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.nameText}>{item}</Text>}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50, // Espacio en blanco al inicio
  },
  nameText: {
    fontSize: 24, // Tamaño de la tipografía más grande
    textAlign: 'center', // Centrar el texto
    marginVertical: 10, // Espacio vertical entre los elementos
  },
});
