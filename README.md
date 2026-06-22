# 🤖 AI Developer Hiring Platform — Frontend

A modern, production-ready AI-powered hiring platform frontend built with Next.js 15, TypeScript, and Tailwind CSS.

## 🌐 Live Demo

- **Frontend:** https://ai-hiring-platorm.vercel.app
- **Backend API:** https://ai-hiring-platform-backend-1.onrender.com

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 + TypeScript |
| Styling | Tailwind CSS + Shadcn UI |
| State Management | Zustand |
| Form Handling | React Hook Form + Zod |
| HTTP Client | Axios |
| Deployment | Vercel |

---

## ✨ Features

### Candidate
- ✅ Register & Login
- ✅ Create Resume with CV upload
- ✅ Browse all job listings
- ✅ View job details
- ✅ Apply for jobs
- ✅ Track application status

### Recruiter
- ✅ Create company profile
- ✅ Post job openings
- ✅ Manage applications
- ✅ Schedule interviews

### General
- ✅ Role-based dashboard
- ✅ Protected routes with middleware
- ✅ JWT authentication
- ✅ Responsive design

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/         — Login page
│   │   └── register/      — Register page
│   ├── dashboard/         — Role-based dashboard
│   ├── jobs/
│   │   ├── page.tsx       — Job listings
│   │   ├── create/        — Post a job
│   │   └── [id]/
│   │       ├── page.tsx   — Job details
│   │       └── apply/     — Apply for job
│   ├── companies/
│   │   └── create/        — Create company
│   ├── resume/
│   │   └── create/        — Create resume
│   └── applications/      — My applications
├── components/ui/         — Shadcn UI components
├── lib/
│   └── api.ts             — API URL config
├── schemas/
│   └── auth.schema.ts     — Zod validation schemas
└── store/
    └── auth.store.ts      — Zustand auth store
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- Git

### Installation

```bash
# Clone the repo
git clone https://github.com/MilonChandraDas/ai-hiring-platform.git
cd ai-hiring-platform-frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Fill in your .env.local values

# Run development server
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 🔐 Authentication Flow

```
Register → Login → JWT Token → Cookie + Zustand Store
                                      ↓
                              Protected Routes (Middleware)
                                      ↓
                              Role-based Dashboard
```

---

## 🎨 UI Components

Built with **Shadcn UI** — a collection of beautifully designed, accessible components:
- Button, Input, Label
- Card, CardHeader, CardContent
- Select, SelectTrigger, SelectContent

---

## 👨‍💻 Author

Built by **Milon Das** as a production-ready portfolio project demonstrating:
- Modern Next.js development
- TypeScript best practices
- Form validation with Zod
- State management with Zustand
- Responsive UI design
- Cloud deployment