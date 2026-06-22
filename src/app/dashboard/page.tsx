"use client";

import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

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
      accent: "from-violet-500/20 to-violet-500/5",
      border: "border-violet-500/20",
    },
    {
      emoji: "💼",
      title: "Browse Jobs",
      desc: "Explore AI-matched job opportunities",
      link: "/jobs",
      btn: "View Jobs",
      accent: "from-cyan-500/20 to-cyan-500/5",
      border: "border-cyan-500/20",
    },
    {
      emoji: "📋",
      title: "Applications",
      desc: "Track the status of your applications",
      link: "/applications",
      btn: "View Applications",
      accent: "from-emerald-500/20 to-emerald-500/5",
      border: "border-emerald-500/20",
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
      accent: "from-violet-500/20 to-violet-500/5",
      border: "border-violet-500/20",
    },
    {
      emoji: "📝",
      title: "Post a Job",
      desc: "Create a new job opening for developers",
      link: "/jobs/create",
      btn: "Post Job",
      accent: "from-cyan-500/20 to-cyan-500/5",
      border: "border-cyan-500/20",
    },
    {
      emoji: "👥",
      title: "Browse Jobs",
      desc: "View all active job listings",
      link: "/jobs",
      btn: "View Jobs",
      accent: "from-emerald-500/20 to-emerald-500/5",
      border: "border-emerald-500/20",
    },
  ];

  const cards = user?.role === "CANDIDATE" ? candidateCards : recruiterCards;

  return (
    <div className="min-h-screen bg-[#080d1a] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-block text-xs font-medium text-violet-400 bg-violet-400/10 border border-violet-400/20 px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
            {user?.role}
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
              {user?.username}
            </span>
          </h1>
          <p className="text-slate-400">
            {user?.role === "CANDIDATE"
              ? "Your AI-powered job search dashboard"
              : "Manage your company and job postings"}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`relative bg-white/5 border ${card.border} rounded-2xl p-6 backdrop-blur hover:bg-white/8 transition-all duration-200 group overflow-hidden`}
            >
              {/* Card glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
              />

              <div className="relative z-10">
                <div className="text-3xl mb-4">{card.emoji}</div>
                <h2 className="text-lg font-semibold text-white mb-1">
                  {card.title}
                </h2>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  {card.desc}
                </p>
                <Link href={card.link}>
                  <button className="w-full bg-white/10 hover:bg-white/15 text-white text-sm py-2.5 rounded-xl border border-white/10 transition-all duration-200 font-medium">
                    {card.btn} →
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
