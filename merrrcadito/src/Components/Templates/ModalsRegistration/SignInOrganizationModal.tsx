"use client";

import {
  useId,
  useRef,
  useState,
  FormEvent,
  ChangeEvent,
} from "react";
import styles from "./SignInOrganizationModal.module.css";

import ButtonCancel from "@/Components/Atoms/Buttons/ButtonCancel/ButtonCancel";
import Label from "@/Components/Atoms/Label/Label";
import ButtonIcon from "@/Components/Atoms/Buttons/ButtonIcon/ButtonIcon";

const API_BASE =
  process.env.NEXT_PUBLIC_ORGANIZATION_API_BASE_URL ??
  "http://localhost:5000/api/organization";

type OrgType = "" | "con_fines_lucro" | "sin_fines_lucro";

interface OrgForm {
  nom_com_org: string;
  nom_leg_org: string;
  tipo_org: OrgType;
  rubro_org: string;
  cif: string;
  correo_org: string;
  telf_org: string;
  dir_org: string;
  sitio_web: string;
}

type OrgErrors = Partial<Record<keyof OrgForm, string>>;

type PopupType = "error" | "success";

interface PopupState {
  type: PopupType;
  message: string;
}

interface Props {
  open: boolean;
  onCancel?: () => void;
  onConfirm?: (data: OrgForm & { logo?: File | null }) => void | Promise<void>;
  onPickLocation?: () => void;
}

