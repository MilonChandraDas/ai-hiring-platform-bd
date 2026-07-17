"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { loginSchema, LoginDto } from "@/schemas/auth.schema";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import { AuthLayout } from "@/app/(auth)/AuthLayout";
import { FormField } from "@/app/(auth)/FromField";

const FEATURES = [
  "AI resume screening & scoring",
  "Smart candidate–job matching",
  "Automated interview scheduling",
  "Real-time application tracking",
];

export default function LoginPage() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginDto) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, data);
      setAuth(response.data.token, response.data.user);
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      document.cookie = `token=${response.data.token}; path=/; expires=${expires.toUTCString()}`;
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      badgeText="Powered by AI"
      badgeColor="violet"
      heading={
        <>
          Hire smarter.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
            Build faster.
          </span>
        </>
      }
      description="The AI-powered hiring platform that matches top developers with the right companies — in minutes, not months."
      sidePanelExtra={
        <>
          {FEATURES.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-[var(--brand)]/15 border border-[var(--brand)]/30 flex items-center justify-center flex-shrink-0">
                <svg
                  className="h-3 w-3 text-[var(--brand-foreground)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-muted-foreground text-sm">{feature}</span>
            </div>
          ))}
        </>
      }
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-1">
          Welcome back
        </h2>
        <p className="text-muted-foreground text-sm">
          Sign in to continue to your dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium rounded-xl border-0 transition-all duration-200"
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
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-violet-500 hover:text-violet-400 font-medium transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
