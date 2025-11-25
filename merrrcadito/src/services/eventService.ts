const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

interface EventResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
}

export const EventService = {
    /**
     * Crear un nuevo evento
     */
    create_event: async (formData: FormData): Promise<EventResponse> => {
        try {
            const response = await fetch(`${API_BASE_URL}/events/create`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating event:', error);
            return {
                success: false,
                message: 'Error al crear el evento',
                error: error instanceof Error ? error.message : 'Error desconocido'
            };
        }
    },

    /**
     * Obtener eventos creados por un usuario
     */
    get_user_created_events: async (codUs: number): Promise<EventResponse> => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/events/get_user_created_events?cod_us=${codUs}`
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching user created events:', error);
            return {
                success: false,
                message: 'Error al obtener eventos del usuario',
                error: error instanceof Error ? error.message : 'Error desconocido'
            };
        }
    },

    /**
     * Obtener eventos en los que el usuario participa
     */
    get_events_by_user: async (codUs: number): Promise<EventResponse> => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/events/get_events_user?cod_us=${codUs}`
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching user events:', error);
            return {
                success: false,
                message: 'Error al obtener eventos del usuario',
                error: error instanceof Error ? error.message : 'Error desconocido'
            };
        }
    }
};
