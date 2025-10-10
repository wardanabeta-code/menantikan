// TypeScript interfaces for the Menantikan platform

// User-related interfaces
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  subscriptionTier: 'free' | 'premium' | 'enterprise';
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  emailNotifications: boolean;
  defaultTemplateStyle: string;
}

// Template-related interfaces
export interface Template {
  templateId: string;
  category: TemplateCategory;
  name: string;
  description: string;
  baseConfig: TemplateConfig;
  previewImage: string;
  isPremium: boolean;
  createdBy: string;
  tags: string[];
  popularity: number;
}

export type TemplateCategory = 
  | 'wedding' 
  | 'birthday' 
  | 'corporate' 
  | 'anniversary' 
  | 'graduation' 
  | 'baby-shower' 
  | 'holiday' 
  | 'other';

export interface TemplateConfig {
  layout: LayoutConfig;
  colors: ColorConfig;
  typography: TypographyConfig;
  sections: SectionConfig[];
  animations: AnimationConfig;
}

export interface LayoutConfig {
  maxWidth: string;
  padding: string;
  spacing: string;
  borderRadius: string;
}

export interface ColorConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textSecondary: string;
  border: string;
}

export interface TypographyConfig {
  fontFamily: string;
  headingFont: string;
  bodyFont: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
}

export interface SectionConfig {
  id: string;
  type: SectionType;
  isVisible: boolean;
  order: number;
  content: Record<string, any>;
  style: Record<string, any>;
}

export type SectionType = 
  | 'hero' 
  | 'story' 
  | 'event-details' 
  | 'rsvp' 
  | 'gallery' 
  | 'guestbook' 
  | 'map' 
  | 'countdown'
  | 'gift'
  | 'closing'
  | 'bride-groom-details'
  | 'sacred-text'
  | 'blessing'
  | 'wishes'
  | 'wishes-messages';

export interface AnimationConfig {
  enabled: boolean;
  duration: number;
  easing: string;
  staggerDelay: number;
  entranceAnimation?: string;
  hoverEffects?: boolean;
  parallaxScrolling?: boolean;
  particleEffects?: {
    enabled: boolean;
    type: string;
    density: string;
    colors: string[];
  };
  transitionEffects?: {
    sectionTransition: string;
    imageTransition: string;
    textTransition: string;
  };
}

// Invitation-related interfaces
export interface Invitation {
  invitationId: string;
  ownerUid: string;
  templateId: string;
  slug: string;
  status: InvitationStatus;
  title: string;
  eventDate: Date;
  customTheme: Partial<TemplateConfig>;
  content: InvitationContent;
  settings: InvitationSettings;
  analytics: InvitationAnalytics;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export type InvitationStatus = 'draft' | 'published' | 'archived' | 'expired';

export interface InvitationContent {
  heroSection: HeroContent;
  storySection?: StoryContent;
  eventDetails: EventDetails;
  gallerySection?: GalleryContent;
  giftSection?: GiftContent;
  closingSection?: ClosingContent;
  brideGroomDetailsSection?: BrideGroomDetailsContent;
  sacredTextSection?: SacredTextContent;
  countdownSection?: CountdownContent;
  wishesSection?: WishesContent;
  customSections?: CustomSection[];
}

export interface HeroContent {
  coupleNames?: string[];
  backgroundImage?: string;
  backgroundVideo?: string;
}

export interface StoryContent {
  title?: string;
  timeline: TimelineItem[];
}

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
}

export interface EventDetails {
  ceremony?: EventInfo;
  reception?: EventInfo;
  additionalEvents?: EventInfo[];
}

export interface EventInfo {
  name: string;
  date: Date | string;
  time: string;
  venue: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  dressCode?: string;
  notes?: string;
}

export interface GalleryContent {
  title?: string;
  images: GalleryImage[];
  layout: 'grid' | 'masonry' | 'carousel';
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  thumbnail?: string;
}

export interface CustomSection {
  id: string;
  type: string;
  title: string;
  content: Record<string, any>;
}

export interface GiftContent {
  // User-related data only (bank accounts, e-wallets, shipping address)
  bankAccounts?: BankAccount[];
  ewallets?: Ewallet[];
  shippingAddress?: ShippingAddress;
  showBankAccounts: boolean;
  showEwallets: boolean;
  showShippingAddress: boolean;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankCode?: string;
}

