"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import LoginLandingModal from "@/Components/Templates/ModalsRegistration/LoginLandingModal";
import LogInModal from "@/Components/Templates/ModalsRegistration/LogInModal";
import SignInChoiceModal from "@/Components/Templates/ModalsRegistration/SignInChoiceModal";
import SignInOrganizationModal from "@/Components/Templates/ModalsRegistration/SignInOrganizationModal";
import SignInUserModal from "@/Components/Templates/ModalsRegistration/SignInUserModal";
import EntrepreneurRegister from "@/Components/Templates/ModalsRegistration/EntrepreneurRegister";

type Step =
  | "landing"
  | "login"
  | "choice"
  | "organization"
  | "user"
  | "entrepreneur";

const USERS_API_BASE =
  process.env.NEXT_PUBLIC_USERS_API_BASE_URL ??
  "http://localhost:5000/api/users";

// Ruta a donde mandas al usuario logueado
const PROFILE_ROUTE_BASE = "/perfil";

const AuthRegistrationFlow: React.FC = () => {
  const [step, setStep] = useState<Step>("landing");
  const [loginError, setLoginError] = useState<string | null>(null);

  const router = useRouter();

  // ---------- LOGIN: comprobar si el usuario está registrado ----------
  const handleLogin = async (data: { username: string; password: string }) => {
    const { username } = data;
    setLoginError(null);

    try {
      const res = await fetch(
        `${USERS_API_BASE}/get_user_data?handle_name=${encodeURIComponent(
          username
        )}`,
        { method: "GET" }
      );

      const json = await res.json().catch(() => ({} as any));

      const userNotFound =
        !res.ok || json.success === false || !json.data || json.data.length === 0;

      if (userNotFound) {
        // Solo mostramos el modal de error, sin lanzar excepciones
        setLoginError("Usuario no registrado o credenciales incorrectas.");
        return;
      }

      // Login “ok” → ir al perfil
      router.push(`${PROFILE_ROUTE_BASE}?handle=${encodeURIComponent(username)}`);
    } catch {
      // Error de red u otro problema → mismo modal genérico
      setLoginError("Ocurrió un problema al iniciar sesión. Inténtalo de nuevo.");
    }
  };

  // ---------- REGISTRO ORGANIZACIÓN (placeholder) ----------
  const handleOrganizationRegister = async (data: {
    legalName: string;
    alias: string;
    type: string;
    cif: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    logo?: File | null;
  }) => {
    console.log("Registro Organización:", data);
    // TODO: llamada real al backend
  };

  // ---------- REGISTRO USUARIO (placeholder) ----------
  const handleUserRegister = async (data: {
    ci: string;
    firstName: string;
    lastNameFather: string;
    lastNameMother: string;
    birth: string;
    sex: "M" | "F" | "";
    email: string;
    phone: string;
    photo?: File | null;
  }) => {
    console.log("Registro Usuario:", data);
    // El registro real lo manejas dentro de SignInUserModal con /api/users/register
  };

  // ---------- RENDER DEL FLUJO ----------
  return (
    <>
      {/* 1) LANDING: Sign In / Log In */}
      <LoginLandingModal
        open={step === "landing"}
        onSignIn={() => setStep("choice")}
        onLogIn={() => {
          setLoginError(null);
          setStep("login");
        }}
        onClose={() => {
          console.log("Cerrar landing de login");
        }}
      />

      {/* 2) MODAL DE LOG IN */}
      <LogInModal
        open={step === "login"}
        onConfirm={handleLogin}
        onCancel={() => {
          setLoginError(null);
          setStep("landing");
        }}
      />

      {/* Modal pequeño para errores de login */}
      {step === "login" && loginError && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setLoginError(null)}
        >
          <div
            style={{
              background: "#1b1024",
              color: "#ffffffff",
              padding: "20px 24px",
              borderRadius: "12px",
              maxWidth: "320px",
              width: "90%",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <span style={{ fontWeight: 600 }}>Error de inicio de sesión</span>
              <button
                type="button"
                onClick={() => setLoginError(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: "18px",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <p
              style={{
                fontSize: "0.9rem",
                marginBottom: "16px",
                color: "#ff9ca1",
              }}
            >
              {loginError}
            </p>

            <button
              type="button"
              onClick={() => setLoginError(null)}
              style={{
                width: "100%",
                padding: "8px 0",
                borderRadius: "999px",
                border: "none",
                background: "#08c9acff",
                color: "#1b1024",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {/* 3) ELEGIR: Organización / Emprendedor-Usuario */}
      <SignInChoiceModal
        open={step === "choice"}
        onOrganization={() => setStep("organization")}
        onUser={() => setStep("user")}
        onClose={() => setStep("landing")}
      />

      {/* 4) REGISTRO DE ORGANIZACIÓN */}
      <SignInOrganizationModal
        open={step === "organization"}
        onCancel={() => setStep("choice")}
        onConfirm={handleOrganizationRegister}
        onPickLocation={() => {
          console.log("Elegir ubicación en mapa");
        }}
      />

      {/* 5) REGISTRO DE USUARIO */}
      <SignInUserModal
        open={step === "user"}
        onCancel={() => setStep("choice")}
        onConfirm={handleUserRegister}
        onGoEntrepreneur={() => setStep("entrepreneur")}
      />

      {/* 6) REGISTRO DE EMPRENDEDOR */}
      {step === "entrepreneur" && (
        <EntrepreneurRegister onBack={() => setStep("user")} />
      )}
    </>
  );
};

export default AuthRegistrationFlow;
