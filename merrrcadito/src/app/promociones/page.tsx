'use client'; 

import React, { useState, useEffect } from 'react';
import UserLayout from '@/Components/Templates/UserLayout/UserLayout'; 
import { getPromociones, Promocion } from '@/services/promocionService';
import PromotionCard from '@/Components/Molecules/PromotionCard/PromotionCard';

export default function PromocionesPage() {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPromociones = async () => {
      const data = await getPromociones();
      setPromociones(data);
      setLoading(false);
    };
    loadPromociones();
  }, []);


  return (
    <UserLayout
      pageTitle="Promociones"
      pageSubtitle="¡Aprovecha los descuentos y ofertas especiales!"
    >
      {loading ? (
        <p>Cargando promociones...</p>
      ) : (
        <div /* className={styles.gridContainer} */> 
          {promociones.map((promo) => (
            <PromotionCard key={promo.cod_prom} promocion={promo} />
          ))}
        </div>
      )}
    </UserLayout>
  );
}