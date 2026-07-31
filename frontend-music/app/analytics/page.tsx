"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AuthGate } from "../../components/auth-gate";
import { Nav } from "../../components/nav";
import { SectionCard } from "../../components/section-card";
import { StatTile } from "../../components/stat-tile";
import { getInsights, getLibrary } from "../../lib/api";
import type { LibraryItem } from "../../lib/types";

type InsightSummary = {
  summary: string;
  highlights: string[];
  recommendations: string[];
};

type ChartDatum = {
  name: string;
  value: number;
  fill: string;
};

const REFRESH_INTERVAL_MS = 15000;
const THEME_COLORS = ["#4a2f1c", "#8b5e34", "#c17c5a", "#d8a15d", "#f2c98a", "#7a6757"];

function formatMinutes(totalMinutes: number) {
  return `${totalMinutes}m`;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number; name?: string; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-white/95 px-4 py-3 shadow-lg shadow-amber-950/10">
      {label ? <p className="text-xs uppercase tracking-[0.3em] text-stone-500">{label}</p> : null}
      <div className="mt-2 space-y-1">
        {payload.map((item) => (
          <p key={item.name} className="text-sm text-stone-800">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color ?? "#4a2f1c" }} />
            <span className="ml-2">{item.name}:</span>
            <span className="ml-2 font-semibold">{item.value}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [summary, setSummary] = useState<InsightSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("music_token"));
  }, []);

  useEffect(() => {
    if (!token) return;

    let active = true;

    const loadAnalytics = async (background = false) => {
      if (background) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const [library, insight] = await Promise.all([getLibrary(token), getInsights(token)]);
        if (!active) return;
        setItems(library);
        setSummary(insight as InsightSummary);
        setLastUpdated(new Date());
      } finally {
        if (!active) return;
        setLoading(false);
        setRefreshing(false);
      }
    };

    void loadAnalytics(false);
    const intervalId = window.setInterval(() => {
      void loadAnalytics(true);
    }, REFRESH_INTERVAL_MS);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [token]);

  const genreShare = useMemo<ChartDatum[]>(() => {
    const counts = new Map<string, number>();
    items.forEach((item) => counts.set(item.genre || "Unknown", (counts.get(item.genre || "Unknown") ?? 0) + 1));
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], index) => ({
        name,
        value,
        fill: THEME_COLORS[index % THEME_COLORS.length],
      }));
  }, [items]);

  const releasesByYear = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((item) => {
      const year = item.releaseDate ? new Date(item.releaseDate).getFullYear().toString() : "Unknown";
      counts.set(year, (counts.get(year) ?? 0) + 1);
    });

    return Array.from(counts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([year, count]) => ({
        year,
        releases: count,
      }));
  }, [items]);

  const genreVolumes = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((item) => counts.set(item.genre || "Unknown", (counts.get(item.genre || "Unknown") ?? 0) + 1));
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([genre, count]) => ({
        genre,
        count,
      }));
  }, [items]);

  const ratingDistribution = useMemo(() => {
    return [1, 2, 3, 4, 5].map((rating, index) => ({
      rating: `${rating}★`,
      count: items.filter((item) => (item.userRating ?? 0) === rating).length,
      fill: THEME_COLORS[index % THEME_COLORS.length],
    }));
  }, [items]);

  const avgRating = items.length ? (items.reduce((sum, item) => sum + (item.userRating ?? 0), 0) / items.length).toFixed(1) : "0.0";
  const avgDuration = items.length
    ? Math.round(items.reduce((sum, item) => sum + (item.durationSeconds ?? 0), 0) / items.length / 60)
    : 0;

  return (
    <AuthGate>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,214,170,0.75),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(255,167,214,0.45),_transparent_28%),linear-gradient(180deg,_#fff8ef_0%,_#f8ead8_38%,_#fffdf7_100%)] text-stone-900">
        <Nav />
        <main className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Analytics</p>
              <h1 className="text-3xl font-semibold">Music patterns at a glance</h1>
            </div>
            <div className="rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-sm text-stone-600">
              {refreshing ? "Refreshing live data..." : loading ? "Loading analytics..." : `Live sync every ${REFRESH_INTERVAL_MS / 1000}s`}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <StatTile label="Saved items" value={loading ? "..." : String(items.length)} hint="Live database" />
            <StatTile label="Distinct genres" value={loading ? "..." : String(genreShare.length)} hint="From MySQL" />
            <StatTile label="Avg rating" value={loading ? "..." : avgRating} hint="User ratings" />
            <StatTile label="Avg duration" value={loading ? "..." : formatMinutes(avgDuration)} hint="Album duration" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <SectionCard title="Genre share" eyebrow="Donut chart">
              <div className="mt-2 grid gap-6 lg:grid-cols-[minmax(240px,320px)_1fr] lg:items-center">
                <div className="h-72">
                  {genreShare.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip content={<ChartTooltip />} />
                        <Legend
                          verticalAlign="bottom"
                          iconType="circle"
                          wrapperStyle={{ fontSize: "12px", color: "#54453b" }}
                        />
                        <Pie
                          data={genreShare}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={58}
                          outerRadius={88}
                          paddingAngle={3}
                        >
                          {genreShare.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} stroke="#fff8ef" strokeWidth={2} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-amber-200 bg-amber-50/60 text-stone-500">
                      Add music to see genre share.
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {genreShare.length ? (
                    genreShare.map((entry) => (
                      <div key={entry.name} className="flex items-center justify-between rounded-2xl bg-amber-50/70 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: entry.fill }} />
                          <span className="text-sm font-medium text-stone-700">{entry.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-stone-900">{entry.value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-stone-500">No genre data yet.</p>
                  )}
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Releases by year" eyebrow="Line chart">
              <div className="mt-2 h-72 rounded-3xl border border-amber-200 bg-white/75 p-3">
                {releasesByYear.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={releasesByYear} margin={{ top: 10, right: 18, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="4 4" stroke="#ead9c3" vertical={false} />
                      <XAxis dataKey="year" tick={{ fill: "#756254", fontSize: 12 }} axisLine={{ stroke: "#d8c0a1" }} tickLine={false} />
                      <YAxis tick={{ fill: "#756254", fontSize: 12 }} axisLine={{ stroke: "#d8c0a1" }} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="releases"
                        name="Releases"
                        stroke="#4a2f1c"
                        strokeWidth={4}
                        dot={{ r: 5, fill: "#8b5e34", stroke: "#fff8ef", strokeWidth: 2 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-stone-500">No release data yet.</div>
                )}
              </div>
            </SectionCard>

            <SectionCard title="Genre volume" eyebrow="Bar chart">
              <div className="mt-2 h-72 rounded-3xl border border-amber-200 bg-white/75 p-3">
                {genreVolumes.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={genreVolumes} layout="vertical" margin={{ top: 8, right: 18, left: 30, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="4 4" stroke="#ead9c3" horizontal={false} />
                      <XAxis type="number" allowDecimals={false} tick={{ fill: "#756254", fontSize: 12 }} axisLine={{ stroke: "#d8c0a1" }} tickLine={false} />
                      <YAxis
                        type="category"
                        dataKey="genre"
                        width={110}
                        tick={{ fill: "#756254", fontSize: 12 }}
                        axisLine={{ stroke: "#d8c0a1" }}
                        tickLine={false}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="count" name="Tracks" radius={[0, 14, 14, 0]}>
                        {genreVolumes.map((entry, index) => (
                          <Cell key={entry.genre} fill={THEME_COLORS[index % THEME_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-stone-500">No genres yet.</div>
                )}
              </div>
            </SectionCard>

            <SectionCard title="Rating spread" eyebrow="Histogram">
              <div className="mt-2 h-72 rounded-3xl border border-amber-200 bg-white/75 p-3">
                {ratingDistribution.some((item) => item.count > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ratingDistribution} margin={{ top: 10, right: 18, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="4 4" stroke="#ead9c3" vertical={false} />
                      <XAxis dataKey="rating" tick={{ fill: "#756254", fontSize: 12 }} axisLine={{ stroke: "#d8c0a1" }} tickLine={false} />
                      <YAxis tick={{ fill: "#756254", fontSize: 12 }} axisLine={{ stroke: "#d8c0a1" }} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="count" name="Saved items" radius={[14, 14, 0, 0]}>
                        {ratingDistribution.map((entry) => (
                          <Cell key={entry.rating} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-stone-500">No ratings yet.</div>
                )}
              </div>
            </SectionCard>
          </div>

          {summary ? (
            <SectionCard title="AI summary" eyebrow="Trend summary">
              <p className="text-stone-700">{summary.summary}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-sm uppercase tracking-[0.3em] text-stone-600">Highlights</h3>
                  <ul className="space-y-2 text-sm text-stone-700">
                    {summary.highlights.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 text-sm uppercase tracking-[0.3em] text-stone-600">Recommendations</h3>
                  <ul className="space-y-2 text-sm text-stone-700">
                    {summary.recommendations.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {lastUpdated ? (
                <p className="mt-4 text-xs uppercase tracking-[0.25em] text-stone-500">Last updated {lastUpdated.toLocaleTimeString()}</p>
              ) : null}
            </SectionCard>
          ) : null}
        </main>
      </div>
    </AuthGate>
  );
}
