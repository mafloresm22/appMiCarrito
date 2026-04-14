import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AlertType } from '../constants/mensajes';

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    type: AlertType;
    icon: any;
    color: string;
    onClose: () => void;
}

export default function CustomAlert({ visible, title, message, icon, color, onClose }: CustomAlertProps) {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.alertCard}>
                    <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                        <Ionicons name={icon} size={50} color={color} />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: color }]}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Aceptar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertCard: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 25,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    iconContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22,
    },
    button: {
        width: '100%',
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
