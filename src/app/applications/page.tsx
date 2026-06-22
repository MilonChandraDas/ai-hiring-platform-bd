"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { API_URL } from "@/lib/api";

interface Application {
  id: string;
  coverLetter: string | null;
  status: "PENDING" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "HIRED";
  createdAt: string;
  job: {
    title: string;
    location: string;
    jobType: string;
    company: {
      name: string;
    };
  };
}

const statusConfig: Record<
  string,
  { style: string; label: string; emoji: string }
> = {
  PENDING: {
    style: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
    label: "Pending Review",
    emoji: "⏳",
  },
  REVIEWED: {
    style: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    label: "Reviewed",
    emoji: "👀",
  },
  SHORTLISTED: {
    style: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
    label: "Shortlisted",
    emoji: "⭐",
  },
  REJECTED: {
    style: "bg-red-500/20 text-red-300 border border-red-500/30",
    label: "Not Selected",
    emoji: "❌",
  },
  HIRED: {
    style: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    label: "Hired!",
    emoji: "✅",
  },
};

export default function ApplicationsPage() {
  const { token } = useAuthStore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${API_URL}/applications/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchApplications();
  }, [token]);

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
          Loading applications...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#080d1a] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            My Applications
          </h1>
          <p className="text-slate-400">
            Track the status of jobs you've applied to
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center backdrop-blur">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-slate-300 font-medium mb-1">
              No applications yet
            </p>
            <p className="text-slate-500 text-sm mb-6">
              Start applying to jobs and track your progress here
            </p>
            <Link href="/jobs">
              <button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-sm px-6 py-2.5 rounded-xl transition-all duration-200 font-medium">
                Browse Jobs →
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur hover:bg-white/8 transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {app.job.title}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                      {app.job.company?.name} • {app.job.location}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1.5 rounded-full flex-shrink-0 flex items-center gap-1.5 ${statusConfig[app.status].style}`}
                  >
                    {statusConfig[app.status].emoji}{" "}
                    {statusConfig[app.status].label}
                  </span>
                </div>

                {app.coverLetter && (
                  <p className="text-slate-400 text-sm mt-3 line-clamp-2 leading-relaxed border-l-2 border-white/10 pl-3">
                    {app.coverLetter}
                  </p>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/8">
                  <p className="text-slate-600 text-xs">
                    Applied on{" "}
                    {new Date(app.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <span className="text-xs text-slate-500 bg-white/5 px-2.5 py-1 rounded-lg border border-white/8">
                    {app.job.jobType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
