import { normalizeImageUrl } from './normalizeImageUrl.js'

/**
 * Transform API Provider[] → props yang dipakai ProviderCard / modal.
 * Kontrak API: { provider_id, name, image, badge? }
 *
 * `image` tidak di-resolve ke URL absolut di sini — ProviderCard / modal memanggil
 * providerAssetUrl() saat render agar basis CDN runtime (GET /website) sempat dipakai.
 */
export function transformProviderData(apiData) {
  if (!apiData || apiData.length === 0) return []

  return apiData.map((provider) => {
    const raw = normalizeImageUrl(provider.image)
    return {
      id: provider.provider_id,
      provider_id: provider.provider_id,
      name: provider.name,
      display_name: provider.name?.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      logoImg: raw,
      characterImg: raw,
      logoAlt: provider.name,
      badge: provider.badge ?? null,
    }
  })
}
