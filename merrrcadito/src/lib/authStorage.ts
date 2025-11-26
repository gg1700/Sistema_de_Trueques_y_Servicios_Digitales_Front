/**
 * authStorage.ts
 * 
 * Utilidad centralizada para gestionar la sesión de usuario en localStorage.
 * Provee functions tipadas y seguras para almacenar y recuperar datos de autenticación.
 */

export type Role = 'user' | 'admin' | 'entrepreneur';

export interface UserSession {
    cod_us: number;
    handle_name: string;
    cod_rol: number;
    role: Role;
}

// Claves de localStorage
const KEYS = {
    COD_US: 'cod_us',
    HANDLE_NAME: 'handle_name',
    COD_ROL: 'cod_rol',
    ROLE: 'role',
    // Backward compatibility
    CURRENT_USER_HANDLE: 'currentUserHandle',
    CURRENT_USER_ROLE: 'currentUserRole',
} as const;

/**
 * Guarda la sesión completa del usuario en localStorage
 * Incluye compatibilidad con claves anteriores
 */
export function saveUserSession(session: UserSession): void {
    if (typeof window === 'undefined') return;

    try {
        // Nuevas claves
        window.localStorage.setItem(KEYS.COD_US, String(session.cod_us));
        window.localStorage.setItem(KEYS.HANDLE_NAME, session.handle_name);
        window.localStorage.setItem(KEYS.COD_ROL, String(session.cod_rol));
        window.localStorage.setItem(KEYS.ROLE, session.role);

        // Backward compatibility - mantener claves antiguas
        window.localStorage.setItem(KEYS.CURRENT_USER_HANDLE, session.handle_name);
        window.localStorage.setItem(KEYS.CURRENT_USER_ROLE, session.role);
    } catch (error) {
        console.error('Error guardando sesión en localStorage:', error);
        // No lanzamos el error para no romper el flujo
    }
}

/**
 * Recupera la sesión completa del usuario desde localStorage
 * @returns UserSession o null si no hay sesión activa
 */
export function getUserSession(): UserSession | null {
    if (typeof window === 'undefined') return null;

    try {
        const codUs = window.localStorage.getItem(KEYS.COD_US);
        const handleName = window.localStorage.getItem(KEYS.HANDLE_NAME);
        const codRol = window.localStorage.getItem(KEYS.COD_ROL);
        const role = window.localStorage.getItem(KEYS.ROLE);

        // Si falta algún dato crítico, no hay sesión válida
        if (!codUs || !handleName || !codRol || !role) {
            return null;
        }

        return {
            cod_us: parseInt(codUs, 10),
            handle_name: handleName,
            cod_rol: parseInt(codRol, 10),
            role: role as Role,
        };
    } catch (error) {
        console.error('Error recuperando sesión de localStorage:', error);
        return null;
    }
}

/**
 * Recupera solo el código de usuario (cod_us)
 * @returns número o null
 */
export function getCodUs(): number | null {
    if (typeof window === 'undefined') return null;

    try {
        const codUs = window.localStorage.getItem(KEYS.COD_US);
        return codUs ? parseInt(codUs, 10) : null;
    } catch {
        return null;
    }
}

/**
 * Recupera solo el nombre de usuario (handle_name)
 * @returns string o null
 */
export function getHandleName(): string | null {
    if (typeof window === 'undefined') return null;

    try {
        return window.localStorage.getItem(KEYS.HANDLE_NAME);
    } catch {
        return null;
    }
}

/**
 * Recupera solo el código de rol (cod_rol)
 * @returns número o null
 */
export function getCodRol(): number | null {
    if (typeof window === 'undefined') return null;

    try {
        const codRol = window.localStorage.getItem(KEYS.COD_ROL);
        return codRol ? parseInt(codRol, 10) : null;
    } catch {
        return null;
    }
}

/**
 * Recupera solo el rol del usuario
 * @returns Role string o null
 */
export function getRole(): Role | null {
    if (typeof window === 'undefined') return null;

    try {
        const role = window.localStorage.getItem(KEYS.ROLE);
        return role as Role | null;
    } catch {
        return null;
    }
}

/**
 * Limpia toda la sesión del usuario de localStorage
 */
export function clearUserSession(): void {
    if (typeof window === 'undefined') return;

    try {
        // Limpiar nuevas claves
        window.localStorage.removeItem(KEYS.COD_US);
        window.localStorage.removeItem(KEYS.HANDLE_NAME);
        window.localStorage.removeItem(KEYS.COD_ROL);
        window.localStorage.removeItem(KEYS.ROLE);

        // Limpiar claves antiguas
        window.localStorage.removeItem(KEYS.CURRENT_USER_HANDLE);
        window.localStorage.removeItem(KEYS.CURRENT_USER_ROLE);
    } catch (error) {
        console.error('Error limpiando sesión de localStorage:', error);
    }
}

/**
 * Verifica si hay una sesión válida activa
 * @returns boolean
 */
export function isSessionValid(): boolean {
    return getUserSession() !== null;
}

/**
 * Cierra la sesión del usuario y opcionalmente redirige
 * @param redirectTo - URL a la que redirigir (opcional)
 */
export function logoutUser(redirectTo?: string): void {
    clearUserSession();

    if (redirectTo && typeof window !== 'undefined') {
        window.location.href = redirectTo;
    }
}
