"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API_URL}/jobs`);
        setJobs(response.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
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
          Loading jobs...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#080d1a] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/8 px-6 py-12">
          <div className="max-w-5xl mx-auto flex justify-between items-end">
            <div>
              <div className="inline-block text-xs font-medium text-violet-400 bg-violet-400/10 border border-violet-400/20 px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
                AI Matched
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Find your dream job
              </h1>
              <p className="text-slate-400">
                Discover opportunities matched by AI
              </p>
            </div>

            {user?.role === "RECRUITER" && (
              <Link href="/jobs/create">
                <button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-sm px-5 py-2.5 rounded-xl font-medium transition-all duration-200">
                  + Post a Job
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Jobs List */}
        <div className="max-w-5xl mx-auto py-10 px-6">
          {jobs.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-16 text-center">
              <p className="text-5xl mb-4">💼</p>
              <p className="text-white font-medium mb-1">No jobs posted yet</p>
              <p className="text-slate-500 text-sm mb-6">
                Be the first to post a job opening
              </p>
              {user?.role === "RECRUITER" && (
                <Link href="/jobs/create">
                  <button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-sm px-6 py-2.5 rounded-xl font-medium transition-all duration-200">
                    Post the first job →
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job: any) => (
                <div
                  key={job.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all duration-200 group"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors">
                        {job.title}
                      </h2>
                      <p className="text-slate-400 text-sm mt-1">
                        {job.company?.name} • {job.location || "Remote"}
                      </p>
                    </div>
                    <Link href={`/jobs/${job.id}`}>
                      <button className="flex-shrink-0 text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl transition-all duration-200">
                        View →
                      </button>
                    </Link>
                  </div>

                  <p className="text-slate-400 text-sm mt-3 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex gap-2 mt-4 flex-wrap">
                    <span className="bg-blue-500/15 text-blue-300 border border-blue-500/20 text-xs px-3 py-1 rounded-full font-medium">
                      {job.jobType?.replace("_", " ")}
                    </span>
                    <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 text-xs px-3 py-1 rounded-full font-medium">
                      {job.experience}
                    </span>
                    {job.salary && (
                      <span className="bg-yellow-500/15 text-yellow-300 border border-yellow-500/20 text-xs px-3 py-1 rounded-full font-medium">
                        💰 {job.salary} BDT
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
