'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/Components/Templates/AppLayout/AppLayout';
import { getPromociones, Promocion } from '@/services/promocionService';
import PromotionCard from '@/Components/Molecules/PromotionCard/PromotionCard';

export default function PromocionesPage() {
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user');
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem('currentUserRole');
    if (storedRole === 'admin' || storedRole === 'user') {
      setUserRole(storedRole);
    }
  }, []);

  useEffect(() => {
    const loadPromociones = async () => {
      const data = await getPromociones();
      setPromociones(data);
      setLoading(false);
    };
    loadPromociones();
  }, []);


  return (
    <AppLayout
      pageTitle="Promociones"
      pageSubtitle="¡Aprovecha los descuentos y ofertas especiales!"
      userRole={userRole}
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
    </AppLayout>
  );
}