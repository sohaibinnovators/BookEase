export type BookingStatus =
  | "confirmed"
  | "pending"
  | "completed"
  | "cancelled"
  | "rescheduled";

export type RequestStatus = "new" | "accepted" | "declined";

export type ServiceSort = "recommended" | "price-asc" | "price-desc" | "rating-desc";
export type ProviderSort = "recommended" | "rating-desc" | "experience-desc";
export type ViewMode = "grid" | "list";

export interface WorkingHours {
  day: string;
  hours: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  demoLabel: string;
  /** Present on customer-submitted demo reviews */
  bookingId?: string;
  serviceId?: string;
  providerId?: string;
  customerEmail?: string;
  editable?: boolean;
}

export type BookingEventType =
  | "created"
  | "confirmed"
  | "rescheduled"
  | "cancelled"
  | "completed"
  | "reviewed";

export interface BookingEvent {
  id: string;
  type: BookingEventType;
  at: string;
  note?: string;
}

export type NotificationAudience = "customer" | "provider" | "both";

export type NotificationType =
  | "booking_confirmed"
  | "booking_cancelled"
  | "booking_status"
  | "booking_rescheduled"
  | "upcoming_reminder"
  | "review_submitted"
  | "provider_update"
  | "service_update"
  | "availability_update";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
  createdAt: string;
  read: boolean;
  audience: NotificationAudience;
  /** Stable key so refreshes do not create duplicates */
  eventKey: string;
}

export interface FavoritesState {
  serviceIds: string[];
  providerIds: string[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  image: string;
}

export interface Provider {
  id: string;
  slug: string;
  name: string;
  title: string;
  bio: string;
  rating: number;
  reviewCount: number;
  location: string;
  experienceYears: number;
  responseTime: string;
  specialties: string[];
  categoryIds: string[];
  image: string;
  coverImage: string;
  verified: boolean;
  hourlyRate: number;
  workingHours: WorkingHours[];
  reviews: Review[];
  featured?: boolean;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  providerId: string;
  description: string;
  longDescription: string;
  durationMinutes: number;
  price: number;
  rating: number;
  reviewCount: number;
  location: string;
  image: string;
  images: string[];
  tags: string[];
  featured: boolean;
  popular: boolean;
  availabilityNote: string;
  nextAvailable: string;
  reviews: Review[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image: string;
  demoLabel: string;
}

/** Phase 3 booking record — shared by customer and provider views. */
export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  providerId: string;
  providerName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  /** @deprecated Prefer startTime — kept for older UI reads */
  time: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  price: number;
  total: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  /** Activity timeline — optional for older seed records */
  timeline?: BookingEvent[];
  reviewedAt?: string;
}

export interface TimeSlot {
  time: string;
  endTime?: string;
  available: boolean;
  reason?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ServiceFilters {
  q: string;
  category: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  duration: string;
  featured: boolean;
  popular: boolean;
  sort: ServiceSort;
  view: ViewMode;
  page: number;
}

export interface ProviderFilters {
  q: string;
  category: string;
  location: string;
  minRating: string;
  sort: ProviderSort;
  page: number;
}

export interface CreateBookingInput {
  serviceId: string;
  providerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  startTime: string;
  notes?: string;
}

export interface CustomerProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  memberSince: string;
}

export interface ProviderProfile extends Provider {
  contactEmail: string;
  contactPhone: string;
}

export interface ScheduleBreak {
  start: string;
  end: string;
}

export interface DaySchedule {
  day: string;
  enabled: boolean;
  openTime: string;
  closeTime: string;
  breaks: ScheduleBreak[];
}

export interface ProviderSchedule {
  providerId: string;
  weekly: DaySchedule[];
  unavailableDates: string[];
  updatedAt: string;
}

export interface ServiceInput {
  name: string;
  description: string;
  longDescription?: string;
  categoryId: string;
  price: number;
  durationMinutes: number;
  location: string;
  image: string;
  featured?: boolean;
  popular?: boolean;
  tags?: string[];
}
