'use client'
import { Publication } from '@/Components/Organisms'
import { useRef } from 'react';
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
    }[]
    layout?: 'carousel' | 'grid';
}

export default function ListPublicationServ({
    title,
    pubServ,
    layout = 'carousel'
}: DataPubProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = direction === 'left' ? -300 : 300;
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
                    handlename: pubS.handlename
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
