"use client";

import React, { useEffect, useState } from "react";
import styles from "./EventsSection.module.css";

const ENROLLMENTS_API_BASE =
    process.env.NEXT_PUBLIC_ENROLLMENTS_API_BASE_URL ??
    "http://localhost:5000/api/enrollments";

interface EnrolledEvent {
    cod_evento: number;
    titulo_evento: string;
    descripcion_evento: string;
    fecha_inicio_evento: string;
    fecha_finalizacion_evento: string;
    duracion_evento: number;
    banner_evento: string | null;
    cant_personas_inscritas: number;
    estado_evento: string;
    tipo_evento: string;
    costo_inscripcion: number;
    organizacion_nombre: string;
    organizacion_logo: Buffer | null;
}

interface Props {
    userId: number;
}

export default function EventsSection({ userId }: Props) {
    const [events, setEvents] = useState<EnrolledEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchEvents();
    }, [userId]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${ENROLLMENTS_API_BASE}/user/${userId}`);

            // Check if response is ok before trying to parse JSON
            if (!res.ok) {
                if (res.status === 404) {
                    // Route not found - backend might not be running or route doesn't exist
                    console.warn("Enrollments API route not found. Backend may not be running.");
                    setEvents([]);
                    setLoading(false);
                    return;
                }
                throw new Error(`Error del servidor: ${res.status} ${res.statusText}`);
            }

            const json = await res.json();

            if (json.success === false) {
                throw new Error(json.message || "Error al cargar eventos");
            }

            setEvents(json.data || []);
        } catch (err: any) {
            console.error("Error fetching events:", err);
            // Only show error if it's not a network/route issue
            if (err.message && !err.message.includes("404")) {
                setError(err.message);
            } else {
                // Silently fail for missing routes - just show empty state
                setEvents([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUnenroll = async (cod_evento: number) => {
        if (!confirm("¿Estás seguro de que quieres desinscribirte de este evento?")) {
            return;
        }

        try {
            const res = await fetch(`${ENROLLMENTS_API_BASE}/unenroll`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cod_us: userId, cod_evento }),
            });

            const json = await res.json();

            if (!res.ok || json.success === false) {
                throw new Error(json.message || "Error al desinscribirse");
            }

            // Actualizar lista
            setEvents((prev) => prev.filter((event) => event.cod_evento !== cod_evento));
        } catch (err: any) {
            console.error("Error unenrolling:", err);
            alert(`Error: ${err.message}`);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <i className="bi bi-calendar-event" style={{ fontSize: "48px", color: "#18c0a6" }}></i>
                    <p>Cargando tus eventos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <i className="bi bi-exclamation-triangle" style={{ fontSize: "48px", color: "#ff5f5f" }}></i>
                    <p>{error}</p>
                    <button onClick={fetchEvents} className={styles.retryBtn}>
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.empty}>
                    <i className="bi bi-calendar-x" style={{ fontSize: "64px", color: "#d8cdd1" }}></i>
                    <h3>No estás inscrito en ningún evento</h3>
                    <p>Explora eventos disponibles y únete a la comunidad</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    <i className="bi bi-calendar-check"></i> Mis Eventos
                </h2>
                <span className={styles.count}>{events.length} eventos</span>
            </div>

            <div className={styles.grid}>
                {events.map((event) => (
                    <div key={event.cod_evento} className={styles.card}>
                        <div className={styles.cardBanner}>
                            {event.banner_evento ? (
                                <img
                                    src={event.banner_evento}
                                    alt={event.titulo_evento}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/placeholder-event.png";
                                    }}
                                />
                            ) : (
                                <div className={styles.placeholderBanner}>
                                    <i className="bi bi-calendar-event"></i>
                                </div>
                            )}
                            <div className={styles.eventType}>
                                <span className={event.tipo_evento === "benefico" ? styles.typeBenefico : styles.typeMonetizable}>
                                    {event.tipo_evento === "benefico" ? "Benéfico" : "Monetizable"}
                                </span>
                            </div>
                        </div>

                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{event.titulo_evento}</h3>
                            <p className={styles.cardDescription}>{event.descripcion_evento}</p>

                            <div className={styles.eventInfo}>
                                <div className={styles.infoItem}>
                                    <i className="bi bi-calendar3"></i>
                                    <div>
                                        <span className={styles.infoLabel}>Inicio:</span>
                                        <span className={styles.infoValue}>
                                            {new Date(event.fecha_inicio_evento).toLocaleDateString("es-ES", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.infoItem}>
                                    <i className="bi bi-hourglass-split"></i>
                                    <div>
                                        <span className={styles.infoLabel}>Duración:</span>
                                        <span className={styles.infoValue}>{event.duracion_evento} días</span>
                                    </div>
                                </div>

                                <div className={styles.infoItem}>
                                    <i className="bi bi-people"></i>
                                    <div>
                                        <span className={styles.infoLabel}>Inscritos:</span>
                                        <span className={styles.infoValue}>{event.cant_personas_inscritas}</span>
                                    </div>
                                </div>

                                {event.costo_inscripcion > 0 && (
                                    <div className={styles.infoItem}>
                                        <i className="bi bi-coin"></i>
                                        <div>
                                            <span className={styles.infoLabel}>Costo:</span>
                                            <span className={styles.infoValue}>{event.costo_inscripcion} tokens</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.cardFooter}>
                                <div className={styles.organization}>
                                    <i className="bi bi-building"></i>
                                    <span>{event.organizacion_nombre}</span>
                                </div>
                                <button
                                    className={styles.unenrollBtn}
                                    onClick={() => handleUnenroll(event.cod_evento)}
                                >
                                    <i className="bi bi-box-arrow-right"></i>
                                    Desinscribirse
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
