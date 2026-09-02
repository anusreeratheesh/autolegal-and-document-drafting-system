// Document Types
export const DOCUMENT_TYPES = [
  'NDA',
  'Service Agreement',
  'Employment Agreement',
  'Freelancer Agreement',
  'Partnership Agreement',
  'Vendor Agreement',
  'Lease Agreement',
  'Loan Agreement',
  'Software Development Agreement',
  'Consulting Agreement',
  'MoU',
  'POA',
  'Shareholder Agreement',
  'Terms & Conditions',
  'Investment Agreement',
];

// User Roles
export const USER_ROLES = {
  USER: 'user',
  LAWYER: 'lawyer',
  ADMIN: 'admin',
};

// Document Status
export const DOCUMENT_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  APPROVED: 'approved',
};

// Review Status
export const REVIEW_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
};

// Pricing Tiers
export const PRICING_TIERS = {
  QUICK: {
    name: 'Quick',
    price: 199,
    sla: 360, // 6 hours in minutes
  },
  STANDARD: {
    name: 'Standard',
    price: 499,
    sla: 1440, // 24 hours
  },
  PREMIUM: {
    name: 'Premium',
    price: 999,
    sla: 120, // 2 hours
  },
};

// KYC Status
export const KYC_STATUS = {
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};

// Dispute Status
export const DISPUTE_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  REVIEW_REQUEST: 'review_request',
  REVIEW_COMPLETED: 'review_completed',
  PAYMENT: 'payment',
  MESSAGE: 'message',
  ALERT: 'alert',
  APPROVAL: 'approval',
};

