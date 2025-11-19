'use client';
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Components/Templates/UserLayout/UserLayout';
import { getAllTokenPackages, TokenPackageDB } from '@/services/tokenService';
import styles from './tokens.module.css';
import { FaCoins } from 'react-icons/fa';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const TokenItem = ({ 
  paquete, 
  onComprar, 
  disabled 
}: { 
  paquete: TokenPackageDB; 
  onComprar: (p: TokenPackageDB) => void; 
  disabled: boolean; 
}) => {
  const [imgError, setImgError] = useState(false);

  // Construimos la URL apuntando al nuevo endpoint que creaste en el backend
  const imageUrl = `${API_URL}/token_package/${paquete.id}/image`;

  return (
    <div className={styles.card}>
      <div className={styles.imagePlaceholder}>
        {!imgError ? (
          <img 
            src={imageUrl} 
            alt={paquete.nombre} 
            className={styles.cardImage}
            style={{
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              borderRadius: '8px'
            }} 
            // Si la imagen falla (404 o error de servidor), activamos el estado de error
            onError={() => setImgError(true)} 
          />
        ) : (
          // Fallback visual si no hay imagen
          <FaCoins size={60} color="#FFD700" /> 
        )}
      </div>
      
      <div className={styles.info}>
          <h3 className={styles.title}>{paquete.nombre}</h3>
          <p style={{ color: '#00a99d', fontWeight: 'bold', margin: '5px 0' }}>
              {paquete.tokens} Tokens
          </p>
      </div>

      <button 
          className={styles.buyButton} 
          onClick={() => onComprar(paquete)}
          disabled={disabled}
      >
          Comprar por {Number(paquete.precio_real).toFixed(2)} $
      </button>
    </div>
  );
};

export default function TokensPage() {
  const [paquetes, setPaquetes] = useState<TokenPackageDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [comprandoId, setComprandoId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getAllTokenPackages();
        setPaquetes(data || []);
      } catch (error) {
        console.error("Error cargando paquetes", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleComprarClick = async (paquete: TokenPackageDB) => {
    setComprandoId(paquete.id);
    // Simulación de proceso de compra
    setTimeout(() => {
        alert(`Iniciando compra de ${paquete.nombre}... (Lógica de pago pendiente)`);
        setComprandoId(null);
    }, 500);
  };

  return (
    <AdminLayout
      pageTitle="Tienda de Tokens"
      pageSubtitle="Compra tokens con dinero real para usar en la plataforma."
    >
      {loading ? (
        <p style={{ textAlign: 'center', padding: '20px' }}>Cargando paquetes...</p>
      ) : (
        <div className={styles.gridContainer}>
          {paquetes.map((paquete) => (
            <TokenItem 
              key={paquete.id} 
              paquete={paquete} 
              onComprar={handleComprarClick}
              disabled={comprandoId === paquete.id}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  );
}