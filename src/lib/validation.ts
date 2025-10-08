// Data validation and sanitization functions
import type { 
  InvitationFormData, 
  RSVPFormData, 
  GuestbookFormData,
  User,
  EventDetails,
  InvitationContent
} from '../types';

// Validation error interface
export interface ValidationError {
  field: string;
  message: string;
}

// Generic validation result
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  sanitizedData?: any;
}

// Simple validation result for tests
export interface SimpleValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Basic validation functions for tests
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim();
  
  // Check for double dots
  if (trimmedEmail.includes('..')) return false;
  
  return emailRegex.test(trimmedEmail);
};

export const validateRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') {
    // Check for empty string or only whitespace (including tabs and newlines)
    return value.replace(/\s/g, '').length > 0;
  }
  return true;
};

export const sanitizeHTML = (html: string | null | undefined): string => {
  if (!html) return '';
  if (typeof html !== 'string') return '';
  
  // Basic HTML sanitization
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
};

export const validateInvitationData = (data: any): SimpleValidationResult => {
  const errors: Record<string, string> = {};
  
  if (!validateRequired(data.title)) {
    errors.title = 'Title is required';
  }
  
  if (!validateRequired(data.groomName)) {
    errors.groomName = 'Groom name is required';
  }
  
  if (!validateRequired(data.brideName)) {
    errors.brideName = 'Bride name is required';
  }
  
  if (!validateRequired(data.date)) {
    errors.date = 'Date is required';
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.date)) {
      errors.date = 'Please enter a valid date in YYYY-MM-DD format';
    }
  }
  
  if (!validateRequired(data.time)) {
    errors.time = 'Time is required';
  }
  
  if (!validateRequired(data.venue)) {
    errors.venue = 'Venue is required';
  }
  
  if (!validateRequired(data.slug)) {
    errors.slug = 'Slug is required';
  } else {
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(data.slug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRSVPData = (data: any): SimpleValidationResult => {
  const errors: Record<string, string> = {};
  
  if (!validateRequired(data.name)) {
    errors.name = 'Name is required';
  }
  
  if (!validateRequired(data.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (data.plusOne && !validateRequired(data.plusOneName)) {
    errors.plusOneName = 'Plus one name is required when bringing a guest';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateGuestbookEntry = (data: any): SimpleValidationResult => {
  const errors: Record<string, string> = {};
  
  if (!validateRequired(data.name)) {
    errors.name = 'Name is required';
  }
  
  if (!validateRequired(data.message)) {
    errors.message = 'Message is required';
  } else if (data.message.length > 1000) {
    errors.message = 'Message is too long (maximum 1000 characters)';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Phone validation (basic)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// Text sanitization
export const sanitizeText = (text: string, maxLength?: number): string => {
  let sanitized = text.trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/\s+/g, ' '); // Normalize whitespace
  
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

// HTML sanitization for rich text content
export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Invitation form validation
export const validateInvitationForm = (data: InvitationFormData): ValidationResult => {
  const errors: ValidationError[] = [];
  const sanitizedData: InvitationFormData = { ...data };

  // Title validation
  if (!data.title || data.title.trim().length < 3) {
    errors.push({ field: 'title', message: 'Title must be at least 3 characters long' });
  } else {
    sanitizedData.title = sanitizeText(data.title, 100);
  }

  // Event date validation
  if (!data.eventDate) {
    errors.push({ field: 'eventDate', message: 'Event date is required' });
  } else {
    const eventDate = new Date(data.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      errors.push({ field: 'eventDate', message: 'Event date cannot be in the past' });
    }
  }

  // Template ID validation
  if (!data.templateId || data.templateId.trim().length === 0) {
    errors.push({ field: 'templateId', message: 'Template selection is required' });
  }

  // Hero content validation
  if (data.heroContent?.title) {
    sanitizedData.heroContent = {
      ...data.heroContent,
      title: sanitizeText(data.heroContent.title, 200)
    };
    
    if (data.heroContent.subtitle) {
      sanitizedData.heroContent.subtitle = sanitizeText(data.heroContent.subtitle, 300);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: errors.length === 0 ? sanitizedData : undefined
  };
};

// RSVP form validation
export const validateRSVPForm = (data: RSVPFormData): ValidationResult => {
  const errors: ValidationError[] = [];
  const sanitizedData: RSVPFormData = { ...data };

  // Guest name validation
  if (!data.guestName || data.guestName.trim().length < 2) {
    errors.push({ field: 'guestName', message: 'Name must be at least 2 characters long' });
  } else {
    sanitizedData.guestName = sanitizeText(data.guestName, 100);
  }

  // Email validation (optional but must be valid if provided)
  if (data.guestEmail && data.guestEmail.trim().length > 0) {
    if (!isValidEmail(data.guestEmail)) {
      errors.push({ field: 'guestEmail', message: 'Please enter a valid email address' });
    } else {
      sanitizedData.guestEmail = data.guestEmail.trim().toLowerCase();
    }
  }

  // Phone validation (optional but must be valid if provided)
  if (data.guestPhone && data.guestPhone.trim().length > 0) {
    if (!isValidPhone(data.guestPhone)) {
      errors.push({ field: 'guestPhone', message: 'Please enter a valid phone number' });
    } else {
      sanitizedData.guestPhone = data.guestPhone.replace(/[\s\-\(\)]/g, '');
    }
  }

  // Attendance status validation
  if (!['attending', 'not-attending', 'maybe'].includes(data.attendanceStatus)) {
    errors.push({ field: 'attendanceStatus', message: 'Please select your attendance status' });
  }

  // Plus ones validation
  if (data.attendanceStatus === 'attending') {
    if (data.plusOnes < 0 || data.plusOnes > 10) {
      errors.push({ field: 'plusOnes', message: 'Plus ones must be between 0 and 10' });
    }
    
    // Validate plus one names if provided
    if (data.plusOneNames && data.plusOneNames.length > 0) {
      const validNames = data.plusOneNames
        .filter(name => name.trim().length >= 2)
        .map(name => sanitizeText(name, 100));
      
      if (validNames.length !== data.plusOnes) {
        errors.push({ 
          field: 'plusOneNames', 
          message: 'Please provide names for all additional guests' 
        });
      } else {
        sanitizedData.plusOneNames = validNames;
      }
    }
  }

  // Message validation (optional)
  if (data.message && data.message.trim().length > 0) {
    if (data.message.length > 500) {
      errors.push({ field: 'message', message: 'Message cannot exceed 500 characters' });
    } else {
      sanitizedData.message = sanitizeText(data.message, 500);
    }
  }

  // Dietary restrictions validation (optional)
  if (data.dietaryRestrictions && data.dietaryRestrictions.trim().length > 0) {
    if (data.dietaryRestrictions.length > 200) {
      errors.push({ 
        field: 'dietaryRestrictions', 
        message: 'Dietary restrictions cannot exceed 200 characters' 
      });
    } else {
      sanitizedData.dietaryRestrictions = sanitizeText(data.dietaryRestrictions, 200);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: errors.length === 0 ? sanitizedData : undefined
  };
};

// Guestbook form validation
export const validateGuestbookForm = (data: GuestbookFormData): ValidationResult => {
  const errors: ValidationError[] = [];
  const sanitizedData: GuestbookFormData = { ...data };

  // Author name validation
  if (!data.authorName || data.authorName.trim().length < 2) {
    errors.push({ field: 'authorName', message: 'Name must be at least 2 characters long' });
  } else {
    sanitizedData.authorName = sanitizeText(data.authorName, 100);
  }

  // Email validation (optional)
  if (data.authorEmail && data.authorEmail.trim().length > 0) {
    if (!isValidEmail(data.authorEmail)) {
      errors.push({ field: 'authorEmail', message: 'Please enter a valid email address' });
    } else {
      sanitizedData.authorEmail = data.authorEmail.trim().toLowerCase();
    }
  }

  // Message validation
  if (!data.message || data.message.trim().length < 1) {
    errors.push({ field: 'message', message: 'Message is required' });
  } else if (data.message.length > 1000) {
    errors.push({ field: 'message', message: 'Message cannot exceed 1000 characters' });
  } else {
    sanitizedData.message = sanitizeText(data.message, 1000);
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: errors.length === 0 ? sanitizedData : undefined
  };
};

// User profile validation
export const validateUserProfile = (data: Partial<User>): ValidationResult => {
  const errors: ValidationError[] = [];
  const sanitizedData: Partial<User> = { ...data };

  // Display name validation
  if (data.displayName !== undefined) {
    if (!data.displayName || data.displayName.trim().length < 2) {
      errors.push({ field: 'displayName', message: 'Display name must be at least 2 characters long' });
    } else {
      sanitizedData.displayName = sanitizeText(data.displayName, 100);
    }
  }

  // Email validation
  if (data.email !== undefined) {
    if (!data.email || !isValidEmail(data.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    } else {
      sanitizedData.email = data.email.trim().toLowerCase();
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: errors.length === 0 ? sanitizedData : undefined
  };
};

// Event details validation
export const validateEventDetails = (data: EventDetails): ValidationResult => {
  const errors: ValidationError[] = [];
  const sanitizedData: EventDetails = { ...data };

  const validateEvent = (event: any, eventType: string) => {
    if (!event) return;

    if (!event.name || event.name.trim().length < 3) {
      errors.push({ 
        field: `${eventType}.name`, 
        message: `${eventType} name must be at least 3 characters long` 
      });
    }

    if (!event.venue || event.venue.trim().length < 3) {
      errors.push({ 
        field: `${eventType}.venue`, 
        message: `${eventType} venue must be at least 3 characters long` 
      });
    }

    if (!event.address || event.address.trim().length < 10) {
      errors.push({ 
        field: `${eventType}.address`, 
        message: `${eventType} address must be at least 10 characters long` 
      });
    }

    if (!event.date || new Date(event.date) < new Date()) {
      errors.push({ 
        field: `${eventType}.date`, 
        message: `${eventType} date cannot be in the past` 
      });
    }

    if (!event.time || event.time.trim().length < 3) {
      errors.push({ 
        field: `${eventType}.time`, 
        message: `${eventType} time is required` 
      });
    }
  };

  // Validate ceremony if provided
  if (data.ceremony) {
    validateEvent(data.ceremony, 'ceremony');
  }

  // Validate reception if provided
  if (data.reception) {
    validateEvent(data.reception, 'reception');
  }

  // At least one event must be provided
  if (!data.ceremony && !data.reception) {
    errors.push({ 
      field: 'events', 
      message: 'At least one event (ceremony or reception) must be provided' 
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: errors.length === 0 ? sanitizedData : undefined
  };
};

// File validation for uploads
export const validateFile = (
  file: File, 
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    maxDimensions?: { width: number; height: number };
  } = {}
): ValidationResult => {
  const errors: ValidationError[] = [];
  
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  } = options;

  // File size validation
  if (file.size > maxSize) {
    errors.push({ 
      field: 'file', 
      message: `File size must be less than ${maxSize / (1024 * 1024)}MB` 
    });
  }

  // File type validation
  if (!allowedTypes.includes(file.type)) {
    errors.push({ 
      field: 'file', 
      message: `File type must be one of: ${allowedTypes.join(', ')}` 
    });
  }

  // File name validation
  if (file.name.length > 255) {
    errors.push({ 
      field: 'file', 
      message: 'File name is too long' 
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Batch validation helper
export const validateBatch = (
  validations: Array<() => ValidationResult>
): ValidationResult => {
  const allErrors: ValidationError[] = [];
  
  validations.forEach(validation => {
    const result = validation();
    if (!result.isValid) {
      allErrors.push(...result.errors);
    }
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};