"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

export default function ApplyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const [resumeId, setResumeId] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingResumes, setFetchingResumes] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get(`${API_URL}/resumes/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResumes(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setFetchingResumes(false);
      }
    };
    fetchResumes();
  }, []);

  const handleApply = async () => {
    if (!resumeId) {
      toast.error("Please select a resume!");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/applications`,
        {
          jobId: id,
          resumeId,
          coverLetter,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Applied successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingResumes)
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

  return (
    <div className="min-h-screen bg-[#080d1a] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-14">
        <div className="w-full max-w-lg">
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-2xl p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-1">
                Apply for Job
              </h1>
              <p className="text-slate-400 text-sm">
                Select your resume and add a cover letter
              </p>
            </div>

            <div className="space-y-6">
              {/* Resume select */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Select Resume <span className="text-red-400">*</span>
                </label>

                {resumes.length === 0 ? (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-center">
                    <p className="text-red-400 text-sm font-medium mb-1">
                      No resume found
                    </p>
                    <p className="text-slate-500 text-xs mb-3">
                      You need a resume before applying
                    </p>
                    <button
                      onClick={() => router.push("/resume/create")}
                      className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
                    >
                      Create a resume first →
                    </button>
                  </div>
                ) : (
                  <select
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all"
                    onChange={(e) => setResumeId(e.target.value)}
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="" className="bg-[#0f1729] text-slate-400">
                      Select a resume
                    </option>
                    {resumes.map((resume: any) => (
                      <option
                        key={resume.id}
                        value={resume.id}
                        className="bg-[#0f1729] text-white"
                      >
                        {resume.name} — {resume.email}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Cover letter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Cover Letter{" "}
                  <span className="text-slate-600">(optional)</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Why are you interested in this job? What makes you a great fit?"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-600 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => router.back()}
                  className="flex-1 h-11 bg-white/5 hover:bg-white/10 text-slate-300 text-sm rounded-xl border border-white/10 transition-all duration-200"
                >
                  ← Back
                </button>
                <button
                  onClick={handleApply}
                  disabled={loading || resumes.length === 0}
                  className="flex-1 h-11 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
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
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
