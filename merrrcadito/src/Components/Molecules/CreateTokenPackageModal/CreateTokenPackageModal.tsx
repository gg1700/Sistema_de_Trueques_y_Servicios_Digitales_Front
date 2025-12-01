'use client'

import { useEffect } from 'react'
import CreateTokenPackageForm from '@/Components/Organisms/Forms/CreateTokenPackageForm/CreateTokenPackageForm'
import styles from './CreateTokenPackageModal.module.css'

interface CreateTokenPackageModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function CreateTokenPackageModal({ isOpen, onClose, onSuccess }: CreateTokenPackageModalProps) {
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
                <CreateTokenPackageForm
                    onSuccess={handleSuccessWrapper}
                    onCancel={onClose}
                />
            </div>
        </div>
    )
}
