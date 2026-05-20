
import mongoose from 'mongoose';
import { Student } from '../models/student.model.js';
import School from '../models/school.model.js';
import dotenv from 'dotenv';
import path from 'path';

// Fix ESM __dirname
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env
dotenv.config({ path: path.join(__dirname, '../.env.production.local') });

async function debugStudentCreation() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.DB_URI);
        console.log('Connected.');

        // Try finding the school with derivation key 24548965212
        const targetKey = '24548965212';
        let school = await School.findOne({ derivationKey: targetKey });

        if (!school) {
            console.log(`School with derivation key ${targetKey} not found. Trying fallback...`);
            school = await School.findOne();
        }

        if (!school) {
            console.error('No school found in database!');
            process.exit(1);
        }
        console.log('Found school:', school.information.name);
        console.log('Derivation Key:', school.derivationKey);
        console.log('School ID:', school._id);

        // Simulated payload (dummy data)
        const payload = {
            username: 'allali',
            password: 'password', // As requested
            full_name: 'mohamed',
            phone_number: '213671222225',
            email: 'allali@gmail.com',
            nationality: 'Algeria',
            birthDate: new Date('2004-12-03'),
            birthCity: 'Biskra',
            sex: 'MALE',
            role: 'STUDENT',
            schoolId: school._id,
            fullUsername: `stallali@${school.derivationKey}`,
            groupHistory: [],
        };

        console.log('Attempting to create student with payload:', payload);

        // Check if duplicate first
        const existing = await Student.findOne({ fullUsername: payload.fullUsername });
        if (existing) {
            console.log('Student ALREADY EXISTS!');
            console.log('Full Username:', existing.fullUsername);
            console.log('Cleaning up existing student to recreate...');
            await Student.deleteOne({ _id: existing._id });
            console.log('Deleted existing student.');
        }

        const student = new Student(payload);

        // Explicitly validate before save
        await student.validate();
        console.log('Validation passed!');

        // Try save
        await student.save();
        console.log('Save passed! Student created with ID:', student._id);

        console.log('\n==========================================');
        console.log('!!! SUCCESS !!!');
        console.log('Confirmed Credentials:');
        console.log('URL: http://localhost:3000/login');
        console.log('Identifier (Email):', payload.fullUsername);
        console.log('Password:', payload.password);
        console.log('==========================================\n');

    } catch (err) {
        console.error('ERROR CAUGHT:');
        if (err.name === 'ValidationError') {
            console.error('Validation Error Details:', JSON.stringify(err.errors, null, 2));
        } else {
            console.error(err);
        }
    } finally {
        await mongoose.disconnect();
    }
}

debugStudentCreation();
