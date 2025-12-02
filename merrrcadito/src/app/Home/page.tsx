'use client'
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { ListPublicationProd, ListPublicationServ } from "@/Components/Organisms";
import AppLayout from "@/Components/Templates/AppLayout/AppLayout";
import { usePublicationsProds, usePublicationsServs } from "./PublicationViewHome";
import { useExchanges, useEvents, usePromotions, useTokenPackages } from "./useDashboardData";
import PromotionCard from "@/Components/Molecules/PromotionCard/PromotionCard";
import ProposeExchangeModal from '@/Components/Molecules/ProposeExchangeModal/ProposeExchangeModal';
import { EventService } from '@/services/eventService';
import { getWalletDataByUser } from '@/services/walletService';
import styles from '../../Components/Organisms/ListPublication/ListPublication.module.css';
import exchangeStyles from '../intercambios/page.module.css';
import eventStyles from '../eventos/page.module.css';
import tokenStyles from '../tokens/tokens.module.css';

export default function Home() {
    const [userRole, setUserRole] = useState<'admin' | 'user'>('user');
    const router = useRouter();

    const dataPubProd = usePublicationsProds();
    const dataPubServ = usePublicationsServs();
    const { exchanges } = useExchanges();
    const { events } = useEvents();
    const { promotions } = usePromotions();
    const { tokenPackages } = useTokenPackages();

    useEffect(() => {
        const storedRole = localStorage.getItem('currentUserRole');
        if (storedRole === 'admin' || storedRole === 'user') {
            setUserRole(storedRole);
        }
    }, []);

    return (
        <AppLayout
            pageTitle="Hoy por mi"
            pageSubtitle="Mañana por mi"
            userRole={userRole}
        >
            <div>
                <ListPublicationProd title='Productos' pubProd={dataPubProd} />
                <ListPublicationServ title='Servicios' pubServ={dataPubServ} />

                {/* Intercambios Carousel */}
                {exchanges.length > 0 && (
                    <ExchangesCarousel exchanges={exchanges} />
                )}

                {/* Eventos Carousel */}
                {events.length > 0 && (
                    <EventsCarousel events={events} />
                )}

                {/* Promociones Carousel */}
                {promotions.length > 0 && (
                    <PromotionsCarousel promotions={promotions} />
                )}

                {/* Paquetes de Tokens Carousel */}
                {tokenPackages.length > 0 && (
                    <TokenPackagesCarousel tokenPackages={tokenPackages} />
                )}
            </div>
        </AppLayout>
    );
}

