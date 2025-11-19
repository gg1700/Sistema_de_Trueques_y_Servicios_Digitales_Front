"use client";

import { useId, useState } from "react";
import styles from "./LogInModal.module.css";
import ButtonCancel from "@/Components/Atoms/Buttons/ButtonCancel/ButtonCancel";
import Label from "@/Components/Atoms/Label/Label";

interface Props {
  open: boolean;
  onConfirm: (data: { username: string; password: string }) => void | Promise<void>;
  onCancel?: () => void;
}

export default function LogInModal({ open, onConfirm, onCancel }: Props) {
  const uId = useId();
  const pId = useId();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (!open) return null;

  return (
    <div className={styles.screen}>
      <form
        className={styles.card}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          onConfirm({ username, password });
        }}
        aria-label="Log In"
      >
        <div className={styles.field}>
          <Label htmlFor={uId}>Usuario</Label>
          <input
            id={uId}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <Label htmlFor={pId}>Contraseña</Label>
          <input
            id={pId}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
