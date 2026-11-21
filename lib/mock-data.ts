import type {
  Booking,
  Category,
  FaqItem,
  Provider,
  Review,
  Service,
  Testimonial,
  TimeSlot,
} from "./types";

const demoReview = (
  id: string,
  author: string,
  rating: number,
  comment: string,
  date: string,
): Review => ({
  id,
  author,
  rating,
  comment,
  date,
  demoLabel: "Demo review",
});

export const categories: Category[] = [
  {
    id: "cat-health",
    slug: "health-wellness",
    name: "Healthcare & Wellness",
    description: "Medical consultations, therapy, and preventive care.",
    icon: "heart",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "cat-beauty",
    slug: "beauty-salon",
    name: "Beauty & Salon",
    description: "Hair, skin, makeup, and grooming appointments.",
    icon: "spark",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "cat-fitness",
    slug: "fitness-training",
    name: "Fitness & Personal Training",
    description: "Personal training, yoga, and performance coaching.",
    icon: "fitness",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "cat-home",
    slug: "home-services",
    name: "Home Services",
    description: "Cleaning, repairs, and trusted home professionals.",
    icon: "home",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "cat-photo",
    slug: "photography",
    name: "Photography",
    description: "Portrait, event, and product photography sessions.",
    icon: "camera",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "cat-education",
    slug: "education-coaching",
    name: "Education & Coaching",
    description: "Tutoring, language lessons, and career coaching.",
    icon: "book",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "cat-business",
    slug: "business-consulting",
    name: "Business Consulting",
    description: "Strategy sessions, operations advice, and planning.",
    icon: "briefcase",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80",
  },
];

