import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../../assets/styles/listarProductos.styles';
import { useCambiarEstado } from '../../hooks/cambiarEstadoLista';
import { useFiltrarLista } from '../../hooks/filtrarLista';

// Colores pasteles para las listas
const COLORES = [
    { bg: '#dcfce7', icon: '#166534', main: '#10b981' },
    { bg: '#dbeafe', icon: '#1e40af', main: '#3b82f6' },
    { bg: '#fef3c7', icon: '#92400e', main: '#f59e0b' },
    { bg: '#f3e8ff', icon: '#6b21a8', main: '#a855f7' },
    { bg: '#fee2e2', icon: '#991b1b', main: '#ef4444' },
];

export default function ListarProductosScreen() {
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();
    const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set([0]));
    const { marcarComoCompletado } = useCambiarEstado();

    const {
        loading,
        refreshing,
        setRefreshing,
        allProducts,
        groupedLists,
        activeFilter,
        setActiveFilter,
        fetchProducts,
        applyFilter
    } = useFiltrarLista();

    const handleMarcarCompletado = async (id: string) => {
        const { success } = await marcarComoCompletado(id);
        if (success) {
            fetchProducts();
        }
    };

    const handleMarcarGrupoCompletado = async (group: any[]) => {
        const ids = group.filter(item => item.comprado?.toLowerCase() !== 'completado').map(item => item.id);
        if (ids.length === 0) return;

        const { success } = await marcarComoCompletado(ids);
        if (success) {
            fetchProducts();
        }
    };

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

    const onRefresh = () => {
        setRefreshing(true);
        fetchProducts();
    };

    const toggleGroup = (index: number) => {
        const newExpanded = new Set(expandedGroups);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedGroups(newExpanded);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.topSection, { paddingTop: insets.top }]}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Mi Lista de Compras</Text>
                </View>

                {/* Filtros */}
                <View style={styles.filterContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                        {['Todas', 'pendiente', 'completado'].map((filter) => (
                            <TouchableOpacity
                                key={filter}
                                onPress={() => setActiveFilter(filter)}
                                style={[
                                    styles.filterChip,
                                    activeFilter === filter && styles.filterChipActive
                                ]}
                            >
                                <Text style={[
                                    styles.filterText,
                                    activeFilter === filter && styles.filterTextActive
                                ]}>
                                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#16a34a']} />
                }
            >
                {loading && !refreshing ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#16a34a" />
                        <Text style={styles.loadingText}>Organizando tus listas...</Text>
                    </View>
                ) : groupedLists.length > 0 ? (
                    groupedLists.map((group, index) => {
                        const colorSet = COLORES[index % COLORES.length];
                        const date = formatDate(group[0].created_at);
                        const time = formatTime(group[0].created_at);
                        const isExpanded = expandedGroups.has(index);
                        const allCompleted = group.every(item => item.comprado?.toLowerCase() === 'completado');

                        return (
                            <Animated.View
                                key={`${activeFilter}-${index}`}
                                entering={FadeInDown.delay(index * 100).duration(500)}
                                style={styles.groupContainer}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => toggleGroup(index)}
                                    style={[styles.groupHeader, !isExpanded && { marginBottom: 0, borderBottomWidth: 0 }]}
                                >
                                    <View style={styles.groupInfo}>
                                        <View style={[styles.calendarIcon, { backgroundColor: colorSet.bg }]}>
                                            <Ionicons name="calendar" size={20} color={colorSet.icon} />
                                        </View>
                                        <View>
                                            <Text style={styles.groupDate}>{date}</Text>
                                            <Text style={styles.groupTime}>{time}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={styles.itemCountBadge}>
                                            <Text style={styles.itemCountText}>{group.length} items</Text>
                                        </View>

                                        {!allCompleted && (
                                            <TouchableOpacity
                                                style={styles.completeAllBtn}
                                                onPress={() => handleMarcarGrupoCompletado(group)}
                                            >
                                                <Ionicons name="checkmark-done" size={16} color="#16a34a" />
                                                <Text style={styles.completeAllText}>Todo</Text>
                                            </TouchableOpacity>
                                        )}

                                        <Ionicons
                                            name={isExpanded ? "chevron-up" : "chevron-down"}
                                            size={20}
                                            color="#94a3b8"
                                            style={{ marginLeft: 8 }}
                                        />
                                    </View>
                                </TouchableOpacity>

                                {isExpanded && (
                                    <View style={styles.productsList}>
                                        {group.map((item, pIndex) => (
                                            <View key={item.id || pIndex} style={styles.productItem}>
                                                <View style={styles.productIcon}>
                                                    {item.imagen_url ? (
                                                        <Image
                                                            source={{ uri: item.imagen_url }}
                                                            style={styles.productImage}
                                                            defaultSource={require('../../assets/images/icon.png')}
                                                        />
                                                    ) : (
                                                        <MaterialCommunityIcons name="shopping" size={20} color="#16a34a" />
                                                    )}
                                                </View>
                                                <View style={styles.productDetails}>
                                                    <Text style={styles.productName}>{item.nombre}</Text>
                                                    <Text style={styles.productMeta}>Cantidad: {item.cantidad}</Text>
                                                </View>
                                                <View style={[
                                                    styles.statusBadge, 
                                                    { backgroundColor: (item.comprado?.toLowerCase() === 'completado') ? '#dcfce7' : '#fef3c7' }
                                                ]}>
                                                    <Text style={[
                                                        styles.statusText, 
                                                        { color: (item.comprado?.toLowerCase() === 'completado') ? '#166534' : '#92400e' }
                                                    ]}>
                                                        {item.comprado}
                                                    </Text>
                                                </View>

                                                {(item.comprado?.toLowerCase() !== 'completado') && (
                                                    <TouchableOpacity 
                                                        style={styles.checkBtn}
                                                        onPress={() => handleMarcarCompletado(item.id)}
                                                    >
                                                        <Ionicons name="checkmark" size={18} color="#94a3b8" />
                                                    </TouchableOpacity>
                                                )}
                                                {(item.comprado?.toLowerCase() === 'completado') && (
                                                    <View style={[styles.checkBtn, styles.checkBtnSuccess]}>
                                                        <Ionicons name="checkmark" size={18} color="#fff" />
                                                    </View>
                                                )}
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </Animated.View>
                        );
                    })
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={80} color="#e2e8f0" />
                        <Text style={styles.emptyTitle}>
                            {activeFilter === 'Todas' ? 'No hay compras registradas' : `No hay ítems registrados como "${activeFilter}"`}
                        </Text>
                        <Text style={styles.emptySubtitle}>
                            {activeFilter === 'Todas'
                                ? 'Las listas que guardes aparecerán aquí agrupadas.'
                                : `Prueba cambiando el filtro o añade nuevos productos.`}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
