import { publicAssetUrl } from './publicAssetUrl.js'
import { normalizeImageUrl } from './normalizeImageUrl.js'

const GRADIENTS = [
  'from-[#1a1a40] via-[#15153a] to-[#0d0d25]',
  'from-[#1a2a1a] via-[#15251a] to-[#0d1a0d]',
  'from-[#2a1a1a] via-[#251515] to-[#1a0d0d]',
]

/** Banner statis di `public/banners` — dipakai bila `config.banner` kosong / tidak ada gambar valid */
const DEFAULT_CONFIG_BANNERS = [
  {
    id: 'default-banner-1',
    image: '/banners/banner-1.webp',
    link: '/promo',
    title_line1: 'PROMO',
    description: 'Bonus dan promo menarik setiap hari.',
    tag: '✨ PROMO',
  },
]

/**
 * Map satu array item banner API → slide PromoBanner (bukan fallback).
 * Item tanpa `image` valid di-skip.
 */
function mapBannerItemsToSlides(apiBanners, siteTitle) {
  if (!Array.isArray(apiBanners) || apiBanners.length === 0) return []

  const brand = String(siteTitle || 'PROMO').slice(0, 80)

  return apiBanners
    .map((b, i) => {
      const rawImg = normalizeImageUrl(b.image)
      if (!rawImg) return null
      const path = rawImg
      const linkRaw = b.link != null ? String(b.link).trim() : ''
      const link = linkRaw !== '' ? linkRaw : '/promo'

      const titleLine1 = (b.title_line1 ?? b.titleLine1 ?? 'PROMO').toString().slice(0, 100)
      const titleLine2 = (b.title_line2 ?? b.titleLine2 ?? brand).toString().slice(0, 100)
      const descRaw = b.description != null ? String(b.description).trim() : ''
      const description = descRaw !== '' ? descRaw : ' '

      const tag = (b.tag != null ? String(b.tag) : '✨ PROMO').slice(0, 80)
      const gradient =
        typeof b.gradient === 'string' && b.gradient.trim() !== ''
          ? b.gradient.trim()
          : GRADIENTS[i % GRADIENTS.length]

      return {
        id: String(b.id ?? `banner-${i}`),
        image: publicAssetUrl(path),
        link,
        titleLine1,
        titleLine2,
        description,
        tag,
        gradient,
      }
    })
    .filter(Boolean)
}

/**
 * Map `config.banner` dari GET /info → slide PromoBanner di home.
 * OpenAPI: { id, image } + optional link. Field opsional teks: title_line1, title_line2, description, tag, gradient.
 * Bila array kosong atau tidak ada satu pun gambar valid → pakai banner default (`public/banners/banner-1.webp`).
 */
export function mapConfigBannersToPromoSlides(apiBanners, siteTitle = '') {
  const fromApi = mapBannerItemsToSlides(apiBanners, siteTitle)
  if (fromApi.length > 0) return fromApi
  return mapBannerItemsToSlides(DEFAULT_CONFIG_BANNERS, siteTitle)
}
