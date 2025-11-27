// Validation rules for different field types
export const validationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  phone: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message: 'Please enter a valid phone number'
  },
  url: {
    pattern: /^https?:\/\/.+/,
    message: 'Please enter a valid URL starting with http:// or https://'
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, number and special character'
  },
  apiKey: {
    minLength: 20,
    pattern: /^[a-zA-Z0-9_-]+$/,
    message: 'API key must be at least 20 characters and contain only letters, numbers, hyphens, and underscores'
  },
  smtpPort: {
    min: 1,
    max: 65535,
    message: 'SMTP port must be between 1 and 65535'
  },
  positiveNumber: {
    pattern: /^\d+(\.\d+)?$/,
    message: 'Please enter a positive number'
  },
  currency: {
    pattern: /^\d+(\.\d{1,2})?$/,
    message: 'Please enter a valid currency amount (max 2 decimal places)'
  }
};

// Field-specific validation configurations
export const fieldValidations = {
  // General Settings
  siteName: { required: true, minLength: 2, maxLength: 100 },
  contactEmail: { required: true, ...validationRules.email },
  contactPhone: { required: true, ...validationRules.phone },
  siteDescription: { maxLength: 500 },
  
  // Security Settings
  passwordMinLength: { 
    required: true, 
    min: 6, 
    max: 50,
    message: 'Password minimum length must be between 6 and 50 characters'
  },
  maxLoginAttempts: { 
    required: true, 
    min: 1, 
    max: 10,
    message: 'Max login attempts must be between 1 and 10'
  },
  
  // Notification Settings
  smtpHost: { required: true, minLength: 3, maxLength: 255 },
  smtpPort: { required: true, ...validationRules.smtpPort },
  fromEmail: { required: true, ...validationRules.email },
  fromName: { required: true, minLength: 2, maxLength: 100 },
  
  // Investment Settings
  minInvestmentAmount: { 
    required: true, 
    ...validationRules.positiveNumber,
    min: 1,
    message: 'Minimum investment must be at least ₹1'
  },
  maxInvestmentAmount: { 
    required: true, 
    ...validationRules.positiveNumber,
    min: 1,
    message: 'Maximum investment must be at least ₹1'
  },
  
  // Performance Settings
  cacheDuration: { 
    required: true, 
    ...validationRules.positiveNumber,
    min: 60,
    max: 86400,
    message: 'Cache duration must be between 60 and 86400 seconds'
  },
  requestsPerMinute: { 
    required: true, 
    ...validationRules.positiveNumber,
    min: 1,
    max: 10000,
    message: 'Requests per minute must be between 1 and 10000'
  },
  
  // Integration Settings
  apiKey: { required: true, ...validationRules.apiKey },
  apiSecret: { required: true, minLength: 20 },
  webhookUrl: { ...validationRules.url },
  
  // Social Media URLs
  facebookUrl: { ...validationRules.url },
  twitterUrl: { ...validationRules.url },
  linkedinUrl: { ...validationRules.url },
  instagramUrl: { ...validationRules.url }
};

// Main validation function
export const validateField = (value, rules) => {
  // Check if field is required
  if (rules.required && (!value || value.toString().trim() === '')) {
    return rules.message || 'This field is required';
  }

  // Skip validation if value is empty and not required
  if (!value || value.toString().trim() === '') {
    return null;
  }

  const stringValue = value.toString().trim();

  // Check minimum length
  if (rules.minLength && stringValue.length < rules.minLength) {
    return rules.message || `Minimum length is ${rules.minLength} characters`;
  }

  // Check maximum length
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    return rules.message || `Maximum length is ${rules.maxLength} characters`;
  }

  // Check numeric minimum
  if (rules.min !== undefined && !isNaN(value) && Number(value) < rules.min) {
    return rules.message || `Value must be at least ${rules.min}`;
  }

  // Check numeric maximum
  if (rules.max !== undefined && !isNaN(value) && Number(value) > rules.max) {
    return rules.message || `Value must be no more than ${rules.max}`;
  }

  // Check pattern
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    return rules.message || 'Invalid format';
  }

  return null;
};

// Validate entire form
export const validateForm = (formData, validationSchema) => {
  const errors = {};
  
  Object.keys(validationSchema).forEach(field => {
    const rules = validationSchema[field];
    const value = formData[field];
    const error = validateField(value, rules);
    
    if (error) {
      errors[field] = error;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Get validation rules for a specific field
export const getFieldValidation = (fieldName) => {
  return fieldValidations[fieldName] || {};
};

// Validate settings category
export const validateSettingsCategory = (category, settings) => {
  const categoryValidations = {
    general: {
      siteName: getFieldValidation('siteName'),
      contactEmail: getFieldValidation('contactEmail'),
      contactPhone: getFieldValidation('contactPhone'),
      siteDescription: getFieldValidation('siteDescription')
    },
    security: {
      'passwordPolicy.minLength': getFieldValidation('passwordMinLength'),
      'passwordPolicy.maxAttempts': getFieldValidation('maxLoginAttempts')
    },
    notifications: {
      'email.smtpHost': getFieldValidation('smtpHost'),
      'email.smtpPort': getFieldValidation('smtpPort'),
      'email.fromEmail': getFieldValidation('fromEmail'),
      'email.fromName': getFieldValidation('fromName')
    },
    investment: {
      minInvestmentAmount: getFieldValidation('minInvestmentAmount'),
      maxInvestmentAmount: getFieldValidation('maxInvestmentAmount')
    },
    performance: {
      'caching.cacheDuration': getFieldValidation('cacheDuration'),
      'rateLimiting.requestsPerMinute': getFieldValidation('requestsPerMinute')
    },
    integrations: {
      'paymentGateway.apiKey': getFieldValidation('apiKey'),
      'paymentGateway.apiSecret': getFieldValidation('apiSecret')
    }
  };

  const validationSchema = categoryValidations[category];
  if (!validationSchema) {
    return { isValid: true, errors: {} };
  }

  return validateForm(settings, validationSchema);
};
