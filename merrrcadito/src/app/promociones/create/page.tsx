'use client'

import { useRouter } from 'next/navigation'
import CreatePromotionForm from '@/Components/Organisms/Forms/CreatePromotionForm/CreatePromotionForm'

export default function CreatePromotionPage() {
    const router = useRouter()

    const handleSuccess = () => {
        router.push('/promociones')
    }

    const handleCancel = () => {
        router.back()
    }

    return (
        <CreatePromotionForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
        />
    )
}
