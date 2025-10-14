'use client'
import { useState } from 'react';
import Link from 'next/link';
import styles from './tablaSubcategoria.module.css';
import ModalEliminar from '@/app/admin/GestionDeSubcategorias/EliminacionSubcategoria/eliminacionSubcategoria';
import FormSubcategoria from '@/app/admin/GestionDeSubcategorias/NuevaSubcategoria/formularioSubcategoria';

export default function VisualizarSubcategorias(){
    const dataSubcategoria=[
        {id:234,nombre:"Electronicos",descripcion:"jijijijajajaja",fechaRegistro:"20/20/20"},
        {id:200,nombre:"Textiles",descripcion:"vivaOrurococa",fechaRegistro:"21/21/21"}
    ];

    const [modalEliminar, setModalEliminar]=useState(false);
    const [modalEditar, setModalEditar]=useState(false);

    function abrirModalEliminar() {
        setModalEliminar(true);
    }

    function cerrarModalEliminar() {
        setModalEliminar(false);
    }

     function abrirModalEditar() {
        setModalEditar(true);
    }

    function cerrarModalEditar() {
        setModalEditar(false);
    }

    const [data,setData]= useState(dataSubcategoria);
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
                        <tr key={subcategoria.id}>
                            <td>{subcategoria.id}</td>
                            <td>{subcategoria.nombre}</td>
                            <td>
                                <div className={styles.acciones}>
                                    <button className={`${styles.btnAccion} ${styles.btnEditar}`} onClick={()=> abrirModalEditar()}>
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button className={`${styles.btnAccion} ${styles.btnEliminar}`} onClick={() => abrirModalEliminar()}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
           {modalEliminar && (
                <ModalEliminar  onCancelar={cerrarModalEliminar}>
                    <h3 className={styles.modalHeader}>Eliminar Subcategoria Seleccionada</h3>
                    <p>¿Está seguro de eliminar ésta subcategoria?</p>
                    <button className={styles.botonEliminar}>Si, eliminar</button>
                    <button className={styles.botonCancelar} onClick={cerrarModalEliminar}>Cancelar</button>
                </ModalEliminar>
            )}

            {modalEditar && (
                <ModalEliminar onCancelar={cerrarModalEditar}>
                    <FormSubcategoria />
                </ModalEliminar>
            )}
        </div>
    );
}