/**
 * Menyamakan bentuk respons GET /info agar frontend selalu punya
 * `config.logo` / `config.title` / `config.name`
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
    if ((cfg.name == null || cfg.name === '') && general.name != null && general.name !== '') {
      cfg.name = general.name
    }
  }

  const rootLogo = merged.logo ?? merged.site_logo ?? merged.logo_url ?? merged.logoUrl
  const rootTitle = merged.title ?? merged.site_title ?? merged.site_name
  const rootName = merged.name ?? merged.site_name

  if ((cfg.logo == null || cfg.logo === '') && rootLogo != null && rootLogo !== '') {
    cfg.logo = rootLogo
  }
  if ((cfg.title == null || cfg.title === '') && rootTitle != null && rootTitle !== '') {
    cfg.title = rootTitle
  }
  if ((cfg.name == null || cfg.name === '') && rootName != null && rootName !== '') {
    cfg.name = rootName
  }

  merged.config = cfg

  const m = merged.min_withdraw
  const n = m == null || m === '' ? NaN : Number(m)
  if (Number.isFinite(n) && n > 0) {
    merged.min_withdraw = n
  } else {
    delete merged.min_withdraw
  }

  return merged
}
