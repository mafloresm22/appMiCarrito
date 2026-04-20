import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomAlert from '../../components/customAlert';
import { APP_MESSAGES } from '../../constants/mensajes';
import { supabase } from '../../services/supabase';

import { useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import { styles } from '../../assets/styles/index.styles';
import { useFiltrarLista } from '../../hooks/filtrarLista';
import { useProfile } from '../../hooks/perfil';

export default function HomeScreen() {
    const router = useRouter();
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();
    const { profile } = useProfile();

    const {
        groupedLists,
        fetchProducts,
        allProducts
    } = useFiltrarLista();

    useEffect(() => {
        if (isFocused) {
            fetchProducts();
        }
    }, [isFocused]);

    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        type: 'info' as any,
        icon: '',
        color: '#000',
        onClose: () => { },
    });

    const showAlert = (config: any, onOk?: () => void) => {
        setAlertConfig({
            visible: true,
            title: config.title,
            message: config.message,
            type: config.type,
            icon: config.icon,
            color: config.color,
            onClose: () => {
                setAlertConfig(prev => ({ ...prev, visible: false }));
                if (onOk) onOk();
            }
        });
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            showAlert(APP_MESSAGES.AUTH.LOGOUT_ERROR);
        } else {
            router.replace('/(auth)/login');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={styles.scrollContainer}>
                {/* Header */}
                <View style={styles.headerBackground}>
                    <SafeAreaView edges={['top']}>
                        <View style={styles.headerTop}>
                            <View style={styles.headerInfo}>
                                <Text style={styles.welcomeText}>¡Hola, {profile.username || 'Usuario'}!</Text>
                                <Text style={styles.headerTitle}>Mi<Text style={{ fontWeight: '800' }}>Carrito</Text></Text>
                            </View>
                            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                                <Ionicons name="log-out-outline" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>

                    {/* Iconos */}
                    <MaterialCommunityIcons name="leaf" size={60} color="rgba(255,255,255,0.15)" style={styles.bgIcon1} />
                    <MaterialCommunityIcons name="cart" size={80} color="rgba(255,255,255,0.15)" style={styles.bgIcon2} />

                    <View style={styles.headerCurve} />
                </View>

                {/* Contenido Principal */}
                <View style={styles.contentBody}>

                    {/* Estadisticas */}
                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <View style={[styles.statCircle, { backgroundColor: '#f0fdf4' }]}>
                                <Ionicons name="list" size={20} color="#15803d" />
                            </View>
                            <Text style={styles.statValue}>{groupedLists.length}</Text>
                            <Text style={styles.statLabel}>Listas</Text>
                        </View>
                        <View style={styles.statBox}>
                            <View style={[styles.statCircle, { backgroundColor: '#eff6ff' }]}>
                                <Ionicons name="basket" size={20} color="#1d4ed8" />
                            </View>
                            <Text style={styles.statValue}>{allProducts.length}</Text>
                            <Text style={styles.statLabel}>Ítems</Text>
                        </View>
                        <View style={styles.statBox}>
                            <View style={[styles.statCircle, { backgroundColor: '#fff7ed' }]}>
                                <Ionicons name="time" size={20} color="#c2410c" />
                            </View>
                            <Text style={styles.statValue}>0m</Text>
                            <Text style={styles.statLabel}>Tiempo</Text>
                        </View>
                    </View>

                    {/* Añadido Rápido */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Añadido <Text style={styles.boldText}>Rápido</Text></Text>
                        <View style={styles.searchInputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej: Manzanas 2kg..."
                                placeholderTextColor="#94a3b8"
                            />
                            <TouchableOpacity style={styles.addInlineBtn}>
                                <Ionicons name="add" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Categorias */}
                    <View style={{ marginTop: 10 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsPadding}>
                            {['Todas', 'Frutas', 'Lácteos', 'Limpieza', 'Carnes'].map((category, index) => (
                                <TouchableOpacity
                                    key={category}
                                    style={[styles.chip, index === 0 && styles.activeChip]}
                                >
                                    <Text style={[styles.chipText, index === 0 && styles.activeChipText]}>{category}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Lista */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Tus <Text style={styles.boldText}>Listas Recientes</Text></Text>
                            {groupedLists.length > 0 && (
                                <TouchableOpacity onPress={() => router.push('/listarProductos')}>
                                    <Text style={{ color: '#16a34a', fontWeight: '600' }}>Ver todas</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {groupedLists.length === 0 ? (
                            <View style={styles.emptyState}>
                                <View style={styles.emptyIconContainer}>
                                    <MaterialCommunityIcons name="clipboard-text-outline" size={60} color="#cbd5e1" />
                                </View>
                                <Text style={styles.emptyTitle}>No hay listas creadas aún</Text>
                                <Text style={styles.emptySubtitle}>Comienza pulsando el botón + para crear tu primera lista de compras.</Text>
                            </View>
                        ) : (
                            groupedLists.slice(0, 2).map((group, index) => {
                                const date = new Date(group[0].created_at);
                                const dateStr = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
                                const timeStr = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.listCard}
                                        onPress={() => router.push('/listarProductos')}
                                    >
                                        <View style={styles.cardImagePlaceholder}>
                                            <MaterialCommunityIcons name="shopping-outline" size={22} color="#16a34a" />
                                        </View>
                                        <View style={styles.cardContent}>
                                            <Text style={styles.cardTitle}>{dateStr} - {timeStr}</Text>
                                            <Text style={styles.cardSubtitle}>{group.length} ítems • Lista de compra</Text>
                                        </View>
                                        <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Botón crear Lista */}
            <View style={styles.fabContainer}>
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => router.push('/crearProducto' as any)}
                >
                    <Ionicons name="add" size={35} color="#fff" />
                </TouchableOpacity>
            </View>

            <CustomAlert {...alertConfig} />
        </View>
    );
}
