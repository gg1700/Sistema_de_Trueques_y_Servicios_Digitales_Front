'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Publication } from "@/Components/Organisms";
import AppLayout from "@/Components/Templates/AppLayout/AppLayout";
import { usePublicationsProds, usePublicationsServs } from "../Home/PublicationViewHome";
import styles from './page.module.css';

import { Suspense } from 'react';

const ExplorarContent = () => {
    const searchParams = useSearchParams();
    const sectionParam = searchParams.get('section');

    const [activeSection, setActiveSection] = useState<'products' | 'services'>(
        sectionParam === 'services' ? 'services' : 'products'
    );
    const [userRole, setUserRole] = useState<'admin' | 'user' | 'entrepreneur'>('user');
    const [searchTerm, setSearchTerm] = useState('');
    const dataPubProd = usePublicationsProds();
    const dataPubServ = usePublicationsServs();

    useEffect(() => {
        const storedRole = localStorage.getItem('currentUserRole');
        if (storedRole === 'admin' || storedRole === 'user' || storedRole === 'entrepreneur') {
            setUserRole(storedRole as 'admin' | 'user' | 'entrepreneur');
        }
    }, []);

    return (
        <AppLayout
            pageTitle="Explorar"
            pageSubtitle="Descubre productos y servicios"
            userRole={userRole}
        >
            <div className="p-4" style={{ maxWidth: '100%', margin: '0 auto' }}>
                {/* Tabs de Navegación - Estilo Exacto Eventos */}
                <div className={styles.filterTabs}>
                    <button
                        onClick={() => setActiveSection('products')}
                        className={`${styles.filterTab} ${activeSection === 'products' ? styles.filterTabActive : ''}`}
                    >
                        Productos
                    </button>
                    <button
                        onClick={() => setActiveSection('services')}
                        className={`${styles.filterTab} ${activeSection === 'services' ? styles.filterTabActive : ''}`}
                    >
                        Servicios
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {activeSection === 'products' ? 'Productos' : 'Servicios'}
                </h2>

                {/* Grid exacto de promociones: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeSection === 'products' ? (
                        dataPubProd.map(pubP => (
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
                        ))
                    ) : (
                        dataPubServ.map(pubS => (
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
                                    hrs_ini_serv: pubS.hrs_ini_serv || '',
                                    hrs_fin_serv: pubS.hrs_fin_serv || '',
                                    duracion: pubS.duracion || 0,
                                    handlename: pubS.handlename
                                }}
                            />
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

const ExplorarPage = () => {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <ExplorarContent />
        </Suspense>
    );
};

export default ExplorarPage;
