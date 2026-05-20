export default function StatCard({ title, value }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-glow">
      <p className="text-sm text-muted">{title}</p>
      <p className="text-2xl font-semibold text-white mt-2">{value}</p>
    </div>
  )
}
