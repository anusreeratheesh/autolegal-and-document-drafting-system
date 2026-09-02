const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const seedAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Admin credentials
        const admins = [
            {
                name: 'System Administrator',
                email: 'admin@autolegal.com',
                password: 'Admin@2024!Secure',
                role: 'admin',
                kycStatus: 'verified',
                isActive: true
            },
            {
                name: 'Super Administrator',
                email: 'superadmin@autolegal.com',
                password: 'SuperAdmin@2024!Secure',
                role: 'admin',
                kycStatus: 'verified',
                isActive: true
            }
        ];

        console.log('\n🔐 Creating admin accounts...\n');

        for (const adminData of admins) {
            // Check if admin already exists
            const existingAdmin = await User.findOne({ email: adminData.email });

            if (existingAdmin) {
                console.log(`⚠️  Admin already exists: ${adminData.email}`);
            } else {
                await User.create(adminData);
                console.log(`✅ Admin created: ${adminData.email}`);
            }
        }

        console.log('\n✅ Admin seeding completed!\n');
        console.log('📝 Admin Login Credentials:\n');
        console.log('Admin 1:');
        console.log(`  Email: admin@autolegal.com`);
        console.log(`  Password: Admin@2024!Secure`);
        console.log('\nAdmin 2:');
        console.log(`  Email: superadmin@autolegal.com`);
        console.log(`  Password: SuperAdmin@2024!Secure`);
        console.log('\n⚠️  IMPORTANT: Change these passwords after first login!\n');

        await mongoose.disconnect();
        console.log('✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error seeding admins:', error);
        process.exit(1);
    }
};

seedAdmins();
