'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/Components/Templates/AppLayout/AppLayout';
import ExchangesView from '@/Components/Templates/ExchangesView/ExchangesView';
import ProposeExchangeModal from '@/Components/Molecules/ProposeExchangeModal/ProposeExchangeModal';
import { ExchangeService } from '@/services/exchangeService';
import styles from './page.module.css';

interface Exchange {
    cod_inter: number;
    nombre_prod_origen: string;
    desc_prod: string;
    nombre_usuario_1: string;
    handle_name_1: string;
    cant_prod_origen: number;
    unidad_medida_origen: string;
    impacto_amb_inter: number;
    tiene_foto: boolean;
}

export default function ExchangesPage() {
    const [userRole, setUserRole] = useState<'admin' | 'user' | 'entrepreneur'>('user');
    const [userId, setUserId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'detailed'>('list');
    const [exchanges, setExchanges] = useState<any[]>([]);
    const [selectedExchange, setSelectedExchange] = useState<any>(null);
    const [showExchangeModal, setShowExchangeModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Obtener userId y role de localStorage
        const storedUserId = localStorage.getItem('userId');
        const storedRole = localStorage.getItem('currentUserRole');

        if (storedRole === 'admin' || storedRole === 'user' || storedRole === 'entrepreneur') {
            setUserRole(storedRole as 'admin' | 'user' | 'entrepreneur');
        }

        if (storedUserId) {
            setUserId(parseInt(storedUserId));
            fetchExchanges();
        } else {
            // Si no hay usuario, redirigir al login
            router.push('/login');
        }
    }, [router]);

    const fetchExchanges = async () => {
        try {
            setLoading(true);
            const response = await ExchangeService.get_all_exchanges();
            if (response.success && response.data) {
                setExchanges(response.data);
            }
        } catch (error) {
            console.error('Error loading exchanges:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProposeClick = (exchange: Exchange) => {
        setSelectedExchange(exchange);
        setShowExchangeModal(true);
    };

    const handleSuccess = () => {
        fetchExchanges();
    };

    // Si está cargando el userId
    if (loading && !userId) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <p>Cargando...</p>
            </div>
        );
    }

    // Si no hay userId, no renderizar nada (se redirigirá)
    if (!userId) {
        return null;
    }

    // Si se detectó que hay ExchangesView disponible, usar vista detallada
    const useDetailedView = viewMode === 'detailed';

    if (useDetailedView) {
        return <ExchangesView userId={userId} />;
    }

    // Vista de lista simplificada (HEAD)
    return (
        <AppLayout pageTitle="Intercambios" pageSubtitle="Explora todas las oportunidades de intercambio" userRole={userRole}>
            <div className={styles.container}>
                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Cargando intercambios...</p>
                    </div>
                ) : exchanges.length === 0 ? (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>
                            <i className="bi bi-arrow-left-right"></i>
                        </div>
                        <h3>No hay intercambios disponibles</h3>
                        <p>Sé el primero en publicar una oferta de intercambio</p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {exchanges.map((exchange) => (
                            <div key={exchange.cod_inter} className={styles.card}>
                                <div className={styles.imageContainer}>
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_URL}/exchanges/${exchange.cod_inter}/image`}
                                        alt={exchange.nombre_prod_origen}
                                        className={styles.image}
                                    />
                                </div>

                                <div className={styles.cardContent}>
                                    <h3 className={styles.productName}>{exchange.nombre_prod_origen}</h3>
                                    <p className={styles.userHandle}>Por @{exchange.handle_name_1}</p>

                                    <div className={styles.offerDetails}>
                                        <div className={styles.detailRow}>
                                            <span className={styles.label}>Ofrece:</span>
                                            <span className={styles.value}>
                                                {exchange.cant_prod_origen} {exchange.unidad_medida_origen}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.badges}>
                                        <div className={styles.co2Badge}>
                                            <i className="bi bi-tree"></i>
                                            <span>{exchange.impacto_amb_inter} pts CO2</span>
                                        </div>
                                        <div className={styles.statusBadge}>
                                            Satisfactorio
                                        </div>
                                    </div>

                                    <p className={styles.description}>
                                        {exchange.desc_prod || 'Sin descripción disponible'}
                                    </p>

                                    <button
                                        className={styles.proposeButton}
                                        onClick={() => handleProposeClick(exchange)}
                                    >
                                        + Proponer Intercambio
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showExchangeModal && selectedExchange && (
                    <ProposeExchangeModal
                        exchange={selectedExchange}
                        onClose={() => setShowExchangeModal(false)}
                        onSuccess={handleSuccess}
                    />
                )}
            </div>
        </AppLayout>
    );
}
