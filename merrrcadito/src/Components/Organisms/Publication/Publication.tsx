'use client'
import { useState, useEffect } from 'react';
import PublicationCard from "@/Components/Molecules/PublicationCard/PublicationCard";
import PublicationProducto from "@/Components/Molecules/PublicationMore/PublicationProducto";
import ModalManagement from "../ModalManagement/modalManagement";
import PublicationService from '@/Components/Molecules/PublicationMore/PublicationService';
import { purchaseProduct, PurchaseProductResponse } from '@/services/transactionService';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

interface BasePubProps {
    descripcion: string;
    fecha_ini_pub: string;
    contacto_correo: string;
    contacto_numero: number;
    handlename: string;
}

interface PubProdProps extends BasePubProps {
    cantidad: number;
    marca?: string | null;
}


interface PubServProps extends BasePubProps {
    hrs_ini_serv: string;
    hrs_fin_serv: string;
    duracion: number;
}

interface PublicationProps {
    clase: 'Producto' | 'Servicio',
    pub: {
        cod_pub: number,
        nombre_publicacion: string,
        nombre_categoria: string,
        nombre_subcat?: string,
        precio_pub?: number,
        foto_pub: string | null,
        calif_pond_pub: number,
        calidad?: string,
        handlename: string,
        estado_pub: 'activo' | 'inactivo',
    },
    pubP?: PubProdProps | null,
    pubS?: PubServProps | null
}

export default function Publication({
    clase,
    pub,
    pubP,
    pubS
}: PublicationProps) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [purchaseData, setPurchaseData] = useState<PurchaseProductResponse | null>(null);

    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            if (storedUserId) {
                setUserId(parseInt(storedUserId));
            }
        }
    }, []);

    function abrirModal() {
        setIsModalOpen(true);
    }

    function cerrarModal() {
        setIsModalOpen(false);
    }

    function handlePurchaseClick() {
        if (!userId) {
            alert('Por favor inicia sesión para realizar una compra');
            return;
        }
        setShowConfirmModal(true);
    }

    async function handleConfirmPurchase() {
        if (!userId) {
            alert('Error: No se pudo identificar al usuario');
            return;
        }

        setIsProcessing(true);
        try {
            const result = await purchaseProduct(userId, pub.cod_pub);
            if (result.success) {
                setPurchaseData(result);
                setShowConfirmModal(false);
                setShowSuccessModal(true);
            } else {
                alert(result.message || 'Error al procesar la compra');
            }
        } catch (error: any) {
            alert(error.message || 'Error al procesar la compra');
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <div>
            <PublicationCard
                pub={pub}
                onOpenModal={abrirModal}
                onPurchaseClick={handlePurchaseClick}
            />
            {isModalOpen && (
                <ModalManagement onClose={cerrarModal}>
                    {clase === 'Producto' && pubP ? (
                        <PublicationProducto
                            pub={pubP}
                            onCancel={cerrarModal}
                            publicationData={{
                                cod_pub: pub.cod_pub,
                                nombre_publicacion: pub.nombre_publicacion,
                                precio_pub: pub.precio_pub,
                                foto_pub: pub.foto_pub
                            }}
                        />
                    ) : clase === 'Servicio' && pubS ? (
                        <PublicationService pub={pubS} onCancel={cerrarModal} />
                    ) : (
                        <div>No hay datos disponibles</div>
                    )}
                </ModalManagement>
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && (
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
                        maxWidth: '500px',
                        width: '90%',
                        padding: '30px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        position: 'relative'
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
                                opacity: isProcessing ? 0.5 : 1
                            }}
                        >
                            <FaTimes />
                        </button>

                        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '700' }}>
                            Confirmar Compra
                        </h2>

                        {pub.foto_pub && (
                            <img
                                src={pub.foto_pub}
                                alt={pub.nombre_publicacion}
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '12px',
                                    marginBottom: '20px'
                                }}
                            />
                        )}

                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                                {pub.nombre_publicacion}
                            </h3>
                            <p style={{ color: '#666', marginBottom: '16px' }}>
                                {pub.nombre_categoria}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                <span style={{ fontSize: '28px', fontWeight: '700', color: '#1fb7a1' }}>
                                    {pub.precio_pub}
                                </span>
                                <span style={{ fontSize: '16px', color: '#666' }}>Tokens</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                disabled={isProcessing}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    backgroundColor: 'white',
                                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    opacity: isProcessing ? 0.5 : 1
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmPurchase}
                                disabled={isProcessing}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: '#1fb7a1',
                                    color: 'white',
                                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    opacity: isProcessing ? 0.5 : 1
                                }}
                            >
                                {isProcessing ? 'Procesando...' : 'Confirmar Compra'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && purchaseData && (
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
                        maxWidth: '500px',
                        width: '90%',
                        padding: '40px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        textAlign: 'center'
                    }}>
                        <FaCheckCircle style={{ fontSize: '64px', color: '#1fb7a1', marginBottom: '20px' }} />

                        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
                            ¡Compra Exitosa!
                        </h2>

                        <p style={{ color: '#666', marginBottom: '24px', fontSize: '16px' }}>
                            Has adquirido <strong>{pub.nombre_publicacion}</strong>
                        </p>

                        <div style={{
                            backgroundColor: '#f5f5f5',
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '24px',
                            textAlign: 'left'
                        }}>
                            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#666' }}>Tokens gastados:</span>
                                <span style={{ fontWeight: '600' }}>{purchaseData.tokens_spent}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#666' }}>Nuevo saldo:</span>
                                <span style={{ fontWeight: '600', color: '#1fb7a1' }}>
                                    {purchaseData.new_balance} Tokens
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setShowSuccessModal(false);
                                window.location.reload();
                            }}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#1fb7a1',
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