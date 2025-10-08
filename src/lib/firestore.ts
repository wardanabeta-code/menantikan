// Firestore database operations
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  Timestamp,
  DocumentSnapshot,
  QuerySnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { 
  Invitation, 
  RSVP, 
  GuestbookEntry, 
  Template,
  PaginatedResponse,
  InvitationFormData 
} from '../types';

// Collection references
export const COLLECTIONS = {
  USERS: 'users',
  INVITATIONS: 'invitations',
  TEMPLATES: 'templates',
  RSVPS: 'rsvps',
  GUESTBOOK: 'guestbook'
} as const;

// Helper function to convert Firestore timestamp to Date
export const timestampToDate = (timestamp: any): Date => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date(timestamp);
};

// INVITATION OPERATIONS

// Create a new invitation
export const createInvitation = async (
  ownerUid: string, 
  invitationData: InvitationFormData
): Promise<string> => {
  try {
    const invitationRef = collection(db, COLLECTIONS.INVITATIONS);
    const docRef = await addDoc(invitationRef, {
      ownerUid,
      ...invitationData,
      status: 'draft',
      slug: generateSlug(invitationData.title),
      analytics: {
        views: 0,
        uniqueVisitors: 0,
        rsvpCount: 0,
        guestbookEntries: 0,
        socialShares: 0,
        lastUpdated: serverTimestamp()
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating invitation:', error);
    throw error;
  }
};

// Get invitation by ID
export const getInvitation = async (invitationId: string): Promise<Invitation | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.INVITATIONS, invitationId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        invitationId: docSnap.id,
        eventDate: timestampToDate(data.eventDate),
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt),
        publishedAt: data.publishedAt ? timestampToDate(data.publishedAt) : undefined
      } as Invitation;
    }
    return null;
  } catch (error) {
    console.error('Error getting invitation:', error);
    throw error;
  }
};

// Get invitation by slug
export const getInvitationBySlug = async (slug: string): Promise<Invitation | null> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.INVITATIONS),
      where('slug', '==', slug),
      where('status', '==', 'published')
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        ...data,
        invitationId: doc.id,
        eventDate: timestampToDate(data.eventDate),
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt),
        publishedAt: data.publishedAt ? timestampToDate(data.publishedAt) : undefined
      } as Invitation;
    }
    return null;
  } catch (error) {
    console.error('Error getting invitation by slug:', error);
    throw error;
  }
};

// Get user's invitations
export const getUserInvitations = async (
  ownerUid: string, 
  page: number = 1, 
  pageSize: number = 10
): Promise<PaginatedResponse<Invitation>> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.INVITATIONS),
      where('ownerUid', '==', ownerUid),
      orderBy('updatedAt', 'desc'),
      limit(pageSize)
    );
    
    const querySnapshot = await getDocs(q);
    const invitations: Invitation[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      invitations.push({
        ...data,
        invitationId: doc.id,
        eventDate: timestampToDate(data.eventDate),
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt),
        publishedAt: data.publishedAt ? timestampToDate(data.publishedAt) : undefined
      } as Invitation);
    });
    
    return {
      data: invitations,
      pagination: {
        page,
        limit: pageSize,
        total: invitations.length, // This is a simplified implementation
        hasNext: invitations.length === pageSize,
        hasPrev: page > 1
      }
    };
  } catch (error) {
    console.error('Error getting user invitations:', error);
    throw error;
  }
};

// Update invitation
export const updateInvitation = async (
  invitationId: string, 
  updates: Partial<Invitation>
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.INVITATIONS, invitationId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating invitation:', error);
    throw error;
  }
};

// Publish invitation
export const publishInvitation = async (invitationId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.INVITATIONS, invitationId);
    await updateDoc(docRef, {
      status: 'published',
      publishedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error publishing invitation:', error);
    throw error;
  }
};

// Delete invitation
export const deleteInvitation = async (invitationId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.INVITATIONS, invitationId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting invitation:', error);
    throw error;
  }
};

// RSVP OPERATIONS

// Submit RSVP
export const submitRSVP = async (rsvpData: Omit<RSVP, 'rsvpId' | 'submittedAt'>): Promise<string> => {
  try {
    const rsvpRef = collection(db, COLLECTIONS.INVITATIONS, rsvpData.invitationId, COLLECTIONS.RSVPS);
    const docRef = await addDoc(rsvpRef, {
      ...rsvpData,
      submittedAt: serverTimestamp()
    });
    
    // Update invitation RSVP count
    await updateInvitationAnalytics(rsvpData.invitationId, { rsvpCount: 1 });
    
    return docRef.id;
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    throw error;
  }
};

// Get RSVPs for invitation
export const getInvitationRSVPs = async (invitationId: string): Promise<RSVP[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.INVITATIONS, invitationId, COLLECTIONS.RSVPS),
      orderBy('submittedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const rsvps: RSVP[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      rsvps.push({
        ...data,
        rsvpId: doc.id,
        submittedAt: timestampToDate(data.submittedAt)
      } as RSVP);
    });
    
    return rsvps;
  } catch (error) {
    console.error('Error getting RSVPs:', error);
    throw error;
  }
};

