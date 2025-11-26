// hooks/usePublications.ts
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
}

const PUBLICATIONS_API_BASE =
  process.env.NEXT_PUBLIC_PUBLICATIONS_API_BASE_URL ??
  "http://localhost:5000/api/publications";

export const usePublicationsProds = () => {
  const [publications, setPublications] = useState<Publication[]>([]);

  useEffect(() => {
    async function loadPublicationsProds() {
      try {
        const response = await PublicationService.getAllPubProds();
        const data = response.data;

        // ✅ Debug: Ver datos RAW del backend
        console.log('🔥 RAW Backend Data (primeros 2):', data.slice(0, 2));

        const mappedPublications = data.map((pub: any) => {
          // ✅ Debug: Ver cada campo individual
          console.log('📝 Mapeando publicación:', {
            cod_pub: pub.cod_pub,
            'RAW pub object keys': Object.keys(pub),
            contenido: pub.contenido,
            correo_us: pub.correo_us,
            telefono_us: pub.telefono_us,
            cantidad: pub.cantidad,
            handle_name: pub.handle_name,
            fecha_ini_pub: pub.fecha_ini_pub
          });

          const mapped = {
            cod_pub: pub.cod_pub,
            nombre_publicacion: pub.nom_prod,
            nombre_categoria: pub.nom_cat,
            nombre_subcat: pub.nom_subcat_prod,
            precio_pub: pub.precio_prod,
            foto_pub: `${PUBLICATIONS_API_BASE}/${pub.cod_pub}/image`,
            calif_pond_pub: pub.calif_pond_pub,
            calidad: pub.calidad_prod,
            estado_pub: pub.estado_pub,
            descripcion: pub.desc_prod,
            fecha_ini_pub: pub.fecha_ini_pub,
            contacto_correo: pub.correo_us,
            contacto_numero: pub.telefono_us,
            handlename: pub.handle_name,
            cantidad: pub.cant_prod,
            marca: pub.marca_prod,
          };

          console.log('✅ Mapped result:', mapped);
          return mapped;
        });

        setPublications(mappedPublications);
      } catch (err) {
        console.error('Error cargando publicaciones:', err);
      }
    }

    loadPublicationsProds();
  }, []);

  return publications;
};
export const usePublicationsServs = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  useEffect(() => {
    async function loadPublicationsServs() {
      try {
        const response = await PublicationService.getAllPubServices();
        const data = response.data;
        const mappedPublications = data.map((pub: any) => ({
          cod_pub: pub.cod_pub,
          nombre_publicacion: pub.nom_serv,
          nombre_categoria: pub.nom_cat,
          nombre_subcat: undefined,
          precio_pub: pub.precio_pub,
          foto_pub: `${PUBLICATIONS_API_BASE}/${pub.cod_pub}/image`,
          calif_pond_pub: pub.calif_pond_pub,
          calidad: undefined,
          estado_pub: pub.estado_pub,
          descripcion: pub.contenido,
          fecha_ini_pub: pub.fecha_ini_pub,
          contacto_correo: pub.correo_us,
          contacto_numero: pub.telefono_us,
          handlename: pub.handle_name,
          cantidad: undefined,
          marca: undefined,
          hrs_ini_serv: pub.hrs_ini_serv,
          hrs_fin_serv: pub.hrs_fin_serv,
          duracion: pub.duracion,
        }));
        setPublications(mappedPublications);
      } catch (err) {
        console.error('Error cargando publicaciones de servicios:', err);
      }
    }
    loadPublicationsServs();
  }, []);
  return publications;
}