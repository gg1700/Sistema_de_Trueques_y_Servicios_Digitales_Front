import axios from 'axios'

const API_BASE_URL=process.env.NEXT_PUBLIC_API_URL;

export const ReportService = {
    get_category_report_by_month: async(month : string) => {
        try{
            const response = await axios.get(
                `${API_BASE_URL}/categories/report_category_product_by_month`,
                {
                    params:{month}
                }
            );
            console.log("Primer reporte: ", response.data)
            return response.data;
        }catch(error){
            console.log("Error al obtener primer reporte");
            throw error;
        }
    },
    get_activity_report_by_week: async() => {
        try{
            const response = await axios.get(
                `${API_BASE_URL}/users/activity_report_by_week`,
            );
            console.log("Segundo reporte: ", response.data);
            return response.data;
        }catch(error){
            console.log("Error al obtener segundo reporte");
            throw error
        }
    },
    get_activity_report_by_month: async() => {
        try{
            const response = await axios.get(
                `${API_BASE_URL}/users/activity_report_by_week`,
            );
            console.log("Tercer reporte: ", response.data);
            return response.data;
        }catch(error){
            console.log("Error al obtener tercer reporte")
        }
    },
    get_ranking_users_co2: async() => {
        try{
            const response = await axios.get(
                `${API_BASE_URL}/users/get_rankin_users_co2`,
            );
            return response.data;
        }catch(error){
            throw error;
        }
    },
    get_user_transaction_history: async(codUs : number) => {
        try{
            const response = await axios.get(
                `${API_BASE_URL}/transactions/get_user_transaction_history`,
                 {
                    params: {cod_us:codUs}
                 }
            );
            return response.data
        }catch(error){
            throw error;
        }
    },
    get_ranking_users_by_sells: async () => {
        try{
            const response = await axios.get(
                `${API_BASE_URL}/users/get_rankin_users_sells`
            );
            return response.data;
        }catch(error){
            throw error;
        }
    }
}
