const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const seedPendingLawyers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Pending lawyers for testing
        const pendingLawyers = [
            {
                name: 'Adv. Rahul Kumar',
                email: 'rahul.kumar@lawfirm.com',
                password: 'Lawyer@2024',
                role: 'lawyer',
                kycStatus: 'pending',
                specialization: ['Corporate Law', 'Contract Law', 'M&A'],
                licenseNumber: 'BC/2018/12345',
                metadata: {
                    phone: '+91-9876543220',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    bio: '6 years of experience in corporate law'
                }
            },
            {
                name: 'Adv. Sneha Reddy',
                email: 'sneha.reddy@legalservices.com',
                password: 'Lawyer@2024',
                role: 'lawyer',
                kycStatus: 'pending',
                specialization: ['Family Law', 'Property Law', 'Civil Litigation'],
                licenseNumber: 'BC/2015/67890',
                metadata: {
                    phone: '+91-9876543221',
                    city: 'Bangalore',
                    state: 'Karnataka',
                    bio: '9 years of experience in family and property law'
                }
            },
            {
                name: 'Adv. Arjun Mehta',
                email: 'arjun.mehta@advocates.in',
                password: 'Lawyer@2024',
                role: 'lawyer',
                kycStatus: 'pending',
                specialization: ['IP Law', 'Tech Law', 'Startup Legal'],
                licenseNumber: 'BC/2020/11223',
                metadata: {
                    phone: '+91-9876543222',
                    city: 'Pune',
                    state: 'Maharashtra',
                    bio: '4 years of experience in IP and technology law'
                }
            }
        ];

        console.log('\n🔐 Creating pending lawyer accounts for testing...\n');

        for (const lawyerData of pendingLawyers) {
            // Check if lawyer already exists
            const existingLawyer = await User.findOne({ email: lawyerData.email });

            if (existingLawyer) {
                console.log(`⚠️  Lawyer already exists: ${lawyerData.email}`);
                // Update to pending status if needed
                if (existingLawyer.kycStatus !== 'pending') {
                    existingLawyer.kycStatus = 'pending';
                    await existingLawyer.save();
                    console.log(`   Updated to pending status`);
                }
            } else {
                await User.create(lawyerData);
                console.log(`✅ Pending lawyer created: ${lawyerData.email}`);
            }
        }

        console.log('\n✅ Pending lawyer seeding completed!\n');
        console.log('📝 Test Lawyer Credentials:\n');
        pendingLawyers.forEach((lawyer, i) => {
            console.log(`Lawyer ${i + 1}:`);
            console.log(`  Email: ${lawyer.email}`);
            console.log(`  Password: Lawyer@2024`);
            console.log(`  Status: Pending KYC\n`);
        });

        await mongoose.disconnect();
        console.log('✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error seeding pending lawyers:', error);
        process.exit(1);
    }
};

seedPendingLawyers();
