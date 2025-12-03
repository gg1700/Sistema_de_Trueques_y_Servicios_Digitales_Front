import { useState } from 'react';
import { CategoryService } from '@/services';
import styles from './UpdateCategory.module.css';
import ProfileInput from "@/Components/Atoms/Input/ProfileInput/ProfileInput";
import FileInput from "@/Components/Templates/ModalsProfile/FileInput";

interface UpdateCategoryProps {
  categoryCod: number;
  initialData: {
    seccion: string;
    nombre: string;
    descripcion: string;
    imagen: string | null;
  };
  onSubmit: () => void;
  onCancel: () => void;
}

export default function UpdateCategory({
  categoryCod,
  initialData,
  onSubmit,
  onCancel
}: UpdateCategoryProps) {

  const [form, setForm] = useState({
    nombre: initialData.nombre,
    descripcion: initialData.descripcion,
    seccion: initialData.seccion,
    imagen: null as File | null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (file: File | null) => {
    setForm(prev => ({
      ...prev,
      imagen: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateData = {
        nom_cat: form.nombre,
        descr_cat: form.descripcion,
        imagen_repr: form.imagen || undefined,
        tipo_cat: form.seccion
      };

      console.log("Actualizando categoría:", updateData);
      await CategoryService.updateCategory(categoryCod, updateData);
      onSubmit();
    } catch (error) {
      console.error("Error actualizando categoría:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.publishForm}>
      <div className={styles.formRow}>
        <div className={styles.formCol}>
          <label className={styles.fieldLabel}>Nombre de Categoría</label>
          <ProfileInput
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej. Tecnología"
            required
          />
        </div>
        <div className={styles.formCol}>
          <label className={styles.fieldLabel}>Tipo</label>
          <select
            name="seccion"
            value={form.seccion}
            onChange={handleChange}
            className={styles.selectInput}
            required
          >
            <option value="">Seleccionar</option>
            <option value="Producto">Producto</option>
            <option value="Servicio">Servicio</option>
          </select>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formColFull}>
          <label className={styles.fieldLabel}>Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Describe la categoría..."
            required
          />
        </div>
      </div>

      <div className={styles.formRowBottom}>
        <div className={styles.formColImage}>
          <label className={styles.fieldLabel}>
            Imagen (cuadrada, máx. 100KB)
          </label>
          <FileInput name="categoryImage" onChange={handleFileChange} />
        </div>

        <div className={styles.formColButtons}>
          <div className={styles.actionsRowInline}>
            <button type="submit" className={styles.submitButton}>
              Actualizar Categoría
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}