const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('🔄 Attempting to connect to MongoDB...');
        
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 60000,
            connectTimeoutMS: 30000,
            retryWrites: true,
            w: 'majority',
            maxPoolSize: 10,
            minPoolSize: 2,
            family: 4, // Use IPv4
            serverApi: { version: '1' }
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return true;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.log('\n⚠️  FIX THIS NOW:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('1. Go to: https://cloud.mongodb.com/v2');
        console.log('2. Select cluster: "autulegall"');
        console.log('3. Click: NETWORK ACCESS (left menu)');
        console.log('4. Click: ADD IP ADDRESS (top right)');
        console.log('5. Select: ALLOW ACCESS FROM ANYWHERE');
        console.log('6. Click: CONFIRM');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n✅ After whitelisting, restart the server with: npm start\n');
        return false;
    }
};

module.exports = connectDB;
