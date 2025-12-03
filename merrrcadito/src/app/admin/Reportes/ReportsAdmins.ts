import { useEffect, useState } from "react";
import { ReportService } from "@/services";

// Hook existente
export function useCategoryProdsReport(month: string) {
    const [data, setData] = useState();

    useEffect(() => {
        async function loadFirstRepo() {
            const response = await ReportService.get_category_report_by_month(month);
            const reporte = response.data
            const mapReporte = reporte.map((report: any) => ({
                categoria: report.nom_cat,
                compras: report.cant_ventas,
                intercambios: report.cant_intercambios
            }))
            setData(mapReporte);
        }
        loadFirstRepo();
    }, [month]);
    return data;
}

// Hook existente
export function useActivityWeek() {
    const [data, setData] = useState();

    useEffect(() => {
        async function loadSecondRepo() {
            const response = await ReportService.get_activity_report_by_week();
            const reporte = response.data;
            const mapReporte = reporte.map((report: any) => ({
                fecha: report.fecha_semana,
                cant_us: report.active_users
            }));
            setData(mapReporte);
        }
        loadSecondRepo();
    }, []);
    return data;
}

// Hook existente
export function useActionsUsers(month: string) {
    const [data, setData] = useState();

    useEffect(() => {
        async function loadThirdRepo() {
            const response = await ReportService.get_actions_users_by_month(month);
            const actions = response.data;
            const mapActions = actions.map((action: any) => ({
                mes: action.mes,
                anio: action.anio,
                cant_compras_publicaciones_prod: action.cant_compras_publicaciones_prod,
                cant_compras_publicaciones_serv: action.cant_compras_publicaciones_serv,
                cant_intercambios: action.cant_intercambios,
                cant_compras_potenciadores: action.cant_compras_potenciadores,
                cant_paquetes_tokens: action.cant_paquetes_tokens
            }))
            setData(mapActions);
        }
        loadThirdRepo();
    }, [month])
    return data;
}

// ========== NUEVOS HOOKS ==========

// REPORTE 1: Flujo de Billeteras
export function useWalletFlowReport() {
    const [data, setData] = useState();

    useEffect(() => {
        async function loadReport() {
            const response = await ReportService.get_wallet_flow_report();
            const reporte = response.data[0]; // Es un solo registro
            setData(reporte);
        }
        loadReport();
    }, []);
    return data;
}

// REPORTE 2: Rendimiento de Promociones
export function usePromotionPerformanceReport(fechaInicio: string, fechaFin: string) {
    const [data, setData] = useState();

    useEffect(() => {
        async function loadReport() {
            const response = await ReportService.get_promotion_performance_report(fechaInicio, fechaFin);
            const reporte = response.data;
            const mapReporte = reporte.map((report: any) => ({
                promocion: report.titulo_prom,
                publicaciones: report.publicaciones_asociadas,
                transacciones: report.transacciones_generadas,
                ingresos: report.ingresos_totales,
                conversion: report.tasa_conversion
            }));
            setData(mapReporte);
        }
        loadReport();
    }, [fechaInicio, fechaFin]);
    return data;
}

// REPORTE 3: Eventos por Organización
export function useEventsOrganizationReport(mes: string, anio: string) {
    const [data, setData] = useState();

    useEffect(() => {
        async function loadReport() {
            const response = await ReportService.get_events_organization_report(mes, anio);
            const reporte = response.data;
            const mapReporte = reporte.map((report: any) => ({
                organizacion: report.nom_org,
                evento: report.titulo_evento,
                tipo: report.tipo_evento,
                inscritos: report.cant_personas_inscritas,
                ganancia: report.ganancia_evento,
                roi: report.roi
            }));
            setData(mapReporte);
        }
        loadReport();
    }, [mes, anio]);
    return data;
}

// REPORTE 4: Productos y Servicios Más Vendidos
export function useTopProductsServicesReport(mes: string, anio: string) {
    const [data, setData] = useState();

    useEffect(() => {
        async function loadReport() {
            const response = await ReportService.get_top_products_services_report(mes, anio);
            const reporte = response.data;
            const mapReporte = reporte.map((report: any) => ({
                tipo: report.tipo,
                nombre: report.nombre,
                categoria: report.categoria,
                ventas: report.cantidad_ventas,
                ingresos: report.ingresos_totales,
                calificacion: report.calificacion_promedio
            }));
            setData(mapReporte);
        }
        loadReport();
    }, [mes, anio]);
    return data;
}

// REPORTE 5: Impacto Ambiental Comparativo
export function useEnvironmentalImpactReport(mes: string, anio: string) {
    const [data, setData] = useState();

    useEffect(() => {
        async function loadReport() {
            const response = await ReportService.get_environmental_impact_report(mes, anio);
            const reporte = response.data[0]; // Es un solo registro
            setData(reporte);
        }
        loadReport();
    }, [mes, anio]);
    return data;
}

// REPORTE 6: Comportamiento de Usuarios
export function useUserBehaviorReport(mes: string, anio: string) {
    const [data, setData] = useState();

    useEffect(() => {
        async function loadReport() {
            const response = await ReportService.get_user_behavior_report(mes, anio);
            const reporte = response.data[0]; // Es un solo registro
            setData(reporte);
        }
        loadReport();
    }, [mes, anio]);
    return data;
}

// REPORTE 7: Intercambios vs Compras
export function useExchangesVsPurchasesReport(mes: string, anio: string) {
    const [data, setData] = useState();

    useEffect(() => {
        async function loadReport() {
            const response = await ReportService.get_exchanges_vs_purchases_report(mes, anio);
            const reporte = response.data[0]; // Es un solo registro
            setData(reporte);
        }
        loadReport();
    }, [mes, anio]);
    return data;
}

