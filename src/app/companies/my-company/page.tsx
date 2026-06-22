"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/api";

interface Company {
  id: string;
  name: string;
  email: string;
  website: string;
  location: string;
  type: string;
  phone: string;
  description: string;
  logo: string;
}

const typeEmoji: Record<string, string> = {
  STARTUP: "🚀",
  SME: "🏪",
  ENTERPRISE: "🏢",
  AGENCY: "🎯",
  REMOTE: "🌍",
};

export default function MyCompanyPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.match(/token=([^;]+)/)?.[1];
    fetch(`${API_URL}/companies/my-company`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) setCompany(data);
        else router.push("/companies/create");
      })
      .catch(() => router.push("/companies/create"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          Loading...
        </div>
      </div>
    );

  if (!company) return null;

  return (
    <div className="min-h-screen bg-[#080d1a] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-14 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">My Company</h1>
            <p className="text-slate-400 text-sm">Your company profile</p>
          </div>
          <Link href="/dashboard">
            <button className="text-sm text-slate-500 hover:text-slate-300 border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl transition-all duration-200">
              ← Dashboard
            </button>
          </Link>
        </div>

        {/* Company ID */}
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-5">
          <p className="text-xs text-violet-400 font-medium uppercase tracking-widest mb-2">
            Company ID
          </p>
          <p className="text-sm font-mono text-violet-300 break-all">
            {company.id}
          </p>
          <p className="text-xs text-violet-500 mt-2">
            Use this ID when posting jobs
          </p>
        </div>

        {/* Main Info */}
        <div className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-6 space-y-6">
          {/* Company name + type */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{company.name}</h2>
              {company.type && (
                <span className="inline-flex items-center gap-1.5 mt-2 text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  {typeEmoji[company.type]} {company.type}
                </span>
              )}
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Email", value: company.email },
              { label: "Phone", value: company.phone },
              { label: "Location", value: company.location },
              { label: "Website", value: company.website, isLink: true },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/3 border border-white/8 rounded-xl p-4"
              >
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                  {item.label}
                </p>
                {item.isLink && item.value ? (
                  <a
                    href={item.value}
                    target="_blank"
                    className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-slate-300 text-sm">{item.value || "—"}</p>
                )}
              </div>
            ))}
          </div>

          {/* Description */}
          {company.description && (
            <div className="bg-white/3 border border-white/8 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">
                Description
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                {company.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
