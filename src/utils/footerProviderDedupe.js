import { normalizeImageUrl } from './normalizeImageUrl.js'

const ZW = /[\u200B-\u200D\uFEFF]/g

/** Sufiks id slug (jili-fishing, pragmatic-casino) → jili, pragmatic. */
const ID_TRAILING_CAT = new RegExp(
  '-(fishing-1|fishing|fish|casino|sports?|esports?|esport|table|arcade|slot|slots?|play|live|game|games?)$',
  'i',
)

const LABEL_SUFFIX = [
  /\s+\(slot\)$/i,
  /\s+\(slots\)$/i,
  /\s+\(fishing\)$/i,
  /\s+\(fish\)$/i,
  /\s+\(casino\)$/i,
  /\s+\(sports?\)$/i,
  /\s+\(table\)$/i,
  /^\s*\(slot\)\s*/i,
  /^\s*\(fishing\)\s*/i,
  /\s+play$/i,
  /\s+live$/i,
  /\s+gaming$/i,
  /\s+game$/i,
  /\s+games$/i,
  /\s+fishing$/i,
  /\s+fish$/i,
  /\s+casino$/i,
  /\s+slots?$/i,
  /\s+sport(s)?$/i,
  /\s+table(s)?$/i,
  /\s+arcade$/i,
  /\s+esport(s)?$/i,
  /\s+esports?$/i,
  /\bstudio\s*$/i,
]

function takeBeforePipe(s) {
  if (!s) return s
  return s.split('|', 1)[0].trim()
}

/**
 * Urutan: name (API transform sering paling rapi) → display_name → logoAlt.
 * logoAlt paling akhir: bila `transformProviderApi` isi `logoAlt` dari `provider.name` mentah
 * (beda per endpoint), sebaliknya melemahkan dedup.
 */
function rawLabelForKey(p) {
  if (p?.name != null && String(p.name).trim() !== '') return String(p.name)
  if (p?.display_name != null && String(p.display_name).trim() !== '') return String(p.display_name)
  if (p?.logoAlt != null && String(p.logoAlt).trim() !== '') return String(p.logoAlt)
  return ''
}

function labelKeyFromRaw(s) {
  let t = s
  t = takeBeforePipe(t)
  t = t.replace(ZW, ' ')
  t = t.normalize('NFKC')
  t = t.toLowerCase()
  t = t.replace(/[\s\u00A0]+/g, ' ').trim()

  for (let r = 0; r < 6; r++) {
    const prev = t
    for (const re of LABEL_SUFFIX) {
      t = t.replace(re, '').replace(/[\s\u00A0]+/g, ' ').trim()
    }
    if (t === prev) break
  }
  t = t.replace(/[\s\u00A0]+/g, ' ').trim()
  return t
}

/**
 * pragmatic-play, pragmatic-casino → pragmatic (config id string).
 * Harus sambil `FooterChrome` merge: jaga `id` string dari config saat API timpa dengan number.
 */
function footerIdSlugKey(p) {
  if (typeof p?.id !== 'string' || p.id.length < 1) return ''
  let t = p.id
  for (let i = 0; i < 8; i++) {
    const n = t.replace(ID_TRAILING_CAT, '')
    if (n === t) break
    t = n
  }
  return t.toLowerCase()
}

/**
 * Kunci tampil: slug id bila ada (paling kuat), else label ternormalisasi.
 */
export function footerProviderBrandKey(p) {
  const fromId = footerIdSlugKey(p)
  if (fromId.length > 0) return fromId
  return labelKeyFromRaw(rawLabelForKey(p))
}

export function footerProviderImageKey(p) {
  const a = normalizeImageUrl(p?.logoImg) ?? normalizeImageUrl(p?.characterImg)
  if (a == null) return null
  try {
    if (/^https?:/i.test(a) || a.startsWith('//')) {
      const u = new URL(a, typeof window !== 'undefined' ? window.location.origin : 'http://local.invalid')
      return u.pathname.toLowerCase()
    }
  } catch {
    // fall through
  }
  return a.split('?')[0].split('#')[0].toLowerCase()
}

/**
 * @param {object[]} fromMapValues hasil merge per id + overlay API
 */
export function dedupeFooterProvidersByBrandAndImage(fromMapValues) {
  const list = fromMapValues || []
  if (list.length === 0) return []

  const withSort = list.map((p) => {
    const idNum = p?.provider_id ?? p?.id
    const pid =
      typeof idNum === 'number' && !Number.isNaN(idNum) ? idNum : Number(idNum) || 0
    return {
      p,
      bKey: footerProviderBrandKey(p),
      imgKey: footerProviderImageKey(p),
      pid,
    }
  })

  withSort.sort((a, b) => {
    if (a.bKey !== b.bKey) return a.bKey.localeCompare(b.bKey)
    return a.pid - b.pid
  })

  const seenBrand = new Set()
  const afterBrand = []
  for (const x of withSort) {
    if (x.bKey === '') {
      const fk = `__id__${x.p?.provider_id ?? x.p?.id ?? x.pid}`
      if (seenBrand.has(fk)) continue
      seenBrand.add(fk)
      afterBrand.push(x)
      continue
    }
    if (seenBrand.has(x.bKey)) continue
    seenBrand.add(x.bKey)
    afterBrand.push(x)
  }

  afterBrand.sort((a, b) => a.pid - b.pid)
  const seenImg = new Set()
  const out = []
  for (const x of afterBrand) {
    const { p, imgKey } = x
    if (imgKey != null) {
      if (seenImg.has(imgKey)) continue
      seenImg.add(imgKey)
    }
    out.push(p)
  }

  return out.sort((a, b) => {
    const an = a?.name || a?.display_name || ''
    const bn = b?.name || b?.display_name || ''
    return an.localeCompare(bn, undefined, { sensitivity: 'base' })
  })
}
