'use client'
import { useState, useEffect } from 'react';
import DeleteSubcategory from '../DeleteSubcategory/deleteSubcategory';
import UpdateSubcategory from '../UpdateSubcategory/updateSubcategory';
import { SubcategoryService } from "@/services";
import CreateSubcategoryModal from "@/Components/Molecules/CreateSubcategoryModal/CreateSubcategoryModal";
import UpdateSubcategoryModal from "@/Components/Molecules/UpdateSubcategoryModal/UpdateSubcategoryModal";
import ModalManagement from "@/Components/Organisms/ModalManagement/modalManagement";
import SeccionList from "@/Components/Organisms/SeccionList/SeccionList";
import styles from './ViewSubcategories.module.css';

interface Subcategoria {
  cod: number
  tipo: string;
  nombre: string;
  descripcion: string;
  imagen: string | null;
}

export default function ViewSubcategories() {
  const [data, setData] = useState<Subcategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState<Subcategoria | null>(null);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACK_URL;

  const loadSubcategories = async () => {
    try {
      setLoading(true);
      const response = await SubcategoryService.getAllSubcategories();
      const subcategorias = response.data;
      const mapSubcategorias = subcategorias.map((sub: any) => ({
        cod: sub.cod_subcat_prod,
        tipo: 'Subcategoría', // Assuming type is generic or derived
        nombre: sub.nom_subcat_prod,
        descripcion: sub.descr_subcat_prod,
        imagen: sub.imagen_representativa
      }));
      setData(mapSubcategorias);
    } catch (error) {
      console.error('Error cargando subcategorías:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubcategories();
  }, []);

  const handleCreateSuccess = () => {
    loadSubcategories();
    setShowCreateModal(false);
  };

  const abrirModalEditar = (subcategoria: Subcategoria) => {
    setSeccionSeleccionada(subcategoria);
    setUpdateModal(true);
  };

  const cerrarModalEditar = () => {
    setSeccionSeleccionada(null);
    setUpdateModal(false);
  };

  const abrirModalEliminar = (subcategoria: Subcategoria) => {
    setSeccionSeleccionada(subcategoria);
    setDeleteModal(true);
  };

  const cerrarModalEliminar = () => {
    setSeccionSeleccionada(null);
    setDeleteModal(false);
  };

  const handleActualizacionExitosa = () => {
    loadSubcategories();
    cerrarModalEditar();
  };

  const handleEliminacionExitosa = () => {
    loadSubcategories();
    cerrarModalEliminar();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Subcategorías</h1>
          <p className={styles.subtitle}>Administra las subcategorías del sistema</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className={styles.createButton}
        >
          + Crear Subcategoría
        </button>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Cargando subcategorías...</p>
        </div>
      ) : data.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No hay subcategorías registradas</p>
          <button onClick={() => setShowCreateModal(true)} className={styles.createButton}>
            Crear primera subcategoría
          </button>
        </div>

      ) : (
        <SeccionList
          data={data}
          onEdit={abrirModalEditar}
          onDelete={abrirModalEliminar}
          type="subcategory"
        />
      )}

      <CreateSubcategoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      {seccionSeleccionada && (
        <UpdateSubcategoryModal
          isOpen={updateModal}
          onClose={cerrarModalEditar}
          onSuccess={handleActualizacionExitosa}
          subcategoryCod={seccionSeleccionada.cod}
          initialData={{
            seccion: seccionSeleccionada.tipo,
            nombre: seccionSeleccionada.nombre,
            descripcion: seccionSeleccionada.descripcion,
            imagen: `${API_BASE_URL}/subcategories/${seccionSeleccionada.cod}/image`
          }}
        />
      )}

      {deleteModal && seccionSeleccionada && (
        <ModalManagement onCancelar={cerrarModalEliminar}>
          <DeleteSubcategory
            subcategoryCod={seccionSeleccionada.cod}
            subcategoryName={seccionSeleccionada.nombre}
            onSuccess={handleEliminacionExitosa}
            onCancel={cerrarModalEliminar}
          />
        </ModalManagement>
      )}
    </div>
  );
}