export default function SignInOrganizationModal({
  open,
  onCancel,
  onConfirm,
  onPickLocation,
}: Props) {
  const nomComId = useId();
  const nomLegId = useId();
  const tipoId = useId();
  const rubroId = useId();
  const cifId = useId();
  const emId = useId();
  const phId = useId();
  const addrId = useId();
  const webId = useId();

  const logoRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<OrgForm>({
    nom_com_org: "",
    nom_leg_org: "",
    tipo_org: "",
    rubro_org: "",
    cif: "",
    correo_org: "",
    telf_org: "",
    dir_org: "",
    sitio_web: "",
  });

  const [formErrors, setFormErrors] = useState<OrgErrors>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoName, setLogoName] = useState("vacío");
  const [popup, setPopup] = useState<PopupState | null>(null);

  if (!open) return null;

  const set =
    (k: keyof OrgForm) =>
    (v: string): void =>
      setForm((prev) => ({ ...prev, [k]: v }));

  const validateForm = (): boolean => {
    const errors: OrgErrors = {};

    if (!form.nom_com_org.trim())
      errors.nom_com_org = "El nombre comercial es obligatorio.";

    if (!form.nom_leg_org.trim())
      errors.nom_leg_org = "El nombre legal es obligatorio.";

    if (!form.rubro_org.trim())
      errors.rubro_org = "El rubro es obligatorio.";

    if (!form.cif.trim())
      errors.cif = "El CIF es obligatorio.";

    if (!form.correo_org.trim()) {
      errors.correo_org = "El correo es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(form.correo_org)) {
      errors.correo_org = "El correo no es válido.";
    }

    if (!logoFile) {
      setPopup({
        type: "error",
        message: "El logo de la organización es obligatorio.",
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0 && !!logoFile;
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!logoFile) {
      setPopup({
        type: "error",
        message: "El logo de la organización es obligatorio.",
      });
      return;
    }

    try {
      const formData = new FormData();

      formData.append("nom_com_org", form.nom_com_org);
      formData.append("nom_leg_org", form.nom_leg_org);
      formData.append("tipo_org", form.tipo_org || "sin_fines_lucro");
      formData.append("rubro_org", form.rubro_org);
      formData.append("cif", form.cif);
      formData.append("correo_org", form.correo_org);
      formData.append("telf_org", form.telf_org);
      formData.append("dir_org", form.dir_org);
      formData.append("sitio_web", form.sitio_web || "");
      formData.append("logo_org", logoFile);

      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json().catch(() => ({} as any));

      if (!res.ok || json.success === false) {
        throw new Error(
          json.message || "Error al registrar la organización."
        );
      }

      setPopup({
        type: "success",
        message: "Organización registrada con éxito.",
      });

      if (onConfirm) {
        await onConfirm({ ...form, logo: logoFile });
      }
    } catch (err: any) {
      setPopup({
        type: "error",
        message:
          err?.message ?? "Ocurrió un error al registrar la organización.",
      });
    }
  };

  const closePopup = (): void => {
    if (popup?.type === "success") {
      setForm({
        nom_com_org: "",
        nom_leg_org: "",
        tipo_org: "",
        rubro_org: "",
        cif: "",
        correo_org: "",
        telf_org: "",
        dir_org: "",
        sitio_web: "",
      });
      setFormErrors({});
      setLogoFile(null);
      setLogoName("vacío");
    }
    setPopup(null);
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const f = e.target.files?.[0] ?? null;
    setLogoFile(f);
    setLogoName(f ? f.name : "vacío");
  };

  const inputClass = (fieldError?: string) =>
    fieldError ? `${styles.inputBase} ${styles.inputError}` : styles.inputBase;

  return (
    <>
      {/* aquí ya sin onClick={onCancel} */}
      <div className={styles.screen}>
        <form
          className={styles.sheet}
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit}
          aria-label="Registro de Organización"
        >
          <div className={styles.content}>
            <div className={styles.field}>
              <Label htmlFor={nomComId}>Nombre comercial</Label>
              <input
                id={nomComId}
                className={inputClass(formErrors.nom_com_org)}
                value={form.nom_com_org}
                onChange={(e) => set("nom_com_org")(e.target.value)}
              />
              {formErrors.nom_com_org && (
                <span className={styles.errorText}>
                  {formErrors.nom_com_org}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <Label htmlFor={nomLegId}>Nombre legal</Label>
              <input
                id={nomLegId}
                className={inputClass(formErrors.nom_leg_org)}
                value={form.nom_leg_org}
                onChange={(e) => set("nom_leg_org")(e.target.value)}
              />
              {formErrors.nom_leg_org && (
                <span className={styles.errorText}>
                  {formErrors.nom_leg_org}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <Label htmlFor={tipoId}>Tipo de organización</Label>
              <select
                id={tipoId}
                className={inputClass()}
                value={form.tipo_org}
                onChange={(e) =>
                  set("tipo_org")(e.target.value as OrgType)
                }
              >
                <option value="">—</option>
                <option value="con_fines_lucro">Con fines de lucro</option>
                <option value="sin_fines_lucro">Sin fines de lucro</option>
              </select>
            </div>

            <div className={styles.field}>
              <Label htmlFor={rubroId}>Rubro</Label>
              <input
                id={rubroId}
                className={inputClass(formErrors.rubro_org)}
                value={form.rubro_org}
                onChange={(e) => set("rubro_org")(e.target.value)}
              />
              {formErrors.rubro_org && (
                <span className={styles.errorText}>
                  {formErrors.rubro_org}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <Label htmlFor={cifId}>CIF</Label>
              <input
                id={cifId}
                className={inputClass(formErrors.cif)}
                value={form.cif}
                onChange={(e) => set("cif")(e.target.value)}
              />
              {formErrors.cif && (
                <span className={styles.errorText}>{formErrors.cif}</span>
              )}
            </div>

            <div className={styles.field}>
              <Label htmlFor={emId}>Correo</Label>
              <input
                id={emId}
                type="email"
                className={inputClass(formErrors.correo_org)}
                value={form.correo_org}
                onChange={(e) => set("correo_org")(e.target.value)}
              />
              {formErrors.correo_org && (
                <span className={styles.errorText}>
                  {formErrors.correo_org}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <Label htmlFor={phId}>Teléfono</Label>
              <input
                id={phId}
                className={inputClass(formErrors.telf_org)}
                value={form.telf_org}
                onChange={(e) => set("telf_org")(e.target.value)}
              />
              {formErrors.telf_org && (
                <span className={styles.errorText}>
                  {formErrors.telf_org}
                </span>
              )}
            </div>

            <div className={styles.addressRow}>
              <div className={styles.field} style={{ flex: 1 }}>
                <Label htmlFor={addrId}>Dirección</Label>
                <input
                  id={addrId}
                  className={inputClass(formErrors.dir_org)}
                  value={form.dir_org}
                  onChange={(e) => set("dir_org")(e.target.value)}
                />
                {formErrors.dir_org && (
                  <span className={styles.errorText}>
                    {formErrors.dir_org}
                  </span>
                )}
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
                className={inputClass()}
                value={form.sitio_web}
                onChange={(e) => set("sitio_web")(e.target.value)}
              />
            </div>

            <div className={styles.uploadBar}>
              <span className={styles.fileLabel}>Logo: {logoName}</span>
              <input
                ref={logoRef}
                type="file"
                accept="image/*"
                className={styles.hidden}
                onChange={handleLogoChange}
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

      {popup && (
        <div className={styles.popupScreen} onClick={closePopup}>
          <div
            className={styles.popupCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.popupHeader}>
              <span className={styles.popupTitle}>
                {popup.type === "error" ? "Error" : "Registro completado"}
              </span>
              <button
                type="button"
                className={styles.popupCloseBtn}
                onClick={closePopup}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <p
              className={
                popup.type === "error"
                  ? styles.popupTextError
                  : styles.popupTextSuccess
              }
            >
              {popup.message}
            </p>

            <button className={styles.popupBtn} onClick={closePopup}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
