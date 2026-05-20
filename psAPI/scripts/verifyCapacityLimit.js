import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { DB_URI, JWT_SECRET, TAB_SECRET } from "../config/env.js";
import School from "../models/school.model.js";
import { Student } from "../models/student.model.js";
import fetch from "node-fetch"; // You might need to install this or use built-in fetch if node version is >= 18
// Note: Node 18+ has built-in fetch.

const TEST_SCHOOL_ID = "683e00529f8290827ff200ae"; // Dev School
const BASE_URL = "http://localhost:12345/api/staff/pedagogy"; // Adjust port if needed

const runVerification = async () => {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(DB_URI);
    console.log("Connected.");

    const school = await School.findById(TEST_SCHOOL_ID);
    if (!school) throw new Error("School not found");
    
    const originalMax = school.information.max_students;
    const currentCount = await Student.countDocuments({ schoolId: TEST_SCHOOL_ID });
    
    console.log(`Current Count: ${currentCount}, Original Max: ${originalMax}`);

    // Generate Tokens
    const staffToken = jwt.sign({ role: "STAFF", schoolId: TEST_SCHOOL_ID }, JWT_SECRET, { expiresIn: "10m" });
    const tabToken = jwt.sign({ tab: "pedagogy", schoolId: TEST_SCHOOL_ID }, TAB_SECRET, { expiresIn: "10m" });

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${staffToken}`,
      "Cookie": `tab_access_token=${tabToken}`
    };

    // Force active subscription
    school.substatus = true;
    
    // --- TEST 1: Capacity Full ---
    console.log("\n--- TEST 1: Capacity Full ---");
    school.information.max_students = currentCount;
    await school.save();

    const studentData = {
      username: "testcap1",
      password: "password123",
      full_name: "Test Capacity 1",
      phone_number: "0000000001",
      email: "testcap1@example.com",
      nationality: "Test",
      birthDate: "2000-01-01",
      birthCity: "TestCity",
      sex: "MALE"
    };

    const res1 = await fetch(`${BASE_URL}/student`, {
      method: "POST",
      headers,
      body: JSON.stringify(studentData)
    });

    const txt1 = await res1.text();
    if (res1.status === 403) {
      if (txt1.includes("Student capacity reached")) {
        console.log("✅ Correctly blocked by Capacity Limit");
      } else {
        console.warn(`⚠️ Blocked by something else: ${txt1}`);
      }
    } else {
      console.error(`❌ Failed Test 1! Status: ${res1.status}`);
      console.log("Response:", txt1);
    }

    // --- TEST 3: Capacity Available ---
    console.log("\n--- TEST 3: Capacity Available ---");
    school.information.max_students = currentCount + 5;
    await school.save();

    // Change unique fields
    studentData.username = "testcap2";
    studentData.email = "testcap2@example.com";
    studentData.phone_number = "0000000002";

    const res2 = await fetch(`${BASE_URL}/student`, {
      method: "POST",
      headers,
      body: JSON.stringify(studentData)
    });

    const txt2 = await res2.text();
    if (res2.status === 201) {
      console.log("✅ Created successfully (201)");
      
      const json = JSON.parse(txt2);
      await Student.findByIdAndDelete(json.student._id);
      console.log("Cleaned up test student.");
    } else {
      console.error(`❌ Failed Test 3! Status: ${res2.status}`);
      console.log("Response:", txt2);
    }

    // Restore
    school.information.max_students = originalMax;
    await school.save();
    console.log("\nRestored max_students.");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runVerification();
