import React, { useEffect, useState } from "react";
import { StyleSheet, View, ImageBackground, ScrollView, Text } from "react-native";
import * as Location from "expo-location";
import { getWeatherByCoordinates } from "../services/WeatherService";
import CurrentWeather from "../components/CurrentWeather";

export default function HomeScreen() {
    const [location, setLocation] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

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

    return (
        <ImageBackground
            source={require("../assets/images/background.jpg")}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.content}>
                {weatherData ? (
                    <View style={styles.currentWeatherContainer}>
                        <CurrentWeather data={weatherData} />
                    </View>
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
        paddingTop: 20,
        paddingBottom: 20,
        width: "100%",
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
        padding: 15,
        width: "80%",
        marginTop: 20,
        alignItems: "center",
    },
});