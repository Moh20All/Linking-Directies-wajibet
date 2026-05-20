import School from "../models/school.model.js";

const checkSubscription = async (req, res, next) => {
  try {
    let schoolId;

    // Determine schoolId based on user role/context
    if (req.school) {
        // Generic auth (likely by derivationKey if not ID, but decoded usually has minimal info)
        // Adjust based on typical payload.
        // If req.school comes from `authenticate` middleware, it might be the decoded token.
        // Let's assume decoded token has schoolId or derivationKey.
        schoolId = req.school.schoolId || req.school.id; 
    } else if (req.student) {
      schoolId = req.student.schoolId;
    } else if (req.teacher) {
      schoolId = req.teacher.schoolId;
    } else if (req.parent) {
      schoolId = req.parent.schoolId;
    } else if (req.staff) {
      schoolId = req.staff.schoolId;
    }

    if (!schoolId) {
      // If we can't identify the school, we can't check subscription.
      // This might happen on routes not properly protected by auth first.
      // Or for roles we missed.
      // For safety, let's log and block, or pass if it's super-admin?
      // Assuming this middleware is ONLY for school-scoped routes.
      console.warn("checkSubscription: No schoolId found in request context.");
      return res.status(403).json({ error: "Context missing for subscription check" });
    }

    const school = await School.findById(schoolId).select("substatus");

    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    if (school.substatus === false) {
      return res.status(403).json({ error: "Subscription Inactive" });
    }

    next();
  } catch (error) {
    console.error("Subscription check failed:", error);
    res.status(500).json({ error: "Internal server error during subscription check" });
  }
};

export default checkSubscription;
