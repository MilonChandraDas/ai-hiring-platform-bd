import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { ThemeToggle } from "@/components/theme-toggle";

interface AuthLayoutProps {
  badgeText: string;
  badgeColor: "violet" | "cyan";
  heading: ReactNode;
  description: string;
  sidePanelExtra: ReactNode;
  children: ReactNode;
}

const badgeColorClasses: Record<AuthLayoutProps["badgeColor"], string> = {
  violet:
    "text-[var(--brand-foreground)] bg-[var(--brand)]/15 border-[var(--brand)]/30",
  cyan: "text-muted-foreground bg-muted border-border",
};

export function AuthLayout({
  badgeText,
  badgeColor,
  heading,
  description,
  sidePanelExtra,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>
      <Container className="flex">
        {/* Left Side */}
        <div className="hidden lg:flex flex-col w-1/2 py-14 pr-14 relative overflow-hidden">
          <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] bg-[var(--brand)]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] bg-muted rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-base">
              🤖
            </div>
            <span className="text-foreground font-semibold text-lg tracking-tight">
              AI Hiring
            </span>
          </div>

          {/* মূল content — বাকি সব জায়গা নিয়ে vertically centered */}
          <div className="relative z-10 max-w-lg flex-1 flex flex-col justify-center">
            <div
              className={`inline-block w-fit text-xs font-medium border px-3 py-1 rounded-full mb-6 tracking-widest uppercase ${badgeColorClasses[badgeColor]}`}
            >
              {badgeText}
            </div>

            <h2 className="text-5xl font-bold text-foreground leading-[1.15] mb-5">
              {heading}
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              {description}
            </p>

            <div className="space-y-3 mb-10">{sidePanelExtra}</div>

            <div className="flex gap-6">
              {[
                { value: "10K+", label: "Developers" },
                { value: "500+", label: "Companies" },
                { value: "95%", label: "Match Rate" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="border border-border bg-secondary/40 rounded-xl px-5 py-3"
                >
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 text-xs text-muted-foreground">
            © 2026 AI Hiring Platform. All rights reserved.
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex items-center justify-center py-6 md:py-10 relative">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10 w-full max-w-md">
            <div className="bg-card border border-border rounded-2xl p-8 md:p-10">
              {children}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
