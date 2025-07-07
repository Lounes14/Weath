import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ImageBackground, ScrollView, FlatList } from "react-native";
import * as Location from "expo-location";
import { getWeatherByCoordinates } from "../../services/WeatherService";
import CurrentWeather from "../../components/CurrentWeather";

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Récupération des données météo actuelles et des prévisions
  useEffect(() => {
    const getLocationData = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      try {
        const data = await getWeatherByCoordinates(
            currentLocation.coords.latitude,
            currentLocation.coords.longitude
        );
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data: ", error);
        setErrorMsg("Unable to fetch weather data.");
      }
    };

    getLocationData();
  }, []);

  // Fonction pour grouper les prévisions par jour
  const groupForecastsByDay = () => {
    if (!weatherData || !weatherData.list) return {};

    const groupedData = weatherData.list.reduce((acc, forecast) => {
      const date = new Date(forecast.dt * 1000);
      const day = date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

      if (!acc[day]) acc[day] = [];

      acc[day].push({
        time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        temp: Math.round(forecast.main.temp),
        condition: forecast.weather[0].description,
        icon: `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`,
      });

      return acc;
    }, {});

    return groupedData;
  };

  const forecastGroupedByDay = groupForecastsByDay();

  return (
      <ImageBackground
          source={require("../../assets/images/background.jpg")}
          style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {weatherData ? (
              <>
                <View style={styles.currentWeatherContainer}>
                  <CurrentWeather data={weatherData} />
                </View>
                <View style={styles.forecastContainer}>
                  <Text style={styles.forecastTitle}>Prévisions sur 5 jours</Text>
                  {Object.entries(forecastGroupedByDay).map(([day, forecasts], index) => (
                      <View key={index} style={styles.dayContainer}>
                        <Text style={styles.dayTitle}>{day}</Text>
                        <FlatList
                            horizontal
                            data={forecasts}
                            keyExtractor={(_, idx) => idx.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.forecastCard}>
                                  <Text style={styles.forecastTime}>{item.time}</Text>
                                  <Text style={styles.forecastTemp}>{item.temp}°C</Text>
                                  <Text style={styles.forecastCondition}>{item.condition}</Text>
                                  <ImageBackground
                                      source={{ uri: item.icon }}
                                      style={styles.weatherIcon}
                                  />
                                </View>
                            )}
                            showsHorizontalScrollIndicator={false}
                        />
                      </View>
                  ))}
                </View>
              </>
          ) : (
              <Text style={styles.text}>{errorMsg || "Chargement..."}</Text>
          )}
        </ScrollView>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingBottom: 20,
    paddingTop: 20, // Ajusté pour compenser l'absence de la barre de recherche
  },
  text: {
    fontSize: 18,
    marginTop: 20,
    textAlign: "center",
    color: "#fff",
  },
  currentWeatherContainer: {
    backgroundColor: "rgba(144, 174, 215, 0.7)",
    borderRadius: 10,
    padding: 10,
    width: "70%",
    marginTop: 20,
    marginBottom: 20,
  },
  forecastContainer: {
    marginTop: 20,
    backgroundColor: "rgba(144, 174, 215, 0.7)",
    padding: 10,
    borderRadius: 10,
    width: "90%",
    marginBottom: 20,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  dayContainer: {
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 10,
  },
  forecastCard: {
    backgroundColor: "rgba(255, 255, 255, 0.23)",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    alignItems: "center",
    width: 100,
  },
  forecastTime: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  forecastTemp: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  forecastCondition: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginTop: 5,
  },
});