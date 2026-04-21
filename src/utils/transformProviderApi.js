import { normalizeImageUrl } from './normalizeImageUrl.js'
import { providerAssetUrl } from './publicAssetUrl.js'

/**
 * Transform API Provider[] → props yang dipakai ProviderCard / modal.
 * Kontrak API: { provider_id, name, image, badge? }
 */
export function transformProviderData(apiData) {
  if (!apiData || apiData.length === 0) return []

  return apiData.map((provider) => {
    const raw = normalizeImageUrl(provider.image)
    const img = raw == null ? null : providerAssetUrl(raw)
    return {
      id: provider.provider_id,
      provider_id: provider.provider_id,
      name: provider.name,
      display_name: provider.name?.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      logoImg: img,
      characterImg: img,
      logoAlt: provider.name,
      badge: provider.badge ?? null,
    }
  })
}
