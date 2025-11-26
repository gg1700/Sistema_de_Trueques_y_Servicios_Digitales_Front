import { ButtonCancel, ButtonForm } from '@/Components/Atoms';
import styles from './PublicationMore.module.css';
import { useState, useEffect } from 'react';
import { purchaseProduct, PurchaseProductResponse } from '@/services/transactionService';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import { getCodUs } from '@/lib/authStorage';
const USERS_API_BASE = process.env.NEXT_PUBLIC_USERS_API_BASE_URL ?? "http://localhost:5000/api/users";
interface PubServProps {
    pub: {
        descripcion: string,
        fecha_ini_pub: string,
        duracion: number,
        contacto_correo: string;
        contacto_numero: number;
        hrs_ini_serv: string,
        hrs_fin_serv: string,
        handlename: string
    },
    onCancel: () => void,
    publicationData?: {
        cod_pub: number,
        nombre_publicacion: string,
        precio_pub?: number,
        foto_pub: string | null
    }
}

export default function PublicationService({
    pub,
    onCancel,
    publicationData
}: PubServProps) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [purchaseData, setPurchaseData] = useState<PurchaseProductResponse | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    useEffect(() => {
        const fetchUserId = () => {
            // Obtener cod_us directamente de localStorage
            const codUs = getCodUs();
            if (codUs) {
                setUserId(codUs);
            } else {
                console.log('No hay sesión activa');
            }
        };

        fetchUserId();
    }, []);
    async function handleConfirmPurchase() {
        if (!publicationData || !userId) {
            alert('No se pudo obtener el ID del usuario');
            return;
        }
        setIsProcessing(true);
        try {
            const result = await purchaseProduct(userId, publicationData.cod_pub);
            if (result.success) {
                setPurchaseData(result);
                setShowConfirmModal(false);
                setShowSuccessModal(true);
            } else {
                alert(result.message || 'Error al procesar la compra');
                setShowConfirmModal(false);
            }
        } catch (error: any) {
            alert(error.message || 'Error al procesar la compra');
            setShowConfirmModal(false);
        } finally {
            setIsProcessing(false);
        }
    }
    return (
        <div className={styles.container}>
            <div className={styles.description}>
                <p>{pub.descripcion}</p>
            </div>
            <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Duracion</span>
                    <span className={styles.pOrsBadge}>{pub.duracion}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Hora de inicio</span>
                    <span className={styles.pOrsBadge}>{pub.hrs_ini_serv}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Hora de finalización</span>
                    <span className={styles.pOrsBadge}>{pub.hrs_fin_serv}</span>
                </div>
            </div>
            <div className={styles.contactSection}>
                <h3 className={styles.contactTitle}>Información de Contacto</h3>
                <div className={styles.contactInfo}>
                    <div className={styles.contactItem}>
                        <span className={styles.contactText}>{pub.contacto_correo}</span>
                    </div>
                    <div className={styles.contactItem}>
                        <span className={styles.contactText}>{pub.contacto_numero}</span>
                    </div>
                </div>
            </div>
            <div className={styles.buttonsContainer}>
                <button
                    onClick={() => setShowConfirmModal(true)}
                    style={{
                        flex: 1,
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#1fb7a1',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Comprar
                </button>
                <ButtonCancel onClick={onCancel} />
            </div>
            {/* Confirmation Modal - Service Style */}
            {showConfirmModal && publicationData && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        maxWidth: '700px',
                        width: '90%',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <button
                            onClick={() => setShowConfirmModal(false)}
                            disabled={isProcessing}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                background: 'white',
                                border: 'none',
                                fontSize: '24px',
                                cursor: isProcessing ? 'not-allowed' : 'pointer',
                                zIndex: 10
                            }}
                        >
                            <FaTimes />
                        </button>
                        <div style={{ display: 'flex', minHeight: '400px' }}>
                            <div style={{
                                flex: '0 0 45%',
                                backgroundColor: '#f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '30px'
                            }}>
                                {publicationData.foto_pub ? (
                                    <img
                                        src={publicationData.foto_pub}
                                        alt={publicationData.nombre_publicacion}
                                        style={{
                                            width: '100%',
                                            maxHeight: '350px',
                                            objectFit: 'contain',
                                            borderRadius: '12px'
                                        }}
                                    />
                                ) : (
                                    <div style={{ fontSize: '64px' }}>🛠️</div>
                                )}
                            </div>
                            <div style={{ flex: 1, padding: '40px 35px' }}>
                                <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: '700' }}>
                                    Confirmar Compra
                                </h2>
                                <p style={{ margin: '0 0 25px 0', fontSize: '14px', color: '#999' }}>
                                    Revisa los detalles antes de confirmar
                                </p>
                                <div style={{ marginBottom: '15px' }}>
                                    <span style={{ color: '#999', fontSize: '12px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>
                                        Servicio
                                    </span>
                                    <span style={{ fontWeight: 'bold', fontSize: '18px', display: 'block' }}>
                                        {publicationData.nombre_publicacion}
                                    </span>
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <span style={{ color: '#999', fontSize: '12px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>
                                        Duración
                                    </span>
                                    <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#00a99d', display: 'block' }}>
                                        {pub.duracion} minutos
                                    </span>
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <span style={{ color: '#999', fontSize: '12px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>
                                        Horario
                                    </span>
                                    <span style={{ fontWeight: 'bold', fontSize: '16px', display: 'block' }}>
                                        {pub.hrs_ini_serv} - {pub.hrs_fin_serv}
                                    </span>
                                </div>
                                <div style={{ paddingTop: '15px', borderTop: '2px solid #e0e0e0', marginTop: 'auto' }}>
                                    <span style={{ color: '#999', fontSize: '12px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>
                                        Total a Pagar
                                    </span>
                                    <span style={{ fontWeight: 'bold', fontSize: '24px', color: '#00a99d', display: 'block' }}>
                                        {publicationData.precio_pub || 0} Tokens
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '20px 35px', borderTop: '1px solid #e0e0e0', display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                disabled={isProcessing}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    borderRadius: '8px',
                                    border: '2px solid #e0e0e0',
                                    backgroundColor: 'white',
                                    cursor: isProcessing ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmPurchase}
                                disabled={isProcessing}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: isProcessing ? '#ccc' : '#00a99d',
                                    color: 'white',
                                    cursor: isProcessing ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isProcessing ? 'Procesando...' : 'Confirmar Compra'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal - Service Style */}
            {showSuccessModal && purchaseData && publicationData && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '40px',
                        maxWidth: '450px',
                        width: '90%',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: '#4caf50',
                            margin: '0 auto 25px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FaCheckCircle size={45} color="white" />
                        </div>
                        <h2 style={{ margin: '0 0 15px 0', fontSize: '26px', fontWeight: '700' }}>
                            ¡Compra Exitosa!
                        </h2>
                        <p style={{ margin: '0 0 25px 0', fontSize: '16px', color: '#666' }}>
                            Has adquirido <strong>{publicationData.nombre_publicacion}</strong> exitosamente.
                        </p>
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '25px',
                            textAlign: 'left'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ color: '#666' }}>Tokens gastados:</span>
                                <span style={{ fontWeight: '600', color: '#00a99d' }}>
                                    {purchaseData.tokens_spent}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #e0e0e0' }}>
                                <span style={{ color: '#666' }}>Nuevo saldo:</span>
                                <span style={{ fontWeight: '700', color: '#00a99d', fontSize: '18px' }}>
                                    {purchaseData.new_balance} Tokens
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setShowSuccessModal(false);
                                onCancel();
                                window.location.reload();
                            }}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#00a99d',
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}