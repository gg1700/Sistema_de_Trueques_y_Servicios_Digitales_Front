"use client";

import { useId, useRef, useState } from "react";
import styles from "./SignInUserModal.module.css";

import ButtonCancel from "@/Components/Atoms/Buttons/ButtonCancel/ButtonCancel";
import Label from "@/Components/Atoms/Label/Label";
import ButtonIcon from "@/Components/Atoms/Buttons/ButtonIcon/ButtonIcon";

type Sex = "M" | "F" | "";

interface Props {
  open: boolean;
  onCancel?: () => void;
  onConfirm: (data: {
    ci: string;
    firstName: string;
    lastNameFather: string;
    lastNameMother: string;
    password: string;
    birth: string;
    sex: Sex;
    email: string;
    phone: string;
    photo?: File | null;
  }) => void | Promise<void>;
}

export default function SignInUserModal({
  open,
  onCancel,
  onConfirm,
}: Props) {
  const ciId = useId();
  const nId = useId();
  const apId = useId();
  const amId = useId();
  const pwId = useId();
  const fnId = useId();
  const sxId = useId();
  const emId = useId();
  const phId = useId();

  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    ci: "",
    firstName: "",
    lastNameFather: "",
    lastNameMother: "",
    password: "",
    birth: "",
    sex: "" as Sex,
    email: "",
    phone: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoName, setPhotoName] = useState("vacío");

  if (!open) return null;

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className={styles.screen}>
      <form
        className={styles.sheet}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          onConfirm({ ...form, photo: photoFile });
        }}
        aria-label="Registro de Usuario"
      >
        <div className={styles.content}>
          <div className={styles.field}>
            <Label htmlFor={ciId}>CI</Label>
            <input id={ciId} value={form.ci} onChange={(e) => set("ci")(e.target.value)} />
          </div>

          <div className={styles.field}>
            <Label htmlFor={nId}>Nombre</Label>
            <input id={nId} value={form.firstName} onChange={(e) => set("firstName")(e.target.value)} />
          </div>

          <div className={styles.field}>
            <Label htmlFor={apId}>Apellido Paterno</Label>
            <input id={apId} value={form.lastNameFather} onChange={(e) => set("lastNameFather")(e.target.value)} />
          </div>

          <div className={styles.field}>
            <Label htmlFor={amId}>Apellido Materno</Label>
            <input id={amId} value={form.lastNameMother} onChange={(e) => set("lastNameMother")(e.target.value)} />
          </div>

          <div className={styles.field}>
            <Label htmlFor={pwId}>Contraseña</Label>
            <input id={pwId} type="password" value={form.password} onChange={(e) => set("password")(e.target.value)} />
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <Label htmlFor={fnId}>Fecha de Nacimiento</Label>
              <input id={fnId} type="date" value={form.birth} onChange={(e) => set("birth")(e.target.value)} />
            </div>

            <div className={styles.field}>
              <Label htmlFor={sxId}>Sexo</Label>
              <select id={sxId} value={form.sex} onChange={(e) => set("sex")(e.target.value)}>
                <option value="">—</option>
                <option value="M">M</option>
                <option value="F">F</option>
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <Label htmlFor={emId}>Correo</Label>
            <input id={emId} type="email" value={form.email} onChange={(e) => set("email")(e.target.value)} />
          </div>

          <div className={styles.field}>
            <Label htmlFor={phId}>Teléfono</Label>
            <input id={phId} value={form.phone} onChange={(e) => set("phone")(e.target.value)} />
          </div>

          <div className={styles.uploadBar}>
            <span className={styles.fileLabel}>Foto: {photoName}</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className={styles.hidden}
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setPhotoFile(f);
                setPhotoName(f ? f.name : "vacío");
              }}
            />
            <ButtonIcon
              icon="bi-upload"
              type="default"
              name="Subir Imagen"
              onClick={() => fileRef.current?.click()}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <ButtonCancel onClick={onCancel} />
          <button type="submit" className={styles.btnConfirm}>
            Confirmar
          </button>
        </div>
      </form>
    </div>
  );
}
