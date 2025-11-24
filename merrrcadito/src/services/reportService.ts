import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const ReportService = {
    get_category_report_by_month: async (month: string) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/categories/report_category_product_by_month`,
                {
                    params: { month }
                }
            );
            console.log("Primer reporte: ", response.data)
            return response.data;
        } catch (error) {
            console.log("Error al obtener primer reporte");
            throw error;
        }
    },
    get_activity_report_by_week: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/users/activity_report_by_week`,
            );
            console.log("Segundo reporte: ", response.data);
            return response.data;
        } catch (error) {
            console.log("Error al obtener segundo reporte");
            throw error
        }
    },
    get_activity_report_by_month: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/users/activity_report_by_week`,
            );
            console.log("Tercer reporte: ", response.data);
            return response.data;
        } catch (error) {
            console.log("Error al obtener tercer reporte")
        }
    },
    get_ranking_users_co2: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/users/get_rankin_users_co2`,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    get_user_transaction_history: async (codUs: number) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/transactions/get_user_transaction_history`,
                {
                    params: { cod_us: codUs }
                }
            );
            return response.data
        } catch (error) {
            throw error;
        }
    },
    get_ranking_users_by_sells: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/users/get_rankin_users_sells`
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    get_actions_users_by_month: async (month: string) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/users/action_report_by_month`,
                {
                    params: { month }
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // NUEVOS REPORTES

    // REPORTE 1: Flujo de Billeteras
    get_wallet_flow_report: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/reports/wallet_flow`
            );
            return response.data;
        } catch (error) {
            console.error("Error al obtener reporte de flujo de billeteras");
            throw error;
        }
    },

    // REPORTE 2: Rendimiento de Promociones
    get_promotion_performance_report: async (fecha_inicio: string, fecha_fin: string) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/reports/promotion_performance`,
                { params: { fecha_inicio, fecha_fin } }
            );
            return response.data;
        } catch (error) {
            console.error("Error al obtener reporte de promociones");
            throw error;
        }
    },

    // REPORTE 3: Eventos por Organización
    get_events_organization_report: async (mes: string, anio: string) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/reports/events_organization`,
                { params: { mes, anio } }
            );
            return response.data;
        } catch (error) {
            console.error("Error al obtener reporte de eventos");
            throw error;
        }
    },

    // REPORTE 4: Productos y Servicios Más Vendidos
    get_top_products_services_report: async (mes: string, anio: string, limite: string = '10') => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/reports/top_products_services`,
                { params: { mes, anio, limite } }
            );
            return response.data;
        } catch (error) {
            console.error("Error al obtener reporte de productos/servicios");
            throw error;
        }
    },

    // REPORTE 5: Impacto Ambiental Comparativo
    get_environmental_impact_report: async (mes: string, anio: string) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/reports/environmental_impact`,
                { params: { mes, anio } }
            );
            return response.data;
        } catch (error) {
            console.error("Error al obtener reporte de impacto ambiental");
            throw error;
        }
    },

    // REPORTE 6: Comportamiento de Usuarios
    get_user_behavior_report: async (mes: string, anio: string) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/reports/user_behavior`,
                { params: { mes, anio } }
            );
            return response.data;
        } catch (error) {
            console.error("Error al obtener reporte de comportamiento");
            throw error;
        }
    },

    // REPORTE 7: Intercambios vs Compras
    get_exchanges_vs_purchases_report: async (mes: string, anio: string) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/reports/exchanges_vs_purchases`,
                { params: { mes, anio } }
            );
            return response.data;
        } catch (error) {
            console.error("Error al obtener reporte de intercambios vs compras");
            throw error;
        }
    },

    // REPORTE 8: Logros y Gamificación
    get_achievements_gamification_report: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/reports/achievements_gamification`
            );
            return response.data;
        } catch (error) {
            console.error("Error al obtener reporte de logros");
            throw error;
        }
    },

    // REPORTE 9: Calificaciones y Satisfacción
    get_ratings_satisfaction_report: async (mes: string, anio: string) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/reports/ratings_satisfaction`,
                { params: { mes, anio } }
            );
            return response.data;
        } catch (error) {
            console.error("Error al obtener reporte de calificaciones");
            throw error;
        }
    },

    // REPORTE 10: Potenciadores y Monetización
    get_boosters_monetization_report: async (mes: string, anio: string) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/reports/boosters_monetization`,
                { params: { mes, anio } }
            );
            return response.data;
        } catch (error) {
            console.error("Error al obtener reporte de potenciadores");
            throw error;
        }
    },

    // IMPACTO AMBIENTAL DE USUARIO
    get_user_environmental_impact: async (cod_us: number) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/users/${cod_us}/environmental_impact`
            );
            return response.data;
        } catch (error) {
            console.error("Error al obtener impacto ambiental del usuario");
            throw error;
        }
    }
}
