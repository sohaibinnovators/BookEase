# BookEase

BookEase is a premium **frontend booking and appointment demo** built with Next.js. It showcases service discovery, provider profiles, availability-aware scheduling, customer/provider dashboards, reviews, favorites, notifications, and analytics — all persisted in the browser with **localStorage** (no backend).

> Demonstration product only. Bookings, reviews, provider accounts, earnings, and analytics are demo data stored locally in your browser. There is no real authentication, payments, email/SMS, or multi-user sync.

## Main features

- Service & provider discovery with search, filters, sorting, and detail pages
- Multi-step booking wizard with calendar + time slots
- Availability rules: working hours, breaks, unavailable dates, conflict prevention
- Shared booking store for customer and provider dashboards
- Cancellation, rescheduling, booking timeline, and references
- Customer favorites, recently viewed services, and reviews/ratings
- In-app notification center (local only)
- Provider service CRUD, availability management, earnings & analytics
- Responsive UI with the BookEase indigo/teal design system

## Technology stack

- **Next.js 16** (App Router, Cache Components)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- Browser **localStorage** for demo persistence

## Getting started

### Requirements

- Node.js 20+ recommended
- npm (or compatible package manager)

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Deploy on Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the project in [Vercel](https://vercel.com/new).
3. Use the default Next.js settings (build: `next build`, output detected automatically).
4. Deploy — **no environment variables are required** for this demo.

localStorage data lives in each visitor’s browser, so deployed demos do not share bookings across users or devices.

## Demo limitations

- No backend, database, or real multi-user sync
- No real authentication (login/signup are UI demos)
- No payment gateway or payouts
- No email, SMS, or push notifications
- No external calendar APIs
- Customer/provider dashboards are demonstration workspaces, not secured accounts
- Reset demo data from **Customer dashboard → Settings → Reset demo localStorage**

## Project structure (high level)

- `app/` — routes (marketing, customer dashboard, provider dashboard)
- `components/` — UI, booking, dashboards, cards
- `hooks/` — hydration-safe localStorage subscriptions
- `lib/` — availability, booking/catalog/profile/review stores, discovery, analytics

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start development server |
| `npm run build`| Production build         |
| `npm start`    | Serve production build   |
| `npm run lint` | Run ESLint               |
