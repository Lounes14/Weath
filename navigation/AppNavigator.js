import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./TabNavigator";

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: "#4A87B9",
                    },
                    headerTintColor: "#fff",
                    drawerActiveTintColor: "#4A87B9",
                }}
            >
                <Drawer.Screen
                    name="SunForecast"
                    component={TabNavigator}
                    options={{
                        title: "Sun Forecast",
                        headerShown: true
                    }}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}