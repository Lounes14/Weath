import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, ImageBackground, ActivityIndicator, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { getWeatherByCity } from '../../services/WeatherService';
import { saveSearch, getSearchHistory } from '../../services/StorageService';
import ShowIcon from '../../components/ShowIcon';

export default function SearchScreen() {
  const [city, setCity] = useState('');
  const [weather, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [history, setHistory] = useState([]);

  // Charger l'historique des recherches au démarrage
  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const searches = await getSearchHistory();
      setHistory(searches);
    } catch (err) {
      console.error("Erreur chargement historique:", err);
    }
  };

  const handleSearch = async () => {
    if (!city.trim()) return;

    setLoading(true);
    try {
      setErrorMsg(null);
      const data = await getWeatherByCity(city);
      setWeatherData(data);

      // Sauvegarder la recherche et mettre à jour l'historique
      const updatedHistory = await saveSearch(city);
      setHistory(updatedHistory);
    } catch (err) {
      console.error("Erreur recherche:", err);
      setErrorMsg("Ville non trouvée");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (item) => {
    setCity(item);
    handleSearch();
  };

  // Fonction pour grouper les prévisions par jour
  const groupForecastsByDay = () => {
    if (!weather || !weather.list) return {};

    const groupedData = weather.list.reduce((acc, forecast) => {
      const date = new Date(forecast.dt * 1000);
      const day = date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }); // Format : "DD/MM/YYYY"

      if (!acc[day]) acc[day] = [];

      acc[day].push({
        time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), // HH:MM
        temp: Math.round(forecast.main.temp),
        condition: forecast.weather[0].description,
        icon: forecast.weather[0].icon,
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
          <View style={styles.searchContainer}>
            <TextInput
                label="Entrez une ville"
                value={city}
                onChangeText={setCity}
                style={styles.input}
                mode="outlined"
            />
            <Button
                mode="contained"
                onPress={handleSearch}
                style={styles.button}
                disabled={loading || !city.trim()}
            >
              Rechercher
            </Button>
          </View>

          {/* Historique des recherches */}
          {history.length > 0 && (
              <View style={styles.historyContainer}>
                <Text style={styles.historyTitle}>Recherches récentes</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historyScroll}>
                  {history.map((item, index) => (
                      <TouchableOpacity
                          key={index}
                          style={styles.historyItem}
                          onPress={() => handleHistorySelect(item)}
                      >
                        <Text style={styles.historyItemText}>{item}</Text>
                      </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
          )}

          {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Chargement...</Text>
              </View>
          ) : errorMsg ? (
              <Text style={styles.errorText}>{errorMsg}</Text>
          ) : weather ? (
              <>
                <View style={styles.currentWeatherContainer}>
                  <Text style={styles.cityName}>{weather.city.name}</Text>
                  <Text style={styles.date}>{new Date(weather.list[0].dt * 1000).toLocaleDateString()}</Text>

                  {/* Icône météo */}
                  <ShowIcon icon={weather.list[0].weather[0].icon} size={80} />

                  <Text style={styles.temp}>{Math.round(weather.list[0].main.temp)}°C</Text>
                  <Text style={styles.description}>{weather.list[0].weather[0].description}</Text>
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
                                  <ShowIcon icon={item.icon} size={40} />
                                </View>
                            )}
                            showsHorizontalScrollIndicator={false}
                        />
                      </View>
                  ))}
                </View>
              </>
          ) : null}
        </ScrollView>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: "center",
    paddingBottom: 20,
  },
  searchContainer: {
    marginTop: 30,
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  button: {
    backgroundColor: "#4A87B9",
  },
  historyContainer: {
    marginTop: 10,
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    padding: 8,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  historyScroll: {
    flexDirection: "row",
  },
  historyItem: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  historyItemText: {
    color: "#333",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  loadingText: {
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    marginTop: 30,
    padding: 10,
    backgroundColor: "rgba(255, 0, 0, 0.3)",
    borderRadius: 5,
    color: "#fff",
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
    alignItems: "center",
  },
  cityName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  date: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
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
    textAlign: "center",
  },
});