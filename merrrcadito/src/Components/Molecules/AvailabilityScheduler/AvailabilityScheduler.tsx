"use client";

import React, { useState } from "react";
import styles from "./AvailabilityScheduler.module.css";

interface TimeSlot {
    start_time: string;
    end_time: string;
}

interface DaySchedule {
    day_of_week: number;
    slots: TimeSlot[];
}

interface Props {
    value: DaySchedule[];
    onChange: (schedule: DaySchedule[]) => void;
    error?: string;
}

const DAYS = [
    { id: 1, name: "Lunes", short: "L" },
    { id: 2, name: "Martes", short: "M" },
    { id: 3, name: "Miércoles", short: "X" },
    { id: 4, name: "Jueves", short: "J" },
    { id: 5, name: "Viernes", short: "V" },
    { id: 6, name: "Sábado", short: "S" },
    { id: 0, name: "Domingo", short: "D" },
];

export default function AvailabilityScheduler({ value, onChange, error }: Props) {
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const isDaySelected = (dayId: number) => {
        return value.some((d) => d.day_of_week === dayId);
    };

    const toggleDay = (dayId: number) => {
        if (isDaySelected(dayId)) {
            // Remove day
            onChange(value.filter((d) => d.day_of_week !== dayId));
            if (selectedDay === dayId) setSelectedDay(null);
        } else {
            // Add day with default slot
            onChange([
                ...value,
                {
                    day_of_week: dayId,
                    slots: [{ start_time: "09:00", end_time: "17:00" }],
                },
            ]);
        }
    };

    const getDaySchedule = (dayId: number): DaySchedule | undefined => {
        return value.find((d) => d.day_of_week === dayId);
    };

    const addSlot = (dayId: number) => {
        const daySchedule = getDaySchedule(dayId);
        if (!daySchedule) return;

        const newSlots = [
            ...daySchedule.slots,
            { start_time: "09:00", end_time: "17:00" },
        ];

        onChange(
            value.map((d) =>
                d.day_of_week === dayId ? { ...d, slots: newSlots } : d
            )
        );
    };

    const removeSlot = (dayId: number, slotIndex: number) => {
        const daySchedule = getDaySchedule(dayId);
        if (!daySchedule) return;

        const newSlots = daySchedule.slots.filter((_, i) => i !== slotIndex);

        if (newSlots.length === 0) {
            // If no slots left, remove the day
            onChange(value.filter((d) => d.day_of_week !== dayId));
            if (selectedDay === dayId) setSelectedDay(null);
        } else {
            onChange(
                value.map((d) =>
                    d.day_of_week === dayId ? { ...d, slots: newSlots } : d
                )
            );
        }
    };

    const updateSlot = (
        dayId: number,
        slotIndex: number,
        field: "start_time" | "end_time",
        value: string
    ) => {
        const daySchedule = getDaySchedule(dayId);
        if (!daySchedule) return;

        const newSlots = daySchedule.slots.map((slot, i) =>
            i === slotIndex ? { ...slot, [field]: value } : slot
        );

        onChange(
            value.map((d) =>
                d.day_of_week === dayId ? { ...d, slots: newSlots } : d
            )
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.daysRow}>
                {DAYS.map((day) => (
                    <button
                        key={day.id}
                        type="button"
                        className={`${styles.dayChip} ${isDaySelected(day.id) ? styles.dayChipActive : ""
                            }`}
                        onClick={() => toggleDay(day.id)}
                        title={day.name}
                    >
                        {day.short}
                    </button>
                ))}
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.scheduleList}>
                {value.map((daySchedule) => {
                    const dayInfo = DAYS.find((d) => d.id === daySchedule.day_of_week);
                    if (!dayInfo) return null;

                    return (
                        <div key={daySchedule.day_of_week} className={styles.dayCard}>
                            <div className={styles.dayHeader}>
                                <h4>{dayInfo.name}</h4>
                                <button
                                    type="button"
                                    className={styles.addSlotBtn}
                                    onClick={() => addSlot(daySchedule.day_of_week)}
                                >
                                    + Agregar horario
                                </button>
                            </div>

                            <div className={styles.slotsContainer}>
                                {daySchedule.slots.map((slot, index) => (
                                    <div key={index} className={styles.slotRow}>
                                        <input
                                            type="time"
                                            className={styles.timeInput}
                                            value={slot.start_time}
                                            onChange={(e) =>
                                                updateSlot(
                                                    daySchedule.day_of_week,
                                                    index,
                                                    "start_time",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <span className={styles.separator}>-</span>
                                        <input
                                            type="time"
                                            className={styles.timeInput}
                                            value={slot.end_time}
                                            onChange={(e) =>
                                                updateSlot(
                                                    daySchedule.day_of_week,
                                                    index,
                                                    "end_time",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            className={styles.removeSlotBtn}
                                            onClick={() => removeSlot(daySchedule.day_of_week, index)}
                                            aria-label="Eliminar horario"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {value.length === 0 && (
                <div className={styles.emptyState}>
                    Selecciona los días de disponibilidad
                </div>
            )}
        </div>
    );
}
