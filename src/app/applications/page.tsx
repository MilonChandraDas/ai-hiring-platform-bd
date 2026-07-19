"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { API_URL } from "@/lib/api";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface Application {
  id: string;
  coverLetter: string | null;
  status: "PENDING" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "HIRED";
  createdAt: string;
  job: {
    title: string;
    location: string;
    jobType: string;
    company: { name: string };
  };
}

const statusConfig: Record<
  string,
  { style: string; label: string; emoji: string }
> = {
  PENDING: {
    style: "bg-secondary text-muted-foreground border border-border",
    label: "Pending Review",
    emoji: "⏳",
  },
  REVIEWED: {
    style:
      "bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20",
    label: "Reviewed",
    emoji: "👀",
  },
  SHORTLISTED: {
    style:
      "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border border-yellow-500/20",
    label: "Shortlisted",
    emoji: "⭐",
  },
  REJECTED: {
    style: "bg-destructive/10 text-destructive border border-destructive/20",
    label: "Not Selected",
    emoji: "❌",
  },
  HIRED: {
    style:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <LoadingSpinner className="h-5 w-5" />
          Loading applications...
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Applications
          </h1>
          <p className="text-muted-foreground">
            Track the status of jobs you&apos;ve applied to
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-foreground font-medium mb-1">
              No applications yet
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              Start applying to jobs and track your progress here
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white h-10 px-6"
            >
              <Link href="/jobs">Browse Jobs →</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-card border border-border rounded-2xl p-6 hover:bg-secondary/40 transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {app.job.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
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
                  <p className="text-muted-foreground text-sm mt-3 line-clamp-2 leading-relaxed border-l-2 border-border pl-3">
                    {app.coverLetter}
                  </p>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <p className="text-muted-foreground/70 text-xs">
                    Applied on{" "}
                    {new Date(app.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <span className="text-xs text-muted-foreground bg-secondary/60 px-2.5 py-1 rounded-lg border border-border">
                    {app.job.jobType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}