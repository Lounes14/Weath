import React from 'react';
import { StyleSheet, View, Text, Dimensions, ImageBackground } from 'react-native';
import MapView, { UrlTile } from 'react-native-maps';

// Clé API OpenWeatherMap (utilisez celle de votre WeatherService)
const API_KEY = "d6def4924ad5f9a9b59f3ae895b234cb";

export default function RainMapScreen() {
    return (
        <ImageBackground
            source={require('../../assets/images/rainMap.jpg')}
            style={styles.container}
        >
            <View style={styles.mapContainer}>
                <Text style={styles.title}>Carte des précipitations</Text>
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
                <View style={styles.legendContainer}>
                    <Text style={styles.legendTitle}>Légende</Text>
                    <View style={styles.legendItems}>
                        <View style={[styles.legendColor, { backgroundColor: 'rgba(0, 160, 255, 0.5)' }]} />
                        <Text style={styles.legendText}>Légère</Text>

                        <View style={[styles.legendColor, { backgroundColor: 'rgba(0, 112, 255, 0.5)' }]} />
                        <Text style={styles.legendText}>Modérée</Text>

                        <View style={[styles.legendColor, { backgroundColor: 'rgba(0, 0, 255, 0.5)' }]} />
                        <Text style={styles.legendText}>Forte</Text>
                    </View>
                    <Text style={styles.legendNote}>
                        * Intensité des précipitations en temps réel
                    </Text>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    map: {
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.6,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    legendContainer: {
        backgroundColor: 'rgba(144, 174, 215, 0.7)',
        borderRadius: 10,
        padding: 15,
        marginTop: 20,
        width: '90%',
    },
    legendTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
    },
    legendItems: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    legendColor: {
        width: 20,
        height: 20,
        borderRadius: 5,
        marginHorizontal: 5,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: 'white',
    },
    legendText: {
        color: 'white',
        marginRight: 15,
    },
    legendNote: {
        fontSize: 12,
        color: 'white',
        fontStyle: 'italic',
        marginTop: 10,
        textAlign: 'center',
    },
});