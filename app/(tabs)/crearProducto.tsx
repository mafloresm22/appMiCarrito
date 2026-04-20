import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../../assets/styles/crearProducto.styles';
import CustomAlert from '../../components/customAlert';
import { APP_MESSAGES } from '../../constants/mensajes';
import { useGuardarLista } from '../../hooks/guardarLista';
import { useObtenerCategorias } from '../../hooks/obtenerCategoria';

export default function CrearProductoScreen() {
    const router = useRouter();
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();

    // Estados
    const [loading, setLoading] = useState(false);
    const [itemsAgregados, setItemsAgregados] = useState<any[]>([]);

    const [alertConfig, setAlertConfig] = useState<any>({
        visible: false,
        title: '',
        message: '',
        type: 'success',
        icon: 'checkmark-circle-outline',
        color: '#16a34a',
    });

    // Custom Hooks
    const { categorias, loadingCategorias } = useObtenerCategorias();

    useEffect(() => {
        // Capturar productos que vienen de buscarProducto.tsx
        if (params.items) {
            try {
                const newItems = JSON.parse(params.items as string);
                setItemsAgregados(prev => {
                    const existingIds = new Set(prev.map(i => i.id));
                    const uniqueNew = newItems
                        .filter((i: any) => !existingIds.has(i.id))
                        .map((i: any) => ({ ...i, quantity: 1 }));
                    return [...prev, ...uniqueNew];
                });
            } catch (e) {
                console.error('Error parseando items:', e);
            }
        }
    }, [params.items]);

    const updateItemQuantity = (id: string, delta: number) => {
        setItemsAgregados(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        }));
    };

    const { guardarProductos } = useGuardarLista();

    const mostrarAlerta = (config: any) => {
        setAlertConfig({ ...config, visible: true });
    };

    const handleSave = async () => {
        setLoading(true);
        const { success, error, warning } = await guardarProductos(itemsAgregados);
        setLoading(false);

        if (success) {
            mostrarAlerta(APP_MESSAGES.DATABASE.SAVE_SUCCESS);
        } else {
            if (error === 'EMPTY') {
                mostrarAlerta(APP_MESSAGES.DATABASE.EMPTY_LIST);
            } else {
                mostrarAlerta(APP_MESSAGES.DATABASE.GENERIC_ERROR);
            }
        }
    };

    const handleAlertClose = () => {
        setAlertConfig({ ...alertConfig, visible: false });
        if (alertConfig.type === 'success') {
            setItemsAgregados([]); // Limpiar lista al guardar con éxito
            router.replace('/(tabs)');
        }
    };

    const removeAddedItem = (id: string) => {
        setItemsAgregados(itemsAgregados.filter(i => i.id !== id));
    };

    return (
        <Animated.View
            key={`crear-${isFocused}`}
            entering={FadeInDown.duration(600).delay(100)}
            style={styles.container}
        >
            <Animated.View entering={FadeInDown.delay(200).duration(600)} style={[styles.topSection, { paddingTop: insets.top }]}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => {
                            setItemsAgregados([]);
                            router.back();
                        }}
                        style={styles.backBtn}
                    >
                        <Ionicons name="close" size={26} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Resumen de Lista</Text>
                    <View style={{ width: 40 }} />
                </View>
            </Animated.View>

            <Animated.View
                entering={FadeInUp.delay(400).duration(600)}
                style={styles.content}
            >
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity
                        style={styles.catalogBtn}
                        onPress={() => router.push({
                            pathname: '/buscarProducto',
                            params: { currentItems: JSON.stringify(itemsAgregados) }
                        })}
                    >
                        <View style={styles.catalogIcon}>
                            <Ionicons name="search" size={24} color="#16a34a" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.catalogTitle}>Agregar productos</Text>
                            <Text style={styles.catalogSubtitle}>Sigue buscando productos en el catalogo</Text>
                        </View>
                        <Ionicons name="add-circle" size={28} color="#16a34a" />
                    </TouchableOpacity>

                    <View style={[styles.sectionHeader, { marginTop: 10 }]}>
                        <Text style={styles.sectionTitle}>Productos en la lista ({itemsAgregados.length})</Text>
                    </View>

                    {itemsAgregados.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="basket-outline" size={60} color="#cbd5e1" />
                            <Text style={styles.emptyText}>No has añadido productos todavia</Text>
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
                                        <View style={styles.itemBrandRow}>
                                            <Text style={styles.itemBrand}>{item.marca}</Text>
                                            <View style={styles.dot} />
                                            <Text style={styles.itemCatalogCat}>{item.categoria}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => removeAddedItem(item.id)} style={styles.removeBtn}>
                                        <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.itemFooter}>
                                    <Text style={styles.quantityLabel}>Cantidad:</Text>
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
            </Animated.View>

            <Animated.View
                entering={FadeInUp.delay(300)}
                style={styles.footer}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
            </Animated.View>

            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                icon={alertConfig.icon}
                color={alertConfig.color}
                onClose={handleAlertClose}
            />
        </Animated.View>
    );
}
