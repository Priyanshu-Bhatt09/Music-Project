import type { ReactNode } from "react";

export function SectionCard({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-amber-200 bg-white/75 p-6 shadow-[0_20px_60px_rgba(217,164,95,0.14)] backdrop-blur">
      {eyebrow ? (
        <p className="mb-2 text-xs uppercase tracking-[0.35em] text-fuchsia-500">{eyebrow}</p>
      ) : null}
      <h2 className="mb-4 text-2xl font-semibold text-stone-900">{title}</h2>
      {children}
    </section>
  );
}
