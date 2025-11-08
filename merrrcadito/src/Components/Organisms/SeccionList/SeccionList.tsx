import styles from './SeccionList.module.css';
import {SeccionCard} from '../../Molecules';

interface Seccion {
  cod: number;
  nombre: string;
  descripcion: string;
  imagen: string;
}

interface SeccionListProps {
  data: Seccion[];
  onEdit: (seccion: Seccion) => void;
  onDelete: (seccion: Seccion) => void;
  type: 'category' | 'subcategory';
}

export default function SeccionList({
  data,
  onEdit,
  onDelete,
  type
}: SeccionListProps) {
  return (
    <div>
      <div>
        <hr className={styles.hrCard}/>
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.seccionContainer}>
          {data.map(seccion => (
            <SeccionCard
              key={seccion.cod}
              seccion={seccion}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
      <div>
        <hr className={styles.hrCard2}/>
      </div>
    </div>
  );
}