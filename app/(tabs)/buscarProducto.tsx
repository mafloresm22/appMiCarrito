import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Keyboard,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../../assets/styles/buscarProducto.styles';
import { productosPeru } from '../../services/ProductosPeru';

export default function BuscarProductoScreen() {
    const router = useRouter();
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [productos, setProductos] = useState<any[]>(productosPeru.slice(0, 10));
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

    const categories = ['Todos', ...new Set(productosPeru.map(p => p.categoria))];

    useEffect(() => {
        if (isFocused) {
            setQuery('');
        }
    }, [isFocused]);

    useEffect(() => {
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

        // Mostrar los 10 primeros productos
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
        <Animated.View
            key={`buscar-${isFocused}`}
            entering={FadeInDown.duration(600).delay(100)}
            style={styles.container}
        >
            <Animated.View entering={FadeInDown.delay(200).duration(600)} style={[styles.topSection, { paddingTop: insets.top }]}>
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
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(400).duration(600)} style={{ flex: 1 }}>
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
            </Animated.View>

            {selectedProducts.length > 0 && (
                <Animated.View entering={FadeInUp.delay(300)} style={styles.footer}>
                    <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={() => {
                            router.push({
                                pathname: '/crearProducto',
                                params: { items: JSON.stringify(selectedProducts) }
                            });
                            setTimeout(() => setSelectedProducts([]), 500);
                        }}
                    >
                        <View style={styles.saveBtnContent}>
                            <Text style={styles.saveBtnText}>Añadir a la Lista</Text>
                            <View style={styles.saveBtnBadge}>
                                <Text style={styles.saveBadgeText}>{selectedProducts.length}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </Animated.View>
    );
}
