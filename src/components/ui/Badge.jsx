export default function Badge({ status }) {
  const map = {
    confirmed: 'badge-green',
    cancelled: 'badge-red',
    reserved: 'badge-gold',
    pending: 'badge-gold',
    active: 'badge-green',
  }
  return <span className={`badge ${map[status] || 'badge-blue'}`}>{status}</span>
}
