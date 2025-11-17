'use client'
import {Publication} from '@/Components/Organisms'
import {useRef} from 'react';
import styles from './ListPublication.module.css'

interface DataPubProps{
    title: string,
    pubProd: {
        cod_pub: number,
        nombre_publicacion: string,
        nombre_categoria: string,
        nombre_subcat: string,
        precio_pub?: number,
        foto_pub: string,
        calif_pond_pub: number,
        calidad?: string,
        estado_pub: 'activo' | 'inactivo',
        descripcion: string;
        fecha_ini_pub: string;
        contacto_correo: string;
        contacto_numero: number;
        handlename: string;
        cantidad: number;
        marca?: string;
    }[]
}

export default function ListPublicationProd({
    title,
    pubProd
}:DataPubProps){
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };
    return(
        <div>
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

            <div  ref={scrollContainerRef} className={styles.scrollContainer}>
                {pubProd.map(pubP => (
                    <Publication 
                    clase= 'Producto'
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
                            handlename: pubP.handlename
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