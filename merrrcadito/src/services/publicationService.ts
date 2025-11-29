import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACK_URL;
export const PublicationService = {
    getAllPubProds: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/posts/all_active_product_posts`,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getAllPubServs: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/posts/all_active_service_posts`,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}