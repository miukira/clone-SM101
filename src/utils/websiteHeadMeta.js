const META_ATTR = 'data-sm101-website-meta'

function clearInjectedMeta() {
  document.querySelectorAll(`[${META_ATTR}]`).forEach((el) => el.remove())
}

/**
 * Sisipkan meta/link dari config API ke document.head.
 * Hanya elemen <meta> dan <link> dari string meta_tag (HTML dari API).
 */
export function syncWebsiteHeadMeta(config) {
  clearInjectedMeta()
  if (!config || typeof config !== 'object') {
    return clearInjectedMeta
  }

  const mark = (el) => {
    el.setAttribute(META_ATTR, '1')
    document.head.appendChild(el)
  }

  if (config.google_verification) {
    const m = document.createElement('meta')
    m.name = 'google-site-verification'
    m.content = String(config.google_verification)
    mark(m)
  }

  const tags = config.meta_tag
  if (Array.isArray(tags) && tags.length > 0) {
    const html = tags.filter(Boolean).join('')
    if (html.trim()) {
      try {
        const doc = new DOMParser().parseFromString(`<head>${html}</head>`, 'text/html')
        doc.head.querySelectorAll('meta, link').forEach((node) => {
          mark(node.cloneNode(true))
        })
      } catch {
        /* ignore parse errors */
      }
    }
  }

  return clearInjectedMeta
}
