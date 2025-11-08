'use client'
import Accordion from '@/app/Components/Accordion';
import styles from './reportsAdmin.module.css'
import BarDiagram from '@/app/Components/Diagrams/BarDiagram'

export default function ReportsAdmin() {
    const items=[
        {
         titulo: "Categorias y sus Ventas o Intercambios",
         componente: <BarDiagram />
        },
        
        {
         titulo: "Ventas o Intercambios en Subcategorias dada una Categoria",
         componente: <BarDiagram />
        },

        {
         titulo: "Usuarios Activos e Inactivos",
         componente: <BarDiagram />
        },
    ]
    return (
        <div className={styles.container}> 
            <h1 className={styles.principalTitle}>REPORTES PARA MEJORAR EL MERRRCADITO</h1>

            <div>
                <Accordion items={items} />
            </div>
        </div>
    );
}