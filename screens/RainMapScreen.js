import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import MapView, { UrlTile } from "react-native-maps";

// Utilisons la clé API déjà définie dans votre service
const API_KEY = "d6def4924ad5f9a9b59f3ae895b234cb";

export default function RainMapScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Prévisions de pluie</Text>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 46.603354, // Centre de la France
                    longitude: 1.888334,
                    latitudeDelta: 8,
                    longitudeDelta: 8,
                }}
            >
                <UrlTile
                    urlTemplate={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
                    zIndex={1}
                    opacity={0.6}
                />
            </MapView>
            <Text style={styles.legend}>
                Carte des précipitations en temps réel
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 10,
    },
    map: {
        width: Dimensions.get("window").width * 0.9,
        height: Dimensions.get("window").height * 0.7,
        borderRadius: 10,
        overflow: "hidden",
    },
    legend: {
        margin: 10,
        textAlign: "center",
        fontSize: 14,
        color: "#555",
    },
});