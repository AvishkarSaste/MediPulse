const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medipulse');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create demo users
    const users = [
      {
        email: 'admin@medipulse.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
        profile: {
          phone: '+1-555-0101',
          address: {
            street: '123 Admin St',
            city: 'Admin City',
            state: 'AC',
            zipCode: '12345',
            country: 'USA'
          }
        }
      },
      {
        email: 'doctor@medipulse.com',
        password: 'doctor123',
        name: 'Dr. Sarah Johnson',
        role: 'doctor',
        profile: {
          phone: '+1-555-0102',
          address: {
            street: '456 Doctor Ave',
            city: 'Medical City',
            state: 'MC',
            zipCode: '54321',
            country: 'USA'
          },
          specialization: 'Cardiology'
        }
      },
      {
        email: 'patient@medipulse.com',
        password: 'patient123',
        name: 'John Patient',
        role: 'patient',
        profile: {
          phone: '+1-555-0103',
          address: {
            street: '789 Patient Blvd',
            city: 'Health Town',
            state: 'HT',
            zipCode: '67890',
            country: 'USA'
          },
          dateOfBirth: new Date('1985-06-15'),
          gender: 'male',
          emergencyContact: {
            name: 'Jane Patient',
            phone: '+1-555-0104',
            relationship: 'Spouse'
          }
        }
      }
    ];

    // Hash passwords and create users
    for (const userData of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      
      await user.save();
      console.log(`Created ${userData.role}: ${userData.email}`);
    }

    console.log('Database seeded successfully!');
    console.log('\nDemo credentials:');
    console.log('Admin: admin@medipulse.com / admin123');
    console.log('Doctor: doctor@medipulse.com / doctor123');
    console.log('Patient: patient@medipulse.com / patient123');
    
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedData();