// Document Schemas - Field Definitions
export const documentSchemas = {
  default: {
    fields: [
      {
        name: 'partyA_name',
        label: 'Party A Name',
        type: 'text',
        required: true,
        placeholder: 'Enter party A name',
      },
      {
        name: 'partyB_name',
        label: 'Party B Name',
        type: 'text',
        required: true,
        placeholder: 'Enter party B name',
      },
      {
        name: 'purpose',
        label: 'Purpose of Agreement',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the purpose',
      },
      {
        name: 'effective_date',
        label: 'Effective Date',
        type: 'text',
        required: true,
        placeholder: 'DD/MM/YYYY',
      },
      {
        name: 'governing_law',
        label: 'Governing Law / Jurisdiction',
        type: 'text',
        required: false,
        placeholder: 'e.g., India',
      },
    ],
  },
  'NDA': {
    fields: [
      {
        name: 'partyA_name',
        label: 'Disclosing Party',
        type: 'text',
        required: true,
        placeholder: 'Enter name',
      },
      {
        name: 'partyB_name',
        label: 'Receiving Party',
        type: 'text',
        required: true,
        placeholder: 'Enter name',
      },
      {
        name: 'definition_of_confidential_information',
        label: 'Definition of Confidential Information',
        type: 'textarea',
        required: true,
        placeholder: 'Define what is confidential',
      },
      {
        name: 'exceptions',
        label: 'Exceptions to Confidentiality',
        type: 'textarea',
        required: false,
        placeholder: 'List exceptions',
      },
      {
        name: 'term_of_confidentiality',
        label: 'Term of Confidentiality (in years)',
        type: 'number',
        required: true,
        placeholder: '2-5 years',
      },
      {
        name: 'permitted_disclosure_recipients',
        label: 'Permitted Disclosure Recipients',
        type: 'textarea',
        required: false,
        placeholder: 'List approved recipients',
      },
      {
        name: 'effective_date',
        label: 'Effective Date',
        type: 'text',
        required: true,
        placeholder: 'DD/MM/YYYY',
      },
      {
        name: 'governing_law',
        label: 'Governing Law',
        type: 'text',
        required: false,
        placeholder: 'e.g., India',
      },
    ],
  },
  'Employment Agreement': {
    fields: [
      {
        name: 'employee_name',
        label: 'Employee Name',
        type: 'text',
        required: true,
        placeholder: 'Enter full name',
      },
      {
        name: 'company_name',
        label: 'Company Name',
        type: 'text',
        required: true,
        placeholder: 'Enter company name',
      },
      {
        name: 'job_title',
        label: 'Job Title',
        type: 'text',
        required: true,
        placeholder: 'e.g., Software Developer',
      },
      {
        name: 'salary',
        label: 'Annual Salary',
        type: 'number',
        required: true,
        placeholder: '₹ 0',
      },
      {
        name: 'probation_period',
        label: 'Probation Period (in months)',
        type: 'number',
        required: false,
        placeholder: '3-6 months',
      },
      {
        name: 'notice_period',
        label: 'Notice Period (in days)',
        type: 'number',
        required: false,
        placeholder: '30-60 days',
      },
      {
        name: 'benefits',
        label: 'Benefits',
        type: 'textarea',
        required: false,
        placeholder: 'Health insurance, PF, etc.',
      },
      {
        name: 'confidentiality_clause',
        label: 'Include Confidentiality Clause?',
        type: 'checkbox',
        required: false,
      },
      {
        name: 'non_compete',
        label: 'Include Non-Compete Clause?',
        type: 'checkbox',
        required: false,
      },
      {
        name: 'effective_date',
        label: 'Effective Date',
        type: 'text',
        required: true,
        placeholder: 'DD/MM/YYYY',
      },
    ],
  },
  'Service Agreement': {
    fields: [
      {
        name: 'service_provider',
        label: 'Service Provider Name',
        type: 'text',
        required: true,
        placeholder: 'Enter name',
      },
      {
        name: 'service_client',
        label: 'Client Name',
        type: 'text',
        required: true,
        placeholder: 'Enter name',
      },
      {
        name: 'service_description',
        label: 'Service Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe services in detail',
      },
      {
        name: 'service_fee',
        label: 'Service Fee',
        type: 'number',
        required: true,
        placeholder: '₹ 0',
      },
      {
        name: 'payment_terms',
        label: 'Payment Terms',
        type: 'select',
        required: true,
        options: ['Upfront', 'Monthly', 'Upon Completion', 'Milestone-based'],
      },
      {
        name: 'service_term',
        label: 'Service Term (in months)',
        type: 'number',
        required: true,
        placeholder: '1-12 months',
      },
      {
        name: 'termination_clause',
        label: 'Termination Notice Period (in days)',
        type: 'number',
        required: false,
        placeholder: '30 days',
      },
      {
        name: 'effective_date',
        label: 'Effective Date',
        type: 'text',
        required: true,
        placeholder: 'DD/MM/YYYY',
      },
    ],
  },
  'Lease Agreement': {
    fields: [
      {
        name: 'landlord_name',
        label: 'Landlord Name',
        type: 'text',
        required: true,
        placeholder: 'Enter name',
      },
      {
        name: 'tenant_name',
        label: 'Tenant Name',
        type: 'text',
        required: true,
        placeholder: 'Enter name',
      },
      {
        name: 'property_address',
        label: 'Property Address',
        type: 'textarea',
        required: true,
        placeholder: 'Full property address',
      },
      {
        name: 'rent_amount',
        label: 'Monthly Rent Amount',
        type: 'number',
        required: true,
        placeholder: '₹ 0',
      },
      {
        name: 'security_deposit',
        label: 'Security Deposit',
        type: 'number',
        required: true,
        placeholder: '₹ 0',
      },
      {
        name: 'lease_term',
        label: 'Lease Term (in months)',
        type: 'number',
        required: true,
        placeholder: '12-36 months',
      },
      {
        name: 'maintenance_responsibility',
        label: 'Maintenance Responsibility',
        type: 'select',
        required: true,
        options: ['Landlord', 'Tenant', 'Shared'],
      },
      {
        name: 'effective_date',
        label: 'Effective Date',
        type: 'text',
        required: true,
        placeholder: 'DD/MM/YYYY',
      },
    ],
  },

  // Certificates
  'Internship Certificate': {
    fields: [
      { name: 'intern_name', label: 'Intern Name', type: 'text', required: true, placeholder: 'Full Name' },
      { name: 'department', label: 'Department', type: 'text', required: true, placeholder: 'e.g. Marketing' },
      { name: 'start_date', label: 'Start Date', type: 'text', required: true, placeholder: 'DD/MM/YYYY' },
      { name: 'end_date', label: 'End Date', type: 'text', required: true, placeholder: 'DD/MM/YYYY' },
      { name: 'authorized_signatory', label: 'Authorized Signatory Name', type: 'text', required: true, placeholder: 'Manager Name' },
    ],
  },
  'Experience Certificate': {
    fields: [
      { name: 'employee_name', label: 'Employee Name', type: 'text', required: true, placeholder: 'Full Name' },
      { name: 'designation', label: 'Designation', type: 'text', required: true, placeholder: 'e.g. Senior Developer' },
      { name: 'joining_date', label: 'Joining Date', type: 'text', required: true, placeholder: 'DD/MM/YYYY' },
      { name: 'relieving_date', label: 'Relieving Date', type: 'text', required: true, placeholder: 'DD/MM/YYYY' },
      { name: 'company_name', label: 'Company Name', type: 'text', required: true, placeholder: 'Company Name' },
    ],
  },
  'Appreciation Certificate': {
    fields: [
      { name: 'recipient_name', label: 'Recipient Name', type: 'text', required: true, placeholder: 'Full Name' },
      { name: 'achievement', label: 'Achievement/Reason', type: 'textarea', required: true, placeholder: 'Reason for appreciation' },
      { name: 'date', label: 'Date', type: 'text', required: true, placeholder: 'DD/MM/YYYY' },
      { name: 'presenter_name', label: 'Presented By', type: 'text', required: true, placeholder: 'Name' },
    ],
  },
  // Letters
  'Offer Letter': {
    fields: [
      { name: 'candidate_name', label: 'Candidate Name', type: 'text', required: true, placeholder: 'Full Name' },
      { name: 'position', label: 'Position', type: 'text', required: true, placeholder: 'Job Title' },
      { name: 'start_date', label: 'Start Date', type: 'text', required: true, placeholder: 'DD/MM/YYYY' },
      { name: 'salary', label: 'Annual Salary', type: 'text', required: true, placeholder: 'Amount' },
      { name: 'company_name', label: 'Company Name', type: 'text', required: true, placeholder: 'Company Name' },
    ],
  },
  'Legal Notice': {
    fields: [
      { name: 'sender_name', label: 'Sender Name', type: 'text', required: true, placeholder: 'Your Name' },
      { name: 'recipient_name', label: 'Recipient Name', type: 'text', required: true, placeholder: 'Recipient Name' },
      { name: 'recipient_address', label: 'Recipient Address', type: 'textarea', required: true, placeholder: 'Address' },
      { name: 'subject', label: 'Subject', type: 'text', required: true, placeholder: 'Notice Subject' },
      { name: 'grievance', label: 'Grievance/Issue', type: 'textarea', required: true, placeholder: 'Details of the issue' },
      { name: 'demand', label: 'Demand/Action Required', type: 'textarea', required: true, placeholder: 'What you want them to do' },
    ],
  },
  'Demand Letter': {
    fields: [
      { name: 'debtor_name', label: 'Debtor Name', type: 'text', required: true, placeholder: 'Name' },
      { name: 'amount_due', label: 'Amount Due', type: 'text', required: true, placeholder: 'Amount' },
      { name: 'due_date', label: 'Original Due Date', type: 'text', required: true, placeholder: 'DD/MM/YYYY' },
      { name: 'payment_deadline', label: 'Payment Deadline', type: 'text', required: true, placeholder: 'DD/MM/YYYY' },
      { name: 'invoice_ref', label: 'Invoice Reference', type: 'text', required: false, placeholder: 'Invoice #' },
    ],
  },
  'Resignation Letter': {
    fields: [
      { name: 'manager_name', label: 'Manager Name', type: 'text', required: true, placeholder: 'Name' },
      { name: 'position', label: 'Your Position', type: 'text', required: true, placeholder: 'Job Title' },
      { name: 'last_working_day', label: 'Last Working Day', type: 'text', required: true, placeholder: 'DD/MM/YYYY' },
      { name: 'reason', label: 'Reason (Optional)', type: 'textarea', required: false, placeholder: 'Reason for leaving' },
    ],
  },
  // Emails
  'Professional Email': {
    fields: [
      { name: 'recipient_name', label: 'Recipient Name', type: 'text', required: true, placeholder: 'Name' },
      { name: 'subject', label: 'Subject', type: 'text', required: true, placeholder: 'Email Subject' },
      { name: 'message_body', label: 'Message', type: 'textarea', required: true, placeholder: 'Email content' },
    ],
  },
  'Cold Outreach Email': {
    fields: [
      { name: 'recipient_name', label: 'Recipient Name', type: 'text', required: true, placeholder: 'Name' },
      { name: 'company_name', label: 'Recipient Company', type: 'text', required: true, placeholder: 'Company' },
      { name: 'value_proposition', label: 'Value Proposition', type: 'textarea', required: true, placeholder: 'How can you help them?' },
      { name: 'call_to_action', label: 'Call to Action', type: 'text', required: true, placeholder: 'e.g. Schedule a call' },
    ],
  },
};

