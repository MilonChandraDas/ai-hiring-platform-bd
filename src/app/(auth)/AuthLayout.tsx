import type { ReactNode } from "react";

interface AuthLayoutProps {
  badgeText: string;
  badgeColor: "violet" | "cyan";
  heading: ReactNode;
  description: string;
  sidePanelExtra: ReactNode;
  children: ReactNode;
}

const badgeColorClasses: Record<AuthLayoutProps["badgeColor"], string> = {
  violet: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
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
    <div className="min-h-screen bg-[#080d1a] flex">
      {/* Left Side */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-14 relative overflow-hidden">
        <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-base">
            🤖
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            AI Hiring
          </span>
        </div>

        <div className="relative z-10 max-w-lg">
          <div
            className={`inline-block text-xs font-medium border px-3 py-1 rounded-full mb-6 tracking-widest uppercase ${badgeColorClasses[badgeColor]}`}
          >
            {badgeText}
          </div>

          <h2 className="text-5xl font-bold text-white leading-[1.15] mb-5">
            {heading}
          </h2>

          <p className="text-slate-400 text-lg leading-relaxed mb-10">
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
                className="border border-white/8 bg-white/4 rounded-xl px-5 py-3 backdrop-blur"
              >
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-600">
          © 2026 AI Hiring Platform. All rights reserved.
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 relative">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-2xl p-8 md:p-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}