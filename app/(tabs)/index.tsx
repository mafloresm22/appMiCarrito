import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomAlert from '../../components/customAlert';
import { APP_MESSAGES } from '../../constants/mensajes';
import { supabase } from '../../services/supabase';

import { useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import { styles } from '../../assets/styles/index.styles';
import { useFiltrarLista } from '../../hooks/filtrarLista';
import { useObtenerCategorias } from '../../hooks/obtenerCategoria';
import { useProfile } from '../../hooks/perfil';

export default function HomeScreen() {
    const router = useRouter();
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();
    const { profile } = useProfile();

    const {
        groupedLists,
        fetchProducts,
        allProducts,
        activeFilter,
        setActiveFilter,
        applyFilter
    } = useFiltrarLista();

    const { categorias } = useObtenerCategorias();

    useEffect(() => {
        if (isFocused) {
            fetchProducts();
        }
    }, [isFocused, fetchProducts]);

    useEffect(() => {
        if (allProducts.length > 0) {
            applyFilter(allProducts, activeFilter);
        }
    }, [activeFilter, allProducts, applyFilter]);

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

                    {/* Estadísticas */}
                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <View style={[styles.statCircle, { backgroundColor: '#f0fdf4' }]}>
                                <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#16a34a" />
                            </View>
                            <View style={styles.statInfo}>
                                <Text style={styles.statValue}>{groupedLists.length}</Text>
                                <Text style={styles.statLabel}>Listas activas</Text>
                            </View>
                        </View>
                        
                        <View style={styles.separator} />

                        <View style={styles.statBox}>
                            <View style={[styles.statCircle, { backgroundColor: '#eff6ff' }]}>
                                <MaterialCommunityIcons name="basket-outline" size={24} color="#2563eb" />
                            </View>
                            <View style={styles.statInfo}>
                                <Text style={styles.statValue}>{allProducts.length}</Text>
                                <Text style={styles.statLabel}>Productos</Text>
                            </View>
                        </View>
                    </View>


                    {/* Categorias */}
                    <View style={{ marginTop: 10 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsPadding}>
                            <TouchableOpacity
                                style={[styles.chip, activeFilter === 'Todas' && styles.activeChip]}
                                onPress={() => setActiveFilter('Todas')}
                            >
                                <Text style={[styles.chipText, activeFilter === 'Todas' && styles.activeChipText]}>Todas</Text>
                            </TouchableOpacity>
                            {categorias.map((category) => (
                                <TouchableOpacity
                                    key={category.idcategorias}
                                    style={[styles.chip, activeFilter === category.nombre && styles.activeChip]}
                                    onPress={() => setActiveFilter(category.nombre)}
                                >
                                    <Text style={[styles.chipText, activeFilter === category.nombre && styles.activeChipText]}>
                                        {category.nombre}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Lista */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Últimos <Text style={styles.boldText}>Productos</Text></Text>
                            {allProducts.length > 0 && (
                                <TouchableOpacity onPress={() => router.push('/listarProductos')}>
                                    <Text style={{ color: '#16a34a', fontWeight: '600' }}>Ver todo</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {groupedLists.length === 0 ? (
                            <View style={styles.emptyState}>
                                <View style={styles.emptyIconContainer}>
                                    <MaterialCommunityIcons name="clipboard-text-outline" size={60} color="#cbd5e1" />
                                </View>
                                <Text style={styles.emptyTitle}>No hay productos aún</Text>
                                <Text style={styles.emptySubtitle}>
                                    {activeFilter === 'Todas' 
                                        ? 'Agrega productos a tu carrito pulsando el botón +.' 
                                        : `No hay productos en la categoría "${activeFilter}".`}
                                </Text>
                            </View>
                        ) : (
                            groupedLists.flat().slice(0, 5).map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.listCard}
                                        onPress={() => router.push('/listarProductos')}
                                    >
                                        <View style={styles.cardImagePlaceholder}>
                                            {item.imagen_url ? (
                                                <Image source={{ uri: item.imagen_url }} style={styles.productImg} />
                                            ) : (
                                                <MaterialCommunityIcons name="food-apple-outline" size={22} color="#16a34a" />
                                            )}
                                        </View>
                                        <View style={styles.cardContent}>
                                            <Text style={styles.cardTitle}>{item.nombre}</Text>
                                            <Text style={styles.cardSubtitle}>
                                                {item.cantidad} {item.cantidad > 1 ? 'unidades' : 'unidad'} • {item.comprado || 'Pendiente'}
                                            </Text>
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
