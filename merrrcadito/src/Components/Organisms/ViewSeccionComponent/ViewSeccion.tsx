'use client'
import { useState, useEffect } from 'react';
import {SeccionList, AccordionForm, ModalManagement} from '..';

interface Seccion {
  cod: number;
  nombre: string;
  tipo: string
  descripcion: string;
  imagen: string | null;
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
           <SeccionList
                data={datos}
                onEdit={abrirModalEditar}
                onDelete={abrirModalEliminar}
                type={type}
           ></SeccionList>
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
            >
                <NewComponent 
                    onSubmit={handleCreacionExitosa}
                    onCancel={() => setIsAccordionOpen(false)}
                />
            </AccordionForm>
        </div>
    );
}