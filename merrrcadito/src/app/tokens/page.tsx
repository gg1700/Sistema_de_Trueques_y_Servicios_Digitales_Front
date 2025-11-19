'use client';

import React, { useState, useEffect } from 'react';
import UserLayout from '@/Components/Templates/UserLayout/UserLayout';
import { getTokenPackages, simularCompraTokens } from '@/services/pagoService';
import { TokenPackage } from '@/services/mockDatabase';
import TokenCard from '@/Components/Molecules/TokenCard/TokenCard';
import styles from './tokens.module.css';

export default function TokensPage() {
  const [paquetes, setPaquetes] = useState<TokenPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [comprandoId, setComprandoId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getTokenPackages();
      setPaquetes(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleComprarClick = async (paquete: TokenPackage) => {
    setComprandoId(paquete.id);

    try {
      const response = await simularCompraTokens(paquete);
      
      if (response.success) {
        alert(`¡Compra exitosa! Se han agregado ${paquete.tokens} tokens a tu cuenta.`);
      }

    } catch (error) {
      console.log(error);
      alert('Hubo un error al procesar tu compra.');
    } finally {
      setComprandoId(null);
    }
  };

  return (
    <UserLayout
      pageTitle="Tienda de Tokens"
      pageSubtitle="Compra tokens con dinero real para usar en la plataforma."
    >
      {loading ? (
        <p style={{ textAlign: 'center', padding: '20px' }}>Cargando paquetes...</p>
      ) : (
        <div className={styles.gridContainer}>
          {paquetes.map((paquete) => (
            <TokenCard 
              key={paquete.id} 
              paquete={paquete}
              onComprar={handleComprarClick}
              disabled={comprandoId === paquete.id}
            />
          ))}
        </div>
      )}
    </UserLayout>
  );
}