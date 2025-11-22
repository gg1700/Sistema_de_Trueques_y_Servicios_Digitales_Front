'use client'
import { useEffect, useState } from 'react';
import {AccordionForm} from '@/Components/Organisms';
import BarDiagram from '@/Components/Diagrams/BarDiagram';
import styles from './reportsAdmin.module.css'
import {Reports} from './ReportsAdmins'
import { useDynamicRouteParams } from 'next/dist/server/app-render/dynamic-rendering';

export default function ReportsAdmin() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const reporteUno = Reports.useCategoryProdsReport("11");
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

    const reporteDos = Reports.useActivityWeek();
    const safeReporteDos = Array.isArray(reporteDos) ? reporteDos : [];

    const usuariosActivityData = {
        labels: safeReporteDos.map((dato:any) => dato.fecha),
        datasets: [{
            label: 'Activos',
            data: safeReporteDos.map((dato:any) => dato.cant_us),
            backgroundColor: 'rgba(75, 192, 192, 0.8)',
        }]
    };

    const reporteTres = Reports.useActionsUsers("11");
    const safeReporteTres = Array.isArray(reporteTres) ? reporteTres : [];
    const usuariosActionsData = {
        labels: ['Productos', 'Servicios', 'Intercambios', 'Potenciadores', 'CV'],
        datasets: [{
            label: 'Compras Productos',
            data: safeReporteTres.map((dato:any) => dato.cant_compras_publicaciones_prod),
            backgroundColor: 
                'rgba(75, 192, 192, 0.8)',     
            },
            {
             label: 'Compras Servicios',
             data: safeReporteTres.map((dato:any) => dato.cant_compras_publicaciones_serv),
             backgroundColor: 
                'rgba(75, 192, 192, 0.8)'
            },
            {
             label: 'Intercambios',
             data: safeReporteTres.map((dato:any) => dato.cant_intercambios),
             backgroundColor: 
                'rgba(75, 192, 192, 0.8)'
            },
            {
             label: 'Compras de Potenciadores',
             data: safeReporteTres.map((dato:any )=> dato.cant_compras_potenciadores),
             backgroundColor: 
                'rgba(75, 192, 192, 0.8)'
            },
            {
             label: 'Compras de CV',
             data: safeReporteTres.map((dato:any) => dato.cant_paquetes_tokens),
             backgroundColor: 
                'rgba(75, 192, 192, 0.8)'
            }
        ]
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
            title: "Usuarios Activos de la Semana", 
            data: usuariosActivityData,
            chartProps: {
                xAxisKey: "subcategoria",
                yAxisKey: "intercambios", 
                color: "#82ca9d"
            }
        },
        {
            title: "Acciones de usuarios en el mes",
            data: usuariosActionsData,
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