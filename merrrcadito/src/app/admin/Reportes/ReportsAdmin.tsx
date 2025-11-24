'use client'
import { useState } from 'react';
import { AccordionForm } from '@/Components/Organisms';
import BarDiagram from '@/Components/Diagrams/BarDiagram';
import styles from './reportsAdmin.module.css'
import {
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
} from './ReportsAdmins'

export default function ReportsAdmin() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [currentMonth, setCurrentMonth] = useState("11");
    const [currentYear, setCurrentYear] = useState("2025");

    // Reportes existentes
    const reporteUno = useCategoryProdsReport(currentMonth);
    const safeReporteUno = Array.isArray(reporteUno) ? reporteUno : [];

    // Filtrar categorías que tienen al menos una compra o intercambio
    const filteredReporteUno = safeReporteUno.filter((dato: any) =>
        (dato.compras > 0 || dato.intercambios > 0)
    );

    const categoriasData = {
        labels: filteredReporteUno.map((dato: any) => dato.categoria),
        datasets: [{
            label: 'Compras',
            data: filteredReporteUno.map((dato: any) => dato.compras),
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
        }, {
            label: 'Intercambios',
            data: filteredReporteUno.map((dato: any) => dato.intercambios),
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
        }]
    };

    const reporteDos = useActivityWeek();
    const safeReporteDos = Array.isArray(reporteDos) ? reporteDos : [];

    const usuariosActivityData = {
        labels: safeReporteDos.map((dato: any) => dato.fecha),
        datasets: [{
            label: 'Activos',
            data: safeReporteDos.map((dato: any) => dato.cant_us),
            backgroundColor: 'rgba(75, 192, 192, 0.8)',
        }]
    };

    const reporteTres = useActionsUsers(currentMonth);
    const safeReporteTres = Array.isArray(reporteTres) ? reporteTres : [];

    // Extraer el primer elemento si existe (ya que el SP devuelve un solo registro)
    const actionsData = safeReporteTres.length > 0 ? safeReporteTres[0] : {
        cant_compras_publicaciones_prod: 0,
        cant_compras_publicaciones_serv: 0,
        cant_intercambios: 0,
        cant_compras_potenciadores: 0,
        cant_paquetes_tokens: 0
    };

    const usuariosActionsData = {
        labels: ['Productos', 'Servicios', 'Intercambios', 'Potenciadores', 'CV'],
        datasets: [{
            label: 'Cantidad',
            data: [
                actionsData.cant_compras_publicaciones_prod || 0,
                actionsData.cant_compras_publicaciones_serv || 0,
                actionsData.cant_intercambios || 0,
                actionsData.cant_compras_potenciadores || 0,
                actionsData.cant_paquetes_tokens || 0
            ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)'
            ],
        }]
    };

    // NUEVOS REPORTES

    // Reporte 1: Flujo de Billeteras (Datos únicos)
    const walletFlowData: any = useWalletFlowReport();

    // Reporte 2: Rendimiento de Promociones
    const promotionData = usePromotionPerformanceReport("2025-01-01", "2025-12-31");
    const safePromotionData = Array.isArray(promotionData) ? promotionData : [];
    const promotionChartData = {
        labels: safePromotionData.map((d: any) => d.promocion),
        datasets: [{
            label: 'Ingresos (CV)',
            data: safePromotionData.map((d: any) => d.ingresos),
            backgroundColor: 'rgba(255, 206, 86, 0.8)',
        }, {
            label: 'Tasa Conversión (%)',
            data: safePromotionData.map((d: any) => d.conversion),
            backgroundColor: 'rgba(75, 192, 192, 0.8)',
        }]
    };

    // Reporte 3: Eventos por Organización
    const eventsData = useEventsOrganizationReport(currentMonth, currentYear);
    const safeEventsData = Array.isArray(eventsData) ? eventsData : [];
    const eventsChartData = {
        labels: safeEventsData.map((d: any) => d.evento),
        datasets: [{
            label: 'Inscritos',
            data: safeEventsData.map((d: any) => d.inscritos),
            backgroundColor: 'rgba(153, 102, 255, 0.8)',
        }, {
            label: 'Ganancia (CV)',
            data: safeEventsData.map((d: any) => d.ganancia),
            backgroundColor: 'rgba(255, 159, 64, 0.8)',
        }]
    };

    // Reporte 4: Top Productos/Servicios
    const topProductsData = useTopProductsServicesReport(currentMonth, currentYear);
    const safeTopProductsData = Array.isArray(topProductsData) ? topProductsData : [];
    const topProductsChartData = {
        labels: safeTopProductsData.map((d: any) => d.nombre),
        datasets: [{
            label: 'Ventas',
            data: safeTopProductsData.map((d: any) => d.ventas),
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
        }, {
            label: 'Ingresos (CV)',
            data: safeTopProductsData.map((d: any) => d.ingresos),
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
        }]
    };

    // Reporte 5: Impacto Ambiental (Datos únicos)
    const environmentalData: any = useEnvironmentalImpactReport(currentMonth, currentYear);

    // Reporte 6: Comportamiento de Usuarios (Datos únicos)
    const userBehaviorData: any = useUserBehaviorReport(currentMonth, currentYear);

    // Reporte 7: Intercambios vs Compras (Datos únicos)
    const exchangesVsPurchasesData: any = useExchangesVsPurchasesReport(currentMonth, currentYear);

    // Reporte 8: Logros y Gamificación (Datos únicos)
    const achievementsData: any = useAchievementsGamificationReport();

    // Reporte 9: Calificaciones y Satisfacción (Datos únicos)
    const ratingsData: any = useRatingsSatisfactionReport(currentMonth, currentYear);

    // Reporte 10: Potenciadores (Datos únicos)
    const boostersData: any = useBoostersMonetizationReport(currentMonth, currentYear);

    const reportConfigs = [
        // Reportes existentes
        {
            title: "Categorias de Productos y sus Ventas o Intercambios",
            data: categoriasData,
            type: 'chart'
        },
        {
            title: "Usuarios Activos de la Semana",
            data: usuariosActivityData,
            type: 'chart'
        },
        {
            title: "Acciones de usuarios en el mes",
            data: usuariosActionsData,
            type: 'chart'
        },
        // Nuevos reportes
        {
            title: "💰 Flujo de Billeteras - Salud Financiera del Sistema",
            data: walletFlowData,
            type: 'summary',
            description: "Monitorea la liquidez y distribución de riqueza en el ecosistema"
        },
        {
            title: "📈 Rendimiento de Promociones - ROI de Marketing",
            data: promotionChartData,
            type: 'chart',
            description: "Mide la efectividad de las campañas promocionales"
        },
        {
            title: "📅 Eventos por Organización - Desempeño de Eventos",
            data: eventsChartData,
            type: 'chart',
            description: "Analiza el éxito de eventos benéficos y monetizables"
        },
        {
            title: "🏆 Productos y Servicios Más Vendidos - Top Sellers",
            data: topProductsChartData,
            type: 'chart',
            description: "Identifica los productos y servicios con mayor demanda"
        },
        {
            title: "🌱 Impacto Ambiental Comparativo - Huella de CO2",
            data: environmentalData,
            type: 'summary',
            description: "Compara el impacto ambiental entre usuarios y categorías"
        },
        {
            title: "👥 Comportamiento de Usuarios - Retención y Engagement",
            data: userBehaviorData,
            type: 'summary',
            description: "Analiza patrones de uso y salud de la base de usuarios"
        },
        {
            title: "🔄 Intercambios vs Compras - Preferencias del Sistema",
            data: exchangesVsPurchasesData,
            type: 'summary',
            description: "Compara las dos modalidades principales de transacción"
        },
        {
            title: "🏅 Logros y Gamificación - Efectividad del Sistema",
            data: achievementsData,
            type: 'summary',
            description: "Evalúa la efectividad del sistema de logros"
        },
        {
            title: "⭐ Calificaciones y Satisfacción - Calidad del Servicio",
            data: ratingsData,
            type: 'summary',
            description: "Mide la satisfacción general y calidad del servicio"
        },
        {
            title: "💎 Potenciadores y Monetización - Ingresos del Sistema",
            data: boostersData,
            type: 'summary',
            description: "Analiza el uso de potenciadores y su impacto en ingresos"
        }
    ];

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    }

    // Componente para mostrar datos de resumen con nuevo diseño
    const SummaryReport = ({ data }: { data: any }) => {
        if (!data) return <div className={styles.loading}>Cargando datos...</div>;

        // Si es un array, tomamos el primer elemento (para reportes que devuelven array de 1 objeto)
        const displayData = Array.isArray(data) ? data[0] : data;

        if (!displayData) return <div className={styles.loading}>No hay datos disponibles</div>;

        return (
            <div className={styles.summaryContainer}>
                {Object.entries(displayData).map(([key, value]: [string, any]) => {
                    // Formatear la etiqueta
                    const label = key
                        .replace(/_/g, ' ')
                        .replace(/([A-Z])/g, ' $1') // Separar camelCase
                        .replace(/\b\w/g, l => l.toUpperCase()); // Capitalizar

                    // Formatear el valor
                    let formattedValue = value;
                    if (typeof value === 'number') {
                        // Si parece dinero o porcentaje
                        if (key.includes('precio') || key.includes('ingresos') || key.includes('gasto') || key.includes('costo')) {
                            formattedValue = `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                        } else if (key.includes('porcentaje') || key.includes('tasa') || key.includes('promedio')) {
                            formattedValue = value % 1 !== 0 ? value.toFixed(2) : value;
                            if (key.includes('tasa') || key.includes('porcentaje')) formattedValue += '%';
                        } else {
                            formattedValue = value.toLocaleString();
                        }
                    }

                    return (
                        <div key={key} className={styles.summaryCard}>
                            <span className={styles.summaryLabel}>{label}</span>
                            <span className={styles.summaryValue}>{formattedValue}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.principalTitle}>Reportes Administrativos</h1>

            <div className={styles.filterSection}>
                <label>
                    Mes:
                    <select value={currentMonth} onChange={(e) => setCurrentMonth(e.target.value)}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Año:
                    <select value={currentYear} onChange={(e) => setCurrentYear(e.target.value)}>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </select>
                </label>
            </div>

            <div className={styles.subtitleSection}>
                {reportConfigs.map((config, index) => (
                    <div key={index} className={styles.subtitleItem}>
                        <AccordionForm
                            triggerText={config.title}
                            isOpen={openIndex === index}
                            onToggle={() => handleToggle(index)}
                            variant='FullWidth'
                        >
                            {config.description && (
                                <p className={styles.description}>{config.description}</p>
                            )}
                            {config.type === 'chart' ? (
                                <BarDiagram
                                    data={config.data}
                                    title={config.title}
                                />
                            ) : (
                                <SummaryReport data={config.data} />
                            )}
                        </AccordionForm>
                    </div>
                ))}
            </div>
        </div>
    );
}
