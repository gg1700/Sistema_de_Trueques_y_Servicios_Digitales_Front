'use client';
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Components/Templates/UserLayout/UserLayout';
import { getAllTokenPackages, TokenPackageDB } from '@/services/tokenService';
import { purchaseTokens } from '@/services/transactionService';
import styles from './tokens.module.css';
import { FaCoins, FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Modal de confirmación de compra
const PurchaseConfirmationModal = ({
  paquete,
  onConfirm,
  onCancel,
  isProcessing
}: {
  paquete: TokenPackageDB | null;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}) => {
  if (!paquete) return null;

  const [imgError, setImgError] = useState(false);
  const imageUrl = `${API_URL}/token_package/${paquete.id}/image`;

  return (
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
      zIndex: 9999,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        maxWidth: '700px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        animation: 'slideUp 0.3s ease-out',
        overflow: 'hidden'
      }}>
        {/* Botón cerrar */}
        <button
          onClick={onCancel}
          disabled={isProcessing}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'white',
            border: 'none',
            fontSize: '24px',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            color: '#666',
            opacity: isProcessing ? 0.5 : 1,
            zIndex: 10,
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <FaTimes />
        </button>

        {/* Layout horizontal */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          minHeight: '400px'
        }}>
          {/* Imagen del paquete - Izquierda */}
          <div style={{
            flex: '0 0 45%',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px'
          }}>
            {!imgError ? (
              <img
                src={imageUrl}
                alt={paquete.nombre}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  maxHeight: '350px'
                }}
                onError={() => setImgError(true)}
              />
            ) : (
              <FaCoins size={120} color="#FFD700" />
            )}
          </div>

          {/* Detalles - Derecha */}
          <div style={{
            flex: '0 0 55%',
            padding: '40px 30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {/* Título */}
            <div>
              <h2 style={{
                margin: '0 0 10px 0',
                fontSize: '22px',
                color: '#333',
                fontWeight: '600'
              }}>
                ¿Está seguro que desea proceder con la compra?
              </h2>
              <p style={{
                margin: '0 0 30px 0',
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.5'
              }}>
                Se descontará el monto de su saldo real y se agregarán los tokens a su billetera.
              </p>

              {/* Detalles del paquete */}
              <div style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <div style={{
                  marginBottom: '15px'
                }}>
                  <span style={{
                    color: '#999',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'block',
                    marginBottom: '5px'
                  }}>
                    Paquete
                  </span>
                  <span style={{
                    fontWeight: 'bold',
                    fontSize: '18px',
                    color: '#333',
                    display: 'block'
                  }}>
                    {paquete.nombre}
                  </span>
                </div>

                <div style={{
                  marginBottom: '15px'
                }}>
                  <span style={{
                    color: '#999',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'block',
                    marginBottom: '5px'
                  }}>
                    Créditos Verdes
                  </span>
                  <span style={{
                    fontWeight: 'bold',
                    fontSize: '18px',
                    color: '#00a99d',
                    display: 'block'
                  }}>
                    {paquete.tokens} CV
                  </span>
                </div>

                <div style={{
                  paddingTop: '15px',
                  borderTop: '2px solid #e0e0e0'
                }}>
                  <span style={{
                    color: '#999',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'block',
                    marginBottom: '5px'
                  }}>
                    Total a Pagar
                  </span>
                  <span style={{
                    fontWeight: 'bold',
                    fontSize: '24px',
                    color: '#00a99d',
                    display: 'block'
                  }}>
                    ${Number(paquete.precio_real).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={onCancel}
                disabled={isProcessing}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  backgroundColor: 'white',
                  color: '#666',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: isProcessing ? 0.5 : 1
                }}
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                disabled={isProcessing}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isProcessing ? '#ccc' : '#00a99d',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {isProcessing ? 'Procesando...' : 'Confirmar Compra'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// Modal de compra exitosa
const SuccessModal = ({
  paquete,
  onClose
}: {
  paquete: TokenPackageDB | null;
  onClose: () => void;
}) => {
  if (!paquete) return null;

  return (
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
      zIndex: 9999,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '450px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
        animation: 'slideUp 0.3s ease-out'
      }}>
        {/* Icono de éxito */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#4caf50',
          margin: '0 auto 25px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'scaleIn 0.4s ease-out'
        }}>
          <FaCheckCircle size={45} color="white" />
        </div>

        {/* Título */}
        <h2 style={{
          margin: '0 0 15px 0',
          fontSize: '26px',
          color: '#333',
          fontWeight: '700'
        }}>
          ¡Compra Exitosa!
        </h2>

        {/* Mensaje */}
        <p style={{
          margin: '0 0 25px 0',
          fontSize: '16px',
          color: '#666',
          lineHeight: '1.6'
        }}>
          Has adquirido <strong style={{ color: '#00a99d' }}>{paquete.tokens} Créditos Verdes</strong> del paquete <strong>{paquete.nombre}</strong>.
        </p>

        {/* Detalles resumidos */}
        <div style={{
          backgroundColor: '#f0f9f8',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          border: '2px solid #00a99d20'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <span style={{ color: '#666', fontSize: '14px' }}>Tokens Recibidos:</span>
            <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#00a99d' }}>
              +{paquete.tokens} CV
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span style={{ color: '#666', fontSize: '14px' }}>Monto Pagado:</span>
            <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
              ${Number(paquete.precio_real).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Botón continuar */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#00a99d',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Continuar
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

const TokenItem = ({
  paquete,
  onComprar,
  disabled
}: {
  paquete: TokenPackageDB;
  onComprar: (p: TokenPackageDB) => void;
  disabled: boolean;
}) => {
  const [imgError, setImgError] = useState(false);

  // Construimos la URL apuntando al nuevo endpoint que creaste en el backend
  const imageUrl = `${API_URL}/token_package/${paquete.id}/image`;

  return (
    <div className={styles.card}>
      <div className={styles.imagePlaceholder}>
        {!imgError ? (
          <img
            src={imageUrl}
            alt={paquete.nombre}
            className={styles.cardImage}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px'
            }}
            // Si la imagen falla (404 o error de servidor), activamos el estado de error
            onError={() => setImgError(true)}
          />
        ) : (
          // Fallback visual si no hay imagen
          <FaCoins size={60} color="#FFD700" />
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{paquete.nombre}</h3>
        <p style={{ color: '#00a99d', fontWeight: 'bold', margin: '5px 0' }}>
          {paquete.tokens} Tokens
        </p>
      </div>

      <button
        className={styles.buyButton}
        onClick={() => onComprar(paquete)}
        disabled={disabled}
      >
        {disabled ? 'Procesando...' : `Comprar por ${Number(paquete.precio_real).toFixed(2)} $`}
      </button>
    </div>
  );
};

export default function TokensPage() {
  const [paquetes, setPaquetes] = useState<TokenPackageDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [comprandoId, setComprandoId] = useState<number | null>(null);
  const [selectedPaquete, setSelectedPaquete] = useState<TokenPackageDB | null>(null);
  const [successPaquete, setSuccessPaquete] = useState<TokenPackageDB | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    success: boolean;
    message: string;
  }>({ show: false, success: false, message: '' });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getAllTokenPackages();
        setPaquetes(data || []);
      } catch (error) {
        console.error("Error cargando paquetes", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const showNotification = (success: boolean, message: string) => {
    setNotification({ show: true, success, message });
    setTimeout(() => {
      setNotification({ show: false, success: false, message: '' });
    }, 5000);
  };

  const handleComprarClick = (paquete: TokenPackageDB) => {
    setSelectedPaquete(paquete);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPaquete) return;

    setComprandoId(selectedPaquete.id);

    try {
      // TODO: Obtener el cod_us del usuario autenticado
      // Por ahora usaremos un valor de ejemplo
      // Usuario 1 tiene saldo_real = 0, Usuario 18 tiene saldo_real = 100000
      const cod_us_origen = 1; // CAMBIAR POR EL ID DEL USUARIO ACTUAL

      const result = await purchaseTokens(
        cod_us_origen,
        selectedPaquete.id,
        `Compra de ${selectedPaquete.nombre}`
      );

      if (result.success) {
        // Cerrar modal de confirmación y mostrar modal de éxito
        const purchasedPaquete = selectedPaquete;
        setSelectedPaquete(null);
        setComprandoId(null);
        setSuccessPaquete(purchasedPaquete);
      } else {
        // Mostrar mensaje de error detallado del backend
        const errorMessage = result.error
          ? `${result.message}: ${result.error}`
          : result.message || 'Error al procesar la compra. Verifica tu saldo.';
        showNotification(false, errorMessage);
        setSelectedPaquete(null);
        setComprandoId(null);
      }
    } catch (error) {
      console.error('Error en la compra:', error);
      showNotification(false, 'Error inesperado al procesar la compra.');
      setSelectedPaquete(null);
      setComprandoId(null);
    }
  };

  const handleCancelPurchase = () => {
    if (comprandoId === null) {
      setSelectedPaquete(null);
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccessPaquete(null);
  };

  return (
    <AdminLayout
      pageTitle="Tienda de Tokens"
      pageSubtitle="Compra tokens con dinero real para usar en la plataforma."
    >
      {/* Modal de confirmación */}
      {selectedPaquete && (
        <PurchaseConfirmationModal
          paquete={selectedPaquete}
          onConfirm={handleConfirmPurchase}
          onCancel={handleCancelPurchase}
          isProcessing={comprandoId !== null}
        />
      )}

      {/* Modal de éxito */}
      {successPaquete && (
        <SuccessModal
          paquete={successPaquete}
          onClose={handleCloseSuccessModal}
        />
      )}

      {/* Notificación */}
      {notification.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '15px 20px',
          borderRadius: '8px',
          backgroundColor: notification.success ? '#4caf50' : '#f44336',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          {notification.success ? <FaCheckCircle size={24} /> : <FaTimesCircle size={24} />}
          <span>{notification.message}</span>
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', padding: '20px' }}>Cargando paquetes...</p>
      ) : (
        <div className={styles.gridContainer}>
          {paquetes.map((paquete) => (
            <TokenItem
              key={paquete.id}
              paquete={paquete}
              onComprar={handleComprarClick}
              disabled={comprandoId === paquete.id}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
