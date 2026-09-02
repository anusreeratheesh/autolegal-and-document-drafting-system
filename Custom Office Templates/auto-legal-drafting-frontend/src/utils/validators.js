// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (min 6 chars)
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Phone validation
export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
};

// Number validation
export const validateNumber = (value) => {
  return !isNaN(value) && value > 0;
};

// URL validation
export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Aadhar number validation (12 digits)
export const validateAadhar = (aadhar) => {
  const aadharRegex = /^\d{12}$/;
  return aadharRegex.test(aadhar);
};

// PAN validation (10 alphanumeric)
export const validatePAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

// Form validation wrapper
export const validateForm = (formData, schema) => {
  const errors = {};

  schema.forEach((field) => {
    const value = formData[field.name];

    // Check required fields
    if (field.required && !value) {
      errors[field.name] = `${field.label} is required`;
      return;
    }

    // Type-specific validation
    if (value) {
      switch (field.type) {
        case 'email':
          if (!validateEmail(value)) {
            errors[field.name] = 'Invalid email address';
          }
          break;
        case 'tel':
          if (!validatePhone(value)) {
            errors[field.name] = 'Invalid phone number';
          }
          break;
        case 'number':
          if (!validateNumber(value)) {
            errors[field.name] = 'Please enter a valid number';
          }
          break;
        case 'url':
          if (!validateURL(value)) {
            errors[field.name] = 'Invalid URL';
          }
          break;
        default:
          break;
      }
    }
  });

  return errors;
};

// Password strength checker
export const checkPasswordStrength = (password) => {
  let strength = 0;
  let feedback = [];

  if (password.length >= 6) strength++;
  else feedback.push('At least 6 characters');

  if (password.length >= 12) strength++;
  else feedback.push('At least 12 characters for stronger security');

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  else feedback.push('Mix of uppercase and lowercase letters');

  if (/\d/.test(password)) strength++;
  else feedback.push('Include numbers');

  if (/[!@#$%^&*]/.test(password)) strength++;
  else feedback.push('Include special characters');

  return {
    score: strength,
    level: strength <= 2 ? 'Weak' : strength <= 3 ? 'Fair' : strength <= 4 ? 'Good' : 'Strong',
    feedback,
  };
};
