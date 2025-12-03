'use client'
import { Publication } from '@/Components/Organisms'
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ListPublication.module.css'

interface DataPubProps {
    title: string,
    pubServ: {
        cod_pub: number,
        nombre_publicacion: string,
        nombre_categoria: string,
        nombre_subcat: string,
        precio_pub?: number,
        foto_pub: string | null,
        calif_pond_pub: number,
        calidad?: string,
        estado_pub: 'activo' | 'inactivo',
        descripcion: string;
        fecha_ini_pub: string;
        contacto_correo: string;
        contacto_numero: number;
        handlename: string;
        hrs_ini_serv?: string;
        hrs_fin_serv?: string;
        duracion?: number;
        impacto_amb_pub?: number; // CO2 impact
    }[]
    layout?: 'carousel' | 'grid';
}

export default function ListPublicationServ({
    title,
    pubServ,
    layout = 'carousel'
}: DataPubProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (container) {
            // Scroll by the width of 4 cards
            const cardWidth = container.scrollWidth / (pubServ.length + 1); // +1 for explore card
            const scrollAmount = direction === 'left' ? -(cardWidth * 4) : (cardWidth * 4);
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const renderPublications = () => (
        pubServ.map(pubS => (
            <Publication
                key={pubS.cod_pub}
                clase='Servicio'
                pub={{
                    cod_pub: pubS.cod_pub,
                    nombre_publicacion: pubS.nombre_publicacion,
                    nombre_categoria: pubS.nombre_categoria,
                    nombre_subcat: pubS.nombre_subcat,
                    precio_pub: pubS.precio_pub,
                    foto_pub: pubS.foto_pub,
                    calif_pond_pub: pubS.calif_pond_pub,
                    calidad: pubS.calidad,
                    estado_pub: pubS.estado_pub,
                    handlename: pubS.handlename,
                    descripcion: pubS.descripcion, // CRITICAL: Pass description
                    impacto_amb_pub: pubS.impacto_amb_pub // CRITICAL: Pass CO2 impact
                }}
                pubS={{
                    descripcion: pubS.descripcion,
                    fecha_ini_pub: pubS.fecha_ini_pub,
                    contacto_correo: pubS.contacto_correo,
                    contacto_numero: pubS.contacto_numero,
                    handlename: pubS.handlename,
                    hrs_ini_serv: pubS.hrs_ini_serv || '',
                    hrs_fin_serv: pubS.hrs_fin_serv || '',
                    duracion: pubS.duracion || 0
                }}
            />
        ))
    );

    return (
        <div className={styles.listContainer}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{title}</h2>
            </div>

            {layout === 'grid' ? (
                <div className={styles.gridContainer}>
                    {renderPublications()}
                </div>
            ) : (
                <div className={styles.scrollWrapper}>
                    <button
                        className={`${styles.navButton} ${styles.navButtonLeft}`}
                        onClick={() => scroll('left')}
                        aria-label="Scroll left"
                    >
                        ‹
                    </button>

                    <div ref={scrollContainerRef} className={styles.scrollContainer}>
                        {renderPublications()}
                        {/* Explore More Card */}
                        <div
                            className={styles.exploreMoreCard}
                            onClick={() => router.push('/Explorar?section=services')}
                        >
                            <div className={styles.exploreMoreContent}>
                                <div className={styles.exploreMoreIcon}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.35-4.35"></path>
                                    </svg>
                                </div>
                                <div className={styles.exploreMoreTitle}>Explorar Más Servicios</div>
                                <div className={styles.exploreMoreSubtitle}>Ver todos los servicios disponibles</div>
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
            )}
        </div>
    );
}
