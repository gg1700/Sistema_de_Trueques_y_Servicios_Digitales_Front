'use client'

import { useState, useEffect } from 'react';
import styles from './ProposeExchangeModal.module.css';

interface ProposeExchangeModalProps {
    exchange: {
        cod_inter: number;
        nombre_prod_origen: string;
        nombre_usuario_1: string;
    };
    onClose: () => void;
    onSuccess: () => void;
}

export default function ProposeExchangeModal({ exchange, onClose, onSuccess }: ProposeExchangeModalProps) {
    const [formData, setFormData] = useState({
        nom_prod: '',
        peso_prod: '',
        marca_prod: '',
        cod_cat: '',
        cod_subcat_prod: '',
        calidad_prod: 'usado',
        desc_prod: '',
        cant_prod_destino: '',
        unidad_medida_destino: 'kg'
    });
    const [categorias, setCategorias] = useState<any[]>([]);
    const [subcategorias, setSubcategorias] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const handle = typeof window !== 'undefined' ? localStorage.getItem('currentUserHandle') : null;
        if (handle) {
            fetchUserId(handle);
        }
    }, []);

    const fetchUserId = async (handle: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/get_user_data?handle_name=${handle}`);
            const data = await res.json();
            if (data.success && data.data) {
                const user = Array.isArray(data.data) ? data.data[0] : data.data;
                setUserId(user.cod_us);
            }
        } catch (err) {
            console.error('Error fetching user:', err);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    useEffect(() => {
        if (formData.cod_cat) {
            const selectedCat = categorias.find(cat => cat.cod_cat == formData.cod_cat);
            if (selectedCat) {
                const subs = selectedCat.subcategorias || [];
                setSubcategorias(subs);
                setFormData(prev => ({ ...prev, cod_subcat_prod: '' }));
            } else {
                setSubcategorias([]);
            }
        } else {
            setSubcategorias([]);
        }
    }, [formData.cod_cat, categorias]);

    const fetchCategorias = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
            const data = await res.json();
            if (data.success && data.data) {
                setCategorias(data.data);
            }
        } catch (err) {
            console.error('Error fetching categorias:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!userId) {
            setError('No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.');
            setStatus('error');
            setIsSubmitting(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                cod_us_2: userId
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchanges/${exchange.cod_inter}/propose`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (data.success) {
                setStatus('success');
                onSuccess(); // Trigger refresh in parent
            } else {
                setError(data.message || 'Error al enviar la propuesta');
                setStatus('error');
            }
        } catch (err) {
            console.error('Error submitting proposal:', err);
            setError('Error al conectar con el servidor');
            setStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (status === 'success') {
            onClose();
        } else {
            setStatus('idle');
            setError(null);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    <i className="bi bi-x-lg"></i>
                </button>

                <h2 className={styles.modalTitle}>Proponer Intercambio</h2>
                <p className={styles.modalSubtitle}>
                    Intercambio con <strong>{exchange.nombre_usuario_1}</strong> por <strong>{exchange.nombre_prod_origen}</strong>
                </p>

                {/* Error message is now handled by the 'error' status view */}

                {status === 'idle' && (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* ... Form Content ... */}
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Nombre del Producto *</label>
                                <input
                                    type="text"
                                    name="nom_prod"
                                    value={formData.nom_prod}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ej: Manzanas orgánicas"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Peso (kg) *</label>
                                <input
                                    type="number"
                                    name="peso_prod"
                                    value={formData.peso_prod}
                                    onChange={handleChange}
                                    required
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Marca</label>
                                <input
                                    type="text"
                                    name="marca_prod"
                                    value={formData.marca_prod}
                                    onChange={handleChange}
                                    placeholder="Opcional"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Categoría *</label>
                                <select
                                    name="cod_cat"
                                    value={formData.cod_cat}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccionar...</option>
                                    {categorias.map((cat) => (
                                        <option key={cat.cod_cat} value={cat.cod_cat}>
                                            {cat.nom_cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Subcategoría *</label>
                                <select
                                    name="cod_subcat_prod"
                                    value={formData.cod_subcat_prod}
                                    onChange={handleChange}
                                    required
                                    disabled={!formData.cod_cat}
                                >
                                    <option value="">
                                        {formData.cod_cat ? 'Seleccionar...' : 'Primero selecciona una categoría'}
                                    </option>
                                    {subcategorias.map((sub: any) => (
                                        <option key={sub.cod_subcat_prod} value={sub.cod_subcat_prod}>
                                            {sub.nom_subcat_prod}
                                        </option>
                                    ))}
                                </select>
                                {formData.cod_cat && subcategorias.length === 0 && (
                                    <small style={{ color: '#dc2626', fontSize: '0.75rem' }}>
                                        No hay subcategorías disponibles para esta categoría
                                    </small>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label>Calidad *</label>
                                <select
                                    name="calidad_prod"
                                    value={formData.calidad_prod}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="usado">Usado</option>
                                    <option value="nuevo">Nuevo</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Cantidad *</label>
                                <input
                                    type="number"
                                    name="cant_prod_destino"
                                    value={formData.cant_prod_destino}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    placeholder="1"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Unidad de Medida *</label>
                                <select
                                    name="unidad_medida_destino"
                                    value={formData.unidad_medida_destino}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="kg">Kilogramos (kg)</option>
                                    <option value="g">Gramos (g)</option>
                                    <option value="lb">Libras (lb)</option>
                                    <option value="unidades">Unidades</option>
                                    <option value="litros">Litros</option>
                                    <option value="metros">Metros</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Descripción</label>
                            <textarea
                                name="desc_prod"
                                value={formData.desc_prod}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Describe tu producto..."
                            />
                        </div>

                        <div className={styles.formActions}>
                            <button
                                type="button"
                                onClick={onClose}
                                className={styles.cancelButton}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Enviando...' : 'Enviar Propuesta'}
                            </button>
                        </div>
                    </form>
                )}

                {status === 'success' && (
                    <div className={styles.statusContainer}>
                        <div className={`${styles.statusIcon} ${styles.successIcon}`}>
                            <i className="bi bi-check-circle-fill"></i>
                        </div>
                        <h3 className={styles.statusTitle}>¡Propuesta Enviada!</h3>
                        <p className={styles.statusMessage}>
                            Tu propuesta de intercambio ha sido registrada exitosamente.
                        </p>
                        <div className={styles.statusDetails}>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Producto Ofrecido:</span>
                                <span className={styles.detailValue}>{formData.nom_prod}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Cantidad:</span>
                                <span className={styles.detailValue}>{formData.cant_prod_destino} {formData.unidad_medida_destino}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Intercambio con:</span>
                                <span className={styles.detailValue}>{exchange.nombre_usuario_1}</span>
                            </div>
                        </div>
                        <button className={styles.statusButton} onClick={onClose}>
                            Cerrar
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className={styles.statusContainer}>
                        <div className={`${styles.statusIcon} ${styles.errorIcon}`}>
                            <i className="bi bi-x-circle-fill"></i>
                        </div>
                        <h3 className={styles.statusTitle}>Error</h3>
                        <p className={styles.statusMessage}>
                            {error}
                        </p>
                        <button className={`${styles.statusButton} ${styles.errorButton}`} onClick={handleClose}>
                            Volver
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
