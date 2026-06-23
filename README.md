# 🤖 AI Hiring Platform — Frontend

A modern, AI-powered hiring platform built with **Next.js 15** and **TypeScript**. Candidates can browse jobs, create AI-analyzed resumes, and track applications. Recruiters can post jobs, manage candidates, and schedule interviews.

🔗 **Live Demo:** [ai-hiring-platform-bd.vercel.app](https://ai-hiring-platform-bd.vercel.app)  
🔗 **Backend Repo:** [ai-hiring-platform-bd-backend](https://github.com/MilonChandraDas/ai-hiring-platform-bd-backend)

---

## ✨ Features

### Candidate
- 🔐 Register & Login with JWT auth
- 📄 Create resume with AI scoring (ATS Score + AI Feedback)
- 💼 Browse and search job listings
- 📋 Apply to jobs with resume + cover letter
- ✅ Track application status (Pending → Shortlisted → Hired)
- 🎙️ View scheduled interviews with meeting links

### Recruiter
- 🏢 Create and manage company profile
- 📝 Post job openings
- 👥 View all candidate applications
- 📅 Schedule interviews with candidates

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework (App Router) |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Shadcn UI | UI components |
| Zustand | Auth state management |
| React Hook Form + Zod | Form validation |
| Axios | HTTP requests |
| Sonner | Toast notifications |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/MilonChandraDas/ai-hiring-platform-bd.git
cd ai-hiring-platform-bd

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   ├── jobs/
│   │   ├── [id]/
│   │   │   ├── page.tsx        # Job Details
│   │   │   └── apply/          # Apply Form
│   │   └── create/
│   ├── companies/
│   │   ├── create/
│   │   └── my-company/
│   ├── resume/
│   │   └── create/
│   ├── applications/           # Candidate applications
│   ├── interviews/             # Candidate interviews
│   └── recruiter/
│       └── applications/       # Recruiter applications view
├── components/
│   ├── ui/                     # Shadcn components
│   ├── Navbar.tsx
│   └── NavbarWrapper.tsx
├── store/
│   └── auth.store.ts           # Zustand auth store
├── schemas/
│   └── auth.schema.ts          # Zod schemas
└── lib/
    └── api.ts                  # API URL config
```

---

## 🌐 Deployment

Deployed on **Vercel** with automatic deployments from the `main` branch.

```bash
# Build for production
npm run build
```

---

## 📸 Screenshots

> Dashboard, Job listings, Resume AI analysis, Interview scheduling

---

## 👨‍💻 Author

**Milon Chandra Das**  
GitHub: [@MilonChandraDas](https://github.com/MilonChandraDas)