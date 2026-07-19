"use client";

import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [hasCompany, setHasCompany] = useState(false);

  useEffect(() => {
    if (user?.role === "RECRUITER") {
      const token = document.cookie.match(/token=([^;]+)/)?.[1];
      fetch(`${API_URL}/companies/my-company`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.id) setHasCompany(true);
        })
        .catch(() => {});
    }
  }, [user]);

  const candidateCards = [
    {
      emoji: "📄",
      title: "My Resume",
      desc: "Create or update your resume to stand out",
      link: "/resume/create",
      btn: "Create Resume",
    },
    {
      emoji: "💼",
      title: "Browse Jobs",
      desc: "Explore AI-matched job opportunities",
      link: "/jobs",
      btn: "View Jobs",
    },
    {
      emoji: "📋",
      title: "Applications",
      desc: "Track the status of your applications",
      link: "/applications",
      btn: "View Applications",
    },
  ];

  const recruiterCards = [
    {
      emoji: "🏢",
      title: "My Company",
      desc: hasCompany
        ? "View your company profile"
        : "Set up your company profile",
      link: hasCompany ? "/companies/my-company" : "/companies/create",
      btn: hasCompany ? "View Company" : "Create Company",
    },
    {
      emoji: "📝",
      title: "Post a Job",
      desc: "Create a new job opening for developers",
      link: "/jobs/create",
      btn: "Post Job",
    },
    {
      emoji: "👥",
      title: "Browse Jobs",
      desc: "View all active job listings",
      link: "/jobs",
      btn: "View Jobs",
    },
  ];

  const cards = user?.role === "CANDIDATE" ? candidateCards : recruiterCards;

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-12">
        <div className="inline-block text-xs font-medium text-[var(--brand-foreground)] bg-[var(--brand)]/15 border border-[var(--brand)]/30 px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
          {user?.role}
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Welcome back,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
            {user?.username}
          </span>
        </h1>
        <p className="text-muted-foreground">
          {user?.role === "CANDIDATE"
            ? "Your AI-powered job search dashboard"
            : "Manage your company and job postings"}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-card border border-border rounded-2xl p-6 hover:bg-secondary/40 transition-all duration-200"
          >
            <div className="text-3xl mb-4">{card.emoji}</div>
            <h2 className="text-lg font-semibold text-foreground mb-1">
              {card.title}
            </h2>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              {card.desc}
            </p>
            <Button asChild variant="secondary" className="w-full h-10">
              <Link href={card.link}>{card.btn} →</Link>
            </Button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
