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
  impacto_amb_pub?: number;
}

const PUBLICATIONS_API_BASE =
  process.env.NEXT_PUBLIC_PUBLICATIONS_API_BASE_URL ??
  "http://localhost:5000/api/publications";

// Función auxiliar para obtener elementos aleatorios de un array
const getRandomElements = <T,>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
};

const MAX_RANDOM_PUBLICATIONS = 12;

export const usePublicationsProds = () => {
  const [publications, setPublications] = useState<Publication[]>([]);

  useEffect(() => {
    async function loadPublicationsProds() {
      try {
        // Obtener el ID del usuario actual
        const currentUserId = typeof window !== 'undefined'
          ? localStorage.getItem('userId')
          : null;

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
          descripcion: pub.desc_prod,
          fecha_ini_pub: pub.fecha_ini_pub,
          contacto_correo: pub.correo_us,
          contacto_numero: pub.telefono_us,
          handlename: pub.handle_name,
          cantidad: pub.cantidad,
          marca: pub.marca_prod,
          impacto_amb_pub: Number(pub.impacto_amb_pub || 0),
          // Guardar el cod_us para filtrar
          cod_us: pub.cod_us
        }));

        // Filtrar publicaciones propias
        const filteredPublications = currentUserId
          ? mappedPublications.filter((pub: any) => pub.cod_us !== parseInt(currentUserId))
          : mappedPublications;

        // Seleccionar solo publicaciones aleatorias
        const randomPublications = getRandomElements(filteredPublications, MAX_RANDOM_PUBLICATIONS);
        setPublications(randomPublications);
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
        // Obtener el ID del usuario actual
        const currentUserId = typeof window !== 'undefined'
          ? localStorage.getItem('userId')
          : null;

        const response = await PublicationService.getAllPubServs();
        const data = response.data;

        const mappedPublications = data.map((pub: any) => ({
          cod_pub: pub.cod_pub,
          nombre_publicacion: pub.nom_serv,
          nombre_categoria: pub.nom_cat,
          nombre_subcat: '', // Servicios no tienen subcategoría
          precio_pub: pub.precio_pub,
          foto_pub: `${PUBLICATIONS_API_BASE}/${pub.cod_pub}/image`,
          calif_pond_pub: pub.calif_pond_pub,
          calidad: '', // Servicios no tienen calidad
          estado_pub: pub.estado_pub,
          descripcion: pub.contenido,
          fecha_ini_pub: pub.fecha_ini_pub,
          contacto_correo: pub.correo_us,
          contacto_numero: pub.telefono_us,
          handlename: pub.handle_name,
          cantidad: 0,
          marca: null,
          // Props especificos de servicio
          hrs_ini_serv: pub.hrs_ini_serv,
          hrs_fin_serv: pub.hrs_fin_serv,
          duracion: pub.duracion,
          // Guardar el cod_us para filtrar
          cod_us: pub.cod_us
        }));

        // Filtrar publicaciones propias
        const filteredPublications = currentUserId
          ? mappedPublications.filter((pub: any) => pub.cod_us !== parseInt(currentUserId))
          : mappedPublications;

        // Seleccionar solo publicaciones aleatorias
        const randomPublications = getRandomElements(filteredPublications, MAX_RANDOM_PUBLICATIONS);
        setPublications(randomPublications);
      } catch (err) {
        console.error('Error cargando publicaciones de servicios:', err);
      }
    }

    loadPublicationsServs();
  }, []);

  return publications;
};