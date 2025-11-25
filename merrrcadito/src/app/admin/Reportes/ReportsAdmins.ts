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

<<<<<<< HEAD


export function useActionsUsers(month:string){
=======
// Hook existente
export function useActionsUsers(month: string) {
>>>>>>> origin/test/reportes
    const [data, setData] = useState();

    useEffect(() => {
        async function loadThirdRepo() {
<<<<<<< HEAD
            const response= await ReportService.get_actions_users_by_month(month);
            const actions= response.data;
            const mapActions= actions.map((action:any) => ({
=======
            const response = await ReportService.get_actions_users_by_month(month);
            const actions = response.data;
            const mapActions = actions.map((action: any) => ({
>>>>>>> origin/test/reportes
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
<<<<<<< HEAD
    },[month])
    return data
=======
    }, [month])
    return data;
>>>>>>> origin/test/reportes
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
    useBoostersMonetizationReport
}