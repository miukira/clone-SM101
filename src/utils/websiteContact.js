/**
 * website.contact dari API: bisa string URL, placeholder "#", objek lama { link, icon? }.
 */

export function extractContactUrl(value) {
  if (value == null) return null
  if (typeof value === 'string') {
    const t = value.trim()
    if (t === '' || t === '#') return null
    return t
  }
  if (typeof value === 'object' && value != null) {
    const u = value.link
    if (u == null) return null
    const t = String(u).trim()
    if (t === '' || t === '#') return null
    return t
  }
  return null
}

/**
 * Hanya tiga kunci respon: whatsapp, telegram, testimoni — nilai `null` bila invalid / # / kosong
 */
export function normalizeContactLinks(contact) {
  if (!contact || typeof contact !== 'object') {
    return { whatsapp: null, telegram: null, testimoni: null }
  }
  return {
    whatsapp: extractContactUrl(contact.whatsapp),
    telegram: extractContactUrl(contact.telegram),
    testimoni: extractContactUrl(contact.testimoni),
  }
}

const ORDER = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'testimoni', label: 'Testimoni' },
]

/**
 * Tiga baris sesuai respon: whatsapp, telegram, testimoni.
 * @returns {{ id, key, labelKey, href, icon }[]} `labelKey` — kunci i18n (t(labelKey))
 */
export function getContactMenuItems(raw) {
  const c = raw && typeof raw === 'object' ? raw : {}
  const getHref = (key) => (c[key] == null ? null : extractContactUrl(c[key]))
  return [
    { id: 'wa', key: 'whatsapp', labelKey: 'contact.whatsapp', href: getHref('whatsapp'), icon: 'wa' },
    { id: 'tg', key: 'telegram', labelKey: 'contact.telegram', href: getHref('telegram'), icon: 'tg' },
    { id: 'tm', key: 'testimoni', labelKey: 'contact.testimoni', href: getHref('testimoni'), icon: 'testimoni' },
  ]
}

/**
 * Hanya entri yang punya href, urut seperti config: whatsapp → telegram → testimoni
 */
export function getOrderedContactMenuEntries(links) {
  const w = links?.whatsapp
  const t = links?.telegram
  const m = links?.testimoni
  const byId = { whatsapp: w, telegram: t, testimoni: m }
  return ORDER.filter((d) => byId[d.id]).map((d) => ({
    id: d.id,
    label: d.label,
    href: byId[d.id],
  }))
}

/**
 * @deprecated — pakai `getContactMenuItems` (tiga kunci)
 */
export function getContactPanelRows(raw) {
  return ORDER.map((d) => {
    const v = (raw && typeof raw === 'object' ? raw : {})[d.id]
    const href = v == null ? null : extractContactUrl(v)
    const state = href ? 'ok' : String(v || '').trim() === '#' ? 'hash' : 'empty'
    return { id: d.id, label: d.label, href, state }
  })
}

export function openExternalContactHref(href) {
  if (href == null) return
  const s = String(href).trim()
  if (s === '' || s === '#') return

  try {
    if (s.startsWith('/')) {
      const u = new URL(s, window.location.origin)
      window.open(u.toString(), '_blank', 'noopener,noreferrer')
      return
    }
  } catch {
    // continue
  }

  const lower = s.toLowerCase()
  if (lower.startsWith('http:') || lower.startsWith('https:') || lower.startsWith('mailto:') || lower.startsWith('tel:') || lower.startsWith('//')) {
    const url = s.startsWith('//') ? `https:${s}` : s
    window.open(url, '_blank', 'noopener,noreferrer')
    return
  }
  if (lower.startsWith('wa.me/') || lower.startsWith('www.')) {
    window.open(`https://${s.replace(/^\/\//, '')}`, '_blank', 'noopener,noreferrer')
    return
  }
  window.open(s, '_blank', 'noopener,noreferrer')
}

/**
 * Satu atau beberapa link: jika satu → buka; jika banyak → caller tampilkan sheet; jika tidak ada → { none: true }
 * @returns {{ type: 'none' }|{ type: 'open', href: string }|{ type: 'menu', entries: { id, label, href }[] }}
 */
export function getContactUserAction(raw) {
  const n = normalizeContactLinks(raw)
  const entries = getOrderedContactMenuEntries(n)
  if (entries.length === 0) return { type: 'none' }
  if (entries.length === 1) return { type: 'open', href: entries[0].href }
  return { type: 'menu', entries }
}
