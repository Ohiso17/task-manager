# Task Manager App

A modern, full-featured task management application built with the T3 Stack. Organize your life with projects, tasks, and beautiful UI.

## ✨ Features

### 🔐 Authentication

- **Email/Password Authentication** - Simple and secure login system
- **User Registration** - Create new accounts with validation
- **Protected Routes** - Secure access to user data
- **Session Management** - Persistent login sessions

### 📋 Project Management

- **Create Projects** - Organize tasks into color-coded projects
- **Edit Projects** - Update project details and colors
- **Delete Projects** - Remove projects (with confirmation)
- **Project Overview** - View project statistics and task counts

### ✅ Task Management

- **Create Tasks** - Add tasks with titles, descriptions, priorities, and due dates
- **Edit Tasks** - Update task details and properties
- **Delete Tasks** - Remove tasks with confirmation
- **Status Management** - Mark tasks as TODO, IN_PROGRESS, or DONE
- **Priority Levels** - Set task priorities (LOW, MEDIUM, HIGH)
- **Due Dates** - Track task deadlines
- **Task Completion** - Automatic completion timestamps

### 📊 Dashboard

- **Real-time Statistics** - Live project and task counts
- **Recent Activity** - Quick view of latest tasks and projects
- **Quick Actions** - Fast access to create new items
- **Progress Tracking** - Visual progress indicators

### 🎨 User Experience

- **Modern UI** - Beautiful dark theme with glassmorphism effects
- **Responsive Design** - Works perfectly on desktop and mobile
- **Intuitive Navigation** - Easy movement between projects and tasks
- **Real-time Updates** - Instant UI updates with optimistic mutations

## 🛠️ Tech Stack

- **[Next.js 15](https://nextjs.org)** - React framework with App Router
- **[NextAuth.js](https://next-auth.js.org)** - Authentication
- **[Prisma](https://prisma.io)** - Database ORM
- **[PostgreSQL](https://postgresql.org)** - Database
- **[tRPC](https://trpc.io)** - Type-safe API
- **[Tailwind CSS](https://tailwindcss.com)** - Styling
- **[TypeScript](https://typescriptlang.org)** - Type safety

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd task-manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/taskmanager"
   DIRECT_URL="postgresql://username:password@localhost:5432/taskmanager"

   # NextAuth.js
   AUTH_SECRET="your-secret-key-here"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # (Optional) Seed demo data
   npm run db:seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Demo Account

If you seeded demo data, you can use:

- **Email**: `demo@example.com`
- **Password**: `password123`

### Creating Your First Project

1. Sign up for a new account or use the demo account
2. Click "New Project" on the dashboard
3. Enter project name, description, and choose a color
4. Click "Create Project"

### Adding Tasks

1. Navigate to a project
2. Click "New Task"
3. Fill in task details (title, description, priority, due date)
4. Click "Create Task"

### Managing Tasks

- **Mark Complete**: Check the checkbox next to any task
- **Edit Task**: Click the "Edit" button on any task
- **Delete Task**: Click the "Delete" button (with confirmation)
- **Change Status**: Use the status dropdown in the edit form

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── _components/        # Reusable UI components
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── projects/          # Project management pages
│   └── tasks/             # Task management pages
├── server/                # Server-side code
│   ├── api/               # tRPC routers
│   ├── auth/              # NextAuth configuration
│   └── db.ts              # Database connection
└── trpc/                  # tRPC client configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed demo data

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with the [T3 Stack](https://create.t3.gg/)
- UI inspired by modern design principles
- Icons from various open source libraries
