import styles from './FileInput.module.css';
import { useState, useRef } from 'react';

interface FileInputProps {
  name: string;
  onChange: (file: File | null) => void;
  accept?: string;
  disabled?: boolean;
  error?: boolean;
}

export default function FileInput({
  name,
  onChange,
  accept = "image/*",
  disabled = false,
  error = false
}: FileInputProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    
    onChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`${styles.fileInputContainer} ${error ? styles.fileInputError : ''}`}>
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className={styles.hiddenInput}
      />
      
      <div 
        className={styles.fileInputArea}
        onClick={handleClick}
      >
        {preview ? (
          <div className={styles.previewContainer}>
            <img src={preview} alt="Preview" className={styles.previewImage} />
            <button 
              type="button" 
              className={styles.removeButton}
              onClick={handleRemove}
            >
              ×
            </button>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderIcon}>📁</span>
            <span className={styles.placeholderText}>Haz clic para subir imagen</span>
          </div>
        )}
      </div>
    </div>
  );
}