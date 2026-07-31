"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { signup } from "../../../lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("music_token")) {
      router.replace("/");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await signup(email, password);
      localStorage.setItem("music_token", response.token);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,214,170,0.75),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(255,167,214,0.45),_transparent_28%),linear-gradient(180deg,_#fff8ef_0%,_#f8ead8_38%,_#fffdf7_100%)] px-6 py-8 text-stone-900">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center gap-8 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <section className="rounded-[2.5rem] border border-amber-200 bg-white/75 p-8 shadow-[0_24px_70px_rgba(222,163,74,0.18)] backdrop-blur">
          <h1 className="mt-4 text-5xl font-semibold leading-tight">Create your account and jump in.</h1>
          <p className="mt-4 max-w-xl text-stone-600">
            Signup creates a real account in the backend, hashes your password, and issues a JWT so you can start using the app immediately.
          </p>
        </section>

        <section className="rounded-[2.5rem] border border-amber-200 bg-white/85 p-8 shadow-[0_24px_70px_rgba(222,163,74,0.18)] backdrop-blur">
          <h2 className="mt-3 text-3xl font-semibold">Make your account</h2>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              placeholder="Email"
              className="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-fuchsia-300 focus:bg-amber-50"
            />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
              minLength={6}
              placeholder="Password"
              className="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 text-stone-900 outline-none placeholder:text-stone-400 focus:border-fuchsia-300 focus:bg-amber-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#4a2f1c] px-4 py-3 font-semibold text-white transition hover:bg-[#3d2718] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
          ) : null}

          <p className="mt-6 text-sm text-stone-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-fuchsia-600 underline decoration-fuchsia-300 underline-offset-4">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
