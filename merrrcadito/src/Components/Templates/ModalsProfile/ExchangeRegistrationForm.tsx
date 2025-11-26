/*\"use client";

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
    const [targetProducts, setTargetProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        targetUserId: "",
        selectedProducts: [] as string[],
        selectedTargetProducts: [] as string[],
        quantity: "",
        unit: "",
        image: null as File | null,
        environmentalImpact: "",
    });

    useEffect(() => {
        // Fetch users for selection
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_USERS_API_BASE_URL || "http://localhost:5000/api/users"}/all`);
                if (response.ok) {
                    const json = await response.json();
                    const usersData = json.data || json;
                    const filteredUsers = Array.isArray(usersData)
                        ? usersData.filter((u: User) => u.cod_us !== userId)
                        : [];
                    setUsers(filteredUsers);
                }
            } catch (err) {
                console.error("Error fetching users:", err);
                setUsers([]);
            }
        };

        // Fetch current user's products
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_PRODUCTS_API_BASE_URL || "http://localhost:5000/api/products"}/user/${userId}`);
                if (response.ok) {
                    const json = await response.json();
                    const productsData = json.data || json;
                    setProducts(Array.isArray(productsData) ? productsData : []);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                setProducts([]);
            }
        };

        fetchUsers();
        fetchProducts();
    }, [userId]);

    // Fetch target user's products when target user is selected
    useEffect(() => {
        const fetchTargetProducts = async () => {
            if (!formData.targetUserId) {
                setTargetProducts([]);
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_PRODUCTS_API_BASE_URL || "http://localhost:5000/api/products"}/user/${formData.targetUserId}`);
                if (response.ok) {
                    const json = await response.json();
                    const productsData = json.data || json;
                    setTargetProducts(Array.isArray(productsData) ? productsData : []);
                }
            } catch (err) {
                console.error("Error fetching target products:", err);
                setTargetProducts([]);
            }
        };

        fetchTargetProducts();
    }, [formData.targetUserId]);

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

    const handleTargetProductToggle = (productId: string) => {
        setFormData((prev) => {
            const currentSelected = prev.selectedTargetProducts;
            if (currentSelected.includes(productId)) {
                return {
                    ...prev,
                    selectedTargetProducts: currentSelected.filter((id) => id !== productId),
                };
            } else {
                return {
                    ...prev,
                    selectedTargetProducts: [...currentSelected, productId],
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
            if (!formData.targetUserId) {
                setError("Debes seleccionar un usuario");
                setLoading(false);
                return;
            }
            if (formData.selectedProducts.length === 0) {
                setError("Debes seleccionar al menos un producto para ofrecer");
                setLoading(false);
                return;
            }
            if (formData.selectedTargetProducts.length === 0) {
                setError("Debes seleccionar al menos un producto para recibir");
                setLoading(false);
                return;
            }
            if (!formData.quantity || !formData.unit) {
                setError("Debes especificar cantidad y unidad");
                setLoading(false);
                return;
            }
            if (!formData.image) {
                setError("Debes subir una foto");
                setLoading(false);
                return;
            }

            const data = new FormData();
            data.append("cod_us_1", userId.toString());
            data.append("cod_us_2", formData.targetUserId);
            data.append("products_origen", JSON.stringify(formData.selectedProducts));
            data.append("products_destino", JSON.stringify(formData.selectedTargetProducts));
            data.append("cant_prod_origen", formData.quantity);
            data.append("unidad_medida_origen", formData.unit);
            data.append("cant_prod_destino", "0");
            data.append("unidad_medida_destino", formData.unit);
            data.append("foto_inter", formData.image);
            data.append("impacto_amb_inter", formData.environmentalImpact || "0");

            console.log('📦 Sending data:');
            console.log('  cod_us_1:', userId);
            console.log('  cod_us_2:', formData.targetUserId);
            console.log('  products_origen:', formData.selectedProducts);
            console.log('  products_destino:', formData.selectedTargetProducts);
            console.log('  cant_prod_origen:', formData.quantity);
            console.log('  unidad_medida_origen:', formData.unit);
            console.log('  foto_inter:', formData.image ? 'File present' : 'No file');
            console.log('  impacto_amb_inter:', formData.environmentalImpact || "0");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_EXCHANGES_API_BASE_URL || "http://localhost:5000/api/exchanges"}/create`,
                {
                    method: "POST",
                    body: data,
                }
            );

            console.log('📦 Response status:', response.status);
            console.log('📦 Response ok:', response.ok);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Error desconocido" }));
                console.error('📦 Backend error:', errorData);
                throw new Error(errorData.message || "Error al crear el intercambio");
            }

            onSuccess();
            setFormData({
                targetUserId: "",
                selectedProducts: [],
                selectedTargetProducts: [],
                quantity: "",
                unit: "",
                image: null,
                environmentalImpact: "",
            });
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Ocurrió un error al crear el intercambio.");
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
                <div className={styles.formColFull}>
                    <label className={styles.fieldLabel}>Productos a Recibir del Otro Usuario</label>
                    <div className={styles.productsList}>
                        {!formData.targetUserId ? (
                            <p style={{ padding: "0.5rem", color: "#666" }}>Primero selecciona un usuario</p>
                        ) : targetProducts.length === 0 ? (
                            <p style={{ padding: "0.5rem", color: "#666" }}>El usuario no tiene productos registrados.</p>
                        ) : (
                            targetProducts.map((prod) => (
                                <label key={prod.cod_prod} className={styles.productCheckbox}>
                                    <input
                                        type="checkbox"
                                        checked={formData.selectedTargetProducts.includes(prod.cod_prod.toString())}
                                        onChange={() => handleTargetProductToggle(prod.cod_prod.toString())}
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
*/