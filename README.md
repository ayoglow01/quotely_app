# QUOTELY

A premium reflective quotation management platform designed to help users preserve wisdom, capture lessons, and build a lifelong repository of knowledge.

## Overview

Quotely is not just a quote-saving application.

It is a personal wisdom archive that allows users to collect meaningful quotations from books, speeches, articles, lectures, podcasts, conversations, and personal experiences while preserving the lessons and reflections associated with them.

## Core Features

### Authentication
- Email signup and login
- Email verification
- Phone signup and login
- OTP verification
- Password reset
- Secure session management

### Quote Management
- Create quotes
- Edit quotes
- Delete quotes
- Archive quotes
- Favorite quotes
- Categorize quotes
- Tag quotes
- Search quotes

### Quote Structure

Each quote includes:

- Quote Text
- Author
- Source Title
- Chapter
- Page Number
- Date Captured
- Lesson Learned
- Personal Reflection
- Tags
- Categories
- Favorite Status

### Dashboard
- Recent quotes
- Favorite quotes
- Statistics
- Search and filtering
- Reading insights

### Security
- Supabase Authentication
- Row Level Security (RLS)
- User data isolation
- Secure database policies
- Input validation

### Progressive Web App (PWA)
- Installable on Android
- Installable on iPhone
- Installable on Desktop
- Offline-ready architecture
- Native-like experience

---

## Technology Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Next.js Route Handlers
- Server Actions

### Database
- PostgreSQL
- Supabase

### Authentication
- Supabase Auth

### State Management
- Zustand

### Forms & Validation
- React Hook Form
- Zod

### Testing
- Vitest
- React Testing Library
- Playwright

### Deployment
- Vercel

---

## Project Goals

- Preserve knowledge
- Encourage reflection
- Improve learning retention
- Build personal wisdom archives
- Provide a modern and secure experience

---

## Future Roadmap

### Version 1.0
- Core Quotely Platform
- Multi-user support
- Authentication
- Quote management
- Dashboard

### Version 2.0
- AI Quote Generator

### Version 3.0
- AI Knowledge Assistant
- AI Lesson Extraction
- AI Reflection Suggestions

### Version 4.0
- Knowledge Graph
- Semantic Search

### Version 5.0
- Mobile Ecosystem
- Advanced Sync
- Offline Knowledge Management

---

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/quotely.git
```

Navigate into the project:

```bash
cd quotely
```

Install dependencies:

```bash
npm install
```

Create environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Start development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## License

This project is licensed under the MIT License.