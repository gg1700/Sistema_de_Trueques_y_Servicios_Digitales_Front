'use client'
import { Publication } from '@/Components/Organisms'
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ListPublication.module.css'

interface DataPubProps {
    title: string,
    pubProd: {
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
        cantidad: number;
        marca?: string | null;
        impacto_amb_pub?: number;
    }[]
    layout?: 'carousel' | 'grid';
}

export default function ListPublicationProd({
    title,
    pubProd,
    layout = 'carousel'
}: DataPubProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (container) {
            // Scroll by the width of 4 cards
            const cardWidth = container.scrollWidth / (pubProd.length + 1); // +1 for explore card
            const scrollAmount = direction === 'left' ? -(cardWidth * 4) : (cardWidth * 4);
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const renderPublications = () => (
        pubProd.map(pubP => (
            <Publication
                key={pubP.cod_pub}
                clase='Producto'
                pub={{
                    cod_pub: pubP.cod_pub,
                    nombre_publicacion: pubP.nombre_publicacion,
                    nombre_categoria: pubP.nombre_categoria,
                    nombre_subcat: pubP.nombre_subcat,
                    precio_pub: pubP.precio_pub,
                    foto_pub: pubP.foto_pub,
                    calif_pond_pub: pubP.calif_pond_pub,
                    calidad: pubP.calidad,
                    estado_pub: pubP.estado_pub,
                    handlename: pubP.handlename,
                    impacto_amb_pub: pubP.impacto_amb_pub
                }}
                pubP={{
                    descripcion: pubP.descripcion,
                    fecha_ini_pub: pubP.fecha_ini_pub,
                    contacto_correo: pubP.contacto_correo,
                    contacto_numero: pubP.contacto_numero,
                    cantidad: pubP.cantidad,
                    marca: pubP.marca,
                    handlename: pubP.handlename
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
                            onClick={() => router.push('/Explorar?section=products')}
                        >
                            <div className={styles.exploreMoreContent}>
                                <div className={styles.exploreMoreIcon}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.35-4.35"></path>
                                    </svg>
                                </div>
                                <div className={styles.exploreMoreTitle}>Explorar Más Productos</div>
                                <div className={styles.exploreMoreSubtitle}>Ver todos los productos disponibles</div>
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