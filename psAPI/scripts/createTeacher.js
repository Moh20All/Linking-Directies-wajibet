/**
 * Quick script to create a teacher account.
 * 
 * Usage:
 *   node scripts/createTeacher.js
 * 
 * It will list your schools and let you pick one,
 * then create a teacher member linked to that school.
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.production.local" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { DB_URI } from "../config/env.js";
import Member from "../models/member.model.js";
import School from "../models/school.model.js";

const TEACHER = {
    username: "teacher1",
    full_name: "Test Teacher",
    phone_number: "+213555000001",
    email: "teacher1@test.com",
    password: "teacher123",   // plain text — will be hashed below
    role: "TEACHER",
};

async function main() {
    await mongoose.connect(DB_URI);
    console.log("Connected to DB");

    // 1. Find schools
    const schools = await School.find({}, "information.name derivationKey _id").lean();
    if (schools.length === 0) {
        console.log("❌ No schools found. Create a school first via /signup.");
        process.exit(1);
    }

    console.log("\n📚 Available schools:");
    schools.forEach((s, i) => {
        console.log(`  [${i}] ${s.information?.name || "Unnamed"} (derivationKey: ${s.derivationKey})`);
    });

    // Use the first school
    const school = schools[0];
    const schoolId = school._id.toString();
    const derivationKey = school.derivationKey;

    console.log(`\n✅ Using school: ${school.information?.name || "Unnamed"} (${derivationKey})`);

    // 2. Build fullUsername = username@derivationKey
    const fullUsername = `${TEACHER.username}@${derivationKey}`;

    // 3. Check if teacher already exists
    const existing = await Member.findOne({ fullUsername });
    if (existing) {
        console.log(`\n⚠️  Teacher "${fullUsername}" already exists!`);
        console.log(`   Login with:`);
        console.log(`     Identifier: ${fullUsername}`);
        console.log(`     Password:   (whatever was set)`);
        process.exit(0);
    }

    // 4. Hash password and create
    const hashedPassword = await bcrypt.hash(TEACHER.password, 10);

    const teacher = await Member.create({
        username: TEACHER.username,
        full_name: TEACHER.full_name,
        phone_number: TEACHER.phone_number,
        email: TEACHER.email,
        fullUsername,
        password: hashedPassword,
        role: TEACHER.role,
        schoolId,
    });

    console.log(`\n🎉 Teacher created successfully!`);
    console.log(`   ─────────────────────────────`);
    console.log(`   Identifier: ${fullUsername}`);
    console.log(`   Password:   ${TEACHER.password}`);
    console.log(`   Role:       ${teacher.role}`);
    console.log(`   School:     ${school.information?.name}`);
    console.log(`   ─────────────────────────────`);
    console.log(`\n   Use these credentials at http://localhost:3000/login`);

    process.exit(0);
}

main().catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
});
