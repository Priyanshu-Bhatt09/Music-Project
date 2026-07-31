"use client";

import { useEffect, useState } from "react";
import { AuthGate } from "../../components/auth-gate";
import { Nav } from "../../components/nav";
import { SectionCard } from "../../components/section-card";
import { getLibrary } from "../../lib/api";
import type { LibraryItem } from "../../lib/types";

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("music_token"));
  }, []);

  useEffect(() => {
    if (!token) return;

    let active = true;
    getLibrary(token)
      .then((data) => {
        if (active) setItems(data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Failed to load library");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <AuthGate>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,214,170,0.75),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(255,167,214,0.45),_transparent_28%),linear-gradient(180deg,_#fff8ef_0%,_#f8ead8_38%,_#fffdf7_100%)] text-stone-900">
        <Nav />
        <main className="mx-auto max-w-7xl px-6 py-10">
          <SectionCard title="Your library" eyebrow="Saved items from the database">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-40 animate-pulse rounded-3xl bg-amber-50" />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
            ) : items.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {items.map((item) => (
                  <article key={item.id} className="rounded-3xl border border-amber-200 bg-white p-5 shadow-[0_14px_40px_rgba(244,168,95,0.13)]">
                    <div className="flex gap-4">
                      <img
                        src={item.artworkUrl ?? "/window.svg"}
                        alt={item.title}
                        className="h-24 w-24 rounded-2xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-500">{item.genre}</p>
                        <h3 className="mt-1 text-xl font-semibold text-stone-900">{item.title}</h3>
                        <p className="text-sm text-stone-600">{item.artistName}</p>
                        <p className="mt-2 text-sm text-stone-700">{item.userNotes || "No notes"}</p>
                        <div className="mt-3 flex items-center gap-3 text-xs text-stone-500">
                          <span>Rating: {item.userRating ?? "N/A"}</span>
                          <span>{item.releaseDate || "Unknown date"}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-amber-200 bg-amber-50/70 p-10 text-center text-stone-500">
                No saved library items yet. Search from the home page and save a result first.
              </div>
            )}
          </SectionCard>
        </main>
      </div>
    </AuthGate>
  );
}
