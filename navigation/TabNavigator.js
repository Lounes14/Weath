import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import RainMapScreen from "../screens/RainMapScreen";
import SearchScreen from "../screens/SearchScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Home") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "RainMap") {
                        iconName = focused ? "rainy" : "rainy-outline";
                    } else if (route.name === "Search") {
                        iconName = focused ? "search" : "search-outline";
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#4A87B9",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "Accueil" }}
            />
            <Tab.Screen
                name="RainMap"
                component={RainMapScreen}
                options={{ title: "Prévisions de pluie" }}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{ title: "Recherche" }}
            />
        </Tab.Navigator>
    );
}