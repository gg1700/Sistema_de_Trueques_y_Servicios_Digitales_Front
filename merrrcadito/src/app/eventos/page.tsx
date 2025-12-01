'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/Components/Templates/AppLayout/AppLayout';
import { EventService } from '@/services/eventService';
import { getWalletDataByUser } from '@/services/walletService';
import styles from './page.module.css';

interface Event {
    cod_evento: number;
    titulo_evento: string;
    descripcion_evento: string;
    fecha_inicio_evento: string;
    fecha_finalizacion_evento: string;
    cant_personas_inscritas: number;
    tipo_evento: string;
    costo_inscripcion: number;
    tiene_banner: boolean;
    organizacion_nombre: string;
    monto_recompensa: number;
    impacto_amb_inter?: number;
}

export default function EventsPage() {
    const [userRole, setUserRole] = useState<'admin' | 'user'>('user');
    const [userId, setUserId] = useState<number | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [enrolledEvents, setEnrolledEvents] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [enrollingEvent, setEnrollingEvent] = useState<number | null>(null);

    // Modal states
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showInsufficientBalanceModal, setShowInsufficientBalanceModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [userBalance, setUserBalance] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();

    useEffect(() => {
        // Obtener userId y role de localStorage
        const storedUserId = localStorage.getItem('userId');
        const storedRole = localStorage.getItem('currentUserRole');

        if (storedRole === 'admin' || storedRole === 'user') {
            setUserRole(storedRole);
        }

        if (storedUserId) {
            const uid = parseInt(storedUserId);
            setUserId(uid);
            fetchEvents(uid);
            fetchWalletData(uid);
        } else {
            // Si no hay usuario, redirigir al login
            router.push('/login');
        }
    }, [router]);

    const fetchWalletData = async (uid: number): Promise<number> => {
        try {
            const wallet = await getWalletDataByUser(uid);
            if (wallet) {
                // Los CV están en saldo_creditos (backend usa: b.saldo_actual as saldo_creditos)
                // IMPORTANTE: PostgreSQL devuelve Decimals como objetos, hay que convertir a number
                const saldoCreditos = wallet.saldo_creditos;
                const saldoActual = wallet.saldo_actual;

                // Convertir a número (puede venir como Decimal object de postgres)
                let balance = 0;
                if (saldoCreditos !== undefined && saldoCreditos !== null) {
                    balance = Number(saldoCreditos);
                } else if (saldoActual !== undefined && saldoActual !== null) {
                    balance = Number(saldoActual);
                }

                console.log('Wallet data:', {
                    saldoCreditos,
                    saldoActual,
                    balance,
                    type: typeof saldoCreditos
                });

                setUserBalance(balance);
                return balance;
            }
            return 0;
        } catch (error) {
            console.error('Error fetching wallet:', error);
            return 0;
        }
    };

    const fetchEvents = async (userId: number) => {
        try {
            setLoading(true);
            const response = await EventService.get_all_events();
            if (response.success && response.data) {
                setEvents(response.data);

                // Verificar qué eventos el usuario ya tiene inscritos
                const enrollmentPromises = response.data.map((event: Event) =>
                    EventService.check_enrollment(userId, event.cod_evento)
                );
                const enrollmentResults = await Promise.all(enrollmentPromises);

                const enrolled = new Set<number>();
                enrollmentResults.forEach((result, index) => {
                    if (result.success && result.isEnrolled) {
                        enrolled.add(response.data[index].cod_evento);
                    }
                });
                setEnrolledEvents(enrolled);
            }
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnrollClick = async (event: Event) => {
        setSelectedEvent(event);
        if (event.costo_inscripcion > 0) {
            // Obtener saldo actual y usarlo directamente (no depender del estado que es asíncrono)
            let currentBalance = 0;
            if (userId) {
                currentBalance = await fetchWalletData(userId);
            }

            const eventCost = event.costo_inscripcion || 0;

            console.log('Balance check:', { currentBalance, eventCost, sufficient: currentBalance >= eventCost });

            if (currentBalance < eventCost) {
                // Saldo insuficiente: mostrar modal de error directamente
                setShowInsufficientBalanceModal(true);
            } else {
                // Saldo suficiente: mostrar modal de confirmación de pago
                setShowPaymentModal(true);
            }
        } else {
            processEnrollment(event);
        }
    };

    const processEnrollment = async (event: Event) => {
        if (!userId) return;

        setEnrollingEvent(event.cod_evento);
        try {
            const response = await EventService.enroll_in_event(userId, event.cod_evento);

            if (response.success) {
                // Actualizar el estado local
                setEnrolledEvents(prev => new Set(prev).add(event.cod_evento));

                // Actualizar el contador de inscritos en la UI
                setEvents(prev => prev.map(e =>
                    e.cod_evento === event.cod_evento
                        ? { ...e, cant_personas_inscritas: e.cant_personas_inscritas + 1 }
                        : e
                ));

                // Actualizar saldo si hubo pago
                if (event.costo_inscripcion > 0) {
                    setUserBalance(prev => prev - event.costo_inscripcion);
                }

                setShowPaymentModal(false);
                setShowSuccessModal(true);
            } else {
                setErrorMessage(response.message || 'Error al inscribirse en el evento');
                setShowPaymentModal(false);
                setShowErrorModal(true);
            }
        } catch (error) {
            console.error('Error enrolling in event:', error);
            setErrorMessage('Error de conexión al inscribirse');
            setShowPaymentModal(false);
            setShowErrorModal(true);
        } finally {
            setEnrollingEvent(null);
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

    return (
        <AppLayout pageTitle="Eventos" pageSubtitle="Descubre y participa en eventos de la comunidad" userRole={userRole}>
            <div className={styles.container}>
                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Cargando eventos...</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>
                            <i className="bi bi-calendar-event"></i>
                        </div>
                        <h3>No hay eventos disponibles</h3>
                        <p>Vuelve pronto para descubrir nuevos eventos</p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {events.map((event) => {
                            const isEnrolled = enrolledEvents.has(event.cod_evento);
                            const isEnrolling = enrollingEvent === event.cod_evento;

                            return (
                                <div key={event.cod_evento} className={styles.card}>
                                    <div className={styles.imageContainer}>
                                        <img
                                            src={event.tiene_banner
                                                ? `${process.env.NEXT_PUBLIC_API_URL}/events/${event.cod_evento}/image`
                                                : `${process.env.NEXT_PUBLIC_API_URL}/events/default-image`
                                            }
                                            alt={event.titulo_evento}
                                            className={styles.image}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = `${process.env.NEXT_PUBLIC_API_URL}/events/default-image`;
                                            }}
                                        />
                                    </div>

                                    <div className={styles.cardContent}>
                                        <h3 className={styles.eventTitle}>{event.titulo_evento}</h3>
                                        <p className={styles.orgName}>
                                            {event.organizacion_nombre || 'Evento Comunitario'}
                                        </p>
                                        <div className={styles.eventDetails}>
                                            <div className={styles.detailRow}>
                                                <span className={styles.label}>Inicio:</span>
                                                <span className={styles.value}>
                                                    {formatDate(event.fecha_inicio_evento)}
                                                </span>
                                            </div>
                                            <div className={styles.detailRow}>
                                                <span className={styles.label}>Fin:</span>
                                                <span className={styles.value}>
                                                    {formatDate(event.fecha_finalizacion_evento)}
                                                </span>
                                            </div>
                                            {event.costo_inscripcion > 0 && (
                                                <div className={styles.detailRow}>
                                                    <span className={styles.label}>Costo:</span>
                                                    <span className={styles.value}>
                                                        {event.costo_inscripcion} CV
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className={styles.badges}>
                                            <div className={styles.attendeesBadge}>
                                                <i className="bi bi-people"></i>
                                                <span>{event.cant_personas_inscritas} inscritos</span>
                                            </div>
                                            {event.monto_recompensa > 0 && (
                                                <div className={styles.rewardBadge}>
                                                    <i className="bi bi-gift"></i>
                                                    <span>{event.monto_recompensa} CV</span>
                                                </div>
                                            )}
                                            <div className={styles.typeBadge}>
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
                                                <div className={styles.impactBadge}>
                                                    <i className="bi bi-tree-fill"></i>
                                                    <span>Impacto: {event.impacto_amb_inter} pts</span>
                                                </div>
                                            )}
                                        </div>

                                        <p className={styles.description}>
                                            {event.descripcion_evento}
                                        </p>

                                        <button
                                            className={`${styles.enrollButton} ${isEnrolled ? styles.enrolledButton : ''}`}
                                            onClick={() => !isEnrolled && handleEnrollClick(event)}
                                            disabled={isEnrolled || isEnrolling}
                                        >
                                            {isEnrolling ? (
                                                'Procesando...'
                                            ) : isEnrolled ? (
                                                '✓ Ya estás inscrito'
                                            ) : event.costo_inscripcion > 0 ? (
                                                `+ Inscribirse (${event.costo_inscripcion} CV)`
                                            ) : (
                                                '+ Inscribirse Gratis'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Modal de Pago */}
                {showPaymentModal && selectedEvent && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h3 className={styles.modalTitle}>Confirmar Inscripción</h3>
                            <div className={styles.modalContent}>
                                <p>Estás a punto de inscribirte en <strong>{selectedEvent.titulo_evento}</strong>.</p>

                                <div className={styles.paymentDetails}>
                                    <div className={styles.paymentRow}>
                                        <span>Costo del evento:</span>
                                        <span>{selectedEvent.costo_inscripcion || 0} CV</span>
                                    </div>
                                    <div className={styles.paymentRow}>
                                        <span>Tu saldo actual:</span>
                                        <span>{userBalance || 0} CV</span>
                                    </div>
                                    <div className={`${styles.paymentRow} ${styles.total}`}>
                                        <span>Saldo final:</span>
                                        <span>{(userBalance || 0) - (selectedEvent.costo_inscripcion || 0)} CV</span>
                                    </div>
                                </div>

                                <p>¿Deseas confirmar el pago y la inscripción?</p>
                            </div>
                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setShowPaymentModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className={styles.confirmButton}
                                    onClick={() => processEnrollment(selectedEvent)}
                                >
                                    Confirmar Pago
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Éxito */}
                {showSuccessModal && selectedEvent && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <i className={`bi bi-check-circle-fill ${styles.successIcon}`}></i>
                            <h3 className={styles.modalTitle}>¡Inscripción Exitosa!</h3>
                            <div className={styles.modalContent}>
                                <p>Te has inscrito correctamente en <strong>{selectedEvent.titulo_evento}</strong>.</p>
                                {selectedEvent.costo_inscripcion > 0 && (
                                    <p>Se han descontado {selectedEvent.costo_inscripcion} tokens de tu cuenta.</p>
                                )}
                            </div>
                            <div className={styles.modalActions}>
                                <button
                                    className={styles.confirmButton}
                                    onClick={() => setShowSuccessModal(false)}
                                >
                                    Entendido
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Error */}
                {showErrorModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <i className={`bi bi-x-circle-fill ${styles.errorIcon}`}></i>
                            <h3 className={styles.modalTitle}>Error</h3>
                            <div className={styles.modalContent}>
                                <p>{errorMessage}</p>
                            </div>
                            <div className={styles.modalActions}>
                                <button
                                    className={styles.closeButton}
                                    onClick={() => setShowErrorModal(false)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Saldo Insuficiente */}
                {showInsufficientBalanceModal && selectedEvent && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <i className={`bi bi-exclamation-triangle-fill ${styles.errorIcon}`}></i>
                            <h3 className={styles.modalTitle}>Saldo Insuficiente</h3>
                            <div className={styles.modalContent}>
                                <p>No tienes suficientes CV para inscribirte en <strong>{selectedEvent.titulo_evento}</strong>.</p>

                                <div className={styles.paymentDetails}>
                                    <div className={styles.paymentRow}>
                                        <span>Costo del evento:</span>
                                        <span>{selectedEvent.costo_inscripcion || 0} CV</span>
                                    </div>
                                    <div className={styles.paymentRow}>
                                        <span>Tu saldo actual:</span>
                                        <span>{userBalance || 0} CV</span>
                                    </div>
                                    <div className={`${styles.paymentRow} ${styles.insufficientBalance}`}>
                                        <span>Te faltan:</span>
                                        <span>{(selectedEvent.costo_inscripcion || 0) - (userBalance || 0)} CV</span>
                                    </div>
                                </div>

                                <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#7f8c8d' }}>Por favor, adquiere más créditos verdes para poder inscribirte.</p>
                            </div>
                            <div className={styles.modalActions}>
                                <button
                                    className={styles.confirmButton}
                                    onClick={() => setShowInsufficientBalanceModal(false)}
                                >
                                    Aceptar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
