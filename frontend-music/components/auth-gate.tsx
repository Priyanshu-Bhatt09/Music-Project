"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("music_token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#fff7e8,_#f2e7d8_45%,_#fbe8cf_100%)] px-6">
        <div className="rounded-[2rem] border border-amber-200 bg-white/85 px-6 py-5 text-stone-700 shadow-xl">
          Checking your session...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
