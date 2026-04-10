/**
 * Menyamakan bentuk respons GET /info agar frontend selalu punya `config.logo` / `config.title`
 * meski backend menaruh field di root, di `data`, atau di `config.general`.
 */
export function normalizeWebsiteInfoResponse(raw) {
  if (raw == null || typeof raw !== 'object') return raw

  let root = raw
  if (raw.data != null && typeof raw.data === 'object' && !Array.isArray(raw.data)) {
    root = raw.data
  }
  if (
    root.data != null &&
    typeof root.data === 'object' &&
    !Array.isArray(root.data) &&
    root.config == null &&
    root.data.config != null
  ) {
    root = root.data
  }

  const merged = { ...root }
  let cfg =
    merged.config != null && typeof merged.config === 'object' && !Array.isArray(merged.config)
      ? { ...merged.config }
      : {}

  const general = cfg.general
  if (general != null && typeof general === 'object') {
    if ((cfg.logo == null || cfg.logo === '') && general.logo != null && general.logo !== '') {
      cfg.logo = general.logo
    }
    if ((cfg.title == null || cfg.title === '') && general.title != null && general.title !== '') {
      cfg.title = general.title
    }
  }

  const rootLogo = merged.logo ?? merged.site_logo ?? merged.logo_url ?? merged.logoUrl
  const rootTitle = merged.title ?? merged.site_title ?? merged.site_name

  if ((cfg.logo == null || cfg.logo === '') && rootLogo != null && rootLogo !== '') {
    cfg.logo = rootLogo
  }
  if ((cfg.title == null || cfg.title === '') && rootTitle != null && rootTitle !== '') {
    cfg.title = rootTitle
  }

  merged.config = cfg
  return merged
}
