import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomAlert from '../../components/customAlert';
import { SocialIcons } from '../../constants/images';
import { APP_MESSAGES } from '../../constants/mensajes';
import { supabase } from '../../services/supabase';

const { width, height } = Dimensions.get('window');

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBackground: {
    height: height * 0.45,
    backgroundColor: '#268f46ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  cartIconContainer: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartGroceries: {
    position: 'absolute',
    top: 5,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    marginTop: -5,
  },
  curve: {
    height: 100,
    backgroundColor: '#2f8d4eff',
    borderBottomLeftRadius: width * 0.5,
    borderBottomRightRadius: width * 0.5,
    transform: [{ scaleX: 1.5 }],
    marginTop: -50,
  },
  keyboardView: {
    flex: 1,
    marginTop: -80,
    alignItems: 'center',
  },
  card: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#44af6dff',
    borderRadius: 15,
    marginBottom: 15,
    backgroundColor: '#f9fdfc',
  },
  iconBox: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#1b6e48ff',
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#334155',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#077033ff',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#208346ff',
    borderRadius: 25,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#52c6ad',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 25,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  registerLink: {
    color: '#0c7e0cff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
