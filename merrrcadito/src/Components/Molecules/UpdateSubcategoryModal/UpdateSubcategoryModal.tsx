'use client'

import { useEffect } from 'react'
import UpdateSubcategory from '@/app/admin/GestionDeSecciones/GestionDeSubcategorias/UpdateSubcategory/updateSubcategory'
import styles from './UpdateSubcategoryModal.module.css'

interface UpdateSubcategoryModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    subcategoryCod: number
    initialData: {
        seccion: string
        nombre: string
        descripcion: string
        imagen: string | null
    }
}

export default function UpdateSubcategoryModal({
    isOpen,
    onClose,
    onSuccess,
    subcategoryCod,
    initialData
}: UpdateSubcategoryModalProps) {
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
                    <h2 className={styles.modalTitle}>Editar Subcategoría</h2>
                    <UpdateSubcategory
                        subcategoryCod={subcategoryCod}
                        initialData={initialData}
                        onSubmit={handleSuccessWrapper}
                        onCancel={onClose}
                    />
                </div>
            </div>
        </div>
    )
}