// API Endpoints (Mock)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  USERS: {
    GET_PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/profile',
    GET_ALL: '/api/users',
  },
  DOCUMENTS: {
    CREATE: '/api/documents',
    GET_ALL: '/api/documents',
    GET_ONE: '/api/documents/:id',
    UPDATE: '/api/documents/:id',
    DELETE: '/api/documents/:id',
    GENERATE: '/api/documents/generate',
  },
  LAWYERS: {
    GET_ALL: '/api/lawyers',
    GET_ONE: '/api/lawyers/:id',
    UPDATE_PROFILE: '/api/lawyers/profile',
    GET_STATS: '/api/lawyers/stats',
  },
  REVIEWS: {
    CREATE: '/api/reviews',
    GET_ALL: '/api/reviews',
    UPDATE_STATUS: '/api/reviews/:id/status',
  },
  PAYOUTS: {
    CREATE: '/api/payouts',
    GET_ALL: '/api/payouts',
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Invalid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_PHONE: 'Invalid phone number',
  FILE_TOO_LARGE: 'File size exceeds 20MB limit',
  NETWORK_ERROR: 'Network error. Please try again.',
  UNAUTHORIZED: 'Unauthorized. Please login again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  DOCUMENT_CREATED: 'Document created successfully',
  DOCUMENT_UPDATED: 'Document updated successfully',
  DOCUMENT_DELETED: 'Document deleted successfully',
  REVIEW_SENT: 'Review request sent successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
};
