import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authStaff from "../middlewares/authStaff.middleware.js";
import { authTabAccess } from "../middlewares/authTabAcees.middleware.js";
import { TAB_SECRET } from "../config/env.js";
import School from "../models/school.model.js";
import Asset from "../models/asset.model.js";
import Maintenance from "../models/maintenance.model.js";

const assetsRouter = Router();

// ===================================================================
// Verify password and grant access token
// ===================================================================
assetsRouter.post("/verify-password", authStaff, async (req, res) => {
  try {
    const { password } = req.body;
    const schoolId = req.school.schoolId;

    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    const hashedPassword = school.information.tabspwds.assets;
    if (!hashedPassword) {
      return res
        .status(400)
        .json({ valid: false, error: "Password not set for this tab." });
    }

    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ valid: false, error: "Invalid password" });
    }

    const tabToken = jwt.sign({ tab: "assets", schoolId }, TAB_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("tab_access_token", tabToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ valid: true, message: "Password correct, access granted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ valid: false, error: "Failed to verify password" });
  }
});

// ===================================================================
// Revoke access
// ===================================================================
assetsRouter.post("/revoke-access", authStaff, (req, res) => {
  try {
    res.clearCookie("tab_access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.status(200).json({ message: "Assets tab access revoked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to revoke assets tab access" });
  }
});

// ===================================================================
// Dashboard & Overview
// ===================================================================
assetsRouter.use(authStaff, authTabAccess("assets"));

assetsRouter.get("/overview", async (req, res) => {
  try {
    const { schoolId } = req.school;

    const [assets, maintenanceRecords] = await Promise.all([
      Asset.find({ schoolId }).lean(),
      Maintenance.find({ schoolId }).lean(),
    ]);

    const totalAssets = assets.length;
    const activeAssets = assets.filter((a) => a.status === "active").length;
    const totalValue = assets.reduce(
      (sum, a) => sum + (a.currentValue || 0),
      0
    );
    const totalPurchaseValue = assets.reduce(
      (sum, a) => sum + (a.purchasePrice || 0),
      0
    );

    const overdueMaintenance = maintenanceRecords.filter((record) => {
      const now = new Date();
      return (
        record.status !== "completed" &&
        record.scheduledDate &&
        new Date(record.scheduledDate) < now
      );
    }).length;

    const conditionStats = assets.reduce((acc, a) => {
      acc[a.condition] = (acc[a.condition] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalAssets,
        activeAssets,
        totalValue,
        depreciation: totalPurchaseValue - totalValue,
        assetsNeedingMaintenance: overdueMaintenance,
        conditionStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch overview data",
      error: error.message,
    });
  }
});

// ===================================================================
// Asset CRUD
// ===================================================================
assetsRouter.get("/", async (req, res) => {
  try {
    const assets = await Asset.find({ schoolId: req.school.schoolId });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch assets" });
  }
});

assetsRouter.post("/", async (req, res) => {
  const { schoolId, _id } = req.school;

  try {
    if (!schoolId || !_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      name,
      category,
      location,
      condition = "excellent",
      status = "active",
      serialNumber,
      purchaseDate,
      purchasePrice,
      description,
      ownership = "school-owned",
    } = req.body;

    if (!name || !category || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newAsset = new Asset({
      name,
      category,
      location,
      condition,
      status,
      serialNumber,
      purchaseDate,
      purchasePrice,
      description,
      ownership,
      schoolId,
      addedBy: _id,
      addedDate: new Date(),
    });

    await newAsset.save();

    res.status(201).json({
      success: true,
      message: "Asset created successfully",
      data: newAsset,
    });
  } catch (error) {
    console.error("Error creating asset:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create asset",
      details: error.message,
    });
  }
});

assetsRouter.put("/:id", async (req, res) => {
  try {
    const updatedAsset = await Asset.findOneAndUpdate(
      { _id: req.params.id, schoolId: req.school.schoolId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAsset) {
      return res.status(404).json({ error: "Asset not found" });
    }
    res.json(updatedAsset);
  } catch (error) {
    res.status(400).json({ error: "Failed to update asset" });
  }
});

assetsRouter.delete("/:id", async (req, res) => {
  try {
    const deletedAsset = await Asset.findOneAndDelete({
      _id: req.params.id,
      schoolId: req.school.schoolId,
    });
    if (!deletedAsset) {
      return res.status(404).json({ error: "Asset not found" });
    }
    await Maintenance.deleteMany({ assetId: req.params.id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete asset" });
  }
});

// ===================================================================
// Maintenance CRUD
// ===================================================================
assetsRouter.get("/maintenance", async (req, res) => {
  try {
    const records = await Maintenance.find({
      schoolId: req.school.schoolId,
    })
      .populate("assetId", "name category location status")
      .sort({ scheduledDate: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch maintenance records" });
  }
});

assetsRouter.post("/maintenance", async (req, res) => {
  try {
    const { assetId, description, type, priority, scheduledDate } = req.body;

    if (!assetId) {
      return res.status(400).json({ error: "Asset ID is required" });
    }

    // Ensure asset belongs to this school
    const asset = await Asset.findOne({
      _id: assetId,
      schoolId: req.school.schoolId,
    });
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    const newRecord = new Maintenance({
      assetId: assetId,
      schoolId: req.school.schoolId,
      description,
      priority: priority,
      type: type,
      scheduledDate: scheduledDate || new Date().toISOString(),
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to create maintenance record", error });
  }
});

assetsRouter.put("/maintenance/:id", async (req, res) => {
  try {
    const updatedRecord = await Maintenance.findOneAndUpdate(
      { _id: req.params.id, schoolId: req.school.schoolId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRecord) {
      return res.status(404).json({ error: "Maintenance record not found" });
    }
    res.json(updatedRecord);
  } catch (error) {
    res.status(400).json({ error: "Failed to update maintenance record" });
  }
});

assetsRouter.delete("/maintenance/:id", async (req, res) => {
  try {
    const deletedRecord = await Maintenance.findOneAndDelete({
      _id: req.params.id,
      schoolId: req.school.schoolId,
    });
    if (!deletedRecord) {
      return res.status(404).json({ error: "Maintenance record not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete maintenance record" });
  }
});

export default assetsRouter;
