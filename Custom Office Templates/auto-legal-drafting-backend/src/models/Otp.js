const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please add an email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    otp: {
        type: String,
        required: [true, 'Please add an OTP'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600, // The document will be automatically deleted after 10 minutes (600 seconds)
    },
});

module.exports = mongoose.model('Otp', OtpSchema);
