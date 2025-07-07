import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import Weather from "./Weather";

const ForecastWeather = ({ data }) => {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    if (data && data.list) {
      // Grouper les prévisions par jour
      const groupedForecast = [];
      data.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0]; // Récupère la date uniquement
        const existingDate = groupedForecast.find((f) => f.date === date);
        if (!existingDate) {
          groupedForecast.push({
            date,
            details: item, // Utilise la première prévision de la journée
          });
        }
      });
      setForecast(groupedForecast);
    }
  }, [data]);

  return (
    <ScrollView horizontal style={styles.container}>
      {forecast.map((day, index) => (
        <View key={index} style={styles.dayContainer}>
          <Text style={styles.date}>{day.date}</Text>
          <Weather forecast={day.details} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  dayContainer: {
    marginRight: 15,
    alignItems: "center",
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default ForecastWeather;
