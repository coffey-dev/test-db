import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = "https://pruebamvp-gurudev.turso.io/v2/pipeline";
    const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjU5OTU5NTAsImlkIjoiYzhhMjk3ZTItZjQ1My00OGE4LTkyYzMtODk2M2MwOWIyMGY3In0.adRmmmiWCg3N7ce0qVsSOIlNEd1nYei9KKW5_GaULxn82KeJUiWp57blwwhKbBhwaCZtkVjDA5WJ3Iu4kuCiDA";

    axios.post(url, {
      requests: [
        { type: "execute", stmt: { sql: "SELECT latitud, longitud, empresa FROM carnicerias" } },
        { type: "close" },
      ],
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        const data = response.data;
        if (data.results && data.results[0] && data.results[0].response && data.results[0].response.result && data.results[0].response.result.rows) {
          const filteredData = data.results[0].response.result.rows.slice(0, 3).map(row => ({
            latitud: row[0].value,
            longitud: row[1].value,
            empresa: row[2].value,
          }));
          setData(filteredData);
        } else {
          console.error("Unexpected response structure:", data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data:</Text>
      {data.map((item, index) => (
        <View key={index}>
          <Text style={styles.largeText}>Empresa: {item.empresa}</Text>
          <Text style={styles.largeText}>Latitud: {item.latitud}</Text>
          <Text style={styles.largeText}>Longitud: {item.longitud}</Text>
        </View>
      ))}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  largeText: {
    fontSize: 20,
  },
});
