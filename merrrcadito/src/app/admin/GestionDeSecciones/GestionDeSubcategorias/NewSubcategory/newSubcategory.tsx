'use client'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CategoryService, SubcategoryService } from '@/services';
import styles from './NewSubcategory.module.css';
import ProfileInput from "@/Components/Atoms/Input/ProfileInput/ProfileInput";
import FileInput from "@/Components/Templates/ModalsProfile/FileInput";

interface NewSubcategoryProps {
  onSubmit?: () => void;
  onCancel?: () => void;
}

export default function NewSubcategory(
  { onSubmit, onCancel }: NewSubcategoryProps
) {
  const router = useRouter();

  const [categories, setCategories] = useState<{ value: string, label: string }[]>([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    seccion: "",
    imagen: null as File | null
  });

  useEffect(() => {
    async function getCategories() {
      const response = await CategoryService.getAllCategory();
      const categorias = response.data;
      const mapCatNom = categorias.map((cat: any) => ({
        value: cat.cod_cat.toString(),
        label: cat.nom_cat
      }));
      setCategories(mapCatNom);
    }
    getCategories();
  }, []);

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
      if (!form.imagen) {
        console.error("La imagen es obligatoria");
        return;
      }
      const subcategoryData = {
        cod_cat: Number(form.seccion),
        nom_subcat_prod: form.nombre,
        descr_subcat_prod: form.descripcion,
        imagen_representativa: form.imagen
      };

      console.log("Creando subcategoría:", subcategoryData);
      await SubcategoryService.registerSubcategory(subcategoryData);
      if (onSubmit) onSubmit();
    } catch (error) {
      console.error('Error creando subcategoría: ', error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.publishForm}>
      <div className={styles.formRow}>
        <div className={styles.formCol}>
          <label className={styles.fieldLabel}>Nombre de Subcategoría</label>
          <ProfileInput
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej. Laptops"
            required
          />
        </div>
        <div className={styles.formCol}>
          <label className={styles.fieldLabel}>Categoría</label>
          <select
            name="seccion"
            value={form.seccion}
            onChange={handleChange}
            className={styles.selectInput}
            required
          >
            <option value="">Seleccionar</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
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
            placeholder="Describe la subcategoría..."
            required
          />
        </div>
      </div>

      <div className={styles.formRowBottom}>
        <div className={styles.formColImage}>
          <label className={styles.fieldLabel}>
            Imagen (cuadrada, máx. 100KB)
          </label>
          <FileInput name="subcategoryImage" onChange={handleFileChange} />
        </div>

        <div className={styles.formColButtons}>
          <div className={styles.actionsRowInline}>
            <button type="submit" className={styles.submitButton}>
              Crear Subcategoría
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