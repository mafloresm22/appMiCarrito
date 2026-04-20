import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerBackground: {
        height: height * 0.35,
        backgroundColor: '#268f46ff',
        paddingHorizontal: 30,
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContent: {
        marginTop: 20,
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 18,
        color: '#fff',
        opacity: 0.9,
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
    registerButton: {
        backgroundColor: '#106831ff',
        borderRadius: 25,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0b9745ff',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 5,
        marginTop: 10,
        marginBottom: 25,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        color: '#94a3b8',
        fontSize: 14,
    },
    loginLink: {
        color: '#1b833aff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});