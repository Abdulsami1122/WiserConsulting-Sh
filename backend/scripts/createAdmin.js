/**
 * Script to create an admin user
 * Usage: node scripts/createAdmin.js
 */

require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Admin credentials
    const name = process.env.ADMIN_NAME || 'admin';
    const email = process.env.ADMIN_EMAIL || 'admin@wiserconsulting.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { name }] 
    });

    if (existingUser) {
      console.log('⚠️  Admin user already exists:');
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Name: ${existingUser.name}`);
      console.log(`   Role: ${existingUser.role === 1 ? 'Admin' : 'User'}`);
      console.log('\n📝 To login, use:');
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Password: (the password you set when creating this user)`);
      console.log('\n💡 If you forgot the password, you can:');
      console.log('   1. Use the /api/create-admin endpoint to create a new admin');
      console.log('   2. Or update the existing user\'s role to admin using the admin panel');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 1 // Admin role
    });

    console.log('✅ Admin user created successfully!');
    console.log('\n📝 Login credentials:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Role: Admin (${admin.role})`);
    console.log('\n🔐 Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.code === 11000) {
      console.error('   User with this email or name already exists');
    }
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createAdmin();
