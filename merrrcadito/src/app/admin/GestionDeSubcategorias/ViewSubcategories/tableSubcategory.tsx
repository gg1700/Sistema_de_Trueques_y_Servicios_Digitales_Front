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
        {cod:234,nombre:"Electronicos",descripcion:"jijijijajajaja",fechaRegistro:"20/20/20"},
        {cod:200,nombre:"Textiles",descripcion:"vivaOrurococa",fechaRegistro:"21/21/21"}
    ];

    const [deleteModal, setDeleteModal]=useState(false);
    const [updateModal, setUpdateModal]=useState(false);
    const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState<Subcategoria | null>(null);

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
        setUpdateModal(false);
    }

    const [data,setData]= useState(dataSubcategoria);

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
        <div className={styles.container}>
            {/*Tabla de visualizacion de cada subcategoria*/}
            <table className={styles.table}>
                <thead>
                    <tr className={styles.tableHeader}>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(subcategoria => (
                        <tr key={subcategoria.cod}>
                            <td>{subcategoria.cod}</td>
                            <td>{subcategoria.nombre}</td>
                            <td>
                                <div className={styles.acciones}>
                                    <button className={`${styles.btnAccion} ${styles.btnEditar}`} onClick={()=> abrirModalEditar(subcategoria)}>
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button className={`${styles.btnAccion} ${styles.btnEliminar}`} onClick={() => abrirModalEliminar(subcategoria)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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