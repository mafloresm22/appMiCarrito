export const ALERT_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
} as const;

export type AlertType = typeof ALERT_TYPES[keyof typeof ALERT_TYPES];

export const APP_MESSAGES = {
    AUTH: {
        LOGIN_SUCCESS: {
            type: ALERT_TYPES.SUCCESS,
            title: '¡Bienvenido!',
            message: 'Has iniciado sesión correctamente.',
            icon: 'checkmark-circle-outline',
            color: '#166534',
        },
        LOGIN_ERROR: {
            type: ALERT_TYPES.ERROR,
            title: 'Error de Acceso',
            message: 'Correo o contraseña incorrectos. Inténtalo de nuevo.',
            icon: 'alert-circle-outline',
            color: '#991b1b',
        },
        REGISTER_SUCCESS: {
            type: ALERT_TYPES.SUCCESS,
            title: 'Cuenta Creada',
            message: 'Tu cuenta ha sido registrada con éxito. ¡Ya puedes entrar!',
            icon: 'person-add-outline',
            color: '#15803d',
        },
        FIELDS_REQUIRED: {
            type: ALERT_TYPES.WARNING,
            title: 'Campos Incompletos',
            message: 'Por favor, rellena todos los campos para continuar.',
            icon: 'warning-outline',
            color: '#b45309',
        },
        LOGOUT_ERROR: {
            type: ALERT_TYPES.ERROR,
            title: 'Error al Salir',
            message: 'No se pudo cerrar la sesión. Reintenta más tarde.',
            icon: 'log-out-outline',
            color: '#ef4444',
        },
    },
    DATABASE: {
        SAVE_SUCCESS: {
            type: ALERT_TYPES.SUCCESS,
            title: '¡Lista Guardada!',
            message: 'Tus productos se han guardado correctamente en la base de datos.',
            icon: 'checkmark-done-circle-outline',
            color: '#16a34a',
        },
        SAVE_WITH_WARNINGS: {
            type: ALERT_TYPES.WARNING,
            title: 'Guardado con Avisos',
            message: 'Se guardó la lista, pero algunos productos no tienen una categoría asignada.',
            icon: 'alert-circle-outline',
            color: '#f59e0b',
        },
        EMPTY_LIST: {
            type: ALERT_TYPES.WARNING,
            title: 'Lista Vacía',
            message: 'No puedes guardar una lista sin productos. ¡Añade algunos primero!',
            icon: 'basket-outline',
            color: '#64748b',
        },
        GENERIC_ERROR: {
            type: ALERT_TYPES.ERROR,
            title: 'Error al Guardar',
            message: 'No pudimos guardar tu lista. Por favor, verifica tu conexión.',
            icon: 'close-circle-outline',
            color: '#ef4444',
        },
    }
};
