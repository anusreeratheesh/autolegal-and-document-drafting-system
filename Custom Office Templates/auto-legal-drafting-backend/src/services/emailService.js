const { sendOtpEmail } = require('./otpEmailService');
const nodemailer = require('nodemailer');

// Get transporter (same as in otpEmailService)
const getTransporter = () => {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    // Fallback to mock for development
    console.warn('⚠️ No SMTP credentials configured. Using mock email service.');
    return nodemailer.createTransport({
        streamTransport: true,
        newline: 'windows'
    });
};

// Email Service using Nodemailer
class EmailService {
    constructor() {
        this.transporter = getTransporter();
        this.from = process.env.EMAIL_FROM || 'AutoLegal <noreply@autolegal.com>';
    }

    async sendEmail({ to, subject, html }) {
        try {
            const mailOptions = {
                from: this.from,
                to,
                subject,
                html
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email sent to ${to}: ${info.messageId || 'mock'}`);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('❌ Error sending email:', error);
            return { success: false, error: error.message };
        }
    }

    async sendWelcomeEmail(user) {
        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #2b6cb0; padding: 20px; text-align: center;">
                <h2 style="color: #ffffff; margin: 0;">Welcome to AutoLegal 🎉</h2>
            </div>
            <div style="padding: 20px; text-align: center;">
                <p style="font-size: 16px; color: #333;">Hi ${user.name},</p>
                <p style="font-size: 16px; color: #333;">Thank you for registering with AutoLegal. We're thrilled to have you on board!</p>
                
                <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    ${user.role === 'lawyer' ? `
                        <h3 style="color: #2d3748; margin-top: 0;">Next Steps:</h3>
                        <ul style="text-align: left; color: #666;">
                            <li>Complete your KYC verification</li>
                            <li>View pending document reviews</li>
                            <li>Start earning by reviewing legal documents</li>
                        </ul>
                    ` : `
                        <h3 style="color: #2d3748; margin-top: 0;">What's Next:</h3>
                        <ul style="text-align: left; color: #666;">
                            <li>Create your first legal document</li>
                            <li>Connect with expert lawyers</li>
                            <li>Get your documents reviewed professionally</li>
                        </ul>
                    `}
                </div>

                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/${user.role}/dashboard" 
                   style="background-color: #2b6cb0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; font-weight: bold;">
                    Go to Dashboard
                </a>
            </div>
            <div style="background-color: #f7fafc; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                <p>© 2026 AutoLegal. All rights reserved.</p>
            </div>
        </div>
        `;

        return this.sendEmail({
            to: user.email,
            subject: 'Welcome to AutoLegal!',
            html
        });
    }

    async sendEmailVerificationEmail(user, verificationUrl) {
        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #2b6cb0; padding: 20px; text-align: center;">
                <h2 style="color: #ffffff; margin: 0;">Verify Your Email ✉️</h2>
            </div>
            <div style="padding: 20px; text-align: center;">
                <p style="font-size: 16px; color: #333;">Hi ${user.name},</p>
                <p style="font-size: 16px; color: #333;">Please verify your email address by clicking the button below. This link expires in 24 hours.</p>
                
                <a href="${verificationUrl}" 
                   style="background-color: #2b6cb0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; font-weight: bold;">
                    Verify Email Address
                </a>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                    <p style="font-size: 12px; color: #666;">If you didn't request this email, you can safely ignore it.</p>
                    <p style="font-size: 12px; color: #666;">Or copy and paste this link in your browser:</p>
                    <p style="font-size: 11px; color: #2b6cb0; word-break: break-all;">${verificationUrl}</p>
                </div>
            </div>
            <div style="background-color: #f7fafc; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                <p>© 2026 AutoLegal. All rights reserved.</p>
            </div>
        </div>
        `;

        return this.sendEmail({
            to: user.email,
            subject: 'Verify Your AutoLegal Email',
            html
        });
    }

    async sendReviewRequestEmail(user, lawyer, document, review) {
        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #2b6cb0; padding: 20px; text-align: center;">
                <h2 style="color: #ffffff; margin: 0;">New Review Request 📝</h2>
            </div>
            <div style="padding: 20px;">
                <p style="font-size: 16px; color: #333;">Hi ${lawyer.name},</p>
                <p style="font-size: 16px; color: #333;">You have a new review request!</p>
                
                <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Client:</strong> ${user.name}</p>
                    <p><strong>Document Type:</strong> ${document.template_id}</p>
                    <p><strong>Tier:</strong> <span style="color: #2b6cb0; font-weight: bold;">${review.pricingTier.toUpperCase()}</span></p>
                    <p><strong>Deadline:</strong> ${new Date(review.slaDeadline).toLocaleString()}</p>
                    <p><strong>Amount:</strong> ₹${review.price}</p>
                </div>

                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/lawyer/dashboard" 
                   style="background-color: #2b6cb0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; width: fit-content; font-weight: bold;">
                    View Review Request
                </a>
            </div>
        </div>
        `;

        return this.sendEmail({
            to: lawyer.email,
            subject: `New Review Request - ${document.template_id}`,
            html
        });
    }

    async sendReviewCompletedEmail(user, lawyer, document) {
        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #28a745; padding: 20px; text-align: center;">
                <h2 style="color: #ffffff; margin: 0;">Review Completed ✅</h2>
            </div>
            <div style="padding: 20px;">
                <p style="font-size: 16px; color: #333;">Hi ${user.name},</p>
                <p style="font-size: 16px; color: #333;">Great news! Your document has been reviewed by ${lawyer.name}.</p>
                
                <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Lawyer:</strong> ${lawyer.name}</p>
                    <p><strong>Document Type:</strong> ${document.template_id}</p>
                    <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">COMPLETED</span></p>
                </div>

                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/user/my-documents" 
                   style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; width: fit-content; font-weight: bold;">
                    View Your Document
                </a>
            </div>
        </div>
        `;

        return this.sendEmail({
            to: user.email,
            subject: `Your Document Review is Complete`,
            html
        });
    }

    async sendKycApprovedEmail(email, lawyerName) {
        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center;">
                <h2 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 KYC Verification Approved!</h2>
            </div>
            <div style="padding: 30px;">
                <p style="font-size: 16px; color: #333; margin-bottom: 5px;">Hi ${lawyerName},</p>
                <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Congratulations! Your Bar Council Certificate has been verified successfully.</p>
                
                <div style="background-color: #d4edda; padding: 20px; border-left: 4px solid #28a745; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #155724; margin-top: 0;">✓ Verification Status: APPROVED</h3>
                    <p style="color: #155724; margin-bottom: 0;">You can now access all features of the AutoLegal platform and start accepting document reviews from clients.</p>
                </div>

                <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h4 style="color: #2d3748; margin-top: 0;">What's Next:</h4>
                    <ul style="color: #666; margin-bottom: 0;">
                        <li>Update your profile with specializations</li>
                        <li>Set your review rates</li>
                        <li>Start accepting document reviews</li>
                        <li>Earn money with each review</li>
                    </ul>
                </div>

                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/lawyer/dashboard" 
                   style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 14px 35px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; font-weight: bold; font-size: 16px;">
                    Access Your Dashboard
                </a>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                    <p style="font-size: 13px; color: #666;">If you have any questions, please contact our support team at support@autolegal.com</p>
                </div>
            </div>
            <div style="background-color: #f7fafc; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                <p>© 2026 AutoLegal. All rights reserved.</p>
            </div>
        </div>
        `;

        return this.sendEmail({
            to: email,
            subject: '✅ Your KYC Verification is Approved!',
            html
        });
    }

    async sendKycRejectedEmail(email, lawyerName, reason) {
        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%); padding: 30px; text-align: center;">
                <h2 style="color: #ffffff; margin: 0; font-size: 28px;">KYC Verification Status</h2>
            </div>
            <div style="padding: 30px;">
                <p style="font-size: 16px; color: #333; margin-bottom: 5px;">Hi ${lawyerName},</p>
                <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Thank you for submitting your Bar Council Certificate for verification.</p>
                
                <div style="background-color: #f8d7da; padding: 20px; border-left: 4px solid #dc3545; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #721c24; margin-top: 0;">⚠️ Verification Status: REJECTED</h3>
                    <p style="color: #721c24; margin-bottom: 10px;">Unfortunately, your submission could not be verified at this time.</p>
                    ${reason ? `<p style="color: #721c24; margin-bottom: 0;"><strong>Reason:</strong> ${reason}</p>` : ''}
                </div>

                <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h4 style="color: #2d3748; margin-top: 0;">What Can You Do?</h4>
                    <ul style="color: #666; margin-bottom: 0;">
                        <li>Review the rejection reason carefully</li>
                        <li>Ensure your Bar Council Certificate is valid and clearly visible</li>
                        <li>Make sure all document details match your registration</li>
                        <li>Resubmit your application with updated documents</li>
                    </ul>
                </div>

                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/lawyer/settings/kyc" 
                   style="background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%); color: white; padding: 14px 35px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; font-weight: bold; font-size: 16px;">
                    Resubmit Application
                </a>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                    <p style="font-size: 13px; color: #666;">For further assistance, please contact our support team at support@autolegal.com or call our helpline.</p>
                </div>
            </div>
            <div style="background-color: #f7fafc; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                <p>© 2026 AutoLegal. All rights reserved.</p>
            </div>
        </div>
        `;

        return this.sendEmail({
            to: email,
            subject: '❌ KYC Verification Status Update',
            html
        });
    }
}

// Export factory function
const getEmailService = () => new EmailService();

module.exports = { getEmailService };
