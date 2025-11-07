'use client'
import { useState } from 'react';
import styles from './ViewSeccion.module.css'; 
import ModalManagement from '@/app/Components/Organisms/ModalManagement/modalManagement';
import AccordionForm from '../../../Components/Organisms/Forms/AccordionForm'
import DeleteSeccion from '../../../Components/Organisms/DeleteSeccionComponent/deleteSeccion';

interface Seccion {
  cod: number;
  nombre: string;
  descripcion: string;
  fechaRegistro: string;
}

interface ViewSeccionesProps {
  type: 'subcategory' | 'category';
  datos: Seccion[];
  componenteUpdate: React.ComponentType<any>;
  componenteDelete: React.ComponentType<any>;
  componenteNuevo: React.ComponentType<any>;
  triggerText: string;
  onEliminacionExitosa?: (cod: number) => void;
  onActualizacionExitosa?: () => void;
  onCreacionExitosa?: () => void;
}

export default function ViewSecciones({
  type,
  datos,
  componenteUpdate: UpdateComponent,
  componenteDelete: DeleteComponent,
  componenteNuevo: NewComponent,
  triggerText,
  onEliminacionExitosa,
  onActualizacionExitosa,
  onCreacionExitosa
}: ViewSeccionesProps) {

    const [deleteModal, setDeleteModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [seccionSeleccionada, setSeccionSeleccionada] = useState<Seccion | null>(null);
    const [data, setData] = useState(datos);

    function abrirModalEliminar(seccion: Seccion) {
        setSeccionSeleccionada(seccion);
        setDeleteModal(true);
    }

    function cerrarModalEliminar() {
        console.log("0. Sección seleccionada:", seccionSeleccionada);
        setSeccionSeleccionada(null);
        setDeleteModal(false);
    }

    function abrirModalEditar(seccion: Seccion) {
        setSeccionSeleccionada(seccion);
        setUpdateModal(true);
    }

    function cerrarModalEditar() {
        setSeccionSeleccionada(null);
        setUpdateModal(false);
    }

    const handleEliminacionExitosa = () => {
        if (seccionSeleccionada) {
            setData(prev => prev.filter(item => item.cod !== seccionSeleccionada.cod));
            onEliminacionExitosa?.(seccionSeleccionada.cod);
        }
        cerrarModalEliminar();
    };

    const handleActualizacionExitosa = () => {
        onActualizacionExitosa?.();
        cerrarModalEditar();
    }

    const handleCreacionExitosa = () => {
        onCreacionExitosa?.();
        setIsAccordionOpen(false);
    };

    return(
        <div>
           <div>
               <hr className={styles.hrCard}/>
           </div>
           <div className={styles.mainContainer}>
             <div className={styles.seccionContainer}>
                   {data.map(seccion => 
                        <div key={seccion.cod} className={styles.seccionCard}>
                            <div className={styles.cardContent}>
                                <div className={styles.textContent}>
                                    <h3 className={styles.seccionName}>{seccion.nombre}</h3>
                                    <p className={styles.seccionDescription}>{seccion.descripcion}</p>
                                </div>
                                <div className={styles.acciones}>
                                    <button className={styles.btnAccion} onClick={() => abrirModalEditar(seccion)}>
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button className={styles.btnAccion} onClick={() => abrirModalEliminar(seccion)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                   )}
             </div>
           </div>

           <div>
                <hr className={styles.hrCard2}/>
           </div>

           {deleteModal && seccionSeleccionada && (
                <ModalManagement onCancelar={cerrarModalEliminar}>
                    <DeleteComponent 
                        {...(type === 'subcategory' 
                            ? { 
                                subcategoryCod: seccionSeleccionada.cod,
                                subcategoryName: seccionSeleccionada.nombre 
                            }
                            : { 
                                categoryCod: seccionSeleccionada.cod,
                                categoryName: seccionSeleccionada.nombre 
                            }
                        )}
                        onSuccess={handleEliminacionExitosa}
                        onCancel={cerrarModalEliminar}
                    />
                </ModalManagement>
            )}

            {updateModal && seccionSeleccionada &&(
                <ModalManagement onCancelar={cerrarModalEditar}>
                    <UpdateComponent 
                        {...(type === 'subcategory' 
                            ? { subcategoryCod: seccionSeleccionada.cod, subcategoryName: seccionSeleccionada.nombre }
                            : { categoryCod: seccionSeleccionada.cod, categoryName: seccionSeleccionada.nombre }
                        )}
                        onSubmit={handleActualizacionExitosa}
                        onCancel={cerrarModalEditar}
                    />
                </ModalManagement>
            )}

            <AccordionForm 
                isOpen={isAccordionOpen}
                onToggle={() => setIsAccordionOpen(!isAccordionOpen)}
                triggerText={triggerText}
                openTriggerText="▲ Ocultar Formulario" 
                closedTriggerText="▼ Mostrar Formulario"
            >
                <NewComponent 
                    onSubmit={handleCreacionExitosa}
                    onCancel={() => setIsAccordionOpen(false)}
                />
            </AccordionForm>
        </div>
    );
}