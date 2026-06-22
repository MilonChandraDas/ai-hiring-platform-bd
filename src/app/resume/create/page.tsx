"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useState } from "react";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

const resumeSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(11, "Phone required"),
  about: z.string().optional(),
  education: z.string().min(5, "Education required"),
  experience: z.string().optional(),
  expectedSalary: z.string().optional(),
  skill: z.string().min(1, "At least one skill required"),
});

type ResumeDto = z.infer<typeof resumeSchema>;

const inputClass =
  "w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all h-11";

export default function ResumeCreatePage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [aiResult, setAiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResumeDto>({
    resolver: zodResolver(resumeSchema),
  });

  const onSubmit = async (data: ResumeDto) => {
    if (!token) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("education", data.education);
      formData.append("skill", data.skill);
      if (data.about) formData.append("about", data.about);
      if (data.experience) formData.append("experience", data.experience);
      if (data.expectedSalary)
        formData.append("expectedSalary", data.expectedSalary);
      if (file) formData.append("file", file);

      const response = await axios.post(`${API_URL}/resumes`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setAiResult(response.data);
      toast.success("Resume submitted! AI is analyzing...");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1a] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 min-h-screen flex items-start justify-center px-4 py-14">
        <div className="w-full max-w-2xl space-y-6">
          {/* Form Card */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-2xl p-8 md:p-10">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-1">
                Create Resume
              </h1>
              <p className="text-slate-400 text-sm">
                Fill in your details — AI will analyze and score your resume
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Row 1: Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    className={inputClass}
                    placeholder="Emon Das"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    className={inputClass}
                    type="email"
                    placeholder="emon@gmail.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Phone + Expected Salary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Phone <span className="text-red-400">*</span>
                  </label>
                  <input
                    className={inputClass}
                    placeholder="01700000000"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-400">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Expected Salary
                  </label>
                  <input
                    className={inputClass}
                    placeholder="50,000 BDT"
                    {...register("expectedSalary")}
                  />
                </div>
              </div>

              {/* Education */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">
                  Education <span className="text-red-400">*</span>
                </label>
                <input
                  className={inputClass}
                  placeholder="BSc in CSE, Sonargaon University"
                  {...register("education")}
                />
                {errors.education && (
                  <p className="text-xs text-red-400">
                    {errors.education.message}
                  </p>
                )}
              </div>

              {/* Experience */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">
                  Experience
                </label>
                <input
                  className={inputClass}
                  placeholder="2 years as React Developer at XYZ"
                  {...register("experience")}
                />
              </div>

              {/* Skills */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">
                  Skills <span className="text-red-400">*</span>{" "}
                  <span className="text-slate-500">(comma separated)</span>
                </label>
                <input
                  className={inputClass}
                  placeholder="React, Node.js, PostgreSQL, TypeScript"
                  {...register("skill")}
                />
                {errors.skill && (
                  <p className="text-xs text-red-400">{errors.skill.message}</p>
                )}
              </div>

              {/* About */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">
                  About
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about yourself, your goals, and what makes you unique..."
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all resize-none"
                  {...register("about")}
                />
              </div>

              {/* File Upload */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">
                  Upload CV <span className="text-slate-500">(PDF)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full bg-white/5 border border-white/10 text-slate-400 rounded-xl px-3 py-2.5 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-violet-500/20 file:text-violet-300 hover:file:bg-violet-500/30 transition-all"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
                {file && (
                  <p className="text-xs text-emerald-400">
                    ✅ {file.name} selected
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 h-11 bg-white/5 hover:bg-white/10 text-slate-300 text-sm rounded-xl border border-white/10 transition-all duration-200"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
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
                      Analyzing with AI...
                    </>
                  ) : (
                    "Submit Resume →"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* AI Result Card */}
          {aiResult && (
            <div className="bg-white/5 border border-violet-500/20 backdrop-blur rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                🤖 AI Resume Analysis
              </h3>

              {/* ATS Score */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">
                    ATS Score
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      aiResult.atsScore >= 70
                        ? "text-emerald-400"
                        : aiResult.atsScore >= 50
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {aiResult.atsScore}/100
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      aiResult.atsScore >= 70
                        ? "bg-emerald-500"
                        : aiResult.atsScore >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${aiResult.atsScore}%` }}
                  />
                </div>
              </div>

              {/* AI Feedback */}
              <div className="bg-white/5 border border-white/8 rounded-xl p-5 mb-6">
                <p className="text-sm font-medium text-slate-300 mb-3">
                  AI Feedback
                </p>
                <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                  {aiResult.aiReview
                    ?.replace(/###/g, "")
                    .replace(/\*\*/g, "")
                    .replace(/\*/g, "")
                    .trim()}
                </p>
              </div>

              <button
                onClick={() => router.push("/dashboard")}
                className="w-full h-11 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-sm rounded-xl font-medium transition-all duration-200"
              >
                Go to Dashboard →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
