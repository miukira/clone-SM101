import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  extractContactUrl,
  getContactMenuItems,
  getContactPanelRows,
  getContactUserAction,
  getOrderedContactMenuEntries,
  normalizeContactLinks,
} from '../src/utils/websiteContact.js'

describe('websiteContact', () => {
  it('menerima string URL, mengabaikan #', () => {
    assert.equal(extractContactUrl('https://wa.me/1'), 'https://wa.me/1')
    assert.equal(extractContactUrl('#'), null)
    assert.equal(extractContactUrl(''), null)
  })

  it('mendukung bentuk lama { link }', () => {
    assert.equal(
      extractContactUrl({ link: 'https://t.me/x', icon: null }),
      'https://t.me/x',
    )
  })

  it('normalize + urutan menu', () => {
    const c = { whatsapp: 'https://wa.me/1', telegram: '', testimoni: 'https://google.com' }
    const n = normalizeContactLinks(c)
    assert.equal(n.telegram, null)
    const o = getOrderedContactMenuEntries(n)
    assert.equal(o.length, 2)
    assert.equal(o[0].id, 'whatsapp')
    assert.equal(o[1].id, 'testimoni')
  })

  it('getContactUserAction: satu link → open', () => {
    const a = getContactUserAction({ whatsapp: 'https://wa.me/1' })
    assert.equal(a.type, 'open')
    assert.equal(a.href, 'https://wa.me/1')
  })

  it('getContactUserAction: dua link → menu', () => {
    const a = getContactUserAction({ whatsapp: 'https://wa.me/1', telegram: 'https://t.me/x' })
    assert.equal(a.type, 'menu')
    assert.equal(a.entries.length, 2)
  })

  it('getContactPanelRows: tiga baris, # dan kosong = hash/empty', () => {
    const rows = getContactPanelRows({ whatsapp: '#', telegram: '', testimoni: 'https://x.com' })
    assert.equal(rows.length, 3)
    assert.equal(rows[0].state, 'hash')
    assert.equal(rows[1].state, 'empty')
    assert.equal(rows[2].state, 'ok')
    assert.equal(rows[2].href, 'https://x.com')
  })

  it('getContactMenuItems: tiga kunci (whatsapp, telegram, testimoni)', () => {
    const m = getContactMenuItems({
      whatsapp: 'https://wa.me/1',
      telegram: '',
      testimoni: 'https://fbe.com',
    })
    assert.equal(m.length, 3)
    assert.equal(m[0].key, 'whatsapp')
    assert.equal(m[0].label, 'WhatsApp')
    assert.equal(m[0].href, 'https://wa.me/1')
    assert.equal(m[1].key, 'telegram')
    assert.equal(m[1].href, null)
    assert.equal(m[2].key, 'testimoni')
    assert.equal(m[2].label, 'Testimoni')
    assert.equal(m[2].href, 'https://fbe.com')
  })
})
