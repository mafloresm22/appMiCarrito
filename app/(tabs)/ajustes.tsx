import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown, SlideOutDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useProfile } from '../../hooks/perfil';

interface AjustesModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function AjustesModal({ visible, onClose }: AjustesModalProps) {
    const { profile, loading, refreshProfile } = useProfile();
    const [isReady, setIsReady] = useState(false);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            opacity.value = withTiming(1, { duration: 300 });
            refreshProfile().then(() => setIsReady(true));
        } else {
            opacity.value = withTiming(0, { duration: 250 });
            setIsReady(false);
        }
    }, [visible]);

    const animatedOverlayStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
        >
            <Animated.View style={[styles.overlay, animatedOverlayStyle]}>
                <Pressable style={styles.dismissArea} onPress={onClose} />

                {visible && (
                    <Animated.View
                        entering={SlideInDown.springify().damping(25).stiffness(120)}
                        exiting={SlideOutDown.duration(200)}
                        style={styles.modalCard}
                    >
                        <View style={styles.header}>
                            <View style={styles.avatarContainer}>
                                <Ionicons name="person" size={40} color="#16a34a" />
                            </View>
                            <Text style={styles.title}>Perfil de Usuario</Text>
                            <Pressable style={styles.closeButton} onPress={onClose}>
                                <Ionicons name="close" size={24} color="#94a3b8" />
                            </Pressable>
                        </View>

                        {(loading || !isReady) ? (
                            <View style={styles.loaderContainer}>
                                <ActivityIndicator size="large" color="#16a34a" />
                                <Text style={styles.loaderText}>Cargando perfil...</Text>
                            </View>
                        ) : (
                            <Animated.View entering={FadeIn.duration(400)} style={styles.content}>
                                <View style={styles.infoRow}>
                                    <MaterialCommunityIcons name="account-circle-outline" size={24} color="#64748b" />
                                    <View style={styles.infoTextContainer}>
                                        <Text style={styles.label}>Nombre de usuario</Text>
                                        <Text style={styles.value}>{profile.username || 'No disponible'}</Text>
                                    </View>
                                </View>

                                <View style={styles.infoRow}>
                                    <MaterialCommunityIcons name="email-outline" size={24} color="#64748b" />
                                    <View style={styles.infoTextContainer}>
                                        <Text style={styles.label}>Correo electrónico</Text>
                                        <Text style={styles.value}>{profile.email || 'No disponible'}</Text>
                                    </View>
                                </View>

                                <View style={styles.infoRow}>
                                    <MaterialCommunityIcons name="calendar-clock" size={24} color="#64748b" />
                                    <View style={styles.infoTextContainer}>
                                        <Text style={styles.label}>Miembro desde</Text>
                                        <Text style={styles.value}>{formatDate(profile.createdAt)}</Text>
                                    </View>
                                </View>
                            </Animated.View>
                        )}

                        <View style={styles.footer}>
                            <Text style={styles.versionText}>MiCarrito v1.0.0</Text>
                        </View>
                    </Animated.View>
                )}
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    dismissArea: {
        ...StyleSheet.absoluteFillObject,
    },
    modalCard: {
        width: '95%',
        backgroundColor: '#ffffff',
        borderRadius: 45,
        padding: 40,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        maxWidth: 600,
        minHeight: '60%',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: -5,
        right: -5,
        padding: 10,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0fdf4',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0f172a',
    },
    content: {
        gap: 20,
    },
    loaderContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    loaderText: {
        marginTop: 10,
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '500',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    infoTextContainer: {
        marginLeft: 20,
        flex: 1,
    },
    label: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 20,
        color: '#1e293b',
        fontWeight: '700',
        marginTop: 4,
    },
    footer: {
        marginTop: 30,
        alignItems: 'center',
    },
    versionText: {
        fontSize: 12,
        color: '#cbd5e1',
        fontWeight: '500',
    }
});
