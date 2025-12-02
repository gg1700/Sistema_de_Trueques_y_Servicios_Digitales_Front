import { useEffect, useState } from 'react';
import DeleteCategory from '../DeleteCategory/deleteCategory';
import UpdateCategory from '../UpdateCategory/updateCateory';
import { CategoryService } from "@/services";
import CreateCategoryModal from "@/Components/Molecules/CreateCategoryModal/CreateCategoryModal";
import UpdateCategoryModal from "@/Components/Molecules/UpdateCategoryModal/UpdateCategoryModal";
import ModalManagement from "@/Components/Organisms/ModalManagement/modalManagement";
import SeccionList from "@/Components/Organisms/SeccionList/SeccionList";
import styles from './viewCategories.module.css';

interface Categoria {
    cod: number
    tipo: string;
    nombre: string;
    descripcion: string;
    imagen: string | null;
}

export default function ViewCategories() {
    const [data, setData] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [seccionSeleccionada, setSeccionSeleccionada] = useState<Categoria | null>(null);
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const API_BASE_URL = process.env.NEXT_PUBLIC_BACK_URL;

    const loadCategories = async () => {
        try {
            setLoading(true);
            const response = await CategoryService.getAllCategory();
            const categorias = response.data;
            const mapCategorias = categorias.map((cat: any) => ({
                cod: cat.cod_cat,
                tipo: cat.tipo_cat || (cat.tipo_cat === 'Producto' ? '1' : '2'),
                nombre: cat.nom_cat,
                descripcion: cat.descr_cat,
                imagen: cat.imagen_repr
            }));
            setData(mapCategorias);
        } catch (error) {
            console.error('Error cargando categorías:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleCreateSuccess = () => {
        loadCategories();
        setShowCreateModal(false);
    };

    const abrirModalEditar = (categoria: Categoria) => {
        setSeccionSeleccionada(categoria);
        setUpdateModal(true);
    };

    const cerrarModalEditar = () => {
        setSeccionSeleccionada(null);
        setUpdateModal(false);
    };

    const abrirModalEliminar = (categoria: Categoria) => {
        setSeccionSeleccionada(categoria);
        setDeleteModal(true);
    };

    const cerrarModalEliminar = () => {
        setSeccionSeleccionada(null);
        setDeleteModal(false);
    };

    const handleActualizacionExitosa = () => {
        loadCategories();
        cerrarModalEditar();
    };

    const handleEliminacionExitosa = () => {
        loadCategories();
        cerrarModalEliminar();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gestión de Categorías</h1>
                    <p className={styles.subtitle}>Administra las categorías del sistema</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className={styles.createButton}
                >
                    + Crear Categoría
                </button>
            </div>

            {loading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Cargando categorías...</p>
                </div>
            ) : data.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No hay categorías registradas</p>
                    <button onClick={() => setShowCreateModal(true)} className={styles.createButton}>
                        Crear primera categoría
                    </button>
                </div>
            ) : (

                <SeccionList
                    data={data}
                    onEdit={abrirModalEditar}
                    onDelete={abrirModalEliminar}
                    type="category"
                />
            )}

            <CreateCategoryModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleCreateSuccess}
            />

            {seccionSeleccionada && (
                <UpdateCategoryModal
                    isOpen={updateModal}
                    onClose={cerrarModalEditar}
                    onSuccess={handleActualizacionExitosa}
                    categoryCod={seccionSeleccionada.cod}
                    initialData={{
                        seccion: seccionSeleccionada.tipo,
                        nombre: seccionSeleccionada.nombre,
                        descripcion: seccionSeleccionada.descripcion,
                        imagen: `${API_BASE_URL}/categories/${seccionSeleccionada.cod}/image`
                    }}
                />
            )}

            {deleteModal && seccionSeleccionada && (
                <ModalManagement onCancelar={cerrarModalEliminar}>
                    <DeleteCategory
                        categoryCod={seccionSeleccionada.cod}
                        categoryName={seccionSeleccionada.nombre}
                        onSuccess={handleEliminacionExitosa}
                        onCancel={cerrarModalEliminar}
                    />
                </ModalManagement>
            )}
        </div>
    );
}