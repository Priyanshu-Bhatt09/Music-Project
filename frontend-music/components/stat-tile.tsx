export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-amber-200 bg-white/80 p-5 shadow-[0_14px_40px_rgba(245,158,11,0.12)]">
      <p className="text-sm text-stone-500">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold text-stone-900">{value}</p>
        <span className="text-xs font-medium text-emerald-600">{hint}</span>
      </div>
    </div>
  );
}
