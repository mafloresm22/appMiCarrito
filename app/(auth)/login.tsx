import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../assets/styles/login.styles';
import CustomAlert from '../../components/customAlert';
import { SocialIcons } from '../../constants/images';
import { APP_MESSAGES } from '../../constants/mensajes';
import { supabase } from '../../services/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
        <View style={styles.headerBackground}>
          <MaterialCommunityIcons name="food-apple" size={24} color="rgba(255,255,255,0.2)" style={{ position: 'absolute', top: 50, left: 20 }} />
          <MaterialCommunityIcons name="carrot" size={24} color="rgba(255,255,255,0.2)" style={{ position: 'absolute', top: 80, right: 40 }} />
          <MaterialCommunityIcons name="food-croissant" size={24} color="rgba(255,255,255,0.2)" style={{ position: 'absolute', top: 150, left: 50 }} />
          <MaterialCommunityIcons name="bottle-wine" size={24} color="rgba(255,255,255,0.2)" style={{ position: 'absolute', top: 120, right: 80 }} />
          <MaterialCommunityIcons name="corn" size={24} color="rgba(255,255,255,0.2)" style={{ position: 'absolute', top: 200, right: 30 }} />

          <SafeAreaView style={styles.headerContent}>
            <Animated.View
              key={`logo-${isFocused}`}
              entering={FadeInDown.delay(200).duration(800)}
              style={styles.logoContainer}
            >
              <View style={styles.cartIconContainer}>
                <Image
                  source={SocialIcons.MiCarrito}
                  style={{ width: 100, height: 100 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>MiCarrito</Text>
              <Text style={styles.subtitle}>Tu mercado, organizado</Text>
            </Animated.View>
          </SafeAreaView>
        </View>

        {/* Wavy transition */}
        <View style={styles.curve} />

        {/* Main Card Content */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Animated.View
            key={`card-${isFocused}`}
            entering={FadeInUp.delay(400).duration(800)}
            style={styles.card}
          >
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
              style={styles.loginButton}
              activeOpacity={0.8}
              onPress={async () => {
                if (!email || !password) {
                  showAlert(APP_MESSAGES.AUTH.FIELDS_REQUIRED);
                  return;
                }

                const trimmedEmail = email.trim();
                const trimmedPassword = password.trim();

                const { error } = await supabase.auth.signInWithPassword({
                  email: trimmedEmail,
                  password: trimmedPassword,
                });

                if (error) {
                  showAlert({
                    ...APP_MESSAGES.AUTH.LOGIN_ERROR,
                    message: error.message === 'Invalid login credentials'
                      ? APP_MESSAGES.AUTH.LOGIN_ERROR.message
                      : error.message
                  });
                } else {
                  showAlert(APP_MESSAGES.AUTH.LOGIN_SUCCESS, () => {
                    router.replace('/(tabs)');
                  });
                }
              }}
            >
              <Text style={styles.loginButtonText}>Iniciar Sesión   <Ionicons name="arrow-forward" size={18} color="#fff" /> </Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>¿No tienes cuenta? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.registerLink}>Regístrate</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
        <CustomAlert {...alertConfig} />
      </View>
    </TouchableWithoutFeedback>
  );
}
