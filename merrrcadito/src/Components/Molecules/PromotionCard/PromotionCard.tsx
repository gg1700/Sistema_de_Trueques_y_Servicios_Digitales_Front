'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import LinkProductsModal from '@/Components/Molecules/LinkProductsModal'

interface Props {
  promocion: any
}

const PromotionCard: React.FC<Props> = ({ promocion }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysRemaining = () => {
    const now = new Date()
    const endDate = new Date(promocion.fecha_fin_prom)
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysRemaining = getDaysRemaining()
  const isExpiringSoon = daysRemaining <= 3 && daysRemaining > 0
  const isExpired = daysRemaining < 0

  // Manejar imagen base64 o usar placeholder
  const getImageSrc = () => {
    // Debug: ver qué datos llegan
    console.log('Promocion data:', {
      cod_prom: promocion.cod_prom,
      titulo: promocion.titulo_prom,
      has_banner_base64: !!promocion.banner_prom_base64,
      banner_length: promocion.banner_prom_base64?.length
    })

    // Usar explícitamente banner_prom_base64
    if (promocion.banner_prom_base64 && typeof promocion.banner_prom_base64 === 'string' && promocion.banner_prom_base64.length > 0) {
      // 1. SANITIZAR: Eliminar saltos de línea y espacios en blanco
      const cleanBase64 = promocion.banner_prom_base64.replace(/[\r\n\s]/g, '')
      console.log('Base64 sanitizado, longitud:', cleanBase64.length)
      console.log('Primeros caracteres:', cleanBase64.substring(0, 10))

      // 2. DETECTAR MIME TYPE dinámicamente
      let mimeType = 'image/jpeg' // Default
      if (cleanBase64.startsWith('iVBOR')) {
        mimeType = 'image/png'
      } else if (cleanBase64.startsWith('/9j/')) {
        mimeType = 'image/jpeg'
      } else if (cleanBase64.startsWith('R0lGOD')) {
        mimeType = 'image/gif'
      }

      console.log('MIME type detectado:', mimeType)

      // 3. Construir data URI con el MIME correcto
      return `data:${mimeType};base64,${cleanBase64}`
    }

    // Placeholder SVG gradient si no hay imagen
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2314b8a6;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%233b82f6;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="200" fill="url(%23grad)" /%3E%3C/svg%3E'
  }

  const imageSrc = getImageSrc()

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        {/* Banner de la promoción */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-200">
          {imageSrc && imageSrc.startsWith('data:image') ? (
            // CASO A: SI HAY IMAGEN, MUESTRA SOLO LA IMAGEN
            <img
              src={imageSrc}
              alt={promocion.titulo_prom}
              className="w-full h-full object-cover"
              onLoad={() => {
                console.log('✅ Imagen cargada exitosamente para:', promocion.titulo_prom)
              }}
              onError={(e) => {
                console.error('❌ Error cargando imagen:', promocion.cod_prom)
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            // CASO B: SI NO HAY IMAGEN, MUESTRA FONDO GRADIENTE
            <div className="w-full h-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-6xl font-bold">{promocion.descuento_prom}%</div>
                <div className="text-xl font-semibold">OFF</div>
              </div>
            </div>
          )}

          {/* Badge del porcentaje flotante - esquina superior derecha */}
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
              -{promocion.descuento_prom}% OFF
            </span>
          </div>
        </div>

        {/* Contenido de la tarjeta */}
        <div className="p-6">
          {/* Header con título y badge de descuento */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex-1">
              {promocion.titulo_prom}
            </h3>
            <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-semibold ml-2 whitespace-nowrap">
              {promocion.descuento_prom}% OFF
            </span>
          </div>

          {/* Descripción */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {promocion.descr_prom}
          </p>

          {/* Fechas */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Inicio: {formatDate(promocion.fecha_ini_prom)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Fin: {formatDate(promocion.fecha_fin_prom)}</span>
            </div>
          </div>

          {/* Estado de la promoción */}
          {isExpired ? (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium text-center">
              Promoción expirada
            </div>
          ) : isExpiringSoon ? (
            <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium text-center">
              ⚠️ ¡Quedan solo {daysRemaining} {daysRemaining === 1 ? 'día' : 'días'}!
            </div>
          ) : (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium text-center">
              ✓ Promoción activa ({daysRemaining} días restantes)
            </div>
          )}

          {/* Botones de acción */}
          <div className="space-y-2 mt-4">
            <Link
              href={`/promociones/${promocion.cod_prom}`}
              className="block w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
            >
              Ver Productos en Promoción
            </Link>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-white border-2 border-teal-500 text-teal-500 hover:bg-teal-50 font-semibold py-3 px-6 rounded-lg transition-colors text-center"
            >
              + Vincular Productos
            </button>
          </div>
        </div>
      </div>

      {/* Modal de vinculación */}
      <LinkProductsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cod_prom={promocion.cod_prom}
        titulo_prom={promocion.titulo_prom}
      />
    </>
  )
}

export default PromotionCard