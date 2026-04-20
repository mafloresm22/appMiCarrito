import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { supabase } from '../../services/supabase';

import { useIsFocused } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { styles } from '../../assets/styles/registrer.styles';
import CustomAlert from '../../components/customAlert';
import { APP_MESSAGES } from '../../constants/mensajes';

export default function RegisterScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Estado para el Alert Personalizado
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerBackground}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <Animated.View entering={FadeInDown.delay(200)} style={styles.headerContent}>
            <Text style={styles.title}>Crear Cuenta</Text>
            <Text style={styles.subtitle}>Únete a nuestra comunidad</Text>
          </Animated.View>
        </View>

        {/* transition */}
        <View style={styles.curve} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
            <Animated.View
              key={`register-card-${isFocused}`}
              entering={FadeInUp.delay(400)}
              style={styles.card}
            >
              {/* Name Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.iconBox}>
                  <Ionicons name="person-outline" size={20} color="#4fbfa8" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre Completo"
                  placeholderTextColor="#94a3b8"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.iconBox}>
                  <Ionicons name="mail-outline" size={20} color="#4fbfa8" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Correo Electrónico"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.iconBox}>
                  <Ionicons name="lock-closed-outline" size={20} color="#4fbfa8" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ paddingRight: 15 }}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.registerButton}
                activeOpacity={0.8}
                onPress={async () => {
                  if (!email || !password || !name) {
                    showAlert(APP_MESSAGES.AUTH.FIELDS_REQUIRED);
                    return;
                  }

                  const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                      data: {
                        full_name: name,
                        username: name,
                      }
                    }
                  });

                  if (error) {
                    showAlert({
                      ...APP_MESSAGES.AUTH.LOGIN_ERROR,
                      message: error.message
                    });
                  } else {
                    showAlert(APP_MESSAGES.AUTH.REGISTER_SUCCESS, () => {
                      router.replace('/(auth)/login');
                    });
                  }
                }}
              >
                <Text style={styles.registerButtonText}>Registrarse   <Ionicons name="person-add" size={18} color="#fff" /> </Text>
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                  <Text style={styles.loginLink}>Inicia Sesión</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
        <CustomAlert {...alertConfig} />
      </View>
    </TouchableWithoutFeedback>
  );
}

