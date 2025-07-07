import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ShowIcon from "./ShowIcon";

const Weather = ({ forecast }) => {
  const { main, weather, dt_txt } = forecast;
  const time = dt_txt.split(" ")[1]; // Récupère uniquement l'heure
  const temp = main?.temp || "N/A";
  const description = weather?.[0]?.description || "Non disponible";
  const icon = weather?.[0]?.icon || "01d";

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{time}</Text>
      <ShowIcon icon={icon} size={50} />
      <Text style={styles.temp}>{Math.round(temp)}°C</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    margin: 10,
  },
  time: {
    fontSize: 14,
    fontWeight: "bold",
  },
  temp: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
    fontStyle: "italic",
  },
});

export default Weather;
