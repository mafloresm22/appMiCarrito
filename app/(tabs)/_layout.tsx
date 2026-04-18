import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#22c55e',
            tabBarInactiveTintColor: '#94a3b8',
            headerShown: false,
            tabBarStyle: {
                backgroundColor: '#ffffff',
                borderTopWidth: 1,
                borderTopColor: '#f1f5f9',
                height: Platform.OS === 'ios' ? 88 : 65,
                paddingBottom: Platform.OS === 'ios' ? 30 : 10,
                paddingTop: 10,
                elevation: 0,
                shadowOpacity: 0,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '600',
            }
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color }) => <Ionicons name="home" size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="listas"
                options={{
                    title: 'Listas',
                    tabBarIcon: ({ color }) => <Ionicons name="list" size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="recordatorios"
                options={{
                    title: 'Avisos',
                    tabBarIcon: ({ color }) => <Ionicons name="notifications" size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="ajustes"
                options={{
                    title: 'Ajustes',
                    tabBarIcon: ({ color }) => <Ionicons name="settings" size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="buscarProducto"
                options={{
                    href: null,
                    tabBarStyle: { display: 'none' },
                }}
            />
            <Tabs.Screen
                name="crearProducto"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
