const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Document = require('../models/Document');
const Review = require('../models/Review');

dotenv.config();

const seedTestData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Find or create a test user
        let testUser = await User.findOne({ email: 'testuser@example.com' });
        if (!testUser) {
            testUser = await User.create({
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123',
                role: 'user',
                kycStatus: 'verified'
            });
            console.log('✅ Test user created');
        } else {
            console.log('✅ Test user already exists');
        }

        // Find first lawyer
        const lawyer = await User.findOne({ role: 'lawyer' });
        if (!lawyer) {
            throw new Error('No lawyers found. Please run seedLawyers.js first');
        }
        console.log(`✅ Using lawyer: ${lawyer.name}`);

        // Create test documents
        const documents = [
            {
                title: 'NDA Agreement',
                template_id: 'nda',
                fields: {
                    party1: 'Company A',
                    party2: 'Company B',
                    duration: '2 years'
                },
                user: testUser._id,
                status: 'draft',
                generatedContent: 'This is a sample NDA agreement document content...'
            },
            {
                title: 'Employment Contract',
                template_id: 'employment',
                fields: {
                    employeeName: 'John Doe',
                    designation: 'Software Engineer',
                    salary: '50000'
                },
                user: testUser._id,
                status: 'draft',
                generatedContent: 'This is a sample employment contract document content...'
            },
            {
                title: 'Service Agreement',
                template_id: 'service',
                fields: {
                    serviceName: 'Consulting Services',
                    duration: '6 months',
                    scope: 'Technical consulting'
                },
                user: testUser._id,
                status: 'draft',
                generatedContent: 'This is a sample service agreement document content...'
            }
        ];

        // Clear existing test documents
        await Document.deleteMany({ user: testUser._id });
        console.log('Cleared existing test documents');

        const createdDocuments = await Document.insertMany(documents);
        console.log(`✅ ${createdDocuments.length} test documents created`);

        // Create review requests
        const reviews = createdDocuments.map(doc => ({
            document: doc._id,
            user: testUser._id,
            lawyer: lawyer._id,
            pricingTier: 'standard',
            price: 1000,
            slaDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            status: 'pending',
            notes: 'Please review this document for legal compliance'
        }));

        // Clear existing reviews
        await Review.deleteMany({ user: testUser._id, lawyer: lawyer._id });
        console.log('Cleared existing test reviews');

        const createdReviews = await Review.insertMany(reviews);
        console.log(`✅ ${createdReviews.length} review requests created`);

        // Update documents with review info
        for (let i = 0; i < createdDocuments.length; i++) {
            await Document.findByIdAndUpdate(createdDocuments[i]._id, {
                status: 'pending',
                assignedLawyer: lawyer._id,
                pricingTier: 'standard',
                price: 1000,
                slaDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            });
        }

        console.log('\n✅ Test data seeded successfully!');
        console.log('\n📝 Login Credentials:');
        console.log(`User Email: ${testUser.email}`);
        console.log(`Password: password123`);
        console.log(`\nLawyer Email: ${lawyer.email}`);
        console.log(`Password: password123`);

        await mongoose.disconnect();
        console.log('\n✅ Database connection closed');
    } catch (error) {
        console.error('Error seeding test data:', error);
        process.exit(1);
    }
};

seedTestData();
