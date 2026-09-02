const nodemailer = require('nodemailer');

// Configure the transporter based on development or production needs
const getTransporter = () => {
    // If SMTP credentials are provided, use them
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    // Default to a development mock transporter if no SMTP config
    return nodemailer.createTransport({
        streamTransport: true,
        newline: 'windows'
    });
};

const sendOtpEmail = async (email, otp) => {
    try {
        const transporter = getTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM || '"AutoLegal" <noreply@autolegal.com>',
            to: email,
            subject: 'Your Registration OTP for AutoLegal',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #2b6cb0; padding: 20px; text-align: center;">
                    <h2 style="color: #ffffff; margin: 0;">AutoLegal Verification</h2>
                </div>
                <div style="padding: 20px; text-align: center;">
                    <p style="font-size: 16px; color: #333;">Hello,</p>
                    <p style="font-size: 16px; color: #333;">Thank you for registering. Please use the following One-Time Password (OTP) to complete your registration process:</p>
                    <div style="margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; background-color: #f7fafc; padding: 10px 20px; border-radius: 4px; letter-spacing: 4px; color: #2d3748;">
                            ${otp}
                        </span>
                    </div>
                    <p style="font-size: 14px; color: #718096; margin-top: 30px;">This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
                </div>
            </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        
        // Log to console if using stream transport (development mode)
        if (transporter.transporter.name === 'StreamTransport') {
            console.log('\n========================================================');
            console.log(`📧  MOCK EMAIL SENT TO: ${email}`);
            console.log(`🔑  OTP CODE: ${otp}`);
            console.log('========================================================\n');
        } else {
            console.log(`✅ Email sent to ${email}: ${info.messageId}`);
        }

        return true;
    } catch (error) {
        console.error('❌ Error sending OTP email:', error);
        throw new Error('Could not send OTP email. Please try again later.');
    }
};

module.exports = {
    sendOtpEmail
};