const weekdayHours: Provider["workingHours"] = [
  { day: "Monday", hours: "9:00 AM – 6:00 PM" },
  { day: "Tuesday", hours: "9:00 AM – 6:00 PM" },
  { day: "Wednesday", hours: "9:00 AM – 6:00 PM" },
  { day: "Thursday", hours: "9:00 AM – 6:00 PM" },
  { day: "Friday", hours: "9:00 AM – 5:00 PM" },
  { day: "Saturday", hours: "10:00 AM – 2:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

export const providers: Provider[] = [
  {
    id: "prov-1",
    slug: "amelia-chen",
    name: "Dr. Amelia Chen",
    title: "Primary Care Physician",
    bio: "Board-certified physician focused on preventive care and clear patient communication. Amelia helps busy professionals stay ahead of health goals with flexible appointment windows.",
    rating: 4.9,
    reviewCount: 214,
    location: "San Francisco, CA",
    experienceYears: 12,
    responseTime: "Under 1 hour",
    specialties: ["Preventive Care", "Telehealth", "Chronic Care"],
    categoryIds: ["cat-health"],
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=80",
    verified: true,
    hourlyRate: 180,
    workingHours: weekdayHours,
    featured: true,
    reviews: [
      demoReview("pr1-r1", "Taylor M.", 5, "Thorough, calm, and easy to book.", "2026-10-12"),
      demoReview("pr1-r2", "Chris D.", 5, "Clear follow-up plan after every visit.", "2026-09-03"),
    ],
  },
  {
    id: "prov-2",
    slug: "marcus-reid",
    name: "Marcus Reid",
    title: "Senior Stylist",
    bio: "Award-winning stylist specializing in precision cuts and color correction. Marcus builds looks that fit your lifestyle—not just the mirror.",
    rating: 4.8,
    reviewCount: 168,
    location: "Austin, TX",
    experienceYears: 9,
    responseTime: "Under 2 hours",
    specialties: ["Haircuts", "Color", "Bridal Styling"],
    categoryIds: ["cat-beauty"],
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=80",
    verified: true,
    hourlyRate: 95,
    workingHours: [
      { day: "Monday", hours: "Closed" },
      { day: "Tuesday", hours: "10:00 AM – 7:00 PM" },
      { day: "Wednesday", hours: "10:00 AM – 7:00 PM" },
      { day: "Thursday", hours: "10:00 AM – 7:00 PM" },
      { day: "Friday", hours: "10:00 AM – 7:00 PM" },
      { day: "Saturday", hours: "9:00 AM – 4:00 PM" },
      { day: "Sunday", hours: "Closed" },
    ],
    featured: true,
    reviews: [
      demoReview("pr2-r1", "Jordan P.", 5, "Best cut I've had in years.", "2026-11-01"),
    ],
  },
  {
    id: "prov-3",
    slug: "sofia-martinez",
    name: "Sofia Martinez",
    title: "Certified Personal Trainer",
    bio: "Strength coach and mobility specialist helping clients build sustainable fitness habits. Sessions blend coaching, recovery, and measurable progress.",
    rating: 4.9,
    reviewCount: 142,
    location: "Denver, CO",
    experienceYears: 7,
    responseTime: "Same day",
    specialties: ["Strength", "Mobility", "Nutrition Basics"],
    categoryIds: ["cat-fitness"],
    image:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=600&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80",
    verified: true,
    hourlyRate: 75,
    workingHours: weekdayHours,
    featured: true,
    reviews: [
      demoReview("pr3-r1", "Alex R.", 5, "Form cues that finally clicked.", "2026-10-28"),
    ],
  },
  {
    id: "prov-4",
    slug: "james-okafor",
    name: "James Okafor",
    title: "Home Systems Specialist",
    bio: "Licensed technician for plumbing, electrical touch-ups, and smart-home setup. Clear estimates, tidy work, and reliable follow-through.",
    rating: 4.7,
    reviewCount: 97,
    location: "Chicago, IL",
    experienceYears: 11,
    responseTime: "Under 3 hours",
    specialties: ["Plumbing", "Electrical", "Smart Home"],
    categoryIds: ["cat-home"],
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1400&q=80",
    verified: true,
    hourlyRate: 85,
    workingHours: weekdayHours,
    reviews: [
      demoReview("pr4-r1", "Sam K.", 5, "Showed up on time and explained everything.", "2026-09-18"),
    ],
  },
  {
    id: "prov-5",
    slug: "priya-nair",
    name: "Priya Nair",
    title: "Academic Tutor & Coach",
    bio: "STEM tutor and college admissions coach with a calm, structured approach. Priya turns complex topics into clear weekly wins.",
    rating: 5.0,
    reviewCount: 121,
    location: "Boston, MA",
    experienceYears: 8,
    responseTime: "Under 1 hour",
    specialties: ["Math", "Physics", "College Prep"],
    categoryIds: ["cat-education"],
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1400&q=80",
    verified: true,
    hourlyRate: 65,
    workingHours: [
      { day: "Monday", hours: "3:00 PM – 8:00 PM" },
      { day: "Tuesday", hours: "3:00 PM – 8:00 PM" },
      { day: "Wednesday", hours: "3:00 PM – 8:00 PM" },
      { day: "Thursday", hours: "3:00 PM – 8:00 PM" },
      { day: "Friday", hours: "3:00 PM – 7:00 PM" },
      { day: "Saturday", hours: "10:00 AM – 2:00 PM" },
      { day: "Sunday", hours: "Closed" },
    ],
    featured: true,
    reviews: [
      demoReview("pr5-r1", "Parent of Maya", 5, "Grades improved within a month.", "2026-10-05"),
    ],
  },
  {
    id: "prov-6",
    slug: "daniel-brooks",
    name: "Daniel Brooks",
    title: "Business Strategy Consultant",
    bio: "Former operator turned advisor for founders and leadership teams. Daniel focuses on prioritization, go-to-market clarity, and execution rhythm.",
    rating: 4.8,
    reviewCount: 88,
    location: "New York, NY",
    experienceYears: 14,
    responseTime: "Same day",
    specialties: ["Strategy", "Operations", "Fundraising Prep"],
    categoryIds: ["cat-business"],
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
    verified: true,
    hourlyRate: 220,
    workingHours: weekdayHours,
    featured: true,
    reviews: [
      demoReview("pr6-r1", "Founder, Northline", 5, "Left with a clear 30-day plan.", "2026-08-22"),
    ],
  },
  {
    id: "prov-7",
    slug: "lena-torres",
    name: "Lena Torres",
    title: "Portrait & Event Photographer",
    bio: "Documentary-style photographer capturing natural moments for families, brands, and celebrations. Sessions feel relaxed and directed without stiff posing.",
    rating: 4.9,
    reviewCount: 76,
    location: "Los Angeles, CA",
    experienceYears: 10,
    responseTime: "Under 2 hours",
    specialties: ["Portraits", "Events", "Brand Shoots"],
    categoryIds: ["cat-photo"],
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1400&q=80",
    verified: true,
    hourlyRate: 150,
    workingHours: [
      { day: "Monday", hours: "By appointment" },
      { day: "Tuesday", hours: "10:00 AM – 6:00 PM" },
      { day: "Wednesday", hours: "10:00 AM – 6:00 PM" },
      { day: "Thursday", hours: "10:00 AM – 6:00 PM" },
      { day: "Friday", hours: "10:00 AM – 6:00 PM" },
      { day: "Saturday", hours: "9:00 AM – 5:00 PM" },
      { day: "Sunday", hours: "By appointment" },
    ],
    featured: true,
    reviews: [
      demoReview("pr7-r1", "Nina S.", 5, "Beautiful photos and effortless direction.", "2026-11-04"),
    ],
  },
  {
    id: "prov-8",
    slug: "chris-nguyen",
    name: "Chris Nguyen",
    title: "Licensed Wellness Therapist",
    bio: "Therapist supporting stress management, burnout recovery, and healthier routines. Chris combines practical tools with a warm, grounded style.",
    rating: 4.8,
    reviewCount: 103,
    location: "Seattle, WA",
    experienceYears: 9,
    responseTime: "Under 1 hour",
    specialties: ["Stress", "Burnout", "Habit Coaching"],
    categoryIds: ["cat-health"],
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1400&q=80",
    verified: true,
    hourlyRate: 140,
    workingHours: weekdayHours,
    reviews: [
      demoReview("pr8-r1", "Riley H.", 5, "Practical tools I still use daily.", "2026-10-19"),
    ],
  },
  {
    id: "prov-9",
    slug: "aisha-rahman",
    name: "Aisha Rahman",
    title: "Makeup Artist",
    bio: "Editorial and bridal makeup artist known for natural finishes that photograph beautifully. Consultations focus on skin prep and lasting wear.",
    rating: 4.7,
    reviewCount: 64,
    location: "Miami, FL",
    experienceYears: 6,
    responseTime: "Same day",
    specialties: ["Bridal", "Editorial", "Soft Glam"],
    categoryIds: ["cat-beauty"],
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1400&q=80",
    verified: true,
    hourlyRate: 110,
    workingHours: weekdayHours,
    reviews: [
      demoReview("pr9-r1", "Camila V.", 5, "Makeup lasted through a humid outdoor wedding.", "2026-09-27"),
    ],
  },
  {
    id: "prov-10",
    slug: "ethan-cole",
    name: "Ethan Cole",
    title: "Yoga & Mobility Coach",
    bio: "Teacher focused on breath-led mobility and strength for desk workers and athletes. Classes and private sessions emphasize sustainable range of motion.",
    rating: 4.6,
    reviewCount: 58,
    location: "Portland, OR",
    experienceYears: 5,
    responseTime: "Under 4 hours",
    specialties: ["Yoga", "Mobility", "Breathwork"],
    categoryIds: ["cat-fitness"],
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1400&q=80",
    verified: false,
    hourlyRate: 60,
    workingHours: weekdayHours,
    reviews: [
      demoReview("pr10-r1", "Morgan L.", 4, "Great for desk-body tightness.", "2026-11-08"),
    ],
  },
];

export const services: Service[] = [
  {
    id: "svc-1",
    slug: "comprehensive-health-check",
    name: "Comprehensive Health Check",
    categoryId: "cat-health",
    providerId: "prov-1",
    description: "Full wellness review with personalized follow-up plan.",
    longDescription:
      "A thorough consultation covering vitals, lifestyle factors, and preventive screening recommendations. Includes a written care plan and optional telehealth follow-up within 14 days.",
    durationMinutes: 60,
    price: 160,
    rating: 4.9,
    reviewCount: 86,
    location: "San Francisco, CA",
    image:
      "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80",
    ],
    tags: ["In-clinic", "Preventive", "Adults"],
    featured: true,
    popular: true,
    availabilityNote: "Usually available within 3 days",
    nextAvailable: "2026-11-24",
    reviews: [
      demoReview("s1-r1", "Jamie L.", 5, "Clear explanations and helpful plan.", "2026-10-02"),
    ],
  },
  {
    id: "svc-2",
    slug: "virtual-primary-care",
    name: "Virtual Primary Care Visit",
    categoryId: "cat-health",
    providerId: "prov-1",
    description: "Secure video visit for common concerns and prescriptions.",
    longDescription:
      "Connect with Dr. Chen for non-emergency care, medication reviews, and care coordination. Ideal when you need expert guidance without leaving home.",
    durationMinutes: 30,
    price: 95,
    rating: 4.8,
    reviewCount: 132,
    location: "Remote · San Francisco, CA",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80",
    ],
    tags: ["Telehealth", "Same-week"],
    featured: true,
    popular: true,
    availabilityNote: "Same-week telehealth slots",
    nextAvailable: "2026-11-22",
    reviews: [
      demoReview("s2-r1", "Pat S.", 5, "Fast, professional, and convenient.", "2026-11-10"),
    ],
  },
  {
    id: "svc-13",
    slug: "stress-reset-session",
    name: "Stress Reset Therapy Session",
    categoryId: "cat-health",
    providerId: "prov-8",
    description: "One-on-one session focused on stress tools and recovery habits.",
    longDescription:
      "A structured therapy session covering stress mapping, breathing tools, and a weekly reset plan you can actually keep. Suitable for burnout recovery and high-pressure seasons.",
    durationMinutes: 50,
    price: 130,
    rating: 4.8,
    reviewCount: 54,
    location: "Seattle, WA",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80",
    ],
    tags: ["Therapy", "Wellness"],
    featured: false,
    popular: true,
    availabilityNote: "Evening appointments available",
    nextAvailable: "2026-11-25",
    reviews: [
      demoReview("s13-r1", "Harper N.", 5, "Left feeling grounded and clear.", "2026-10-30"),
    ],
  },
  {
    id: "svc-3",
    slug: "signature-cut-style",
    name: "Signature Cut & Style",
    categoryId: "cat-beauty",
    providerId: "prov-2",
    description: "Consultation, precision cut, and finish styling.",
    longDescription:
      "Start with a face-shape and lifestyle consultation, then a tailored cut and polish finish. Perfect for a refresh that still feels like you.",
    durationMinutes: 45,
    price: 78,
    rating: 4.9,
    reviewCount: 74,
    location: "Austin, TX",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1000&q=80",
    ],
    tags: ["Salon", "Hair"],
    featured: true,
    popular: true,
    availabilityNote: "Popular weekend slots fill quickly",
    nextAvailable: "2026-11-26",
    reviews: [
      demoReview("s3-r1", "Casey B.", 5, "Exact cut I asked for.", "2026-11-02"),
    ],
  },
  {
    id: "svc-4",
    slug: "color-correction-session",
    name: "Color Correction Session",
    categoryId: "cat-beauty",
    providerId: "prov-2",
    description: "Custom color balancing with gloss and treatment.",
    longDescription:
      "A detailed color service for faded dye, brassiness, or mismatched tones. Includes bond care and aftercare recommendations.",
    durationMinutes: 120,
    price: 185,
    rating: 4.7,
    reviewCount: 41,
    location: "Austin, TX",
    image:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1000&q=80",
    ],
    tags: ["Color", "Premium"],
    featured: false,
    popular: false,
    availabilityNote: "Book 5–7 days ahead",
    nextAvailable: "2026-11-28",
    reviews: [
      demoReview("s4-r1", "Dana W.", 5, "Fixed brassiness without damage.", "2026-09-14"),
    ],
  },
  {
    id: "svc-14",
    slug: "bridal-soft-glam",
    name: "Bridal Soft Glam Makeup",
    categoryId: "cat-beauty",
    providerId: "prov-9",
    description: "Long-wear soft glam look with skin-first prep.",
    longDescription:
      "Includes consultation, skin prep, soft glam application, and touch-up kit guidance. Ideal for weddings, engagements, and portrait days.",
    durationMinutes: 90,
    price: 165,
    rating: 4.8,
    reviewCount: 39,
    location: "Miami, FL",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1000&q=80",
    ],
    tags: ["Bridal", "Makeup"],
    featured: true,
    popular: false,
    availabilityNote: "Weekend bookings recommended early",
    nextAvailable: "2026-12-01",
    reviews: [
      demoReview("s14-r1", "Elena R.", 5, "Looked natural and lasted all night.", "2026-10-11"),
    ],
  },
  {
    id: "svc-5",
    slug: "strength-foundations",
    name: "Strength Foundations Session",
    categoryId: "cat-fitness",
    providerId: "prov-3",
    description: "1:1 training focused on form, strength, and progress.",
    longDescription:
      "A structured session covering warm-up, compound lifts or bodyweight alternatives, and cooldown. You'll leave with clear cues and next-week targets.",
    durationMinutes: 55,
    price: 70,
    rating: 5.0,
    reviewCount: 63,
    location: "Denver, CO",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80",
    ],
    tags: ["1:1", "Gym"],
    featured: true,
    popular: true,
    availabilityNote: "Evening slots open most weekdays",
    nextAvailable: "2026-11-23",
    reviews: [
      demoReview("s5-r1", "Noah T.", 5, "Best coaching for squat form.", "2026-11-05"),
    ],
  },
  {
    id: "svc-6",
    slug: "mobility-reset",
    name: "Mobility Reset",
    categoryId: "cat-fitness",
    providerId: "prov-3",
    description: "Guided mobility work for desk-bound bodies.",
    longDescription:
      "Target hips, thoracic spine, and shoulders with progressive mobility drills. Great as a recovery day or onboarding session.",
    durationMinutes: 40,
    price: 55,
    rating: 4.8,
    reviewCount: 39,
    location: "Denver, CO",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1000&q=80",
    ],
    tags: ["Recovery", "Beginner-friendly"],
    featured: false,
    popular: true,
    availabilityNote: "Often available same week",
    nextAvailable: "2026-11-22",
    reviews: [
      demoReview("s6-r1", "Ava K.", 5, "My shoulders finally feel freer.", "2026-09-29"),
    ],
  },
  {
    id: "svc-15",
    slug: "private-yoga-flow",
    name: "Private Yoga Flow",
    categoryId: "cat-fitness",
    providerId: "prov-10",
    description: "Breath-led private yoga tailored to your mobility goals.",
    longDescription:
      "A private session blending breathwork, mobility, and flowing sequences. Ethan adjusts intensity for beginners through intermediate practitioners.",
    durationMinutes: 60,
    price: 65,
    rating: 4.6,
    reviewCount: 28,
    location: "Portland, OR",
    image:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=80",
    ],
    tags: ["Yoga", "Private"],
    featured: false,
    popular: false,
    availabilityNote: "Morning and lunchtime options",
    nextAvailable: "2026-11-24",
    reviews: [
      demoReview("s15-r1", "Lee C.", 4, "Calm pacing and useful cues.", "2026-10-21"),
    ],
  },
  {
    id: "svc-7",
    slug: "home-repair-visit",
    name: "Home Repair Visit",
    categoryId: "cat-home",
    providerId: "prov-4",
    description: "On-site diagnosis and fix for common household issues.",
    longDescription:
      "James assesses the issue, explains options clearly, and completes standard repairs when parts are available. Transparent pricing before work begins.",
    durationMinutes: 90,
    price: 120,
    rating: 4.7,
    reviewCount: 58,
    location: "Chicago, IL",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80",
    ],
    tags: ["On-site", "Repairs"],
    featured: true,
    popular: true,
    availabilityNote: "Weekday morning visits preferred",
    nextAvailable: "2026-11-25",
    reviews: [
      demoReview("s7-r1", "Kim O.", 5, "Fixed the leak and cleaned up thoroughly.", "2026-10-08"),
    ],
  },
  {
    id: "svc-8",
    slug: "deep-clean-package",
    name: "Deep Clean Package",
    categoryId: "cat-home",
    providerId: "prov-4",
    description: "Room-by-room deep clean for apartments and homes.",
    longDescription:
      "A detailed cleaning plan covering kitchens, baths, floors, and high-touch surfaces. Ideal before guests arrive or after a move.",
    durationMinutes: 180,
    price: 210,
    rating: 4.6,
    reviewCount: 27,
    location: "Chicago, IL",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80",
    ],
    tags: ["Cleaning", "Home"],
    featured: false,
    popular: false,
    availabilityNote: "Book at least 4 days ahead",
    nextAvailable: "2026-11-29",
    reviews: [
      demoReview("s8-r1", "Omar F.", 4, "Apartment looked brand new.", "2026-08-30"),
    ],
  },
  {
    id: "svc-16",
    slug: "portrait-session",
    name: "Lifestyle Portrait Session",
    categoryId: "cat-photo",
    providerId: "prov-7",
    description: "Natural light portraits for individuals or couples.",
    longDescription:
      "A guided outdoor or studio portrait session with wardrobe coaching and 25 edited images. Perfect for personal branding or family updates.",
    durationMinutes: 75,
    price: 220,
    rating: 4.9,
    reviewCount: 48,
    location: "Los Angeles, CA",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1000&q=80",
    ],
    tags: ["Portraits", "Outdoor"],
    featured: true,
    popular: true,
    availabilityNote: "Golden-hour slots book fastest",
    nextAvailable: "2026-11-27",
    reviews: [
      demoReview("s16-r1", "Priya M.", 5, "Photos felt natural and flattering.", "2026-11-06"),
    ],
  },
  {
    id: "svc-17",
    slug: "event-coverage",
    name: "Half-Day Event Coverage",
    categoryId: "cat-photo",
    providerId: "prov-7",
    description: "Documentary photography for parties, launches, and gatherings.",
    longDescription:
      "Four hours of coverage with a highlight gallery delivered within one week. Lena focuses on candid storytelling without interrupting the flow of your event.",
    durationMinutes: 240,
    price: 650,
    rating: 4.8,
    reviewCount: 22,
    location: "Los Angeles, CA",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80",
    ],
    tags: ["Events", "Coverage"],
    featured: false,
    popular: false,
    availabilityNote: "Requires 2-week notice",
    nextAvailable: "2026-12-05",
    reviews: [
      demoReview("s17-r1", "Event lead, Harbor Co.", 5, "Captured every important moment.", "2026-09-12"),
    ],
  },
  {
    id: "svc-9",
    slug: "math-tutoring",
    name: "Math Tutoring Block",
    categoryId: "cat-education",
    providerId: "prov-5",
    description: "Focused math support for middle school through calculus.",
    longDescription:
      "Personalized problem sets, exam prep strategies, and concept reviews. Sessions end with a short homework plan parents can track.",
    durationMinutes: 60,
    price: 60,
    rating: 5.0,
    reviewCount: 94,
    location: "Boston, MA · Online",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80",
    ],
    tags: ["Online", "STEM"],
    featured: true,
    popular: true,
    availabilityNote: "After-school slots available",
    nextAvailable: "2026-11-23",
    reviews: [
      demoReview("s9-r1", "Parent of Leo", 5, "Patient and incredibly clear.", "2026-10-17"),
    ],
  },
  {
    id: "svc-10",
    slug: "college-essay-coaching",
    name: "College Essay Coaching",
    categoryId: "cat-education",
    providerId: "prov-5",
    description: "Storytelling guidance for applications and scholarships.",
    longDescription:
      "Work through topic selection, structure, and voice. Includes one revision cycle after the session.",
    durationMinutes: 75,
    price: 90,
    rating: 4.9,
    reviewCount: 33,
    location: "Boston, MA · Online",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80",
    ],
    tags: ["Admissions", "Writing"],
    featured: false,
    popular: true,
    availabilityNote: "Peak season books 1–2 weeks out",
    nextAvailable: "2026-11-30",
    reviews: [
      demoReview("s10-r1", "Student, Class of 2027", 5, "Helped me find my real story.", "2026-09-21"),
    ],
  },
  {
    id: "svc-11",
    slug: "strategy-sprint",
    name: "90-Minute Strategy Sprint",
    categoryId: "cat-business",
    providerId: "prov-6",
    description: "Clarify priorities and leave with a 30-day action plan.",
    longDescription:
      "A focused working session for founders and managers. Daniel helps you cut noise, choose the next bets, and assign ownership.",
    durationMinutes: 90,
    price: 320,
    rating: 4.8,
    reviewCount: 47,
    location: "New York, NY · Remote",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80",
    ],
    tags: ["Consulting", "Leadership"],
    featured: true,
    popular: true,
    availabilityNote: "Remote sessions most weekdays",
    nextAvailable: "2026-11-26",
    reviews: [
      demoReview("s11-r1", "COO, Brightpath", 5, "Unblocked our quarterly priorities.", "2026-10-03"),
    ],
  },
  {
    id: "svc-12",
    slug: "ops-audit-call",
    name: "Operations Audit Call",
    categoryId: "cat-business",
    providerId: "prov-6",
    description: "Identify bottlenecks across process, tools, and people.",
    longDescription:
      "Bring your workflow map or CRM snapshot. You'll get a prioritized list of fixes ranked by impact and effort.",
    durationMinutes: 60,
    price: 240,
    rating: 4.7,
    reviewCount: 29,
    location: "New York, NY · Remote",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80",
    ],
    tags: ["Ops", "Remote"],
    featured: false,
    popular: false,
    availabilityNote: "Usually available within a week",
    nextAvailable: "2026-11-28",
    reviews: [
      demoReview("s12-r1", "Ops lead, Fieldkit", 4, "Actionable and realistic recommendations.", "2026-08-16"),
    ],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Elena Vargas",
    role: "Product Manager",
    quote:
      "BookEase made scheduling my family's appointments feel effortless. I found a provider, booked a slot, and got reminders without chasing anyone.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    demoLabel: "Demo review",
  },
  {
    id: "t2",
    name: "Noah Patel",
    role: "Small Business Owner",
    quote:
      "I use BookEase for consulting clients and personal wellness. The interface is clean, and the booking flow is exactly what a busy week needs.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    demoLabel: "Demo review",
  },
  {
    id: "t3",
    name: "Maya Thompson",
    role: "Graduate Student",
    quote:
      "Finding a tutor used to take days. With BookEase I compared ratings, saw availability, and confirmed a session in minutes.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
    demoLabel: "Demo review",
  },
];

