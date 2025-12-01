'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/Components/Templates/AppLayout/AppLayout';
import { getPromociones, Promocion } from '@/services/promocionService';
import PromotionCard from '@/Components/Molecules/PromotionCard/PromotionCard';
import Link from 'next/link';

export default function PromocionesPage() {
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user');
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('currentUserRole');
    if (storedRole === 'admin' || storedRole === 'user') {
      setUserRole(storedRole);
    }
  }, []);

  const loadPromociones = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPromociones();
      setPromociones(data);
    } catch (err) {
      console.error('Error cargando promociones:', err);
      setError('No se pudieron cargar las promociones. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromociones();
  }, []);

  return (
    <AppLayout
      pageTitle="Promociones"
      pageSubtitle="¡Aprovecha los descuentos y ofertas especiales!"
      userRole={userRole}
    >
      <div className="p-6 md:p-8">
        {/* Header con botón de crear */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Promociones Activas</h1>
            <p className="text-gray-600 mt-2">Descubre las mejores ofertas disponibles</p>
          </div>
          <Link
            href="/promociones/create"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            + Crear Promoción
          </Link>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div
                className="animate-spin rounded-full h-20 w-20 mx-auto mb-4"
                style={{
                  border: '6px solid rgba(22, 160, 133, 0.2)',
                  borderTop: '6px solid #16a085'
                }}
              ></div>
              <p className="text-gray-600 text-lg">Cargando promociones...</p>
            </div>
          </div>
        ) : error ? (
          /* Error state */
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <svg className="w-24 h-24 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Error al cargar promociones</h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <button
                onClick={loadPromociones}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : promociones.length === 0 ? (
          /* Empty state */
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay promociones disponibles</h3>
              <p className="text-gray-500 mb-6">Sé el primero en crear una promoción</p>
              <Link
                href="/promociones/create"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Crear Promoción
              </Link>
            </div>
          </div>
        ) : (
          /* Grid de promociones */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promociones.map((promo) => (
              <PromotionCard key={promo.cod_prom} promocion={promo} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}