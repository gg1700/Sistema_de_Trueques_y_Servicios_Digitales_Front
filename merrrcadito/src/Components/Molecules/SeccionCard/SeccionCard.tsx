import styles from './SeccionCard.module.css';
import {ButtonIcon} from '../../Atoms';


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
}
const API_BASE_URL=process.env.NEXT_PUBLIC_BACK_URL;

export default function SeccionCard({
  seccion,
  onEdit,
  onDelete
}: SeccionCardProps) {

  function getImageCategory(cod : number){
    return `${API_BASE_URL}/categories/${cod}/image`;
  }

  return (
    <div className={styles.seccionCard}>
      <div className={styles.cardContent}>
          <div className={styles.imageContainer} style={{ backgroundImage: `url(${seccion.imagen})`}} >
            <img 
              src={getImageCategory(seccion.cod)} 
              alt={`Imagen de ${seccion.nombre}`}
              className={styles.image}
              onLoad={() => console.log('Imagen cargada:', getImageCategory(seccion.cod))}  
            />
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