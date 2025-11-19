"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import styles from "./newToken.module.css";
import AdminLayout from "@/Components/Templates/AdminLayout/AdminLayout";
import { createTokenPackage } from "@/services/tokenService";

export default function NewTokenPackagePage() {
  const [form, setForm] = useState({
    nombre: "",
    tokens: "",
    precio_real: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !form.nombre || !form.tokens || !form.precio_real) {
      alert("Por favor completa todos los campos e incluye una imagen.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nombre", form.nombre);
      formData.append("tokens", form.tokens);
      formData.append("precio_real", form.precio_real);
      formData.append("image", file); 

      await createTokenPackage(formData);
      
      alert("Paquete registrado con éxito");
      // Reset form
      setForm({ nombre: "", tokens: "", precio_real: "" });
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error(error);
      alert("Error al registrar el paquete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout 
      pageTitle="Gestión de Tokens" 
      pageSubtitle="Registrar nuevo paquete de tokens"
    >
      <div className={styles.container}>
        <h2 className={styles.title}>Registrar Nuevo Paquete</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          
          <div className={styles.field}>
            <label className={styles.label}>Nombre del Paquete</label>
            <input
              type="text"
              name="nombre"
              className={styles.input}
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej. Paquete Inicial"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Cantidad de Tokens</label>
            <input
              type="number"
              name="tokens"
              className={styles.input}
              value={form.tokens}
              onChange={handleChange}
              placeholder="100"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Precio Real (Bs)</label>
            <input
              type="number"
              step="0.01"
              name="precio_real"
              className={styles.input}
              value={form.precio_real}
              onChange={handleChange}
              placeholder="50.00"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Imagen del Paquete</label>
            <input
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={handleFileChange}
            />
            {preview && <img src={preview} alt="Preview" className={styles.preview} />}
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.btnSubmit} disabled={loading}>
              {loading ? "Guardando..." : "Registrar Paquete"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
