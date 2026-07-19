import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Layer 1: Background decoration — full-bleed, edge-to-edge */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[var(--brand)]/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-muted rounded-full blur-3xl pointer-events-none z-0" />
      <div
        className="absolute inset-0 opacity-40 z-0"
        style={{
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Layer 2: Content — Container দিয়ে বাঁধা, decoration এর ওপরে */}
      <div className="relative z-10">
        <Container className="py-14">{children}</Container>
      </div>
    </div>
  );
}
