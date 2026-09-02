const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const seedLawyers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing lawyers
        await User.deleteMany({ role: 'lawyer' });
        console.log('Cleared existing lawyers');

        // Create sample lawyers
        const lawyersData = [
            {
                name: 'Rajesh Kumar',
                email: 'rajesh.kumar@law.com',
                password: 'password123',
                role: 'lawyer',
                kycStatus: 'verified',
                specialization: ['NDA', 'Contract Law', 'Corporate Law'],
                licenseNumber: 'LIC001',
                rating: 4.8,
                totalReviews: 45,
                isActive: true,
                metadata: {
                    bio: 'Experienced corporate lawyer with 10+ years in contract negotiations',
                    phone: '+91-9876543210',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    country: 'India',
                    experienceYears: 10,
                    responseTime: '2h',
                    pricing: { quick: 500, standard: 1000, premium: 2000 }
                }
            },
            {
                name: 'Priya Singh',
                email: 'priya.singh@law.com',
                password: 'password123',
                role: 'lawyer',
                kycStatus: 'verified',
                specialization: ['IP Law', 'Patent Law', 'Intellectual Property'],
                licenseNumber: 'LIC002',
                rating: 4.9,
                totalReviews: 67,
                isActive: true,
                metadata: {
                    bio: 'Specialist in intellectual property and patent prosecution',
                    phone: '+91-8765432109',
                    city: 'Bangalore',
                    state: 'Karnataka',
                    country: 'India',
                    experienceYears: 12,
                    responseTime: '1h',
                    pricing: { quick: 750, standard: 1500, premium: 3000 }
                }
            },
            {
                name: 'Amit Patel',
                email: 'amit.patel@law.com',
                password: 'password123',
                role: 'lawyer',
                kycStatus: 'verified',
                specialization: ['Real Estate', 'Property Law', 'Land Laws'],
                licenseNumber: 'LIC003',
                rating: 4.7,
                totalReviews: 38,
                isActive: true,
                metadata: {
                    bio: 'Expert in real estate transactions and property disputes',
                    phone: '+91-7654321098',
                    city: 'Pune',
                    state: 'Maharashtra',
                    country: 'India',
                    experienceYears: 8,
                    responseTime: '3h',
                    pricing: { quick: 400, standard: 800, premium: 1800 }
                }
            },
            {
                name: 'Neha Sharma',
                email: 'neha.sharma@law.com',
                password: 'password123',
                role: 'lawyer',
                kycStatus: 'verified',
                specialization: ['Employment Law', 'Labor Law', 'HR Compliance'],
                licenseNumber: 'LIC004',
                rating: 4.6,
                totalReviews: 52,
                isActive: true,
                metadata: {
                    bio: 'Specialized in employment contracts and labor disputes',
                    phone: '+91-6543210987',
                    city: 'Delhi',
                    state: 'Delhi',
                    country: 'India',
                    experienceYears: 9,
                    responseTime: '2h',
                    pricing: { quick: 600, standard: 1200, premium: 2500 }
                }
            },
            {
                name: 'Vikram Desai',
                email: 'vikram.desai@law.com',
                password: 'password123',
                role: 'lawyer',
                kycStatus: 'verified',
                specialization: ['Family Law', 'Divorce', 'Inheritance'],
                licenseNumber: 'LIC005',
                rating: 4.5,
                totalReviews: 41,
                isActive: true,
                metadata: {
                    bio: 'Compassionate advocate for family law matters',
                    phone: '+91-5432109876',
                    city: 'Chennai',
                    state: 'Tamil Nadu',
                    country: 'India',
                    experienceYears: 7,
                    responseTime: '4h',
                    pricing: { quick: 300, standard: 600, premium: 1200 }
                }
            }
        ];

        const createdLawyers = await User.insertMany(lawyersData);
        console.log(`✅ ${createdLawyers.length} lawyers created successfully!`);

        // Display created lawyers
        createdLawyers.forEach(lawyer => {
            console.log(`- ${lawyer.name} (${lawyer.specialization.join(', ')})`);
        });

        await mongoose.disconnect();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding lawyers:', error);
        process.exit(1);
    }
};

seedLawyers();
