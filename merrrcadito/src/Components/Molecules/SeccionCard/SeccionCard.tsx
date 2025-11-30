import styles from './SeccionCard.module.css';
import { ButtonIcon } from '../../Atoms';


interface Seccion {
  cod: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  imagen: string | null;
}

interface SeccionCardProps {
  seccion: Seccion;
  onEdit: (seccion: Seccion) => void;
  onDelete: (seccion: Seccion) => void;
  type: 'category' | 'subcategory'
}
const API_BASE_URL = process.env.NEXT_PUBLIC_BACK_URL;

export default function SeccionCard({
  seccion,
  onEdit,
  onDelete,
  type
}: SeccionCardProps) {

  function getImageSeccion(cod: number): string | null {
    if (!API_BASE_URL) {
      console.warn('API_BASE_URL no está definida');
      return null;
    }

    if (!seccion?.cod) {
      console.warn('seccion.cod no está definido');
      return null;
    }
    if (type === 'category') {
      return `${API_BASE_URL}/categories/${cod}/image`;
    } else {
      return `${API_BASE_URL}/subcategories/${cod}/image`
    }
  }

  const imageUrl = getImageSeccion(seccion.cod);
  // Use default image from Next.js public folder
  const defaultImageUrl = '/default_image.jpg';

  return (
    <div className={styles.seccionCard}>
      <div className={styles.cardContent}>
        <div className={styles.imageContainer} style={{ backgroundImage: `url(${seccion.imagen})` }} >
          {imageUrl ? (
            <img
              src={imageUrl}
              onError={(e) => {
                // Prevent infinite loop by only setting default once
                if (e.currentTarget.src !== defaultImageUrl) {
                  e.currentTarget.src = defaultImageUrl;
                } else {
                  // If default image also fails, remove the src to prevent further errors
                  e.currentTarget.style.display = 'none';
                }
              }}
              alt={seccion.nombre}
            />
          ) : (
            <img
              src={defaultImageUrl}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              alt={seccion.nombre}
            />
          )}
        </div>

        <div className={styles.contentMain}>
          <div className={styles.headerRow}>
            <h3 className={styles.seccionName}>{seccion.nombre}</h3>
            <div className={styles.acciones}>
              <ButtonIcon
                icon="bi-pencil-square"
                onClick={() => onEdit(seccion)}
                type='update'
                name="Editar"
              />
              <ButtonIcon
                icon="bi-trash"
                onClick={() => onDelete(seccion)}
                type='delete'
                name="Eliminar"
              />
            </div>
          </div>
          <p className={styles.seccionDescription}>{seccion.descripcion}</p>
        </div>
      </div>
    </div>
  );
}