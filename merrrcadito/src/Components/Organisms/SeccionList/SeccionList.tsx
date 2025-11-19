import styles from './SeccionList.module.css';
import {SeccionCard} from '../../Molecules';

interface Seccion {
  cod: number;
  nombre: string;
  descripcion: string;
  tipo: string
  imagen: string | null;
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
          {data.map((seccion, index) => (
            <SeccionCard
              key={`${type}-${seccion.cod}-${index}`}
              seccion={seccion}
              onEdit={onEdit}
              onDelete={onDelete}
              type={type}
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