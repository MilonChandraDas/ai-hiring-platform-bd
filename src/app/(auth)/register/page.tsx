"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterDto, registerSchema } from "@/schemas/auth.schema";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterDto) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/register`, data);
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1a] flex">
      {/* Left Side */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-14 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-base">
            🤖
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            AI Hiring
          </span>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-lg">
          <div className="inline-block text-xs font-medium text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-3 py-1 rounded-full mb-6 tracking-widest uppercase">
            Join Today
          </div>

          <h2 className="text-5xl font-bold text-white leading-[1.15] mb-5">
            Your next opportunity
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
              starts here.
            </span>
          </h2>

          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Whether you're a developer looking for your dream job or a recruiter
            building a world-class team — we've got you covered.
          </p>

          {/* Role cards */}
          <div className="space-y-3 mb-10">
            <div className="flex items-start gap-4 bg-white/4 border border-white/8 rounded-xl p-4">
              <div className="text-2xl">👨‍💻</div>
              <div>
                <p className="text-white font-medium text-sm">For Candidates</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  Get AI-matched with jobs that fit your skills and goals
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white/4 border border-white/8 rounded-xl p-4">
              <div className="text-2xl">🏢</div>
              <div>
                <p className="text-white font-medium text-sm">For Recruiters</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  Find and hire top developers faster with AI screening
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            {[
              { value: "10K+", label: "Developers" },
              { value: "500+", label: "Companies" },
              { value: "95%", label: "Match Rate" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border border-white/8 bg-white/4 rounded-xl px-5 py-3 backdrop-blur"
              >
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-600">
          © 2026 AI Hiring Platform. All rights reserved.
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 relative">
        {/* Subtle grid bg */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 w-full max-w-md">
          {/* Card */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-2xl p-8 md:p-10">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-white mb-1">
                Create your account
              </h2>
              <p className="text-slate-400 text-sm">
                Start your journey — it only takes a minute
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-300">
                  Username
                </Label>
                <Input
                  type="text"
                  placeholder="johndoe"
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-1 focus-visible:ring-violet-500 focus-visible:border-violet-500"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-xs text-red-400">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-300">
                  Email address
                </Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-1 focus-visible:ring-violet-500 focus-visible:border-violet-500"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-300">
                  Password
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-1 focus-visible:ring-violet-500 focus-visible:border-violet-500"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-300">
                  I am a
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("role", value as "CANDIDATE" | "RECRUITER")
                  }
                >
                  <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-1 focus:ring-violet-500">
                    <SelectValue
                      placeholder="Select your role"
                      className="text-slate-600"
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f1729] border-white/10 text-white">
                    <SelectItem
                      value="CANDIDATE"
                      className="focus:bg-white/10 focus:text-white"
                    >
                      👨‍💻 Candidate — Looking for jobs
                    </SelectItem>
                    <SelectItem
                      value="RECRUITER"
                      className="focus:bg-white/10 focus:text-white"
                    >
                      🏢 Recruiter — Hiring developers
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-xs text-red-400">{errors.role.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium rounded-xl border-0 transition-all duration-200 mt-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
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
                    Creating account...
                  </span>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/8 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
