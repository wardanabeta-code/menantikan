// Invitation store for managing invitation data and interactions
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  Invitation, 
  RSVP, 
  GuestbookEntry, 
  InvitationAnalytics 
} from '../types';
import { 
  getInvitationBySlug,
  getInvitationRSVPs,
  getGuestbookEntries,
  submitRSVP,
  submitGuestbookEntry,
  trackInvitationView,
  subscribeToInvitation,
  subscribeToGuestbook
} from '../lib/firestore';

interface InvitationState {
  invitation: Invitation | null;
  rsvps: RSVP[];
  guestbookEntries: GuestbookEntry[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  unsubscribers: Array<() => void>;
}

interface InvitationActions {
  loadInvitationBySlug: (slug: string) => Promise<void>;
  loadRSVPs: (invitationId: string) => Promise<void>;
  loadGuestbookEntries: (invitationId: string) => Promise<void>;
  submitGuestRSVP: (rsvpData: Omit<RSVP, 'rsvpId' | 'submittedAt'>) => Promise<void>;
  submitGuestbookMessage: (entryData: Omit<GuestbookEntry, 'entryId' | 'submittedAt' | 'moderationStatus'>) => Promise<void>;
  trackView: (invitationId: string) => Promise<void>;
  subscribeToUpdates: (invitationId: string) => void;
  unsubscribeFromUpdates: () => void;
  resetInvitation: () => void;
  setError: (error: string | null) => void;
}

type InvitationStore = InvitationState & InvitationActions;

export const useInvitationStore = create<InvitationStore>()(
  devtools(
    (set, get) => ({
      // State
      invitation: null,
      rsvps: [],
      guestbookEntries: [],
      isLoading: false,
      isSubmitting: false,
      error: null,
      unsubscribers: [],

      // Actions
      loadInvitationBySlug: async (slug: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const invitation = await getInvitationBySlug(slug);
          if (!invitation) {
            throw new Error('Invitation not found');
          }

          set({
            invitation,
            isLoading: false
          });

          // Track the view
          await get().trackView(invitation.invitationId);
          
          // Set up real-time subscriptions
          get().subscribeToUpdates(invitation.invitationId);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load invitation',
            isLoading: false
          });
        }
      },

      loadRSVPs: async (invitationId: string) => {
        try {
          const rsvps = await getInvitationRSVPs(invitationId);
          set({ rsvps });
        } catch (error) {
          console.error('Error loading RSVPs:', error);
        }
      },

      loadGuestbookEntries: async (invitationId: string) => {
        try {
          const entries = await getGuestbookEntries(invitationId);
          set({ guestbookEntries: entries });
        } catch (error) {
          console.error('Error loading guestbook entries:', error);
        }
      },

      submitGuestRSVP: async (rsvpData: Omit<RSVP, 'rsvpId' | 'submittedAt'>) => {
        set({ isSubmitting: true, error: null });
        
        try {
          await submitRSVP(rsvpData);
          
          // Reload RSVPs to get the updated list
          await get().loadRSVPs(rsvpData.invitationId);
          
          set({ isSubmitting: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to submit RSVP',
            isSubmitting: false
          });
        }
      },

      submitGuestbookMessage: async (entryData: Omit<GuestbookEntry, 'entryId' | 'submittedAt' | 'moderationStatus'>) => {
        set({ isSubmitting: true, error: null });
        
        try {
          await submitGuestbookEntry(entryData);
          
          // The real-time subscription will update the guestbook entries
          set({ isSubmitting: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to submit message',
            isSubmitting: false
          });
        }
      },

      trackView: async (invitationId: string) => {
        try {
          await trackInvitationView(invitationId);
        } catch (error) {
          console.error('Error tracking view:', error);
        }
      },

      subscribeToUpdates: (invitationId: string) => {
        // Unsubscribe from any existing subscriptions
        get().unsubscribeFromUpdates();
        
        const unsubscribers: Array<() => void> = [];

        // Subscribe to invitation updates
        const invitationUnsub = subscribeToInvitation(invitationId, (invitation) => {
          set({ invitation });
        });
        unsubscribers.push(invitationUnsub);

        // Subscribe to guestbook updates
        const guestbookUnsub = subscribeToGuestbook(invitationId, (entries) => {
          set({ guestbookEntries: entries });
        });
        unsubscribers.push(guestbookUnsub);

        set({ unsubscribers });
      },

      unsubscribeFromUpdates: () => {
        const { unsubscribers } = get();
        unsubscribers.forEach(unsub => unsub());
        set({ unsubscribers: [] });
      },

      resetInvitation: () => {
        get().unsubscribeFromUpdates();
        set({
          invitation: null,
          rsvps: [],
          guestbookEntries: [],
          isLoading: false,
          isSubmitting: false,
          error: null,
          unsubscribers: []
        });
      },

      setError: (error: string | null) => {
        set({ error });
      }
    }),
    { name: 'invitation-store' }
  )
);

// Auto-cleanup when store is unmounted
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    const store = useInvitationStore.getState();
    store.unsubscribeFromUpdates();
  });
}