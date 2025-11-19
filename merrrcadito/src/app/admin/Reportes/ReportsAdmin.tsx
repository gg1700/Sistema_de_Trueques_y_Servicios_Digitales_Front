'use client'
import { useEffect, useState } from 'react';
import {AccordionForm} from '@/Components/Organisms';
import BarDiagram from '@/Components/Diagrams/BarDiagram';
import styles from './reportsAdmin.module.css'
import {Reports} from './ReportsAdmins'

export default function ReportsAdmin() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const [dataR1, setDataR2]=useState<any[]>([]);

    const reporteUno=Reports.useCategoryProdsReport("11");
    const safeReporteUno = Array.isArray(reporteUno) ? reporteUno : [];

    const categoriasData = {
        labels: safeReporteUno.map((dato: any) => dato.categoria),
        datasets: [{
            label: 'Compras',
            data: safeReporteUno.map((dato: any) => dato.compras),
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
        }, {
            label: 'Intercambios',
            data: safeReporteUno.map((dato: any) => dato.intercambios),
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
        }]
    };

    const subcategoriasData = {
        labels: ['Smartphones', 'Laptops', 'Tablets', 'Audífonos', 'Smartwatches'],
        datasets: [{
            label: 'Transacciones',
            data: [450, 320, 180, 290, 150],
            backgroundColor: 'rgba(75, 192, 192, 0.8)',
        }]
    };

    const usuariosData = {
        labels: ['Activos', 'Inactivos'],
        datasets: [{
            label: 'Cantidad de Usuarios',
            data: [1250, 320, 45, 178],
            backgroundColor: [
                'rgba(75, 192, 192, 0.8)',   
                'rgba(255, 205, 86, 0.8)',   
            ],
        }]
    };

    const reportConfigs = [
        {
            title: "Categorias de Productos y sus Ventas o Intercambios",
            data: categoriasData,
            chartProps: {
                xAxisKey: "categoria",
                yAxisKey: "ventas",
                color: "#8884d8"
            }
        },
        {
            title: "Ventas o Intercambios en Subcategorias dada una Categoria", 
            data: subcategoriasData,
            chartProps: {
                xAxisKey: "subcategoria",
                yAxisKey: "intercambios", 
                color: "#82ca9d"
            }
        },
        {
            title: "Usuarios Activos e Inactivos",
            data: usuariosData,
            chartProps: {
                xAxisKey: "estado",
                yAxisKey: "cantidad",
                color: "#ffc658"
            }
        }
    ];

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    }

    return (
         <div className={styles.container}>
            <h1 className={styles.principalTitle}>Reportes Administrativos</h1>  
            
            <div className={styles.subtitleSection}>  
                {reportConfigs.map((config, index) => (
                    <div key={index} className={styles.subtitleItem}>  
                        <AccordionForm
                            triggerText={config.title}
                            isOpen={openIndex === index}
                            onToggle={() => handleToggle(index)}
                            variant='FullWidth'
                        >
                            <BarDiagram 
                                data={config.data}
                                title={config.title}
                                {...config.chartProps}
                            />
                        </AccordionForm>
                    </div>
                ))}
            </div>
        </div>
    );
}