import React, { useState, useEffect } from "react";
import { StyleSheet, View, ImageBackground, ScrollView, Text, TouchableOpacity, FlatList } from "react-native";
import { getWeatherByCity } from "../services/WeatherService";
import { saveSearch, getSearchHistory } from "../services/StorageService";
import SearchBar from "../components/SearchBar";
import CurrentWeather from "../components/CurrentWeather";
import { Chip } from "react-native-paper";

export default function SearchScreen() {
    const [weatherData, setWeatherData] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [searchHistory, setSearchHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // Charger l'historique des recherches au démarrage
    useEffect(() => {
        loadSearchHistory();
    }, []);

    const loadSearchHistory = async () => {
        const history = await getSearchHistory();
        setSearchHistory(history);
    };

    // Fonction de recherche par ville
    const handleSearch = async (city) => {
        if (!city.trim()) return;

        setLoading(true);
        try {
            setErrorMsg(null);
            const data = await getWeatherByCity(city);
            setWeatherData(data);

            // Sauvegarder la recherche dans l'historique
            const updatedHistory = await saveSearch(city);
            setSearchHistory(updatedHistory);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setErrorMsg("Ville non trouvée");
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    };

    // Utiliser une ville de l'historique
    const handleHistorySelect = (city) => {
        handleSearch(city);
    };

    // Grouper les prévisions par jour
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
            source={require("../assets/images/background.jpg")}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.searchContainer}>
                    <SearchBar onSearch={handleSearch} />
                </View>

                {/* Historique des recherches */}
                {searchHistory.length > 0 && (
                    <View style={styles.historyContainer}>
                        <Text style={styles.historyTitle}>Recherches récentes:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
                            {searchHistory.map((city, index) => (
                                <Chip
                                    key={index}
                                    style={styles.chip}
                                    onPress={() => handleHistorySelect(city)}
                                    mode="outlined"
                                >
                                    {city}
                                </Chip>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {loading ? (
                    <Text style={styles.text}>Chargement...</Text>
                ) : errorMsg ? (
                    <Text style={styles.errorText}>{errorMsg}</Text>
                ) : weatherData ? (
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
                ) : null}
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
        width: "100%",
    },
    searchContainer: {
        marginTop: 20,
        width: "90%",
        alignItems: "center",
    },
    historyContainer: {
        width: "90%",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    chipsContainer: {
        flexDirection: "row",
        marginBottom: 5,
    },
    chip: {
        margin: 4,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    text: {
        fontSize: 18,
        marginTop: 20,
        textAlign: "center",
        color: "#fff",
    },
    errorText: {
        fontSize: 18,
        marginTop: 20,
        textAlign: "center",
        color: "#ff6b6b",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: 10,
        borderRadius: 5,
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
        marginTop: 10,
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