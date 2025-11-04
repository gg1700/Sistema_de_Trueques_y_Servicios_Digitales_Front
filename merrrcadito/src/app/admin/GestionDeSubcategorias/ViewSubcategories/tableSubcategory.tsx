'use client'
import { useState } from 'react';
import styles from './tableSubcategory.module.css';
import ModalManagement from '@/app/Components/ModalManagement/modalManagement';
import UpdateSubcategory from '../UpdateSubcategory/updateSubcategory';
import DeleteSubcategory from '../DeleteSubcategory/deleteSubcategory';


interface Subcategoria {
  cod: number;
  nombre: string;
  descripcion: string;
  fechaRegistro: string;
}

export default function ViewSubcategories(){
    const dataSubcategoria=[
        {cod:234,nombre:"Ropa Varon",descripcion:"jijijijajajaja",fechaRegistro:"20/20/20"},
        {cod:201,nombre:"Ropa mujer",descripcion:"vivaOrurococa",fechaRegistro:"21/21/21"},
        {cod:202,nombre:"Ropa mujer",descripcion:"vivaOrurococa",fechaRegistro:"21/21/21"},
        {cod:203,nombre:"Ropa mujer",descripcion:"vivaOrurococa",fechaRegistro:"21/21/21"},
        {cod:220,nombre:"Ropa mujer",descripcion:"vivaOrurococa",fechaRegistro:"21/21/21"},
        {cod:210,nombre:"Ropa mujer",descripcion:"vivaOrurococa",fechaRegistro:"21/21/21"},
    ];

    const [deleteModal, setDeleteModal]=useState(false);
    const [updateModal, setUpdateModal]=useState(false);
    const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState<Subcategoria | null>(null);
    const [data,setData]= useState(dataSubcategoria);

    function abrirModalEliminar(subcategoria:Subcategoria) {
        setSubcategoriaSeleccionada(subcategoria);
        setDeleteModal(true);
    }

    function cerrarModalEliminar() {
        setSubcategoriaSeleccionada(null);
        setDeleteModal(false);
    }

     function abrirModalEditar(subcategoria:Subcategoria) {
        setSubcategoriaSeleccionada(subcategoria);
        setUpdateModal(true);
    }

    function cerrarModalEditar() {
        setSubcategoriaSeleccionada(null);
        setUpdateModal(false);
    }

    const handleEliminacionExitosa = () => {
        if (subcategoriaSeleccionada) {
            setData(prev => prev.filter(item => item.cod !== subcategoriaSeleccionada.cod));
        }
        cerrarModalEliminar();
    };

    const handleActualizacionExistosa = () => {
        cerrarModalEditar();
    }

    return(
        <div>
           <div>
               <hr className={styles.hrCard}/>
           </div>
           <div className={styles.mainContainer}>
             <div className={styles.subcategoryContainer}>
                   {data.map(subcategory => 
                        <div key={subcategory.cod} className={styles.subcategoryCard}>
                            <div className={styles.cardContent}>
                                <div className={styles.textContent}>
                                    <h3 className={styles.subcategoryName}>{subcategory.nombre}</h3>
                                    <p className={styles.subcategoryDescription}>{subcategory.descripcion}</p>
                                </div>
                                <div className={styles.acciones}>
                                    <button className={styles.btnAccion} onClick={() => abrirModalEditar(subcategory)}>
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button className={styles.btnAccion} onClick={() => abrirModalEliminar(subcategory)}>
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

           {deleteModal && subcategoriaSeleccionada && (
                <ModalManagement  onCancelar={cerrarModalEliminar}>
                    <DeleteSubcategory 
                        subcategoryCod={subcategoriaSeleccionada.cod}
                        subcategoryName={subcategoriaSeleccionada.nombre}
                        onSuccess={handleEliminacionExitosa}
                        onCancel={cerrarModalEliminar}
                    />
                </ModalManagement>
            )}

            {updateModal && subcategoriaSeleccionada &&(
                <ModalManagement onCancelar={cerrarModalEditar}>
                    <UpdateSubcategory 
                        subcategoryCod={subcategoriaSeleccionada.cod}
                        onSubmit={handleActualizacionExistosa}
                        onCancel={cerrarModalEditar}
                    />
                </ModalManagement>
            )}
        </div>
    );
}