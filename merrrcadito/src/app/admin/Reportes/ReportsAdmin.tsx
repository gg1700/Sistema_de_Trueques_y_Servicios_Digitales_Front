'use client'
import { useState } from 'react';
import BarDiagram from '@/Components/Diagrams/BarDiagram';
import LineDiagram from '@/Components/Diagrams/LineDiagram';
import styles from './reportsAdmin.module.css'
import {
    Reports
} from './ReportsAdmins';

export default function ReportsAdmin() {
    const [currentMonth, setCurrentMonth] = useState<string>(new Date().getMonth() + 1 + "");
    const [currentYear, setCurrentYear] = useState<string>(new Date().getFullYear() + "");

    // Hooks para reportes existentes
    const categoryProdsData = Reports.useCategoryProdsReport(currentMonth);
    const activityWeekData = Reports.useActivityWeek();
    const actionsUsersData = Reports.useActionsUsers(currentMonth);
    const walletFlowData = Reports.useWalletFlowReport();
    const promotionPerformanceData = Reports.usePromotionPerformanceReport("2024-01-01", "2024-12-31");
    const eventsOrganizationData = Reports.useEventsOrganizationReport(currentMonth, currentYear);
    const topProductsServicesData = Reports.useTopProductsServicesReport(currentMonth, currentYear);
    const environmentalImpactData = Reports.useEnvironmentalImpactReport(currentMonth, currentYear);
    const userBehaviorData = Reports.useUserBehaviorReport(currentMonth, currentYear);
    const exchangesVsPurchasesData = Reports.useExchangesVsPurchasesReport(currentMonth, currentYear);
    const achievementsGamificationData = Reports.useAchievementsGamificationReport();
    const ratingsSatisfactionData = Reports.useRatingsSatisfactionReport(currentMonth, currentYear);
    const boostersMonetizationData = Reports.useBoostersMonetizationReport(currentMonth, currentYear);

    // Nuevos reportes de series de tiempo
    const userGrowthData = Reports.useUserGrowthReport(currentYear);
    const impactGrowthData = Reports.useImpactGrowthReport(currentYear);
    const transactionVolumeData = Reports.useTransactionVolumeReport(currentYear);

    // Configuración de datos para los gráficos de línea
    const userGrowthChartData = {
        labels: userGrowthData?.map((d: any) => {
            const date = new Date();
            date.setDate(1);
            date.setMonth(d.mes - 1);
            return date.toLocaleString('es-ES', { month: 'short' });
        }) || [],
        datasets: [
            {
                label: 'Nuevos Usuarios',
                data: userGrowthData?.map((d: any) => d.cantidad) || [],
                borderColor: '#4299e1',
                backgroundColor: 'rgba(66, 153, 225, 0.2)',
                fill: true,
            }
        ]
    };

    const impactGrowthChartData = {
        labels: impactGrowthData?.map((d: any) => {
            const date = new Date();
            date.setDate(1);
            date.setMonth(d.mes - 1);
            return date.toLocaleString('es-ES', { month: 'short' });
        }) || [],
        datasets: [
            {
                label: 'Impacto Total (kg CO2)',
                data: impactGrowthData?.map((d: any) => d.total) || [],
                borderColor: '#48bb78',
                backgroundColor: 'rgba(72, 187, 120, 0.2)',
                fill: true,
            }
        ]
    };

    const transactionVolumeChartData = {
        labels: transactionVolumeData?.map((d: any) => {
            const date = new Date();
            date.setDate(1);
            date.setMonth(d.mes - 1);
            return date.toLocaleString('es-ES', { month: 'short' });
        }) || [],
        datasets: [
            {
                label: 'Compras de Tokens',
                data: transactionVolumeData?.map((d: any) => d.compras_tokens) || [],
                borderColor: '#ed8936',
                backgroundColor: 'rgba(237, 137, 54, 0.2)',
            },
            {
                label: 'Compras de Productos',
                data: transactionVolumeData?.map((d: any) => d.compras_productos) || [],
                borderColor: '#805ad5',
                backgroundColor: 'rgba(128, 90, 213, 0.2)',
            }
        ]
    };

    // Transformación de datos para gráficos de barras
    const safeCategoryProdsData = Array.isArray(categoryProdsData) ? categoryProdsData : [];
    const categoryProdsChartData = {
        labels: safeCategoryProdsData.map((d: any) => d.categoria),
        datasets: [
            {
                label: 'Compras',
                data: safeCategoryProdsData.map((d: any) => d.compras),
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
            },
            {
                label: 'Intercambios',
                data: safeCategoryProdsData.map((d: any) => d.intercambios),
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
            }
        ]
    };

    const safeActivityWeekData = Array.isArray(activityWeekData) ? activityWeekData : [];
    const activityWeekChartData = {
        labels: safeActivityWeekData.map((d: any) => d.fecha),
        datasets: [
            {
                label: 'Usuarios Activos',
                data: safeActivityWeekData.map((d: any) => d.cant_us),
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
            }
        ]
    };

    const safeActionsUsersData = Array.isArray(actionsUsersData) ? actionsUsersData : [];
    const actionsData: any = safeActionsUsersData.length > 0 ? safeActionsUsersData[0] : {};
    const actionsUsersChartData = {
        labels: ['Productos', 'Servicios', 'Intercambios', 'Potenciadores', 'Tokens'],
        datasets: [
            {
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
                ]
            }
        ]
    };

    const safeEventsOrganizationData = Array.isArray(eventsOrganizationData) ? eventsOrganizationData : [];
    const eventsOrganizationChartData = {
        labels: safeEventsOrganizationData.map((d: any) => d.evento),
        datasets: [
            {
                label: 'Inscritos',
                data: safeEventsOrganizationData.map((d: any) => d.inscritos),
                backgroundColor: 'rgba(153, 102, 255, 0.8)',
            },
            {
                label: 'Ganancia (CV)',
                data: safeEventsOrganizationData.map((d: any) => d.ganancia),
                backgroundColor: 'rgba(255, 159, 64, 0.8)',
            }
        ]
    };

    const safeTopProductsServicesData = Array.isArray(topProductsServicesData) ? topProductsServicesData : [];
    const topProductsServicesChartData = {
        labels: safeTopProductsServicesData.map((d: any) => d.nombre),
        datasets: [
            {
                label: 'Ventas',
                data: safeTopProductsServicesData.map((d: any) => d.ventas),
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
            },
            {
                label: 'Ingresos (CV)',
                data: safeTopProductsServicesData.map((d: any) => d.ingresos),
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
            }
        ]
    };

    const reportConfigs = [
        {
            title: "Flujo de Billeteras",
            description: "Resumen del estado financiero de las billeteras de los usuarios.",
            data: walletFlowData,
            type: 'summary'
        },
        {
            title: "Actividad Semanal",
            description: "Distribución de la actividad de los usuarios durante la semana.",
            data: activityWeekChartData,
            type: 'chart'
        },
        {
            title: "Acciones de Usuarios",
            description: "Conteo de diferentes tipos de acciones realizadas por los usuarios.",
            data: actionsUsersChartData,
            type: 'chart'
        },
        {
            title: "Categorías de Productos",
            description: "Cantidad de productos por categoría.",
            data: categoryProdsChartData,
            type: 'chart'
        },
        {
            title: "Rendimiento de Promociones",
            description: "Análisis del impacto de las promociones.",
            data: promotionPerformanceData,
            type: 'summary'
        },
        {
            title: "Eventos por Organización",
            description: "Cantidad de eventos organizados por cada organización.",
            data: eventsOrganizationChartData,
            type: 'chart'
        },
        {
            title: "Productos/Servicios Top",
            description: "Los productos y servicios más populares.",
            data: topProductsServicesChartData,
            type: 'chart'
        },
        {
            title: "Impacto Ambiental",
            description: "Métricas relacionadas con el impacto ambiental.",
            data: environmentalImpactData,
            type: 'summary'
        },
        {
            title: "Comportamiento de Usuarios",
            description: "Análisis del comportamiento de los usuarios.",
            data: userBehaviorData,
            type: 'summary'
        },
        {
            title: "Intercambios vs Compras",
            description: "Comparación entre intercambios y compras directas.",
            data: exchangesVsPurchasesData,
            type: 'summary'
        },
        {
            title: "Logros y Gamificación",
            description: "Estado de los logros y la gamificación.",
            data: achievementsGamificationData,
            type: 'summary'
        },
        {
            title: "Calificaciones y Satisfacción",
            description: "Niveles de satisfacción de los usuarios.",
            data: ratingsSatisfactionData,
            type: 'summary'
        },
        {
            title: "Potenciadores y Monetización",
            description: "Uso de potenciadores y métricas de monetización.",
            data: boostersMonetizationData,
            type: 'summary'
        },
        // Nuevos reportes de línea
        {
            title: "Crecimiento de Usuarios",
            description: "Nuevos usuarios registrados por mes.",
            data: userGrowthChartData,
            type: 'line'
        },
        {
            title: "Impacto Ambiental en el Tiempo",
            description: "Evolución del impacto ambiental (kg CO2) mensual.",
            data: impactGrowthChartData,
            type: 'line'
        },
        {
            title: "Volumen de Transacciones",
            description: "Comparativa mensual de compras de tokens vs productos.",
            data: transactionVolumeChartData,
            type: 'line'
        }
    ];

    // Separar reportes por tipo
    const summaryReports = reportConfigs.filter(r => r.type === 'summary');
    const chartReports = reportConfigs.filter(r => r.type === 'chart');
    const lineReports = reportConfigs.filter(r => r.type === 'line');

    // Componente para mostrar datos de resumen
    const SummaryCardContent = ({ data, title, description }: { data: any, title: string, description?: string }) => {
        if (!data) return <div className={styles.loading}>Cargando...</div>;

        const displayData = Array.isArray(data) ? data[0] : data;
        if (!displayData) return <div className={styles.loading}>Sin datos</div>;

        return (
            <>
                {Object.entries(displayData).map(([key, value]: [string, any]) => {
                    const label = key
                        .replace(/_/g, ' ')
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/\b\w/g, l => l.toUpperCase());

                    let formattedValue = value;
                    if (typeof value === 'number') {
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
                            <span className={styles.summaryLabel}>{title.split('-')[0].trim()}</span>
                            <span className={styles.summaryValue}>{formattedValue}</span>
                            <span style={{ fontSize: '0.8rem', color: '#8898aa', marginTop: '0.5rem' }}>
                                {label}
                            </span>
                        </div>
                    );
                })}
            </>
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

            {/* Sección de Resúmenes (KPIs) */}
            <div className={styles.dashboardGrid}>
                {summaryReports.map((config, index) => (
                    <SummaryCardContent
                        key={index}
                        data={config.data}
                        title={config.title}
                        description={config.description}
                    />
                ))}
            </div>

            {/* Sección de Gráficos de Línea (Tendencias) */}
            {lineReports.length > 0 && (
                <>
                    <h2 className={styles.principalTitle} style={{ fontSize: '1.8rem', marginTop: '3rem' }}>Tendencias y Crecimiento</h2>
                    <div className={styles.chartsGrid}>
                        {lineReports.map((config, index) => (
                            <div key={index} className={styles.chartCard}>
                                <h3 className={styles.chartTitle}>{config.title}</h3>
                                {config.description && (
                                    <p className={styles.chartDescription}>{config.description}</p>
                                )}
                                <div style={{ flex: 1, minHeight: '300px' }}>
                                    <LineDiagram
                                        data={config.data}
                                        title=""
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Sección de Gráficos de Barras */}
            <h2 className={styles.principalTitle} style={{ fontSize: '1.8rem', marginTop: '3rem' }}>Análisis Detallado</h2>
            <div className={styles.chartsGrid}>
                {chartReports.map((config, index) => (
                    <div key={index} className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>{config.title}</h3>
                        {config.description && (
                            <p className={styles.chartDescription}>{config.description}</p>
                        )}
                        <div style={{ flex: 1, minHeight: '300px' }}>
                            <BarDiagram
                                data={config.data}
                                title="" // Título ya mostrado arriba
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
