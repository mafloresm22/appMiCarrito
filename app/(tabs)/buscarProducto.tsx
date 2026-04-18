import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { productosPeru } from '../../services/ProductosPeru';

export default function BuscarProductoScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [productos, setProductos] = useState<any[]>(productosPeru.slice(0, 10));
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

    const categories = ['Todos', ...new Set(productosPeru.map(p => p.categoria))];

    useEffect(() => {
        // Sincronizar productos seleccionados si vienen de crearProducto
        if (params.currentItems) {
            try {
                const current = JSON.parse(params.currentItems as string);
                setSelectedProducts(current);
            } catch (e) {
                console.error('Error sincronizando items:', e);
            }
        }
    }, [params.currentItems]);

    // Lógica de filtrado combinada
    useEffect(() => {
        const qL = query.toLowerCase().trim();
        let filtered = productosPeru;

        if (selectedCategory !== 'Todos') {
            filtered = filtered.filter(p => p.categoria === selectedCategory);
        }

        if (qL.length > 0) {
            filtered = filtered.filter(p =>
                p.nombre.toLowerCase().includes(qL) ||
                p.marca.toLowerCase().includes(qL)
            );
        }

        // Si no hay búsqueda ni categoría, limitamos a los 10 primeros por rendimiento visual inicial
        if (qL === '' && selectedCategory === 'Todos') {
            setProductos(productosPeru.slice(0, 10));
        } else {
            setProductos(filtered);
        }
    }, [query, selectedCategory]);

    const toggleProduct = (product: any) => {
        const isSelected = selectedProducts.some(p => p.id === product.id);
        if (isSelected) {
            setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
        } else {
            setSelectedProducts([...selectedProducts, product]);
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const isSelected = selectedProducts.some(p => p.id === item.id);

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => toggleProduct(item)}
                style={[styles.card, isSelected && styles.cardSelected]}
            >
                <View style={styles.imagePlaceholder}>
                    {item.imagen ? (
                        <Image
                            source={{ uri: item.imagen }}
                            style={styles.productImage}
                            resizeMode="contain"
                        />
                    ) : (
                        <MaterialCommunityIcons
                            name="package-variant"
                            size={40}
                            color="#16a34a"
                        />
                    )}
                    {isSelected && (
                        <View style={styles.selectionBadge}>
                            <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                        </View>
                    )}
                </View>
                <View style={styles.cardInfo}>
                    <View>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{item.categoria}</Text>
                        </View>
                        <Text style={styles.productName} numberOfLines={2}>{item.nombre}</Text>
                        <Text style={styles.productBrand}>{item.marca}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.addBtn, isSelected && styles.removeBtn]}
                        onPress={() => toggleProduct(item)}
                    >
                        <Ionicons
                            name={isSelected ? "remove-circle" : "add-circle"}
                            size={22}
                            color={isSelected ? "#ef4444" : "#16a34a"}
                        />
                        <Text style={[styles.addBtnText, isSelected && styles.removeBtnText]}>
                            {isSelected ? "Quitar" : "Añadir"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={[styles.topSection, { paddingTop: insets.top }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={26} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Buscar Producto</Text>
                    <View style={styles.badgeContainer}>
                        {selectedProducts.length > 0 && (
                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>{selectedProducts.length}</Text>
                            </View>
                        )}
                        <Ionicons name="cart-outline" size={26} color="#fff" />
                    </View>
                </View>

                <View style={styles.searchContainer}>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="search" size={20} color="#94a3b8" />
                        <TextInput
                            style={styles.input}
                            placeholder="Buscar producto (ej: Gloria, Arroz...)"
                            placeholderTextColor="#94a3b8"
                            value={query}
                            onChangeText={setQuery}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            returnKeyType="search"
                        />
                        {query.length > 0 && (
                            <TouchableOpacity onPress={() => setQuery('')}>
                                <Ionicons name="close-circle" size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Filtro de Categorías */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContainer}
                >
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            onPress={() => setSelectedCategory(cat)}
                            style={[
                                styles.catChip,
                                selectedCategory === cat && styles.catChipActive
                            ]}
                        >
                            <Text style={[
                                styles.catChipText,
                                selectedCategory === cat && styles.catChipTextActive
                            ]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={{ flex: 1 }}>
                {loading ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color="#16a34a" />
                        <Text style={styles.loadingText}>Buscando mejores opciones...</Text>
                    </View>
                ) : productos.length > 0 ? (
                    <FlatList
                        data={productos}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listPadding}
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior="automatic"
                    />
                ) : (
                    <View style={styles.centerContainer}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="search-outline" size={80} color="#e2e8f0" />
                        </View>
                        <Text style={styles.emptyTitle}>¿Qué necesitas hoy?</Text>
                        <Text style={styles.emptySubtitle}>Busca productos para agregarlos a tu lista de compras.</Text>
                    </View>
                )}
            </View>

            {selectedProducts.length > 0 && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={() => {
                            router.push({
                                pathname: '/crearProducto',
                                params: { items: JSON.stringify(selectedProducts) }
                            });
                        }}
                    >
                        <View style={styles.saveBtnContent}>
                            <Text style={styles.saveBtnText}>Añadir a la Lista</Text>
                            <View style={styles.saveBtnBadge}>
                                <Text style={styles.saveBadgeText}>{selectedProducts.length}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    topSection: {
        backgroundColor: '#16a34a',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        paddingBottom: 20,
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backBtn: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 0.5,
    },
    badgeContainer: {
        position: 'relative',
        padding: 5,
    },
    countBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#ef4444',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        borderWidth: 2,
        borderColor: '#16a34a',
    },
    countText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingTop: 5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 18,
        paddingHorizontal: 15,
        height: 56,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: '#1e293b',
        fontWeight: '500',
    },
    listPadding: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 100,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom: 16,
        padding: 12,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    cardSelected: {
        borderColor: '#16a34a',
        backgroundColor: '#f0fdf4',
    },
    imagePlaceholder: {
        width: 90,
        height: 90,
        borderRadius: 16,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    productImage: {
        width: '85%',
        height: '85%',
    },
    selectionBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    cardInfo: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'space-between',
    },
    categoryBadge: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 6,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
    },
    productName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1e293b',
        lineHeight: 20,
    },
    productBrand: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0fdf4',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    addBtnText: {
        marginLeft: 6,
        color: '#16a34a',
        fontWeight: '700',
        fontSize: 13,
    },
    removeBtn: {
        backgroundColor: '#fef2f2',
    },
    removeBtnText: {
        color: '#ef4444',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    saveBtn: {
        backgroundColor: '#16a34a',
        height: 60,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 8,
    },
    saveBtnContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    saveBtnBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    saveBadgeText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '800',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 15,
        color: '#64748b',
        fontWeight: '600',
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
    },
    emptyTitle: {
        fontSize: 19,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: 20,
    },
    categoriesContainer: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 5,
        gap: 10,
    },
    catChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    catChipActive: {
        backgroundColor: '#fff',
        borderColor: '#fff',
    },
    catChipText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
    },
    catChipTextActive: {
        color: '#16a34a',
    },
});
