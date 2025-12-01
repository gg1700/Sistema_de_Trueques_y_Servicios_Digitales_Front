'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import UserLayout from '@/Components/Templates/UserLayout/UserLayout'
import Link from 'next/link'

interface Product {
    cod_pub: number
    nom_prod: string
    contenido: string
    precio_prod: string | number
    cant_prod: number | string
    precio_total: string | number
    descuento_prom: string | number
    precio_con_descuento: string | number
    nom_us: string
    handle_name: string
}

export default function PromotionDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const promotionId = params.id as string

    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [promotionTitle, setPromotionTitle] = useState('')
    const [purchasingId, setPurchasingId] = useState<number | null>(null)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                setError(null)

                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
                const response = await fetch(`${apiUrl}/promotions/${promotionId}/publications`)

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`)
                }

                const data = await response.json()

                if (data.success && Array.isArray(data.data)) {
                    setProducts(data.data)
                    if (data.data.length > 0) {
                        setPromotionTitle(data.data[0].titulo_prom || 'Promoción')
                    }
                } else {
                    setProducts([])
                }
            } catch (err) {
                console.error('Error cargando productos:', err)
                setError('No se pudieron cargar los productos de esta promoción')
            } finally {
                setLoading(false)
            }
        }

        if (promotionId) {
            fetchProducts()
        }
    }, [promotionId])

    const handlePurchase = async (cod_pub: number) => {
        try {
            setPurchasingId(cod_pub)

            // Obtener userId desde localStorage
            const userId = localStorage.getItem('userId') || localStorage.getItem('user_id')

            if (!userId) {
                alert('Debes iniciar sesión para realizar una compra')
                return
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
            const response = await fetch(`${apiUrl}/transactions/purchase_product?cod_us=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cod_pub })
            })

            const data = await response.json()

            if (data.success) {
                // Mensaje de éxito con información del descuento
                const message = data.discount_applied > 0
                    ? `¡Compra exitosa! 🎉\n\n${data.message}\n\nAhorraste: ${(Number(data.tokens_spent) * (data.discount_applied / 100)).toFixed(2)} CV\nTotal pagado: ${Number(data.tokens_spent).toFixed(2)} CV\nNuevo saldo: ${Number(data.new_balance).toFixed(2)} CV`
                    : `¡Compra exitosa! 🎉\n\nTotal pagado: ${Number(data.tokens_spent).toFixed(2)} CV\nNuevo saldo: ${Number(data.new_balance).toFixed(2)} CV`

                alert(message)
            } else {
                alert(`Error en la compra: ${data.message || 'Error desconocido'}`)
            }
        } catch (err) {
            console.error('Error al realizar la compra:', err)
            alert('Error al procesar la compra. Por favor intenta nuevamente.')
        } finally {
            setPurchasingId(null)
        }
    }

    return (
        <UserLayout
            pageTitle={promotionTitle || 'Productos en Promoción'}
            pageSubtitle="Productos con descuento especial"
        >
            <div className="p-6 md:p-8">
                {/* Header con botón volver */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Volver
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{promotionTitle}</h1>
                            <p className="text-gray-600 mt-1">
                                {products.length} {products.length === 1 ? 'producto' : 'productos'} en promoción
                            </p>
                        </div>
                    </div>
                </div>

                {/* Loading state */}
                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-500 mx-auto mb-4"></div>
                            <p className="text-gray-600 text-lg">Cargando productos...</p>
                        </div>
                    </div>
                ) : error ? (
                    /* Error state */
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center max-w-md">
                            <svg className="w-24 h-24 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Error al cargar productos</h3>
                            <p className="text-gray-500 mb-6">{error}</p>
                            <Link
                                href="/promociones"
                                className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                            >
                                Volver a Promociones
                            </Link>
                        </div>
                    </div>
                ) : products.length === 0 ? (
                    /* Empty state */
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay productos en esta promoción</h3>
                            <p className="text-gray-500 mb-6">Aún no se han vinculado productos a esta promoción</p>
                            <Link
                                href="/promociones"
                                className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                            >
                                Ver Otras Promociones
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* Grid de productos */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => {
                            // Convertir strings a números para cálculos
                            const precioTotal = Number(product.precio_total)
                            const precioConDescuento = Number(product.precio_con_descuento)
                            const descuento = Number(product.descuento_prom)
                            const cantidad = Number(product.cant_prod)
                            const isPurchasing = purchasingId === product.cod_pub

                            return (
                                <div key={product.cod_pub} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                                    {/* Producto card */}
                                    <div className="p-6">
                                        {/* Badge de descuento */}
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-bold text-gray-800 flex-1">
                                                {product.nom_prod}
                                            </h3>
                                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold ml-2">
                                                -{descuento.toFixed(0)}%
                                            </span>
                                        </div>

                                        {/* Descripción */}
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {product.contenido}
                                        </p>

                                        {/* Vendedor */}
                                        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>@{product.handle_name}</span>
                                        </div>

                                        {/* Cantidad */}
                                        <div className="text-sm text-gray-500 mb-4">
                                            Cantidad disponible: <span className="font-semibold">{cantidad}</span>
                                        </div>

                                        {/* Precios */}
                                        <div className="mb-4">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-bold text-teal-600">
                                                    {precioConDescuento.toFixed(2)} CV
                                                </span>
                                                <span className="text-lg text-gray-400 line-through">
                                                    {precioTotal.toFixed(2)} CV
                                                </span>
                                            </div>
                                            <p className="text-sm text-green-600 font-medium mt-1">
                                                Ahorras {(precioTotal - precioConDescuento).toFixed(2)} CV
                                            </p>
                                        </div>

                                        {/* Botón de compra */}
                                        <button
                                            onClick={() => handlePurchase(product.cod_pub)}
                                            disabled={isPurchasing}
                                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                        >
                                            {isPurchasing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                    Procesando...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    Comprar Ahora
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </UserLayout>
    )
}
