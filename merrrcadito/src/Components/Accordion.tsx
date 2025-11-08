'use client'
import { useState } from 'react';
import { ReactNode } from 'react';
import styles from './Accordion.module.css';

interface ReportItems {
    titulo: string,
    componente: ReactNode
}

interface AccordionProps {
    items: ReportItems[];
}

export default function Accordion({ items }: AccordionProps) {
    const [acordeonAbierto, setAcordeonAbierto] = useState<number | null>(null);

    const manejarToggle = (index: number) => {
        setAcordeonAbierto(acordeonAbierto === index ? null : index);
    }

    return (
        <div className={styles.accordionContainer}>
            {items.map((item, index) => (
                <div key={index} className={styles.accordionItem}>
                    <button 
                        onClick={() => manejarToggle(index)}
                        className={styles.accordionHeader}
                    >
                        {item.titulo}
                    </button>
                    {acordeonAbierto === index && (
                        <div>
                            {item.componente}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}