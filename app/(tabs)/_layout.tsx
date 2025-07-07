import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#4A87B9' }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Accueil',
                    tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="rain"
                options={{
                    title: 'Prévisions de pluie',
                    tabBarIcon: ({ color }) => <Ionicons name="rainy" size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Recherche',
                    tabBarIcon: ({ color }) => <Ionicons name="search" size={28} color={color} />,
                }}
            />
        </Tabs>
    );
}