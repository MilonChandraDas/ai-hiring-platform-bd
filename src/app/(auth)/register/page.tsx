"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { AuthLayout } from "@/app/(auth)/AuthLayout";
import { FormField } from "@/app/(auth)/FromField";

const ROLE_CARDS = [
  {
    icon: "👨‍💻",
    title: "For Candidates",
    description: "Get AI-matched with jobs that fit your skills and goals",
  },
  {
    icon: "🏢",
    title: "For Recruiters",
    description: "Find and hire top developers faster with AI screening",
  },
];

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
    <AuthLayout
      badgeText="Join Today"
      badgeColor="cyan"
      heading={
        <>
          Your next opportunity
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
            starts here.
          </span>
        </>
      }
      description="Whether you're a developer looking for your dream job or a recruiter building a world-class team — we've got you covered."
      sidePanelExtra={
        <>
          {ROLE_CARDS.map((card) => (
            <div
              key={card.title}
              className="flex items-start gap-4 bg-white/4 border border-white/8 rounded-xl p-4"
            >
              <div className="text-2xl">{card.icon}</div>
              <div>
                <p className="text-white font-medium text-sm">{card.title}</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </>
      }
    >
      <div className="mb-7">
        <h2 className="text-2xl font-bold text-white mb-1">
          Create your account
        </h2>
        <p className="text-slate-400 text-sm">
          Start your journey — it only takes a minute
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Username" error={errors.username?.message}>
          <Input
            type="text"
            placeholder="johndoe"
            className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-1 focus-visible:ring-violet-500 focus-visible:border-violet-500"
            {...register("username")}
          />
        </FormField>

        <FormField label="Email address" error={errors.email?.message}>
          <Input
            type="email"
            placeholder="you@example.com"
            className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-1 focus-visible:ring-violet-500 focus-visible:border-violet-500"
            {...register("email")}
          />
        </FormField>

        <FormField label="Password" error={errors.password?.message}>
          <Input
            type="password"
            placeholder="••••••••"
            className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-1 focus-visible:ring-violet-500 focus-visible:border-violet-500"
            {...register("password")}
          />
        </FormField>

        <FormField label="I am a" error={errors.role?.message}>
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
        </FormField>

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
    </AuthLayout>
  );
}
