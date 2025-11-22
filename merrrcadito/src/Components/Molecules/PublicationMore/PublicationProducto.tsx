import { ButtonCancel, ButtonForm } from '@/Components/Atoms';
import styles from './PublicationMore.module.css'
import { useState } from 'react';
import { ModalManagement } from '@/Components/Organisms';

interface PubPropsProd {
    pub:{
        descripcion: string,
        fecha_ini_pub: string,
        contacto_correo: string,
        contacto_numero: number,
        cantidad: number,
        marca?: string | null,
        handlename: string
    },
    onCancel: () => void
}

export default function PublicationProducto({
    pub,
    onCancel
}:PubPropsProd) {
    const [compra, setCompra] = useState(false);

    function abrirModalCompra(){
        setCompra(true);
    }

    function cerrarModalCompra(){
        setCompra(false);
        
    }

    return(
        <div>
            <div className={styles.container}>
                <div className={styles.description}>
                    <p>{pub.descripcion}</p>
                </div>
                    <div className={styles.detailsGrid}>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Cantidad</span>
                            <span className={styles.pOrsBadge}>{pub.cantidad} unidades</span>
                        </div>
                        {pub.marca && (
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Marca</span>
                                <span className={styles.pOrsBadge}>{pub.marca}</span>
                            </div>
                        )}
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
                    <ButtonForm  type='buy' action='buy' entity='publication' onClick={abrirModalCompra}/>
                    <ButtonCancel onClick={onCancel}/>
                </div>
            </div>
            { compra &&
               <ModalManagement>
                    <div className={styles.modalContainer}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Confirmar Compra</h3>
                        </div>
                        
                        <div className={styles.modalBody}>
                            <p className={styles.confirmationText}>
                                ¿Está usted seguro/a de adquirir este producto?
                            </p>
                            <p className={styles.detailText}>
                                Esta acción realizará la compra del producto seleccionado.
                            </p>
                        </div>
                        
                        <div className={styles.modalFooter}>
                            <ButtonCancel onClick={cerrarModalCompra} />
                            <ButtonForm type='buy' action='buy' entity='publication' />
                        </div>
                    </div>
                </ModalManagement>
            }
        </div>
    );
}