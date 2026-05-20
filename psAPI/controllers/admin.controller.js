import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import School from "../models/school.model.js";
import { JWT_SECRET, JWT_REFRESH_SECRET } from "../config/env.js";

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

export const getAdminOverview = async (req, res) => {
  try {
    res.status(200).json({
      message: "Admin API Overview",
      status: "Active",
      admin: req.admin ? req.admin.username : "Unknown",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyAdminHealth = async (req, res) => {
  res.status(200).json({ status: "admin module ready" });
};

export const createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "Username and password required" });

    const existing = await Admin.findOne({ username });
    if (existing)
      return res.status(409).json({ error: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Admin created", adminId: newAdmin._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const payload = {
      adminId: admin._id,
      username: admin.username,
      role: admin.role,
    };

    const { accessToken, refreshToken } = generateTokens(payload);

    res.cookie("token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    res.json({ accessToken, role: admin.role });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createSchool = async (req, res) => {
  try {
    const { information, derivationKey, auth, initialSubscription } = req.body;

    // Basic validation
    if (!information || !derivationKey || !auth) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingEmail = await School.findOne({ "auth.email": auth.email });
    if (existingEmail) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const existingKey = await School.findOne({ derivationKey });
    if (existingKey) {
      return res.status(409).json({ error: "Derivation key already taken" });
    }

    const hashedPassword = await bcrypt.hash(auth.password, 10);

    let schoolData = {
      information,
      derivationKey,
      auth: {
        email: auth.email,
        password: hashedPassword,
      },
      substatus: false,
      subscriptions: {
         status: "INACTIVE",
         plan: null,
         history: []
      }
    };

    // Handle Initial Subscription
    if (initialSubscription && initialSubscription.active) {
        schoolData.substatus = true;
        schoolData.subscriptions.status = "ACTIVE";
        
        if (initialSubscription.plan) {
             const duration = initialSubscription.plan.duration || "Yearly";
             const durationDays = duration === "Monthly" ? 30 : 365;
             const startDate = new Date();
             const endDate = new Date(startDate);
             endDate.setDate(endDate.getDate() + durationDays);

            const newPlan = {
                 name: initialSubscription.plan.name,
                 price: initialSubscription.plan.price,
                 duration: duration,
                 startingDate: startDate,
                 endingDate: endDate
            };
            
            schoolData.subscriptions.plan = newPlan;
            schoolData.subscriptions.history.push({
                ...newPlan,
                status: "ACTIVE",
                reason: "Initial Subscription"
            });
        }
    }

    const newSchool = await School.create(schoolData);

    res.status(201).json({
      message: "School created successfully",
      schoolId: newSchool._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSchools = async (req, res) => {
  try {
    const {
        // Filters
        name,
        type,
        email,
        derivationKey,
        substatus, 
        subscriptionStatus,
        planName,
        planDuration,
        minStudents,
        maxStudents,
        startDate,
        endDate,
        // Sorting
        sortBy = "createdAt",
        sortOrder = "desc"
    } = req.query;

    const query = {};

    // --- Filters ---
    if (name) query["information.name"] = { $regex: name, $options: "i" };
    if (type) query["information.type"] = type;
    if (email) query["auth.email"] = { $regex: email, $options: "i" };
    if (derivationKey) query["derivationKey"] = { $regex: derivationKey, $options: "i" };

    // Boolean checks need conversion from string query params
    if (substatus !== undefined) {
        query["substatus"] = substatus === 'true';
    }

    if (subscriptionStatus) {
        query["subscriptions.status"] = subscriptionStatus;
    }

    if (planName) query["subscriptions.plan.name"] = planName;
    if (planDuration) query["subscriptions.plan.duration"] = planDuration;

    // Range queries
    if (minStudents || maxStudents) {
        query["information.max_students"] = {};
        if (minStudents) query["information.max_students"].$gte = Number(minStudents);
        if (maxStudents) query["information.max_students"].$lte = Number(maxStudents);
    }

    if (startDate || endDate) {
        query["createdAt"] = {};
        if (startDate) query["createdAt"].$gte = new Date(startDate);
        if (endDate) query["createdAt"].$lte = new Date(endDate);
    }

    // --- Sorting ---
    const sort = {};
    const order = sortOrder === "asc" ? 1 : -1;
    
    // Map friendly sort keys to db fields if needed, or use direct paths
    const sortFields = {
        name: "information.name",
        type: "information.type",
        createdAt: "createdAt",
        max_students: "information.max_students",
        status: "subscriptions.status",
        price: "subscriptions.plan.price"
    };

    const sortField = sortFields[sortBy] || sortBy;
    sort[sortField] = order;

    const schools = await School.find(query)
        .sort(sort)
        .select(
            "information.name information.type information.location information.max_students derivationKey auth.email createdAt substatus subscriptions"
        );
        
    res.status(200).json(schools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSchoolById = async (req, res) => {
  try {
    const { id } = req.params;
    const school = await School.findById(id);

    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    res.status(200).json(school);
  } catch (error) {
    console.error("Error fetching school by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const updateMaxStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const { max_students } = req.body;

    if (max_students === undefined || typeof max_students !== "number") {
      return res.status(400).json({ error: "max_students must be a number" });
    }

    const school = await School.findById(id);
    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    school.information.max_students = max_students;
    await school.save();

    res.status(200).json({
      message: "Max students updated",
      max_students: school.information.max_students,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { substatus, plan, status } = req.body;

    const school = await School.findById(id);
    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    // Toggle substatus
    if (typeof substatus === "boolean") {
      school.substatus = substatus;
    }

    // Update subscription status
    if (status && ["ACTIVE", "INACTIVE", "HOLD", "DELETION"].includes(status)) {
      school.subscriptions.status = status;
    }

    // Handle plan updates and history
    const { reason } = req.body;

    if (substatus === false) {
      // Toggling off: Push current plan to history (if exists) and nullify plan
      if (school.subscriptions.plan) {
        // Attach reason to the plan being archived
        const archivedPlan = { ...school.subscriptions.plan.toObject(), reason: reason || "Deactivated" };
        if (!archivedPlan.endingDate) {
            archivedPlan.endingDate = new Date(); // Mark end date if not set
        }
        // Save the status that this plan ended with (the current new status of the subscription)
        archivedPlan.status = status || "INACTIVE"; 
        school.subscriptions.history.push(archivedPlan);
        school.subscriptions.plan = null;
      }
    } else if (substatus === true && plan) {
      // Toggling on (or updating active): Push old plan to history if it exists
      if (school.subscriptions.plan) {
         // Archive the OLD plan
         const archivedPlan = { ...school.subscriptions.plan.toObject() };
         if (reason) archivedPlan.reason = reason; // Reason for changing plan?
         if (!archivedPlan.endingDate) {
             archivedPlan.endingDate = new Date(); // Mark end date as now since we are replacing it
         }
         archivedPlan.status = "ENDED"; // Ended naturally or replaced
         school.subscriptions.history.push(archivedPlan);
      }
      school.subscriptions.plan = plan;
      // If activation has a reason (e.g. "Payment received"), we could store it on the active plan too?
      if (reason) school.subscriptions.plan.reason = reason;
      
      // Push the NEW activation to history as well (Start Record)
      const newHistoryEntry = { ...plan };
      if (reason) newHistoryEntry.reason = reason;
      newHistoryEntry.status = "ACTIVE"; // It is starting now
      school.subscriptions.history.push(newHistoryEntry);
    }

    await school.save();

    res.status(200).json({
      message: "Subscription updated",
      school: school,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