// GUESTBOOK OPERATIONS

// Submit guestbook entry
export const submitGuestbookEntry = async (
  entryData: Omit<GuestbookEntry, 'entryId' | 'submittedAt' | 'moderationStatus'>
): Promise<string> => {
  try {
    const guestbookRef = collection(db, COLLECTIONS.INVITATIONS, entryData.invitationId, COLLECTIONS.GUESTBOOK);
    const docRef = await addDoc(guestbookRef, {
      ...entryData,
      submittedAt: serverTimestamp(),
      moderationStatus: 'approved' // Auto-approve for now
    });
    
    // Update invitation guestbook count
    await updateInvitationAnalytics(entryData.invitationId, { guestbookEntries: 1 });
    
    return docRef.id;
  } catch (error) {
    console.error('Error submitting guestbook entry:', error);
    throw error;
  }
};

// Get guestbook entries for invitation
export const getGuestbookEntries = async (invitationId: string): Promise<GuestbookEntry[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.INVITATIONS, invitationId, COLLECTIONS.GUESTBOOK),
      where('moderationStatus', '==', 'approved'),
      orderBy('submittedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const entries: GuestbookEntry[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      entries.push({
        ...data,
        entryId: doc.id,
        submittedAt: timestampToDate(data.submittedAt)
      } as GuestbookEntry);
    });
    
    return entries;
  } catch (error) {
    console.error('Error getting guestbook entries:', error);
    throw error;
  }
};

// TEMPLATE OPERATIONS

// Get all templates
export const getTemplates = async (): Promise<Template[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.TEMPLATES),
      orderBy('popularity', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const templates: Template[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      templates.push({
        ...data,
        templateId: doc.id
      } as Template);
    });
    
    return templates;
  } catch (error) {
    console.error('Error getting templates:', error);
    throw error;
  }
};

// Get template by ID
export const getTemplate = async (templateId: string): Promise<Template | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.TEMPLATES, templateId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        templateId: docSnap.id
      } as Template;
    }
    return null;
  } catch (error) {
    console.error('Error getting template:', error);
    throw error;
  }
};

// ANALYTICS HELPERS

// Update invitation analytics
const updateInvitationAnalytics = async (
  invitationId: string, 
  updates: Partial<{ views: number; rsvpCount: number; guestbookEntries: number; socialShares: number }>
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.INVITATIONS, invitationId);
    const currentDoc = await getDoc(docRef);
    
    if (currentDoc.exists()) {
      const currentAnalytics = currentDoc.data().analytics || {};
      const updatedAnalytics = {
        ...currentAnalytics,
        views: (currentAnalytics.views || 0) + (updates.views || 0),
        rsvpCount: (currentAnalytics.rsvpCount || 0) + (updates.rsvpCount || 0),
        guestbookEntries: (currentAnalytics.guestbookEntries || 0) + (updates.guestbookEntries || 0),
        socialShares: (currentAnalytics.socialShares || 0) + (updates.socialShares || 0),
        lastUpdated: serverTimestamp()
      };
      
      await updateDoc(docRef, { analytics: updatedAnalytics });
    }
  } catch (error) {
    console.error('Error updating analytics:', error);
    throw error;
  }
};

// Track invitation view
export const trackInvitationView = async (invitationId: string): Promise<void> => {
  await updateInvitationAnalytics(invitationId, { views: 1 });
};

// REAL-TIME SUBSCRIPTIONS

// Subscribe to invitation updates
export const subscribeToInvitation = (
  invitationId: string, 
  callback: (invitation: Invitation | null) => void
) => {
  const docRef = doc(db, COLLECTIONS.INVITATIONS, invitationId);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      const invitation = {
        ...data,
        invitationId: doc.id,
        eventDate: timestampToDate(data.eventDate),
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt),
        publishedAt: data.publishedAt ? timestampToDate(data.publishedAt) : undefined
      } as Invitation;
      callback(invitation);
    } else {
      callback(null);
    }
  });
};

// Subscribe to guestbook entries
export const subscribeToGuestbook = (
  invitationId: string, 
  callback: (entries: GuestbookEntry[]) => void
) => {
  const q = query(
    collection(db, COLLECTIONS.INVITATIONS, invitationId, COLLECTIONS.GUESTBOOK),
    where('moderationStatus', '==', 'approved'),
    orderBy('submittedAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const entries: GuestbookEntry[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      entries.push({
        ...data,
        entryId: doc.id,
        submittedAt: timestampToDate(data.submittedAt)
      } as GuestbookEntry);
    });
    callback(entries);
  });
};

// UTILITY FUNCTIONS

// Generate URL-friendly slug
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    + '-' + Math.random().toString(36).substr(2, 6);
};

// Check if slug is available
export const isSlugAvailable = async (slug: string): Promise<boolean> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.INVITATIONS),
      where('slug', '==', slug)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  } catch (error) {
    console.error('Error checking slug availability:', error);
    return false;
  }
};