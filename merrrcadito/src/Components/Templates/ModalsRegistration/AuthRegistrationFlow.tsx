"use client";

import React, { useState } from "react";

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

const AuthRegistrationFlow: React.FC = () => {
  // 👇 Punto de entrada: como antes, empezamos en el landing
  const [step, setStep] = useState<Step>("landing");

  // ---------- HANDLERS LÓGICOS (aquí irían tus llamadas a API) ----------

  const handleLogin = async (data: { username: string; password: string }) => {
    console.log("Log In:", data);
    // TODO: llamada a tu backend para log in
  };

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
    // TODO: llamada a tu backend
  };

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
    // TODO: llamada a tu backend
  };

  // ----------------------- RENDER DEL FLUJO -----------------------

  return (
    <>
      {/* 1) LANDING: Sign In / Log In */}
      <LoginLandingModal
        open={step === "landing"}
        onSignIn={() => setStep("choice")}   // Ir a elección de tipo de registro
        onLogIn={() => setStep("login")}     // Ir al formulario de Log In
        onClose={() => {
          // Si quieres cerrar y volver a otra página, hazlo aquí
          console.log("Cerrar landing de login");
        }}
      />

      {/* 2) MODAL DE LOG IN */}
      <LogInModal
        open={step === "login"}
        onConfirm={handleLogin}
        onCancel={() => setStep("landing")} // Cancelar → volver al landing
      />

      {/* 3) ELEGIR: Organización / Emprendedor-Usuario */}
      <SignInChoiceModal
        open={step === "choice"}
        onOrganization={() => setStep("organization")}
        onUser={() => setStep("user")}
        onClose={() => setStep("landing")}  // Clic fuera / cerrar → landing
      />

      {/* 4) REGISTRO DE ORGANIZACIÓN */}
      <SignInOrganizationModal
        open={step === "organization"}
        onCancel={() => setStep("choice")}  // Cancelar → volver a la elección
        onConfirm={handleOrganizationRegister}
        onPickLocation={() => {
          console.log("Elegir ubicación en mapa");
        }}
      />

      {/* 5) REGISTRO DE USUARIO (tu SignInUserModal mejorado) */}
      <SignInUserModal
        open={step === "user"}
        onCancel={() => setStep("choice")}  // 👈 Ahora SÍ retrocede a la elección
        onConfirm={handleUserRegister}
        onGoEntrepreneur={() => setStep("entrepreneur")} // link "Iniciar como emprendedor"
      />

      {/* 6) REGISTRO DE EMPRENDEDOR (pantalla completa) */}
      {step === "entrepreneur" && (
        <EntrepreneurRegister
          onBack={() => setStep("user")}    // botón X → vuelve al formulario de usuario
        />
      )}
    </>
  );
};

export default AuthRegistrationFlow;
