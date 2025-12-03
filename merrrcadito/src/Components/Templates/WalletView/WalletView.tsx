"use client";

import React, { useEffect, useState } from "react";
import styles from "./WalletView.module.css";
import { useSearchParams, useRouter } from "next/navigation";
import SideBar from "@/Components/Organisms/SideBar/SideBar";
import Link from "next/link";
import { ButtonIcon } from "@/Components/Atoms";

// Interfaces
interface WalletData {
    cod_billetera: number;
    cod_us: number;
    cuenta_bancaria: string;
    saldo_real: number;
    saldo_creditos: number;
    fecha_ultima_trans: string;
}


interface Transaction {
    cod_trans: number;
    cod_pub?: number;
    id_token?: number;
    cod_evento?: number;
    transaction_title?: string;
    cod_us_destino?: number;
    handle_name_destino?: string;
    vendedor_nombre?: string;
    vendedor_handle?: string;
    moneda: string;
    desc_trans: string;
    fecha_trans: string;
    monto_pagado: number;
    estado_trans: string;
    estado_escrow: string;
}

interface Exchange {
    cod_inter: number;
    fecha_inter: string;
    cod_us_2: number;
    nombre_usuario_2: string;
    handle_name_2: string;
    nombre_usuario_origen?: string;
    handle_name_origen?: string;
    cod_prod_origen: number;
    nombre_prod_origen: string;
    cod_prod_destino: number;
    nombre_prod_destino: string;
    cant_prod_origen: number;
    cant_prod_destino: number;
    unidad_medida_origen: string;
    unidad_medida_destino: string;
    impacto_amb_inter: number;
    estado_inter: string;
}

interface PendingCollection {
    cod_escrow: number;
    monto_pagado: number;
    monto_comision: number;
    estado_escrow: string;
    cod_trans: number;
    fecha_trans: string;
    moneda: string;
    desc_trans: string;
    nombre_origen: string;
    handle_origen: string;
    nombre_item?: string;
}

const WALLET_API_BASE = "http://localhost:5000/api/wallets";
const TRANSACTION_API_BASE = "http://localhost:5000/api/transactions";
const EXCHANGE_API_BASE = "http://localhost:5000/api/exchanges";
const USERS_API_BASE = "http://localhost:5000/api/users";
const POSTS_API_BASE = "http://localhost:5000/api/posts";
const TOKENS_API_BASE = "http://localhost:5000/api/tokens";
const EVENTS_API_BASE = "http://localhost:5000/api/events";
const PUBLICATIONS_API_BASE = process.env.NEXT_PUBLIC_POSTS_API_BASE_URL || "http://localhost:5000/api/publications";

