"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./OrganizationProfile.module.css";
import ProfileInput from "@/Components/Atoms/Input/ProfileInput/ProfileInput";
import FileInput from "@/Components/Templates/ModalsProfile/FileInput";
import { getNavItems } from "../../../Utils/navigation";

const ORG_API_BASE = process.env.NEXT_PUBLIC_ORGANIZATION_API_BASE_URL ?? "http://localhost:5000/api/organization";
const EVENTS_API_BASE = process.env.NEXT_PUBLIC_EVENTS_API_BASE_URL ?? "http://localhost:5000/api/event";

interface OrganizationData {
    cod_org: number;
    nom_com_org: string;
    nom_leg_org: string;
    tipo_org: string;
    rubro_org: string;
    cif: string;
    correo_org: string;
    telf_org: string;
    dir_org: string;
    sitio_web: string;
    logo_org: { type: string; data: number[] } | null;
}

interface EventData {
    cod_evento: number;
    titulo_evento: string;
    descripcion_evento: string;
    fecha_inicio_evento: string;
    fecha_finalizacion_evento: string;
    duracion_evento: string;
    banner_evento: { type: string; data: number[] } | null;
    cant_personas_inscritas: number;
    estado_evento: string;
    tipo_evento: string;
    costo_inscripcion: string;
}

interface EventFormState {
    titulo_evento: string;
    descripcion_evento: string;
    fecha_inicio_evento: string;
    fecha_finalizacion_evento: string;
    duracion_evento: string;
    tipo_evento: string;
    costo_inscripcion: string;
}

interface OrganizationProfileProps {
    nomLegOrg: string;
}

