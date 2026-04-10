/**
 * URL gambar dari API: null / "" / whitespace → null supaya tidak jadi src="" di <img>.
 * Kartu provider memakai placeholder (🎰) bila hasil null.
 */
export function normalizeImageUrl(value) {
  if (value == null) return null
  const t = String(value).trim()
  return t === '' ? null : t
}