export const bookings: Booking[] = [
  {
    id: "bk-1001",
    serviceId: "svc-1",
    serviceName: "Comprehensive Health Check",
    providerId: "prov-1",
    providerName: "Dr. Amelia Chen",
    customerName: "Alex Morgan",
    customerEmail: "alex.morgan@email.com",
    customerPhone: "+1 (415) 555-0142",
    date: "2026-11-24",
    time: "10:00 AM",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    durationMinutes: 60,
    price: 160,
    status: "confirmed",
    notes: "First visit. Prefer morning slots.",
    total: 160,
    createdAt: "2026-11-18T10:00:00.000Z",
  },
  {
    id: "bk-1002",
    serviceId: "svc-5",
    serviceName: "Strength Foundations Session",
    providerId: "prov-3",
    providerName: "Sofia Martinez",
    customerName: "Alex Morgan",
    customerEmail: "alex.morgan@email.com",
    customerPhone: "+1 (415) 555-0142",
    date: "2026-11-26",
    time: "5:00 PM",
    startTime: "5:00 PM",
    endTime: "5:55 PM",
    durationMinutes: 55,
    price: 70,
    status: "pending",
    notes: "Focus on squat form.",
    total: 70,
    createdAt: "2026-11-19T15:30:00.000Z",
  },
  {
    id: "bk-1003",
    serviceId: "svc-3",
    serviceName: "Signature Cut & Style",
    providerId: "prov-2",
    providerName: "Marcus Reid",
    customerName: "Alex Morgan",
    customerEmail: "alex.morgan@email.com",
    customerPhone: "+1 (415) 555-0142",
    date: "2026-11-12",
    time: "2:00 PM",
    startTime: "2:00 PM",
    endTime: "2:45 PM",
    durationMinutes: 45,
    price: 78,
    status: "completed",
    total: 78,
    createdAt: "2026-11-05T18:00:00.000Z",
  },
  {
    id: "bk-1004",
    serviceId: "svc-9",
    serviceName: "Math Tutoring Block",
    providerId: "prov-5",
    providerName: "Priya Nair",
    customerName: "Alex Morgan",
    customerEmail: "alex.morgan@email.com",
    customerPhone: "+1 (415) 555-0142",
    date: "2026-11-08",
    time: "4:00 PM",
    startTime: "4:00 PM",
    endTime: "5:00 PM",
    durationMinutes: 60,
    price: 60,
    status: "completed",
    total: 60,
    createdAt: "2026-11-01T20:00:00.000Z",
  },
  {
    id: "bk-1005",
    serviceId: "svc-11",
    serviceName: "90-Minute Strategy Sprint",
    providerId: "prov-6",
    providerName: "Daniel Brooks",
    customerName: "Alex Morgan",
    customerEmail: "alex.morgan@email.com",
    customerPhone: "+1 (415) 555-0142",
    date: "2026-10-29",
    time: "11:00 AM",
    startTime: "11:00 AM",
    endTime: "12:30 PM",
    durationMinutes: 90,
    price: 320,
    status: "cancelled",
    total: 320,
    createdAt: "2026-10-20T14:00:00.000Z",
  },
  {
    id: "bk-1006",
    serviceId: "svc-2",
    serviceName: "Virtual Primary Care Visit",
    providerId: "prov-1",
    providerName: "Dr. Amelia Chen",
    customerName: "Alex Morgan",
    customerEmail: "alex.morgan@email.com",
    customerPhone: "+1 (415) 555-0142",
    date: "2026-12-02",
    time: "9:30 AM",
    startTime: "9:30 AM",
    endTime: "10:00 AM",
    durationMinutes: 30,
    price: 95,
    status: "confirmed",
    total: 95,
    createdAt: "2026-11-20T12:00:00.000Z",
  },
];

