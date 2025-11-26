'use client'
import { AppLayout } from '@/Components/Templates';
import { useState, useEffect } from 'react';
import Publication from '@/Components/Organisms/Publication/Publication';
import styles from './ExplorarMas.module.css';

const POSTS_API_BASE = process.env.NEXT_PUBLIC_POSTS_API_BASE_URL ?? "http://localhost:5000/api/posts";

export default function ExplorarMas() {
    const [activeTab, setActiveTab] = useState<'productos' | 'servicios'>('productos');
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                // Cargar productos
                const productsResponse = await fetch(`${POSTS_API_BASE}/explore_products`);
                const productsData = await productsResponse.json();
                if (productsData.success) {
                    setProducts(productsData.data);
                }

                // Cargar servicios
                const servicesResponse = await fetch(`${POSTS_API_BASE}/explore_services`);
                const servicesData = await servicesResponse.json();
                if (servicesData.success) {
                    setServices(servicesData.data);
                }
            } catch (error) {
                console.error('Error cargando datos:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const currentData = activeTab === 'productos' ? products : services;
    const currentCount = currentData.length;

    if (loading) {
        return (
            <AppLayout pageTitle="Explorar Más" pageSubtitle="Cargando...">
                <div className={styles.loading}>Cargando...</div>
            </AppLayout>
        );
    }

    return (
        <AppLayout
            pageTitle="Explorar Más"
            pageSubtitle="Descubre productos y servicios"
        >
            <div className={styles.container}>
                {/* Tabs */}
                <div className={styles.tabsContainer}>
                    <button
                        className={`${styles.tab} ${activeTab === 'productos' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('productos')}
                    >
                        📦 Productos ({products.length})
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'servicios' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('servicios')}
                    >
                        🛠️ Servicios ({services.length})
                    </button>
                </div>

                {/* Grid de publicaciones */}
                <div className={styles.grid}>
                    {activeTab === 'productos' ? (
                        products.map((product: any) => (
                            <Publication
                                key={product.cod_pub}
                                clase="Producto"
                                pub={{
                                    cod_pub: product.cod_pub,
                                    nombre_publicacion: product.nom_prod,
                                    nombre_categoria: product.nom_cat,
                                    nombre_subcat: product.nom_subcat_prod,
                                    precio_pub: product.precio_prod,
                                    foto_pub: `${POSTS_API_BASE}/${product.cod_pub}/image`,
                                    calif_pond_pub: product.calif_pond_pub,
                                    calidad: product.calidad_prod,
                                    handlename: product.handle_name,
                                    estado_pub: product.estado_pub
                                }}
                                pubP={{
                                    descripcion: product.desc_prod,
                                    fecha_ini_pub: product.fecha_ini_pub,
                                    contacto_correo: product.correo_us,
                                    contacto_numero: product.telefono_us,
                                    cantidad: product.cant_prod,
                                    marca: product.marca_prod,
                                    handlename: product.handle_name
                                }}
                            />
                        ))
                    ) : (
                        services.map((service: any) => (
                            <Publication
                                key={service.cod_pub}
                                clase="Servicio"
                                pub={{
                                    cod_pub: service.cod_pub,
                                    nombre_publicacion: service.nom_serv,
                                    nombre_categoria: service.nom_cat,
                                    precio_pub: service.precio_pub,
                                    foto_pub: `${POSTS_API_BASE}/${service.cod_pub}/image`,
                                    calif_pond_pub: service.calif_pond_pub,
                                    handlename: service.handle_name,
                                    estado_pub: service.estado_pub
                                }}
                                pubS={{
                                    descripcion: service.contenido,
                                    fecha_ini_pub: service.fecha_ini_pub,
                                    contacto_correo: service.correo_us,
                                    contacto_numero: service.telefono_us,
                                    handlename: service.handle_name,
                                    hrs_ini_serv: service.hrs_ini_serv,
                                    hrs_fin_serv: service.hrs_fin_serv,
                                    duracion: service.duracion
                                }}
                            />
                        ))
                    )}
                </div>

                {currentCount === 0 && (
                    <div className={styles.empty}>
                        No hay {activeTab === 'productos' ? 'productos' : 'servicios'} disponibles
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
