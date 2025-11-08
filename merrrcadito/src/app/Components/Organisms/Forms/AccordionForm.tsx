// AccordionForm.tsx - USA esta versión (sin forwardRef):
'use client'
import { ReactNode } from 'react';
import styles from './AccordionForm.module.css';

interface AccordionFormProps {
  children: ReactNode;
  triggerText: string;
  openTriggerText?: string;
  closedTriggerText?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function AccordionForm({ 
  children, 
  triggerText, 
  isOpen,
  onToggle
}: AccordionFormProps) {
  return(
    <div className={styles.accordionContainer}>
      <button 
        className={styles.accordionTrigger}
        onClick={onToggle}
      >
        {triggerText} 
      </button>
      
      {isOpen && (
        <div className={styles.accordionContent}>
          {children}
        </div>
      )}
    </div>
  );
}