export const providerBookings: Booking[] = [
  ...bookings,
  {
    id: "bk-2001",
    serviceId: "svc-1",
    serviceName: "Comprehensive Health Check",
    providerId: "prov-1",
    providerName: "Dr. Amelia Chen",
    customerName: "Jordan Lee",
    customerEmail: "jordan.lee@email.com",
    customerPhone: "+1 (628) 555-0199",
    date: "2026-11-23",
    time: "1:00 PM",
    startTime: "1:00 PM",
    endTime: "2:00 PM",
    durationMinutes: 60,
    price: 160,
    status: "pending",
    notes: "Needs ADA-accessible room.",
    total: 160,
    createdAt: "2026-11-20T16:00:00.000Z",
  },
  {
    id: "bk-2002",
    serviceId: "svc-2",
    serviceName: "Virtual Primary Care Visit",
    providerId: "prov-1",
    providerName: "Dr. Amelia Chen",
    customerName: "Sam Rivera",
    customerEmail: "sam.rivera@email.com",
    customerPhone: "+1 (510) 555-0177",
    date: "2026-11-25",
    time: "3:30 PM",
    startTime: "3:30 PM",
    endTime: "4:00 PM",
    durationMinutes: 30,
    price: 95,
    status: "confirmed",
    total: 95,
    createdAt: "2026-11-17T11:00:00.000Z",
  },
];

