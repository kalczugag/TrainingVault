import express from "express";
import { PlannedWorkoutModel } from "../../models/PlannedWorkout";
import type { User } from "../../types/User";

type FormatType = "zwo" | "csv";

const flattenSteps = (steps: any[], iterations: number = 1): any[] => {
    let flat: any[] = [];
    for (let i = 0; i < iterations; i++) {
        for (const step of steps) {
            if (step.type === "repeat" && step.steps && step.steps.length > 0) {
                const repeatCount = step.duration?.value || 1;
                flat = flat.concat(flattenSteps(step.steps, repeatCount));
            } else {
                flat.push(step);
            }
        }
    }
    return flat;
};

export const exportPlannedWorkout = async (
    req: express.Request<{ id: string; format: FormatType }>,
    res: express.Response,
) => {
    try {
        const userId = (req.user as User)._id;
        const { id, format } = req.params; // format: 'zwo', 'csv'

        const workout = await PlannedWorkoutModel.findOne({
            _id: id,
            athleteId: userId,
        });
        if (!workout) {
            return res.status(404).json({
                success: false,
                message: "Nie znaleziono planowanego treningu.",
            });
        }

        const safeTitle = workout.title
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase();
        const flatSteps = flattenSteps(workout.structure, 1);

        // --- EKSPORT CSV ---
        if (format.toLowerCase() === "csv") {
            let csvContent = "Order,Type,DurationSec,TargetMin%,TargetMax%\n";
            flatSteps.forEach((step, index) => {
                const dur = step.duration?.value || 0;
                const min = step.target?.min || 0;
                const max = step.target?.max || 0;
                csvContent += `${index + 1},${step.type},${dur},${min},${max}\n`;
            });

            res.setHeader("Content-Type", "text/csv; charset=utf-8");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${safeTitle}_plan.csv"`,
            );
            return res.send(csvContent);
        }

        // --- EKSPORT ZWO (Zwift XML) ---
        if (format.toLowerCase() === "zwo") {
            let xml = `<workout_file>\n`;
            xml += `  <author>Twoja Aplikacja</author>\n`;
            xml += `  <name>${workout.title}</name>\n`;
            xml += `  <description>${workout.description || "Wygenerowano automatycznie."}</description>\n`;
            xml += `  <sportType>${workout.sportType === "cycling" ? "bike" : "run"}</sportType>\n`;
            xml += `  <workout>\n`;

            for (const step of flatSteps) {
                const dur = step.duration?.value || 0;
                const minFTP = (step.target?.min || 0) / 100;
                const maxFTP = (step.target?.max || 0) / 100;

                if (step.type === "warmup") {
                    xml += `    <Warmup Duration="${dur}" PowerLow="${minFTP}" PowerHigh="${maxFTP}" />\n`;
                } else if (step.type === "cooldown") {
                    xml += `    <Cooldown Duration="${dur}" PowerLow="${minFTP}" PowerHigh="${maxFTP}" />\n`;
                } else {
                    if (minFTP !== maxFTP) {
                        xml += `    <Ramp Duration="${dur}" PowerLow="${minFTP}" PowerHigh="${maxFTP}" />\n`;
                    } else {
                        xml += `    <SteadyState Duration="${dur}" Power="${minFTP}" />\n`;
                    }
                }
            }

            xml += `  </workout>\n`;
            xml += `</workout_file>`;

            res.setHeader("Content-Type", "application/xml; charset=utf-8");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${safeTitle}.zwo"`,
            );
            return res.send(xml);
        }

        return res.status(400).json({
            success: false,
            message: "Nieobsługiwany format planu (tylko zwo, csv).",
        });
    } catch (err: any) {
        console.error("[Export Workout Error]:", err);
        return res.status(500).json({
            success: false,
            message: "Błąd podczas eksportu zaplanowanego treningu.",
        });
    }
};