export interface Ewallet {
  id: string;
  provider: string; // 'gopay', 'ovo', 'dana', 'shopeepay', etc
  phoneNumber?: string;
  accountName: string;
  qrCodeUrl?: string;
}

export interface ShippingAddress {
  recipientName: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  country: string;
  phoneNumber?: string;
  notes?: string;
}

export interface ClosingContent {
  // User-related data only (signature names, background image)
  signatureNames?: string[];
  backgroundImage?: string;
  includeThankYou: boolean;
}

export interface InvitationSettings {
  isPublic: boolean;
  requireRSVP: boolean;
  allowGuestbook: boolean;
  allowPlusOnes: boolean;
  customDomain?: string;
  password?: string;
  maxGuests?: number;
  rsvpDeadline?: Date;
  backgroundMusic?: string;
}

export interface InvitationAnalytics {
  views: number;
  uniqueVisitors: number;
  rsvpCount: number;
  guestbookEntries: number;
  socialShares: number;
  lastUpdated: Date;
}

// RSVP-related interfaces
export interface RSVP {
  rsvpId: string;
  invitationId: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  attendanceStatus: AttendanceStatus;
  plusOnes: number;
  plusOneNames?: string[];
  dietaryRestrictions?: string;
  specialRequests?: string;
  message?: string;
  submittedAt: Date;
  events: {
    [eventId: string]: boolean;
  };
}

export type AttendanceStatus = 'attending' | 'not-attending' | 'maybe';

// Guestbook-related interfaces
export interface GuestbookEntry {
  entryId: string;
  invitationId: string;
  authorName: string;
  authorEmail?: string;
  message: string;
  submittedAt: Date;
  moderationStatus: ModerationStatus;
  replyTo?: string;
  isOwnerReply?: boolean;
}

export type ModerationStatus = 'pending' | 'approved' | 'rejected';

// Dashboard and analytics interfaces
export interface DashboardStats {
  totalInvitations: number;
  totalViews: number;
  totalRSVPs: number;
  totalGuestbookEntries: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  invitationId: string;
  invitationTitle: string;
  description: string;
  timestamp: Date;
}

export type ActivityType = 
  | 'invitation_created' 
  | 'invitation_published' 
  | 'rsvp_received' 
  | 'guestbook_entry' 
  | 'invitation_viewed';

// API response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form interfaces
export interface InvitationFormData {
  title: string;
  eventDate: string;
  templateId: string;
  heroContent: Partial<HeroContent>;
  eventDetails: Partial<EventDetails>;
  settings: Partial<InvitationSettings>;
}

export interface RSVPFormData {
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  attendanceStatus: AttendanceStatus;
  plusOnes: number;
  plusOneNames?: string[];
  dietaryRestrictions?: string;
  specialRequests?: string;
  message?: string;
  events: {
    [eventId: string]: boolean;
  };
}

export interface GuestbookFormData {
  authorName: string;
  authorEmail?: string;
  message: string;
  replyTo?: string;
}

// Error interfaces
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Timestamp = Date | { seconds: number; nanoseconds: number };

// Firebase document interfaces
export interface FirebaseDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Theme and styling interfaces
export interface ThemeColors {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface CustomTheme {
  colors: {
    primary: ThemeColors;
    secondary: ThemeColors;
    accent: ThemeColors;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
}

export interface BrideGroomDetailsContent {
  // User-related data only
  bride: BrideGroomDetail;
  groom: BrideGroomDetail;
}

export interface BrideGroomDetail {
  fullName: string;
  nickname: string;
  instagram?: string;
  childOrder: number;
  fatherName: string;
  motherName: string;
  profileImage?: string;
  bio?: string;
}

export interface SacredTextContent {
  // User-related data only (the text itself is user-provided)
  text: string;
  source: string;
  isIslamic: boolean;
  reference?: string;
}

export interface CountdownContent {
  // User-related data only
  targetEvent: 'ceremony' | 'reception' | 'custom';
  customDate?: Date;
}

export interface WishesContent {
  // User-related configuration only
  showForm: boolean;
  showEntries: boolean;
  entriesPerPage: number;
}
