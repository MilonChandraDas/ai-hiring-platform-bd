"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";

const CANDIDATE_LINKS = [
  { href: "/resume/create", label: "My Resume" },
  { href: "/applications", label: "Applications" },
  { href: "/interviews", label: "Interviews" },
];

const RECRUITER_LINKS = [
  { href: "/companies/my-company", label: "My Company" },
  { href: "/jobs/create", label: "Post Job" },
  { href: "/recruiter/applications", label: "Applications" },
];

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  const roleLinks =
    user?.role === "RECRUITER"
      ? RECRUITER_LINKS
      : user?.role === "CANDIDATE"
        ? CANDIDATE_LINKS
        : [];

  const navLinks = [{ href: "/jobs", label: "Jobs" }, ...roleLinks];

  return (
    <nav className="bg-background/95 border-b border-border backdrop-blur-xl px-6 py-4 sticky top-0 z-50">
      <Container className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-sm">
            🤖
          </div>
          <span className="text-foreground font-semibold text-base tracking-tight">
            AI Hiring
          </span>
        </Link>

        {/* Links */}
        <div className="flex gap-1 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/100 hover:text-foreground text-sm px-3 py-2 rounded-lg hover:bg-muted transition-all duration-150"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* User info + Logout */}
        <div className="flex gap-3 items-center">
          <ThemeToggle />
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm text-foreground/80">{user?.username}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive"
          >
            Logout
          </Button>
        </div>
      </Container>
    </nav>
  );
}
