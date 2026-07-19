"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { API_URL } from "@/lib/api";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface JobDetail {
  id: string;
  title: string;
  description: string;
  location?: string;
  jobType?: string;
  experience?: string;
  salary?: string;
  company?: { name: string; email?: string };
}

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, user } = useAuthStore();
  const userRole = user?.role;
  const [job, setJob] = useState<JobDetail | null>(null);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <LoadingSpinner className="h-5 w-5" />
          Loading...
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Job not found</p>
      </div>
    );
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {job.title}
            </h1>
            <p className="text-muted-foreground">
              {job.company?.name} • {job.location}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex-shrink-0"
          >
            ← Back
          </Button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-3">
          <span className="bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20 text-xs font-medium px-3 py-1.5 rounded-full">
            {job.jobType}
          </span>
          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 text-xs font-medium px-3 py-1.5 rounded-full">
            {job.experience}
          </span>
          <span className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border border-yellow-500/20 text-xs font-medium px-3 py-1.5 rounded-full">
            💰 {job.salary || "Negotiable"}
          </span>
        </div>

        {/* Description */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">
            Description
          </h3>
          <p className="text-foreground/90 leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Company */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">
            Company
          </h3>
          <p className="text-foreground font-semibold">{job.company?.name}</p>
          <p className="text-muted-foreground text-sm mt-1">
            {job.company?.email}
          </p>
        </div>

        {/* Apply button */}
        {token &&
          userRole === "CANDIDATE" &&
          (alreadyApplied ? (
            <Button
              disabled
              className="w-full h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300"
            >
              ✅ Already Applied
            </Button>
          ) : (
            <Button
              onClick={() => router.push(`/jobs/${id}/apply`)}
              className="w-full h-12 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white"
            >
              Apply Now →
            </Button>
          ))}
      </div>
    </AppShell>
  );
}
