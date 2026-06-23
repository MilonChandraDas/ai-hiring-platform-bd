"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

interface Application {
  id: string;
  status: string;
  createdAt: string;
  user: { id: string; username: string; email: string };
  job: { title: string; company: { name: string } };
  resume: { skill: string[]; education: string; experience: string };
}

export default function RecruiterApplicationsPage() {
  const { token } = useAuthStore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [interviewForm, setInterviewForm] = useState({
    scheduledAt: "",
    duration: 60,
    meetingLink: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
        try {
        const response = await axios.get(`${API_URL}/applications/recruiter`, {
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

  const handleScheduleInterview = async () => {
    if (!selectedApp || !interviewForm.scheduledAt) {
      toast.error("Please fill in the scheduled date/time!");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(
        `${API_URL}/interviews`,
        {
          applicationId: selectedApp.id,
          candidateId: selectedApp.user.id,
          scheduledAt: new Date(interviewForm.scheduledAt).toISOString(),
          duration: interviewForm.duration,
          meetingLink: interviewForm.meetingLink,
          notes: interviewForm.notes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Interview scheduled successfully!");
      setSelectedApp(null);
      setInterviewForm({
        scheduledAt: "",
        duration: 60,
        meetingLink: "",
        notes: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

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
      <div className="absolute -top-25 left-[-100px] w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Applications</h1>
          <p className="text-slate-400">
            Candidates who applied to your job postings
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-slate-300 font-medium mb-1">
              No applications yet
            </p>
            <p className="text-slate-500 text-sm">
              Applications will appear here once candidates apply to your jobs
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    {/* Candidate info */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                        {app.user?.username?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          {app.user?.username}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {app.user?.email}
                        </p>
                      </div>
                    </div>

                    {/* Job info */}
                    <p className="text-slate-400 text-sm mb-3">
                      Applied for:{" "}
                      <span className="text-violet-300 font-medium">
                        {app.job?.title}
                      </span>
                    </p>

                    {/* Resume info */}
                    {app.resume && (
                      <div className="space-y-1 text-xs text-slate-500">
                        <p>🎓 {app.resume.education}</p>
                        {app.resume.experience && (
                          <p>💼 {app.resume.experience}</p>
                        )}
                        {app.resume.skill && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(Array.isArray(app.resume?.skill)
                              ? (app.resume.skill as string[])
                              : (
                                  (app.resume?.skill as unknown as string) || ""
                                ).split(",")
                            )
                              .slice(0, 4)
                              .map((skill: string, i: number) => (
                                <span
                                  key={i}
                                  className="bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded-full"
                                >
                                  {skill.trim()}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full border ${
                        app.status === "PENDING"
                          ? "bg-slate-500/20 text-slate-300 border-slate-500/30"
                          : app.status === "REVIEWED"
                            ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                            : app.status === "SHORTLISTED"
                              ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                              : app.status === "REJECTED"
                                ? "bg-red-500/20 text-red-300 border-red-500/30"
                                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      }`}
                    >
                      {app.status}
                    </span>
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="text-sm bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white px-4 py-2 rounded-xl transition-all duration-200"
                    >
                      📅 Schedule Interview
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interview Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f1729] border border-white/10 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-1">
              Schedule Interview
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              For{" "}
              <span className="text-violet-300">
                {selectedApp.user?.username}
              </span>{" "}
              — {selectedApp.job?.title}
            </p>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">
                  Date & Time <span className="text-red-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={interviewForm.scheduledAt}
                  onChange={(e) =>
                    setInterviewForm({
                      ...interviewForm,
                      scheduledAt: e.target.value,
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 h-11"
                  style={{ colorScheme: "dark" }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={interviewForm.duration}
                  onChange={(e) =>
                    setInterviewForm({
                      ...interviewForm,
                      duration: Number(e.target.value),
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 h-11"
                  placeholder="60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">
                  Meeting Link
                </label>
                <input
                  type="url"
                  value={interviewForm.meetingLink}
                  onChange={(e) =>
                    setInterviewForm({
                      ...interviewForm,
                      meetingLink: e.target.value,
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 h-11"
                  placeholder="https://meet.google.com/..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={interviewForm.notes}
                  onChange={(e) =>
                    setInterviewForm({
                      ...interviewForm,
                      notes: e.target.value,
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
                  placeholder="Any special instructions for the candidate..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="flex-1 h-11 bg-white/5 hover:bg-white/10 text-slate-300 text-sm rounded-xl border border-white/10 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleInterview}
                  disabled={submitting}
                  className="flex-1 h-11 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-50 text-white text-sm rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
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
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Interview →"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
