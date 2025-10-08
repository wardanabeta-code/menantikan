import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import RSVPForm from '../RSVPForm';

// Mock Zustand store
const mockAddRSVP = vi.fn();
vi.mock('../../stores/invitationStore', () => ({
  useInvitationStore: () => ({
    addRSVP: mockAddRSVP,
    loading: false
  })
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('RSVPForm', () => {
  const mockProps = {
    invitationId: 'test-invitation-id',
    guestName: 'John Doe',
    guestEmail: 'john@example.com'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders RSVP form with guest information', () => {
    render(<RSVPForm {...mockProps} />);
    
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit rsvp/i })).toBeInTheDocument();
  });

  it('allows user to select attendance status', async () => {
    const user = userEvent.setup();
    render(<RSVPForm {...mockProps} />);
    
    const attendingButton = screen.getByRole('button', { name: 'Attending' });
    await user.click(attendingButton);
    
    expect(attendingButton).toHaveClass('bg-green-500');
  });

  it('validates required fields before submission', async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<RSVPForm {...mockProps} guestName="" guestEmail="" />);
    
    const submitButton = screen.getByRole('button', { name: /submit rsvp/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    
    // Form should not submit when validation fails
    expect(consoleSpy).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('submits RSVP with correct data', async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<RSVPForm {...mockProps} />);
    
    // Select attending
    const attendingButton = screen.getByRole('button', { name: 'Attending' });
    await user.click(attendingButton);
    
    // Add dietary requirements
    const dietaryInput = screen.getByPlaceholderText(/dietary requirements/i);
    await user.type(dietaryInput, 'Vegetarian');
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit rsvp/i });
    await user.click(submitButton);
    
    // Check that console.log was called with correct data
    expect(consoleSpy).toHaveBeenCalledWith('RSVP submitted:', {
      invitationId: 'test-invitation-id',
      name: 'John Doe',
      email: 'john@example.com',
      attending: true,
      dietaryRequirements: 'Vegetarian',
      plusOne: false,
      plusOneName: '',
      message: ''
    });
    
    consoleSpy.mockRestore();
  });

  it('handles plus one selection', async () => {
    const user = userEvent.setup();
    render(<RSVPForm {...mockProps} />);
    
    const plusOneCheckbox = screen.getByRole('checkbox', { name: /plus one/i });
    await user.click(plusOneCheckbox);
    
    expect(plusOneCheckbox).toBeChecked();
    expect(screen.getByPlaceholderText(/plus one name/i)).toBeInTheDocument();
  });
});