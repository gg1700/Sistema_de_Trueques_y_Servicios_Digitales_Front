const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const ACHIEVEMENTS_API_BASE = `${API_BASE_URL}/achievments`;

export interface Achievement {
    cod_logro: number;
    titulo_logro: string;
    descr_logro: string;
    calidad_logro: 'bronce' | 'plata' | 'oro' | 'platino';
    progreso: number;
    estado_logro: 'no_iniciado' | 'en_progreso' | 'completado';
    fecha_obtencion_logro?: string;
}

export const AchievementService = {
    /**
     * Get all achievements for a specific user
     */
    async getUserAchievements(userId: number): Promise<Achievement[]> {
        try {
            const response = await fetch(`${ACHIEVEMENTS_API_BASE}/user/${userId}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch achievements: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch achievements');
            }

            return data.data as Achievement[];
        } catch (error) {
            console.error('Error fetching user achievements:', error);
            throw error;
        }
    },

    /**
     * Get achievement icon URL
     */
    getAchievementIconUrl(achievementId: number): string {
        return `${ACHIEVEMENTS_API_BASE}/${achievementId}/image`;
    },
};
