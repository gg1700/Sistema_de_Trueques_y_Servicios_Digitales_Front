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
    const [activeTab, setActiveTab] = useState<"info" | "transactions" | "exchanges">("info");
    const [walletData, setWalletData] = useState<WalletData | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [exchanges, setExchanges] = useState<Exchange[]>([]);
    const [pendingCollections, setPendingCollections] = useState<PendingCollection[]>([]);
    const [collectionFilter, setCollectionFilter] = useState<'retenido' | 'liberado'>('retenido');
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("Usuario");
    const [userId, setUserId] = useState<number | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Get user ID (simulated or from local storage/context)
    useEffect(() => {
        // Try to get from localStorage first
        const storedHandle = typeof window !== 'undefined' ? localStorage.getItem("currentUserHandle") : null;

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
                    let enrichedTrans = { ...trans };

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
                                } else {
                                    enrichedTrans.transaction_title = trans.desc_trans || 'Evento';
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

    if (loading) {
        return <div className={styles.container}>Cargando billetera...</div>;
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
                <h1 className={styles.logoText}>MERRRCADITO</h1>

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
            >
                <nav className={styles.sidebarNav}>
                    <Link href="/" className={styles.sidebarLink}>
                        🏠 Inicio
                    </Link>
                    <Link href="/billetera" className={styles.sidebarLink}>
                        💰 Billetera
                    </Link>
                    <Link href="/perfil" className={styles.sidebarLink}>
                        👤 Perfil
                    </Link>
                    <Link href="/promociones" className={styles.sidebarLink}>
                        🎉 Promociones
                    </Link>
                    <Link href="/tokens" className={styles.sidebarLink}>
                        🪙 Tokens
                    </Link>
                </nav>
            </SideBar>

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
                                                    Cobro Pendiente: {collection.desc_trans || "Transacción"}
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
                            exchanges.map((exchange) => (
                                <div key={exchange.cod_inter} className={styles.transactionCard}>
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
                                                    exchange.estado_inter === 'pendiente' ? styles.statusPending : styles.statusFailed
                                                    }`}>
                                                    {exchange.estado_inter || 'satisfactorio'}
                                                </span>
                                            </div>
                                        </div>
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
        </>
    );
}
