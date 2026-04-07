/**
 * Transform API Provider[] → props yang dipakai ProviderCard / modal.
 * Kontrak API: { provider_id, name, image, badge? }
 */
export function transformProviderData(apiData) {
  if (!apiData || apiData.length === 0) return []

  return apiData.map((provider) => ({
    id: provider.provider_id,
    provider_id: provider.provider_id,
    name: provider.name,
    display_name: provider.name?.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    logoImg: provider.image ?? null,
    characterImg: provider.image ?? null,
    logoAlt: provider.name,
    badge: provider.badge ?? null,
  }))
}
