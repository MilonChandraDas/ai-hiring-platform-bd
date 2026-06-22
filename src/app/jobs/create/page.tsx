"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

const jobSchema = z.object({
  title: z.string().min(3, "Job title required"),
  description: z.string().min(10, "Description required"),
  role: z.string().min(2, "Role required"),
  salary: z.string().optional(),
  banner: z.string().optional(),
  location: z.string().optional(),
  jobType: z.enum([
    "FULL_TIME",
    "PART_TIME",
    "REMOTE",
    "CONTRACT",
    "INTERNSHIP",
  ]),
  experience: z.enum(["JUNIOR", "MID", "SENIOR"]),
  deadline: z.string().optional(),
  companyId: z.string().min(1, "Company ID required"),
});

type JobDto = z.infer<typeof jobSchema>;

const inputClass =
  "w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all h-11";

export default function JobCreatePage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<JobDto>({
    resolver: zodResolver(jobSchema),
  });

  const onSubmit = async (data: JobDto) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/jobs`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Job posted successfully!");
      router.push("/jobs");
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

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-14">
        <div className="w-full max-w-2xl">
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-2xl p-8 md:p-10">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-1">Post a Job</h1>
              <p className="text-slate-400 text-sm">
                Fill in the details to attract the right candidates
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Row 1: Title + Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Job Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    className={inputClass}
                    placeholder="React Developer"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-400">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Role <span className="text-red-400">*</span>
                  </label>
                  <input
                    className={inputClass}
                    placeholder="Frontend Developer"
                    {...register("role")}
                  />
                  {errors.role && (
                    <p className="text-xs text-red-400">
                      {errors.role.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the job responsibilities, requirements, and what you're looking for..."
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all resize-none"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-xs text-red-400">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Row 2: Salary + Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Salary
                  </label>
                  <input
                    className={inputClass}
                    placeholder="e.g. 50,000 BDT"
                    {...register("salary")}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Location
                  </label>
                  <input
                    className={inputClass}
                    placeholder="Dhaka, Bangladesh"
                    {...register("location")}
                  />
                </div>
              </div>

              {/* Row 3: Job Type + Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Job Type <span className="text-red-400">*</span>
                  </label>
                  <Select
                    onValueChange={(value) => setValue("jobType", value as any)}
                  >
                    <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-1 focus:ring-violet-500">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f1729] border-white/10 text-white">
                      <SelectItem
                        value="FULL_TIME"
                        className="focus:bg-white/10 focus:text-white"
                      >
                        ⏰ Full Time
                      </SelectItem>
                      <SelectItem
                        value="PART_TIME"
                        className="focus:bg-white/10 focus:text-white"
                      >
                        🕐 Part Time
                      </SelectItem>
                      <SelectItem
                        value="REMOTE"
                        className="focus:bg-white/10 focus:text-white"
                      >
                        🌍 Remote
                      </SelectItem>
                      <SelectItem
                        value="CONTRACT"
                        className="focus:bg-white/10 focus:text-white"
                      >
                        📝 Contract
                      </SelectItem>
                      <SelectItem
                        value="INTERNSHIP"
                        className="focus:bg-white/10 focus:text-white"
                      >
                        🎓 Internship
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.jobType && (
                    <p className="text-xs text-red-400">
                      {errors.jobType.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Experience Level <span className="text-red-400">*</span>
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setValue("experience", value as any)
                    }
                  >
                    <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-1 focus:ring-violet-500">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f1729] border-white/10 text-white">
                      <SelectItem
                        value="JUNIOR"
                        className="focus:bg-white/10 focus:text-white"
                      >
                        🌱 Junior
                      </SelectItem>
                      <SelectItem
                        value="MID"
                        className="focus:bg-white/10 focus:text-white"
                      >
                        💼 Mid
                      </SelectItem>
                      <SelectItem
                        value="SENIOR"
                        className="focus:bg-white/10 focus:text-white"
                      >
                        🚀 Senior
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.experience && (
                    <p className="text-xs text-red-400">
                      {errors.experience.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 4: Deadline + Company ID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Deadline
                  </label>
                  <input
                    type="date"
                    className={inputClass}
                    style={{ colorScheme: "dark" }}
                    {...register("deadline")}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Company ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    className={inputClass}
                    placeholder="Paste your company ID"
                    {...register("companyId")}
                  />
                  {errors.companyId && (
                    <p className="text-xs text-red-400">
                      {errors.companyId.message}
                    </p>
                  )}
                </div>
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
                      Posting...
                    </>
                  ) : (
                    "Post Job →"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
