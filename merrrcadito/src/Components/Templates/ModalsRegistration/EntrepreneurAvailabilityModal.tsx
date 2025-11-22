"use client";

import React, { useState } from "react";
import styles from "./EntrepreneurAvailabilityModal.module.css";

const DAY_DEFS = [
  { key: "mon", short: "Lun", label: "Lunes" },
  { key: "tue", short: "Mar", label: "Martes" },
  { key: "wed", short: "Mie", label: "Miércoles" },
  { key: "thu", short: "Jue", label: "Jueves" },
  { key: "fri", short: "Vie", label: "Viernes" },
  { key: "sat", short: "Sab", label: "Sábado" },
  { key: "sun", short: "Dom", label: "Domingo" },
] as const;

type DayKey = (typeof DAY_DEFS)[number]["key"];

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const start = i.toString().padStart(2, "0") + ":00";
  const end = ((i + 1) % 24).toString().padStart(2, "0") + ":00";
  return `${start} - ${end}`;
});

export type AvailabilityMap = Record<DayKey, string[]>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (availability: AvailabilityMap) => void;
}

type Step = "days" | "hours";

const EntrepreneurAvailabilityModal: React.FC<Props> = ({
  open,
  onClose,
  onSave,
}) => {
  const [step, setStep] = useState<Step>("days");

  const [selectedDays, setSelectedDays] = useState<Set<DayKey>>(
    () => new Set()
  );
  const [selectedDayForHours, setSelectedDayForHours] = useState<DayKey | "">(
    ""
  );
  const [hoursByDay, setHoursByDay] = useState<Record<DayKey, Set<string>>>(() =>
    DAY_DEFS.reduce(
      (acc, d) => ({ ...acc, [d.key]: new Set<string>() }),
      {} as Record<DayKey, Set<string>>
    )
  );

  if (!open) return null;

  const toggleDay = (day: DayKey) => {
    setSelectedDays((prev) => {
      const copy = new Set(prev);
      if (copy.has(day)) copy.delete(day);
      else copy.add(day);
      return copy;
    });
  };

  const canGoNextFromDays = selectedDays.size > 0;

  const handleNextFromDays = () => {
    if (!canGoNextFromDays) return;
    const firstDay = Array.from(selectedDays)[0];
    setSelectedDayForHours(firstDay);
    setStep("hours");
  };

  const handleBackFromHours = () => {
    setStep("days");
  };

  const toggleHour = (day: DayKey, hour: string) => {
    setHoursByDay((prev) => {
      const copy = { ...prev };
      const set = new Set(copy[day]);
      if (set.has(hour)) set.delete(hour);
      else set.add(hour);
      copy[day] = set;
      return copy;
    });
  };

  const handleSaveHours = () => {
    const availability: AvailabilityMap = {} as AvailabilityMap;
    DAY_DEFS.forEach((d) => {
      if (selectedDays.has(d.key)) {
        availability[d.key] = Array.from(hoursByDay[d.key] ?? []);
      }
    });
    onSave(availability);
  };

  const selectedDayObj =
    step === "hours"
      ? DAY_DEFS.find((d) => d.key === selectedDayForHours) || DAY_DEFS[0]
      : DAY_DEFS[0];

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <div className={styles.headerTitleRow}>
            <span className={styles.headerIcon}>📅</span>
            <div>
              <h2 className={styles.title}>Seleccionar Disponibilidad</h2>
              <p className={styles.subtitle}>
                {step === "days"
                  ? "Días de trabajo de la semana"
                  : `Horas de trabajo para: ${selectedDayObj.label}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <div className={styles.body}>
          {step === "days" && (
            <>
              <p className={styles.helperText}>
                Elige los días que trabajarás cada semana.
              </p>
              <div className={styles.daysRow}>
                {DAY_DEFS.map((day) => {
                  const active = selectedDays.has(day.key);
                  return (
                    <button
                      key={day.key}
                      type="button"
                      className={
                        active
                          ? `${styles.dayChip} ${styles.dayChipActive}`
                          : styles.dayChip
                      }
                      onClick={() => toggleDay(day.key)}
                    >
                      {day.short}
                    </button>
                  );
                })}
              </div>
              <p className={styles.note}>
                *Los días seleccionados (azules) se aplicarán como laborales para
                todas las semanas de cada mes.
              </p>
            </>
          )}

          {step === "hours" && (
            <>
              <p className={styles.helperText}>
                Marca las horas en las que estarás disponible.
              </p>

              <div className={styles.dayTabs}>
                {Array.from(selectedDays).map((key) => {
                  const def = DAY_DEFS.find((d) => d.key === key)!;
                  const active = key === selectedDayForHours;
                  return (
                    <button
                      key={key}
                      type="button"
                      className={
                        active
                          ? `${styles.dayTab} ${styles.dayTabActive}`
                          : styles.dayTab
                      }
                      onClick={() => setSelectedDayForHours(key)}
                    >
                      {def.label}
                    </button>
                  );
                })}
              </div>

              <div className={styles.hoursList}>
                {HOURS.map((h) => {
                  const isSelected =
                    selectedDayForHours &&
                    hoursByDay[selectedDayForHours]?.has(h);

                  return (
                    <button
                      key={h}
                      type="button"
                      className={
                        isSelected
                          ? `${styles.hourItem} ${styles.hourItemActive}`
                          : styles.hourItem
                      }
                      onClick={() =>
                        selectedDayForHours &&
                        toggleHour(selectedDayForHours, h)
                      }
                    >
                      <span>{h}</span>
                      <span className={styles.checkbox}>
                        {isSelected ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className={styles.note}>
                *Las horas seleccionadas (azules) se aplicarán para todos los
                días laborales seleccionados de cada semana.
              </p>
            </>
          )}
        </div>

        <footer className={styles.footer}>
          {step === "days" ? (
            <>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={onClose}
              >
                Volver
              </button>
              <button
                type="button"
                className={styles.primaryButton}
                disabled={!canGoNextFromDays}
                onClick={handleNextFromDays}
              >
                Siguiente
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleBackFromHours}
              >
                Volver
              </button>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleSaveHours}
              >
                Guardar
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
};

export default EntrepreneurAvailabilityModal;
