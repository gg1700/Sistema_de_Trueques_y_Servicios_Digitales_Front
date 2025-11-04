'use client';
import Link from 'next/link';
import styles from './MenuDesplegableSub.module.css'
import { useState } from 'react';


interface varTypeMenu{
    nombreMenu: string;
    form: string;
    back: string;
    casa: string;
}

{/*Los href tambien pueden ser props UwU */}

export default function Menu({nombreMenu, form, back, casa }:varTypeMenu){

    const [menuOpen, setMenuOpen] = useState(false);


    return(
        <>
            <div className={styles.container}>
                <div className={styles.navbar}>
                    <div className="#">{nombreMenu}</div>
                    <ul className={styles.navbarul}>
                        <li><Link href="/admin/GestionDeSubcategorias/NewSubcategory">
                            <div className={styles.navegador}>{form}</div>
                            </Link>
                        </li>
                        <li><div className={styles.navegador}>{back}</div></li>
                        <li><div className={styles.navegador}>{casa}</div></li>
                    </ul>
                    <div className={styles.toggleMenuBtn} onClick={() => setMenuOpen(!menuOpen)}>
                        <i className="bi bi-list"></i>
                    </div>
                </div>
            </div>

             {/*Menu desplegable para celular */}

                <div className={`${styles.dropMenu} ${menuOpen ? styles.open : ''}`}>
                     <li><Link href="/admin/GestionDeSubcategorias/NewSubcategory">
                            <div className={styles.navegador}>{form}</div>
                            </Link>
                        </li>
                        <li><div className={styles.navegador}>{back}</div></li>
                        <li><div className={styles.navegador}>{casa}</div></li>   
                </div>
            
        </>
    );
}