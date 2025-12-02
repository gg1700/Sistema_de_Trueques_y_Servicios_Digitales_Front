'use client'

import { useEffect } from 'react'
import NewCategory from '@/app/admin/GestionDeSecciones/GestionDeCategorias/NewCategory/newCategory'
import styles from './CreateCategoryModal.module.css'

interface CreateCategoryModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function CreateCategoryModal({ isOpen, onClose, onSuccess }: CreateCategoryModalProps) {
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
                    <h2 className={styles.modalTitle}>Crear Nueva Categoría</h2>
                    <NewCategory
                        onSubmit={handleSuccessWrapper}
                        onCancel={onClose}
                    />
                </div>
            </div>
        </div>
    )
}
