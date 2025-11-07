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
  openTriggerText,
  closedTriggerText,
  isOpen,
  onToggle
}: AccordionFormProps) {

  const displayText = isOpen 
    ? (openTriggerText || `▲ ${triggerText}`) 
    : (closedTriggerText || `▼ ${triggerText}`);

  return(
    <div className={styles.accordionContainer}>
      <button 
        className={styles.accordionTrigger}
        onClick={onToggle}
      >
        {displayText}
      </button>
      
      {isOpen && (
        <div className={styles.accordionContent}>
          {children}
        </div>
      )}
    </div>
  );
}