export const faqs: FaqItem[] = [
  {
    id: "faq-1",
    category: "Booking",
    question: "How do I book an appointment on BookEase?",
    answer:
      "Browse services or providers, open a listing, choose a date and time slot, enter your details, and confirm. You'll see a confirmation screen with your booking reference.",
  },
  {
    id: "faq-2",
    category: "Booking",
    question: "Can I reschedule or cancel a booking?",
    answer:
      "Yes. Open My Bookings, select the appointment, and use Reschedule or Cancel. Policies may vary by provider and are shown before you confirm changes.",
  },
  {
    id: "faq-3",
    category: "Payments",
    question: "When am I charged for a booking?",
    answer:
      "BookEase Phase 1–2 use mock data only. In later phases, payment timing will depend on provider settings and your selected payment method.",
  },
  {
    id: "faq-4",
    category: "Providers",
    question: "How are providers verified?",
    answer:
      "Verified badges indicate providers who completed identity and credential checks in the full product. In this demo, badges are part of the sample content.",
  },
  {
    id: "faq-5",
    category: "Account",
    question: "Do I need an account to book?",
    answer:
      "You can explore freely. Signing in helps manage bookings and preferences. Login and sign-up screens are front-end only for now.",
  },
  {
    id: "faq-6",
    category: "Support",
    question: "How do I contact support?",
    answer:
      "Use the Contact page to send a message. For urgent appointment issues, reach out to your provider using the details on the booking confirmation.",
  },
];

