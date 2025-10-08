import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase (Auth and Firestore only)
vi.mock('./lib/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
    signInWithPopup: vi.fn(),
    signOut: vi.fn()
  },
  db: {
    collection: vi.fn(() => ({
      doc: vi.fn(() => ({
        get: vi.fn(),
        set: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        onSnapshot: vi.fn()
      })),
      add: vi.fn(),
      where: vi.fn(() => ({
        orderBy: vi.fn(() => ({
          onSnapshot: vi.fn()
        }))
      }))
    }))
  },
  googleProvider: {}
}));

// Mock Cloudinary
vi.mock('./lib/cloudinary', () => ({
  uploadFile: vi.fn(),
  uploadMultipleFiles: vi.fn(),
  deleteFile: vi.fn(),
  getOptimizedImageUrl: vi.fn(),
  uploadInvitationBackground: vi.fn(),
  uploadGalleryImages: vi.fn(),
  uploadBackgroundMusic: vi.fn(),
  uploadUserProfilePicture: vi.fn(),
  CloudinaryFolders: {
    INVITATIONS: 'menantikan/invitations',
    TEMPLATES: 'menantikan/templates',
    USERS: 'menantikan/users',
    GALLERY: 'menantikan/gallery',
    BACKGROUNDS: 'menantikan/backgrounds',
    MUSIC: 'menantikan/music'
  }
}));

// Mock React Router
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn(),
  useParams: () => ({ slug: 'test-invitation' }),
  useLocation: () => ({ pathname: '/test' })
}));

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const React = require('react');
      return React.createElement('div', props, children);
    },
    section: ({ children, ...props }: any) => {
      const React = require('react');
      return React.createElement('section', props, children);
    },
    button: ({ children, ...props }: any) => {
      const React = require('react');
      return React.createElement('button', props, children);
    },
    form: ({ children, ...props }: any) => {
      const React = require('react');
      return React.createElement('form', props, children);
    }
  },
  AnimatePresence: ({ children }: any) => children
}));

// Set up global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});