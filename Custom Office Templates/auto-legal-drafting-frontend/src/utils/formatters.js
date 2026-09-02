// Date Formatting
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Currency Formatting
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatPrice = (price) => {
  return `₹${price.toLocaleString('en-IN')}`;
};

// Number Formatting
export const formatNumber = (num) => {
  return num.toLocaleString('en-IN');
};

export const formatPercentage = (value, decimals = 1) => {
  return `${(value * 100).toFixed(decimals)}%`;
};

// File Size Formatting
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// Text Truncation
export const truncateText = (text, length = 100) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Capitalize
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
};

// Status Badge Formatter
export const getStatusBadgeClass = (status) => {
  const statusMap = {
    draft: { bg: 'bg-gray-100', text: 'text-gray-800' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    reviewed: { bg: 'bg-blue-100', text: 'text-blue-800' },
    approved: { bg: 'bg-green-100', text: 'text-green-800' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800' },
    completed: { bg: 'bg-green-100', text: 'text-green-800' },
    'in_progress': { bg: 'bg-blue-100', text: 'text-blue-800' },
  };
  return statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
};

// Phone Number Formatting
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  // Format as +91-XXXXX-XXXXX
  if (cleaned.length === 10) {
    return `+91-${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }
  return phone;
};

// Email Masking
export const maskEmail = (email) => {
  if (!email) return '';
  const [localPart, domain] = email.split('@');
  const maskedLocal = localPart.charAt(0) + '****' + localPart.slice(-1);
  return `${maskedLocal}@${domain}`;
};

// Time Ago (Relative Time)
export const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + ' years ago';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months ago';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' days ago';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hours ago';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minutes ago';
  }
  return Math.floor(seconds) + ' seconds ago';
};

// Document Type Icon
export const getDocumentIcon = (docType) => {
  const icons = {
    'NDA': '🔐',
    'Employment Agreement': '👔',
    'Service Agreement': '📋',
    'Freelancer Agreement': '🤝',
    'Partnership Agreement': '🤲',
    'Vendor Agreement': '🏢',
    'Lease Agreement': '🏠',
    'Loan Agreement': '💰',
    'Software Development Agreement': '💻',
    'Consulting Agreement': '👨‍💼',
    'MoU': '📝',
    'POA': '✍️',
    'Shareholder Agreement': '📊',
    'Terms & Conditions': '⚖️',
    'Investment Agreement': '💼',
  };
  return icons[docType] || '📄';
};

// SLA Time Remaining
export const getTimeRemaining = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate - now;

  if (diff < 0) return 'Overdue';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} left`;
  }
  return `${hours}h ${minutes}m left`;
};

// Rating Display
export const getRatingLabel = (rating) => {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4.0) return 'Very Good';
  if (rating >= 3.0) return 'Good';
  if (rating >= 2.0) return 'Fair';
  return 'Poor';
};

// Address Formatting
export const formatAddress = (address) => {
  if (!address) return '';
  return address.split('\n').join(', ');
};
