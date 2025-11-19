import React from 'react';
import { TokenPackage } from '@/services/mockDatabase';
import styles from './TokenCard.module.css';
import { FaCoins } from 'react-icons/fa'; 

interface Props {
  paquete: TokenPackage;
  onComprar: (paquete: TokenPackage) => void; 
  disabled: boolean;
}

const TokenCard: React.FC<Props> = ({ paquete, onComprar, disabled }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imagePlaceholder}>
        {/* Icono o Placeholder */}
        <FaCoins size={60} color="#FFD700" /> 
      </div>
      
      <div className={styles.info}>
        <h3 className={styles.title}>{paquete.nombre}</h3>
        {/* Mostramos la cantidad de tokens que da el paquete */}
        <p style={{ color: '#00a99d', fontWeight: 'bold', margin: '5px 0' }}>
          {paquete.tokens} Tokens
        </p>
      </div>
      
      <button 
        className={styles.buyButton} 
        onClick={() => onComprar(paquete)}
        disabled={disabled}
      >
        {/* Mostramos el precio en dinero real */}
        Comprar por {paquete.precioReal} $
      </button>
    </div>
  );
};

export default TokenCard;