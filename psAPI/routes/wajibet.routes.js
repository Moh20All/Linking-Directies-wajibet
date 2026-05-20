// D1: Exchange Token Route - Directis360 → Wajibet auth handoff
import { Router } from "express";
import jwt from "jsonwebtoken";
import authenticate from "../middlewares/auth.middleware.js";

const wajibetRouter = Router();

const FEDERATED_SECRET = process.env.FEDERATED_SECRET;
const WAJIBET_API_URL = process.env.WAJIBET_API_URL || "http://localhost:5000";

/**
 * GET /api/wajibet/token
 * Generates a short-lived exchange token for the current Directis360 user.
 * This token is presented to Wajibet's /api/auth/federated to establish a session.
 */
wajibetRouter.get("/token", authenticate, async (req, res) => {
    try {
        if (!FEDERATED_SECRET) {
            console.error("[wajibet] FEDERATED_SECRET not configured");
            return res.status(500).json({ error: "Integration not configured" });
        }

        // For teachers: req.school._id = teacher _id, req.school.schoolId = school _id
        // For headmasters: req.school.schoolId = school _id (no separate user _id)
        const isHeadmaster = req.role === "HEADMASTER";
        const directisUserId = isHeadmaster
            ? req.school.schoolId?.toString()
            : (req.school._id?.toString() || req.school.schoolId?.toString());
        const directisSchoolId = req.school.schoolId?.toString();

        const payload = {
            purpose: "directis_wajibet_exchange",
            version: 1,
            directisUserId,
            directisSchoolId,
            role: req.role, // TEACHER, STUDENT, HEADMASTER, etc.
            full_name: req.full_name || null,
            phone_number: req.phone_number || null,
            email: req.school.email || req.school.fullUsername || null,
            national_ID: req.national_ID || null,
        };

        const exchangeToken = jwt.sign(payload, FEDERATED_SECRET, {
            expiresIn: "60s",
        });

        res.json({
            exchangeToken,
            expiresIn: 60,
            wajibetApiUrl: WAJIBET_API_URL,
        });
    } catch (err) {
        console.error("[wajibet] Exchange token error:", err);
        res.status(500).json({ error: "Failed to generate exchange token" });
    }
});

/**
 * GET /api/wajibet/status
 * Check if the integration is configured and available.
 */
wajibetRouter.get("/status", authenticate, async (req, res) => {
    res.json({
        configured: !!FEDERATED_SECRET,
        wajibetApiUrl: WAJIBET_API_URL,
    });
});

export default wajibetRouter;