export const timeSlots: TimeSlot[] = [
  { time: "9:00 AM", available: true },
  { time: "9:30 AM", available: false },
  { time: "10:00 AM", available: true },
  { time: "10:30 AM", available: true },
  { time: "11:00 AM", available: false },
  { time: "11:30 AM", available: true },
  { time: "1:00 PM", available: true },
  { time: "1:30 PM", available: true },
  { time: "2:00 PM", available: false },
  { time: "2:30 PM", available: true },
  { time: "3:00 PM", available: true },
  { time: "3:30 PM", available: true },
  { time: "4:00 PM", available: false },
  { time: "4:30 PM", available: true },
  { time: "5:00 PM", available: true },
  { time: "5:30 PM", available: true },
];

export const demoCustomer = {
  name: "Alex Morgan",
  email: "alex.morgan@email.com",
  phone: "+1 (415) 555-0142",
  location: "San Francisco, CA",
  memberSince: "March 2025",
};

export const demoProvider = providers[0];

export const SERVICE_PAGE_SIZE = 9;
export const PROVIDER_PAGE_SIZE = 6;

export const serviceLocations = Array.from(
  new Set(
    services.flatMap((service) =>
      service.location
        .split("·")
        .map((part) => part.trim())
        .filter((part) => part && !/^remote$/i.test(part) && !/^online$/i.test(part)),
    ),
  ),
).sort();

export const providerLocations = Array.from(
  new Set(providers.map((p) => p.location)),
).sort();

export function getServiceById(id: string) {
  return services.find((s) => s.id === id || s.slug === id);
}

export function getProviderById(id: string) {
  return providers.find((p) => p.id === id || p.slug === id);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug || c.id === slug);
}

export function getBookingById(id: string) {
  return providerBookings.find((b) => b.id === id);
}

export function getServicesByCategory(categoryId: string) {
  return services.filter((s) => s.categoryId === categoryId);
}

export function getServicesByProvider(providerId: string) {
  return services.filter((s) => s.providerId === providerId);
}

export function getFeaturedServices(limit = 6) {
  return services.filter((s) => s.featured).slice(0, limit);
}

export function getRecommendedProviders(limit = 3) {
  return [...providers]
    .filter((p) => p.featured || p.verified)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, limit);
}

export function getCategoriesWithCounts() {
  return categories.map((category) => ({
    ...category,
    serviceCount: services.filter((s) => s.categoryId === category.id).length,
  }));
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? `${hrs}h ${mins}m` : `${hrs}h`;
}
