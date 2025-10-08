import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GuestbookForm from '../GuestbookForm';

// Mock Zustand store
const mockAddGuestbookEntry = vi.fn();
vi.mock('../../stores/invitationStore', () => ({
  useInvitationStore: () => ({
    addGuestbookEntry: mockAddGuestbookEntry,
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

describe('GuestbookForm', () => {
  const mockProps = {
    invitationId: 'test-invitation-id'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders guestbook form with required fields', () => {
    render(<GuestbookForm {...mockProps} />);
    
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/share your wishes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<GuestbookForm {...mockProps} />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/message is required/i)).toBeInTheDocument();
  });

  it('submits guestbook entry successfully', async () => {
    const user = userEvent.setup();
    mockAddGuestbookEntry.mockResolvedValue(undefined);
    
    render(<GuestbookForm {...mockProps} />);
    
    // Fill form
    await user.type(screen.getByPlaceholderText(/your name/i), 'Jane Smith');
    await user.type(screen.getByPlaceholderText(/share your wishes/i), 'Congratulations on your special day!');
    
    // Submit
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
    
    expect(mockAddGuestbookEntry).toHaveBeenCalledWith('test-invitation-id', {
      name: 'Jane Smith',
      message: 'Congratulations on your special day!',
      timestamp: expect.any(Object)
    });
  });

  it('clears form after successful submission', async () => {
    const user = userEvent.setup();
    mockAddGuestbookEntry.mockResolvedValue(undefined);
    
    render(<GuestbookForm {...mockProps} />);
    
    const nameInput = screen.getByPlaceholderText(/your name/i);
    const messageInput = screen.getByPlaceholderText(/share your wishes/i);
    
    await user.type(nameInput, 'Jane Smith');
    await user.type(messageInput, 'Great celebration!');
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
    
    // Form should be cleared
    expect(nameInput).toHaveValue('');
    expect(messageInput).toHaveValue('');
  });

  it('disables submit button when loading', () => {
    // Create a separate mock for this test
    const mockAddGuestbookEntryLoading = vi.fn();
    
    // Mock the store module to return loading: true
    vi.doMock('../../stores/invitationStore', () => ({
      useInvitationStore: () => ({
        addGuestbookEntry: mockAddGuestbookEntryLoading,
        loading: true
      })
    }));

    // We need to clear the module cache and re-import the component
    // to pick up the new mock
    vi.resetModules();
    
    // Dynamically import the component with the new mock
    return import('../GuestbookForm').then(module => {
      const GuestbookFormWithLoading = module.default;
      
      render(<GuestbookFormWithLoading {...mockProps} />);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });
  });
});