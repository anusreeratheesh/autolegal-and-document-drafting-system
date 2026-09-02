// KYC Workflow Integration Guide
// Add this to LawyerDashboard.jsx or any lawyer dashboard page

// Step 1: Import the KYC Status Alert component
import KYCStatusAlert from './KYCStatusAlert';

// Step 2: In your component, get the user data from Redux
import { useSelector } from 'react-redux';

function LawyerDashboard() {
    const { user } = useSelector((state) => state.auth);
    
    return (
        <div className="space-y-6">
            {/* Step 3: Add the KYC Status Alert at the top */}
            <KYCStatusAlert 
                kycStatus={user?.kycStatus} 
                email={user?.email}
                name={user?.name}
            />
            
            {/* Step 4: Rest of dashboard content */}
            {/* ... existing dashboard content ... */}
        </div>
    );
}

/*
=====================================
API ENDPOINTS FOR KYC WORKFLOW
=====================================

ADMIN ENDPOINTS:
================

1. GET ALL PENDING LAWYERS
   GET /api/admin/lawyers/pending
   Response: { success: true, count: 5, data: [lawyer1, lawyer2, ...] }

2. APPROVE LAWYER KYC
   POST /api/admin/lawyers/:id/verify
   Body: {} (empty)
   Triggers:
   - kycStatus changes to 'verified'
   - Approval email sent
   - In-app notification created
   Response: { success: true, message: 'Lawyer verified successfully', data: lawyer }

3. REJECT LAWYER KYC
   POST /api/admin/lawyers/:id/reject
   Body: { reason: "Documents not satisfactory" }
   Triggers:
   - kycStatus changes to 'rejected'
   - Rejection email sent with reason
   - In-app notification created
   Response: { success: true, message: 'Lawyer verification rejected', data: lawyer }

LAWYER ENDPOINTS:
=================

1. LOGIN (ENFORCED KYC CHECK)
   POST /api/auth/login
   - If kycStatus = 'pending': Login blocked with message
   - If kycStatus = 'rejected': Login blocked with message
   - If kycStatus = 'verified': Login allowed
   Response includes: { kycStatus: 'verified' }

2. GET MY PROFILE (includes KYC status)
   GET /api/auth/me
   Response: { user: { id, name, email, role, kycStatus, ... } }

NOTIFICATION SERVICE:
=====================

When admin approves:
- In-app notification: "KYC Verification Approved"
- Email: "Your KYC Verification is Approved!" with dashboard link

When admin rejects:
- In-app notification: "KYC Verification Rejected" + reason
- Email: "KYC Verification Status Update" with resubmission link

=====================================
WORKFLOW DIAGRAM
=====================================

LAWYER SIGNUP
    ↓
EMAIL VERIFICATION (via OTP) ✓
    ↓
ACCOUNT CREATED WITH kyStatus = 'pending'
    ↓
CANNOT LOGIN → Shows error message
    ↓
ADMIN REVIEWS CERTIFICATE
    ↓
    ├─→ APPROVED
    │   └─→ kycStatus = 'verified'
    │       └─→ Email sent
    │           └─→ Lawyer can now LOGIN ✓
    │
    └─→ REJECTED
        └─→ kycStatus = 'rejected'
            └─→ Email sent with reason
                └─→ Cannot LOGIN
                    └─→ Must resubmit

=====================================
TESTING THE WORKFLOW
=====================================

1. Sign up as lawyer with email & certificate
2. Verify email via OTP
3. Try logging in → Should see "Pending verification" message
4. Go to Admin → Lawyer Management
5. View pending lawyers
6. Click lawyer, review certificate
7. Click "Approve" or "Reject"
8. Check lawyer's email for notification
9. Try logging in again → Should work if approved

=====================================
CUSTOMIZATION OPTIONS
=====================================

- Change notification messages in notificationService.js
- Modify email templates in emailService.js
- Update KYC status alert styling in KYCStatusAlert.jsx
- Adjust verification timeout (currently manual)
- Add automatic rejection for requirements (e.g., document quality)

=====================================
ERROR MESSAGES
=====================================

Login blocked messages:
1. Pending: "Your account is pending admin verification. Please wait..."
2. Rejected: "Your lawyer verification was rejected. Please contact support..."
3. Other: "Your account requires verification before access."
4. Blocked: "Account has been blocked. Please contact support."

=====================================
*/
