// Re-export Promocion type from mockDatabase for compatibility
export type { Promocion } from './mockDatabase';

/**
 * Obtiene las promociones activas desde la API real
 */
export const getPromociones = async (): Promise<any[]> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    const response = await fetch(`${apiUrl}/promotions/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.error('Formato de respuesta inesperado:', data);
      return [];
    }
  } catch (error) {
    console.error('Error al obtener promociones:', error);
    throw error;
  }
};