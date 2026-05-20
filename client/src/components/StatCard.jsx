export default function StatCard({ title, value }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-glow min-h-[108px] flex flex-col justify-between transition-colors hover:border-accent/50">
      <p className="text-xs uppercase tracking-wide text-muted">{title}</p>
      <p className="text-2xl font-semibold text-white mt-3 leading-tight">{value}</p>
    </div>
  )
}
