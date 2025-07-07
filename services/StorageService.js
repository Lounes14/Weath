import AsyncStorage from "@react-native-async-storage/async-storage";

const SEARCH_HISTORY_KEY = "SEARCH_HISTORY";

// Enregistrer une ville recherchée
export const saveSearch = async (city) => {
    try {
        // Récupérer l'historique existant
        const history = await getSearchHistory();

        // Éviter les doublons
        if (history.includes(city)) {
            // Si la ville existe déjà, la supprimer pour la remettre en premier
            const filteredHistory = history.filter(item => item !== city);
            // Ajouter la ville en première position
            const newHistory = [city, ...filteredHistory];
            // Limiter à 10 entrées
            const limitedHistory = newHistory.slice(0, 10);

            await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(limitedHistory));
            return limitedHistory;
        } else {
            // Si la ville n'existe pas, l'ajouter en première position
            const newHistory = [city, ...history];
            // Limiter à 10 entrées
            const limitedHistory = newHistory.slice(0, 10);

            await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(limitedHistory));
            return limitedHistory;
        }
    } catch (error) {
        console.error("Error saving search:", error);
        return [];
    }
};

// Récupérer l'historique des recherches
export const getSearchHistory = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
        return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (error) {
        console.error("Error getting search history:", error);
        return [];
    }
};