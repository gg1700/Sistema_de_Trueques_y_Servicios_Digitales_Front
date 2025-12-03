// hooks/useAllPublications.ts - For Explorar page (shows ALL publications, not just random 12)
import { useState, useEffect } from 'react';
import { PublicationService } from '@/services';

interface Publication {
    cod_pub: number;
    nombre_publicacion: string;
    nombre_categoria: string;
    nombre_subcat: string;
    precio_pub?: number;
    foto_pub: string | null;
    calif_pond_pub: number;
    calidad?: string;
    estado_pub: 'activo' | 'inactivo';
    descripcion: string;
    fecha_ini_pub: string;
    contacto_correo: string;
    contacto_numero: number;
    handlename: string;
    cantidad: number;
    marca?: string | null;
    hrs_ini_serv?: string;
    hrs_fin_serv?: string;
    duracion?: number;
    impacto_amb_pub?: number;
}

const PUBLICATIONS_API_BASE =
    process.env.NEXT_PUBLIC_PUBLICATIONS_API_BASE_URL ??
    "http://localhost:5000/api/publications";

// Hook for ALL product publications (without limit)
export const useAllPublicationsProds = () => {
    const [publications, setPublications] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAllPublicationsProds() {
            try {
                setLoading(true);
                const response = await PublicationService.getAllPubProds();
                const data = response.data;

                const mappedPublications = data.map((pub: any) => ({
                    cod_pub: pub.cod_pub,
                    nombre_publicacion: pub.nom_prod,
                    nombre_categoria: pub.nom_cat,
                    nombre_subcat: pub.nom_subcat_prod,
                    precio_pub: pub.precio_prod,
                    foto_pub: `${PUBLICATIONS_API_BASE}/${pub.cod_pub}/image`,
                    calif_pond_pub: pub.calif_pond_pub,
                    calidad: pub.calidad_prod,
                    estado_pub: pub.estado_pub,
                    descripcion: pub.desc_prod || pub.contenido || '',
                    fecha_ini_pub: pub.fecha_ini_pub,
                    contacto_correo: pub.correo_us,
                    contacto_numero: pub.telefono_us,
                    handlename: pub.handle_name,
                    cantidad: pub.cantidad,
                    marca: pub.marca_prod,
                    impacto_amb_pub: Number(pub.impacto_amb_pub) || 0,
                }));

                // NO LIMIT - Show ALL publications
                setPublications(mappedPublications as Publication[]);
            } catch (err) {
                console.error('Error loading all publications:', err);
            } finally {
                setLoading(false);
            }
        }

        loadAllPublicationsProds();
    }, []);

    return { publications, loading };
};

// Hook for ALL service publications (without limit)
export const useAllPublicationsServs = () => {
    const [publications, setPublications] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAllPublicationsServs() {
            try {
                setLoading(true);
                const response = await PublicationService.getAllPubServs();
                const data = response.data;

                const mappedPublications = data.map((pub: any) => ({
                    cod_pub: pub.cod_pub,
                    nombre_publicacion: pub.nom_serv,
                    nombre_categoria: 'Servicio',
                    nombre_subcat: '',
                    precio_pub: pub.precio_serv,
                    foto_pub: `${PUBLICATIONS_API_BASE}/${pub.cod_pub}/image`,
                    calif_pond_pub: pub.calif_pond_pub,
                    calidad: '',
                    estado_pub: pub.estado_pub,
                    descripcion: pub.desc_serv || pub.contenido || '',
                    fecha_ini_pub: '',
                    contacto_correo: '',
                    contacto_numero: 0,
                    handlename: pub.handle_name || '',
                    cantidad: 0,
                    marca: null,
                    impacto_amb_pub: Number(pub.impacto_amb_pub) || 0,
                    hrs_ini_serv: pub.hrs_ini_serv,
                    hrs_fin_serv: pub.hrs_fin_serv,
                    duracion: pub.duracion
                }));

                // NO LIMIT - Show ALL publications
                setPublications(mappedPublications as Publication[]);
            } catch (err) {
                console.error('Error loading all service publications:', err);
            } finally {
                setLoading(false);
            }
        }

        loadAllPublicationsServs();
    }, []);

    return { publications, loading };
};
