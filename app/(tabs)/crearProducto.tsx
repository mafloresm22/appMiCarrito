import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../services/supabase';

export default function CrearProductoScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();

    // Estados
    const [categoriaId, setCategoriaId] = useState<string | null>(null);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingCategorias, setLoadingCategorias] = useState(true);

    const [itemsAgregados, setItemsAgregados] = useState<any[]>([]);

    useEffect(() => {
        getCategorias();
    }, []);

    useEffect(() => {
        // Capturar productos que vienen de buscarProducto.tsx
        if (params.items) {
            try {
                const newItems = JSON.parse(params.items as string);
                setItemsAgregados(prev => {
                    const existingIds = new Set(prev.map(i => i.id));
                    const uniqueNew = newItems
                        .filter((i: any) => !existingIds.has(i.id))
                        .map((i: any) => ({ ...i, quantity: 1 })); // Inicializar cantidad
                    return [...prev, ...uniqueNew];
                });
            } catch (e) {
                console.error('Error parseando items:', e);
            }
        }
    }, [params.items]);

    async function getCategorias() {
        try {
            const { data, error } = await supabase
                .from('categorias')
                .select('*')
                .order('nombre', { ascending: true });

            if (error) throw error;
            setCategorias(data || []);
        } catch (error: any) {
            console.error('Error fetching categorias:', error.message);
        } finally {
            setLoadingCategorias(false);
        }
    }

    const updateItemQuantity = (id: string, delta: number) => {
        setItemsAgregados(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        }));
    };

    const handleSave = async () => {
        if (itemsAgregados.length === 0) {
            Alert.alert('Error', 'Por favor selecciona productos del catálogo.');
            return;
        }

        setLoading(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            const user_id = userData.user?.id;

            if (!user_id) throw new Error('Usuario no autenticado');

            // Preparar inserción múltiple
            const productInserts = itemsAgregados.map(item => ({
                nombre: item.nombre,
                imagen_url: item.imagen,
                user_id: user_id,
                cantidad: item.quantity,
                categoria_id: categoriaId, // Aplicar categoría seleccionada a todos
            }));

            const { error } = await supabase.from('productos').insert(productInserts);
            if (error) throw error;

            Alert.alert('Éxito', '¡Productos guardados correctamente!');
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const removeAddedItem = (id: string) => {
        setItemsAgregados(itemsAgregados.filter(i => i.id !== id));
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.topSection, { paddingTop: insets.top }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="close" size={26} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Resumen de Lista</Text>
                    <TouchableOpacity onPress={handleSave} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveHeaderBtn}>Guardar</Text>}
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Botón Buscar en Catálogo */}
                <TouchableOpacity
                    style={styles.catalogBtn}
                    onPress={() => router.push('/buscarProducto')}
                >
                    <View style={styles.catalogIcon}>
                        <Ionicons name="search" size={24} color="#16a34a" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.catalogTitle}>Añadir productos</Text>
                        <Text style={styles.catalogSubtitle}>Sigue buscando productos en el catálogo</Text>
                    </View>
                    <Ionicons name="add-circle" size={28} color="#16a34a" />
                </TouchableOpacity>

                {/* Categoría Global */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Asignar Categoría</Text>
                    <Text style={styles.sectionSubtitle}>Selecciona una categoría para aplicar a estos productos</Text>
                </View>

                {loadingCategorias ? (
                    <ActivityIndicator size="small" color="#16a34a" style={{ marginBottom: 20 }} />
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                        {categorias.map((cat) => (
                            <TouchableOpacity
                                key={cat.idcategorias}
                                onPress={() => setCategoriaId(cat.idcategorias)}
                                style={[
                                    styles.catChip,
                                    categoriaId === cat.idcategorias && styles.catChipSelected,
                                    { borderColor: cat.color || '#e2e8f0' }
                                ]}
                            >
                                <Text style={[
                                    styles.catText,
                                    categoriaId === cat.idcategorias && styles.catTextSelected
                                ]}>
                                    {cat.nombre}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                {/* Lista de productos */}
                <View style={[styles.sectionHeader, { marginTop: 10 }]}>
                    <Text style={styles.sectionTitle}>Productos en la lista ({itemsAgregados.length})</Text>
                </View>

                {itemsAgregados.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="basket-outline" size={60} color="#cbd5e1" />
                        <Text style={styles.emptyText}>No has añadido productos todavía</Text>
                    </View>
                ) : (
                    itemsAgregados.map((item) => (
                        <View key={item.id} style={styles.itemCard}>
                            <View style={styles.itemMainInfo}>
                                <Image
                                    source={item.imagen ? { uri: item.imagen } : undefined}
                                    style={styles.itemThumb}
                                    defaultSource={require('../../assets/images/icon.png')}
                                />
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={styles.itemName} numberOfLines={1}>{item.nombre}</Text>
                                    <Text style={styles.itemBrand}>{item.marca}</Text>
                                </View>
                                <TouchableOpacity onPress={() => removeAddedItem(item.id)} style={styles.removeBtn}>
                                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.itemFooter}>
                                <Text style={styles.quantityLabel}>Cantidad de articulos:</Text>
                                <View style={styles.counter}>
                                    <TouchableOpacity
                                        onPress={() => updateItemQuantity(item.id, -1)}
                                        style={styles.counterBtn}
                                    >
                                        <Ionicons name="remove" size={18} color="#1e293b" />
                                    </TouchableOpacity>
                                    <Text style={styles.counterValue}>{item.quantity}</Text>
                                    <TouchableOpacity
                                        onPress={() => updateItemQuantity(item.id, 1)}
                                        style={styles.counterBtn}
                                    >
                                        <Ionicons name="add" size={18} color="#1e293b" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.footer}
            >
                <TouchableOpacity
                    style={[styles.saveBtn, (loading || itemsAgregados.length === 0) && styles.disabledBtn]}
                    onPress={handleSave}
                    disabled={loading || itemsAgregados.length === 0}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveBtnText}>Guardar Lista de Compras</Text>
                    )}
                </TouchableOpacity>
            </KeyboardAvoidingView>
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
        paddingBottom: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backBtn: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#fff',
    },
    saveHeaderBtn: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 120,
    },
    catalogBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 20,
        marginBottom: 25,
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    catalogIcon: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: '#f0fdf4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    catalogTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
    },
    catalogSubtitle: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    sectionHeader: {
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#0f172a',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionSubtitle: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 2,
    },
    categoriesScroll: {
        marginBottom: 20,
        paddingVertical: 5,
    },
    catChip: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1.5,
        marginRight: 10,
        backgroundColor: '#fff',
    },
    catChipSelected: {
        backgroundColor: '#16a34a',
        borderColor: '#16a34a',
    },
    catText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748b',
    },
    catTextSelected: {
        color: '#fff',
    },
    itemCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    itemMainInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemThumb: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#f8fafc',
    },
    itemName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1e293b',
    },
    itemBrand: {
        fontSize: 12,
        color: '#94a3b8',
    },
    removeBtn: {
        padding: 5,
    },
    itemFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    quantityLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748b',
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 10,
        padding: 4,
    },
    counterBtn: {
        width: 30,
        height: 30,
        borderRadius: 8,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    counterValue: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1e293b',
        marginHorizontal: 15,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    saveBtn: {
        backgroundColor: '#16a34a',
        height: 55,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
    disabledBtn: {
        opacity: 0.5,
        backgroundColor: '#94a3b8',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '500',
    },
});
