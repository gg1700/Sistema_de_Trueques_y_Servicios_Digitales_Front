'use client'

import { useState, useEffect } from 'react'

interface Publication {
    cod_pub: number
    titulo_pub?: string
    contenido: string
    nom_prod?: string
    nom_serv?: string
}

interface LinkProductsModalProps {
    isOpen: boolean
    onClose: () => void
    cod_prom: number
    titulo_prom: string
}

export default function LinkProductsModal({ isOpen, onClose, cod_prom, titulo_prom }: LinkProductsModalProps) {
    const [publications, setPublications] = useState<Publication[]>([])
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (isOpen) {
            loadPublications()
        }
    }, [isOpen])

    const loadPublications = async () => {
        try {
            setLoading(true)
            setError(null)

            // Obtener userId del localStorage
            const userId = localStorage.getItem('userId')
            if (!userId) {
                setError('No se pudo obtener el ID del usuario')
                return
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
            const response = await fetch(`${apiUrl}/publications/user/${userId}`)

            if (!response.ok) {
                throw new Error('Error al cargar publicaciones')
            }

            const data = await response.json()
            if (data.success && Array.isArray(data.data)) {
                setPublications(data.data)
            } else {
                setPublications([])
            }
        } catch (err) {
            console.error('Error cargando publicaciones:', err)
            setError('No se pudieron cargar las publicaciones')
        } finally {
            setLoading(false)
        }
    }

    const toggleSelection = (cod_pub: number) => {
        const newSelected = new Set(selectedIds)
        if (newSelected.has(cod_pub)) {
            newSelected.delete(cod_pub)
        } else {
            newSelected.add(cod_pub)
        }
        setSelectedIds(newSelected)
    }

    const handleConfirm = async () => {
        if (selectedIds.size === 0) {
            setError('Selecciona al menos una publicación')
            return
        }

        try {
            setSubmitting(true)
            setError(null)

            const userId = localStorage.getItem('userId')
            if (!userId) {
                setError('No se pudo obtener el ID del usuario')
                return
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

            // Vincular cada publicación seleccionada
            const promises = Array.from(selectedIds).map(cod_pub =>
                fetch(`${apiUrl}/promotions/link`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cod_prom,
                        cod_pub,
                        cod_us: parseInt(userId)
                    })
                })
            )

            const results = await Promise.all(promises)
            const allSuccess = results.every(r => r.ok)

            if (allSuccess) {
                setSuccess(true)
                setTimeout(() => {
                    onClose()
                    setSelectedIds(new Set())
                    setSuccess(false)
                }, 2000)
            } else {
                setError('Algunas vinculaciones fallaron')
            }
        } catch (err) {
            console.error('Error vinculando productos:', err)
            setError('Error al vincular productos')
        } finally {
            setSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Vincular Productos</h2>
                            <p className="text-gray-600 mt-1">Promoción: {titulo_prom}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                            {error}
                        </div>
                    ) : publications.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No tienes publicaciones disponibles</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {publications.map((pub) => (
                                <label
                                    key={pub.cod_pub}
                                    className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(pub.cod_pub)}
                                        onChange={() => toggleSelection(pub.cod_pub)}
                                        className="mt-1 w-5 h-5 text-teal-500 rounded focus:ring-teal-500"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">
                                            {pub.nom_prod || pub.nom_serv || `Publicación #${pub.cod_pub}`}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                            {pub.contenido}
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}

                    {success && (
                        <div className="mt-4 bg-green-100 text-green-700 p-4 rounded-lg text-center font-semibold">
                            ✓ Productos vinculados exitosamente
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className="flex-1 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 font-semibold py-3 rounded-xl transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={submitting || selectedIds.size === 0}
                        className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                        {submitting ? 'Vinculando...' : `Vincular ${selectedIds.size} ${selectedIds.size === 1 ? 'producto' : 'productos'}`}
                    </button>
                </div>
            </div>
        </div>
    )
}
