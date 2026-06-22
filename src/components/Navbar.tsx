"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  return (
    <nav className="bg-[#080d1a]/95 border-b border-white/8 backdrop-blur-xl px-6 py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-sm">
            🤖
          </div>
          <span className="text-white font-semibold text-base tracking-tight">
            AI Hiring
          </span>
        </Link>

        {/* Links */}
        <div className="flex gap-1 items-center">
          <Link
            href="/jobs"
            className="text-slate-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-white/8 transition-all duration-150"
          >
            Jobs
          </Link>

          {user?.role === "RECRUITER" && (
            <>
              <Link
                href="/companies/my-company"
                className="text-slate-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-white/8 transition-all duration-150"
              >
                My Company
              </Link>
              <Link
                href="/jobs/create"
                className="text-slate-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-white/8 transition-all duration-150"
              >
                Post Job
              </Link>
            </>
          )}

          {user?.role === "CANDIDATE" && (
            <>
              <Link
                href="/resume/create"
                className="text-slate-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-white/8 transition-all duration-150"
              >
                My Resume
              </Link>
              <Link
                href="/applications"
                className="text-slate-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-white/8 transition-all duration-150"
              >
                Applications
              </Link>
            </>
          )}
        </div>

        {/* User info + Logout */}
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm text-slate-400">{user?.username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-red-400 border border-white/10 hover:border-red-400/30 px-3 py-1.5 rounded-lg transition-all duration-150"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
