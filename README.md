# 🐺 Wolf Whale LMS 🐳

**Where Learning Comes Alive**

A modern, gamified Learning Management System (LMS) for K-12 schools built with Next.js 14, Supabase, and TypeScript.

## Features

- **Gamification** - Engage students with XP, levels, coins, and virtual pet companions
- **Multi-role Support** - Students, Teachers, Parents, School Admins, and Platform Admins
- **Course Management** - Create and manage courses, classes, assignments, and lessons
- **Real-time Collaboration** - Built-in messaging and notifications
- **Assignment Tracking** - Submit, grade, and provide feedback on assignments
- **Attendance Management** - Record and track student attendance
- **Grade Management** - Track grades and generate comprehensive reports
- **File Management** - Secure file uploads and storage
- **Analytics & Reports** - Enrollment, grades, attendance, and engagement reports
- **Mobile Responsive** - Works great on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend Framework** - [Next.js 14](https://nextjs.org/) (App Router)
- **Language** - [TypeScript](https://www.typescriptlang.org/)
- **Database** - [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication** - Supabase Auth
- **Storage** - Supabase Storage
- **UI Components** - [Radix UI](https://www.radix-ui.com/)
- **Styling** - [Tailwind CSS](https://tailwindcss.com/)
- **State Management** - [Zustand](https://github.com/pmndrs/zustand) + [TanStack Query](https://tanstack.com/query/)
- **Forms** - [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Animations** - [Framer Motion](https://www.framer.com/motion/)
- **Rate Limiting** - [Upstash](https://upstash.com/)
- **Date Handling** - [date-fns](https://date-fns.org/)
- **Icons** - [Lucide React](https://lucide.dev/)
- **Notifications** - [Sonner](https://sonner.emilkowal.ski/)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** - Version 18+ ([Download](https://nodejs.org/))
- **npm** - Version 9+ (comes with Node.js)
- **Git** - ([Download](https://git-scm.com/))

You'll also need accounts for:

- **Supabase** - Database and Authentication ([Sign up](https://supabase.com/))
- **Vercel** - Deployment platform (optional, [Sign up](https://vercel.com/))

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/wolf-whale-lms.git
cd wolf-whale-lms
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Upstash (Optional, for rate limiting)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Supabase Database

```bash
# Run migrations
npm run db:migrate

# Generate TypeScript types from your database
npm run db:types
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
wolf-whale-lms/
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── (auth)/                   # Auth layout group
│   │   ├── (dashboard)/              # Dashboard layout group
│   │   ├── api/                      # API routes
│   │   │   ├── courses/
│   │   │   ├── assignments/
│   │   │   ├── grades/
│   │   │   ├── attendance/
│   │   │   ├── messages/
│   │   │   ├── notifications/
│   │   │   ├── admin/
│   │   │   ├── upload/
│   │   │   └── gamification/
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   ├── error.tsx                 # Error boundary
│   │   ├── not-found.tsx             # 404 page
│   │   └── loading.tsx               # Loading skeleton
│   ├── components/                   # Reusable components
│   │   └── providers.tsx             # Client providers
│   ├── lib/
│   │   ├── api/                      # API utilities
│   │   │   ├── index.ts              # API helpers
│   │   │   └── errors.ts             # Error classes
│   │   ├── auth/                     # Auth utilities
│   │   ├── supabase/                 # Supabase clients
│   │   ├── tenant/                   # Tenant utilities
│   │   ├── storage/                  # Storage utilities
│   │   ├── validation/               # Zod schemas
│   │   └── utils.ts                  # General utilities
│   ├── types/                        # TypeScript type definitions
│   ├── styles/                       # Global styles
│   └── middleware.ts                 # Next.js middleware
├── public/                           # Static assets
├── .env.example                      # Environment variables template
├── .env.local                        # Local environment variables (git ignored)
├── tsconfig.json                     # TypeScript config
├── tailwind.config.ts                # Tailwind config
├── package.json                      # Dependencies
└── README.md                         # This file
```

## Available Scripts

### Development

```bash
# Start dev server
npm run dev

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

### Database

```bash
# Run pending migrations
npm run db:migrate

# Reset database (WARNING: Deletes all data)
npm run db:reset

# Generate TypeScript types
npm run db:types

# Seed database
npm run db:seed
```

### Production

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## API Routes

### Courses
- `GET /api/courses` - Fetch courses for current user
- `POST /api/courses` - Create new course (teacher/admin)

### Assignments
- `GET /api/assignments` - Fetch assignments (filtered by role)
- `POST /api/assignments` - Create assignment (teacher)
- `GET /api/assignments/[id]` - Fetch single assignment
- `PUT /api/assignments/[id]` - Update assignment (teacher)
- `DELETE /api/assignments/[id]` - Delete assignment (teacher)
- `GET /api/assignments/[id]/submissions` - Fetch submissions
- `POST /api/assignments/[id]/submissions` - Submit assignment (student)

### Grades
- `GET /api/grades` - Fetch grades (filtered by role)
- `POST /api/grades` - Grade submission (teacher)

### Attendance
- `GET /api/attendance` - Fetch attendance records (filtered by role)
- `POST /api/attendance` - Record attendance (teacher)

### Messages
- `GET /api/messages` - Fetch conversations
- `POST /api/messages` - Create conversation or send message
- `GET /api/messages/[conversationId]` - Fetch conversation messages
- `POST /api/messages/[conversationId]` - Send message

### Notifications
- `GET /api/notifications` - Fetch notifications
- `PATCH /api/notifications` - Mark as read

### Admin
- `GET /api/admin/users` - List users (admin)
- `POST /api/admin/users` - Create user (admin)
- `GET /api/admin/users/[id]` - Get user details (admin)
- `PUT /api/admin/users/[id]` - Update user (admin)
- `DELETE /api/admin/users/[id]` - Delete user (admin)
- `GET /api/admin/reports` - Generate reports (admin)

### File Upload
- `POST /api/upload` - Upload file to storage

## Environment Variables

### Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Upstash (Optional)

```env
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxx
```

### Application

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Deployment

### Deploy to Vercel

The easiest way to deploy Wolf Whale LMS is with [Vercel](https://vercel.com/):

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com/)
3. Create a new project and select your repository
4. Add environment variables from your `.env.local`
5. Deploy!

```bash
# Using Vercel CLI
npm i -g vercel
vercel login
vercel deploy
```

### Deploy to Other Platforms

For other hosting platforms (AWS, DigitalOcean, Heroku, etc.), ensure you have Node 18+ and configure:

1. Build command: `npm run build`
2. Start command: `npm run start`
3. Environment variables (see above)

## Database Schema

The project uses Supabase for PostgreSQL database. Key tables:

- `tenants` - School accounts
- `user_profiles` - User information
- `courses` - Courses
- `classes` - Class sections
- `assignments` - Assignments
- `assignment_submissions` - Student submissions
- `grades` - Assignment grades
- `attendance` - Attendance records
- `conversations` - Messages conversations
- `messages` - Messages
- `notifications` - User notifications
- `student_xp` - XP and levels
- `student_coins` - Virtual currency
- `student_pets` - Virtual pets
- `achievements` - Achievement definitions
- `student_achievements` - Student achievement progress

## Authentication

Wolf Whale LMS uses Supabase Authentication with email/password. Users are assigned roles:

- **Student** - Can submit assignments, view grades
- **Teacher** - Can create courses, grade assignments
- **Parent** - Can view children's progress
- **School Admin** - Full school management
- **Platform Admin** - Cross-tenant administration

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary. Unauthorized copying or use is prohibited.

## Support

For issues and questions:

- Check [GitHub Issues](https://github.com/yourusername/wolf-whale-lms/issues)
- Email support@wolfwhale-lms.com
- Visit [wolfwhale-lms.com](https://wolfwhale-lms.com)

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Video lesson integration
- [ ] Parent-teacher conferences feature
- [ ] IEP (Individual Education Plan) support
- [ ] Advanced gamification features
- [ ] AI-powered homework assistance
- [ ] Integration with other LMS platforms

---

**Wolf Whale LMS** - Where Learning Comes Alive 🐺🐳
