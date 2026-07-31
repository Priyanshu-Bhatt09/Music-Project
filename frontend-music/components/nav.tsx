"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Search" },
  { href: "/library", label: "Library" },
  { href: "/analytics", label: "Analytics" },
];

export function Nav() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("music_token"));
  }, []);

  function handleLogout() {
    localStorage.removeItem("music_token");
    setToken(null);
    router.replace("/auth/login");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-amber-200/70 bg-[rgba(247,240,230,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.45em] text-stone-500">Muse Library</p>
          <h1 className="text-lg font-semibold text-stone-900">Music search + analytics</h1>
        </div>
        <nav className="flex items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-amber-200 bg-white/70 px-4 py-2 text-sm font-medium text-stone-800 transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50"
            >
              {link.label}
            </Link>
          ))}
          {token ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-[#4a2f1c] px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#3d2718]"
            >
              Sign out
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
