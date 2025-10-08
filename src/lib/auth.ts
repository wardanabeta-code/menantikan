// Authentication service functions
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import type { User, UserPreferences } from '../types';

// Convert Firebase User to our User type
export const mapFirebaseUser = async (firebaseUser: FirebaseUser | null): Promise<User | null> => {
  if (!firebaseUser) return null;

  try {
    // Get additional user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.data();

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || undefined,
      photoURL: firebaseUser.photoURL || undefined,
      subscriptionTier: userData?.subscriptionTier || 'free',
      createdAt: userData?.createdAt?.toDate() || new Date(),
      preferences: userData?.preferences || getDefaultPreferences()
    };
  } catch (error) {
    console.error('Error mapping Firebase user:', error);
    return null;
  }
};

// Default user preferences
export const getDefaultPreferences = (): UserPreferences => ({
  language: 'en',
  theme: 'auto',
  emailNotifications: true,
  defaultTemplateStyle: 'modern'
});

// Sign in with Google
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Create or update user document in Firestore
    await createOrUpdateUserDocument(user);
    
    return await mapFirebaseUser(user);
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<User | null> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return await mapFirebaseUser(result.user);
  } catch (error) {
    console.error('Error signing in with email:', error);
    throw error;
  }
};

// Sign up with email and password
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<User | null> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name
    await updateProfile(result.user, { displayName });
    
    // Create user document in Firestore
    await createOrUpdateUserDocument(result.user);
    
    return await mapFirebaseUser(result.user);
  } catch (error) {
    console.error('Error signing up with email:', error);
    throw error;
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Create or update user document in Firestore
const createOrUpdateUserDocument = async (firebaseUser: FirebaseUser): Promise<void> => {
  if (!firebaseUser) return;

  const userRef = doc(db, 'users', firebaseUser.uid);
  const userDoc = await getDoc(userRef);

  const userData = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    lastLoginAt: new Date(),
    updatedAt: new Date()
  };

  if (!userDoc.exists()) {
    // Create new user document
    await setDoc(userRef, {
      ...userData,
      subscriptionTier: 'free',
      preferences: getDefaultPreferences(),
      createdAt: new Date()
    });
  } else {
    // Update existing user document
    await updateDoc(userRef, userData);
  }
};

// Update user preferences
export const updateUserPreferences = async (
  uid: string, 
  preferences: Partial<UserPreferences>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      preferences,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
};

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    const user = await mapFirebaseUser(firebaseUser);
    callback(user);
  });
};

// Get current user
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      unsubscribe();
      const user = await mapFirebaseUser(firebaseUser);
      resolve(user);
    });
  });
};