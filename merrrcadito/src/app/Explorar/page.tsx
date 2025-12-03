'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Publication } from "@/Components/Organisms";
import AppLayout from "@/Components/Templates/AppLayout/AppLayout";
import { useAllPublicationsProds, useAllPublicationsServs } from "./useAllPublications"; // NEW: Show ALL publications
import styles from './page.module.css';

const ExplorarPage = () => {
    const searchParams = useSearchParams();
    const sectionParam = searchParams.get('section');

    const [activeSection, setActiveSection] = useState<'products' | 'services'>(
        sectionParam === 'services' ? 'services' : 'products'
    );
    const [userRole, setUserRole] = useState<'admin' | 'user'>('user');

    // NEW: Use hooks that fetch ALL publications, not just 12 random
    const { publications: dataPubProd, loading: loadingProds } = useAllPublicationsProds();
    const { publications: dataPubServ, loading: loadingServs } = useAllPublicationsServs();

    useEffect(() => {
        const storedRole = localStorage.getItem('currentUserRole');
        if (storedRole === 'admin' || storedRole === 'user') {
            setUserRole(storedRole);
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

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {activeSection === 'products' ? 'Productos' : 'Servicios'}
                    <span className="text-sm font-normal text-gray-500 ml-3">
                        ({activeSection === 'products' ? dataPubProd.length : dataPubServ.length} publicaciones)
                    </span>
                </h2>

                {/* Loading State */}
                {(loadingProds || loadingServs) && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-600"></div>
                        <p className="mt-4 text-gray-600">Cargando publicaciones...</p>
                    </div>
                )}

                {/* Grid exacto de promociones: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 */}
                {!(loadingProds || loadingServs) && (
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
                                        handlename: pubP.handlename,
                                        descripcion: pubP.descripcion, // CRITICAL: Pass description
                                        impacto_amb_pub: pubP.impacto_amb_pub // CRITICAL: Pass CO2 impact
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
                                        handlename: pubS.handlename,
                                        descripcion: pubS.descripcion, // CRITICAL: Pass description
                                        impacto_amb_pub: pubS.impacto_amb_pub // CRITICAL: Pass CO2 impact
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
                )}
            </div>
        </AppLayout>
    );
};

export default ExplorarPage;
