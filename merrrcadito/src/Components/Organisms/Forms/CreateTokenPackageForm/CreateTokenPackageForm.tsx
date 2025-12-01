'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { createTokenPackage } from '@/services/tokenService'

interface CreateTokenPackageFormProps {
    onSuccess?: () => void
    onCancel?: () => void
}

export default function CreateTokenPackageForm({ onSuccess, onCancel }: CreateTokenPackageFormProps) {
    const [form, setForm] = useState({
        nombre: "",
        tokens: "",
        precio_real: "",
    })

    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [errors, setErrors] = useState({
        nombre: "",
        tokens: "",
        precio_real: "",
        image: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })

        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }))
        }
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            setPreview(URL.createObjectURL(selectedFile))
        }

        if (errors.image) {
            setErrors(prev => ({
                ...prev,
                image: ""
            }))
        }
    }

    function validateForm(): boolean {
        const newErrors = {
            nombre: "",
            tokens: "",
            precio_real: "",
            image: "",
        }

        // Validaciones
        if (!form.nombre.trim()) newErrors.nombre = "El nombre del paquete es requerido"

        if (!form.tokens) {
            newErrors.tokens = "La cantidad de tokens es requerida"
        } else {
            const tokens = parseInt(form.tokens)
            if (isNaN(tokens) || tokens < 1) {
                newErrors.tokens = "La cantidad de tokens debe ser mayor a 0"
            }
        }

        if (!form.precio_real) {
            newErrors.precio_real = "El precio es requerido"
        } else {
            const precio = parseFloat(form.precio_real)
            if (isNaN(precio) || precio <= 0) {
                newErrors.precio_real = "El precio debe ser mayor a 0"
            }
        }

        if (!file) newErrors.image = "La imagen del paquete es requerida"

        setErrors(newErrors)
        return !Object.values(newErrors).some(error => error !== "")
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)
        setSubmitMessage(null)

        try {
            const formData = new FormData()
            formData.append("nombre", form.nombre)
            formData.append("tokens", form.tokens)
            formData.append("precio_real", form.precio_real)
            if (file) {
                formData.append("image", file)
            }

            await createTokenPackage(formData)

            setSubmitMessage({
                type: 'success',
                text: `Paquete "${form.nombre}" creado exitosamente`
            })

            // Reset form
            setForm({ nombre: "", tokens: "", precio_real: "" })
            setFile(null)
            setPreview(null)

            if (onSuccess) {
                setTimeout(() => onSuccess(), 2000)
            }
        } catch (error) {
            console.error(error)
            setSubmitMessage({
                type: 'error',
                text: 'Error al registrar el paquete'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Crear Nuevo Paquete de Tokens</h2>
                <p className="text-gray-500 text-sm">Completa los datos para registrar un nuevo paquete</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nombre del Paquete */}
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Nombre del Paquete
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 bg-white border ${errors.nombre ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#16a085] text-sm`}
                        placeholder="Ej. Paquete Inicial"
                    />
                    {errors.nombre && (
                        <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
                    )}
                </div>

                {/* Cantidad de Tokens y Precio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Cantidad de Tokens
                        </label>
                        <input
                            type="number"
                            name="tokens"
                            value={form.tokens}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 bg-white border ${errors.tokens ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#16a085] text-sm`}
                            placeholder="100"
                        />
                        {errors.tokens && (
                            <p className="text-red-500 text-sm mt-1">{errors.tokens}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Precio Real (Bs)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            name="precio_real"
                            value={form.precio_real}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 bg-white border ${errors.precio_real ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#16a085] text-sm`}
                            placeholder="50.00"
                        />
                        {errors.precio_real && (
                            <p className="text-red-500 text-sm mt-1">{errors.precio_real}</p>
                        )}
                    </div>
                </div>

                {/* Imagen del Paquete */}
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Imagen del Paquete
                    </label>
                    <div className="flex items-start gap-4">
                        {/* Placeholder de imagen */}
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {preview ? (
                                <img
                                    src={preview}
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
                            <p className="text-gray-500 text-xs mb-2">Por favor sube una imagen cuadrada, menor a 100KB</p>
                            <input
                                id="package-image-input"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById('package-image-input')?.click()}
                                className={`px-6 py-2.5 border-2 rounded-full font-medium text-sm transition-colors ${errors.image
                                    ? 'border-red-400 text-red-600 hover:bg-red-50'
                                    : 'border-[#16a085] text-[#16a085] hover:bg-teal-50'
                                    }`}
                            >
                                Elegir Archivo
                            </button>
                            {file && (
                                <p className="text-gray-600 text-xs mt-2">{file.name}</p>
                            )}
                        </div>
                    </div>
                    {errors.image && (
                        <p className="text-red-500 text-xs mt-1">{errors.image}</p>
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
                        {isSubmitting ? 'Creando...' : 'Registrar Paquete'}
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
