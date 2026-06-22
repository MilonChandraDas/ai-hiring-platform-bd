"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { API_URL } from "@/lib/api";

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, user } = useAuthStore();
  const userRole = user?.role;
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`${API_URL}/jobs/${id}`);
        setJob(response.data);
      } catch (error) {
        console.log("FETCH ERROR:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  useEffect(() => {
    const checkApplied = async () => {
      if (!token || userRole !== "CANDIDATE") return;
      try {
        const response = await axios.get(`${API_URL}/applications/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const applied = response.data.some(
          (app: any) => app.jobId === id || app.job?.id === id,
        );
        setAlreadyApplied(applied);
      } catch (error) {
        console.log(error);
      }
    };
    checkApplied();
  }, [id, token, userRole]);

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

  if (!job)
    return (
      <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
        <p className="text-slate-400">Job not found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#080d1a] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-14 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
            <p className="text-slate-400">
              {job.company?.name} • {job.location}
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="text-sm text-slate-500 hover:text-slate-300 border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl transition-all duration-200 flex-shrink-0"
          >
            ← Back
          </button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-3">
          <span className="bg-blue-500/15 text-blue-300 border border-blue-500/20 text-xs font-medium px-3 py-1.5 rounded-full">
            {job.jobType}
          </span>
          <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 text-xs font-medium px-3 py-1.5 rounded-full">
            {job.experience}
          </span>
          <span className="bg-yellow-500/15 text-yellow-300 border border-yellow-500/20 text-xs font-medium px-3 py-1.5 rounded-full">
            💰 {job.salary || "Negotiable"}
          </span>
        </div>

        {/* Description */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-3">
            Description
          </h3>
          <p className="text-slate-300 leading-relaxed">{job.description}</p>
        </div>

        {/* Company */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-3">
            Company
          </h3>
          <p className="text-white font-semibold">{job.company?.name}</p>
          <p className="text-slate-400 text-sm mt-1">{job.company?.email}</p>
        </div>

        {/* Apply button */}
        {token &&
          userRole === "CANDIDATE" &&
          (alreadyApplied ? (
            <button
              disabled
              className="w-full h-12 bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 rounded-xl font-medium cursor-not-allowed"
            >
              ✅ Already Applied
            </button>
          ) : (
            <button
              onClick={() => router.push(`/jobs/${id}/apply`)}
              className="w-full h-12 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-xl font-medium transition-all duration-200"
            >
              Apply Now →
            </button>
          ))}
      </div>
    </div>
  );
}
