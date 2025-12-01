'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/Components/Templates/AppLayout/AppLayout';
import PromotionCard from '@/Components/Molecules/PromotionCard/PromotionCard';
import CreatePromotionModal from '@/Components/Molecules/CreatePromotionModal/CreatePromotionModal';
import Link from 'next/link';

interface Promocion {
  cod_prom: number;
  titulo_prom: string;
  descr_prom: string;
  fecha_ini_prom: string;
  fecha_fin_prom: string;
  descuento_prom: number;
  cant_prod_vinculados: number;
  banner_prom_base64?: string;
}

export default function PromocionesPage() {
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user');
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const router = useRouter();

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions/active`);
      const data = await response.json();

      if (data.success) {
        setPromociones(data.data || []);
      } else {
        setError('Error al cargar las promociones');
      }
    } catch (err) {
      console.error('Error fetching promotions:', err);
      setError('Error de conexión al cargar las promociones');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    loadPromociones(); // Recargar las promociones
    setShowCreateModal(false); // Cerrar el modal
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
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            + Crear Promoción
          </button>
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
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Crear Promoción
              </button>
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

        {/* Modal de crear promoción */}
        <CreatePromotionModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </AppLayout>
  );
}