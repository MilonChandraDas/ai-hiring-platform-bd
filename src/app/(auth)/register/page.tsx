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
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

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
              className="flex items-start gap-4 bg-secondary/40 border border-border rounded-xl p-4"
            >
              <div className="text-2xl">{card.icon}</div>
              <div>
                <p className="text-foreground font-medium text-sm">
                  {card.title}
                </p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </>
      }
    >
      <div className="mb-7">
        <h2 className="text-2xl font-bold text-foreground mb-1">
          Create your account
        </h2>
        <p className="text-muted-foreground text-sm">
          Start your journey — it only takes a minute
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Username" error={errors.username?.message}>
          <Input
            type="text"
            placeholder="johndoe"
            className="h-11 rounded-xl"
            {...register("username")}
          />
        </FormField>

        <FormField label="Email address" error={errors.email?.message}>
          <Input
            type="email"
            placeholder="you@example.com"
            className="h-11 rounded-xl"
            {...register("email")}
          />
        </FormField>

        <FormField label="Password" error={errors.password?.message}>
          <Input
            type="password"
            placeholder="••••••••"
            className="h-11 rounded-xl"
            {...register("password")}
          />
        </FormField>

        <FormField label="I am a" error={errors.role?.message}>
          <Select
            onValueChange={(value) =>
              setValue("role", value as "CANDIDATE" | "RECRUITER")
            }
          >
            <SelectTrigger className="h-11 w-full rounded-xl">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CANDIDATE">
                👨‍💻 Candidate — Looking for jobs
              </SelectItem>
              <SelectItem value="RECRUITER">
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
              <LoadingSpinner />
              Creating account...
            </span>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-violet-500 hover:text-violet-400 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