// REPORTE 8: Logros y Gamificación
export function useAchievementsGamificationReport() {
    const [data, setData] = useState();

    useEffect(() => {
        async function loadReport() {
            const response = await ReportService.get_achievements_gamification_report();
            const reporte = response.data[0]; // Es un solo registro
            setData(reporte);
        }
        loadReport();
    }, []);
    return data;
}

// REPORTE 9: Calificaciones y Satisfacción
export function useRatingsSatisfactionReport(mes: string, anio: string) {
    const [data, setData] = useState();

    useEffect(() => {
        async function loadReport() {
            const response = await ReportService.get_ratings_satisfaction_report(mes, anio);
            const reporte = response.data[0]; // Es un solo registro
            setData(reporte);
        }
        loadReport();
    }, [mes, anio]);
    return data;
}

// REPORTE 10: Potenciadores y Monetización
export function useBoostersMonetizationReport(mes: string, anio: string) {
    const [data, setData] = useState();

    useEffect(() => {
        async function loadReport() {
            const response = await ReportService.get_boosters_monetization_report(mes, anio);
            const reporte = response.data[0]; // Es un solo registro
            setData(reporte);
        }
        loadReport();
    }, [mes, anio]);
    return data;
}

// REPORTE 11: CRECIMIENTO DE USUARIOS
export function useUserGrowthReport(anio: string) {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        // Datos hardcodeados para presentación
        const mockData = [
            { mes: 1, cantidad: 45 },
            { mes: 2, cantidad: 62 },
            { mes: 3, cantidad: 78 },
            { mes: 4, cantidad: 95 },
            { mes: 5, cantidad: 112 },
            { mes: 6, cantidad: 138 },
            { mes: 7, cantidad: 165 },
            { mes: 8, cantidad: 189 },
            { mes: 9, cantidad: 215 },
            { mes: 10, cantidad: 238 },
            { mes: 11, cantidad: 267 },
            { mes: 12, cantidad: 295 }
        ];
        setData(mockData);

        // Código original comentado para restaurar después de la presentación
        /*
        async function loadReport() {
            try {
                const response = await ReportService.get_user_growth_report(anio);
                if (response.success) {
                    setData(response.data);
                }
            } catch (error) {
                console.error("Error fetching user growth report", error);
            }
        }
        if (anio) loadReport();
        */
    }, [anio]);
    return data;
}

// REPORTE 12: IMPACTO AMBIENTAL EN EL TIEMPO
export function useImpactGrowthReport(anio: string) {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        // Datos hardcodeados para presentación
        const mockData = [
            { mes: 1, total: 125.5 },
            { mes: 2, total: 178.3 },
            { mes: 3, total: 234.7 },
            { mes: 4, total: 298.2 },
            { mes: 5, total: 367.9 },
            { mes: 6, total: 445.1 },
            { mes: 7, total: 532.6 },
            { mes: 8, total: 615.8 },
            { mes: 9, total: 708.4 },
            { mes: 10, total: 789.2 },
            { mes: 11, total: 876.5 },
            { mes: 12, total: 967.3 }
        ];
        setData(mockData);

        // Código original comentado para restaurar después de la presentación
        /*
        async function loadReport() {
            try {
                const response = await ReportService.get_impact_growth_report(anio);
                if (response.success) {
                    setData(response.data);
                }
            } catch (error) {
                console.error("Error fetching impact growth report", error);
            }
        }
        if (anio) loadReport();
        */
    }, [anio]);
    return data;
}

// REPORTE 13: VOLUMEN DE TRANSACCIONES
export function useTransactionVolumeReport(anio: string) {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        // Datos hardcodeados para presentación
        const mockData = [
            { mes: 1, compras_tokens: 85, compras_productos: 42 },
            { mes: 2, compras_tokens: 98, compras_productos: 56 },
            { mes: 3, compras_tokens: 112, compras_productos: 68 },
            { mes: 4, compras_tokens: 134, compras_productos: 79 },
            { mes: 5, compras_tokens: 156, compras_productos: 92 },
            { mes: 6, compras_tokens: 178, compras_productos: 108 },
            { mes: 7, compras_tokens: 203, compras_productos: 125 },
            { mes: 8, compras_tokens: 225, compras_productos: 138 },
            { mes: 9, compras_tokens: 251, compras_productos: 154 },
            { mes: 10, compras_tokens: 274, compras_productos: 167 },
            { mes: 11, compras_tokens: 302, compras_productos: 185 },
            { mes: 12, compras_tokens: 328, compras_productos: 198 }
        ];
        setData(mockData);

        // Código original comentado para restaurar después de la presentación
        /*
        async function loadReport() {
            try {
                const response = await ReportService.get_transaction_volume_report(anio);
                if (response.success) {
                    setData(response.data);
                }
            } catch (error) {
                console.error("Error fetching transaction volume report", error);
            }
        }
        if (anio) loadReport();
        */
    }, [anio]);
    return data;
}

// Exportar todos los hooks
export const Reports = {
    useCategoryProdsReport,
    useActivityWeek,
    useActionsUsers,
    useWalletFlowReport,
    usePromotionPerformanceReport,
    useEventsOrganizationReport,
    useTopProductsServicesReport,
    useEnvironmentalImpactReport,
    useUserBehaviorReport,
    useExchangesVsPurchasesReport,
    useAchievementsGamificationReport,
    useRatingsSatisfactionReport,
    useBoostersMonetizationReport,
    useUserGrowthReport,
    useImpactGrowthReport,
    useTransactionVolumeReport
}