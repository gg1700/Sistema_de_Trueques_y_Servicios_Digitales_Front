'use client'

import { useState } from 'react'

interface CreatePromotionFormProps {
    onSuccess?: () => void
    onCancel?: () => void
}

export default function CreatePromotionForm({ onSuccess, onCancel }: CreatePromotionFormProps) {
    const [form, setForm] = useState({
        titulo_prom: "",
        descr_prom: "",
        fecha_ini_prom: "",
        fecha_fin_prom: "",
        descuento_prom: "",
        banner_prom: null as File | null,
    })

    const [errors, setErrors] = useState({
        titulo_prom: "",
        descr_prom: "",
        fecha_ini_prom: "",
        fecha_fin_prom: "",
        descuento_prom: "",
        banner_prom: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev,
            [name]: value
        }))

        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }))
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null
        setForm(prev => ({
            ...prev,
            banner_prom: file
        }))

        // Crear preview
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        } else {
            setPreviewUrl(null)
        }

        if (errors.banner_prom) {
            setErrors(prev => ({
                ...prev,
                banner_prom: ""
            }))
        }
    }

    function validateForm(): boolean {
        const newErrors = {
            titulo_prom: "",
            descr_prom: "",
            fecha_ini_prom: "",
            fecha_fin_prom: "",
            descuento_prom: "",
            banner_prom: "",
        }

        // Validaciones
        if (!form.titulo_prom.trim()) newErrors.titulo_prom = "El título es requerido"
        if (!form.descr_prom.trim()) newErrors.descr_prom = "La descripción es requerida"
        if (!form.fecha_ini_prom) newErrors.fecha_ini_prom = "La fecha de inicio es requerida"
        if (!form.fecha_fin_prom) newErrors.fecha_fin_prom = "La fecha de fin es requerida"

        if (form.fecha_ini_prom && form.fecha_fin_prom) {
            const fechaInicio = new Date(form.fecha_ini_prom)
            const fechaFin = new Date(form.fecha_fin_prom)
            if (fechaFin <= fechaInicio) {
                newErrors.fecha_fin_prom = "La fecha de fin debe ser posterior a la de inicio"
            }
        }

        if (!form.descuento_prom) {
            newErrors.descuento_prom = "El descuento es requerido"
        } else {
            const descuento = parseFloat(form.descuento_prom)
            if (isNaN(descuento) || descuento < 1 || descuento > 100) {
                newErrors.descuento_prom = "El descuento debe estar entre 1 y 100"
            }
        }

        if (!form.banner_prom) newErrors.banner_prom = "La imagen del banner es requerida"

        setErrors(newErrors)
        return !Object.values(newErrors).some(error => error !== "")
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)
        setSubmitMessage(null)

        try {
            const formData = new FormData()
            formData.append('titulo_prom', form.titulo_prom)
            formData.append('descr_prom', form.descr_prom)
            formData.append('fecha_ini_prom', new Date(form.fecha_ini_prom).toISOString())
            formData.append('fecha_fin_prom', new Date(form.fecha_fin_prom).toISOString())
            formData.append('descuento_prom', form.descuento_prom)

            if (form.banner_prom) {
                formData.append('banner_prom', form.banner_prom)
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions/create`, {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (response.ok && data.success) {
                setSubmitMessage({
                    type: 'success',
                    text: `Promoción "${form.titulo_prom}" creada exitosamente`
                })

                setForm({
                    titulo_prom: "",
                    descr_prom: "",
                    fecha_ini_prom: "",
                    fecha_fin_prom: "",
                    descuento_prom: "",
                    banner_prom: null,
                })
                setPreviewUrl(null)

                if (onSuccess) {
                    setTimeout(() => onSuccess(), 2000)
                }
            } else {
                setSubmitMessage({
                    type: 'error',
                    text: data.message || 'Error al crear la promoción'
                })
            }
        } catch (error) {
            console.error('Error al crear promoción:', error)
            setSubmitMessage({
                type: 'error',
                text: 'Error de conexión. Por favor, intente nuevamente.'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Crear Nueva Promoción</h2>
                <p className="text-gray-500 text-sm">Completa los datos para crear una promoción</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Título */}
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Título de la Promoción
                    </label>
                    <input
                        type="text"
                        name="titulo_prom"
                        value={form.titulo_prom}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 bg-white border ${errors.titulo_prom ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#16a085] text-sm`}
                        placeholder="Ej: Black Friday 2025"
                    />
                    {errors.titulo_prom && (
                        <p className="text-red-500 text-sm mt-1">{errors.titulo_prom}</p>
                    )}
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Descripción
                    </label>
                    <textarea
                        name="descr_prom"
                        value={form.descr_prom}
                        onChange={handleChange}
                        rows={3}
                        className={`w-full px-4 py-2.5 bg-white border ${errors.descr_prom ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#16a085] resize-none text-sm`}
                        placeholder="Describe los detalles de la promoción..."
                    />
                    {errors.descr_prom && (
                        <p className="text-red-500 text-sm mt-1">{errors.descr_prom}</p>
                    )}
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Fecha de Inicio
                        </label>
                        <input
                            type="datetime-local"
                            name="fecha_ini_prom"
                            value={form.fecha_ini_prom}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 bg-white border ${errors.fecha_ini_prom ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#16a085] text-sm`}
                        />
                        {errors.fecha_ini_prom && (
                            <p className="text-red-500 text-sm mt-1">{errors.fecha_ini_prom}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Fecha de Fin
                        </label>
                        <input
                            type="datetime-local"
                            name="fecha_fin_prom"
                            value={form.fecha_fin_prom}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 bg-white border ${errors.fecha_fin_prom ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#16a085] text-sm`}
                        />
                        {errors.fecha_fin_prom && (
                            <p className="text-red-500 text-sm mt-1">{errors.fecha_fin_prom}</p>
                        )}
                    </div>
                </div>

                {/* Descuento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Descuento (%)
                        </label>
                        <input
                            type="number"
                            name="descuento_prom"
                            value={form.descuento_prom}
                            onChange={handleChange}
                            min="1"
                            max="100"
                            className={`w-full px-4 py-2.5 bg-white border ${errors.descuento_prom ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#16a085] text-sm`}
                            placeholder="Ej: 50"
                        />
                        {errors.descuento_prom && (
                            <p className="text-red-500 text-sm mt-1">{errors.descuento_prom}</p>
                        )}
                    </div>
                    <div></div>
                </div>

                {/* Banner (Simple File Input) */}
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Banner de la Promoción
                    </label>
                    <div className="flex items-start gap-4">
                        {/* Placeholder de imagen */}
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-500 text-xs mb-2">Please upload square image, size less than 100KB</p>
                            <input
                                id="banner-input"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById('banner-input')?.click()}
                                className={`px-6 py-2.5 border-2 rounded-full font-medium text-sm transition-colors ${errors.banner_prom
                                    ? 'border-red-400 text-red-600 hover:bg-red-50'
                                    : 'border-[#16a085] text-[#16a085] hover:bg-teal-50'
                                    }`}
                            >
                                Choose File
                            </button>
                            {form.banner_prom && (
                                <p className="text-gray-600 text-xs mt-2">{form.banner_prom.name}</p>
                            )}
                        </div>
                    </div>
                    {errors.banner_prom && (
                        <p className="text-red-500 text-xs mt-1">{errors.banner_prom}</p>
                    )}
                </div>

                {/* Mensaje de resultado */}
                {submitMessage && (
                    <div className={`p-4 rounded-xl text-center font-semibold ${submitMessage.type === 'success'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}>
                        {submitMessage.text}
                    </div>
                )}

                {/* Botones */}
                <div className="flex justify-center gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-2.5 text-white font-semibold rounded-full transition-all text-sm"
                        style={{
                            background: isSubmitting ? '#94a3b8' : '#16a085',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isSubmitting ? 'Creando...' : 'Publicar'}
                    </button>

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="px-8 py-2.5 bg-gray-700 hover:bg-gray-800 disabled:opacity-50 text-white font-semibold rounded-full transition-colors text-sm"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}
