import styles from './SeccionCard.module.css';
import {ButtonIcon} from '../../Atoms';

interface Seccion {
  cod: number;
  nombre: string;
  descripcion: string;
  imagen: string;
}

interface SeccionCardProps {
  seccion: Seccion;
  onEdit: (seccion: Seccion) => void;
  onDelete: (seccion: Seccion) => void;
}

export default function SeccionCard({
  seccion,
  onEdit,
  onDelete
}: SeccionCardProps) {
  return (
    <div className={styles.seccionCard}>
      <div className={styles.cardContent}>
        {seccion.imagen && (
          <div className={styles.imageContainer} style={{ backgroundImage: `url(${seccion.imagen})`}} >
            <img 
              src={seccion.imagen} 
              alt={`Imagen de ${seccion.nombre}`}
              className={styles.image}
            />
          </div>
        )}
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