// Exchanges Carousel Component
function ExchangesCarousel({ exchanges }: any) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [selectedExchange, setSelectedExchange] = useState<any>(null);
    const [showExchangeModal, setShowExchangeModal] = useState(false);

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (container) {
            const cardWidth = container.scrollWidth / (exchanges.length + 1);
            const scrollAmount = direction === 'left' ? -(cardWidth * 4) : (cardWidth * 4);
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleProposeClick = (exchange: any) => {
        setSelectedExchange(exchange);
        setShowExchangeModal(true);
    };

    const handleCloseModal = () => {
        setShowExchangeModal(false);
        setSelectedExchange(null);
    };

    const handleConfirmProposal = () => {
        // Aquí iría la lógica de propuesta de intercambio
        router.push('/intercambios');
    };

    return (
        <div className={styles.listContainer}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Intercambios</h2>
            </div>
            <div className={styles.scrollWrapper}>
                <button
                    className={`${styles.navButton} ${styles.navButtonLeft}`}
                    onClick={() => scroll('left')}
                    aria-label="Scroll left"
                >
                    ‹
                </button>

                <div ref={scrollContainerRef} className={styles.scrollContainer}>
                    {exchanges.map((exchange: any) => (
                        <div key={exchange.cod_inter} className={exchangeStyles.card} style={{ minWidth: '280px' }}>
                            <div className={exchangeStyles.imageContainer}>
                                <img
                                    src={exchange.tiene_foto
                                        ? `${process.env.NEXT_PUBLIC_API_URL}/exchanges/${exchange.cod_inter}/image`
                                        : `${process.env.NEXT_PUBLIC_API_URL}/images/default_image.jpg`
                                    }
                                    alt={exchange.nombre_prod_origen}
                                    className={exchangeStyles.image}
                                    onError={(e) => {
                                        e.currentTarget.src = `${process.env.NEXT_PUBLIC_API_URL}/images/default_image.jpg`;
                                    }}
                                />
                            </div>

                            <div className={exchangeStyles.cardContent}>
                                <h3 className={exchangeStyles.productName}>{exchange.nombre_prod_origen}</h3>
                                <p className={exchangeStyles.userHandle}>Por @{exchange.handle_name_1}</p>

                                <div className={exchangeStyles.offerDetails}>
                                    <div className={exchangeStyles.detailRow}>
                                        <span className={exchangeStyles.label}>Cantidad:</span>
                                        <span className={exchangeStyles.value}>
                                            {exchange.cant_prod_origen} {exchange.unidad_medida_origen}
                                        </span>
                                    </div>
                                </div>

                                <div className={exchangeStyles.badges}>
                                    <div className={exchangeStyles.co2Badge}>
                                        <i className="bi bi-tree"></i>
                                        <span>{exchange.impacto_amb_inter} pts CO2</span>
                                    </div>
                                </div>

                                <button
                                    className={exchangeStyles.proposeButton}
                                    onClick={() => handleProposeClick(exchange)}
                                >
                                    + Proponer Intercambio
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className={styles.exploreMoreCard} onClick={() => router.push('/intercambios')}>
                        <div className={styles.exploreMoreContent}>
                            <div className={styles.exploreMoreIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.35-4.35"></path>
                                </svg>
                            </div>
                            <div className={styles.exploreMoreTitle}>Explorar Más Intercambios</div>
                            <div className={styles.exploreMoreSubtitle}>Ver todos los intercambios disponibles</div>
                        </div>
                    </div>
                </div>

                <button
                    className={`${styles.navButton} ${styles.navButtonRight}`}
                    onClick={() => scroll('right')}
                    aria-label="Scroll right"
                >
                    ›
                </button>
            </div>

            {/* Modal de Propuesta de Intercambio */}
            {showExchangeModal && selectedExchange && (
                <ProposeExchangeModal
                    exchange={selectedExchange}
                    onClose={handleCloseModal}
                    onSuccess={() => {
                        handleCloseModal();
                        // Opcional: Recargar datos si fuera necesario
                    }}
                />
            )}
        </div>
    );
}

// Events Carousel Component
function EventsCarousel({ events }: any) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [userBalance, setUserBalance] = useState(0);
    const [userId, setUserId] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [enrolledEvents, setEnrolledEvents] = useState<Set<number>>(new Set());

    const [showInsufficientBalanceModal, setShowInsufficientBalanceModal] = useState(false);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            const uid = parseInt(storedUserId);
            setUserId(uid);
            loadUserBalance(uid);
            checkEnrollments(uid);
        }
    }, [events]); // Re-check if events change

    const checkEnrollments = async (uid: number) => {
        if (!events || events.length === 0) return;

        try {
            const enrollmentPromises = events.map((event: any) =>
                EventService.check_enrollment(uid, event.cod_evento)
            );
            const enrollmentResults = await Promise.all(enrollmentPromises);

            const enrolled = new Set<number>();
            enrollmentResults.forEach((result, index) => {
                if (result.success && result.isEnrolled) {
                    enrolled.add(events[index].cod_evento);
                }
            });
            setEnrolledEvents(enrolled);
        } catch (error) {
            console.error('Error checking enrollments:', error);
        }
    };

    const loadUserBalance = async (uid: number) => {
        try {
            const walletData = await getWalletDataByUser(uid);

            if (walletData) {
                const saldoCreditos = walletData.saldo_creditos;
                const saldoActual = walletData.saldo_actual;

                let balance = 0;
                if (saldoCreditos !== undefined && saldoCreditos !== null) {
                    balance = Number(saldoCreditos);
                } else if (saldoActual !== undefined && saldoActual !== null) {
                    balance = Number(saldoActual);
                }

                console.log('Dashboard Balance loaded:', balance);
                setUserBalance(balance);
                return balance;
            }
            return 0;
        } catch (error) {
            console.error('Error loading balance:', error);
            return 0;
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (container) {
            const cardWidth = container.scrollWidth / (events.length + 1);
            const scrollAmount = direction === 'left' ? -(cardWidth * 4) : (cardWidth * 4);
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleEnrollClick = async (event: any) => {
        setSelectedEvent(event);
        if (event.costo_inscripcion > 0) {
            // Fetch fresh balance to be sure
            let currentBalance = userBalance;
            if (userId) {
                currentBalance = await loadUserBalance(userId);
            }

            if (currentBalance < event.costo_inscripcion) {
                setShowInsufficientBalanceModal(true);
                return;
            }
            setShowPaymentModal(true);
        } else {
            processEnrollment(event);
        }
    };

    const processEnrollment = async (event: any) => {
        if (!userId) {
            alert('Debes iniciar sesión para inscribirte');
            return;
        }

        setIsProcessing(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-enrollments/enroll`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cod_us: userId,
                    cod_evento: event.cod_evento
                })
            });

            const data = await response.json();

            if (data.success) {
                setEnrolledEvents(prev => new Set(prev).add(event.cod_evento));
                setShowPaymentModal(false);
                setShowSuccessModal(true);
                if (event.costo_inscripcion > 0) {
                    setUserBalance(prev => prev - event.costo_inscripcion);
                }
            } else {
                alert(data.message || 'Error al inscribirse');
            }
        } catch (error) {
            console.error('Error enrolling:', error);
            alert('Error de conexión al inscribirse');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className={styles.listContainer}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Eventos</h2>
            </div>
            <div className={styles.scrollWrapper}>
                <button
                    className={`${styles.navButton} ${styles.navButtonLeft}`}
                    onClick={() => scroll('left')}
                    aria-label="Scroll left"
                >
                    ‹
                </button>

                <div ref={scrollContainerRef} className={styles.scrollContainer}>
                    {events.map((event: any) => (
                        <div key={event.cod_evento} className={eventStyles.card} style={{ minWidth: '280px' }}>
                            <div className={eventStyles.imageContainer}>
                                <img
                                    src={event.tiene_banner
                                        ? `${process.env.NEXT_PUBLIC_API_URL}/events/${event.cod_evento}/image`
                                        : `${process.env.NEXT_PUBLIC_API_URL}/events/default-image`
                                    }
                                    alt={event.titulo_evento || event.nom_evento}
                                    className={eventStyles.image}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `${process.env.NEXT_PUBLIC_API_URL}/events/default-image`;
                                    }}
                                />
                            </div>

                            <div className={eventStyles.cardContent}>
                                <h3 className={eventStyles.eventTitle}>{event.titulo_evento || event.nom_evento}</h3>
                                <p className={eventStyles.orgName}>
                                    {event.organizacion_nombre || 'Evento Comunitario'}
                                </p>

                                <p className={eventStyles.description}>
                                    {event.descripcion_evento || event.descr_evento || 'Descripción del evento'}
                                </p>

                                <div className={eventStyles.eventDetails}>
                                    <div className={eventStyles.detailRow}>
                                        <span className={eventStyles.label}>Inicio:</span>
                                        <span className={eventStyles.value}>
                                            {formatDate(event.fecha_inicio_evento || event.fecha_ini_evento)}
                                        </span>
                                    </div>
                                    <div className={eventStyles.detailRow}>
                                        <span className={eventStyles.label}>Fin:</span>
                                        <span className={eventStyles.value}>
                                            {formatDate(event.fecha_finalizacion_evento || event.fecha_fin_evento)}
                                        </span>
                                    </div>
                                    {event.costo_inscripcion > 0 && (
                                        <div className={eventStyles.detailRow}>
                                            <span className={eventStyles.label}>Costo:</span>
                                            <span className={eventStyles.value}>
                                                {event.costo_inscripcion} CV
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className={eventStyles.badges}>
                                    <div className={eventStyles.attendeesBadge}>
                                        <i className="bi bi-people"></i>
                                        <span>{event.cant_personas_inscritas || 0} inscritos</span>
                                    </div>
                                    {event.monto_recompensa > 0 && (
                                        <div className={eventStyles.rewardBadge}>
                                            <i className="bi bi-gift"></i>
                                            <span>{event.monto_recompensa} CV</span>
                                        </div>
                                    )}
                                    <div className={eventStyles.typeBadge}>
                                        {event.tipo_evento === 'benefico' ? (
                                            <>
                                                <i className="bi bi-heart-fill"></i>
                                                <span style={{ marginLeft: '0.25rem' }}>Benéfico</span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-currency-dollar"></i>
                                                <span style={{ marginLeft: '0.25rem' }}>Monetizable</span>
                                            </>
                                        )}
                                    </div>
                                    {event.impacto_amb_inter && event.impacto_amb_inter > 0 && (
                                        <div className={eventStyles.impactBadge}>
                                            <i className="bi bi-tree-fill"></i>
                                            <span>Impacto: {event.impacto_amb_inter} pts</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    className={`${eventStyles.enrollButton} ${enrolledEvents.has(event.cod_evento) ? eventStyles.enrolledButton : ''}`}
                                    onClick={() => !enrolledEvents.has(event.cod_evento) && handleEnrollClick(event)}
                                    disabled={enrolledEvents.has(event.cod_evento)}
                                    style={enrolledEvents.has(event.cod_evento) ? { backgroundColor: '#7f8c8d', cursor: 'default' } : {}}
                                >
                                    {enrolledEvents.has(event.cod_evento)
                                        ? '✓ Ya estás inscrito'
                                        : event.costo_inscripcion > 0
                                            ? `+ Inscribirse (${event.costo_inscripcion} CV)`
                                            : '+ Inscribirse Gratis'
                                    }
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className={styles.exploreMoreCard} onClick={() => router.push('/eventos')}>
                        <div className={styles.exploreMoreContent}>
                            <div className={styles.exploreMoreIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.35-4.35"></path>
                                </svg>
                            </div>
                            <div className={styles.exploreMoreTitle}>Explorar Más Eventos</div>
                            <div className={styles.exploreMoreSubtitle}>Ver todos los eventos disponibles</div>
                        </div>
                    </div>
                </div>

                <button
                    className={`${styles.navButton} ${styles.navButtonRight}`}
                    onClick={() => scroll('right')}
                    aria-label="Scroll right"
                >
                    ›
                </button>
            </div>

            {/* Modal de Pago */}
            {showPaymentModal && selectedEvent && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        maxWidth: '500px',
                        width: '90%',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    }}>
                        <h3 style={{
                            margin: '0 0 1.5rem 0',
                            fontSize: '1.5rem',
                            textAlign: 'center',
                            color: '#2c3e50'
                        }}>Confirmar Inscripción</h3>

                        <div style={{ marginBottom: '2rem' }}>
                            <p style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#34495e' }}>
                                Estás a punto de inscribirte en <strong>{selectedEvent.titulo_evento || selectedEvent.nom_evento}</strong>.
                            </p>

                            <div style={{
                                backgroundColor: '#f8f9fa',
                                padding: '1.5rem',
                                borderRadius: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.8rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7f8c8d' }}>
                                    <span>Costo del evento:</span>
                                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>{selectedEvent.costo_inscripcion} CV</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7f8c8d' }}>
                                    <span>Tu saldo actual:</span>
                                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>{userBalance} CV</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    paddingTop: '0.8rem',
                                    borderTop: '1px solid #e0e0e0',
                                    fontWeight: 'bold',
                                    color: '#2c3e50'
                                }}>
                                    <span>Saldo final:</span>
                                    <span>{userBalance - selectedEvent.costo_inscripcion} CV</span>
                                </div>
                            </div>

                            <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.95rem', color: '#7f8c8d' }}>
                                ¿Deseas confirmar el pago y la inscripción?
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                disabled={isProcessing}
                                style={{
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: '#e74c3c',
                                    color: 'white',
                                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    transition: 'background 0.2s'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => processEnrollment(selectedEvent)}
                                disabled={isProcessing}
                                style={{
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: '#27ae60',
                                    color: 'white',
                                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    transition: 'background 0.2s'
                                }}
                            >
                                {isProcessing ? 'Procesando...' : 'Confirmar Pago'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Éxito */}
            {showSuccessModal && selectedEvent && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '30px',
                        maxWidth: '500px',
                        width: '90%',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}>✓</div>
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '24px', color: '#16a085' }}>¡Inscripción Exitosa!</h3>
                        <p style={{ marginBottom: '20px' }}>
                            Te has inscrito correctamente en <strong>{selectedEvent.titulo_evento || selectedEvent.nom_evento}</strong>
                        </p>
                        {selectedEvent.costo_inscripcion > 0 && (
                            <p style={{ color: '#666', marginBottom: '20px' }}>
                                Se han descontado {selectedEvent.costo_inscripcion} CV de tu cuenta.
                            </p>
                        )}
                        <button
                            onClick={() => {
                                setShowSuccessModal(false);
                                setSelectedEvent(null);
                            }}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#16a085',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de Saldo Insuficiente */}
            {showInsufficientBalanceModal && selectedEvent && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        maxWidth: '500px',
                        width: '90%',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '3rem', color: '#e74c3c' }}></i>
                        </div>
                        <h3 style={{
                            margin: '0 0 1.5rem 0',
                            fontSize: '1.5rem',
                            textAlign: 'center',
                            color: '#2c3e50'
                        }}>Saldo Insuficiente</h3>

                        <div style={{ marginBottom: '2rem' }}>
                            <p style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#34495e' }}>
                                No tienes suficientes CV para inscribirte en <strong>{selectedEvent.titulo_evento || selectedEvent.nom_evento}</strong>.
                            </p>

                            <div style={{
                                backgroundColor: '#f8f9fa',
                                padding: '1.5rem',
                                borderRadius: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.8rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7f8c8d' }}>
                                    <span>Costo del evento:</span>
                                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>{selectedEvent.costo_inscripcion} CV</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7f8c8d' }}>
                                    <span>Tu saldo actual:</span>
                                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>{userBalance} CV</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    paddingTop: '0.8rem',
                                    borderTop: '1px solid #e0e0e0',
                                    fontWeight: 'bold',
                                    color: '#e74c3c'
                                }}>
                                    <span>Te faltan:</span>
                                    <span>{(selectedEvent.costo_inscripcion || 0) - (userBalance || 0)} CV</span>
                                </div>
                            </div>

                            <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#7f8c8d' }}>
                                Por favor, adquiere más créditos verdes para poder inscribirte.
                            </p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                                onClick={() => setShowInsufficientBalanceModal(false)}
                                style={{
                                    padding: '0.8rem 2rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: '#34495e',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    transition: 'background 0.2s'
                                }}
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Promotions Carousel Component
function PromotionsCarousel({ promotions }: any) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (container) {
            const cardWidth = container.scrollWidth / (promotions.length + 1);
            const scrollAmount = direction === 'left' ? -(cardWidth * 4) : (cardWidth * 4);
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className={styles.listContainer}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Promociones</h2>
            </div>
            <div className={styles.scrollWrapper}>
                <button
                    className={`${styles.navButton} ${styles.navButtonLeft}`}
                    onClick={() => scroll('left')}
                    aria-label="Scroll left"
                >
                    ‹
                </button>

                <div ref={scrollContainerRef} className={styles.scrollContainer}>
                    {promotions.map((promo: any) => (
                        <div key={promo.cod_prom} style={{ minWidth: '280px', height: '600px', overflow: 'hidden' }}>
                            <PromotionCard promocion={promo} />
                        </div>
                    ))}
                    <div className={styles.exploreMoreCard} onClick={() => router.push('/promociones')}>
                        <div className={styles.exploreMoreContent}>
                            <div className={styles.exploreMoreIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.35-4.35"></path>
                                </svg>
                            </div>
                            <div className={styles.exploreMoreTitle}>Explorar Más Promociones</div>
                            <div className={styles.exploreMoreSubtitle}>Ver todas las promociones disponibles</div>
                        </div>
                    </div>
                </div>

                <button
                    className={`${styles.navButton} ${styles.navButtonRight}`}
                    onClick={() => scroll('right')}
                    aria-label="Scroll right"
                >
                    ›
                </button>
            </div>
        </div>
    );
}

// Token Packages Carousel Component
function TokenPackagesCarousel({ tokenPackages }: any) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (container) {
            const cardWidth = container.scrollWidth / (tokenPackages.length + 1);
            const scrollAmount = direction === 'left' ? -(cardWidth * 4) : (cardWidth * 4);
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className={styles.listContainer}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Paquetes de Tokens</h2>
            </div>
            <div className={styles.scrollWrapper}>
                <button
                    className={`${styles.navButton} ${styles.navButtonLeft}`}
                    onClick={() => scroll('left')}
                    aria-label="Scroll left"
                >
                    ‹
                </button>

                <div ref={scrollContainerRef} className={styles.scrollContainer}>
                    {tokenPackages.map((pkg: any) => {
                        const [imgError, setImgError] = React.useState(false);
                        const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/token_package/${pkg.id}/image`;

                        return (
                            <div key={pkg.id} className={tokenStyles.card} style={{ minWidth: '280px' }}>
                                <div className={tokenStyles.imagePlaceholder}>
                                    {!imgError ? (
                                        <img
                                            src={imageUrl}
                                            alt={pkg.nombre}
                                            className={tokenStyles.cardImage}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '8px'
                                            }}
                                            onError={() => setImgError(true)}
                                        />
                                    ) : (
                                        <svg style={{ width: '60px', height: '60px', color: '#FFD700' }} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>

                                <div className={tokenStyles.info}>
                                    <h3 className={tokenStyles.title}>{pkg.nombre}</h3>
                                    <p style={{ color: '#00a99d', fontWeight: 'bold', margin: '5px 0' }}>
                                        {pkg.tokens} Tokens
                                    </p>
                                </div>

                                <button
                                    className={tokenStyles.buyButton}
                                    onClick={() => router.push('/tokens')}
                                >
                                    Comprar por {Number(pkg.precio_real).toFixed(2)} $
                                </button>
                            </div>
                        );
                    })}
                    <div className={styles.exploreMoreCard} onClick={() => router.push('/tokens')}>
                        <div className={styles.exploreMoreContent}>
                            <div className={styles.exploreMoreIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.35-4.35"></path>
                                </svg>
                            </div>
                            <div className={styles.exploreMoreTitle}>Explorar Más Paquetes</div>
                            <div className={styles.exploreMoreSubtitle}>Ver todos los paquetes disponibles</div>
                        </div>
                    </div>
                </div>

                <button
                    className={`${styles.navButton} ${styles.navButtonRight}`}
                    onClick={() => scroll('right')}
                    aria-label="Scroll right"
                >
                    ›
                </button>
            </div>
        </div>
    );
}