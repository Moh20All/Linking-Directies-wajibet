import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";
import School from "../models/school.model.js";
import checkSubscription from "../middlewares/checkSubscription.middleware.js";

const TEST_SCHOOL_ID = "683e00529f8290827ff200ae"; // Dev School

const mockRes = () => {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.body = data;
    return res;
  };
  return res;
};

const runVerification = async () => {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(DB_URI);
    console.log("Connected.");

    // 1. Ensure School exists
    const school = await School.findById(TEST_SCHOOL_ID);
    if (!school) {
        console.error("Test school not found!");
        process.exit(1);
    }
    console.log(`Found school: ${school.name}, substatus: ${school.substatus}`);

    // Store original status
    const originalSubStatus = school.substatus;

    // --- TEST CASE 1: Active Subscription ---
    console.log("\n--- TEST CASE 1: substatus = true ---");
    school.substatus = true;
    await school.save();

    const reqActive = { school: { schoolId: TEST_SCHOOL_ID } };
    const resActive = mockRes();
    const nextActive = () => console.log("✅ next() called correctly for active school.");

    await checkSubscription(reqActive, resActive, nextActive);
    
    if (resActive.statusCode) {
        console.error("❌ Failed: checkSubscription blocked active school with status", resActive.statusCode);
    }

    // --- TEST CASE 2: Inactive Subscription ---
    console.log("\n--- TEST CASE 2: substatus = false ---");
    school.substatus = false;
    await school.save();

    const reqInactive = { school: { schoolId: TEST_SCHOOL_ID } };
    const resInactive = mockRes();
    const nextInactive = () => console.error("❌ Failed: next() called for inactive school!");

    await checkSubscription(reqInactive, resInactive, nextInactive);

    if (resInactive.statusCode === 403 && resInactive.body.error === "Subscription Inactive") {
        console.log("✅ Blocked correctly with 403 and error message.");
    } else {
        console.error("❌ Failed: Did not block inactive school correctly. Status:", resInactive.statusCode);
    }

    // --- CLEANUP ---
    console.log("\nRestoring original status...");
    school.substatus = originalSubStatus;
    await school.save();
    console.log("Done.");

    process.exit(0);

  } catch (err) {
    console.error("Verification failed:", err);
    process.exit(1);
  }
};

runVerification();
