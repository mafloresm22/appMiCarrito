import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { productosPeru } from '../../services/productosPeru';

export default function CrearListaScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [productos, setProductos] = useState<any[]>([]);

    const handleSearch = async () => {
        if (!query.trim()) return;

        Keyboard.dismiss();
        setLoading(true);
        try {
            // Filtrado local en la lista de productos de Perú
            const results = productosPeru.filter(p => 
                p.nombre.toLowerCase().includes(query.toLowerCase()) ||
                p.marca.toLowerCase().includes(query.toLowerCase())
            );
            setProductos(results);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.imagePlaceholder}>
                <MaterialCommunityIcons 
                    name={item.icono || 'package-variant'} 
                    size={40} 
                    color="#16a34a" 
                />
            </View>
            <View style={styles.cardInfo}>
                <Text style={styles.productName} numberOfLines={2}>{item.nombre}</Text>
                <Text style={styles.productBrand}>{item.marca}</Text>
                <TouchableOpacity style={styles.addBtn}>
                    <Ionicons name="add-circle" size={24} color="#16a34a" />
                    <Text style={styles.addBtnText}>Añadir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={28} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Buscar Producto</Text>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.inputWrapper}>
                    <Ionicons name="search" size={20} color="#94a3b8" />
                    <TextInput
                        style={styles.input}
                        placeholder="Buscar producto (ej: Atún, Leche...)"
                        value={query}
                        onChangeText={setQuery}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
                    <Text style={styles.searchBtnText}>Explorar</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#16a34a" />
                    <Text style={styles.loadingText}>Buscando mejores opciones...</Text>
                </View>
            ) : productos.length > 0 ? (
                <FlatList
                    data={productos}
                    keyExtractor={(item) => item.id_api}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listPadding}
                    showsVerticalScrollIndicator={false}
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    backBtn: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0f172a',
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        gap: 12,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 16,
        paddingHorizontal: 15,
        height: 55,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#1e293b',
    },
    searchBtn: {
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
    searchBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    listPadding: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom: 15,
        padding: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    imagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 15,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardInfo: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    productName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
        lineHeight: 22,
    },
    productBrand: {
        fontSize: 13,
        color: '#64748b',
        marginBottom: 8,
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0fdf4',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    addBtnText: {
        marginLeft: 6,
        color: '#16a34a',
        fontWeight: '700',
        fontSize: 14,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#64748b',
        fontWeight: '500',
    },
    emptyIconContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: 22,
    },
});
