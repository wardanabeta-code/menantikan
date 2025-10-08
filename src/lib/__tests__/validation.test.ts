import { describe, it, expect } from 'vitest';
import { 
  validateEmail, 
  validateRequired, 
  sanitizeHTML, 
  validateInvitationData,
  validateRSVPData,
  validateGuestbookEntry 
} from '../validation';

describe('Validation Functions', () => {
  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(validateEmail('x@y.z')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('test..email@domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('validates non-empty strings', () => {
      expect(validateRequired('valid string')).toBe(true);
      expect(validateRequired('a')).toBe(true);
    });

    it('rejects empty or whitespace-only strings', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
      expect(validateRequired('\t\n')).toBe(false);
    });

    it('handles null and undefined values', () => {
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
    });
  });

  describe('sanitizeHTML', () => {
    it('removes script tags', () => {
      const malicious = '<script>alert(\"xss\")</script><p>Safe content</p>';
      const sanitized = sanitizeHTML(malicious);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('<p>Safe content</p>');
    });

    it('removes event handlers', () => {
      const malicious = '<div onclick=\"alert(\\\"xss\\\")\">Click me</div>';
      const sanitized = sanitizeHTML(malicious);
      expect(sanitized).not.toContain('onclick');
      expect(sanitized).toContain('Click me');
    });

    it('preserves safe HTML elements', () => {
      const safe = '<p>This is <strong>bold</strong> and <em>italic</em> text.</p>';
      const sanitized = sanitizeHTML(safe);
      expect(sanitized).toBe(safe);
    });

    it('handles empty and null inputs', () => {
      expect(sanitizeHTML('')).toBe('');
      expect(sanitizeHTML(null)).toBe('');
      expect(sanitizeHTML(undefined)).toBe('');
    });
  });

  describe('validateInvitationData', () => {
    const validInvitation = {
      title: 'Wedding Invitation',
      groomName: 'John Doe',
      brideName: 'Jane Smith',
      date: '2024-06-15',
      time: '15:00',
      venue: 'Beautiful Garden',
      slug: 'john-jane-wedding'
    };

    it('validates correct invitation data', () => {
      const result = validateInvitationData(validInvitation);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('requires all mandatory fields', () => {
      const invalid = {
        title: '',
        groomName: 'John',
        brideName: '',
        date: '2024-06-15',
        time: '',
        venue: 'Garden',
        slug: 'test'
      };

      const result = validateInvitationData(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toContain('required');
      expect(result.errors.brideName).toContain('required');
      expect(result.errors.time).toContain('required');
    });

    it('validates date format', () => {
      const invalidDate = {
        ...validInvitation,
        date: 'invalid-date'
      };

      const result = validateInvitationData(invalidDate);
      expect(result.isValid).toBe(false);
      expect(result.errors.date).toContain('valid date');
    });

    it('validates slug format', () => {
      const invalidSlug = {
        ...validInvitation,
        slug: 'Invalid Slug with Spaces!'
      };

      const result = validateInvitationData(invalidSlug);
      expect(result.isValid).toBe(false);
      expect(result.errors.slug).toContain('letters, numbers, and hyphens');
    });
  });

  describe('validateRSVPData', () => {
    const validRSVP = {
      name: 'John Doe',
      email: 'john@example.com',
      attending: true,
      dietaryRequirements: '',
      plusOne: false,
      message: ''
    };

    it('validates correct RSVP data', () => {
      const result = validateRSVPData(validRSVP);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('requires name and email', () => {
      const invalid = {
        ...validRSVP,
        name: '',
        email: 'invalid-email'
      };

      const result = validateRSVPData(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toContain('required');
      expect(result.errors.email).toContain('valid email');
    });

    it('validates email format', () => {
      const invalidEmail = {
        ...validRSVP,
        email: 'not-an-email'
      };

      const result = validateRSVPData(invalidEmail);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toContain('valid email');
    });

    it('requires plus one name when plus one is selected', () => {
      const missingPlusOneName = {
        ...validRSVP,
        plusOne: true
        // plusOneName is missing
      };

      const result = validateRSVPData(missingPlusOneName);
      expect(result.isValid).toBe(false);
      expect(result.errors.plusOneName).toContain('required');
    });
  });

  describe('validateGuestbookEntry', () => {
    const validEntry = {
      name: 'John Doe',
      message: 'Congratulations on your special day!'
    };

    it('validates correct guestbook entry', () => {
      const result = validateGuestbookEntry(validEntry);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('requires name and message', () => {
      const invalid = {
        name: '',
        message: ''
      };

      const result = validateGuestbookEntry(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toContain('required');
      expect(result.errors.message).toContain('required');
    });

    it('validates message length', () => {
      const tooLong = {
        name: 'John',
        message: 'x'.repeat(1001) // Assuming 1000 character limit
      };

      const result = validateGuestbookEntry(tooLong);
      expect(result.isValid).toBe(false);
      expect(result.errors.message).toContain('too long');
    });
  });
});