export default function WalletView() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"info" | "transactions" | "exchanges" | "pending">("info");
    const [walletData, setWalletData] = useState<WalletData | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [exchanges, setExchanges] = useState<Exchange[]>([]);
    const [pendingRequests, setPendingRequests] = useState<Exchange[]>([]);
    const [pendingCollections, setPendingCollections] = useState<PendingCollection[]>([]);
    const [collectionFilter, setCollectionFilter] = useState<'retenido' | 'liberado'>('retenido');
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("Usuario");
    const [userId, setUserId] = useState<number | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    // CV Exchange Modal States
    const [showExchangeModal, setShowExchangeModal] = useState(false);
    const [selectedCVAmount, setSelectedCVAmount] = useState<number | null>(null);
    const [showCVExchangeSuccessModal, setShowCVExchangeSuccessModal] = useState(false);
    const [exchangeResult, setExchangeResult] = useState<any>(null);

    // Get user ID (simulated or from local storage/context)
    useEffect(() => {
        // Try to get from localStorage first
        const storedHandle = typeof window !== 'undefined' ? localStorage.getItem("currentUserHandle") : null;
        const storedRole = typeof window !== 'undefined' ? localStorage.getItem("currentUserRole") : null;

        setUserRole(storedRole);

        if (storedHandle) {
            fetchUserByHandle(storedHandle);
        } else {
            // Fallback or redirect to login
            setLoading(false);
        }
    }, []);

    const fetchUserByHandle = async (handle: string) => {
        try {
            const res = await fetch(`${USERS_API_BASE}/get_user_data?handle_name=${handle}`);
            const data = await res.json();

            if (data.success && data.data) {
                const user = Array.isArray(data.data) ? data.data[0] : data.data;
                setUserId(user.cod_us);
                setUserName(`${user.nom_us} ${user.ap_pat_us} ${user.ap_mat_us || ''}`);

                // The actual fetching of wallet/transactions/exchanges is now handled by the useEffect above
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    useEffect(() => {
        if (userId) {
            if (activeTab === "info") {
                fetchWalletData(userId);
                fetchPendingCollections(userId);
            } else if (activeTab === "transactions") {
                fetchTransactions(userId);
            } else if (activeTab === "exchanges") {
                fetchExchanges(userId);
            } else if (activeTab === "pending") {
                fetchPendingRequests(userId);
            }
        }
    }, [userId, activeTab]);

    const fetchWalletData = async (codUs: number) => {
        try {
            const res = await fetch(`${WALLET_API_BASE}/get_wallet_data_by_user?cod_us=${codUs}`);
            const data = await res.json();

            if (data.success && data.data && data.data.length > 0) {
                setWalletData(data.data[0]);
            }
        } catch (error) {
            console.error("Error fetching wallet data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingCollections = async (codUs: number) => {
        try {
            const res = await fetch(`${TRANSACTION_API_BASE}/pending_collections/${codUs}`);
            const data = await res.json();

            if (data.success && data.data) {
                setPendingCollections(data.data);
            }
        } catch (error) {
            console.error("Error fetching pending collections:", error);
        }
    };

    // Payment Confirmation Logic
    const [selectedPayment, setSelectedPayment] = useState<PendingCollection | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Exchange Request Confirmation Logic
    const [selectedExchangeRequest, setSelectedExchangeRequest] = useState<Exchange | null>(null);
    const [exchangeAction, setExchangeAction] = useState<'accept' | 'reject' | null>(null);
    const [showExchangeConfirmModal, setShowExchangeConfirmModal] = useState(false);
    const [showExchangeSuccessModal, setShowExchangeSuccessModal] = useState(false);

    const handleReceivePayment = (collection: PendingCollection) => {
        setSelectedPayment(collection);
        setShowConfirmModal(true);
    };

    const confirmPayment = async () => {
        if (!selectedPayment || !userId) return;

        try {
            const res = await fetch(`${TRANSACTION_API_BASE}/confirm_payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cod_us: userId,
                    cod_escrow: selectedPayment.cod_escrow
                }),
            });

            const data = await res.json();

            if (data.success) {
                setShowConfirmModal(false);
                setShowSuccessModal(true);

                // Update local state
                setPendingCollections(prev => prev.map(item =>
                    item.cod_escrow === selectedPayment.cod_escrow
                        ? { ...item, estado_escrow: 'liberado' }
                        : item
                ));

                // Refresh wallet data to show new balance
                fetchWalletData(userId);
            } else {
                alert('Error al confirmar el pago: ' + data.message);
            }
        } catch (error) {
            console.error('Error confirming payment:', error);
            alert('Error de conexión al confirmar el pago.');
        }
    };

    const fetchTransactions = async (codUs: number) => {
        try {
            const res = await fetch(`${TRANSACTION_API_BASE}/get_user_transaction_history?cod_us=${codUs}`);
            const data = await res.json();

            let transactionsList: Transaction[] = [];
            if (data.success && data.data) {
                transactionsList = data.data;
            } else if (Array.isArray(data)) {
                transactionsList = data;
            }

            console.log('Transacciones recibidas:', transactionsList);

            // Enriquecer transacciones con títulos reales y vendedores
            const enrichedTransactions = await Promise.all(
                transactionsList.map(async (trans) => {
                    const enrichedTrans = { ...trans };

                    // Obtener título real según el tipo de transacción
                    if (trans.cod_pub) {
                        // Es una compra de publicación
                        try {
                            const pubRes = await fetch(`${POSTS_API_BASE}/${trans.cod_pub}`);
                            if (pubRes.ok) {
                                const pubData = await pubRes.json();
                                if (pubData.success && pubData.data) {
                                    enrichedTrans.transaction_title = pubData.data.titulo_pub || pubData.data.nom_prod || trans.desc_trans || 'Publicación';
                                } else {
                                    enrichedTrans.transaction_title = trans.desc_trans || 'Publicación';
                                }
                            } else {
                                enrichedTrans.transaction_title = trans.desc_trans || 'Publicación';
                            }
                        } catch (err) {
                            console.error('Error fetching publication:', err);
                            enrichedTrans.transaction_title = trans.desc_trans || 'Publicación';
                        }
                    } else if (trans.id_token) {
                        // Es una compra de paquete de tokens
                        try {
                            const tokenRes = await fetch(`${TOKENS_API_BASE}/get_pack_by_id?id=${trans.id_token}`);
                            if (tokenRes.ok) {
                                const tokenData = await tokenRes.json();
                                if (tokenData.success && tokenData.data) {
                                    enrichedTrans.transaction_title = tokenData.data.nombre || trans.desc_trans || 'Paquete de Tokens';
                                } else {
                                    enrichedTrans.transaction_title = trans.desc_trans || 'Paquete de Tokens';
                                }
                            } else {
                                enrichedTrans.transaction_title = trans.desc_trans || 'Paquete de Tokens';
                            }
                        } catch (err) {
                            console.error('Error fetching token package:', err);
                            enrichedTrans.transaction_title = trans.desc_trans || 'Paquete de Tokens';
                        }
                    } else if (trans.cod_evento) {
                        // Es una inscripción a evento
                        try {
                            const eventRes = await fetch(`${EVENTS_API_BASE}/${trans.cod_evento}`);
                            if (eventRes.ok) {
                                const eventData = await eventRes.json();
                                if (eventData && eventData.nom_evento) {
                                    enrichedTrans.transaction_title = eventData.nom_evento || trans.desc_trans || 'Evento';
                                    // IMPORTANTE: Agregar el costo del evento como monto_pagado
                                    // PostgreSQL devuelve Decimals como objetos, convertir a número
                                    enrichedTrans.monto_pagado = Number(eventData.costo_inscripcion || 0);

                                    // Si es un evento de organización, mostrar el nombre de la organización como vendedor
                                    if (eventData.organizacion_nombre) {
                                        enrichedTrans.vendedor_nombre = eventData.organizacion_nombre;
                                        enrichedTrans.vendedor_handle = 'Organización';
                                    }
                                } else {
                                    enrichedTrans.transaction_title = trans.desc_trans || 'Evento';
                                    enrichedTrans.monto_pagado = 0;
                                }
                            } else {
                                enrichedTrans.transaction_title = trans.desc_trans || 'Evento';
                            }
                        } catch (err) {
                            console.error('Error fetching event:', err);
                            enrichedTrans.transaction_title = trans.desc_trans || 'Evento';
                        }
                    } else {
                        enrichedTrans.transaction_title = trans.desc_trans || 'Transacción';
                    }

                    // Obtener vendedor si existe
                    if (trans.cod_us_destino && trans.cod_us_destino !== codUs && trans.handle_name_destino) {
                        try {
                            const userRes = await fetch(`${USERS_API_BASE}/get_user_data?handle_name=${trans.handle_name_destino}`);
                            if (userRes.ok) {
                                const userData = await userRes.json();
                                if (userData.success && userData.data) {
                                    const user = Array.isArray(userData.data) ? userData.data[0] : userData.data;
                                    enrichedTrans.vendedor_nombre = `${user.nom_us} ${user.ap_pat_us} ${user.ap_mat_us || ''}`.trim();
                                    enrichedTrans.vendedor_handle = user.handle_name;
                                }
                            }
                        } catch (err) {
                            console.error('Error fetching seller data:', err);
                        }
                    }

                    if (!enrichedTrans.vendedor_nombre) {
                        enrichedTrans.vendedor_nombre = '-';
                        enrichedTrans.vendedor_handle = '';
                    }

                    return enrichedTrans;
                })
            );

            console.log('Transacciones enriquecidas:', enrichedTransactions);
            setTransactions(enrichedTransactions);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    const fetchExchanges = async (codUs: number) => {
        try {
            const res = await fetch(`${EXCHANGE_API_BASE}/get_user_exchange_history?cod_us=${codUs}`);
            const data = await res.json();

            if (data.success && data.data) {
                setExchanges(data.data);
            } else if (Array.isArray(data)) {
                setExchanges(data);
            }
        } catch (error) {
            console.error("Error fetching exchanges:", error);
        }
    };

    const fetchPendingRequests = async (codUs: number) => {
        try {
            const res = await fetch(`${EXCHANGE_API_BASE}/pending?cod_us=${codUs}`);
            const data = await res.json();

            if (data.success && data.data) {
                setPendingRequests(data.data);
            } else if (Array.isArray(data)) {
                setPendingRequests(data);
            }
        } catch (error) {
            console.error("Error fetching pending requests:", error);
        }
    };

    const acceptExchangeRequest = async (codInter: number) => {
        if (!userId) return;

        try {
            const res = await fetch(`${EXCHANGE_API_BASE}/${codInter}/accept`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cod_us: userId }),
            });

            const data = await res.json();

            if (data.success) {
                setShowExchangeConfirmModal(false);
                setShowExchangeSuccessModal(true);
                fetchPendingRequests(userId);
            } else {
                alert('Error al aceptar propuesta: ' + data.message);
            }
        } catch (error) {
            console.error('Error accepting request:', error);
            alert('Error de conexión al aceptar la propuesta.');
        }
    };

    const rejectExchangeRequest = async (codInter: number) => {
        if (!userId) return;

        try {
            const res = await fetch(`${EXCHANGE_API_BASE}/${codInter}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cod_us: userId }),
            });

            const data = await res.json();

            if (data.success) {
                setShowExchangeConfirmModal(false);
                setShowExchangeSuccessModal(true);
                fetchPendingRequests(userId);
            } else {
                alert('Error al rechazar propuesta: ' + data.message);
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Error de conexión al rechazar la propuesta.');
        }
    };

    const handleExchangeAction = (request: Exchange, action: 'accept' | 'reject') => {
        setSelectedExchangeRequest(request);
        setExchangeAction(action);
        setShowExchangeConfirmModal(true);
    };

    const confirmExchangeAction = async () => {
        if (!selectedExchangeRequest || !exchangeAction) return;

        if (exchangeAction === 'accept') {
            await acceptExchangeRequest(selectedExchangeRequest.cod_inter);
        } else {
            await rejectExchangeRequest(selectedExchangeRequest.cod_inter);
        }
    };

    const confirmCVExchange = async () => {
        if (!selectedCVAmount || !userId) return;

        try {
            const res = await fetch(`${USERS_API_BASE}/exchange_cv_to_bs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cod_us: userId,
                    cv_amount: selectedCVAmount
                }),
            });

            const data = await res.json();

            if (data.success) {
                setShowExchangeModal(false);
                setExchangeResult(data.data);
                setShowCVExchangeSuccessModal(true);

                // Refresh wallet data to show new balances
                fetchWalletData(userId);
            } else {
                alert('Error al canjear CV: ' + data.message);
            }
        } catch (error) {
            console.error('Error exchanging CV:', error);
            alert('Error de conexión al canjear CV.');
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>Cargando billetera...</p>
            </div>
        );
    }

    return (
        <>
            {/* Header Superior */}
            <header className={styles.topHeader}>
                <button
                    className={styles.hamburgerButton}
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Abrir menú"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <img
                    src="/images/logo_merrrcadito.png"
                    alt="MERRRCADITO"
                    className={styles.logoImage}
                    onClick={() => router.push('/Home')}
                />

                <div className={styles.headerActions}>
                    <ButtonIcon
                        icon='bi-wallet2'
                        type='profile'
                        onClick={() => router.push('/billetera')}
                        name="Billetera"
                    />
                    <ButtonIcon
                        icon='bi-person-circle'
                        type='profile'
                        onClick={() => console.log('Abrir profile')}
                        name="Perfil"
                    />
                </div>
            </header>

            {/* Sidebar */}
            <SideBar
                title="Menú"
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                menuItems={[
                    { icon: 'home', label: 'Inicio', href: '/' },
                    { icon: 'wallet', label: 'Billetera', href: '/billetera' },
                    { icon: 'profile', label: 'Perfil', href: '/perfil' },
                    { icon: 'promotions', label: 'Promociones', href: '/promociones' },
                    { icon: 'tokens', label: 'Tokens', href: '/tokens' },
                ]}
                currentPath="/billetera"
            />

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Billetera de {userName}</h1>

                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === "info" ? styles.activeTab : ""}`}
                            onClick={() => setActiveTab("info")}
                        >
                            Información de la Billetera
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === "transactions" ? styles.activeTab : ""}`}
                            onClick={() => setActiveTab("transactions")}
                        >
                            Historial de Transacciones
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === "exchanges" ? styles.activeTab : ""}`}
                            onClick={() => setActiveTab("exchanges")}
                        >
                            Historial de Intercambios
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === "pending" ? styles.activeTab : ""}`}
                            onClick={() => setActiveTab("pending")}
                        >
                            Solicitudes Pendientes
                        </button>
                    </div>
                </div>

                {activeTab === "info" && (
                    <div className={styles.walletInfoGrid}>
                        <div className={styles.infoCard}>
                            <div className={styles.iconWrapper}>
                                <i className="bi bi-piggy-bank"></i>
                            </div>
                            <div className={styles.infoContent}>
                                <span className={styles.label}>Cuenta Bancaria</span>
                                <span className={styles.value}>{walletData?.cuenta_bancaria || "No registrada"}</span>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.iconWrapper}>
                                <i className="bi bi-cash-stack"></i>
                            </div>
                            <div className={styles.infoContent}>
                                <span className={styles.label}>Saldo Actual en Bolivianos</span>
                                <span className={styles.value}>{walletData?.saldo_real || 0} Bs.</span>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.iconWrapper}>
                                <i className="bi bi-coin"></i>
                            </div>
                            <div className={styles.infoContent}>
                                <span className={styles.label}>Saldo Actual en Créditos Verdes</span>
                                <span className={styles.value}>{walletData?.saldo_creditos || 0} CV.</span>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.iconWrapper}>
                                <i className="bi bi-calendar-event"></i>
                            </div>
                            <div className={styles.infoContent}>
                                <span className={styles.label}>Fecha de Última Transacción</span>
                                <span className={styles.value}>
                                    {walletData?.fecha_ultima_trans
                                        ? new Date(walletData.fecha_ultima_trans).toLocaleDateString('es-ES')
                                        : "Sin movimientos"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "info" && (
                    <div className={styles.pendingCollectionsSection}>
                        <h2 className={styles.sectionTitle}>Cobros</h2>

                        {/* Filter Tabs */}
                        {/* CV Exchange Section - Only for Entrepreneurs */}
                        {userRole === 'entrepreneur' && (
                            <div className={styles.cvExchangeSection} style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px', border: '1px solid #e9ecef' }}>
                                <h3 style={{ color: '#10b981', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                                    <i className="bi bi-arrow-repeat"></i>
                                    Canjear Créditos Verdes por Bolivianos
                                </h3>
                                <p style={{ color: '#6c757d', marginBottom: '20px', fontSize: '14px' }}>
                                    <i className="bi bi-info-circle"></i> Tasa de cambio oficial: <strong>35 CV = 1 Bs</strong>. El monto se acreditará a tu saldo en Bolivianos.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
                                    {[100, 250, 500, 1000, 2000].map((amount) => {
                                        const bsAmount = (amount / 35).toFixed(2);
                                        return (
                                            <button
                                                key={amount}
                                                onClick={() => {
                                                    setSelectedCVAmount(amount);
                                                    setShowExchangeModal(true);
                                                }}
                                                style={{
                                                    padding: '15px',
                                                    backgroundColor: 'white',
                                                    border: '1px solid #10b981',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    textAlign: 'center',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '5px'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#10b981';
                                                    e.currentTarget.style.color = 'white';
                                                    // Force children color change if needed, though inheritance usually works
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'white';
                                                    e.currentTarget.style.color = 'inherit';
                                                }}
                                            >
                                                <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'inherit' }}>{amount} CV</span>
                                                <span style={{ fontSize: '13px', opacity: 0.8, color: 'inherit' }}>≈ {bsAmount} Bs</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className={styles.collectionFilters}>
                            <button
                                className={`${styles.filterTab} ${collectionFilter === 'retenido' ? styles.activeFilterTab : ''}`}
                                onClick={() => setCollectionFilter('retenido')}
                            >
                                Cobros Pendientes
                            </button>
                            <button
                                className={`${styles.filterTab} ${collectionFilter === 'liberado' ? styles.activeFilterTab : ''}`}
                                onClick={() => setCollectionFilter('liberado')}
                            >
                                Cobros Recibidos
                            </button>
                        </div>

                        {pendingCollections.filter(c => c.estado_escrow === collectionFilter).length === 0 ? (
                            <div className={styles.emptyState}>
                                {collectionFilter === 'retenido'
                                    ? 'No tienes cobros pendientes'
                                    : 'No tienes cobros recibidos'}
                            </div>
                        ) : (
                            <div className={styles.transactionsList}>
                                {pendingCollections
                                    .filter(c => c.estado_escrow === collectionFilter)
                                    .map((collection) => (
                                        <div key={collection.cod_escrow} className={styles.transactionCard}>
                                            <div className={styles.cardHeader}>
                                                <h3 className={styles.transactionTitle}>
                                                    Cobro Pendiente: {collection.titulo_publicacion || collection.desc_trans || "Transacción"}
                                                </h3>
                                            </div>

                                            <div className={styles.cardGrid}>
                                                <div className={styles.cardItem}>
                                                    <i className={`bi bi-hash ${styles.itemIcon}`}></i>
                                                    <div className={styles.itemContent}>
                                                        <span className={styles.itemLabel}>Código Escrow:</span>
                                                        <span className={styles.itemValue}>{collection.cod_escrow}</span>
                                                    </div>
                                                </div>

                                                <div className={styles.cardItem}>
                                                    <i className={`bi bi-calendar-check ${styles.itemIcon}`}></i>
                                                    <div className={styles.itemContent}>
                                                        <span className={styles.itemLabel}>Fecha de Pago:</span>
                                                        <span className={styles.itemValue}>
                                                            {new Date(collection.fecha_trans).toLocaleDateString('es-ES')}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className={styles.cardItem}>
                                                    <i className={`bi bi-person-circle ${styles.itemIcon}`}></i>
                                                    <div className={styles.itemContent}>
                                                        <span className={styles.itemLabel}>Pagador:</span>
                                                        <span className={styles.itemValue}>
                                                            {collection.nombre_origen} (@{collection.handle_origen})
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className={styles.cardItem}>
                                                    <i className={`bi bi-currency-dollar ${styles.itemIcon}`}></i>
                                                    <div className={styles.itemContent}>
                                                        <span className={styles.itemLabel}>Monto a Recibir:</span>
                                                        <span className={styles.itemValue}>{collection.monto_pagado} {collection.moneda}</span>
                                                    </div>
                                                </div>

                                                <div className={styles.cardItem}>
                                                    <i className={`bi bi-shield-lock ${styles.itemIcon}`}></i>
                                                    <div className={styles.itemContent}>
                                                        <span className={styles.itemLabel}>Estado:</span>
                                                        <span className={`${styles.itemValue} ${collection.estado_escrow === 'liberado' ? styles.escrowReleased : styles.escrowHeld}`}>
                                                            {collection.estado_escrow}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {collection.estado_escrow === 'retenido' && (
                                                <div className={styles.cardActions}>
                                                    <button
                                                        className={styles.receivePaymentButton}
                                                        onClick={() => handleReceivePayment(collection)}
                                                    >
                                                        Recibir Pago
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "transactions" && (
                    <div className={styles.transactionsList}>
                        {transactions.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                                No hay transacciones registradas
                            </div>
                        ) : (
                            transactions.map((trans) => (
                                <div key={trans.cod_trans} className={styles.transactionCard}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.transactionTitle}>
                                            Transacción: {trans.transaction_title || "Sin título"}
                                        </h3>
                                    </div>

                                    <div className={styles.cardGrid}>
                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-hash ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Código de la Transacción:</span>
                                                <span className={styles.itemValue}>{trans.cod_trans}</span>
                                            </div>
                                        </div>

                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-calendar-check ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Fecha de Realización:</span>
                                                <span className={styles.itemValue}>
                                                    {new Date(trans.fecha_trans).toLocaleDateString('es-ES')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-person-circle ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Vendedor:</span>
                                                <span className={styles.itemValue}>
                                                    {trans.vendedor_nombre || "-"} {trans.vendedor_handle ? `(@${trans.vendedor_handle})` : ""}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-currency-dollar ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Monto Pagado:</span>
                                                <span className={styles.itemValue}>{trans.monto_pagado || 0}</span>
                                            </div>
                                        </div>

                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-globe ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Moneda de Pago:</span>
                                                <span className={styles.itemValue}>{trans.moneda}</span>
                                            </div>
                                        </div>

                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-check-circle ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Estado de la Transacción:</span>
                                                <span className={`${styles.itemValue} ${trans.estado_trans === 'satisfactorio' ? styles.statusSuccess :
                                                    trans.estado_trans === 'pendiente' ? styles.statusPending : styles.statusFailed
                                                    }`}>
                                                    {trans.estado_trans}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-chat-text ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Descripción:</span>
                                                <span className={styles.itemValue}>{trans.desc_trans || '-'}</span>
                                            </div>
                                        </div>

                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-shield-check ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Estado en Escrow:</span>
                                                <span className={`${styles.itemValue} ${trans.estado_escrow === 'liberado' ? styles.escrowReleased : styles.escrowHeld
                                                    }`}>
                                                    {trans.estado_escrow}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "exchanges" && (
                    <div className={styles.transactionList}>
                        {exchanges.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                                No hay intercambios registrados
                            </div>
                        ) : (
                            exchanges.map((exchange, index) => (
                                <div key={`exchange-${exchange.cod_inter}-${index}`} className={styles.transactionCard}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.transactionTitle}>
                                            Intercambio: {exchange.nombre_prod_origen} con {exchange.nombre_prod_destino}
                                        </h3>
                                    </div>

                                    <div className={styles.cardGrid}>
                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-hash ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Código del Intercambio:</span>
                                                <span className={styles.itemValue}>{exchange.cod_inter}</span>
                                            </div>
                                        </div>

                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-calendar-event ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Fecha de Realización:</span>
                                                <span className={styles.itemValue}>
                                                    {new Date(exchange.fecha_inter || Date.now()).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-person-circle ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Usuario del Intercambio:</span>
                                                <span className={styles.itemValue}>
                                                    {exchange.nombre_usuario_2 || 'Usuario'} (@{exchange.handle_name_2 || 'pendiente'})
                                                </span>
                                            </div>
                                        </div>

                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-rulers ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Unidad de Medida:</span>
                                                <span className={styles.itemValue}>
                                                    {exchange.unidad_medida_origen}, {exchange.unidad_medida_destino || 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-box-seam ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Producto Ofrecido:</span>
                                                <span className={styles.itemValue}>{exchange.nombre_prod_origen}</span>
                                            </div>
                                        </div>

                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-box-seam ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Producto Obtenido:</span>
                                                <span className={styles.itemValue}>{exchange.nombre_prod_destino || 'Por definir'}</span>
                                            </div>
                                        </div>

                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-bar-chart ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Cantidad Intercambiada:</span>
                                                <span className={styles.itemValue}>
                                                    {exchange.cant_prod_origen}, {exchange.cant_prod_destino || 0}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-tree ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Impacto Ambiental:</span>
                                                <span className={styles.itemValue}>{exchange.impacto_amb_inter} puntos</span>
                                            </div>
                                        </div>

                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-check-circle ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Estado del Intercambio:</span>
                                                <span className={`${styles.itemValue} ${exchange.estado_inter === 'satisfactorio' ? styles.statusSuccess :
                                                    exchange.estado_inter === 'no_satisfactorio' ? styles.statusFailed : styles.statusPending
                                                    }`}>
                                                    {exchange.estado_inter || 'pendiente'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "pending" && (
                    <div className={styles.transactionsList}>
                        {pendingRequests.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                                No hay solicitudes de intercambio pendientes
                            </div>
                        ) : (
                            pendingRequests.map((request, index) => (
                                <div key={`pending-${request.cod_inter}-${index}`} className={styles.transactionCard}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.transactionTitle}>
                                            Solicitud: {request.nombre_usuario_origen} quiere intercambiar
                                        </h3>
                                    </div>

                                    <div className={styles.cardGrid}>
                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-hash ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Código del Intercambio:</span>
                                                <span className={styles.itemValue}>{request.cod_inter}</span>
                                            </div>
                                        </div>

                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-calendar-event ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Fecha de Solicitud:</span>
                                                <span className={styles.itemValue}>
                                                    {new Date(request.fecha_inter || Date.now()).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-person-circle ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Usuario Solicitante:</span>
                                                <span className={styles.itemValue}>
                                                    {request.nombre_usuario_origen} (@{request.handle_name_origen})
                                                </span>
                                            </div>
                                        </div>

                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-box-seam ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Ofrece:</span>
                                                <span className={styles.itemValue}>
                                                    {request.nombre_prod_origen} ({request.cant_prod_origen} {request.unidad_medida_origen})
                                                </span>
                                            </div>
                                        </div>

                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-box-seam ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Por tu producto:</span>
                                                <span className={styles.itemValue}>
                                                    {request.nombre_prod_destino} ({request.cant_prod_destino} {request.unidad_medida_destino})
                                                </span>
                                            </div>
                                        </div>

                                        <div className={styles.cardItem}>
                                            <i className={`bi bi-tree ${styles.itemIcon}`}></i>
                                            <div className={styles.itemContent}>
                                                <span className={styles.itemLabel}>Impacto Ambiental:</span>
                                                <span className={styles.itemValue}>{request.impacto_amb_inter} puntos</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.cardActions} style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                        <button
                                            className={styles.cancelButton}
                                            onClick={() => handleExchangeAction(request, 'reject')}
                                            style={{ backgroundColor: '#dc3545', color: 'white' }}
                                        >
                                            Rechazar
                                        </button>
                                        <button
                                            className={styles.receivePaymentButton}
                                            onClick={() => handleExchangeAction(request, 'accept')}
                                        >
                                            Aceptar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Confirm Modal */}
            {showConfirmModal && selectedPayment && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3 className={styles.modalTitle}>Confirmar Recepción de Pago</h3>
                        <p className={styles.modalText}>
                            Estás a punto de recibir el pago por: <strong>{selectedPayment.desc_trans || "Transacción"}</strong>
                        </p>
                        <div className={styles.modalDetails}>
                            <p><strong>Monto:</strong> {selectedPayment.monto_pagado} {selectedPayment.moneda}</p>
                            <p><strong>Pagador:</strong> {selectedPayment.nombre_origen}</p>
                        </div>
                        <p className={styles.modalWarning}>
                            ¿Está seguro de recibir el monto especificado como pago?
                        </p>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setShowConfirmModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className={styles.confirmButton}
                                onClick={confirmPayment}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.successIcon}>
                            <i className="bi bi-check-circle-fill"></i>
                        </div>
                        <h3 className={styles.modalTitle}>¡Pago Recibido!</h3>
                        <p className={styles.modalText}>
                            El pago ha sido liberado y acreditado a tu billetera exitosamente.
                        </p>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.confirmButton}
                                onClick={() => setShowSuccessModal(false)}
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Exchange Request Confirm Modal */}
            {showExchangeConfirmModal && selectedExchangeRequest && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3 className={styles.modalTitle}>
                            {exchangeAction === 'accept' ? 'Confirmar Aceptación' : 'Confirmar Rechazo'}
                        </h3>
                        <p className={styles.modalText}>
                            {exchangeAction === 'accept'
                                ? `¿Estás seguro de aceptar esta propuesta de intercambio de ${selectedExchangeRequest.nombre_usuario_origen}?`
                                : `¿Estás seguro de rechazar esta propuesta? El intercambio volverá a estar disponible y quedará registrado como rechazado en el historial.`
                            }
                        </p>
                        <div className={styles.modalDetails}>
                            <p><strong>Ofrece:</strong> {selectedExchangeRequest.nombre_prod_origen} ({selectedExchangeRequest.cant_prod_origen} {selectedExchangeRequest.unidad_medida_origen})</p>
                            <p><strong>Por tu:</strong> {selectedExchangeRequest.nombre_prod_destino} ({selectedExchangeRequest.cant_prod_destino} {selectedExchangeRequest.unidad_medida_destino})</p>
                        </div>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setShowExchangeConfirmModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className={styles.confirmButton}
                                onClick={confirmExchangeAction}
                            >
                                {exchangeAction === 'accept' ? 'Aceptar' : 'Rechazar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Exchange Request Success Modal */}
            {showExchangeSuccessModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3 className={styles.modalTitle}>
                            {exchangeAction === 'accept' ? '¡Propuesta Aceptada!' : '¡Propuesta Rechazada!'}
                        </h3>
                        <p className={styles.modalText}>
                            {exchangeAction === 'accept'
                                ? 'La propuesta de intercambio ha sido aceptada exitosamente.'
                                : 'La propuesta ha sido rechazada. El intercambio vuelve a estar disponible y queda registrado en tu historial.'
                            }
                        </p>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.confirmButton}
                                onClick={() => setShowExchangeSuccessModal(false)}
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CV Exchange Confirmation Modal */}
            {showExchangeModal && selectedCVAmount && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3 className={styles.modalTitle} style={{ color: '#10b981' }}>Confirmar Canje de CV</h3>
                        <p className={styles.modalText}>
                            Estás a punto de canjear tus Créditos Verdes por Bolivianos.
                        </p>
                        <div className={styles.modalDetails} style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '15px', borderRadius: '8px', margin: '15px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <strong>Canjeas:</strong>
                                <span style={{ color: '#10b981', fontWeight: 'bold' }}>{selectedCVAmount} CV</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <strong>Recibes:</strong>
                                <span style={{ color: '#047857', fontWeight: 'bold' }}>{(selectedCVAmount / 35).toFixed(2)} Bs</span>
                            </div>
                            <div style={{ borderTop: '1px dashed #bbf7d0', paddingTop: '10px', marginTop: '10px', fontSize: '0.9em', color: '#6c757d' }}>
                                Tasa de cambio: 35 CV = 1 Bs
                            </div>
                        </div>
                        <p className={styles.modalWarning} style={{ fontSize: '0.9em' }}>
                            Esta acción descontará los CV de tu saldo y acreditará los Bs correspondientes. ¿Deseas continuar?
                        </p>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setShowExchangeModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className={styles.confirmButton}
                                onClick={confirmCVExchange}
                                style={{ backgroundColor: '#10b981' }}
                            >
                                Confirmar Canje
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CV Exchange Success Modal */}
            {showCVExchangeSuccessModal && exchangeResult && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                            <i className="bi bi-check-circle-fill" style={{ fontSize: '3rem', color: '#10b981' }}></i>
                        </div>
                        <h3 className={styles.modalTitle} style={{ textAlign: 'center' }}>¡Canje Exitoso!</h3>
                        <p className={styles.modalText} style={{ textAlign: 'center' }}>
                            Has canjeado correctamente tus Créditos Verdes.
                        </p>
                        <div className={styles.modalDetails} style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '1.2em', margin: '10px 0' }}>
                                Has recibido: <strong>{exchangeResult.bs_received.toFixed(2)} Bs</strong>
                            </p>
                            <p style={{ fontSize: '0.9em', color: '#6c757d' }}>
                                Nuevo saldo CV: {exchangeResult.new_cv_balance} CV<br />
                                Nuevo saldo Bs: {exchangeResult.new_bs_balance.toFixed(2)} Bs
                            </p>
                        </div>
                        <div className={styles.modalActions} style={{ justifyContent: 'center' }}>
                            <button
                                className={styles.confirmButton}
                                onClick={() => setShowCVExchangeSuccessModal(false)}
                                style={{ backgroundColor: '#10b981', width: '100%' }}
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
