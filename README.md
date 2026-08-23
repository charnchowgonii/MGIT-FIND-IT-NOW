# MGIT Find It Now

Campus lost-and-found portal for Mahatma Gandhi Institute of Technology (MGIT). Students can report lost or found items, browse listings, and claim items through a verification quiz.

## Prerequisites

- [Node.js](https://nodejs.org/) and npm
- A [Supabase](https://supabase.com/) project (required for auth and database)
- A [ZeroBounce](https://www.zerobounce.net/) API key (required for email verification on sign-up)

## Environment Variables

API keys are stored in a local `.env` file and are **not** committed to git.

1. Copy the example file:

```sh
cp .env.example .env
```

2. Fill in your values in `.env`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_ZEROBOUNCE_API_KEY=your-zerobounce-api-key
```

> **Important:** Never commit `.env` to GitHub. Only `.env.example` (with placeholders) is tracked.

## Supabase Setup

This app uses Supabase for authentication and PostgreSQL storage. You must create and configure your own Supabase project before the app will work.

1. Go to [supabase.com](https://supabase.com/) and create a new project.
2. In **Project Settings → API**, copy your **Project URL** and **anon public key** into `.env`.
3. In the Supabase dashboard, create the required tables:
   - `profiles` — user profile info
   - `items` — lost/found item listings
   - `claims` — claim attempts and quiz answers
   - `user_roles` — user/admin role assignments
   - `user_badges` — badge records for helpful users

   The schema is defined in `src/integrations/supabase/types.ts`. You can recreate it in the Supabase SQL editor or Table Editor to match those types.

5. Enable **Email** auth under **Authentication → Providers**.
6. (Optional) To create an admin user, add a row in `user_roles` with `role = 'admin'` for that user's ID.

Without a configured Supabase project, sign-up, login, and item storage will not work.

## Email Verification (Gmail & Other Providers)

Sign-up uses **ZeroBounce** to verify that the email is real before creating an account. This helps block fake, disposable, or invalid addresses.

Supported email domains include:

- `@gmail.com`
- `@yahoo.com`
- `@outlook.com`
- `@mgit.ac.in`

During sign-up, the app checks the email with ZeroBounce. The account is only created if the email is valid, has working MX records, and is not disposable or blacklisted. Login does not run this check again.

To enable email verification:

1. Create a free account at [zerobounce.net](https://www.zerobounce.net/).
2. Copy your API key from the ZeroBounce dashboard into `.env` as `VITE_ZEROBOUNCE_API_KEY`.

> **Note:** Gmail, Yahoo, and Outlook addresses are supported, but they must pass ZeroBounce validation to sign up.

## Local Development

```sh
# Install dependencies
npm i

# Start the dev server (http://localhost:8080)
npm run dev
```

Other scripts:

```sh
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Technology Stack

- Vite
- TypeScript
- React
- React Router
- TanStack React Query
- shadcn/ui
- Tailwind CSS
- Supabase (Auth + PostgreSQL)

## Deployment

Build the app with `npm run build` and deploy the `dist` folder to any static host (Vercel, Netlify, etc.).

Set these environment variables in your hosting provider:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ZEROBOUNCE_API_KEY`

Make sure your Supabase project allows requests from your deployed domain under **Authentication → URL Configuration**.
