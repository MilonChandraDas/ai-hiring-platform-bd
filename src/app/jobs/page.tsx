"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface Job {
  id: string;
  title: string;
  description: string;
  location?: string;
  jobType?: string;
  experience?: string;
  salary?: string;
  company?: { name: string };
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <LoadingSpinner className="h-5 w-5" />
          Loading jobs...
        </div>
      </div>
    );
  }

  return (
    <AppShell
      header={
        <div className="flex justify-between items-end">
          <div>
            <div className="inline-block text-xs font-medium text-[var(--brand-foreground)] bg-[var(--brand)]/15 border border-[var(--brand)]/30 px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
              AI Matched
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Find your dream job
            </h1>
            <p className="text-muted-foreground">
              Discover opportunities matched by AI
            </p>
          </div>

          {user?.role === "RECRUITER" && (
            <Button
              asChild
              className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white h-10 px-5"
            >
              <Link href="/jobs/create">+ Post a Job</Link>
            </Button>
          )}
        </div>
      }
    >
      {jobs.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <p className="text-5xl mb-4">💼</p>
          <p className="text-foreground font-medium mb-1">No jobs posted yet</p>
          <p className="text-muted-foreground text-sm mb-6">
            Be the first to post a job opening
          </p>
          {user?.role === "RECRUITER" && (
            <Button
              asChild
              className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white h-10 px-6"
            >
              <Link href="/jobs/create">Post the first job →</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-card border border-border rounded-2xl p-6 hover:bg-secondary/40 transition-all duration-200 group"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-foreground group-hover:text-[var(--brand-foreground)] transition-colors">
                    {job.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    {job.company?.name} • {job.location || "Remote"}
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0"
                >
                  <Link href={`/jobs/${job.id}`}>View →</Link>
                </Button>
              </div>

              <p className="text-muted-foreground text-sm mt-3 line-clamp-2 leading-relaxed">
                {job.description}
              </p>

              <div className="flex gap-2 mt-4 flex-wrap">
                <span className="bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20 text-xs px-3 py-1 rounded-full font-medium">
                  {job.jobType?.replace("_", " ")}
                </span>
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 text-xs px-3 py-1 rounded-full font-medium">
                  {job.experience}
                </span>
                {job.salary && (
                  <span className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border border-yellow-500/20 text-xs px-3 py-1 rounded-full font-medium">
                    💰 {job.salary} BDT
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
