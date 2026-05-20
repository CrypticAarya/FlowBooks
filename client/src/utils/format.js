export function formatMoney(amount) {
  return `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

export function formatDate(date) {
  return new Date(date).toISOString().slice(0, 10)
}

export function shortId(id) {
  return id ? String(id).slice(-6).toUpperCase() : ''
}
