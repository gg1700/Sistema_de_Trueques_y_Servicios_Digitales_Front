import React from 'react';
import { Promocion } from '@/services/promocionService'; // Importamos el tipo
import styles from './PromotionCard.module.css'; // Necesitarás crear este CSS

interface Props {
  promocion: Promocion;
}

const PromotionCard: React.FC<Props> = ({ promocion }) => {
  return (
    <div className={styles.card}>
      {/* <img src={...} alt={promocion.titulo_prom} /> */}
      <h3>{promocion.titulo_prom}</h3>
      <p>{promocion.descr_prom}</p>
      <span>{promocion.descuento_prom}% OFF</span>
      <p>Válido hasta: {new Date(promocion.fecha_fin_prom).toLocaleDateString()}</p>
    </div>
  );
};

export default PromotionCard;