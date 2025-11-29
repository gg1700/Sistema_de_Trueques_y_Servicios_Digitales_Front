import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Servicio combinado de intercambios que soporta ambas implementaciones
export const ExchangeService = {
    // === Funciones de HEAD (sistema de ofertas abiertas) ===
    create_exchange: async (formData: FormData) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/exchanges/create`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error al crear intercambio:', error);
            throw error;
        }
    },

    get_user_exchanges: async (cod_us: number) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/exchanges/user/${cod_us}`
            );
            return response.data;
        } catch (error) {
            console.error('Error al obtener intercambios:', error);
            throw error;
        }
    },

    search_user_by_handle: async (handle_name: string) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/users/get_user_data?handle_name=${encodeURIComponent(handle_name)}`
            );
            return response.data;
        } catch (error) {
            console.error('Error al buscar usuario:', error);
            throw error;
        }
    },

    get_user_products: async (cod_us: number) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/users/get_user_posts?cod_us=${cod_us}`
            );
            return response.data;
        } catch (error) {
            console.error('Error al obtener productos del usuario:', error);
            throw error;
        }
    },

    get_all_exchanges: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/exchanges/open`
            );
            return response.data;
        } catch (error) {
            console.error('Error al obtener intercambios:', error);
            throw error;
        }
    },

    // === Funciones de Frontend-Mateo (sistema de gestión de propuestas) ===
    acceptExchange: async (exchangeId: number, userId: number) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/exchanges/${exchangeId}/accept`,
                { userId }
            );
            return response.data;
        } catch (error) {
            console.error('Error al aceptar intercambio:', error);
            throw error;
        }
    },

    rejectExchange: async (exchangeId: number, userId: number, reason?: string) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/exchanges/${exchangeId}/reject`,
                { userId, reason }
            );
            return response.data;
        } catch (error) {
            console.error('Error al rechazar intercambio:', error);
            throw error;
        }
    },

    confirmExchange: async (exchangeId: number, userId: number) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/exchanges/${exchangeId}/confirm`,
                { userId }
            );
            return response.data;
        } catch (error) {
            console.error('Error al confirmar intercambio:', error);
            throw error;
        }
    },

    getExchangesByStatus: async (userId: number, status: string) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/exchanges/user/${userId}/status/${status}`
            );
            return response.data;
        } catch (error) {
            console.error('Error al obtener intercambios por estado:', error);
            throw error;
        }
    },

    getUserExchanges: async (userId: number) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/exchanges/user/${userId}`
            );
            return response.data;
        } catch (error) {
            console.error('Error al obtener intercambios del usuario:', error);
            throw error;
        }
    },

    getExchangeDetails: async (exchangeId: number) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/exchanges/${exchangeId}`
            );
            return response.data;
        } catch (error) {
            console.error('Error al obtener detalles del intercambio:', error);
            throw error;
        }
    },
};

// Export alias para compatibilidad con Frontend-Mateo
export const exchangeService = ExchangeService;
