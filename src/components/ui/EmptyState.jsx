export default function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="text-center py-16">
      <div className="text-white/10 flex justify-center mb-4">{icon}</div>
      <p className="text-white/40 text-lg">{title}</p>
      {subtitle && <p className="text-white/25 text-sm mt-2">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
