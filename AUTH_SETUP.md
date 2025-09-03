# Simple Authentication Setup Guide

## Environment Variables Required

Add these to your `.env` file:

```env
# NextAuth.js
AUTH_SECRET=your-secret-key-here

# Database
DATABASE_URL=your-neon-database-url
DIRECT_URL=your-neon-direct-url
```

## AUTH_SECRET Setup

Generate a random secret key:

```bash
openssl rand -base64 32
```

## User Account

Create your account through the signup form to get started.

## Features Implemented:

✅ **Simple Authentication**

- Email/password login form
- User signup with name, email, and password
- Toggle between login and signup
- Clean, simple UI with dark blue theme
- Automatic redirects

✅ **Protected Routes**

- Dashboard at `/dashboard` (requires authentication)
- Middleware protection for all routes
- Automatic redirects based on auth status

✅ **User Experience**

- Landing page for unauthenticated users
- Dashboard for authenticated users
- Sign out functionality
- Session management

✅ **Backend Integration**

- NextAuth.js with credentials provider
- Database integration for user sessions
- Type-safe authentication

## How to Test:

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000`
3. Click "Get Started" to go to auth page
4. **Sign Up**: Create a new account with your name, email, and password
5. **Sign In**: Use your account credentials to sign in
6. You'll be redirected to the dashboard
7. Test sign out functionality

## New User Signup:

- Fill out the signup form with your name, email, and password
- Password must be at least 6 characters
- System will automatically sign you in after successful registration
- New users must use a password with at least 6 characters
