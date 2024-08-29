import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
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
            data.results.forEach(result => {
              if (result.response && result.response.result && result.response.result.rows) {
                console.log(result.response.result.rows); // Imprimir solo las filas
              }
            });
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
      <Text>Open up App.js to start working on your app!</Text>
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
  },
});