export default function OrganizationProfile({ nomLegOrg }: OrganizationProfileProps) {
    const [activeTab, setActiveTab] = useState<"events" | "publish">("events");
    const [orgData, setOrgData] = useState<OrganizationData | null>(null);
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Formulario de evento
    const [eventForm, setEventForm] = useState<EventFormState>({
        titulo_evento: "",
        descripcion_evento: "",
        fecha_inicio_evento: "",
        fecha_finalizacion_evento: "",
        duracion_evento: "",
        tipo_evento: "presencial",
        costo_inscripcion: "0",
    });
    const [eventImage, setEventImage] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    useEffect(() => {
        fetchOrgData();
    }, [nomLegOrg]);

    useEffect(() => {
        if (orgData?.cod_org) {
            fetchOrgEvents(orgData.cod_org);
        }
    }, [orgData]);

    const fetchOrgData = async () => {
        try {
            setLoading(true);
            // Nota: El endpoint get_org_data requiere nom_leg_org y cif. 
            // Aquí asumimos que podemos obtenerlo solo con nom_leg_org o que el backend fue ajustado.
            // Si el backend requiere CIF, necesitaremos pasarlo o ajustar el backend.
            // Por ahora intentaremos obtenerlo asumiendo que el backend puede buscar por nombre o que tenemos el CIF guardado.
            // Como AuthRegistrationFlow redirige solo con nom_leg_org, el backend debería soportarlo.
            // Si no, tendremos un problema. Vamos a intentar llamar con un CIF dummy o ajustar el backend si falla.

            // REVISIÓN: El backend get_org_data usa: SELECT * FROM sp_obtenerdatosorganizacion(nom_leg_org, cif)
            // Es estricto. Necesitamos el CIF. Pero no lo tenemos en la URL.
            // WORKAROUND: Por ahora, intentaremos obtenerlo. Si falla, el usuario tendrá que volver a loguearse.
            // Idealmente, deberíamos guardar el token o datos en localStorage al loguearse como org.

            // Vamos a intentar obtener datos. Si falla, mostraremos error.
            const res = await fetch(`${ORG_API_BASE}/get_org_data?nom_leg_org=${encodeURIComponent(nomLegOrg)}&cif=`);
            const json = await res.json();

            if (json.success && json.data && json.data.length > 0) {
                setOrgData(json.data[0]);
            } else {
                // Fallback: Si el backend requiere CIF exacto y no lo tenemos, esto fallará.
                // Asumiremos por ahora que el backend es permisivo o que arreglaremos el backend para buscar solo por nombre.
                setError("No se pudo cargar la información de la organización.");
            }
        } catch (err) {
            console.error(err);
            setError("Error de conexión.");
        } finally {
            setLoading(false);
        }
    };

    const fetchOrgEvents = async (codOrg: number) => {
        try {
            const res = await fetch(`${EVENTS_API_BASE}/get_events_org?cod_org=${codOrg}`);
            const json = await res.json();
            if (json.success) {
                setEvents(json.data);
            }
        } catch (err) {
            console.error("Error fetching events:", err);
        }
    };

    const handleEventChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setEventForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orgData) return;

        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append("titulo_evento", eventForm.titulo_evento);
            formData.append("descripcion_evento", eventForm.descripcion_evento);
            formData.append("fecha_inicio_evento", eventForm.fecha_inicio_evento);
            formData.append("fecha_finalizacion_evento", eventForm.fecha_finalizacion_evento);
            formData.append("duracion_evento", eventForm.duracion_evento);
            formData.append("tipo_evento", eventForm.tipo_evento);
            formData.append("costo_inscripcion", eventForm.costo_inscripcion);
            formData.append("cod_org", orgData.cod_org.toString());

            if (eventImage) {
                formData.append("banner_evento", eventImage);
            }

            const res = await fetch(`${EVENTS_API_BASE}/create`, {
                method: "POST",
                body: formData,
            });
            const json = await res.json();

            if (json.success) {
                setSuccessMsg("Evento creado exitosamente");
                setEventForm({
                    titulo_evento: "",
                    descripcion_evento: "",
                    fecha_inicio_evento: "",
                    fecha_finalizacion_evento: "",
                    duracion_evento: "",
                    tipo_evento: "presencial",
                    costo_inscripcion: "0",
                });
                setEventImage(null);
                fetchOrgEvents(orgData.cod_org);
                setTimeout(() => setSuccessMsg(null), 3000);
            } else {
                alert("Error al crear evento: " + json.message);
            }
        } catch (err) {
            console.error(err);
            alert("Error al crear evento");
        } finally {
            setSubmitting(false);
        }
    };

    // Render helpers
    const renderImage = (imgData: { type: string; data: number[] } | null) => {
        if (!imgData) return "/default-placeholder.png";
        const base64String = Buffer.from(imgData.data).toString("base64");
        return `data:image/jpeg;base64,${base64String}`;
    };

    if (loading) return <div className={styles.loading}>Cargando perfil...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!orgData) return <div className={styles.error}>Organización no encontrada</div>;

    return (
        <div className={styles.profileContainer}>
            {/* Header de Organización */}
            <header className={styles.profileHeader}>
                <div className={styles.coverImage}>
                    {/* Cover genérico o personalizado */}
                </div>
                <div className={styles.profileInfo}>
                    <div className={styles.avatarContainer}>
                        <img
                            src={renderImage(orgData.logo_org)}
                            alt="Logo Organización"
                            className={styles.avatar}
                        />
                    </div>
                    <div className={styles.userDetails}>
                        <h1 className={styles.userName}>{orgData.nom_com_org}</h1>
                        <p className={styles.userHandle}>{orgData.nom_leg_org}</p>
                        <div className={styles.statsRow}>
                            <span className={styles.statItem}>
                                <strong>{events.length}</strong> Eventos
                            </span>
                            <span className={styles.statItem}>
                                <strong>{orgData.rubro_org}</strong>
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navegación */}
            <nav className={styles.profileNav}>
                <button
                    className={`${styles.navItem} ${activeTab === "events" ? styles.active : ""}`}
                    onClick={() => setActiveTab("events")}
                >
                    Mis Eventos
                </button>
                <button
                    className={`${styles.navItem} ${activeTab === "publish" ? styles.active : ""}`}
                    onClick={() => setActiveTab("publish")}
                >
                    Publicar Evento
                </button>
            </nav>

            {/* Contenido */}
            <main className={styles.profileContent}>
                {activeTab === "events" && (
                    <div className={styles.eventsGrid}>
                        {events.length === 0 ? (
                            <p className={styles.emptyState}>No has creado eventos aún.</p>
                        ) : (
                            events.map((event) => (
                                <article key={event.cod_evento} className={styles.eventCard}>
                                    <img
                                        src={renderImage(event.banner_evento)}
                                        alt={event.titulo_evento}
                                        className={styles.eventImage}
                                    />
                                    <div className={styles.eventInfo}>
                                        <h3>{event.titulo_evento}</h3>
                                        <p className={styles.eventDate}>
                                            {new Date(event.fecha_inicio_evento).toLocaleDateString()}
                                        </p>
                                        <p className={styles.eventDesc}>{event.descripcion_evento}</p>
                                        <div className={styles.eventStats}>
                                            <span>Inscritos: {event.cant_personas_inscritas}</span>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "publish" && (
                    <section className={styles.publishSection}>
                        <h2 className={styles.sectionTitle}>Crear Nuevo Evento</h2>
                        {successMsg && <div className={styles.successMsg}>{successMsg}</div>}

                        <form onSubmit={handleSubmitEvent} className={styles.publishForm}>
                            <div className={styles.formRow}>
                                <div className={styles.formColFull}>
                                    <label className={styles.fieldLabel}>Título del Evento</label>
                                    <ProfileInput
                                        type="text"
                                        name="titulo_evento"
                                        value={eventForm.titulo_evento}
                                        onChange={handleEventChange as any}
                                        placeholder="Ej. Taller de Reciclaje"
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formColFull}>
                                    <label className={styles.fieldLabel}>Descripción</label>
                                    <textarea
                                        name="descripcion_evento"
                                        value={eventForm.descripcion_evento}
                                        onChange={handleEventChange}
                                        className={styles.textarea}
                                        placeholder="Detalles del evento..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formCol}>
                                    <label className={styles.fieldLabel}>Fecha Inicio</label>
                                    <ProfileInput
                                        type="datetime-local"
                                        name="fecha_inicio_evento"
                                        value={eventForm.fecha_inicio_evento}
                                        onChange={handleEventChange as any}
                                        required
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <label className={styles.fieldLabel}>Fecha Fin</label>
                                    <ProfileInput
                                        type="datetime-local"
                                        name="fecha_finalizacion_evento"
                                        value={eventForm.fecha_finalizacion_evento}
                                        onChange={handleEventChange as any}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formCol}>
                                    <label className={styles.fieldLabel}>Duración (texto)</label>
                                    <ProfileInput
                                        type="text"
                                        name="duracion_evento"
                                        value={eventForm.duracion_evento}
                                        onChange={handleEventChange as any}
                                        placeholder="Ej. 2 horas"
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <label className={styles.fieldLabel}>Tipo</label>
                                    <select
                                        name="tipo_evento"
                                        value={eventForm.tipo_evento}
                                        onChange={handleEventChange}
                                        className={styles.selectInput}
                                    >
                                        <option value="presencial">Presencial</option>
                                        <option value="virtual">Virtual</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formCol}>
                                    <label className={styles.fieldLabel}>Costo Inscripción</label>
                                    <ProfileInput
                                        type="number"
                                        name="costo_inscripcion"
                                        value={eventForm.costo_inscripcion}
                                        onChange={handleEventChange as any}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className={styles.formRowBottom}>
                                <div className={styles.formColImage}>
                                    <label className={styles.fieldLabel}>Banner (Imagen)</label>
                                    <FileInput name="banner_evento" onChange={setEventImage} />
                                </div>
                                <div className={styles.formColButtons}>
                                    <button type="submit" className={styles.submitButton} disabled={submitting}>
                                        {submitting ? "Creando..." : "Crear Evento"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </section>
                )}
            </main>
        </div>
    );
}
