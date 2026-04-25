import { getInfo, getWebsite, clearPublicGetResponseMemo } from '../services/api'
import { WEBSITE_CONTACT_RESPONSE_DUMMY } from '../config/websiteContactDefaults.js'

/**
 * Satu kali jaringan untuk GET /info + GET /website (baca publik).
 * Memakai cache modul supaya React StrictMode (double mount dev) tidak menggandakan request.
 * Panggil dengan `{ reset: true }` sebelum muat ulang paksa (mis. setelah admin ubah config).
 */
let cachedBundle = null
let inflightPromise = null
/** Naik saat reset — muatan lama yang selesai setelah reset tidak menimpa cache. */
let activeBundleGen = 0

export async function loadWebsitePublicBundle({ reset = false } = {}) {
  if (reset) {
    clearPublicGetResponseMemo()
    activeBundleGen++
    cachedBundle = null
    const pending = inflightPromise
    if (pending) {
      try {
        await pending
      } catch {
        /* abaikan kegagalan load sebelumnya */
      }
    }
    inflightPromise = null
    cachedBundle = null
  }
  if (cachedBundle) return cachedBundle
  let p = inflightPromise
  if (p) return p

  const gen = activeBundleGen
  p = (async () => {
    try {
      const [infoData, configData] = await Promise.all([getInfo(), getWebsite()])
      const raw = configData && typeof configData === 'object' ? configData : {}
      const fromApi = raw.contact && typeof raw.contact === 'object' ? raw.contact : {}
      const config = {
        ...raw,
        contact: { ...WEBSITE_CONTACT_RESPONSE_DUMMY, ...fromApi },
      }
      const bundle = {
        notification: infoData?.notification || [],
        lottery_result: infoData?.lottery_result || [],
        withdraw_list: infoData?.withdraw_list || [],
        min_withdraw: infoData?.min_withdraw,
        config,
      }
      if (gen === activeBundleGen) {
        cachedBundle = bundle
      }
      return bundle
    } finally {
      if (inflightPromise === p) inflightPromise = null
    }
  })()

  inflightPromise = p
  return inflightPromise
}
