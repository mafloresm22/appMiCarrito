import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AjustesModal from './ajustes';

export default function TabLayout() {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const insets = useSafeAreaInsets();

    return (
        <>
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#22c55e',
            tabBarInactiveTintColor: '#94a3b8',
            headerShown: false,
            tabBarStyle: {
                backgroundColor: '#ffffff',
                borderTopWidth: 1,
                borderTopColor: '#f1f5f9',
                height: Platform.OS === 'ios' ? 88 : 65 + insets.bottom,
                paddingBottom: Platform.OS === 'ios' ? 30 : insets.bottom + 10,
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
                name="listarProductos"
                options={{
                    title: 'Listas',
                    tabBarIcon: ({ color }) => <Ionicons name="list" size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="ajustes"
                options={{
                    title: 'Ajustes',
                    tabBarIcon: ({ color }) => <Ionicons name="settings" size={22} color={color} />,
                }}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        setIsMenuVisible(true);
                    },
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

        <AjustesModal 
            visible={isMenuVisible} 
            onClose={() => setIsMenuVisible(false)} 
        />
        </>
    );
}
