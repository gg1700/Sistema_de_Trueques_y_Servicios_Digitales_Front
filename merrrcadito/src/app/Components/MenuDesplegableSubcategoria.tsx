'use client';
import Link from 'next/link';
import styles from './MenuDesplegableSub.module.css'
import { useState } from 'react';



export default function DesplegarMenu(){

    const [menuOpen, setMenuOpen] = useState(false);

    return(
        <>
            <div className={styles.container}>
                <div className={styles.navbar}>
                    <div className="#">Subcategoria en Productos</div>
                    <ul className={styles.navbarul}>
                        <li><Link href="/GestionDeSubcategorias/NuevaSubcategoria">
                            <div className={styles.navegador}>Nueva Subcategoria</div>
                            </Link>
                        </li>
                        <li><div className={styles.navegador}>Atras</div></li>
                        <li><div className={styles.navegador}>Home</div></li>
                    </ul>
                    <div className={styles.toggleMenuBtn} onClick={() => setMenuOpen(!menuOpen)}>
                        <i className="bi bi-list"></i>
                    </div>
                </div>
            </div>

                <div className={`${styles.dropMenu} ${menuOpen ? styles.open : ''}`}>
                     <li><Link href="/GestionDeSubcategorias/NuevaSubcategoria">
                            <div className={styles.navegador}>Nueva Subcategoria</div>
                            </Link>
                        </li>
                        <li><div className={styles.navegador}>Atras</div></li>
                        <li><div className={styles.navegador}>Home</div></li>   
                </div>
            
        </>
    );
}