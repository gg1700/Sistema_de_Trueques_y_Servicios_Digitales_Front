"use client";

import React, { useState, useEffect } from "react";
import styles from "./ServiceRegistrationForm.module.css";
import ProfileInput from "@/Components/Atoms/Input/ProfileInput/ProfileInput";
import FileInput from "./FileInput";

const SERVICES_API_BASE =
    process.env.NEXT_PUBLIC_SERVICES_API_BASE_URL ??
    "http://localhost:5000/api/services";

const CATEGORIES_API_BASE =
    process.env.NEXT_PUBLIC_CATEGORIES_API_BASE_URL ??
    "http://localhost:5000/api/categories";

interface Props {
    userId: number;
    onSuccess?: () => void;
    onDuplicate?: () => void;
}

interface Category {
    cod_cat: number;
    nom_cat: string;
}

export default function ServiceRegistrationForm({ userId, onSuccess, onDuplicate }: Props) {
    const [formData, setFormData] = useState({
        nom_serv: "",
        desc_serv: "",
        precio_serv: "",
        duracion_serv: "",
        dif_dist_serv: "0",
        cod_cat: "",
        hrs_ini_dia_serv: "08:00",
        hrs_fin_dia_serv: "18:00",
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${CATEGORIES_API_BASE}?tipo_cat=Servicio`);
            const json = await res.json();
            if (json.success && json.data) {
                setCategories(json.data);
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const [image, setImage] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("cod_us", userId.toString());
            formDataToSend.append("nom_serv", formData.nom_serv);
            formDataToSend.append("desc_serv", formData.desc_serv);
            formDataToSend.append("precio_serv", formData.precio_serv);
            formDataToSend.append("duracion_serv", formData.duracion_serv);
            formDataToSend.append("dif_dist_serv", formData.dif_dist_serv);
            formDataToSend.append("cod_cat", formData.cod_cat);
            formDataToSend.append("hrs_ini_dia_serv", formData.hrs_ini_dia_serv);
            formDataToSend.append("hrs_fin_dia_serv", formData.hrs_fin_dia_serv);

            if (image) {
                formDataToSend.append("foto_serv", image);
            }

            const res = await fetch(`${SERVICES_API_BASE}/create`, {
                method: "POST",
                body: formDataToSend,
            });

            // Check if response is ok before trying to parse JSON
            if (!res.ok) {
                if (res.status === 404) {
                    throw new Error("El endpoint de servicios no está disponible. Verifica que el backend esté corriendo.");
                }

                // Handle duplicate service (409)
                if (res.status === 409 && onDuplicate) {
                    onDuplicate();
                    setLoading(false);
                    return;
                }

                const errorText = await res.text();
                console.error("Service creation error response:", errorText);

                let errorMessage = "Error del servidor";
                try {
                    const errorJson = JSON.parse(errorText);
                    if (errorJson.message) {
                        errorMessage = errorJson.message;
                    }
                } catch (e) {
                    // Not JSON, keep default message
                }

                throw new Error(errorMessage);
            }

            const json = await res.json();

            if (json.success === false) {
                throw new Error(json.message || "Error al registrar servicio");
            }

            setSuccess(true);
            setFormData({
                nom_serv: "",
                desc_serv: "",
                precio_serv: "",
                duracion_serv: "",
                dif_dist_serv: "0",
                cod_cat: "",
                hrs_ini_dia_serv: "08:00",
                hrs_fin_dia_serv: "18:00",
            });
            setImage(null);

            if (onSuccess) onSuccess();
        } catch (err: any) {
            console.error("Error creating service:", err);
            setError(err.message || "Error desconocido al registrar el servicio");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>


            {error && (
                <div className={styles.errorMessage}>
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>Imagen del Servicio</label>
                    <FileInput
                        name="foto_serv"
                        onChange={(file) => setImage(file)}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Nombre del Servicio</label>
                    <input
                        type="text"
                        name="nom_serv"
                        value={formData.nom_serv}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        placeholder="Ej. Clase de Matemáticas"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Categoría</label>
                    <select
                        name="cod_cat"
                        value={formData.cod_cat}
                        onChange={handleChange}
                        required
                        className={styles.select}
                    >
                        <option value="">Seleccione una categoría</option>
                        {categories.map((cat) => (
                            <option key={cat.cod_cat} value={cat.cod_cat}>
                                {cat.nom_cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Descripción</label>
                    <textarea
                        name="desc_serv"
                        value={formData.desc_serv}
                        onChange={handleChange}
                        required
                        className={styles.textarea}
                        placeholder="Describe detalladamente tu servicio..."
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Precio (Tokens)</label>
                        <input
                            type="number"
                            name="precio_serv"
                            value={formData.precio_serv}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Duración (minutos)</label>
                        <input
                            type="number"
                            name="duracion_serv"
                            value={formData.duracion_serv}
                            onChange={handleChange}
                            required
                            min="1"
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Hora Inicio</label>
                        <input
                            type="time"
                            name="hrs_ini_dia_serv"
                            value={formData.hrs_ini_dia_serv}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Hora Fin</label>
                        <input
                            type="time"
                            name="hrs_fin_dia_serv"
                            value={formData.hrs_fin_dia_serv}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </div>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? "Registrando..." : "Publicar Servicio"}
                </button>
            </form>
        </div>
    );
}

