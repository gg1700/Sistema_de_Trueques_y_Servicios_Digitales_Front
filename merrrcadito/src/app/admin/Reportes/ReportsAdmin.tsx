'use client'
import { useState } from 'react';
import {AccordionForm} from '@/Components/Organisms';
import BarDiagram from '@/Components/Diagrams/BarDiagram';
import styles from './reportsAdmin.module.css'

export default function ReportsAdmin() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
        const categoriasData = {
        labels: ['Electrónicos', 'Ropa', 'Hogar', 'Deportes', 'Juguetes', 'Libros'],
        datasets: [{
            label: 'Ventas Totales',
            data: [12500, 8900, 6700, 5400, 3200, 2800],
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
        }, {
            label: 'Intercambios',
            data: [3200, 4500, 2100, 1800, 900, 1200],
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
            title: "Categorias y sus Ventas o Intercambios",
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
        <div>
            {reportConfigs.map((config, index) => (
                <AccordionForm
                    key={index}
                    triggerText={config.title}
                    isOpen={openIndex === index}
                    onToggle={() => handleToggle(index)}
                >
                    <BarDiagram 
                        data={config.data}
                        title={config.title}
                        {...config.chartProps}
                    />
                </AccordionForm>
            ))}
        </div>
    );
}