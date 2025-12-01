const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export interface AvailabilitySlot {
    day_of_week: number;
    start_time: string;
    end_time: string;
}

export interface EntrepreneurData {
    ci: string;
    nom_us: string;
    handle_name: string;
    ap_pat_us: string;
    ap_mat_us: string;
    contra_us: string;
    fecha_nacimiento: string;
    sexo: "M" | "F";
    correo_us: string;
    telefono_us: string;
    availability: AvailabilitySlot[];
}

export const registerEntrepreneur = async (
    data: EntrepreneurData,
    photo?: File
): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
        const formData = new FormData();

        // Agregar datos del usuario
        formData.append("ci", data.ci);
        formData.append("nom_us", data.nom_us);
        formData.append("handle_name", data.handle_name);
        formData.append("ap_pat_us", data.ap_pat_us);
        formData.append("ap_mat_us", data.ap_mat_us);
        formData.append("contra_us", data.contra_us);
        formData.append("fecha_nacimiento", data.fecha_nacimiento);
        formData.append("sexo", data.sexo);
        formData.append("correo_us", data.correo_us);
        formData.append("telefono_us", data.telefono_us);
        formData.append("cod_rol", "3"); // Emprendedor

        // Agregar disponibilidad como JSON
        formData.append("availability", JSON.stringify(data.availability));

        // Agregar foto si existe
        if (photo) {
            formData.append("foto_us", photo);
        }

        const response = await fetch(`${API_BASE_URL}/users/register_entrepreneur`, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error registering entrepreneur:", error);
        return {
            success: false,
            message: "Error al conectar con el servidor",
        };
    }
};

export const createAvailability = async (
    cod_us: number,
    slots: AvailabilitySlot[]
): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/availability`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ cod_us, slots }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error creating availability:", error);
        return {
            success: false,
            message: "Error al crear disponibilidad",
        };
    }
};

export const getAvailability = async (
    handle_name: string
): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/availability/${handle_name}`, {
            method: "GET",
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error getting availability:", error);
        return {
            success: false,
            message: "Error al obtener disponibilidad",
        };
    }
};

export const updateAvailability = async (
    cod_us: number,
    slots: AvailabilitySlot[]
): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/availability`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ cod_us, slots }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error updating availability:", error);
        return {
            success: false,
            message: "Error al actualizar disponibilidad",
        };
    }
};
