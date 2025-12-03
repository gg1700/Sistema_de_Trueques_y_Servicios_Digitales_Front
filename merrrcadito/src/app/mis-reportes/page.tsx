'use client'

import { useEffect, useState } from 'react';
import AppLayout from '@/Components/Templates/AppLayout/AppLayout';
import { ReportService } from '@/services';
import BarDiagram from '@/Components/Diagrams/BarDiagram';
import styles from './MisReportes.module.css';

interface SalesStats {
    totalVentas: number;
    totalIngresos: number;
    ventasPorCategoria: { categoria: string; cantidad: number; ingresos: number }[];
    transaccionesRecientes: any[];
}

interface MonthlySalesData {
    mes: number;
    cantidad: number;
}

interface MonthlyIncomeData {
    mes: number;
    ingresos: number;
}

export default function MisReportes() {
    const [userRole, setUserRole] = useState<'admin' | 'user' | 'entrepreneur'>('user');
    const [userId, setUserId] = useState<number | null>(null);
    const [stats, setStats] = useState<SalesStats>({
        totalVentas: 0,
        totalIngresos: 0,
        ventasPorCategoria: [],
        transaccionesRecientes: []
    });
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);
    const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [salesByMonth, setSalesByMonth] = useState<MonthlySalesData[]>([]);
    const [incomeByMonth, setIncomeByMonth] = useState<MonthlyIncomeData[]>([]);

    const months = [
        { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' },
        { value: 3, label: 'Marzo' }, { value: 4, label: 'Abril' },
        { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
        { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' },
        { value: 9, label: 'Septiembre' }, { value: 10, label: 'Octubre' },
        { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' }
    ];

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    useEffect(() => {
        const storedRole = localStorage.getItem('currentUserRole');
        if (storedRole === 'admin' || storedRole === 'user' || storedRole === 'entrepreneur') {
            setUserRole(storedRole as 'admin' | 'user' | 'entrepreneur');
        }

        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(parseInt(storedUserId));
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchSalesData();
        }
    }, [userId, selectedMonth, selectedYear]);

    const fetchSalesData = async () => {
        try {
            setLoading(true);
            console.log('🔍 FETCHING SALES DATA with filters:', {
                userId,
                selectedMonth,
                selectedYear
            });

            // Obtener total de ventas, total de ingresos, ventas por categoría, ventas por mes e ingresos por mes en paralelo
            const [salesResponse, incomeResponse, categoryResponse, salesByMonthResponse, incomeByMonthResponse] = await Promise.all([
                ReportService.get_user_total_sales(userId!),
                ReportService.get_user_total_income(userId!),
                ReportService.get_user_sales_by_category(userId!, selectedMonth, selectedYear),
                ReportService.get_user_sales_by_month(userId!, selectedYear),
                ReportService.get_user_income_by_month(userId!, selectedYear)
            ]);

            console.log('📊 Category Response:', categoryResponse);
            console.log('📊 Sales by Month Response:', salesByMonthResponse);
            console.log('📊 Income by Month Response:', incomeByMonthResponse);

            if (salesResponse.success && incomeResponse.success && categoryResponse.success) {
                const totalVentas = salesResponse.data;
                const totalIngresos = incomeResponse.data;
                const ventasPorCategoria = categoryResponse.data.map((item: any) => ({
                    categoria: item.categoria,
                    cantidad: item.cantidad,
                    ingresos: 0 // Por ahora no tenemos ingresos por categoría
                }));

                console.log('✅ Updated Stats - Ventas por Categoría:', ventasPorCategoria);

                setStats({
                    totalVentas,
                    totalIngresos,
                    ventasPorCategoria,
                    transaccionesRecientes: []
                });
            }

            if (salesByMonthResponse.success) {
                setSalesByMonth(salesByMonthResponse.data);
            }

            if (incomeByMonthResponse.success) {
                setIncomeByMonth(incomeByMonthResponse.data);
            }
        } catch (error) {
            console.error('❌ Error fetching sales data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout pageTitle='Mis Reportes' pageSubtitle='Estadísticas de ventas' userRole={userRole}>
            <div className={styles.container}>
                {loading ? (
                    <div className={styles.loading}>Cargando estadísticas...</div>
                ) : (
                    <>
                        <div className={styles.filters} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                            <select
                                value={selectedMonth || ''}
                                onChange={(e) => setSelectedMonth(e.target.value ? parseInt(e.target.value) : undefined)}
                                className={styles.select}
                                style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                            >
                                <option value="">Todos los meses</option>
                                {months.map(m => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>

                            <select
                                value={selectedYear || ''}
                                onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : undefined)}
                                className={styles.select}
                                style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                            >
                                <option value="">Todos los años</option>
                                {years.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tarjetas de resumen */}
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                                        <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
                                    </svg>
                                </div>
                                <div className={styles.statContent}>
                                    <h3 className={styles.statValue}>{stats.totalVentas}</h3>
                                    <p className={styles.statLabel}>Total de Ventas</p>
                                </div>
                            </div>

                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                                        <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className={styles.statContent}>
                                    <h3 className={styles.statValue}>{stats.totalIngresos.toFixed(2)} CV</h3>
                                    <p className={styles.statLabel}>Ingresos Totales</p>
                                </div>
                            </div>
                        </div>

                        {/* Ventas por categoría */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Ventas por Categoría</h2>
                            <div className={styles.chartContainer} style={{ marginTop: '20px', padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <BarDiagram
                                    data={{
                                        labels: stats.ventasPorCategoria.map(c => c.categoria),
                                        datasets: [
                                            {
                                                label: 'Cantidad de Ventas',
                                                data: stats.ventasPorCategoria.map(c => c.cantidad),
                                                backgroundColor: 'rgba(34, 197, 94, 0.6)', // Green-500 with opacity
                                                borderColor: 'rgba(34, 197, 94, 1)',
                                            },
                                        ],
                                    }}
                                    title={`Distribución de Ventas por Categoría ${selectedMonth ? `(${months.find(m => m.value === selectedMonth)?.label})` : ''} ${selectedYear ? `(${selectedYear})` : ''}`}
                                    height={300}
                                />
                            </div>
                        </div>


                        {/* Ventas por Mes */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Ventas por Mes</h2>
                            <div className={styles.chartContainer} style={{ marginTop: '20px', padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <BarDiagram
                                    data={{
                                        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                                        datasets: [
                                            {
                                                label: 'Cantidad de Ventas',
                                                data: salesByMonth.map(m => m.cantidad),
                                                backgroundColor: 'rgba(59, 130, 246, 0.6)', // Blue-500 with opacity
                                                borderColor: 'rgba(59, 130, 246, 1)',
                                            },
                                        ],
                                    }}
                                    title={`Ventas por Mes ${selectedYear ? `(${selectedYear})` : '(Todos los años)'}`}
                                    height={300}
                                />
                            </div>
                        </div>

                        {/* Ingresos por Mes */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Ingresos por Mes</h2>
                            <div className={styles.chartContainer} style={{ marginTop: '20px', padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <BarDiagram
                                    data={{
                                        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                                        datasets: [
                                            {
                                                label: 'Ingresos (CV)',
                                                data: incomeByMonth.map(m => m.ingresos),
                                                backgroundColor: 'rgba(16, 185, 129, 0.6)', // Emerald-500 with opacity
                                                borderColor: 'rgba(16, 185, 129, 1)',
                                            },
                                        ],
                                    }}
                                    title={`Ingresos por Mes ${selectedYear ? `(${selectedYear})` : '(Todos los años)'}`}
                                    height={300}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
