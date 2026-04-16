export default function SkeletonList({ count = 3, height = 'h-24' }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${height} rounded-2xl`} />
      ))}
    </div>
  )
}
