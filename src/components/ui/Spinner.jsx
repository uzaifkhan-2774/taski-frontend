export default function Spinner({ size = 16, color = 'border-black' }) {
  return (
    <div
      className={`rounded-full animate-spin border-2 border-t-transparent ${color}`}
      style={{ width: size, height: size }}
    />
  )
}
