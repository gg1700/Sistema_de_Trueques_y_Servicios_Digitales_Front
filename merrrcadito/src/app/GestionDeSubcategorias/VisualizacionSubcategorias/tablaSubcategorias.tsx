'use client'
import { useState } from 'react';
import Link from 'next/link';
import styles from './tablaSubcategoria.module.css'


export default function VisualizarSubcategorias(){
    const dataSubcategoria=[
        {id:234,nombre:"Electronicos",descripcion:"jijijijajajaja",fechaRegistro:"20/20/20"},
        {id:200,nombre:"Textiles",descripcion:"vivaOrurococa",fechaRegistro:"21/21/21"}
    ];

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
                                    <button className={`${styles.btnAccion} ${styles.btnEditar}`}>
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button className={`${styles.btnAccion} ${styles.btnEliminar}`}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
}