import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import ShowIcon from "./ShowIcon"; // Ce composant sera utilisé pour afficher l'icône de la météo.

const CurrentWeather = ({ data }) => {
  const [currentWeather, setCurrentWeather] = useState(null);

  useEffect(() => {
    if (data && data.list && data.list.length > 0) {
      // Récupère les données météo pour le moment actuel.
      setCurrentWeather(data.list[0]);
    }
  }, [data]);

  if (!currentWeather) {
    return <Text>Chargement...</Text>;
  }

  // Extraction des informations nécessaires.
  const { main, weather, dt_txt } = currentWeather; // `main` pour la température, `weather` pour la description.
  const { temp } = main;
  const description = weather[0]?.description;
  const icon = weather[0]?.icon;

  return (
    <View style={styles.container}>
      <Text style={styles.city}>{data.city.name}</Text>
      <Text style={styles.date}>{dt_txt.split(" ")[0]}</Text>
      <ShowIcon icon={icon} size={80} />
      <Text style={styles.temp}>{Math.round(temp)}°C</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  city: {
    fontSize: 24,
    fontWeight: "bold",
  },
  date: {
    fontSize: 16,
    color: "#666",
  },
  temp: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FF8C00",
  },
  description: {
    fontSize: 18,
    fontStyle: "italic",
  },
});

export default CurrentWeather;
