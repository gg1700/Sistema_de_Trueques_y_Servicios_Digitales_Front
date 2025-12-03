'use client'

import { useEffect, useState } from 'react';
import AppLayout from '@/Components/Templates/AppLayout/AppLayout';
import { ReportService } from '@/services';
import styles from './MisReportes.module.css';

interface SalesStats {
    totalVentas: number;
    totalIngresos: number;
    ventasPorCategoria: { categoria: string; cantidad: number; ingresos: number }[];
    transaccionesRecientes: any[];
}

export default function MisReportes() {
    const [userRole, setUserRole] = useState<'admin' | 'user'>('user');
    const [userId, setUserId] = useState<number | null>(null);
    const [stats, setStats] = useState<SalesStats>({
        totalVentas: 0,
        totalIngresos: 0,
        ventasPorCategoria: [],
        transaccionesRecientes: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedRole = localStorage.getItem('currentUserRole');
        if (storedRole === 'admin' || storedRole === 'user') {
            setUserRole(storedRole);
        }

        const storedUserId = localStorage.getItem('currentUserId');
        if (storedUserId) {
            setUserId(parseInt(storedUserId));
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchSalesData();
        }
    }, [userId]);

    const fetchSalesData = async () => {
        try {
            setLoading(true);
            // Obtener historial de transacciones del usuario
            const response = await ReportService.get_user_transaction_history(userId!);

            if (response.success && response.data) {
                const transactions = response.data;

                // Filtrar solo las ventas (donde el usuario es el destino)
                const sales = transactions.filter((t: any) => t.cod_us_destino === userId);

                // Calcular estadísticas
                const totalVentas = sales.length;
                const totalIngresos = sales.reduce((sum: number, t: any) => sum + parseFloat(t.monto || 0), 0);

                // Agrupar por categoría (simplificado - necesitarías más datos del backend)
                const ventasPorCategoria = [
                    { categoria: 'Productos', cantidad: sales.filter((t: any) => t.tipo === 'producto').length, ingresos: 0 },
                    { categoria: 'Servicios', cantidad: sales.filter((t: any) => t.tipo === 'servicio').length, ingresos: 0 },
                ];

                // Últimas 5 transacciones
                const transaccionesRecientes = sales.slice(0, 5);

                setStats({
                    totalVentas,
                    totalIngresos,
                    ventasPorCategoria,
                    transaccionesRecientes
                });
            }
        } catch (error) {
            console.error('Error fetching sales data:', error);
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
                        {/* Tarjetas de resumen */}
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>📊</div>
                                <div className={styles.statContent}>
                                    <h3 className={styles.statValue}>{stats.totalVentas}</h3>
                                    <p className={styles.statLabel}>Total de Ventas</p>
                                </div>
                            </div>

                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>💰</div>
                                <div className={styles.statContent}>
                                    <h3 className={styles.statValue}>{stats.totalIngresos.toFixed(2)} CV</h3>
                                    <p className={styles.statLabel}>Ingresos Totales</p>
                                </div>
                            </div>
                        </div>

                        {/* Ventas por categoría */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Ventas por Categoría</h2>
                            <div className={styles.categoryGrid}>
                                {stats.ventasPorCategoria.map((cat, index) => (
                                    <div key={index} className={styles.categoryCard}>
                                        <h4 className={styles.categoryName}>{cat.categoria}</h4>
                                        <p className={styles.categoryValue}>{cat.cantidad} ventas</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Transacciones recientes */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Transacciones Recientes</h2>
                            <div className={styles.transactionsList}>
                                {stats.transaccionesRecientes.length > 0 ? (
                                    stats.transaccionesRecientes.map((trans: any, index: number) => (
                                        <div key={index} className={styles.transactionCard}>
                                            <div className={styles.transactionInfo}>
                                                <p className={styles.transactionDesc}>{trans.desc_trans || 'Venta'}</p>
                                                <p className={styles.transactionDate}>
                                                    {new Date(trans.fecha_trans).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className={styles.transactionAmount}>
                                                {parseFloat(trans.monto || 0).toFixed(2)} CV
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className={styles.noData}>No hay transacciones recientes</p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
