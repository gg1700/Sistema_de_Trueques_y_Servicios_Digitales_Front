'use client'

import { useEffect } from 'react'
import UpdateCategory from '@/app/admin/GestionDeSecciones/GestionDeCategorias/UpdateCategory/updateCateory'
import styles from './UpdateCategoryModal.module.css'

interface UpdateCategoryModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    categoryCod: number
    initialData: {
        seccion: string
        nombre: string
        descripcion: string
        imagen: string | null
    }
}

export default function UpdateCategoryModal({
    isOpen,
    onClose,
    onSuccess,
    categoryCod,
    initialData
}: UpdateCategoryModalProps) {
    // Cerrar con tecla ESC
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            // Prevenir scroll del body cuando el modal está abierto
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Solo cerrar si se hace click directamente en el overlay, no en el contenido
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const handleSuccessWrapper = () => {
        onSuccess()
        onClose()
    }

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modalContainer}>
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Cerrar modal"
                >
                    ✕
                </button>
                <div className={styles.formWrapper}>
                    <h2 className={styles.modalTitle}>Editar Categoría</h2>
                    <UpdateCategory
                        categoryCod={categoryCod}
                        initialData={initialData}
                        onSubmit={handleSuccessWrapper}
                        onCancel={onClose}
                    />
                </div>
            </div>
        </div>
    )
}
