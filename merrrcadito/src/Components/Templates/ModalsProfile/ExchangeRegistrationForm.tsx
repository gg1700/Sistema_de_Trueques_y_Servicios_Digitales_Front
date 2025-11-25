"use client";

import React, { useState, useEffect } from "react";
import styles from "./ExchangeRegistrationForm.module.css";
import ProfileInput from "@/Components/Atoms/Input/ProfileInput/ProfileInput";
import FileInput from "@/Components/Templates/ModalsProfile/FileInput";

interface ExchangeRegistrationFormProps {
    userId: number;
    onSuccess: () => void;
}

interface User {
    cod_us: number;
    handle_name: string;
    nom_us: string;
    ap_pat_us: string;
}

interface Product {
    cod_prod: number;
    nom_prod: string;
}

export default function ExchangeRegistrationForm({
    userId,
    onSuccess,
}: ExchangeRegistrationFormProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        targetUserId: "",
        selectedProducts: [] as string[],
        quantity: "",
        unit: "",
        image: null as File | null,
        environmentalImpact: "",
    });

    useEffect(() => {
        // Fetch users for selection
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_USERS_API_BASE_URL || "http://localhost:5000/api/users"}`);
                if (response.ok) {
                    const data = await response.json();
                    // Filter out current user
                    setUsers(data.filter((u: User) => u.cod_us !== userId));
                }
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        // Fetch current user's products
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_PRODUCTS_API_BASE_URL || "http://localhost:5000/api/products"}/user/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };

        fetchUsers();
        fetchProducts();
    }, [userId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleProductToggle = (productId: string) => {
        setFormData((prev) => {
            const currentSelected = prev.selectedProducts;
            if (currentSelected.includes(productId)) {
                return {
                    ...prev,
                    selectedProducts: currentSelected.filter((id) => id !== productId),
                };
            } else {
                return {
                    ...prev,
                    selectedProducts: [...currentSelected, productId],
                };
            }
        });
    };

    const handleImageChange = (file: File | null) => {
        setFormData((prev) => ({ ...prev, image: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = new FormData();
            data.append("cod_us_1", userId.toString());
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_EXCHANGES_API_BASE_URL || "http://localhost:5000/api/exchanges"}/create`,
                {
                    method: "POST",
                    body: data,
                }
            );

            if (!response.ok) {
                throw new Error("Error al crear el intercambio");
            }

            onSuccess();
        } catch (err) {
            console.error(err);
            setError("Ocurrió un error al crear el intercambio. Por favor intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div className={styles.formRow}>
                <div className={styles.formColFull}>
                    <label className={styles.fieldLabel}>Usuario con quien intercambiar</label>
                    <select
                        name="targetUserId"
                        value={formData.targetUserId}
                        onChange={handleChange}
                        className={styles.selectInput}
                        required
                    >
                        <option value="">Seleccionar usuario</option>
                        {users.map((user) => (
                            <option key={user.cod_us} value={user.cod_us}>
                                {user.handle_name} ({user.nom_us} {user.ap_pat_us})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formColFull}>
                    <label className={styles.fieldLabel}>Tus Productos a Ofrecer</label>
                    <div className={styles.productsList}>
                        {products.length === 0 ? (
                            <p style={{ padding: "0.5rem", color: "#666" }}>No tienes productos registrados.</p>
                        ) : (
                            products.map((prod) => (
                                <label key={prod.cod_prod} className={styles.productCheckbox}>
                                    <input
                                        type="checkbox"
                                        checked={formData.selectedProducts.includes(prod.cod_prod.toString())}
                                        onChange={() => handleProductToggle(prod.cod_prod.toString())}
                                    />
                                    <span>{prod.nom_prod}</span>
                                </label>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formCol}>
                    <label className={styles.fieldLabel}>Cantidad Total</label>
                    <ProfileInput
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange as any}
                        placeholder="Ej. 5"
                    />
                </div>
                <div className={styles.formCol}>
                    <label className={styles.fieldLabel}>Unidad de Medida</label>
                    <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        className={styles.selectInput}
                        required
                    >
                        <option value="">Seleccionar</option>
                        <option value="unidades">Unidades</option>
                        <option value="kg">Kilogramos</option>
                        <option value="litros">Litros</option>
                        <option value="metros">Metros</option>
                    </select>
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formColFull}>
                    <label className={styles.fieldLabel}>Impacto Ambiental (Opcional)</label>
                    <ProfileInput
                        type="number"
                        name="environmentalImpact"
                        value={formData.environmentalImpact}
                        onChange={handleChange as any}
                        placeholder="Ej. 10.5"
                    />
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formColFull}>
                    <label className={styles.fieldLabel}>Foto del Intercambio</label>
                    <FileInput name="exchangeImage" onChange={handleImageChange} />
                </div>
            </div>

            {error && <p className={styles.errorMessage}>{error}</p>}

            <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? "Creando..." : "Crear Intercambio"}
            </button>
        </form>
    );
}
