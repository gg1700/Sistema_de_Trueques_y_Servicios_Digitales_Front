'use client';
import styles from './FileInput.module.css';
import { useState, useRef, useEffect } from 'react';

interface FileInputProps {
  name: string;
  onChange: (file: File | null) => void;
  accept?: string;
  initialImage?: string | null;
  disabled?: boolean;
  error?: boolean;
}

export default function FileInput({
  name,
  onChange,
  accept = 'image/*',
  disabled = false,
  initialImage = null,
  error = false,
}: FileInputProps) {
  const [preview, setPreview] = useState<string | null>(initialImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialImage) {
      setPreview(initialImage);
    }
  }, [initialImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(initialImage);
    }

    onChange(file);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
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
    <div
      className={`${styles.fileInputContainer} ${
        error ? styles.fileInputError : ''
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className={styles.hiddenInput}
      />

      <div className={styles.wrapper} onClick={handleClick}>
        {preview ? (
          <div className={styles.previewContainer}>
            <div className={styles.squarePreview}>
              <img src={preview} alt="Preview" className={styles.previewImage} />
            </div>

            <button
              type="button"
              className={styles.removeButton}
              onClick={handleRemove}
            >
              ×
            </button>
          </div>
        ) : (
          <div className={styles.uploadContainer}>
            <div className={styles.squarePlaceholder}>
              <span className={styles.iconPlaceholder} />
            </div>

            <div className={styles.infoContainer}>
              <p className={styles.helperText}>
                Please upload square image, size less than 100KB
              </p>

              <button type="button" className={styles.chooseFileButton}>
                Choose File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
