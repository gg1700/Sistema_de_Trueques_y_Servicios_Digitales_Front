'use client'
import { ReactNode } from 'react';
import styles from './AccordionForm.module.css';

interface AccordionFormProps {
  children: ReactNode,
  triggerText: string,
  openTriggerText?: string,
  closedTriggerText?: string,
  isOpen: boolean,
  onToggle: () => void,
  variant?: 'deafult' | 'FullWidth'
}

export default function AccordionForm({ 
  children, 
  triggerText, 
  isOpen,
  onToggle,
  variant='deafult'

}: AccordionFormProps) {
  return(
    <div className={`${styles.accordionContainer} ${variant === 'FullWidth' ? styles.FullWidth : ''}`}>
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