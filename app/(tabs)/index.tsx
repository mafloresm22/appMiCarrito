import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomAlert from '../../components/customAlert';
import { APP_MESSAGES } from '../../constants/mensajes';
import { supabase } from '../../services/supabase';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();
    const [lists, setLists] = useState([]);

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
                                <Text style={styles.welcomeText}>¡Hola de nuevo!</Text>
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
                            <Text style={styles.statValue}>{lists.length}</Text>
                            <Text style={styles.statLabel}>Listas</Text>
                        </View>
                        <View style={styles.statBox}>
                            <View style={[styles.statCircle, { backgroundColor: '#eff6ff' }]}>
                                <Ionicons name="basket" size={20} color="#1d4ed8" />
                            </View>
                            <Text style={styles.statValue}>0</Text>
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
                            <Text style={styles.sectionTitle}>Tus <Text style={styles.boldText}>Listas</Text></Text>
                        </View>

                        {lists.length === 0 ? (
                            <View style={styles.emptyState}>
                                <View style={styles.emptyIconContainer}>
                                    <MaterialCommunityIcons name="clipboard-text-outline" size={60} color="#cbd5e1" />
                                </View>
                                <Text style={styles.emptyTitle}>No hay listas creadas aún</Text>
                                <Text style={styles.emptySubtitle}>Comienza pulsando el botón + para crear tu primera lista de compras.</Text>
                            </View>
                        ) : (
                            lists.map((list: any, index: number) => (
                                <TouchableOpacity key={index} style={styles.listCard}>
                                    <View style={styles.cardImagePlaceholder}>
                                        <MaterialCommunityIcons name="shopping-outline" size={26} color="#16a34a" />
                                    </View>
                                    <View style={styles.cardContent}>
                                        <Text style={styles.cardTitle}>{list.name}</Text>
                                        <Text style={styles.cardSubtitle}>{list.itemsCount} ítems • Reciente</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Botón crear Lista */}
            <View style={styles.fabContainer}>
                <TouchableOpacity style={styles.fab}>
                    <Ionicons name="add" size={35} color="#fff" />
                </TouchableOpacity>
            </View>

            <CustomAlert {...alertConfig} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollContainer: {
        paddingBottom: 150,
    },
    headerBackground: {
        height: height * 0.28,
        backgroundColor: '#16a34a',
        paddingHorizontal: 25,
        justifyContent: 'center',
    },
    headerCurve: {
        position: 'absolute',
        bottom: -25,
        left: 0,
        right: 0,
        height: 50,
        backgroundColor: '#f8fafc',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    headerInfo: {
        flex: 1,
    },
    welcomeText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
    },
    logoutBtn: {
        width: 45,
        height: 45,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bgIcon1: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    bgIcon2: {
        position: 'absolute',
        bottom: 40,
        left: -10,
    },
    contentBody: {
        flex: 1,
        backgroundColor: '#f8fafc',
        marginTop: -10,
    },
    statsRow: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        justifyContent: 'space-between',
        marginTop: -35,
    },
    statBox: {
        alignItems: 'center',
        flex: 1,
    },
    statCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '900',
        color: '#0f172a',
    },
    statLabel: {
        fontSize: 11,
        color: '#94a3b8',
        fontWeight: '600',
    },
    section: {
        marginTop: 30,
        paddingHorizontal: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        color: '#1e293b',
        fontWeight: '500',
    },
    boldText: {
        fontWeight: '900',
        color: '#0f172a',
    },
    searchInputContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 18,
        paddingLeft: 20,
        alignItems: 'center',
        height: 60,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        marginTop: 15,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#1e293b',
    },
    addInlineBtn: {
        backgroundColor: '#16a34a',
        width: 48,
        height: 48,
        borderRadius: 14,
        marginRight: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chipsPadding: {
        paddingLeft: 25,
        paddingVertical: 10,
    },
    chip: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 15,
        backgroundColor: '#fff',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    activeChip: {
        backgroundColor: '#16a34a',
        borderColor: '#16a34a',
    },
    chipText: {
        color: '#64748b',
        fontWeight: '700',
        fontSize: 13,
    },
    activeChipText: {
        color: '#fff',
    },
    listCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 22,
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    cardImagePlaceholder: {
        width: 55,
        height: 55,
        borderRadius: 16,
        backgroundColor: '#edfdf3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#0f172a',
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 2,
        fontWeight: '500',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#475569',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: 20,
    },
    fabContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    fab: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#16a34a',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
    }
});
