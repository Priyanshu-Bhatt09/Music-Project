"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AuthGate } from "../components/auth-gate";
import { Nav } from "../components/nav";
import { SectionCard } from "../components/section-card";
import { saveLibraryItem, searchCatalog } from "../lib/api";
import type { CatalogItem, SearchType } from "../lib/types";

const searchTypes: SearchType[] = ["albums", "songs", "artists"];

export default function Home() {
  const [query, setQuery] = useState("Coldplay");
  const [type, setType] = useState<SearchType>("albums");
  const [results, setResults] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const title = useMemo(() => {
    const label = type.slice(0, -1);
    return `Search ${label}s`;
  }, [type]);

  useEffect(() => {
    setToken(localStorage.getItem("music_token"));
  }, []);

  async function handleSearch(event?: FormEvent) {
    event?.preventDefault();
    if (query.trim().length < 2) {
      setResults([]);
      setError("Type at least 2 characters to search.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await searchCatalog(query.trim(), type, token);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(item: CatalogItem) {
    setSavingId(item.id);
    setError(null);
    try {
      await saveLibraryItem(
        {
          appleCatalogId: item.id,
          title: item.title,
          artistName: item.artistName,
          genre: item.genre,
          releaseDate: item.releaseDate,
          trackCount: item.trackCount,
          durationSeconds: item.durationSeconds,
          artworkUrl: item.artworkUrl,
          userRating: 4,
          userNotes: "Saved from iTunes search",
        },
        token,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <AuthGate>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,214,170,0.75),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(255,167,214,0.45),_transparent_28%),linear-gradient(180deg,_#fff8ef_0%,_#f8ead8_38%,_#fffdf7_100%)] text-stone-900">
        <Nav />
        <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10">
          <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-rose-50 p-8 shadow-[0_24px_70px_rgba(222,163,74,0.18)]">
              <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-fuchsia-200/60 blur-3xl" />
              <div className="absolute bottom-0 right-10 h-28 w-28 rounded-full bg-cyan-200/60 blur-3xl" />
              <p className="text-sm uppercase tracking-[0.45em] text-fuchsia-500">Search</p>
              <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-stone-900">
                Build a personal music library with a creamy, colorful groove.
              </h2>
              <p className="mt-4 max-w-2xl text-stone-600">
                Search the live iTunes catalog, save picks to your database, and explore your collection with a funky warm UI.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-fuchsia-100 px-4 py-2 text-sm font-medium text-fuchsia-700">JWT protected</span>
                <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">MySQL save</span>
                <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-medium text-cyan-700">Live search</span>
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">Account based</span>
              </div>
            </div>

            <SectionCard title="Quick search" eyebrow="Live mode">
              <form className="space-y-4" onSubmit={handleSearch}>
                <label className="block">
                  <span className="text-sm text-stone-600">Query</span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Try Coldplay, Taylor Swift, or Shape of You"
                    className="mt-2 w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 text-stone-900 outline-none ring-0 placeholder:text-stone-400 focus:border-fuchsia-300 focus:bg-amber-50"
                  />
                </label>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  {searchTypes.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setType(item)}
                      className={`rounded-2xl border px-3 py-3 capitalize transition ${
                        type === item
                          ? "border-fuchsia-300 bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-200"
                          : "border-amber-200 bg-white/80 text-stone-700 hover:border-fuchsia-200 hover:bg-rose-50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[#4a2f1c] px-4 py-3 font-semibold text-white transition hover:bg-[#3d2718]"
                >
                  {title}
                </button>

                <p className="text-sm text-stone-500">
                  {loading ? "Searching the live catalog..." : "Results load when you press the button or hit Enter."}
                </p>
              </form>
            </SectionCard>
          </section>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
          ) : null}

          <SectionCard title="Search results" eyebrow="From iTunes Search API">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-72 animate-pulse rounded-3xl bg-amber-50" />
                  ))}
                </div>
            ) : results.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {results.map((item) => (
                  <article key={item.key} className="rounded-3xl border border-amber-200 bg-white p-4 shadow-[0_14px_40px_rgba(244,168,95,0.13)]">
                    <div className="aspect-square overflow-hidden rounded-2xl bg-amber-100">
                      <img src={item.artworkUrl ?? "/window.svg"} alt={item.title} className="h-full w-full object-cover" />
                    </div>
                    <p className="mt-4 text-xs uppercase tracking-[0.3em] text-fuchsia-500">{item.genre || "Unknown genre"}</p>
                    <h3 className="mt-1 text-lg font-semibold text-stone-900">{item.title}</h3>
                    <p className="text-sm text-stone-600">{item.artistName}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
                      <span>{item.releaseDate || "No release date"}</span>
                      <span>{item.trackCount ? `${item.trackCount} tracks` : "No track count"}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSave(item)}
                      disabled={savingId === item.id}
                      className="mt-4 w-full rounded-2xl bg-stone-900 px-4 py-3 text-sm font-medium text-amber-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {savingId === item.id ? "Saving..." : "Save to library"}
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-amber-200 bg-amber-50/70 p-10 text-center text-stone-500">
                Search for an album, song, or artist to fetch live results.
              </div>
            )}
          </SectionCard>
        </main>
      </div>
    </AuthGate>
  );
}
