"use client";

import { useId, useRef, useState } from "react";
import styles from "./SignInOrganizationModal.module.css";

import ButtonCancel from "@/Components/Atoms/Buttons/ButtonCancel/ButtonCancel";
import Label from "@/Components/Atoms/Label/Label";
import ButtonIcon from "@/Components/Atoms/Buttons/ButtonIcon/ButtonIcon";

interface Props {
  open: boolean;
  onCancel?: () => void;
  onConfirm: (data: {
    legalName: string;
    alias: string;
    type: string;
    cif: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    logo?: File | null;
  }) => void | Promise<void>;
  onPickLocation?: () => void;
}

export default function SignInOrganizationModal({
  open,
  onCancel,
  onConfirm,
  onPickLocation,
}: Props) {
  const legalId = useId();
  const aliasId = useId();
  const typeId = useId();
  const cifId = useId();
  const emId = useId();
  const phId = useId();
  const addrId = useId();
  const webId = useId();

  const logoRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    legalName: "",
    alias: "",
    type: "",
    cif: "",
    email: "",
    phone: "",
    address: "",
    website: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoName, setLogoName] = useState("vacío");

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
          onConfirm({ ...form, logo: logoFile });
        }}
        aria-label="Registro de Organización"
      >
        <div className={styles.content}>
          <div className={styles.field}>
            <Label htmlFor={legalId}>Nombre Legal</Label>
            <input
              id={legalId}
              value={form.legalName}
              onChange={(e) => set("legalName")(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <Label htmlFor={aliasId}>Alias</Label>
            <input
              id={aliasId}
              value={form.alias}
              onChange={(e) => set("alias")(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <Label htmlFor={typeId}>Tipo</Label>
            <select
              id={typeId}
              value={form.type}
              onChange={(e) => set("type")(e.target.value)}
            >
              <option value="">—</option>
              <option value="ONG">ONG</option>
              <option value="Empresa">Empresa</option>
              <option value="Fundación">Fundación</option>
              <option value="Asociación">Asociación</option>
            </select>
          </div>

          <div className={styles.field}>
            <Label htmlFor={cifId}>CIF</Label>
            <input
              id={cifId}
              value={form.cif}
              onChange={(e) => set("cif")(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <Label htmlFor={emId}>Correo</Label>
            <input
              id={emId}
              type="email"
              value={form.email}
              onChange={(e) => set("email")(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <Label htmlFor={phId}>Teléfono</Label>
            <input
              id={phId}
              value={form.phone}
              onChange={(e) => set("phone")(e.target.value)}
            />
          </div>

          <div className={styles.addressRow}>
            <div className={styles.field} style={{ flex: 1 }}>
              <Label htmlFor={addrId}>Dirección</Label>
              <input
                id={addrId}
                value={form.address}
                onChange={(e) => set("address")(e.target.value)}
              />
            </div>

            <ButtonIcon
              icon="bi-geo-alt"
              type="default"
              name="Elegir en mapa"
              onClick={onPickLocation ?? (() => {})}
            />
          </div>

          <div className={styles.field}>
            <Label htmlFor={webId}>Sitio Web</Label>
            <input
              id={webId}
              value={form.website}
              onChange={(e) => set("website")(e.target.value)}
            />
          </div>

          <div className={styles.uploadBar}>
            <span className={styles.fileLabel}>Logo: {logoName}</span>
            <input
              ref={logoRef}
              type="file"
              accept="image/*"
              className={styles.hidden}
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setLogoFile(f);
                setLogoName(f ? f.name : "vacío");
              }}
            />
            <ButtonIcon
              icon="bi-upload"
              type="default"
              name="Subir Imagen"
              onClick={() => logoRef.current?.click()}
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
