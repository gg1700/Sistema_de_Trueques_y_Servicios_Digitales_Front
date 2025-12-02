'use client'
import { useState, useEffect } from 'react';
import { CategoryService, SubcategoryService } from '@/services';
import styles from './UpdateSubcategory.module.css';
import ProfileInput from "@/Components/Atoms/Input/ProfileInput/ProfileInput";
import FileInput from "@/Components/Templates/ModalsProfile/FileInput";

interface UpdateSubcategoryProps {
  subcategoryCod: number;
  initialData: {
    seccion: string;
    nombre: string;
    descripcion: string;
    imagen: string | null;
  };
  onSubmit: () => void;
  onCancel: () => void;
}

export default function UpdateSubcategory({
  subcategoryCod,
  initialData,
  onSubmit,
  onCancel
}: UpdateSubcategoryProps) {

  const [categories, setCategories] = useState<{ value: string, label: string }[]>([]);
  const [form, setForm] = useState({
    nombre: initialData.nombre,
    descripcion: initialData.descripcion,
    seccion: initialData.seccion,
    imagen: null as File | null
  });

  useEffect(() => {
    async function getCategories() {
      try {
        const response = await CategoryService.getAllCategory();
        const categorias = response.data;
        const mapCatNom = categorias.map((cat: any) => ({
          value: cat.cod_cat.toString(),
          label: cat.nom_cat
        }));
        setCategories(mapCatNom);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
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
      const updateData = {
        cod_cat: Number(form.seccion),
        nom_subcat_prod: form.nombre,
        descr_subcat_prod: form.descripcion,
        imagen_representativa: form.imagen
      };

      console.log("Actualizando subcategoría:", updateData);
      await SubcategoryService.updateSubcategory(subcategoryCod, updateData);
      onSubmit();
    } catch (error) {
      console.error("Error actualizando subcategoría:", error);
    }
  };

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
              Actualizar Subcategoría
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