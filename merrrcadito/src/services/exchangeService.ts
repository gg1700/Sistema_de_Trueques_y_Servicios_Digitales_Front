import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const ExchangeService = {
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
    }
};
