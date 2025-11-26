'use client'
import { Publication } from '@/Components/Organisms'
import { useRef } from 'react';
import styles from './ListPublication.module.css'
interface DataPubProps {
    title: string,
    clase: 'Producto' | 'Servicio',
    publications: {
        cod_pub: number,
        nombre_publicacion: string,
        nombre_categoria: string,
        nombre_subcat?: string,
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
        cantidad?: number;
        marca?: string | null;
        hrs_ini_serv?: string;
        hrs_fin_serv?: string;
        duracion?: number;
    }[]
}
export default function ListPublication({
    title,
    clase,
    publications
}: DataPubProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className={styles.listContainer}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{title}</h2>
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
                    {publications.map(pub => (
                        <div key={pub.cod_pub} className={styles.cardWrapper}>
                            <Publication
                                clase={clase}
                                pub={{
                                    cod_pub: pub.cod_pub,
                                    nombre_publicacion: pub.nombre_publicacion,
                                    nombre_categoria: pub.nombre_categoria,
                                    nombre_subcat: pub.nombre_subcat,
                                    precio_pub: pub.precio_pub,
                                    foto_pub: pub.foto_pub,
                                    calif_pond_pub: pub.calif_pond_pub,
                                    calidad: pub.calidad,
                                    estado_pub: pub.estado_pub,
                                    handlename: pub.handlename
                                }}
                                pubP={clase === 'Producto' ? {
                                    descripcion: pub.descripcion,
                                    fecha_ini_pub: pub.fecha_ini_pub,
                                    contacto_correo: pub.contacto_correo,
                                    contacto_numero: pub.contacto_numero,
                                    cantidad: pub.cantidad!,
                                    marca: pub.marca,
                                    handlename: pub.handlename
                                } : null}
                                pubS={clase === 'Servicio' ? {
                                    descripcion: pub.descripcion,
                                    fecha_ini_pub: pub.fecha_ini_pub,
                                    contacto_correo: pub.contacto_correo,
                                    contacto_numero: pub.contacto_numero,
                                    handlename: pub.handlename,
                                    hrs_ini_serv: pub.hrs_ini_serv!,
                                    hrs_fin_serv: pub.hrs_fin_serv!,
                                    duracion: pub.duracion!
                                } : null}
                            />
                        </div>
                    ))}
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