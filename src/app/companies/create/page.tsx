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
import { useState } from "react";
import { toast } from "sonner";

const companySchema = z.object({
  name: z.string().min(2, "Company name required"),
  email: z.string().email("Valid email required"),
  website: z.string().optional(),
  location: z.string().optional(),
  type: z.enum(["STARTUP", "SME", "ENTERPRISE", "AGENCY", "REMOTE"]),
  phone: z.string().optional(),
  description: z.string().optional(),
});

type CompanyDto = z.infer<typeof companySchema>;

const inputClass =
  "w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all h-11";

export default function CreateCompanyPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CompanyDto>({
    resolver: zodResolver(companySchema),
  });

  const onSubmit = async (data: CompanyDto) => {
    setLoading(true);
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      await axios.post(`${API_URL}/companies`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Company created successfully!");
      router.push("/dashboard");
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
          {/* Card */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-2xl p-8 md:p-10">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-1">
                Create Company
              </h1>
              <p className="text-slate-400 text-sm">
                Set up your company profile to start posting jobs
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Company Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    className={inputClass}
                    placeholder="Google"
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
                    placeholder="company@gmail.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Website
                  </label>
                  <input
                    className={inputClass}
                    placeholder="https://google.com"
                    {...register("website")}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Phone
                  </label>
                  <input
                    className={inputClass}
                    placeholder="01700000000"
                    {...register("phone")}
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Company Type <span className="text-red-400">*</span>
                  </label>
                  <Select
                    onValueChange={(value) => setValue("type", value as any)}
                  >
                    <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-1 focus:ring-violet-500">
                      <SelectValue
                        placeholder="Select type"
                        className="text-slate-600"
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f1729] border-white/10 text-white">
                      <SelectItem
                        value="STARTUP"
                        className="focus:bg-white/10 focus:text-white"
                      >
                        🚀 Startup
                      </SelectItem>
                      <SelectItem
                        value="SME"
                        className="focus:bg-white/10 focus:text-white"
                      >
                        🏪 SME
                      </SelectItem>
                      <SelectItem
                        value="ENTERPRISE"
                        className="focus:bg-white/10 focus:text-white"
                      >
                        🏢 Enterprise
                      </SelectItem>
                      <SelectItem
                        value="AGENCY"
                        className="focus:bg-white/10 focus:text-white"
                      >
                        🎯 Agency
                      </SelectItem>
                      <SelectItem
                        value="REMOTE"
                        className="focus:bg-white/10 focus:text-white"
                      >
                        🌍 Remote
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-xs text-red-400">
                      {errors.type.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell candidates about your company, culture, and mission..."
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all resize-none"
                  {...register("description")}
                />
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
                      Creating...
                    </>
                  ) : (
                    "Create Company"
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
